const axios = require('axios');

const OLLAMA_API_URL = "http://127.0.0.1:11434/api/generate";  // Make sure Ollama is running

async function promptOllama(model, promptText) {
    try {
        const response = await axios.post(OLLAMA_API_URL, {
            model: model,  // e.g., "llama3", "mistral", or other installed models
            prompt: promptText,
            stream: false,  // Set to true if you want streaming responses
        });

        return response.data.response;  // Extract response from Ollama
    } catch (error) {
        console.error("❌ Error communicating with Ollama:", error.message);
        return null;
    }
}

// Example usage:
(async () => {
    const model = "llama3";  // Change this to your preferred model
    const question = "yo what is AI Testing";
    const answer = await promptOllama(model, question);
    console.log("🧠 Ollama says:", answer);
})();
