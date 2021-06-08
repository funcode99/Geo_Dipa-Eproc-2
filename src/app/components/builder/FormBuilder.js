import { Formik } from "formik";
import React from "react";
import FieldBuilder from "./FieldBuilder";

const FormBuilder = ({ onSubmit, formData1, formData2 }) => {
  const formikRef = React.useRef();

  const _handleSubmit = React.useCallback(
    (data) => typeof onSubmit === "function" && onSubmit(data),
    [onSubmit]
  );

  return (
    <Formik
      innerRef={formikRef}
      initialValues={initial}
      onSubmit={_handleSubmit}
      validationSchema={validation}
    >
      <FieldBuilder formData1={formData1} formData2={formData1} />
    </Formik>
  );
};

export default FormBuilder;
