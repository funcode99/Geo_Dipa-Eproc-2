import { CircularProgress } from "@material-ui/core";
import React from "react";
import { FormControl } from "react-bootstrap";
import { InputGroup } from "react-bootstrap";
import { StyledModal } from "../../modals";

const ModalConfirmation = ({
  visible = false,
  onClose,
  onSubmit,
  title,
  subTitle,
  textYes,
  textNo,
  additionalParams,
  children,
  submitColor = "primary",
  loading = false,
  ...other
}) => {
  const _handleSubmit = React.useCallbackm(() => visible && onSubmit(), [
    onSubmit,
  ]);
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
      {children}
      <div className="d-flex justify-content-center mt-9">
        <button
          disabled={loading}
          className={`btn btn-${submitColor} mr-8`}
          onClick={onSubmit}
        >
          {loading ? (
            <CircularProgress size="0.875rem" color="inherit" />
          ) : (
            textYes
          )}
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
