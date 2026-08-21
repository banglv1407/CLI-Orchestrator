use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LlmChatMessage {
    pub role: String,
    pub content: String,
}

pub fn format_chat_prompt(messages: &[LlmChatMessage], system_prompt: Option<&str>) -> String {
    let mut prompt = String::new();
    if let Some(sys) = system_prompt {
        if !sys.is_empty() {
            prompt.push_str(&format!("<|im_start|>system\n{}<|im_end|>\n", sys));
        }
    }
    for msg in messages {
        prompt.push_str(&format!(
            "<|im_start|>{}\n{}<|im_end|>\n",
            msg.role, msg.content
        ));
    }
    prompt.push_str("<|im_start|>assistant\n");
    prompt
}
