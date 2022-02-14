import React from "react";
import _ from "lodash";
import { Snackbar } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import PropTypes from "prop-types";

function Alert(props) {
  return (
    <div style={{ width: "100%" }}>
      <MuiAlert elevation={6} variant="filled" {...props} />
    </div>
  );
}

const ToastSession = (props) => {
  const [state, setState] = React.useState({
    visible: false,
    msg: "",
    time: 1500,
    severity: "error",
  });

  const setToast = React.useCallback(
    (message, severity, custTime) => {
      setState((prev) => {
        return {
          visible: true,
          msg: _.isEmpty(message) ? prev.msg : message,
          severity: severity ? severity : prev.severity,
          time: custTime ? custTime : prev.time,
        };
      });
    },
    [setState]
  );

  React.useEffect(() => {
    const { message, severity, time } = props;
    if (!_.isEmpty(message)) setToast(message, severity, time);
  }, [props]);

  return (
    <Snackbar
      open={state.visible}
      onClose={() => setState((prev) => ({ ...prev, visible: false }))}
      autoHideDuration={state.time}
      //   message={state.msg}
      style={{ width: "400px" }}
    >
      <Alert severity={state.severity}>{state.msg}</Alert>
    </Snackbar>
  );
};

ToastSession.defaultProps = {
  message: "",
  time: 0,
};

ToastSession.propTypes = {
  message: PropTypes.string,
  time: PropTypes.number,
};

export default ToastSession;
