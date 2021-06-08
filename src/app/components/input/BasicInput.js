import React from "react";

const BasicInput = ({ placeholder }) => {
  return (
    <input
      type="text"
      className="form-control"
      id="numberContract"
      // defaultValue={'contractData["contract_no"]'}
      placeholder={placeholder}
      disabled
    />
  );
};

BasicInput.defaultProps = {
  placeholder: "placeholder ...",
};

export default BasicInput;
