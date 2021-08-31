import React from "react";
import FormBuilder from "../../../../../../components/builder/FormBuilder";
import { gr_field } from "./DUMMY_DATA";
import { object } from "yup";
import validation from "../../../../../../service/helper/validationHelper";
import { TerminPageContext } from "../../TerminPageNew/TerminPageNew";

const validationSchema = object().shape({
  header_tx: validation.require("Header Text"),
  gr_receipt: validation.require("GR Receipt"),
  ref_doc_no: validation.require("Ref Doc No"),
  bill_of_lading: validation.require("Bill of Lading"),
  unload_pt: validation.require("Unload PT"),
});

const FormGR = ({ fetch_api_sg, loadings_sg, keys }) => {
  const { task_id } = React.useContext(TerminPageContext);
  const _handleSubmit = (data) => {
    const params = {
      gr_receipt: data.gr_receipt,
      unload_pt: data.unload_pt,
      header_txt: data.header_tx,
      ref_doc_no: data.ref_doc_no,
      bill_of_lading: data.bill_of_lading,
    };
    console.log(`data`, params);
    fetch_api_sg({
      key: keys.upload_sa,
      type: "post",
      alertAppear: "both",
      url: `delivery/task-gr/${task_id}`,
      params,
    });
  };

  //   console.log(`loading`, loadings_sg[keys.upload_sa]);

  return (
    <div>
      <FormBuilder
        loading={loadings_sg[keys.upload_sa]}
        onSubmit={_handleSubmit}
        formData={gr_field}
        validation={validationSchema}
      />
    </div>
  );
};

export default FormGR;
