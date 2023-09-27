import { connect, ErrorMessage } from "formik"
import React, { useState } from "react"
import BasicInput from "app/components/input/BasicInput"
import SelectDateInput from "app/components/input/SelectDateInput"
import SelectInputCustom from "app/components/input/SelectInputCustom"
import TextAreaInput from "app/components/input/TextAreaInput"
import UploadInput from "app/components/input/UploadInput"
import CheckboxInput from "app/components/input/CheckboxInput"
import SupportingDocumentInput from "app/components/input/SupportingDocumentInput.jsx"
import { formDataCheckbox } from "app/modules/AddendumContract/pages/ContractDetail/components/ParaPihak/fieldData"
import { element } from "prop-types"

const inputs = {
  BasicInput,
  SelectDateInput,
  SelectInputCustom,
  TextAreaInput,
  UploadInput,
  CheckboxInput
}

const RenderInput = ({
  inputValue,
  typeInput,
  name,
  Child,
  children,
  ChildrenProps,
  deleteInput,
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
  layout,
  placeholder,
  ...otherProps
}) => {
  const isSelect = typeInput === "SelectInputCustom"

  // inputs.BasicInput || inputs.typeInput
  // kalo typeInput nya undefined auto BasicInput
  
  const Component = inputs[typeInput || "BasicInput"]
  const { values, errors, setFieldValue, setTouched, touched } = formik
  const selectProps = isSelect ? { listOptions } : {}

  const _handleFocus = (e) => {
    setTouched({ [name]: true })
    if (typeof onFocus === "function") onFocus(e)
  }

  const _handleBlur = (e) => {
    setTouched({});
    if (typeof onBlur === "function") onBlur(e);
  }

  const [isi, setIsi] = useState('')
  const [inputName, setInputName] = useState('')
  const [checked, setChecked] = useState([])

  const _handleChange = (val) => {
    
    console.log('isi val checkbox', val)

    if(typeInput !== 'CheckboxInput') {
      setIsi(val)
      setFieldValue(name, val, true)
    } else {
      // setFieldValue('checked_list', val, true)
    }
    // console.log('isi checked_list', checked_list)
    // if (typeof onChange === "function") onChange(val)

  }

  const _handleKeyDown = (e) => {
    // console.log('isi event', e)
    // console.log(e.target.value)
    // console.log('ini namanya apa', name)
    // if(e.key === 'Enter' && name === 'input_other' && isi !== '') {

    //   // alert('enter telah ditekan')
    //   // console.log('isi val', isi)
    //   formDataCheckbox.map((item, index) => {
        
    //     console.log('index ke-', index)

    //     if(Array.isArray(item) && item.length < 4) {
    //       let a = item.pop()
    //       console.log('masuk ke a')
    //       item.push({
    //         name: isi,
    //         label: isi,
    //         typeInput: "CheckboxInput"
    //       })
    //       item.push(a)
    //       setFieldValue(name, isi, true)
    //       setInputName(a)
    //     }

    //     else if (index === formDataCheckbox.length-1 && item.length == 4) {
    //       let a = item.pop()
    //         console.log('masuk ke b')        
    //           item.push({
    //             name: isi,
    //             label: isi,
    //             typeInput: "CheckboxInput"
    //           })
    //           formDataCheckbox.push([a])
    //         setFieldValue(name, isi, true)
    //     }
        
    //   })

    //   formik.resetForm()
    //   setTimeout(() => {
    //     let elementInput = document.getElementsByName('input_other')[0]
    //     elementInput.focus()
    //   }, 1)

    // }
  }


  // const _onChange = (val) => {
  //   setFieldValue(name, val, true)
  //   onChangeCustom()
  // }

  console.log('isi values name nya broh', values[name])

  return (
    <div>
      {name && typeInput === 'CheckboxInput' ? 
      (
        <div>
          <div className={`form-group row ${typeInput ==='CheckboxInput' ? 'abcd' : ''}`}>

            <div>
              {/* ini input nya */}
              <Component
                value={inputValue || ""}
                name={name}
                onChange={() => setChecked(oldValue => [...oldValue, inputValue] 
                )}
                onFocus={_handleFocus}
                onBlur={_handleBlur}
                {...selectProps}
                {...otherProps}
              />
              <small className="form-text text-muted">{fieldInfo}</small>
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
          <div className={`form-group ${layout === 'Column' ? 'col': 'row'}`}>
            <label className={`col-sm-${labelSize} col-form-label ${label === undefined ? 'd-none': ''}`}>
              {label}
            </label>
            <div className={`${label === undefined ? 'col-sm-8' : `col-sm-${formInputSize}`}`}>
              {/* ini input nya */}
              {!deleteInput &&
              <Component
                value={values[name] || ""}
                name={name}
                onChange={_handleChange}
                onFocus={_handleFocus}
                onBlur={_handleBlur}
                onKeyDown={_handleKeyDown}
                placeholder={placeholder || ""}
                
                // onKeyUp={_handleKeyUp}
                // disabled={readOnly || disabledFields.includes(name)}
                {...selectProps}
                {...otherProps}
              />
              }
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
