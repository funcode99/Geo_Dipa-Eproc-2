import Button from "@material-ui/core/Button";
import React from "react";
import { Document, Page } from "react-pdf";
import UploadInput from "../../../../../../../../components/input/UploadInput";
import DialogGlobal from "../../../../../../../../components/modals/DialogGlobal";
import { openLinkTab } from "../../../../../../../../service/helper/urlHelper";

const ModalPreviewDODoc = ({ innerRef, loading, file, handleSubmit }) => {
  const [dataForm, setDataForm] = React.useState({});
  const _onChange = (file) => {
    // console.log(`file`, file);
    setDataForm(file);
  };
  const _handleSubmit = () => {
    handleSubmit(dataForm);
  };
  return (
    <DialogGlobal
      title={`Preview Signed Delivery Order`}
      ref={innerRef}
      onYes={_handleSubmit}
      textYes={"Kirim"}
      loading={loading}
      isCancel={false}
      btnYesProps={{
        disabled: Object.keys(dataForm).length === 0,
      }}
    >
      <UploadInput value={dataForm} onChange={_onChange} />
    </DialogGlobal>
  );
};

export default ModalPreviewDODoc;
