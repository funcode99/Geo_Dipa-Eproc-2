import React from "react";
import PDFPreview from "../../../../../../../../components/builder/PDFPreview";
import ButtonContained from "../../../../../../../../components/button/ButtonGlobal";
import DialogGlobal from "../../../../../../../../components/modals/DialogGlobal";
import { openLinkTab } from "../../../../../../../../service/helper/urlHelper";

const ModalPreviewDODoc = ({ innerRef, loading, file, handleSubmit }) => {
  const [dataForm, setDataForm] = React.useState({});
  const _openFile = (file) => {
    openLinkTab("http://192.168.0.168:5000/task-document/BAPPBAST.pdf");
  };
  const _handleSubmit = () => {
    handleSubmit(dataForm);
  };
  return (
    <DialogGlobal
      title={`Preview Signed Delivery Order`}
      ref={innerRef}
      onYes={_handleSubmit}
      textYes={"Setujui"}
      onNo={_handleSubmit}
      textNo={"Tolak"}
      loading={loading}
      // isCancel={false}
      btnYesProps={{
        disabled: Object.keys(dataForm).length === 0,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <PDFPreview />
        <ButtonContained
          onClick={_openFile}
          className={"my-5"}
          baseColor={"warning"}
        >
          Lihat Dokumen
        </ButtonContained>
      </div>
    </DialogGlobal>
  );
};

export default ModalPreviewDODoc;
