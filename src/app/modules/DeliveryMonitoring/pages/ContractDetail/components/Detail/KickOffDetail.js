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
  docType: validation.string(
    <FormattedMessage id="TITLE.SELECT_DOCUMENT_TYPE" />
  ),
  docFile: validation.string(
    <FormattedMessage id="TITLE.CHOOSE_DOCUMENT_FILE" />
  ),
  docDate: validation.date(
    <FormattedMessage id="TITLE.DOUMENT_DATE_IS_REQUIRED" />
  ),
});

const setDefaultDocType = (name) => {
  return docOptions.docType.find((item) => item.value === name);
};

const KickOffDetail = ({
  loadings,
  fetch_api_sg,
  contractId,
  contractStart,
}) => {
  console.log(`contractStart`, contractStart);
  const initValues = React.useMemo(
    () => ({
      docType: setDefaultDocType(contractStart?.name) || "",
      docFile: DEV_NODE + "/" + contractStart?.file || "",
      docDate: contractStart?.date || formatInitialDate(),
    }),
    [contractStart]
  );

  const _handleSubmit = (data) => {
    fetch_api_sg({
      key: keys.post,
      type: "postForm",
      alertAppear: "both",
      url: `/delivery/contract/${contractId}/upload-contract-start`,
      params: {
        name: data.docType.value,
        file: data.docFile.data,
        date: data.docDate,
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
          }}
        ></FormBuilder>
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
});

const mapDispatch = {
  fetch_api_sg,
  set_contract_id,
};

export default connect(mapState, mapDispatch)(KickOffDetail);
