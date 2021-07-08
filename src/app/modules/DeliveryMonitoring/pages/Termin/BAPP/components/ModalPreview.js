import React from "react";
import { Document, Page } from "react-pdf";
import UploadInput from "../../../../../../components/input/UploadInput";
import Button from "@material-ui/core/Button";

import DialogGlobal from "../../../../../../components/modals/DialogGlobal";

const ModalPreview = ({ innerRef }) => {
  function onDocumentLoadSuccess({ numPages }) {
    // setNumPages(numPages);
  }
  return (
    <DialogGlobal
      title={`Approve Signed Document`}
      ref={innerRef}
      onYes={() => {}}
      textYes={"Terima"}
      textNo={"Tolak"}
      btnAction={
        <Button
          onClick={() => {
            window.open(
              "http://192.168.0.168:5000/task-document/BAPPBAST.pdf",
              "_blank"
            );
          }}
          style={{ marginRight: "auto" }}
        >
          LIHAT DOKUMEN SELENGKAPNYA
        </Button>
      }
    >
      <div
        style={{
          overflowY: "auto",
        }}
      >
        <Document
          file={"http://192.168.0.168:5000/task-document/BAPPBAST.pdf"}
          onLoadSuccess={onDocumentLoadSuccess}
        >
          <Page pageNumber={1} width={150} />
        </Document>
      </div>
    </DialogGlobal>
  );
};

export default ModalPreview;
