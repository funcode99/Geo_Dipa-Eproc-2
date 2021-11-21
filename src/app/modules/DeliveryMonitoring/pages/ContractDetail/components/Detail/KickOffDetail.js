import React from "react";
// import { MODAL } from "../../../../../../../service/modalSession/ModalService";
import {
  Card,
  CardBody,
} from "../../../../../../../_metronic/_partials/controls";
import FormBuilder from "../../../../../../components/builder/FormBuilder";
import { fieldKickOff, docOptions } from "./fieldData";
import { connect } from "react-redux";
import {
  fetch_api_sg,
  getLoading,
} from "../../../../../../../redux/globalReducer";
import { formatInitialDate } from "../../../../../../libs/date";
import validation from "../../../../../../service/helper/validationHelper";
import { FormattedMessage } from "react-intl";
import * as Yup from "yup";
import { set_contract_id } from "../../../../_redux/deliveryMonitoringSlice";
import { DEV_NODE } from "../../../../../../../redux/BaseHost";

const formValidation = Yup.object().shape({
  // po_document: validation.string(
  //   <FormattedMessage id="TITLE.CHOOSE_PO_DOCUMENT" />
  // ),
  // docType: validation.string(
  //   <FormattedMessage id="TITLE.SELECT_DOCUMENT_TYPE" />
  // ),
  // docFile: validation.string(
  //   <FormattedMessage id="TITLE.CHOOSE_DOCUMENT_FILE" />
  // ),
  // docDate: validation.date(
  //   <FormattedMessage id="TITLE.DOUMENT_DATE_IS_REQUIRED" />
  // ),
  contract_type: validation.string(
    <FormattedMessage id="TITLE.SELECT_CONTRACT_TYPE" />
  ),
});

const setDefaultSelect = (options, name) => {
  return docOptions[options].find((item) => item.value === name);
};

const KickOffDetail = ({
  loadings,
  fetch_api_sg,
  contractId,
  contractStart,
  status,
}) => {
  const isClient = status === "client";

  const initValues = React.useMemo(
    () => ({
      // docType: setDefaultSelect("docType", contractStart?.name) || "",
      // docFile: contractStart?.file ? DEV_NODE + "/" + contractStart?.file : "",
      // docDate: contractStart?.date || formatInitialDate(),
      po_document: contractStart?.po_document
        ? {
            path_preview: contractStart?.po_document,
          }
        : {
            path_preview: "",
          },
      skpp_document: contractStart?.skpp_document
        ? {
            path_preview: contractStart?.skpp_document,
          }
        : {
            path_preview: "",
          },
      // skpp_date: contractStart?.skpp_date || formatInitialDate(),
      skpp_date: contractStart?.skpp_date || "",
      spmk_document: contractStart?.spmk_document
        ? {
            path_preview: contractStart?.spmk_document,
          }
        : {
            path_preview: "",
          },
      spmk_date: contractStart?.spmk_date || "",
      contract_type:
        setDefaultSelect("contract_type", contractStart?.contract_type) || "",
    }),
    [contractStart]
  );

  const _handleSubmit = (data) => {
    fetch_api_sg({
      key: keys.post,
      type: "postForm",
      alertAppear: "both",
      url: `/delivery/contract/${contractId}/contract-start`,
      params: {
        po_document: data.po_document.data,
        skpp_document: data.skpp_document.data,
        skpp_date: data.skpp_date,
        spmk_document: data.spmk_document.data,
        spmk_date: data.spmk_date,
        contract_type: data.contract_type.value,
      },
      onSuccess: () => {
        handleRefresh();
      },
    });
  };

  const handleRefresh = () => {
    fetch_api_sg({
      key: keys.get,
      type: "get",
      url: `/delivery/contract/${contractId}`,
      onSuccess: (res) => {
        // console.log(`res`, res);
        set_contract_id(res.data);
      },
    });
  };

  return (
    <Card>
      <CardBody>
        <FormBuilder
          loading={loadings.post}
          onSubmit={
            _handleSubmit
            //   () => {
            //   MODAL.showSnackbar("FUNGSI INI BELUM TERSEDIA", "warning", 5000);
            // }
          }
          validation={formValidation}
          formData={fieldKickOff}
          initial={initValues}
          fieldProps={{
            listOptions: docOptions,
            readOnly: !isClient,
          }}
          withSubmit={isClient}
        />
      </CardBody>
    </Card>
  );
};

const keys = {
  post: "post-contract_start",
  get: "contract-by-id",
};

const mapState = (state) => ({
  loadings: {
    post: getLoading(state, keys.post),
    get: getLoading(state, keys.get),
  },
  contractId: state.deliveryMonitoring.dataContractById.id,
  contractStart: state.deliveryMonitoring.dataContractById.contract_start,
  status: state.auth.user.data.status,
});

const mapDispatch = {
  fetch_api_sg,
  set_contract_id,
};

export default connect(mapState, mapDispatch)(KickOffDetail);
