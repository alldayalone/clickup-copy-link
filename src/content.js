function getCardTitle() {
  const taskNameElement = document.querySelector(".task-name__overlay");

  return taskNameElement.textContent;
}

function buildHtmlLink(text, link) {
  return `<a href="${link}"><span>${text}</span></a>`;
}

async function writeToClipboard(text, link) {
  const textBlob = new Blob([text], { type: 'text/plain' });
  const htmlBlob = new Blob([buildHtmlLink(text, link)], { type: 'text/html' });

  await navigator.clipboard.write([
    new ClipboardItem({
      [textBlob.type]: textBlob,
      [htmlBlob.type]: htmlBlob
    })
  ]);
}

chrome.runtime.onMessage.addListener(async (message) => {
  if (message === 'copy') {
    const title = getCardTitle();
    const [cardId] = location.pathname.split('/').reverse();
    const text = `[${cardId}] ${title}`;
    const link = location.href;

    window.addEventListener('focus', () => {
      writeToClipboard(text, link)
    }, { once: true });
  }
})
