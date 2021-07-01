import { FormControlLabel, Switch } from "@material-ui/core";
import React from "react";
import { Col } from "react-bootstrap";
import { Row } from "react-bootstrap";
import { FormattedHTMLMessage } from "react-intl";
import { useSelector } from "react-redux";
import { Card, CardBody } from "../../../../../../_metronic/_partials/controls";
import UploadInput from "../../../../../components/input/UploadInput";

const ItemSwitch = ({ label, value, onChange }) => {
  const [active, setActive] = React.useState(false);
  const [dataForm, setDataForm] = React.useState({});
  const handleChange = React.useCallback(() => {
    if (typeof onChange === "function") onChange(!active);
    setActive((prev) => !prev); // ini ilangin elsenya kalo mau dipake
  }, [onChange, active, setActive]);

  const valueUsed = active;

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
        {Boolean(valueUsed) && <UploadInput onChange={handleChange} />}
        {/* {Boolean(valueUsed) && (
          <div className="form-group row">
            <label className="input-group mb-3 col-sm-8">
              <div className="input-group-append pointer">
                <UploadInput onChange={handleChange} />
                <span className={`input-group-text`}>
                  <a download={"sppData?.file_name"} href={"sppData?.file"}>
                    <i className="fas fa-download"></i>
                  </a>
                </span>
                <span className={`input-group-text`}>
                  <i className="fas fa-eye"></i>
                </span>
              </div>
            </label>
          </div>
        )} */}
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
