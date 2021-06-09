import { FormControlLabel, Switch } from "@material-ui/core";
import React from "react";
import { Col } from "react-bootstrap";
import { Row } from "react-bootstrap";
import { Card, CardBody } from "../../../../../../_metronic/_partials/controls";
import UploadInput from "../../../../../components/input/UploadInput";

const ItemSwitch = ({ label }) => {
  const [active, setActive] = React.useState(false);
  const handleChange = () => {
    setActive((prev) => !prev);
  };
  return (
    <Row>
      <Col md={8}>
        <FormControlLabel
          control={
            <Switch checked={active} onChange={handleChange} color="primary" />
          }
          label={label}
        />
        {active && <UploadInput />}
      </Col>
    </Row>
  );
};

const Jaminan = () => {
  return (
    <Card>
      <CardBody>
        <ItemSwitch label={"Jaminan Uang Muka"} />
        <ItemSwitch label={"Jaminan Pelaksanaan"} />
        <ItemSwitch label={"Jaminan Pemeliharaan"} />
        <div className="d-flex justify-content-end">
          <button type="button" className="btn btn-primary mx-1">
            Kirim
          </button>
        </div>
      </CardBody>
    </Card>
  );
};

export default Jaminan;
