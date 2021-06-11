import React from "react";
import { Row, Col } from "react-bootstrap";
import {
  Card,
  CardBody,
} from "../../../../../../../_metronic/_partials/controls";
import FieldBuilder from "../../../../../../components/builder/FieldBuilder";
import { formData1, formData2 } from "./fieldData";

const BastPage = () => {
  return (
    <Card>
      <CardBody>
        <Row>
          <Col>
            <FieldBuilder readOnly formData={formData1} />
          </Col>
          <Col>
            <FieldBuilder readOnly formData={formData2} />
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default BastPage;
