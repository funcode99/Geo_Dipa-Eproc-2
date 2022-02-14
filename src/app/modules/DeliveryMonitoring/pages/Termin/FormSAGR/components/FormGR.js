import React from "react";
import { object } from "yup";
import FormBuilder from "../../../../../../components/builder/FormBuilder";
import { formatUpdateDate } from "../../../../../../libs/date";
import validation from "../../../../../../service/helper/validationHelper";
import { TerminPageContext } from "../../TerminPageNew/TerminPageNew";
import { gr_field } from "./DUMMY_DATA";
import ModalApproveGR from "./ModalApproveGR";
import { number } from "yup";
import NoDataBox from "../../../../../../components/boxes/NoDataBox/NoDataBox";

const validationSchema = object().shape({
  header_tx: validation.require("Header Text"),
  post_date: validation.require("Header Text"),
  gr_receipt: validation.require("Goods Recipient"),
  ref_doc_no: validation.require("Ref Doc No"),
  // ref_doc_no: number()
  //   // .max(16, "Maksimal 16 karakter")
  //   .test("len", "Maksimal 16 karakter", (val) => {
  //     if (val) {
  //       if (val.toString().length <= 16) return true;
  //       else return false;
  //     } else {
  //       return false;
  //     }
  //   })
  //   .required("Ref Doc No harus diisi")
  //   .typeError("Masukkan harus berupa angka"),
  bill_of_lading: validation.require("Bill of Lading"),
  unload_pt: validation.require("Unloading"),
});

const FormGR = ({
  fetch_api_sg,
  loadings_sg,
  onRefresh,
  keys,
  dataSAGR,
  isItemExists,
}) => {
  const refModal = React.useRef();
  const refModal2 = React.useRef();
  const { task_id } = React.useContext(TerminPageContext);
  const grExist = Boolean(dataSAGR.gr);
  const dataGR = dataSAGR?.gr;
  const _handleSubmit = (data) => {
    const params = {
      gr_receipt: data.gr_receipt,
      unload_pt: data.unload_pt,
      header_txt: data.header_tx,
      ref_doc_no: data.ref_doc_no,
      bill_of_lading: data.bill_of_lading,
      posting_date: data.post_date,
    };
    console.log(`data`, params);
    fetch_api_sg({
      key: keys.upload_gr,
      type: "post",
      alertAppear: "both",
      url: `delivery/task-gr/${task_id}`,
      params,
      onSuccess: (res) => {
        onRefresh();
      },
    });
  };

  const _fetchToSAP = (type) => {
    console.log(`submitt`, type);
    fetch_api_sg({
      key: keys.post_to_sap,
      type: "post",
      alertAppear: "both",
      url: `delivery/sap/${type}/${task_id}`,
      onSuccess: (res) => {
        onRefresh();
        refModal.current.close();
        refModal2.current.close();
      },
    });
  };

  const initial = React.useMemo(
    () => ({
      header_tx: dataGR?.header_txt,
      post_date: formatUpdateDate(dataGR?.posting_date),
      ...dataGR,
    }),
    [dataGR]
  );
  if (!isItemExists) {
    return <NoDataBox text={"Form Good Receipt not Available"} />;
  }

  return (
    <div>
      <FormBuilder
        loading={loadings_sg[keys.upload_gr]}
        onSubmit={_handleSubmit}
        formData={gr_field}
        validation={validationSchema}
        initial={initial}
        fieldProps={
          {
            // readOnly: grExist,
          }
        }
        // btnChildren={
        //   <React.Fragment>
        //     {dataSAGR?.gr_status?.gr_101 == true && (
        //       <button
        //         onClick={() => refModal.current.open()}
        //         className={`btn btn-sm btn-label-warning btn-bold mr-3`}
        //       >
        //         Post GR 101
        //       </button>
        //     )}
        //     {dataSAGR?.gr_status?.gr_103 == true && (
        //       <button
        //         onClick={() => refModal2.current.open()}
        //         className={`btn btn-sm btn-label-success btn-bold mr-3`}
        //       >
        //         Post GR 103
        //       </button>
        //     )}
        //   </React.Fragment>
        // }
      />
      <ModalApproveGR
        innerRef={refModal}
        gr={"GR 101"}
        onSubmit={() => _fetchToSAP("gr-101")}
      />
      <ModalApproveGR
        innerRef={refModal2}
        gr={"GR 103"}
        onSubmit={() => _fetchToSAP("gr-103")}
      />
    </div>
  );
};

export default FormGR;
