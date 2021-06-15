import React from "react";
import { Col, Row } from "react-bootstrap";
import RenderInput from "../input/RenderInput";

const FieldBuilder = ({
  formData,
  // values = {},
  // errors,
  // handleSubmit,
  ...other
}) => {
  const formProps = {
    // values,
    // errors,
    // handleSubmit,
    // readOnly,
    // onChange: readOnly ? () => {} : undefined,
    // disabled: readOnly,
    ...other,
  };

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
                    <Col key={id} md={6}>
                      <RenderInput {...it} {...formProps} />
                    </Col>
                  ))}
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
