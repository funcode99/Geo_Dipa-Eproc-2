import React from "react";
import { FormattedMessage } from "react-intl";
import DateFnsUtils from "@date-io/date-fns";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";

const SelectDateInput = ({ onChange, value, ...other }) => {
  const _handleChange = React.useCallback(
    (e) => {
      // console.log(`e`, e.target.value);
      onChange(e.target.value);
    },
    [onChange]
  );
  // console.log(`other`, other);

  return (
    <input
      type="date"
      onChange={_handleChange}
      className="form-control"
      value={value}
      {...other}
    />
  );
};

export default SelectDateInput;
