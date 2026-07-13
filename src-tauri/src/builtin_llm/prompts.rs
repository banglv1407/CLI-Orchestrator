pub fn rewrite_query(input: &str) -> String {
    format!(
        "Below is an instruction that describes a task. Write a response that appropriately completes the request.

### Instruction:
Rewrite the following user request to make it clearer, more specific, and easier for a command-line assistant to understand. Keep the original meaning but improve clarity. Do not write any explanations, just output the rewritten query.

Query: \"{}\"

### Response:
",
        input
    )
}

pub fn suggest_command(description: &str, context: Option<&str>) -> String {
    let context_str = match context {
        Some(ctx) => format!("\nContext: {}", ctx),
        None => String::new(),
    };
    format!(
        "Below is an instruction that describes a task. Write a response that appropriately completes the request.

### Instruction:
Suggest a command-line prompt or shell command that performs the described task.{}\nTask Description: \"{}\"\n\nOnly output the suggested command or instruction directly. No explanation, no comments, no markdown code block backticks.

### Response:
",
        context_str, description
    )
}

pub fn summarize(text: &str) -> String {
    format!(
        "Below is an instruction that describes a task. Write a response that appropriately completes the request.

### Instruction:
Summarize the following terminal output, logs, or text in a concise and clear manner. Focus on errors, warnings, and key events. Keep it short.

Text to summarize:
\"\"\"
{}
\"\"\"

### Response:
",
        text
    )
}

pub fn generate_title(content: &str) -> String {
    format!(
        "Below is an instruction that describes a task. Write a response that appropriately completes the request.

### Instruction:
Generate a very short, concise title (max 5 words) for the following text. Do not put quotes around the title.

Text:
\"\"\"
{}
\"\"\"

### Response:
",
        content
    )
}

pub fn general_chat(system_prompt: &str, user_message: &str) -> String {
    let sys_str = if system_prompt.is_empty() {
        "You are an intelligent terminal companion helping developers.".to_string()
    } else {
        system_prompt.to_string()
    };
    format!(
        "Below is an instruction that describes a task. Write a response that appropriately completes the request.

### Instruction:
System: {}

User Message: {}

### Response:
",
        sys_str, user_message
    )
}
