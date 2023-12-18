import React from "react";
import { Col, Row } from "react-bootstrap";
import RenderInput from "app/components/input/RenderInput";

const FieldBuilderAddendum = ({ formData, ...other }) => {
  const formProps = {
    ...other,
  };

  return (
    <Row className={"mt-9"}>
      {formData &&
        formData.map((item, idx) => {
          if (Array.isArray(item)) {
            return (
              <Col key={idx} md={12}>
                <Row>
                  {item?.map((it, id) => (
                    // <div>
                    //   masuk kesini, dan input nya masih ada
                    // </div>
                    // isi nya label + form
                    <Col
                      key={id}
                      md={
                        it.typeInput === "CheckboxInput" ||
                        it.label === undefined
                          ? 3
                          : 12
                      }
                    >
                      <RenderInput {...it} {...formProps} />
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

export default FieldBuilderAddendum;
