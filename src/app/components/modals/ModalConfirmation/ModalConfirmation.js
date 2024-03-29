import { CircularProgress } from "@material-ui/core";
import React from "react";
import { FormControl } from "react-bootstrap";
import { InputGroup } from "react-bootstrap";
import { StyledModal } from "../../modals";
import { Form, Row, Col } from "react-bootstrap";
import DialogGlobal from "../DialogGlobal";

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
  isReject = false,
  ...other
}) => {
  const [remarks, setRemarks] = React.useState(false);
  const [percent, setPercent] = React.useState(false);
  const _handleSubmit = React.useCallback(() => {
    if (typeof onSubmit === "function") {
      if (isReject === true && remarks !== false) onSubmit({ remarks });
      // else if (additionalParams?.isPeriodic && !isReject && percent !== false)
      // onSubmit({ percentage: percent });
      else onSubmit();
    }
  }, [onSubmit, remarks]);
  const handleRemarksChange = (e) => {
    setRemarks(e.target.value);
  };
  const handlePercentChange = (e) => {
    setPercent(e.target.value);
  };
  const disRemarks = isReject === true && remarks === false;
  React.useEffect(() => {
    if (visible === false) {
      setRemarks(false);
    }
  }, [visible]);
  return (
    // <StyledModal visible={visible} onClose={onClose} minWidth="30vw">
    <DialogGlobal
      title={title}
      visible={visible}
      onYes={_handleSubmit}
      textYes={textYes}
      textNo={textNo}
      loading={loading}
      btnYesProps={{
        // loading: loading,
        className: `btn btn-${submitColor}`,
        disabled: loading || disRemarks,
        // disabled: !checked,
      }}
      btnNoProps={{
        className: "btn btn-light",
      }}
      isCancel={false}
    >
      <div>
        {children}
        {/* <h3>{title}</h3> */}
        {subTitle && <h6>{subTitle}</h6>}
        {/* {additionalParams?.isPeriodic && !isReject && (
          <React.Fragment>
            <label htmlFor="basic-url">Persentase</label>
            <InputGroup className="mb-3" style={{ width: 121 }}>
              <FormControl
                style={{
                  width: 80,
                  flex: "none",
                }}
                onChange={handlePercentChange}
                // value={percent}
                type="number"
                min="0.1"
                step="0.1"
                // placeholder={"Masukkan Persentase"}
                // aria-label="Amount (to the nearest dollar)"
              />
              <InputGroup.Append>
                <InputGroup.Text>%</InputGroup.Text>
              </InputGroup.Append>
            </InputGroup>
          </React.Fragment>
        )} */}
        {isReject && (
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
      </div>
      {/* <div className="d-flex justify-content-center mt-9">
        <button
          disabled={loading || disRemarks}
          className={`btn btn-${submitColor} mr-8`}
          onClick={_handleSubmit}
        >
          {loading && <CircularProgress size="0.875rem" color="inherit" />}
          {textYes}
        </button>
        <button className="btn btn-light" onClick={onClose}>
          {textNo}
        </button>
      </div> */}
    </DialogGlobal>
    // {/* </StyledModal> */}
  );
};

ModalConfirmation.defaultProps = {
  title: "Harap mengirimkan props judul",
  //   subTitle: "Harap mengirimkan props subTitle",
  textYes: "Ya, lanjutkan",
  textNo: "Batalkan",
};

export default ModalConfirmation;
