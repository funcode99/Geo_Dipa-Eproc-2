import React from "react";
import { Document, Page } from "react-pdf";
import UploadInput from "../../../../../../components/input/UploadInput";
import DialogGlobal from "../../../../../../components/modals/DialogGlobal";

const ModalUploadSigned = ({ innerRef }) => {
  //   const modalRef = React.useRef();
  const [dataForm, setDataForm] = React.useState({});
  //   React.useEffect(() => {
  //     if (visible === true) modalRef.current.open();
  //     else if (visible === false) modalRef.current.close();
  //   }, [visible]);
  const _onChange = (file) => {
    console.log(`file`, file);
    setDataForm(file);
  };
  const [numPages, setNumPages] = React.useState(null);
  const [pageNumber, setPageNumber] = React.useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }
  return (
    <DialogGlobal
      title={`Upload Signed Document`}
      ref={innerRef}
      onYes={() => {}}
      textYes={"Kirim"}
      //   {...other}
    >
      <UploadInput value={dataForm} onChange={_onChange} />
      {/* <div>
        <Document
          file={"http://192.168.0.168:5000/task-document/BAPPBAST.pdf"}
          onLoadSuccess={onDocumentLoadSuccess}
        >
          <Page pageNumber={pageNumber} width={150} height={200} />
        </Document>
      </div> */}
    </DialogGlobal>
  );
};

export default ModalUploadSigned;
