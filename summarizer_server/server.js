const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());

app.post('/analyze', async (req, res) => {
    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{
                    role: "user",
                    content: `Summarize this privacy policy text. make sure you response beneath 290 tokens, and explain as if you're talking to a 10 year old. and response in korean!!: "${req.body.text}". Also identify if it contains problematic clauses or is out of compliance with GDPR or other laws, and tell it in korean.`
                }],
                max_tokens: 300,
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