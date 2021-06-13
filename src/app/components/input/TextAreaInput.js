import React from "react";

const TextAreaInput = ({ placeholder, onChange, value, ...other }) => {
  const _handleChange = React.useCallback(
    (e) => {
      // console.log(`e`, e.target.value);
      onChange(e.target.value);
    },
    [onChange]
  );
  return (
    <textarea
      rows="4"
      cols=""
      className="form-control"
      onChange={_handleChange}
      placeholder={placeholder}
      value={value}
      {...other}
    />
  );
};

TextAreaInput.defaultProps = {
  placeholder: "placeholder ...",
};

export default TextAreaInput;
