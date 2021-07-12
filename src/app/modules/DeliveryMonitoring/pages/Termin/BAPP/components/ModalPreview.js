import React from "react";
import { Document, Page } from "react-pdf";
import UploadInput from "../../../../../../components/input/UploadInput";
import Button from "@material-ui/core/Button";

import DialogGlobal from "../../../../../../components/modals/DialogGlobal";
import { Checkbox, FormControlLabel } from "@material-ui/core";
import { Form } from "react-bootstrap";

const ModalPreview = ({
  innerRef,
  loading,
  title,
  withRemarks,
  handleSubmit,
}) => {
  function onDocumentLoadSuccess({ numPages }) {
    // setNumPages(numPages);
  }
  const [checked, setChecked] = React.useState(false);
  const [remarks, setRemarks] = React.useState(false);

  const handleCheck = () => {
    setChecked((prev) => !prev);
  };
  const handleRemarksChange = (e) => {
    setRemarks(e.target.value);
  };
  const _handleSubmit = () => {
    handleSubmit({ remarks });
  };
  return (
    <DialogGlobal
      title={title || `Approve Signed Document`}
      ref={innerRef}
      onYes={_handleSubmit}
      textYes={withRemarks ? "Tolak" : "Terima"}
      textNo={"Batalkan"}
      loading={loading}
      btnYesProps={{
        // loading: loading,
        className: withRemarks
          ? "bg-danger text-light"
          : "bg-primary text-light",
        disabled: !checked || (withRemarks && remarks === false),
      }}
      btnNoProps={{
        // loading: loading,
        className: "bg-secondary text-secondary",
      }}
      btnAction={
        <Button
          onClick={() => {
            window.open(
              "http://192.168.0.168:5000/task-document/BAPPBAST.pdf",
              "_blank"
            );
          }}
          style={{ marginRight: "auto" }}
        >
          LIHAT DOKUMEN SELENGKAPNYA (DUMMY)
        </Button>
      }
    >
      {/* <div
        style={{
          overflowY: "auto",
        }}
      >
        <Document
          file={"http://192.168.0.168:5000/task-document/BAPPBAST.pdf"}
          onLoadSuccess={onDocumentLoadSuccess}
        >
          <Page pageNumber={1} width={150} />
        </Document>
      </div> */}
      {withRemarks && (
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
        label="Saya telah meninjau ulang dokumen BAPP dengan seksama."
      />
    </DialogGlobal>
  );
};

export default ModalPreview;
