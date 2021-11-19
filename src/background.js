chrome.action.onClicked.addListener(tab => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['src/content.js']
  });
  chrome.action.setBadgeBackgroundColor({ color: '#00bf00' });
  chrome.action.setBadgeText({ text: "✓" });
});