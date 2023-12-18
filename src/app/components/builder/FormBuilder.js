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
    btnChildren,
  },
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
      validateOnChange={false}
      validationSchema={validation}
    >
      {(formikProps) => {
        const { handleSubmit, isValid } = formikProps;
        return (
          <React.Fragment>
            {typeof children === "function" ? (
              children({ ...formikProps, fieldProps })
            ) : (
              <FieldBuilder formData={formData} {...fieldProps} />
            )}
            <div className="d-flex justify-content-end w-100">
              {btnChildren}
              {withSubmit && (
                <Button
                  variant="contained"
                  color="secondary"
                  size="medium"
                  onClick={handleSubmit}
                  disabled={loading || disabledButton || !isValid}
                >
                  <span className="mr-1">Submit</span>
                  {loading ? (
                    <CircularProgress size="0.875rem" color="inherit" />
                  ) : (
                    <Send />
                  )}
                </Button>
              )}
            </div>
          </React.Fragment>
        );
      }}
    </Formik>
  );
};

export default React.forwardRef(FormBuilder);
