import React from "react";
import { Document, Page } from "react-pdf";
import UploadInput from "../../../../../../components/input/UploadInput";
import DialogGlobal from "../../../../../../components/modals/DialogGlobal";

const ModalUploadSigned = ({ innerRef, loading, handleSubmit }) => {
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
      title={`Upload Signed Document`}
      ref={innerRef}
      onYes={_handleSubmit}
      textYes={"Kirim"}
      loading={loading}
      btnYesProps={
        {
          // loading: loading,
        }
      }
      //   {...other}
    >
      <UploadInput value={dataForm} onChange={_onChange} />
    </DialogGlobal>
  );
};

export default ModalUploadSigned;
