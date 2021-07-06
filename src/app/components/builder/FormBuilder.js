import { Button, CircularProgress } from "@material-ui/core";
import { Formik } from "formik";
import React from "react";
import FieldBuilder from "./FieldBuilder";
import { Send } from "@material-ui/icons";

const FormBuilder = (
  {
    onSubmit,
    formData,
    initial = {},
    validation,
    children,
    fieldProps,
    loading = false,
    disabledButton = false,
    withSubmit = true,
  },
  ref
) => {
  const formikRef = React.useRef();
  const _handleSubmit = React.useCallback(
    (data) => typeof onSubmit === "function" && onSubmit(data),
    [onSubmit]
  );
  // console.log(`formProps`, fieldProps);

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
              children({ ...formikProps, fieldProps })
            ) : (
              <FieldBuilder formData={formData} {...fieldProps} />
            )}
            {withSubmit && (
              <div className="d-flex justify-content-end w-100">
                <Button
                  variant="contained"
                  color="secondary"
                  size="medium"
                  onClick={handleSubmit}
                  disabled={loading || disabledButton}
                >
                  <span className="mr-1">Submit</span>
                  {loading ? (
                    <CircularProgress size="0.875rem" color="inherit" />
                  ) : (
                    <Send />
                  )}
                </Button>
              </div>
            )}
          </React.Fragment>
        );
      }}
    </Formik>
  );
};

export default React.forwardRef(FormBuilder);
