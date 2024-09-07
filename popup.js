document.getElementById('summarizeBtn').addEventListener('click', () => {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.scripting.executeScript({
      target: {tabId: tabs[0].id},
      function: getSelectedText,
    }, (results) => {
      if (chrome.runtime.lastError || !results || !results[0]) {
        document.getElementById('result').textContent = 'Error: Could not get selected text';
        return;
      }

      const selectedText = results[0].result;
      if (!selectedText) {
        document.getElementById('result').textContent = 'Please select some text to summarize';
        return;
      }

      chrome.runtime.sendMessage({action: "summarize", text: selectedText}, (response) => {
        if (response.error) {
          document.getElementById('result').textContent = `Error: ${response.error}`;
        } else {
          document.getElementById('result').textContent = response.summary;
        }
      });
    });
  });
});

function getSelectedText() {
  return window.getSelection().toString();
}