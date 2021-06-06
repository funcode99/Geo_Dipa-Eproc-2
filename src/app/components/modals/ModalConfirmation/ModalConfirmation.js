import React from "react";
import { StyledModal } from "../../modals";

const ModalConfirmation = ({
  visible,
  onClose,
  onSubmit,
  title,
  subTitle,
  textYes,
  textNo,
}) => {
  return (
    <StyledModal visible={visible} onClose={onClose} minWidth="30vw">
      <div className="d-flex align-items-center flex-column">
        <h3>{title}</h3>
        <h6>{subTitle}</h6>
      </div>
      <div className="d-flex justify-content-center mt-13">
        <button className="btn btn-danger mr-8" onClick={onSubmit}>
          {textYes}
        </button>
        <button className="btn btn-light" onClick={onClose}>
          {textNo}
        </button>
      </div>
    </StyledModal>
  );
};

ModalConfirmation.defaultProps = {
  title: "Harap mengirimkan props judul",
  //   subTitle: "Harap mengirimkan props subTitle",
  textYes: "Ya, lanjutkan",
  textNo: "Batalkan",
};

export default React.memo(ModalConfirmation);
