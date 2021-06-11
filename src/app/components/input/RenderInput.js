import { ErrorMessage } from "formik";
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
  values,
  errors,
  handleSubmit,
  readOnly,
  ...otherProps
}) => {
  const Component = inputs[typeInput || "BasicInput"];

  return (
    <div>
      {name && (
        <div>
          <div className="form-group row">
            <label className="col-sm-4 col-form-label">{label}</label>
            <div className="col-sm-8">
              <Component
                // labelClass="mb-1"
                value={values[name]}
                //   onChange={trigger ? this._triggerChange : handleChange(name)}
                //   onFocus={() => setFieldTouched(name)}
                //   className={classNames("pl-4", className)}
                {...otherProps}
              />
            </div>
          </div>
          <span>{/* <ErrorMessage name={name} /> */}</span>
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

export default RenderInput;
