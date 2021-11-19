chrome.action.onClicked.addListener(tab => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['src/content.js']
  });
});

chrome.runtime.onMessage.addListener(function (message) {
  if (message.type === 'result' && message.result === 'success') {
    chrome.action.setBadgeBackgroundColor({ color: '#00bf00' });
    chrome.action.setBadgeText({ text: "✓" });
    setTimeout(() => {
      chrome.action.setBadgeText({ text: "" });
    }, 3000);
  }

  if (message.type === 'result' && message.result === 'failure') {
    chrome.action.setBadgeBackgroundColor({ color: '#eb0001' });
    chrome.action.setBadgeText({ text: "✗" });
    setTimeout(() => {
      chrome.action.setBadgeText({ text: "" });
    }, 3000);
  }
});