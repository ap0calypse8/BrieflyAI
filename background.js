import { API_KEY } from './config.js';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "summarize") {
    summarizeText(request.text)
      .then(summary => sendResponse({summary: summary}))
      .catch(error => sendResponse({error: error.message}));
    return true;  // Indicates we will send a response asynchronously
  }
});

async function summarizeText(text) {
  const response = await fetch('https://api.cohere.ai/v1/summarize', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: text,
      length: 'short',
      format: 'paragraph',
      model: 'summarize-xlarge',
      additional_command: 'Summarize the following text concisely:'
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to summarize text');
  }

  const data = await response.json();
  return data.summary;
}