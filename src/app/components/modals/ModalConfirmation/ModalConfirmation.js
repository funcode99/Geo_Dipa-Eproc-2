import React from "react";
import { FormControl } from "react-bootstrap";
import { InputGroup } from "react-bootstrap";
import { StyledModal } from "../../modals";

const ModalConfirmation = ({
  visible,
  onClose,
  onSubmit,
  title,
  subTitle,
  textYes,
  textNo,
  additionalParams,
  ...other
}) => {
  const _handleSubmit = React.useCallback(() => visible && onSubmit(), [
    onSubmit,
  ]);
  // console.log(`other`, other);
  return (
    <StyledModal visible={visible} onClose={onClose} minWidth="30vw">
      <div className="d-flex align-items-center flex-column">
        <h3>{title}</h3>
        <h6>{subTitle}</h6>
        {additionalParams?.isPeriodic && (
          <React.Fragment>
            <label htmlFor="basic-url">Persentase</label>
            <InputGroup className="mb-3" style={{ width: 100 }}>
              <FormControl
                defaultValue={"20"}
                placeholder={"Masukkan Persentase"}
                aria-label="Amount (to the nearest dollar)"
              />
              <InputGroup.Append>
                <InputGroup.Text>%</InputGroup.Text>
              </InputGroup.Append>
            </InputGroup>
          </React.Fragment>
        )}
      </div>
      <div className="d-flex justify-content-center mt-9">
        <button className="btn btn-primary  mr-8" onClick={onSubmit}>
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

export default ModalConfirmation;
