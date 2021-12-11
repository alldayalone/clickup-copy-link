(async () => {
  class AppError extends Error {
    static NO_TASK_SELECTED = 'Select some task or go to the task page';
    static CLIPBOARD_PARSE_FAIL = 'Copy to clipboard task name, url and ID';
  }

  function buildHtmlLink(taskDetail) {
    return `<a href="${taskDetail.link}"><span>${buildText(taskDetail)}</span></a>`;
  }

  function buildText({ id, title }) {
    return `[${id}] ${title}`;
  }

  async function writeToClipboard(taskDetails) {
    const textBlob = new Blob([taskDetails.map(buildText).join('\n')], { type: 'text/plain' });
    const htmlBlob = new Blob([taskDetails.map(buildHtmlLink).join('<br>')], { type: 'text/html' });

    await navigator.clipboard.write([
      new ClipboardItem({
        [textBlob.type]: textBlob,
        [htmlBlob.type]: htmlBlob
      })
    ]);
  }

  async function getTaskDetails() {
    if (location.href.match(/app\.clickup\.com\/t/)) {
      return getSingleTaskDetails();
    }

    return getTaskDetailsFromClipboard();
  }

  function getSingleTaskDetails() {
    const title = document.querySelector(".task-name__overlay").textContent;
    const [id] = location.pathname.split('/').reverse();
    const link = location.href;

    return [{ title, id, link }];
  }

  // This approach is not working for long lists of tasks
  function getMultipleTaskDetails() {
    const taskNodes = document.querySelectorAll('.lv-task_selected .cu-dashboard-board-card__clickable');

    return Array.from(taskNodes).map(task => {
      const title = task.querySelector(".cu-panel-board__clickable-name").textContent;
      const id = task.querySelector('.cu-panel-board__footer_left-taskid').textContent;
      const boardId = location.pathname.split('/')[1];
      const link = `${location.origin}/t/${boardId}/${id}`;

      return { title, id, link }
    });
  }

  async function getTaskDetailsFromClipboard() {
    const clipboardText = await navigator.clipboard.readText();
    const clipboardTasks = clipboardText.split('\n').map(clipboardLine => clipboardLine.split('\t'));

    return clipboardTasks.map(([title, link, id]) => {
      if (!title || !link || !id) {
        throw new AppError(AppError.CLIPBOARD_PARSE_FAIL);
      }

      return { title, link, id };
    });
  }

  try {
    const taskDetails = await getTaskDetails()

    if (!taskDetails.length) {
      throw new AppError(AppError.NO_TASK_SELECTED);
    }

    await writeToClipboard(taskDetails);
  } catch (error) {
    chrome.runtime.sendMessage({ type: 'result', result: 'failure' });

    // Clipboard API is only available when document is focused
    if (error.message.match('Document is not focused')) {
      alert('Focus window and try again');
    } else if (error instanceof AppError) {
      alert(error.message);
    } else {
      alert('Could not copy beause of unknown error :(');
      console.error('Unexpected error from Clickup Copy extension:', error);
    }

    return;
  }

  chrome.runtime.sendMessage({ type: 'result', result: 'success' });
})();
