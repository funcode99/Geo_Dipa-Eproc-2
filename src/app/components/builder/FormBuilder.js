import { Button } from "@material-ui/core";
import { Formik } from "formik";
import React from "react";
import FieldBuilder from "./FieldBuilder";
import { Send } from "@material-ui/icons";

const FormBuilder = (
  { onSubmit, formData, initial = {}, validation, children, fieldProps },
  ref
) => {
  const formikRef = React.useRef();
  const _handleSubmit = React.useCallback(
    (data) => typeof onSubmit === "function" && onSubmit(data),
    [onSubmit]
  );

  React.useImperativeHandle(ref, () => formikRef.current);

  return (
    <Formik
      innerRef={formikRef}
      initialValues={initial}
      onSubmit={_handleSubmit}
      validationSchema={validation}
    >
      {(formikProps) => {
        const { handleSubmit } = formikProps;
        return (
          <React.Fragment>
            {typeof children === "function" ? (
              children(formikProps)
            ) : (
              <FieldBuilder formData={formData} {...fieldProps} />
            )}
            <div className="d-flex justify-content-end w-100">
              <Button
                variant="contained"
                color="secondary"
                size="medium"
                onClick={handleSubmit}
              >
                <span className="mr-1">Submit</span>
                <Send />
              </Button>
            </div>
          </React.Fragment>
        );
      }}
    </Formik>
  );
};

export default React.forwardRef(FormBuilder);
