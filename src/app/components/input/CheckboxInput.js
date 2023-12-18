import React from "react";
import { connect } from "formik";

const CheckboxInput = ({ onChange, type = "checkbox" }) => {
  const _handleChange = React.useCallback(
    (e) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  return (
    <>
      <input className="defg" type={type} onChange={_handleChange} />
    </>
  );
};

export default connect(CheckboxInput);
