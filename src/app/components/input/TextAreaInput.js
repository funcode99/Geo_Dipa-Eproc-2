import React from "react";

const TextAreaInput = ({ placeholder }) => {
  return (
    <textarea
      rows="4"
      cols=""
      className="form-control"
      id="second"
      disabled
      // defaultValue={"contractData"}
      placeholder={placeholder}
    />
  );
};

TextAreaInput.defaultProps = {
  placeholder: "placeholder ...",
};

export default TextAreaInput;
