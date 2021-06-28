import { FormControlLabel, Switch } from "@material-ui/core";
import React from "react";
import { Col } from "react-bootstrap";
import { Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Card, CardBody } from "../../../../../../_metronic/_partials/controls";
import UploadInput from "../../../../../components/input/UploadInput";

const ItemSwitch = ({ label, value, onChange }) => {
  const [active, setActive] = React.useState(false);
  const handleChange = () => {
    if (typeof onChange === "function") onChange(!active);
    else setActive((prev) => !prev); // ini ilangin elsenya kalo mau dipake
  };

  const valueUsed = value !== null ? value : active;

  return (
    <Row>
      <Col md={8}>
        <FormControlLabel
          control={
            <Switch
              checked={Boolean(valueUsed)}
              onChange={handleChange}
              color="primary"
            />
          }
          label={label}
        />
        {Boolean(valueUsed) && <UploadInput />}
      </Col>
    </Row>
  );
};

const Jaminan = () => {
  const dataContractById = useSelector(
    (state) => state.deliveryMonitoring.dataContractById
  );
  const dataField = React.useMemo(
    () => [
      {
        type: "down_payment",
        label: "Jaminan Uang Muka",
        value: dataContractById?.down_payment_guarantee,
      },
      {
        type: "implementation",
        label: "Jaminan Pelaksanaan",
        value: dataContractById?.implementation_guarantee,
      },
      {
        type: "maintenance",
        label: "Jaminan Pemeliharaan",
        value: dataContractById?.maintenance_guarantee,
      },
    ],
    [dataContractById]
  );
  const handleChange = (state, type) => {};
  return (
    <Card>
      <CardBody>
        {dataField.map(({ type, label, value }, id) => (
          <ItemSwitch
            key={id}
            label={label}
            value={value}
            onChange={(state) => handleChange(state, type)}
          />
        ))}
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
