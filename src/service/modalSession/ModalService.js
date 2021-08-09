import React from "react";
import ReactDOM from "react-dom";
import ModalSession from "./ModalSession";
import ModalCreate from "./ModalCreate";
import ToastSession from "./ToastSession";

export const MODAL = {
  showSession(title, message, button) {
    const data = { title: title, message: message, button: button };
    ReactDOM.render(
      <ModalSession data={data} />,
      document.getElementById("modal-react")
    );
  },
  hide() {
    ReactDOM.unmountComponentAtNode(document.getElementById("modal-react"));
  },
  showCreate(title, body, button, status) {
    const data = { title: title, body: body, button: button, status: status };
    ReactDOM.render(
      <ModalCreate data={data} />,
      document.getElementById("modal-react")
    );
  },
  showSnackbar(message, severity = "error", time) {
    /**
     * @param {string} message
     * @param {string} severity => oneOf : error(default)/success/warning/info
     * @param {number} time => 1500(default)
     */

    ReactDOM.render(
      <ToastSession message={message} time={time} severity={severity} />,
      document.getElementById("snackbar-react")
    );
  },
};
