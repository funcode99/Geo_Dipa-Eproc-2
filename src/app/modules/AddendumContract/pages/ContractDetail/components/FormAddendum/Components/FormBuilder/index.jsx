import { Button, CircularProgress } from "@material-ui/core";
import { Formik } from "formik";
import React from "react";
import FieldBuilder from "./FieldBuilder";
import { Send } from "@material-ui/icons";

// gua yakin sebenernya props ini dipakai semua, cuma oleh komponen yang berbeda2 dan semua props nya itu ditumpuk disini, sebaiknya jangan dihapus biar gak membingungkan saat menggunakan data lainnya
const FormBuilderAddendum = (
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
  const formikRef = React.useRef();
  const _handleSubmit = React.useCallback(
    // ada beberapa onSubmit yang mengirimkan fungsi, beberapa isi nya undefined
    (data) => typeof onSubmit === "function" && onSubmit(data),
    [onSubmit]
  );

  console.log("isi children", children);

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
            {/* isi children function _ref2 */}
            {typeof children === "function" ? (
              // <div>
              //   masuk ke children formikprops + fieldprops
              // keduanya isi nya kosong, pantes aja form input nya masih ada
              // </div>
              children({ ...formikProps, fieldProps })
            ) : (
              // <div>
              //   masuk ke field builder
              // </div>
              <FieldBuilder formData={formData} {...fieldProps} />
            )}
            {/* button children & submit */}
            <div
              className="d-flex justify-content-end w-100"
              style={{ gap: "20px" }}
            >
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

export default React.forwardRef(FormBuilderAddendum);
