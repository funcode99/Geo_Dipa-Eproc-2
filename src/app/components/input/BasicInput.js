import React from "react";

const BasicInput = ({ placeholder, ...other }) => {
  return (
    <input
      type="text"
      className="form-control"
      // id="numberContract"
      // defaultValue={'contractData["contract_no"]'}
      placeholder={placeholder}
      {...other}
    />
  );
};

BasicInput.defaultProps = {
  placeholder: "placeholder ...",
};

export default BasicInput;
