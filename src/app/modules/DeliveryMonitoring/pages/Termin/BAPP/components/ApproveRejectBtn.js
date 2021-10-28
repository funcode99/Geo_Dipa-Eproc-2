import React, { forwardRef } from "react";
import { Button, ButtonGroup } from "@material-ui/core";
import { Form } from "react-bootstrap";
import BasicInput from "../../../../../../components/input/BasicInput";

const ApproveRejectBtn = forwardRef(({}, ref) => {
  const [action, setAction] = React.useState("approve");
  const [remarks, setRemarks] = React.useState();
  const isReject = action === "reject";
  const isApprove = action === "approve";
  const _changeAction = (type) => {
    setAction(type);
  };
  const handleRemarksChange = (e) => {
    setRemarks(e);
  };
  React.useImperativeHandle(ref, () => ({ isApprove, remarks }));
  return (
    <div>
      <ButtonGroup
        aria-label="Pick Action"
        style={{
          height: 38,
          // marginTop: 103,
          marginBottom: 24,
        }}
      >
        <Button
          onClick={() => _changeAction("approve")}
          variant={isApprove ? "contained" : undefined}
          className={isApprove ? "bg-success text-light" : ""}
        >
          Tepat Waktu
        </Button>
        <Button
          onClick={() => _changeAction("reject")}
          variant={isReject ? "contained" : undefined}
          className={isReject ? "bg-danger text-light" : ""}
        >
          Terlambat
        </Button>
      </ButtonGroup>
      {isReject && (
        <div className="form-group row">
          <label className={`col-sm-4 col-form-label`}>remarks</label>
          <div className={`col-sm-8`}>
            <BasicInput
              name={"remarks"}
              label={"Remarks"}
              onChange={handleRemarksChange}
              // value={remarks}
              // disabled
              //   defaultValue={remarks}
            />
          </div>
        </div>
      )}
      {/* {isReject && (
        <Form.Group
          style={{ width: "100%" }}
          className="my-3 "
          controlId="formBasicEmail"
        >
          <Form.Label>Keterangan pendukung</Form.Label>
          <Form.Control
            type="input"
            onChange={handleRemarksChange}
            placeholder="Masukkan Keterangan"
          />
        </Form.Group>
      )} */}
    </div>
  );
});

export default ApproveRejectBtn;
