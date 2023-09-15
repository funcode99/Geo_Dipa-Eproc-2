import { Button, CircularProgress } from "@material-ui/core";
import { Formik } from "formik";
import React from "react";
import FieldBuilder from "./FieldBuilder";
import { Send } from "@material-ui/icons";

// gua yakin sebenernya props ini dipakai semua, cuma oleh komponen yang berbeda2 dan semua props nya itu ditumpuk disini, sebaiknya jangan dihapus biar gak membingungkan saat menggunakan data lainnya
const FormBuilder = (
  {
    onSubmit,
    onDraft,
    formData,
    initial = {},
    validation,
    children,
    fieldProps,
    loading = false,
    disabledButton = false,
    withSubmit = true,
    withDraft = false,
    btnChildren,
  },
  ref
) => {
  
  console.log('ISI PROPS ONSUBMIT', onSubmit)
  console.log('ISI PROPS REF?', ref)

  const formikRef = React.useRef()
  const _handleSubmit = React.useCallback(
    // ada beberapa onSubmit yang mengirimkan fungsi, beberapa isi nya undefined
    (data) => typeof onSubmit === "function" && onSubmit(data),
    [onSubmit]
  )
  // console.log(`formProps`, fieldProps);



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
        console.log('ISI FORMIK PROPS',formikProps)
        const { handleSubmit, isValid } = formikProps
        console.log('ini isi fungsi handleSubmit', handleSubmit)
        return (
          <React.Fragment>
            {typeof children === "function" ? 
            (
              children({ ...formikProps, fieldProps })
            )
            : 
            (
              <FieldBuilder formData={formData} {...fieldProps} />
            )}
            <div className="d-flex justify-content-end w-100" style={{gap: '20px'}}>
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
                  {loading ? 
                  (
                    <CircularProgress size="0.875rem" color="inherit" />
                  ) : 
                  (
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

export default React.forwardRef(FormBuilder)