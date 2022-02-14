import React from "react";
import { string, date } from "yup";
import { FormattedMessage } from "react-intl";

const validation = {
  require: (text) => {
    return string().required(`${text} harus diisi.`);
  },

  date: (message) => {
    return date()
      .required(message)
      .nullable();
  },
  string: (message) => {
    return string().required(message);
  },
};

export default validation;
