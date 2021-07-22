import React from "react";
import { StyledModal } from "../../../../../../components/modals";
import DialogGlobal from "../../../../../../components/modals/DialogGlobal";

const ModalDeleteDoc = ({ visible, onClose, loading, onSubmit }) => {
  return (
    // <StyledModal visible={visible} onClose={onClose} minWidth="30vw">
    <DialogGlobal
      title={"Yakin ingin menghapus dokumen ini ?"}
      visible={visible}
      onYes={onSubmit}
      textYes={"Hapus"}
      loading={loading}
      btnYesProps={{
        className: `btn btn-danger`,
        disabled: loading,
      }}
      isCancel={false}
    >
      <div className="d-flex align-items-center ">
        {/* <h3>Yakin ingin menghapus dokumen ini ?</h3> */}
        <h6> Setelah dihapus file tidak akan lagi ditampilkan</h6>
      </div>
      {/* <div className="d-flex justify-content-center mt-13">
        <button className="btn btn-danger mr-8" onClick={onSubmit}>
          Hapus
        </button>
        <button className="btn btn-light" onClick={onClose}>
          Batalkan
        </button>
      </div> */}
    </DialogGlobal>
    // </StyledModal>
  );
};

export default ModalDeleteDoc;
