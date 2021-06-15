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

const optionsList = {
  select_example: [
    { value: 1, label: "data1" },
    { value: 2, label: "data2" },
    { value: 3, label: "data3" },
  ],
};

const RenderInput = ({
  typeInput,
  name,
  Child,
  children,
  ChildrenProps,
  label,
  // values,
  // errors,
  handleSubmit,
  readOnly,
  formik,
  disabledFields = [],
  listOptions = optionsList["select_example"],
  ...otherProps
}) => {
  const Component = inputs[typeInput || "BasicInput"];
  const { values, errors, setFieldValue, setFieldTouched } = formik;
  // React.useEffect(() => {
  // console.log(`formik`, formik);
  // }, [formik]);
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
                // onChange={handleChange(name)}
                onChange={(val) => setFieldValue(name, val, true)}
                onFocus={() => setFieldTouched(name)}
                disabled={readOnly || disabledFields.includes(name)}
                //   onChange={trigger ? this._triggerChange : handleChange(name)}
                //   onFocus={() => setFieldTouched(name)}
                //   className={classNames("pl-4", className)}
                options={listOptions?.[name]}
                {...otherProps}
              />
              {/* <ErrorMessage name={name} /> */}
              <span className={"text-danger mt-2"}>{errors[name]}</span>
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
