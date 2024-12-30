// Store the event listener function so we can remove it later
const handleMouseUp = () => {
    const selectedText = window.getSelection().toString().trim();
    if (selectedText) {
      try {
        // Remove the event listener after text is selected
        document.removeEventListener("mouseup", handleMouseUp);

        chrome.runtime.sendMessage({ action: "textSelected", text: selectedText }, (response) => {
          if (chrome.runtime.lastError) {
            console.error('Error:', chrome.runtime.lastError);
            return;
          }
          if (response.error) {
            console.error('Error:', response.error);
            return;
          }
          console.log('Summary:', response.summary);
          
          // Create and show popup with summary
          const popup = document.createElement('div');
          popup.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            max-width: 300px;
            padding: 15px;
            background: white;
            border: 1px solid #ccc;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 10000;
            font-family: Arial, sans-serif;
          `;
          
          const formattedText = response.summary.replace(/\n/g, '<br>');
          popup.innerHTML = formattedText;
          
          // Add close button
          const closeButton = document.createElement('button');
          closeButton.textContent = '×';
          closeButton.style.cssText = `
            position: absolute;
            top: 5px;
            right: 5px;
            border: none;
            background: none;
            cursor: pointer;
            font-size: 20px;
          `;
          closeButton.onclick = () => popup.remove();
          
          popup.appendChild(closeButton);
          document.body.appendChild(popup);
        });
      } catch (error) {
        console.log('Extension error:', error);
      }
    }
};

// Add the event listener initially
document.addEventListener("mouseup", handleMouseUp);