import React from "react";
import { Row, Col, Container, Form } from "react-bootstrap";
import { FormattedMessage } from "react-intl";
import { Card, CardBody } from "../../../../../../_metronic/_partials/controls";
import BasicInput from "../../../../../components/input/BasicInput";
import SelectDateInput from "../../../../../components/input/SelectDateInput";
import SelectInputCustom from "../../../../../components/input/SelectInputCustom";
import TextAreaInput from "../../../../../components/input/TextAreaInput";
import UploadInput from "../../../../../components/input/UploadInput";
import withBox from "./withBox";

const ParaPihak = () => {
  return (
    <Card>
      <CardBody>
        <div className="row">
          <BasicInput />
          <SelectDateInput />
          <SelectInputCustom />
          <TextAreaInput />
          <UploadInput />
        </div>
      </CardBody>
    </Card>
  );
};

export default ParaPihak;
