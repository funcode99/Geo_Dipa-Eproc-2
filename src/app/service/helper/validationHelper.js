import React from "react";
import { string, date } from "yup";
import { FormattedMessage } from "react-intl";

const validation = {
  require: (text) => {
    return string().required(
      `${text} ${(<FormattedMessage id="TITLE.IS_REQUIRED" />)}.`
    );
  },
  date: (text) => {
    return date()
      .required(`${text} ${(<FormattedMessage id="TITLE.IS_INVALID" />)}.`)
      .nullable();
  },
};

export default validation;
