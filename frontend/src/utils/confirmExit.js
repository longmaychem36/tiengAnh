export const UNSAVED_PROGRESS_EXIT_MESSAGE =
  'Bạn có chắc muốn thoát không? Tiến trình hiện tại của bạn sẽ không được lưu nữa.';

export const CONFIRM_EXIT_EVENT = 'lingo:confirm-exit';

export function confirmUnsavedProgressExit() {
  if (typeof window === 'undefined') return Promise.resolve(true);

  return new Promise((resolve) => {
    const event = new CustomEvent(CONFIRM_EXIT_EVENT, {
      cancelable: true,
      detail: {
        message: UNSAVED_PROGRESS_EXIT_MESSAGE,
        resolve
      }
    });

    const handledByApp = !window.dispatchEvent(event);
    if (!handledByApp) {
      resolve(window.confirm(UNSAVED_PROGRESS_EXIT_MESSAGE));
    }
  });
}
