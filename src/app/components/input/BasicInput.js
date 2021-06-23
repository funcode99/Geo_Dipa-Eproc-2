import React from "react";

const BasicInput = ({ placeholder, onChange, type = "text", ...other }) => {
  const _handleChange = React.useCallback(
    (e) => {
      // console.log(`e`, e.target.value);
      onChange(e.target.value);
    },
    [onChange]
  );
  return (
    <input
      type={type}
      className="form-control"
      onChange={_handleChange}
      placeholder={placeholder}
      {...other}
    />
  );
};

BasicInput.defaultProps = {
  placeholder: "placeholder ...",
};

export default BasicInput;
