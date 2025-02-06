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

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "textSelected") {
        console.log("Selected Text:", message.text);
        summarizeAndAnalyze(message.text)
            .then(summary => {
                sendResponse({ summary: `<span>${summary}</span>` });
            })
            .catch(error => {
                sendResponse({ error: error.message });
            });
        return true;
    }
});

  
  