const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const fs = require('fs');
const path = require('path');

app.use(cors());
app.use(express.json());


const promptTemplate = fs.readFileSync(
    path.join(__dirname, 'prompts', 'summarizer_prompt.txt'),
    'utf-8'
);

app.post('/analyze', async (req, res) => {
    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
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
        
        
        if (result.error) {
            throw new Error(result.error.message);
        }

        const summary = result.choices?.[0]?.message?.content || "No summary generated";
        res.json({ summary: summary });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));