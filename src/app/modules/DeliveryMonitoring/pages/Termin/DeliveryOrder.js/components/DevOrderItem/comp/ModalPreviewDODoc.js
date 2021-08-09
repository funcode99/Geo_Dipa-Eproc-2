import {
  Button,
  ButtonGroup,
  Checkbox,
  FormControlLabel,
} from "@material-ui/core";
import React from "react";
import { FormattedMessage } from "react-intl";
import PDFPreview from "../../../../../../../../components/builder/PDFPreview";
import ButtonContained from "../../../../../../../../components/button/ButtonGlobal";
import DialogGlobal from "../../../../../../../../components/modals/DialogGlobal";
import { openLinkTab } from "../../../../../../../../service/helper/urlHelper";
import { Form } from "react-bootstrap";

const ModalPreviewDODoc = ({ innerRef, loading, file, handleSubmit }) => {
  const [dataForm, setDataForm] = React.useState({});
  const [action, setAction] = React.useState(null);
  const [checked, setChecked] = React.useState(false);
  const [remarks, setRemarks] = React.useState(false);

  const _openFile = () => {
    // openLinkTab("http://192.168.0.168:5000/task-document/BAPPBAST.pdf");
    if (file) openLinkTab(file);
  };
  const _handleSubmit = () => {
    console.log(`data`, remarks, action);
    if (typeof handleSubmit === "function")
      handleSubmit({
        remarks,
        action,
        clean: () => {
          setAction(null);
          setRemarks(false);
          setChecked(false);
        },
      });
  };
  const _changeAction = (type) => {
    setAction(type);
  };
  const handleCheck = () => {
    setChecked((prev) => !prev);
  };
  const handleRemarksChange = (e) => {
    setRemarks(e.target.value);
  };
  const isReject = action === "reject";
  const isApprove = action === "approve";
  return (
    <DialogGlobal
      title={`Preview Signed Delivery Order`}
      ref={innerRef}
      onYes={_handleSubmit}
      textYes={<FormattedMessage id={"BUTTON.SUBMIT"} />}
      loading={loading}
      isCancel={false}
      btnYesProps={{
        disabled: !Boolean(
          (isApprove && checked) || (isReject && remarks && checked)
        ),
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <PDFPreview file={file} />
        <ButtonContained
          onClick={_openFile}
          className={"my-5"}
          baseColor={"warning"}
        >
          Lihat Dokumen
        </ButtonContained>
      </div>
      <div>
        <ButtonGroup aria-label="Pick Action">
          <Button
            onClick={() => _changeAction("approve")}
            variant={isApprove ? "contained" : undefined}
            className={isApprove ? "bg-success text-light" : ""}
          >
            Approve
          </Button>
          <Button
            onClick={() => _changeAction("reject")}
            variant={isReject ? "contained" : undefined}
            className={isReject ? "bg-danger text-light" : ""}
          >
            Reject
          </Button>
        </ButtonGroup>
        {isReject && (
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
            "Saya telah meninjau ulang dokumen Delivery Order dengan seksama."
          }
        />
      </div>
    </DialogGlobal>
  );
};

export default ModalPreviewDODoc;
