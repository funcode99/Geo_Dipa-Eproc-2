import { connect, ErrorMessage } from "formik"
import React from "react"
import BasicInput from "app/components/input/BasicInput"
import SelectDateInput from "app/components/input/SelectDateInput"
import SelectInputCustom from "app/components/input/SelectInputCustom"
import TextAreaInput from "app/components/input/TextAreaInput"
import UploadInput from "app/components/input/UploadInput"
import CheckboxInput from "app/components/input/CheckboxInput"

const inputs = {
  BasicInput,
  SelectDateInput,
  SelectInputCustom,
  TextAreaInput,
  UploadInput,
  CheckboxInput
}

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
  const isSelect = typeInput === "SelectInputCustom"
  // inputs.BasicInput || inputs.typeInput
  // console.log('isi typeInput', typeInput)
  console.log('isi name', name)
  console.log('isi label', label?.type?.name === 'Ini2')
  // BasicInput
  // kalo typeInput nya undefined auto BasicInput
  const Component = inputs[typeInput || "BasicInput"];
  const { values, errors, setFieldValue, setTouched, touched } = formik;
  const selectProps = isSelect ? { listOptions } : {};

  const _handleFocus = (e) => {
    setTouched({ [name]: true });
    if (typeof onFocus === "function") onFocus(e);
  }

  const _handleBlur = (e) => {
    setTouched({});
    if (typeof onBlur === "function") onBlur(e);
  }

  const _handleChange = (val) => {
    setFieldValue(name, val, true);
    if (typeof onChange === "function") onChange(val);
  }

  // const _onChange = (val) => {
  //   setFieldValue(name, val, true)
  //   onChangeCustom()
  // }
  return (
    <div>
      {name && typeInput === 'CheckboxInput' ? 
      (
        <div>
          <div className={`form-group row ${typeInput ==='CheckboxInput' ? 'abcd' : ''}`}>

            <div className={``}>
              {/* ini input nya */}
              <Component
                value={values[name] || ""}
                name={name}
                onChange={_handleChange}
                onFocus={_handleFocus}
                onBlur={_handleBlur}
                disabled={readOnly || disabledFields.includes(name)}
                {...selectProps}
                {...otherProps}
              />
              {fieldInfo}
              {/* <ErrorMessage name={name} /> */}
              {!!!touched[name] && (
                <span className={"text-danger mt-2"}>{errors[name]}</span>
              )}
            </div>

            <label className={`col-form-label`}>
              {label}
            </label>

          </div>
        </div>
      )
        :
      (
        <div>
          <div className="form-group row">
            <label className={`col-sm-${labelSize} col-form-label`}>
              {label}
            </label>
            <div className={`col-sm-${formInputSize}`}>
              {/* ini input nya */}
              <Component
                value={values[name] || ""}
                name={name}
                onChange={_handleChange}
                onFocus={_handleFocus}
                onBlur={_handleBlur}
                disabled={readOnly || disabledFields.includes(name)}
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
      )
    }
      {Child ? (
        <Child {...ChildrenProps} />
      ) : typeof children === "function" ? 
      (
        children({ data: "dataToPass" })
      ) : 
      (
        children
      )}
    </div>
  );
};

export default connect(RenderInput);
