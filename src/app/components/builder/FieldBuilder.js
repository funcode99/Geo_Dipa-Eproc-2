import React from "react"
import { Col, Row } from "react-bootstrap"
import RenderInput from 'app/components/input/RenderInput'

// values = {},
// errors,
// handleSubmit,
const FieldBuilder = ({
  formData,
  ...other
}) => {
  console.log('isi formData', formData)
  // values,
  // errors,
  // handleSubmit,
  // readOnly,
  // onChange: readOnly ? () => {} : undefined,
  // disabled: readOnly,
  const formProps = {
    ...other,
  };

  console.log('isi formProps', other)

  // console.log(`formProps`, formProps);
  return (
    <Row className={"mt-9"}>
      {formData &&
        formData.map((item, idx) => {
          if (Array.isArray(item)) {
            return (
              <Col key={idx} md={12}>
                <Row>
                  {item?.map((it, id) => (
                    <Col key={id} md={it.typeInput === 'CheckboxInput' ? 3 : 12}>
                      <RenderInput 
                        {...it}
                        {...formProps}
                      />
                    </Col>
                  ))}
                  {/* <label>apaa ini</label> */}
                </Row>
              </Col>
            );
          } else if (typeof item === "object") {
            return (
              <Col key={idx} md={12}>
                <RenderInput {...item} {...formProps} />
              </Col>
            );
          } else {
            return <div key={idx}></div>;
          }
        })}
    </Row>
  );
};

export default FieldBuilder;
