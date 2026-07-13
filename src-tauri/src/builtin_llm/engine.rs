#[cfg(feature = "builtin-llm")]
use candle_core::{Device, Tensor, DType};
#[cfg(feature = "builtin-llm")]
use candle_transformers::models::quantized_llama::ModelWeights;
#[cfg(feature = "builtin-llm")]
use candle_transformers::generation::LogitsProcessor;
#[cfg(feature = "builtin-llm")]
use tokenizers::Tokenizer;
#[cfg(feature = "builtin-llm")]
use std::fs::File;
#[cfg(feature = "builtin-llm")]
use std::path::{Path, PathBuf};

use crate::builtin_llm::config::BuiltinLlmConfig;

#[cfg(feature = "builtin-llm")]
pub struct BuiltinLlmEngine {
    model: Option<ModelWeights>,
    tokenizer: Option<Tokenizer>,
    config: BuiltinLlmConfig,
    device: Device,
    server_process: Option<std::process::Child>,
}

#[cfg(not(feature = "builtin-llm"))]
pub struct BuiltinLlmEngine {
    config: BuiltinLlmConfig,
}

#[derive(serde::Serialize, serde::Deserialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct BuiltinLlmStatus {
    pub loaded: bool,
    pub model_path: Option<String>,
    pub enabled: bool,
}

#[cfg(feature = "builtin-llm")]
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
}

#[cfg(feature = "builtin-llm")]
impl Drop for BuiltinLlmEngine {
    fn drop(&mut self) {
        if let Some(mut child) = self.server_process.take() {
            let _ = child.kill();
        }
    }
}

#[cfg(feature = "builtin-llm")]
impl BuiltinLlmEngine {

