import React from 'react';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import { selectToasts, removeToast } from '../../../store/slices/uiSlice';
import Toast from './Toast';

const ToastContainer = () => {
  const dispatch = useAppDispatch();
  const toasts = useAppSelector(selectToasts);

  const handleClose = (id) => {
    dispatch(removeToast(id));
  };

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          type={toast.type}
          title={toast.title}
          message={toast.message}
          duration={toast.duration}
          onClose={handleClose}
        />
      ))}
    </div>
  );
};

export default ToastContainer; 