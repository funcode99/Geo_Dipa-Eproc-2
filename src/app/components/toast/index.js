import React from "react";
import { Snackbar } from "@material-ui/core";

const useToast = (props) => {
  const [visible, setVisible] = React.useState(false);
  const [toastMessage, setMessage] = React.useState("");
  const [timeToast, setTimeToast] = React.useState(1500);

  const setToast = React.useCallback(
    (message, time) => {
      setMessage(message);
      setVisible(true);
      if (!isNaN(time)) setTimeToast(time);
    },
    [setVisible, setMessage]
  );

  const Toast = () => {
    return (
      <Snackbar
        open={visible}
        onClose={() => setVisible(false)}
        autoHideDuration={timeToast}
        message={toastMessage}
        style={{ width: "90%" }}
      />
    );
  };

  return [Toast, setToast];
};

export default useToast;
