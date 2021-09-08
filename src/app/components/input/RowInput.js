import { connect, ErrorMessage } from "formik";
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
  const Component = inputs[typeInput || "BasicInput"];
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
  return (
    <div>
      {name && (
        <div>
          <Component
            // labelClass="mb-1"
            value={values[name] || ""}
            name={name}
            // onChange={handleChange(name)}
            onChange={(val) => setFieldValue(name, val, true)}
            onFocus={_handleFocus}
            onBlur={_handleBlur}
            disabled={readOnly || disabledFields.includes(name)}
            //   onChange={trigger ? this._triggerChange : handleChange(name)}
            //   onFocus={() => setFieldTouched(name)}
            //   className={classNames("pl-4", className)}
            // options={listOptions[name]}
            // listOptions={listOptions}
            {...selectProps}
            {...otherProps}
          />
          {/* <ErrorMessage name={name} /> */}
          {!!!touched[name] && (
            <span className={"text-danger mt-2"}>{errors[name]}</span>
          )}
        </div>
      )}
      {Child ? (
        <Child {...ChildrenProps} />
      ) : typeof children === "function" ? (
        children({ data: "dataToPass" })
      ) : (
        children
      )}
    </div>
  );
};

export default connect(RowInput);
