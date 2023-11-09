// Saves options to chrome.storage
const saveOptions = () => {
    const format = document.getElementById('format').value;
  
    chrome.storage.sync.set(
      { format },
      () => {
        // Update status to let user know options were saved.
        const status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(() => {
          status.textContent = '';
        }, 750);
      }
    );
  };
  
  // Restores select box and checkbox state using the preferences
  // stored in chrome.storage.
  const restoreOptions = () => {
    chrome.storage.sync.get(
      { format: '[{id}] {title}' },
      (items) => {
        document.getElementById('format').value = items.format;
      }
    );
  };
  
  document.addEventListener('DOMContentLoaded', restoreOptions);
  document.getElementById('save').addEventListener('click', saveOptions);