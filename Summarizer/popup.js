  chrome.runtime.onMessage.addListener((message) => {
    if (message.summary) {
      document.getElementById("summary").textContent = message.summary;
    }
  });
  