function buildHtmlLink({ text, link }) {
  return `<a href="${link}"><span>${text}</span></a>`;
}

async function writeToClipboard(taskDetails) {
  const textBlob = new Blob([taskDetails.map(c => c.text).join('\n')], { type: 'text/plain' });
  const htmlBlob = new Blob([taskDetails.map(buildHtmlLink).join('<br>')], { type: 'text/html' });

  await navigator.clipboard.write([
    new ClipboardItem({
      [textBlob.type]: textBlob,
      [htmlBlob.type]: htmlBlob
    })
  ]);
}

function getTaskDetails() {
  if (location.href.match(/app\.clickup\.com\/t/)) {
    return getSingleTaskDetails();
  }

  return getMultipleTaskDetails();
}

function getSingleTaskDetails() {
  const title = document.querySelector(".task-name__overlay").textContent;
  const [taskId] = location.pathname.split('/').reverse();
  const text = `[${taskId}] ${title}`;
  const link = location.href;

  return [{ text, link }];
}

function getMultipleTaskDetails() {
  const taskNodes = document.querySelectorAll('.lv-task_selected');

  return Array.from(taskNodes).map(task => {
    const title = task.querySelector(".cu-panel-board__clickable-name").textContent;
    const taskId = task.querySelector('.cu-panel-board__footer_left-taskid').textContent;
    const boardId = location.pathname.split('/')[1];
    const text = `[${taskId}] ${title}`;
    const link = `${location.origin}/t/${boardId}/${taskId}`;

    return { text, link }
  });
}

async function main() {
  try {
    const taskDetails = getTaskDetails()

    if (!taskDetails.length) {
      throw new Error('No tasks selected');
    }

    await writeToClipboard(taskDetails);
  } catch (error) {
    chrome.runtime.sendMessage({ type: 'result', result: 'failure' });

    // Clipboard API is only available when document is focused
    if (error.message.match('Document is not focused')) {
      alert('Focus window and try again');
    } else if (error.message.match('No tasks selected')) {
      alert('Select some task or go to the task page');
    } else {
      console.error('Unexpected error from Clickup Copy extension:', error);
    }

    return;
  }

  chrome.runtime.sendMessage({ type: 'result', result: 'success' });
};

main();
