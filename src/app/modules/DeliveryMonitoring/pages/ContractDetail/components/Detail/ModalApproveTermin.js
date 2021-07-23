import React from "react";
import DialogGlobal from "../../../../../../components/modals/DialogGlobal";
import { Checkbox, FormControlLabel } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import { Form } from "react-bootstrap";

const ModalApproveTermin = React.forwardRef(({ isReject }, ref) => {
  const [checked, setChecked] = React.useState(false);
  const [remarks, setRemarks] = React.useState(false);

  const [terminTitle, setTerminTitle] = React.useState("");
  const innerRef = React.useRef();

  const handleCheck = () => {
    setChecked((prev) => !prev);
  };
  const _handleSubmit = () => {
    console.log(`submitted ====> NO FUNCTION`);
  };

  const handleRemarksChange = (e) => {
    setRemarks(e.target.value);
  };

  const _handleTerminTitle = (text) => {
    setTerminTitle(text);
    setTimeout(() => innerRef.current.open(), 50);
  };

  React.useImperativeHandle(ref, () => ({ open: _handleTerminTitle }));
  return (
    <DialogGlobal
      ref={innerRef}
      title={"Persetujuan Termin (UNDER DEVELOPMENT)"}
      textYes={
        <FormattedMessage id={isReject ? "TITLE.REJECT" : "TITLE.APPROVE"} />
      }
      // textNo={<FormattedMessage id="TITLE.CANCEL" />}
      onYes={_handleSubmit}
      btnYesProps={{
        className: isReject
          ? "bg-danger text-light"
          : checked
          ? "bg-primary text-light"
          : "bg-secondary",
        disabled: !checked || (isReject && remarks === false),
      }}
      isCancel={false}
    >
      {isReject && (
        <Form.Group
          style={{ width: "100%" }}
          className="mb-3 "
          controlId="formBasicEmail"
        >
          <Form.Label>Keterangan pendukung</Form.Label>
          <Form.Control
            type="input"
            onChange={handleRemarksChange}
            placeholder="Masukkan Keterangan"
          />
        </Form.Group>
      )}
      <FormControlLabel
        control={
          <Checkbox
            checked={checked}
            onChange={handleCheck}
            name="checkedB"
            color="primary"
          />
        }
        label={
          <FormattedMessage
            id="TITLE.I_REJECTED"
            values={{ termTitle: terminTitle }}
          />
        }
        // label={`Dengan ini saya menyetujui termin \"${terminTitle}\" `}
      />
    </DialogGlobal>
  );
});

export default ModalApproveTermin;
