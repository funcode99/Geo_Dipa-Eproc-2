import React from 'react';
import { Snackbar } from '@material-ui/core';

const useToast = () => {
  const [visible, setVisible] = React.useState(false);
  const [toastMessage, setMessage] = React.useState('');

  const setToast = React.useCallback(
    (message) => {
      setMessage(message);
      setVisible(true);
    },
    [setVisible, setMessage]
  );

  const Toast = () => {
    return (
      <Snackbar
        open={visible}
        onClose={() => setVisible(false)}
        autoHideDuration={1500}
        message={toastMessage}
        style={{ width: '90%' }}
      />
    );
  };

  return [Toast, setToast];
};

export default useToast;
