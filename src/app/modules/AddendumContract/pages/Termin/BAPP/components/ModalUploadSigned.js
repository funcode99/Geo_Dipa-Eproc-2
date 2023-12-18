import Button from "@material-ui/core/Button";
import React from "react";
import { Document, Page } from "react-pdf";
import UploadInput from "../../../../../../components/input/UploadInput";
import DialogGlobal from "../../../../../../components/modals/DialogGlobal";
import { openLinkTab } from "../../../../../../service/helper/urlHelper";

const ModalUploadSigned = ({ innerRef, loading, file, handleSubmit }) => {
  const [dataForm, setDataForm] = React.useState({});
  const _onChange = (file) => {
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
      btnAction={
        file && (
          <Button
            onClick={() => {
              // window.open(
              //   "http://192.168.0.168:5000/task-document/BAPPBAST.pdf",
              //   "_blank"
              // );
              openLinkTab(file);
            }}
            style={{ marginRight: "auto" }}
          >
            LIHAT DOKUMEN LAMA
          </Button>
        )
      }
    >
      <UploadInput value={dataForm} onChange={_onChange} />
    </DialogGlobal>
  );
};

export default ModalUploadSigned;
