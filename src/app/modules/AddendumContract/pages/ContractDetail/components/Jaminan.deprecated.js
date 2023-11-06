import { FormControlLabel, Switch } from "@material-ui/core";
import React from "react";
import { Col } from "react-bootstrap";
import { Row } from "react-bootstrap";
import { FormattedHTMLMessage } from "react-intl";
import { useSelector } from "react-redux";
import { Card, CardBody } from "../../../../../../_metronic/_partials/controls";
import UploadInput from "../../../../../components/input/UploadInput";
import useToast from "../../../../../components/toast";
import apiHelper from "../../../../../service/helper/apiHelper";
import { uploadGuarantee } from "../../../service/DeliveryMonitoringCrud";

const ItemSwitch = React.memo(({ label, value, onChange }) => {
  const [active, setActive] = React.useState(false);
  const [dataForm, setDataForm] = React.useState({});
  const handleActive = React.useCallback(() => {
    setActive((prev) => !prev);
    if (typeof onChange === "function" && active === true) onChange("");
  }, [setActive, active, onChange]);
  const handleChange = React.useCallback(
    (e) => {
      if (typeof onChange === "function") onChange(e);
    },
    [onChange]
  );

  // console.log(`type`, value);

  const valueUsed = active;

  return (
    <Row>
      <Col md={8}>
        <FormControlLabel
          control={
            <Switch
              checked={Boolean(active)}
              onChange={handleActive}
              color="primary"
            />
          }
          label={label}
        />
        <UploadInput
          value={value}
          onChange={onChange}
          classLabel={Boolean(!active) && "d-none"}
        />
      </Col>
    </Row>
  );
});

const Jaminan = () => {
  const [Toast, setToast] = useToast();

  const dataContractById = useSelector(
    (state) => state.deliveryMonitoring.dataContractById
  );
  const [dataForm, setDataForm] = React.useState({
    down_payment: "",
    implementation: "",
    maintenance: "",
  });
  const dataField = React.useMemo(
    () => [
      {
        type: "down_payment",
        label: "Jaminan Uang Muka",
        // value: dataContractById?.down_payment_guarantee,
      },
      {
        type: "implementation",
        label: "Jaminan Pelaksanaan",
        // value: dataContractById?.implementation_guarantee,
      },
      {
        type: "maintenance",
        label: "Jaminan Pemeliharaan",
        // value: dataContractById?.maintenance_guarantee,
      },
    ],
    [dataContractById]
  );
  const handleChange = React.useCallback((state, type) => {
    // console.log(`state`, state, type);
    setDataForm((prev) => ({ ...prev, [type]: state }));
  }, []);

  const handleSubmit = () => {
    let newParams = {
      ...apiHelper.checkIsEmpty(
        "down_payment_guarantee",
        dataForm.down_payment
      ),
      ...apiHelper.checkIsEmpty(
        "implementation_guarantee",
        dataForm.implementation
      ),
      ...apiHelper.checkIsEmpty("maintenance_guarantee", dataForm.maintenance),
    };
    console.log(`dataForm`, dataForm, newParams);
    uploadGuarantee(dataContractById.id, newParams)
      .then((res) => {
        console.log(`res`, res);
        if (res?.data?.status === true) {
          setToast(res?.data?.message);
        }
      })
      .catch((err) => apiHelper.handleError(err, setToast));
    // setToast("fungsi belum tersedia" + JSON.stringify(dataForm));
  };

  return (
    <React.Fragment>
      <Toast />
      <Card>
        <CardBody>
          {dataField.map((el, id) => (
            <ItemSwitch
              key={id}
              label={el.label}
              value={dataForm[el.type]}
              type={el.type}
              onChange={(eve) => handleChange(eve, el.type)}
            />
          ))}
          <div className="d-flex justify-content-end">
            <button
              type="button"
              onClick={handleSubmit}
              className="btn btn-primary mx-1"
            >
              Kirim
            </button>
          </div>
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

export default Jaminan;
