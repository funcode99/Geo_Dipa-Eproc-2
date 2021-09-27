import Button from "@material-ui/core/Button";
import React from "react";
import { Document, Page } from "react-pdf";
import DialogGlobal from "../../../../../../components/modals/DialogGlobal";

const ModalApproveGR = ({ gr, innerRef, loading, onSubmit }) => {
  const _handleSubmit = () => {
    if (typeof onSubmit === "function") onSubmit();
  };
  return (
    <DialogGlobal
      title={`Post ${gr} to SAP ?`}
      ref={innerRef}
      onYes={_handleSubmit}
      textYes={"Kirim"}
      loading={loading}
      isCancel={false}
    >
      <span>{`Anda akan mengirim ${gr} ke SAP`}</span>
    </DialogGlobal>
  );
};

export default ModalApproveGR;
