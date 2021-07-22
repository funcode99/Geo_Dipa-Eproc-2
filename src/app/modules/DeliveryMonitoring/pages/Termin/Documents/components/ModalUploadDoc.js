import React from "react";
import { StyledModal } from "../../../../../../components/modals";
import useToast from "../../../../../../components/toast";
import * as documentOption from "../../../../../../service/Document";
import { Form, Row, Col } from "react-bootstrap";
import { InputGroup } from "react-bootstrap";
import { FormControl } from "react-bootstrap";
import ButtonSubmit from "../../../../../../components/buttonAction/ButtonSubmit";
import DialogGlobal from "../../../../../../components/modals/DialogGlobal";

const ModalUploadDoc = ({
  visible,
  onClose,
  additionalParams,
  loading,
  onSubmit,
}) => {
  const [file, setFile] = React.useState(false);
  const [remarks, setRemarks] = React.useState(false);
  const [percent, setPercent] = React.useState(0);
  const [Toast, setToast] = useToast();
  const handleSubmit = React.useCallback(() => {
    if (file !== false && remarks !== false && percent !== false)
      onSubmit({ file, remarks, percentage: percent });
    else setToast("Mohon lengkapi isian !");
  }, [onSubmit, file, remarks, percent]);
  const handleSelectChange = (e) => {
    // console.log(`e`, e.target.value);
    setFile(e.target.files[0]);
  };
  const handleRemarksChange = (e) => {
    // console.log(`e`, e.target.value);
    setRemarks(e.target.value);
  };
  const handlePercent = (e) => {
    let value = e.target.value;

    if (value <= 100) setPercent(e.target.value);
    else setPercent(100);
  };
  return (
    <React.Fragment>
      <Toast />

      {/* <StyledModal visible={visible} onClose={onClose} minWidth="30vw"> */}
      <DialogGlobal
        title={"Upload Dokumen"}
        visible={visible}
        onClose={onClose}
        onYes={handleSubmit}
        textYes={"Submit"}
        loading={loading}
        isCancel={false}
        btnYesProps={{
          disabled: file === false && remarks === false,
          // className: "btn btn-primary",
        }}
      >
        {/* <form onSubmit={() => onSubmit(optionSelected)}> */}
        <div className="d-flex align-items-start">
          {/* <h3>Upload Dokumen</h3> */}
          <h6> Silahkan pilih dokumen yang akan di-upload</h6>
        </div>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Keterangan pendukung</Form.Label>
            <Form.Control
              type="input"
              onChange={handleRemarksChange}
              placeholder="Masukkan Keterangan"
            />
          </Form.Group>
          {additionalParams?.isPeriodic && (
            <InputGroup className="mb-3">
              <FormControl
                style={{
                  width: 80,
                  flex: "none",
                }}
                onChange={handlePercent}
                value={percent}
                type="number"
                min="0.1"
                step="0.1"
                placeholder={"Masukkan Persentase"}
                aria-label="Amount (to the nearest dollar)"
              />
              <InputGroup.Append>
                <InputGroup.Text>%</InputGroup.Text>
              </InputGroup.Append>
            </InputGroup>
          )}
          <Form.Group controlId="file-attachment">
            <Form.Label>File Dokumen</Form.Label>
            <Form.File onChange={handleSelectChange} size="sm" />
          </Form.Group>
        </Form>
        {/* <div className="d-flex mt-5">
          <ButtonSubmit
            handleSubmit={handleSubmit}
            disabled={file === false && remarks === false}
            loading={loading}
            classBtn={"ml-auto"}
          />
          <button
            disabled={file === false && remarks === false}
            onClick={handleSubmit}
            className="btn btn-primary ml-auto"
          >
            Kirim
          </button>
        </div> */}
        {/* </form> */}
      </DialogGlobal>
      {/* </StyledModal> */}
    </React.Fragment>
  );
};

export default ModalUploadDoc;
