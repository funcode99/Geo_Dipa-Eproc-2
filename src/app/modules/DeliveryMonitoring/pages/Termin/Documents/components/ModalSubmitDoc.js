import React from "react";
import { StyledModal } from "../../../../../../components/modals";
import { DocumentsContext } from "../Documents";

const ModalSubmitDoc = () => {
  const { open, handleVisible, handleApi } = React.useContext(DocumentsContext);
  const onClose = React.useCallback(() => {
    handleVisible("submit");
  }, [handleVisible]);
  const onSubmit = React.useCallback(() => {
    handleApi("submit");
  }, [handleApi]);

  return (
    <StyledModal visible={open.submit} onClose={onClose} minWidth="30vw">
      <div className="d-flex align-items-center flex-column">
        <h3>Yakin ingin menghapus dokumen ini ?</h3>
        <h6> Setelah dihapus file tidak akan lagi ditampilkan</h6>
      </div>
      <div className="d-flex justify-content-center mt-13">
        <button className="btn btn-danger mr-8" onClick={onSubmit}>
          Hapus
        </button>
        <button className="btn btn-light" onClick={onClose}>
          Batalkan
        </button>
      </div>
    </StyledModal>
  );
};

export default ModalSubmitDoc;
