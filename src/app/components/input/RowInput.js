import { connect } from "formik";
import React from "react";
import BasicInput from "./BasicInput";
import SelectDateInput from "./SelectDateInput";
import SelectInputCustom from "./SelectInputCustom";
import TextAreaInput from "./TextAreaInput";
import UploadInput from "./UploadInput";

const inputs = {
  BasicInput,
  SelectDateInput,
  SelectInputCustom,
  TextAreaInput,
  UploadInput,
};

const RowInput = ({
  typeInput,
  name,
  Child,
  ChildWithName,
  children,
  ChildrenProps,
  label,
  handleSubmit,
  readOnly,
  formik,
  disabledFields = [],
  listOptions,
  labelSize = 4,
  formInputSize = 8,
  noLabel = false,
  onFocus,
  onBlur,
  ...otherProps
}) => {
  const isSelect = typeInput === "SelectInputCustom";
  const ThisComponent = inputs[typeInput || "BasicInput"];
  const { values, errors, setFieldValue, touched, setTouched } = formik;
  const selectProps = isSelect ? { listOptions } : {};
  const _handleFocus = (e) => {
    setTouched({ [name]: true });
    if (typeof onFocus === "function") onFocus(e);
  };
  const _handleBlur = (e) => {
    setTouched({});
    if (typeof onBlur === "function") onBlur(e);
  };

  // const _onChange = (val) => {
  //   setFieldValue(name, val, true)
  //   onChangeCustom()
  // }
  // console.log(`formik`, formik);
  const passedProps = {
    ...otherProps,
    onChange: (val) => setFieldValue(name, val, true),
    value: values[name] || "",
    name,
    onFocus: _handleFocus,
    onBlur: _handleBlur,
    disabled: readOnly || disabledFields.includes(name),
    ...selectProps,
    ...otherProps,
  };
  return (
    <div>
      {name && ChildWithName ? (
        <ChildWithName {...ChildrenProps} {...passedProps} />
      ) : (
        <div>
          <ThisComponent
            // value={values[name] || ""}
            // name={name}
            // onChange={(val) => setFieldValue(name, val, true)}
            // onFocus={_handleFocus}
            // onBlur={_handleBlur}
            // disabled={readOnly || disabledFields.includes(name)}
            {...passedProps}
            // {...selectProps}
            // {...otherProps}
          />
          {/* <ErrorMessage name={name} /> */}
          {!!!touched[name] && (
            <span className={"text-danger mt-2"}>{errors[name]}</span>
          )}
        </div>
      )}
      {Child ? (
        <Child {...ChildrenProps} {...passedProps} />
      ) : typeof children === "function" ? (
        children({ data: "dataToPass" })
      ) : (
        children
      )}
    </div>
  );
};

export default connect(RowInput);
