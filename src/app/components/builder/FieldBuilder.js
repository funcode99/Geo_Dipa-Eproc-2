import React from "react";
import Grid from "@material-ui/core/Grid";
import DUMMY_FIELD from "./DUMMY_FIELD.js";
import RenderInput from "../input/RenderInput.js";
import { Col, Row } from "react-bootstrap";

const FieldBuilder = ({ formData }) => {
  return (
    <Row className={"mt-9"}>
      {formData &&
        formData.map((item, idx) => {
          if (Array.isArray(item)) {
            return (
              <Col md={12}>
                <Row>
                  {item?.map((it, id) => (
                    <Col key={id} md={6}>
                      <RenderInput {...it} />
                    </Col>
                  ))}
                </Row>
              </Col>
            );
          } else if (typeof item === "object") {
            return (
              <Col key={idx} md={12}>
                <RenderInput {...item} />
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
