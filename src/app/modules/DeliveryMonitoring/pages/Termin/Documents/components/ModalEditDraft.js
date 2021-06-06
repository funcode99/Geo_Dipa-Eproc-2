import React from "react";
import { Form } from "react-bootstrap";
import { StyledModal } from "../../../../../../components/modals";
import useToast from "../../../../../../components/toast";

const ModalEditDraft = ({ visible, onClose, onSubmit }) => {
  const [file, setFile] = React.useState(false);
  const [remarks, setRemarks] = React.useState(false);
  const [Toast, setToast] = useToast();
  const handleSubmit = React.useCallback(() => {
    if (file !== false && remarks !== false) onSubmit({ file, remarks });
    else setToast("Mohon masukkan dokumen !");
  }, [onSubmit, file, remarks]);
  const handleSelectChange = (e) => {
    // console.log(`e`, e.target.value);
    setFile(e.target.files[0]);
  };
  const handleRemarksChange = (e) => {
    // console.log(`e`, e.target.value);
    setRemarks(e.target.value);
  };
  return (
    <React.Fragment>
      <Toast />

      <StyledModal visible={visible} onClose={onClose} minWidth="30vw">
        {/* <form onSubmit={() => onSubmit(optionSelected)}> */}
        <div className="d-flex align-items-start flex-column">
          <h3>Upload Ulang Dokumen</h3>
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
          <Form.Group controlId="file-attachment">
            <Form.Label>File Dokumen</Form.Label>
            <Form.File onChange={handleSelectChange} size="sm" />
          </Form.Group>
        </Form>
        <div className="d-flex mt-5">
          <button
            disabled={file === false && remarks === false}
            onClick={handleSubmit}
            className="btn btn-primary ml-auto"
          >
            Kirim
          </button>
        </div>
        {/* </form> */}
      </StyledModal>
    </React.Fragment>
  );
};

export default ModalEditDraft;
