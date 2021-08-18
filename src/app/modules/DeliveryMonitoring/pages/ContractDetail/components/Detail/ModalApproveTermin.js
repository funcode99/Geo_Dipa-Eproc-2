import React from "react";
import DialogGlobal from "../../../../../../components/modals/DialogGlobal";
import { Checkbox, FormControlLabel } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import { Form } from "react-bootstrap";

const ModalApproveTermin = React.forwardRef(
  ({ isReject, loading, onSubmit }, ref) => {
    const [checked, setChecked] = React.useState(false);
    const [remarks, setRemarks] = React.useState(false);
    const [dataProps, setDataProps] = React.useState({});

    const [terminTitle, setTerminTitle] = React.useState("");
    const innerRef = React.useRef();

    const handleCheck = () => {
      setChecked((prev) => !prev);
    };
    const _handleSubmit = () => {
      if (typeof onSubmit === "function")
        onSubmit({ ...dataProps, remarks_fill: remarks });
      console.log(`submitted ====> NO FUNCTION`, dataProps);
    };

    const handleRemarksChange = (e) => {
      setRemarks(e.target.value);
    };

    const _handleTerminTitle = (terminProps) => {
      // setTerminTitle(text);
      setDataProps(terminProps);
      setTimeout(() => innerRef.current.open(), 50);
    };

    const close = () => innerRef.current.close();

    React.useImperativeHandle(ref, () => ({ open: _handleTerminTitle, close }));
    return (
      <DialogGlobal
        ref={innerRef}
        title={"Persetujuan Termin"}
        textYes={
          <FormattedMessage id={isReject ? "TITLE.REJECT" : "TITLE.APPROVE"} />
        }
        loading={loading}
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
              id={isReject ? "TITLE.I_REJECTED" : "TITLE.I_APPROVED"}
              values={{ termTitle: dataProps?.name }}
            />
          }
          // label={`Dengan ini saya menyetujui termin \"${terminTitle}\" `}
        />
      </DialogGlobal>
    );
  }
);

export default ModalApproveTermin;
