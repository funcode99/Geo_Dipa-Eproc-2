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
import { DEV_NODE } from "../../../../../../../redux/BaseHost";
import validation from "../../../../../../service/helper/validationHelper";
import { FormattedMessage } from "react-intl";
import * as Yup from "yup";
import { set_contract_id } from "app/modules/AddendumContract/_redux/addendumContractSlice";
import { actionTypes } from "app/modules/AddendumContract/_redux/addendumContractAction";

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
  saveContractById,
  setToast,
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

  const handleRefresh = () => {
    fetch_api_sg({
      key: keys.get,
      type: "get",
      url: `/delivery/contract/${contractId}`,
      onSuccess: (res) => {
        set_contract_id(res.data);
      },
    });
  };

  const getContractById = React.useCallback(() => {
    fetch_api_sg({
      key: keys.get_cont,
      type: "get",
      url: `/delivery/contract/${contractId}`,
      onSuccess: (res) => {
        saveContractById(res?.data);
      },
    });
  }, [saveContractById, fetch_api_sg, contractId]);

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
        getContractById();
      },
    });
  };

  return (
    <Card>
      <CardBody>
        {!loadings.cont && (
          <FormBuilder
            loading={loadings.post}
            onSubmit={_handleSubmit}
            validation={formValidation}
            formData={fieldKickOff(setToast)}
            initial={initValues}
            fieldProps={{
              listOptions: docOptions,
              readOnly: !isClient,
            }}
            withSubmit={isClient}
          />
        )}
      </CardBody>
    </Card>
  );
};

const keys = {
  post: "post-contract_start",
  get: "contract-by-id",
  get_cont: "key-contract",
};

const mapState = (state) => ({
  loadings: {
    post: getLoading(state, keys.post),
    get: getLoading(state, keys.get),
    cont: getLoading(state, keys.get_cont),
  },
  contractId: state.deliveryMonitoring.dataContractById.id,
  contractStart: state.deliveryMonitoring.dataContractById.contract_start,
  status: state.auth.user.data.status,
});

const mapDispatch = (dispatch) => ({
  saveContractById: (payload) =>
    dispatch({
      type: actionTypes.SetContractById,
      payload,
    }),
  fetch_api_sg: (payload) => dispatch(fetch_api_sg(payload)),
  set_contract_id: (payload) => dispatch(set_contract_id, payload),
});

export default connect(mapState, mapDispatch)(KickOffDetail);
