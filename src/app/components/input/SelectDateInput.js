import React from "react";

const SelectDateInput = ({ onChange, value, ...other }) => {
  const _handleChange = React.useCallback(
    (e) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  return (
    <input
      type="date"
      onChange={_handleChange}
      className="form-control"
      defaultValue={value}
      {...other}
    />
  );
};

export default SelectDateInput;
