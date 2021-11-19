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

async function main() {
  const title = getCardTitle();
  const [cardId] = location.pathname.split('/').reverse();
  const text = `[${cardId}] ${title}`;
  const link = location.href;

  await writeToClipboard(text, link);
}

main();
