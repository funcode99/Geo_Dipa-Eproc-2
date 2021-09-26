import React from "react";
import FormBuilder from "../../../../../../components/builder/FormBuilder";
import TablePaginationCustom from "../../../../../../components/tables/TablePagination";
import { gr_field, headerTableSA } from "./DUMMY_DATA";
import { object } from "yup";
import validation from "../../../../../../service/helper/validationHelper";
import { TerminPageContext } from "../../TerminPageNew/TerminPageNew";
import { formatUpdateDate } from "../../../../../../libs/date";

const validationSchema = object().shape({
  header_tx: validation.require("Header Text"),
  post_date: validation.require("Header Text"),
  gr_receipt: validation.require("GR Receipt"),
  ref_doc_no: validation.require("Ref Doc No"),
  bill_of_lading: validation.require("Bill of Lading"),
  unload_pt: validation.require("Unload PT"),
});

const FormGR = ({ fetch_api_sg, loadings_sg, onRefresh, keys, dataSAGR }) => {
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

  // console.log(`loading`, dataGR);

  const initial = React.useMemo(
    () => ({
      header_tx: dataGR?.header_txt,
      post_date: formatUpdateDate(dataGR?.posting_date),
      ...dataGR,
    }),
    [dataGR]
  );

  return (
    <div>
      <FormBuilder
        loading={loadings_sg[keys.upload_gr]}
        onSubmit={_handleSubmit}
        formData={gr_field}
        validation={validationSchema}
        initial={initial}
        fieldProps={{
          readOnly: grExist,
        }}
        btnChildren={
          <React.Fragment>
            <button
              // onClick={openChart}
              className={`btn btn-sm btn-label-warning btn-bold mr-3`}
            >
              Post GR 101 to SAP
            </button>
            <button
              // onClick={openChart}
              className={`btn btn-sm btn-label-success btn-bold mr-3`}
            >
              Post GR 103 to SAP
            </button>
          </React.Fragment>
        }
      />
    </div>
  );
};

export default FormGR;
