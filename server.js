app.post('/analyze', async (req, res) => {
    try {
        console.log("Received request:", req.body);
        
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            throw new Error("Missing OpenAI API Key. Set it in environment variables.");
        }

        console.log("API Key is present, making request to OpenAI...");

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

        console.log("Received response from OpenAI:", response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`OpenAI error: ${errorText}`);
        }

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
