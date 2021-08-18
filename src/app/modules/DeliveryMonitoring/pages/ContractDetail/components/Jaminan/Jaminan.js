import { Button, CircularProgress } from "@material-ui/core";
import Send from "@material-ui/icons/Send";

import React, { PureComponent } from "react";
import { connect } from "react-redux";
import {
  fetch_api_sg,
  getLoading,
} from "../../../../../../../redux/globalReducer";
import {
  Card,
  CardBody,
} from "../../../../../../../_metronic/_partials/controls";
import ModalConfirmation from "../../../../../../components/modals/ModalConfirmation";
import apiHelper from "../../../../../../service/helper/apiHelper";
import urlHelper, {
  openLinkTab,
} from "../../../../../../service/helper/urlHelper";
import { set_contract_id } from "../../../../_redux/deliveryMonitoringSlice";
import TableGuarantee from "./components/TableGuarantee";

const BASE_MODAL_CONF = [
  {
    type: "approve",
    title: "Yakin ingin mengkonfirmasi dokumen ini ?",
    subTitle: "Pastikan dokumen yang dikirimkan telah sesuai !",
  },
  {
    type: "reject",
    title: "Yakin ingin menolak dokumen ini ?",
    subTitle: "Pastikan dokumen yang dikirimkan tidak sesuai !",
    isReject: true,
    submitColor: "danger",
  },
];

const keys = {
  list: "list-guarantee",
  upload: "upload-guarantee",
  approve: "approve-guarantee",
  reject: "reject-guarantee",
};
export const JaminanContext = React.createContext({ state: {}, keys });

export class Jaminan extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dataForm: {
        down_payment_guarantee: "",
        implementation_guarantee: "",
        maintenance_guarantee: "",
      },
      open: {
        approve: false,
        reject: false,
      },
    };
  }

  handleChange = (state, type) => {
    this.setState({
      dataForm: {
        ...this.state.dataForm,
        [type]: state,
      },
    });
  };

  handleAction = (type, params) => {
    console.log(`type`, type, params);
    switch (type) {
      case "preview": //okay
        // setType(params?.id);
        // console.log(`addbase`, urlHelper.addBaseURL(params?.item?.file));
        openLinkTab(params?.item?.file);

        // window.open(urlHelper.addBaseURL(params?.item?.file), "_blank");
        // window.open(params?.item?.file, "_blank");
        break;
      case "approve":
        // setType(params?.id);
        this.handleVisible(type, {
          approve_id: params?.item?.id,
        });
        break;
      case "reject":
        // handleModal("update", params?.id);
        this.handleVisible(type, {
          reject_id: params?.item?.id,
        });
        break;
      default:
        break;
    }
  };
  handleSubmit = () => {
    console.log(`dataForm`, this.state.dataForm);
    const { dataForm } = this.state;
    const { contractById } = this.props;
    let newParams = {
      ...apiHelper.checkIsEmpty(
        "down_payment_guarantee",
        dataForm.down_payment_guarantee,
        dataForm.down_payment_guarantee.data
      ),
      ...apiHelper.checkIsEmpty(
        "implementation_guarantee",
        dataForm.implementation_guarantee,
        dataForm.implementation_guarantee.data
      ),
      ...apiHelper.checkIsEmpty(
        "maintenance_guarantee",
        dataForm.maintenance_guarantee,
        dataForm.maintenance_guarantee.data
      ),
    };
    console.log(`newParams`, newParams);
    this.props.fetch_api_sg({
      key: keys.upload,
      type: "postForm",
      alertAppear: "both",
      params: newParams,
      url: `delivery/contract/${contractById.id}/upload-guarantee`,
      onSuccess: (res) => {
        // console.log(`res`, res);
        this.handleRefresh();
      },
    });
  };

  // untuk buka / tutup modal
  handleVisible = (key, tempParams = {}) => {
    this.setState((prev) => ({
      ...prev,
      open: {
        [key]: !prev.open[key],
        tempParams: { ...prev.open, tempParams, ...tempParams },
      },
    }));
  };

  handleApi = (type, params) => {
    const { contractById } = this.props;
    const { open } = this.state;
    // console.log(`type`, type, params);
    // return;
    switch (type) {
      case "approve":
        this.props.fetch_api_sg({
          key: keys.approve,
          type: "post",
          alertAppear: "both",
          url: `/delivery/contract/${open?.tempParams?.approve_id}/status`,
          params: {
            approve_status_id: "5d28463c-a435-4ec3-b0dc-e8dcb85aa800",
          },
          onSuccess: (res) => {
            console.log(`res`, res);
            this.handleRefresh();
            this.handleVisible(type);
          },
        });
        break;
      case "reject":
        this.props.fetch_api_sg({
          key: keys.reject,
          type: "post",
          alertAppear: "both",
          url: `/delivery/contract/${open?.tempParams?.reject_id}/status`,
          params: {
            approve_status_id: "f11b1105-c234-45f9-a2e8-2b2f12e5ac8f",
            reject_text: params?.remarks,
          },
          onSuccess: (res) => {
            console.log(`res`, res);
            this.handleVisible(type);
            this.handleRefresh();
          },
        });
        break;

      default:
        break;
    }
  };

  handleRefresh = () => {
    this.props.fetch_api_sg({
      key: keys.list,
      type: "get",
      url: `/delivery/contract/${this.props.contractById.id}`,
      onSuccess: (res) => {
        console.log(`res`, res);
        this.props.set_contract_id(res.data);
      },
    });
  };

  render() {
    const { loadings, status } = this.props;
    const { open } = this.state;
    return (
      <JaminanContext.Provider
        value={{
          states: this.state,
          keys,
          dataForm: this.state.dataForm,
          onChange: this.handleChange,
          handleAction: this.handleAction,
          ...this.props,
        }}
      >
        <Card>
          <CardBody>
            <TableGuarantee />
            {status === "vendor" && (
              <div className="d-flex justify-content-end mt-3">
                <Button
                  variant="contained"
                  color="secondary"
                  size="medium"
                  onClick={this.handleSubmit}
                  disabled={loadings.upload}
                >
                  <span className="mr-1">Submit</span>
                  {loadings.upload ? (
                    <CircularProgress size="0.875rem" color="inherit" />
                  ) : (
                    <Send />
                  )}
                </Button>
              </div>
            )}
          </CardBody>
        </Card>
        {BASE_MODAL_CONF.map(({ type, ...other }, id) => (
          <ModalConfirmation
            key={id}
            visible={open[type]}
            type={type}
            onClose={() => this.handleVisible(type)}
            onSubmit={(params) => this.handleApi(type, params)}
            additionalParams={open.tempParams}
            {...other}
          />
        ))}
      </JaminanContext.Provider>
    );
  }
}

const mapState = (state) => ({
  loadings: {
    list: getLoading(state, keys.list),
    upload: getLoading(state, keys.upload),
    approve: getLoading(state, keys.approve),
    reject: getLoading(state, keys.reject),
  },
  contractById: state.deliveryMonitoring.dataContractById,
  status: state.auth.user.data.status,
});

const mapDispatch = {
  fetch_api_sg,
  set_contract_id,
};

export default connect(mapState, mapDispatch)(Jaminan);
