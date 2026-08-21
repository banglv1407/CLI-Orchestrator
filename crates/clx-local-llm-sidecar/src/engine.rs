use candle_core::{DType, Device, Tensor};
use candle_transformers::generation::LogitsProcessor;
use candle_transformers::models::quantized_llama::ModelWeights;
use std::fs::File;
use std::path::{Path, PathBuf};
use tokenizers::Tokenizer;

use crate::config::BuiltinLlmConfig;

pub struct BuiltinLlmEngine {
    model: Option<ModelWeights>,
    tokenizer: Option<Tokenizer>,
    pub config: BuiltinLlmConfig,
    device: Device,
    server_process: Option<std::process::Child>,
}

#[derive(serde::Serialize, serde::Deserialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct BuiltinLlmStatus {
    pub loaded: bool,
    pub model_path: Option<String>,
    pub enabled: bool,
}

impl Drop for BuiltinLlmEngine {
    fn drop(&mut self) {
        if let Some(mut child) = self.server_process.take() {
            let _ = child.kill();
        }
    }
}

impl BuiltinLlmEngine {
    pub fn new(config: BuiltinLlmConfig) -> Self {
        Self {
            model: None,
            tokenizer: None,
            config,
            device: Device::Cpu,
            server_process: None,
        }
    }

    pub fn status(&self) -> BuiltinLlmStatus {
        BuiltinLlmStatus {
            loaded: self.model.is_some() && self.tokenizer.is_some(),
            model_path: self.config.model_path.clone(),
            enabled: self.config.enabled,
        }
    }

    pub fn load_model(&mut self) -> Result<(), String> {
        let model_path_str = self
            .config
            .model_path
            .as_ref()
            .ok_or("No model path configured in settings")?;

        let model_path = Path::new(model_path_str);
        if !model_path.exists() {
            return Err(format!("Model file not found at: {}", model_path_str));
        }

        let mut tokenizer_path = None;
        if let Some(ref path) = self.config.tokenizer_path {
            let p = Path::new(path);
            if p.exists() {
                tokenizer_path = Some(p.to_path_buf());
            }
        }

        if tokenizer_path.is_none() {
            if let Some(parent) = model_path.parent() {
                let candidate = parent.join("tokenizer.json");
                if candidate.exists() {
                    tokenizer_path = Some(candidate);
                }
            }
        }

        let tok_path = tokenizer_path.ok_or("tokenizer.json not found.")?;
        let tokenizer =
            Tokenizer::from_file(&tok_path).map_err(|e| format!("Failed to load tokenizer: {}", e))?;

        let file =
            File::open(model_path).map_err(|e| format!("Failed to open model file: {}", e))?;
        let mut reader = std::io::BufReader::new(file);
        let gguf_content = candle_core::quantized::gguf_file::Content::read(&mut reader)
            .map_err(|e| format!("Failed to read GGUF content: {}", e))?;

        let model = ModelWeights::from_gguf(gguf_content, &mut reader, &self.device)
            .map_err(|e| format!("Failed to load GGUF weights: {}", e))?;

        self.tokenizer = Some(tokenizer);
        self.model = Some(model);
        Ok(())
    }

    pub fn unload_model(&mut self) {
        self.model = None;
        self.tokenizer = None;
    }

    pub fn generate(&mut self, prompt: &str) -> Result<String, String> {
        if self.model.is_none() || self.tokenizer.is_none() {
            self.load_model()?;
        }

        let tokenizer = self.tokenizer.as_ref().unwrap();
        let model = self.model.as_mut().unwrap();

        let tokens = tokenizer
            .encode(prompt, true)
            .map_err(|e| format!("Tokenization error: {}", e))?
            .get_ids()
            .to_vec();

        let mut logits_processor =
            LogitsProcessor::new(self.config.seed, Some(self.config.temperature), None);

        let mut all_tokens = tokens.clone();
        let mut output_text = String::new();

        let eos_token = tokenizer.token_to_id("<|im_end|>")
            .or_else(|| tokenizer.token_to_id("<|endoftext|>"))
            .unwrap_or(2);

        let input_tensor = Tensor::new(all_tokens.as_slice(), &self.device)
            .map_err(|e| format!("Tensor error: {}", e))?
            .unsqueeze(0)
            .map_err(|e| format!("Unsqueeze error: {}", e))?;

        let logits = model
            .forward(&input_tensor, 0)
            .map_err(|e| format!("Forward error: {}", e))?
            .squeeze(0)
            .map_err(|e| format!("Squeeze error: {}", e))?;

        let mut next_token = logits_processor
            .sample(&logits)
            .map_err(|e| format!("Sampling error: {}", e))?;

        all_tokens.push(next_token);
        if let Ok(piece) = tokenizer.decode(&[next_token], true) {
            output_text.push_str(&piece);
        }

        for i in 0..self.config.max_tokens {
            if next_token == eos_token {
                break;
            }

            let input_tensor = Tensor::new(&[next_token], &self.device)
                .map_err(|e| format!("Tensor error: {}", e))?
                .unsqueeze(0)
                .map_err(|e| format!("Unsqueeze error: {}", e))?;

            let logits = model
                .forward(&input_tensor, all_tokens.len() - 1)
                .map_err(|e| format!("Forward error: {}", e))?
                .squeeze(0)
                .map_err(|e| format!("Squeeze error: {}", e))?;

            next_token = logits_processor
                .sample(&logits)
                .map_err(|e| format!("Sampling error: {}", e))?;

            all_tokens.push(next_token);
            if let Ok(piece) = tokenizer.decode(&[next_token], true) {
                output_text.push_str(&piece);
            }
        }

        Ok(output_text)
    }
}
