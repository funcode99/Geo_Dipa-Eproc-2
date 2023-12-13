import {
  Button,
  ButtonGroup,
  Checkbox,
  FormControlLabel,
} from "@material-ui/core";
import React from "react";
import { Form } from "react-bootstrap";
import { FormattedMessage } from "react-intl";
import FormBuilder from "../../../../../../../../components/builder/FormBuilder";
import PDFPreview from "../../../../../../../../components/builder/PDFPreview";
import ButtonContained from "../../../../../../../../components/button/ButtonGlobal";
import DialogGlobal from "../../../../../../../../components/modals/DialogGlobal";
import { openLinkTab } from "../../../../../../../../service/helper/urlHelper";
import { form_gr } from "../formDataOItem";
import { isEmpty } from "lodash";

const hasNoMaterialItem = (data) => {
  const filteredData = data?.task_delivery_items?.filter(
    ({ item }, id) =>
      !!(
        isEmpty(item?.material) ||
        item?.material === "undefined" ||
        item?.material === "null"
      )
  );
  return !!filteredData?.length;
};

const ModalPreviewDODoc = ({
  innerRef,
  loading,
  file,
  isClient,
  handleSubmit,
  isFileApproved,
  data,
}) => {
  const [dataForm, setDataForm] = React.useState({});
  const [action, setAction] = React.useState(null);
  const [checked, setChecked] = React.useState(false);
  const [remarks, setRemarks] = React.useState(false);
  const grFormRef = React.useRef();
  const hasMaterialItem = !hasNoMaterialItem(data);

  const _openFile = () => {
    // openLinkTab("http://192.168.0.168:5000/task-document/BAPPBAST.pdf");
    if (file) openLinkTab(file);
  };
  const _handleSubmit = () => {
    if (!!grFormRef.current?.handleSubmit) grFormRef.current.handleSubmit();
    else _onSubmit();
  };

  const _onSubmit = (dataEvent) => {
    if (typeof handleSubmit === "function")
      handleSubmit({
        remarks,
        action,
        clean: handleClean,
        dataEvent,
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
  const handleClean = () => {
    setAction(null);
    setRemarks(false);
    setChecked(false);
  };

  React.useEffect(() => {
    handleClean();
  }, [file]);
  const isReject = action === "reject";
  const isApprove = action === "approve";
  const isNeedApprove = isClient && !isFileApproved;
  return (
    <DialogGlobal
      maxWidth={isNeedApprove ? "md" : "sm"}
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
        className={`d-flex ${
          !isNeedApprove ? "justify-content-center align-items-center" : ""
        }`}
      >
        <div
          className={`d-flex flex-column justify-content-center align-items-center`}
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
        {isNeedApprove && (
          <div className={`d-flex flex-column  ml-8 mr-3`}>
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
            {isApprove && hasMaterialItem && (
              <FormBuilder
                ref={grFormRef}
                withSubmit={false}
                formData={form_gr}
                onSubmit={_onSubmit}
              />
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
        )}
      </div>
    </DialogGlobal>
  );
};

export default ModalPreviewDODoc;
