chrome.runtime.onConnect.addListener((port) => {
    console.assert(port.name === "content-script");

    port.onMessage.addListener((message) => {
        if (message.action === "textSelected") {
            console.log("Selected Text:", message.text);
            summarizeAndAnalyze(message.text)
                .then(summary => {
                    port.postMessage({ summary: `<span>${summary}</span>` });
                })
                .catch(error => {
                    port.postMessage({ error: error.message });
                });
        }
    });
});

async function summarizeAndAnalyze(text) {
    try {
        const response = await fetch("https://summarizer-mvfb.onrender.com/analyze", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ text: text }),
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data.summary;
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}