import React from "react";
import { StyledModal } from "../../../../../../components/modals";
import useToast from "../../../../../../components/toast";
import * as documentOption from "../../../../../../service/Document";
import { Form, Row, Col } from "react-bootstrap";

const ModalUploadDoc = ({ visible, onClose, onSubmit }) => {
  const [file, setFile] = React.useState(false);
  const [Toast, setToast] = useToast();
  const handleSubmit = React.useCallback(() => {
    if (file !== false) onSubmit(file);
    else setToast("Mohon masukkan dokumen !");
  }, [onSubmit, file]);
  const handleSelectChange = (e) => {
    console.log(`e`, e.target.value);
    setFile(e.target.files[0]);
  };
  return (
    <React.Fragment>
      <Toast />

      <StyledModal visible={visible} onClose={onClose} minWidth="30vw">
        {/* <form onSubmit={() => onSubmit(optionSelected)}> */}
        <div className="d-flex align-items-start flex-column">
          <h3>Upload Dokumen</h3>
          <h6> Silahkan pilih dokumen yang akan di-upload</h6>
        </div>
        <Form>
          <Form.Group controlId="file-attachment">
            <Form.Label>Attachment</Form.Label>
            <Form.File onChange={handleSelectChange} size="sm" />
          </Form.Group>
        </Form>
        <div className="d-flex mt-5">
          <button
            disabled={file === false}
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

export default ModalUploadDoc;
