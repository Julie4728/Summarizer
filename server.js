const express = require('express');
const cors = require('cors');
global.fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors({
    origin: '*', // Allow requests from any origin (you can restrict this if needed)
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Check if the prompt file exists
const promptPath = path.join(__dirname, 'prompts', 'summarizer_prompt.txt');
if (!fs.existsSync(promptPath)) {
    console.error("Error: prompt file not found at", promptPath);
    process.exit(1);
}

const promptTemplate = fs.readFileSync(promptPath, 'utf-8');

app.post('/analyze', async (req, res) => {
    try {
        console.log("Received request:", req.body);

        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            throw new Error("Missing OpenAI API Key. Set it in environment variables.");
        }

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: "gpt-4",
                messages: [{
                    role: "user",
                    content: promptTemplate.replace('${text}', req.body.text)
                }],
                max_tokens: 2000,
            }),
        });

        const result = await response.json();
        console.log("OpenAI API Response:", result);

        if (result.error) {
            throw new Error(result.error.message);
        }

        const summary = result.choices?.[0]?.message?.content || "No summary generated";
        res.json({ summary });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
