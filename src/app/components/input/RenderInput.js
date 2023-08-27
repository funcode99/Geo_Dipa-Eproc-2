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

const RenderInput = ({
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
  onFocus,
  onBlur,
  onChange,
  fieldInfo,
  ...otherProps
}) => {
  const isSelect = typeInput === "SelectInputCustom";
  const Component = inputs[typeInput || "BasicInput"];
  const { values, errors, setFieldValue, setTouched, touched } = formik;
  const selectProps = isSelect ? { listOptions } : {};

  const _handleFocus = (e) => {
    setTouched({ [name]: true });
    if (typeof onFocus === "function") onFocus(e);
  };
  const _handleBlur = (e) => {
    setTouched({});
    if (typeof onBlur === "function") onBlur(e);
  };
  const _handleChange = (val) => {
    setFieldValue(name, val, true);
    if (typeof onChange === "function") onChange(val);
  };

  // const _onChange = (val) => {
  //   setFieldValue(name, val, true)
  //   onChangeCustom()
  // }
  return (
    <div>
      {name && (
        <div>
          <div className="form-group row">
            <label className={`col-sm-${labelSize} col-form-label`}>
              {label}
            </label>
            <div className={`col-sm-${formInputSize}`}>
              <Component
                // labelClass="mb-1"
                value={values[name] || ""}
                name={name}
                // onChange={handleChange(name)}
                onChange={_handleChange}
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
              {fieldInfo}
              {/* <ErrorMessage name={name} /> */}
              {!!!touched[name] && (
                <span className={"text-danger mt-2"}>{errors[name]}</span>
              )}
            </div>
          </div>
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

export default connect(RenderInput);
