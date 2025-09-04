import { store } from '../store';
import { addToast } from '../store/slices/uiSlice';

class Toast {
  static success(message, title = 'Success') {
    store.dispatch(addToast({
      type: 'success',
      title,
      message,
    }));
  }

  static error(message, title = 'Error') {
    store.dispatch(addToast({
      type: 'error',
      title,
      message,
    }));
  }

  static warning(message, title = 'Warning') {
    store.dispatch(addToast({
      type: 'warning',
      title,
      message,
    }));
  }

  static info(message, title = 'Info') {
    store.dispatch(addToast({
      type: 'info',
      title,
      message,
    }));
  }
}

export default Toast;