    pub fn load_model(&mut self) -> Result<(), String> {
        let model_path_str = self.config.model_path.as_ref()
            .ok_or("No model path configured in settings")?;
        
        let model_path = Path::new(model_path_str);
        if !model_path.exists() {
            return Err(format!("Model file not found at: {}", model_path_str));
        }

        // 1. Find tokenizer.json
        let mut tokenizer_path = None;

        if let Some(ref path) = self.config.tokenizer_path {
            let p = Path::new(path);
            if p.exists() {
                tokenizer_path = Some(p.to_path_buf());
            }
        }

        if tokenizer_path.is_none() {
            // Check same directory as model file
            if let Some(parent) = model_path.parent() {
                let sibling = parent.join("tokenizer.json");
                if sibling.exists() {
                    tokenizer_path = Some(sibling);
                }
            }
        }

        if tokenizer_path.is_none() {
            // Check cached location
            let cache_dir = dirs::config_dir()
                .unwrap_or_else(|| PathBuf::from("."))
                .join("clx");
            let cached = cache_dir.join("tokenizer.json");
            if cached.exists() {
                tokenizer_path = Some(cached);
            } else {
                // Try to download it!
                let urls = [
                    "https://huggingface.co/SupraLabs/Supra-1.5-50M-Instruct-exp/resolve/main/tokenizer.json",
                    "https://huggingface.co/hf-internal-testing/llama-tokenizer/resolve/main/tokenizer.json",
                ];
                
                std::fs::create_dir_all(&cache_dir).ok();
                
                for url in urls {
                    if let Ok(response) = reqwest::blocking::get(url) {
                        if response.status().is_success() {
                            if let Ok(bytes) = response.bytes() {
                                if std::fs::write(&cached, &bytes).is_ok() {
                                    tokenizer_path = Some(cached);
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }

        let tokenizer_path = tokenizer_path.ok_or_else(|| {
            format!(
                "Could not find or download tokenizer.json. Please put tokenizer.json next to the model file ({}) or configure its path in settings.",
                model_path.parent().map(|p| p.to_string_lossy().into_owned()).unwrap_or_default()
            )
        })?;

        // Load Tokenizer
        let tokenizer = Tokenizer::from_file(&tokenizer_path)
            .map_err(|e| format!("Failed to load tokenizer: {}", e))?;

        if self.config.runtime == "llamacpp" {
            let server_exe = self.config.server_path.clone().unwrap_or_else(|| "llama-server".to_string());
            let child = std::process::Command::new(&server_exe)
                .arg("-m")
                .arg(model_path_str)
                .arg("--port")
                .arg(self.config.server_port.to_string())
                .arg("-c")
                .arg("2048")
                .arg("--parallel")
                .arg("1")
                .arg("--threads")
                .arg("4")
                .spawn()
                .map_err(|e| format!("Failed to start llama-server process ({}): {}. Please make sure you have llama-server.exe in your PATH or specify its path in settings.", server_exe, e))?;
            self.server_process = Some(child);
            // Wait for server to bind
            std::thread::sleep(std::time::Duration::from_millis(1500));
            return Ok(());
        }

        // Load Model
        let file = File::open(model_path)
            .map_err(|e| format!("Failed to open model file: {}", e))?;
        
        let mut reader = std::io::BufReader::new(file);
        let gguf_content = candle_core::quantized::gguf_file::Content::read(&mut reader)
            .map_err(|e| format!("Failed to read GGUF content: {}", e))?;

        let model = ModelWeights::from_gguf(gguf_content, &mut reader, &self.device)
            .map_err(|e| format!("Failed to load model weights: {}", e))?;

        self.model = Some(model);
        self.tokenizer = Some(tokenizer);

        Ok(())
    }

    pub fn unload_model(&mut self) {
        if let Some(mut child) = self.server_process.take() {
            let _ = child.kill();
        }
        self.model = None;
        self.tokenizer = None;
    }

    pub fn is_loaded(&self) -> bool {
        self.server_process.is_some() || (self.model.is_some() && self.tokenizer.is_some())
    }

    pub fn update_config(&mut self, config: BuiltinLlmConfig) {
        let model_changed = self.config.model_path != config.model_path
            || self.config.tokenizer_path != config.tokenizer_path
            || self.config.runtime != config.runtime
            || self.config.server_path != config.server_path
            || self.config.server_port != config.server_port;
        
        let disabled = self.config.enabled && !config.enabled;
        
        self.config = config;
        
        if model_changed || disabled {
            self.unload_model();
        }
    }

    pub fn config(&self) -> &BuiltinLlmConfig {
        &self.config
    }

    pub fn generate(&self, prompt: &str, max_tokens: Option<u32>) -> Result<String, String> {
        if self.config.runtime == "llamacpp" {
            let client = reqwest::blocking::Client::builder()
                .timeout(std::time::Duration::from_secs(60))
                .build()
                .map_err(|e| format!("Failed to create HTTP client: {}", e))?;
                
            let url = format!("http://127.0.0.1:{}/completion", self.config.server_port);
            let max_gen_tokens = max_tokens.unwrap_or(self.config.max_tokens);
            
            let body = serde_json::json!({
                "prompt": prompt,
                "n_predict": max_gen_tokens,
                "temperature": self.config.temperature,
                "repeat_penalty": self.config.repeat_penalty,
                "stream": false,
            });
            
            let res = client.post(&url)
                .json(&body)
                .send()
                .map_err(|e| format!("Failed to communicate with llama-server on port {}: {}. Please ensure the server is running.", self.config.server_port, e))?;
                
            let res_json: serde_json::Value = res.json()
                .map_err(|e| format!("Failed to parse llama-server response JSON: {}", e))?;
                
            let content = res_json["content"].as_str()
                .ok_or_else(|| format!("Missing 'content' field in response: {:?}", res_json))?;
                
            return Ok(content.to_string());
        }

        let model = self.model.as_ref().ok_or("Model not loaded")?;
        let tokenizer = self.tokenizer.as_ref().ok_or("Tokenizer not loaded")?;

        let mut model_weights = model.clone(); // ModelWeights has cheap clones or wraps internal state

        let tokens = tokenizer.encode(prompt, true)
            .map_err(|e| format!("Tokenizer encoding error: {}", e))?;
        let prompt_tokens = tokens.get_ids();

        if prompt_tokens.is_empty() {
            return Err("Empty prompt".to_string());
        }

        let max_gen_tokens = max_tokens.unwrap_or(self.config.max_tokens);
        let mut tokens = prompt_tokens.to_vec();
        let mut generated_text = String::new();

        let mut logits_processor = LogitsProcessor::new(
            self.config.seed,
            Some(self.config.temperature),
            None, // top_p
        );

        let eos_token_id = tokenizer.get_vocab(true)
            .get("</s>")
            .copied()
            .or_else(|| {
                tokenizer.get_vocab(true)
                    .get("<|im_end|>")
                    .copied()
            })
            .unwrap_or(2); // fallback to standard llama EOS id

        // Run prompt tokens through the model (prefill)
        let mut logits = Tensor::zeros(&[1, 1], DType::F32, &self.device).unwrap(); // dummy init
        let mut index_pos = 0;

        for (pos, &token) in prompt_tokens.iter().enumerate() {
            let input = Tensor::new(&[token], &self.device)
                .map_err(|e| e.to_string())?
                .unsqueeze(0)
                .map_err(|e| e.to_string())?;
            logits = model_weights.forward(&input, pos)
                .map_err(|e| format!("Model forward error during prefill: {}", e))?;
            index_pos = pos + 1;
        }

        // Apply temperature and sample the first token
        let mut next_token = {
            let logits = logits.squeeze(0).map_err(|e| e.to_string())?;
            let logits = if logits.rank() == 2 {
                logits.squeeze(0).map_err(|e| e.to_string())?
            } else {
                logits
            };
            logits_processor.sample(&logits)
                .map_err(|e| format!("Logits sampling error: {}", e))?
        };

        tokens.push(next_token);
        
        if next_token == eos_token_id {
            return Ok(generated_text);
        }

        if let Ok(text) = tokenizer.decode(&[next_token], true) {
            generated_text.push_str(&text);
        }

        // Generation loop
        for i in 0..max_gen_tokens {
            let input = Tensor::new(&[next_token], &self.device)
                .map_err(|e| e.to_string())?
                .unsqueeze(0)
                .map_err(|e| e.to_string())?;
            
            let l = model_weights.forward(&input, index_pos + i as usize)
                .map_err(|e| format!("Model forward error during generation: {}", e))?;
            
            let l = l.squeeze(0).map_err(|e| e.to_string())?;
            let mut l = if l.rank() == 2 {
                l.squeeze(0).map_err(|e| e.to_string())?
            } else {
                l
            };

            // Apply repetition penalty if configured
            if self.config.repeat_penalty > 1.0 {
                let start_at = tokens.len().saturating_sub(64);
                l = candle_transformers::utils::apply_repeat_penalty(
                    &l,
                    self.config.repeat_penalty,
                    &tokens[start_at..]
                ).map_err(|e| format!("Repeat penalty error: {}", e))?;
            }

            next_token = logits_processor.sample(&l)
                .map_err(|e| format!("Sampling error: {}", e))?;
            
            tokens.push(next_token);

            if next_token == eos_token_id {
                break;
            }

            if let Ok(text) = tokenizer.decode(&[next_token], true) {
                generated_text.push_str(&text);
            }
        }

        Ok(generated_text)
    }

    pub fn status(&self) -> BuiltinLlmStatus {
        BuiltinLlmStatus {
            loaded: self.is_loaded(),
            model_path: self.config.model_path.clone(),
            enabled: self.config.enabled,
        }
    }
}

#[cfg(not(feature = "builtin-llm"))]
#[allow(dead_code)]
impl BuiltinLlmEngine {
    pub fn new(config: BuiltinLlmConfig) -> Self {
        Self { config }
    }

    pub fn load_model(&mut self) -> Result<(), String> {
        Err("Built-in LLM feature is not compiled in this build.".to_string())
    }

    pub fn unload_model(&mut self) {}

    pub fn is_loaded(&self) -> bool {
        false
    }

    pub fn update_config(&mut self, config: BuiltinLlmConfig) {
        self.config = config;
    }

    pub fn config(&self) -> &BuiltinLlmConfig {
        &self.config
    }

    pub fn generate(&self, _prompt: &str, _max_tokens: Option<u32>) -> Result<String, String> {
        Err("Built-in LLM feature is not compiled in this build.".to_string())
    }

    pub fn status(&self) -> BuiltinLlmStatus {
        BuiltinLlmStatus {
            loaded: false,
            model_path: self.config.model_path.clone(),
            enabled: self.config.enabled,
        }
    }
}
