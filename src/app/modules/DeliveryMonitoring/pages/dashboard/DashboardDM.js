import React, { Component, createRef } from "react";
import { connect } from "react-redux";
import { fetch_api_sg, getLoading } from "../../../../../redux/globalReducer";
import { DemoOnly } from "../../../../../_metronic/_partials/dashboards/DemoOnly";
import DialogGlobal from "../../../../components/modals/DialogGlobal";
import ActivityDM from "./components/ActivityDM";
import ContractPriceTable from "./components/ContractPriceTableDM";
import SummaryStatsDM from "./components/SummaryStatsDM";
import ToDoDM from "./components/ToDoDM";

class DashboardDM extends Component {
  constructor(props) {
    super(props);
    this.modalRef = createRef();
    this.state = {
      summary_stat: {},
      plant_datas: [],
      contract_prices: [],
    };
  }

  componentDidMount() {
    this.fetchOverdueContract();
    this.fetchSAGR();
    // this.fetchPrice();
    this.fetchContProgress();
    this.fetchDeliveryProgress();
    this.fetchSummaryStats();
    this.fetchContOnProgress();
    this.fetchPlantData();
  }

  fetchOverdueContract = () => {
    this.props.fetchApiSg({
      key: keys.overdue,
      type: "get",
      url: "/delivery/dashboard/overdue-contract",
      onSuccess: (res) => {
        console.log("res" + keys.overdue, res);
      },
    });
  };

  fetchSAGR = () => {
    this.props.fetchApiSg({
      key: keys.sa_gr,
      type: "get",
      url: "/delivery/dashboard/sa-gr-contract",
      onSuccess: (res) => {
        console.log("res" + keys.sa_gr, res);
      },
    });
  };

  fetchPrice = (group_id) => {
    const params = { group_id };
    this.props.fetchApiSg({
      key: keys.cont_price,
      type: "getParams",
      params,
      url: "/delivery/dashboard/contract-price",
      onSuccess: (res) => {
        console.log("res" + keys.cont_price, res);
        this.setState({ contract_prices: res?.data });
      },
    });
  };

  fetchContProgress = () => {
    this.props.fetchApiSg({
      key: keys.cont_progress,
      type: "get",
      url: "/delivery/dashboard/contract-progress",
      onSuccess: (res) => {
        console.log("res" + keys.cont_progress, res);
      },
    });
  };

  fetchDeliveryProgress = () => {
    this.props.fetchApiSg({
      key: keys.dev_progress,
      type: "get",
      url: "/delivery/dashboard/delivery-progress",
      onSuccess: (res) => {
        console.log("res" + keys.dev_progress, res);
      },
    });
  };
  fetchSummaryStats = () => {
    this.props.fetchApiSg({
      key: keys.sum_stats,
      type: "get",
      url: "/delivery/dashboard/summary-stats",
      onSuccess: (res) => {
        // console.log("res" + keys.sum_stats, res);
        this.setState({ summary_stat: res?.data });
      },
    });
  };
  fetchContOnProgress = () => {
    this.props.fetchApiSg({
      key: keys.cont_on_progress,
      type: "get",
      url: "/delivery/dashboard/contract-on-progress",
      onSuccess: (res) => {
        console.log("res" + keys.cont_on_progress, res);
      },
    });
  };
  fetchPlantData = () => {
    this.props.fetchApiSg({
      key: keys.get_plants,
      type: "get",
      url: "/invoice/get_dashboard_plant",
      onSuccess: (res) => {
        // console.log("res" + keys.get_plants, res);
        this.setState({
          plant_datas: res?.data,
        });
      },
    });
  };

  openModal = (type) => {
    this.modalRef.current.open();
  };

  render() {
    // return <DemoOnly />;
    const { summary_stat, plant_datas, contract_prices } = this.state;
    const { authStatus, plant_data, loadings } = this.props;
    return (
      <React.Fragment>
        <div className={"row"}>
          <div className="col-lg-4 col-xxl-4" style={{ maxHeight: "60vh" }}>
            <ToDoDM className="card-stretch gutter-b" />
          </div>
          <div className="col-lg-4 col-xxl-5" style={{ maxHeight: "60vh" }}>
            <ActivityDM className="card-stretch gutter-b" checked />
          </div>
          <div className="col-lg-4 col-xxl-3" style={{ maxHeight: "60vh" }}>
            <SummaryStatsDM
              data={summary_stat}
              authStatus={authStatus}
              openModal={this.openModal}
            />
          </div>
        </div>
        <div className={"row"}>
          <div className="col-lg-8 col-xxl-12" style={{ maxHeight: "60vh" }}>
            <ContractPriceTable
              data={contract_prices}
              option={plant_data}
              onFetch={this.fetchPrice}
              loading={loadings.cont_price}
              authStatus={authStatus}
            />
          </div>
          {/* <div className="col-lg-4 col-xxl-3" style={{ maxHeight: "60vh" }}>
            <SummaryStatsDM data={summary_stat} authStatus={authStatus} />
          </div> */}
        </div>
        {/* <DemoOnly /> */}
        <DialogGlobal
          ref={this.modalRef}
          // visible={visible}
          isSubmit={false}
          isCancel={false}
          // textNo={
          //   <FormattedMessage id="TITLE.MODAL_CREATE.LABEL.BUTTON_FAILED" />
          // }
          title={"Chart Report"}
        >
          <ContractPriceTable
            data={contract_prices}
            option={plant_data}
            onFetch={this.fetchPrice}
            loading={loadings.cont_price}
            authStatus={authStatus}
          />
          {/* <AreaChart /> */}
        </DialogGlobal>
      </React.Fragment>
    );
  }
}

const keys = {
  overdue: "get-overdue-contract",
  sa_gr: "get-sa-gr-contract",
  cont_price: "get-contract-price",
  cont_progress: "get-contract-progress",
  dev_progress: "get-delivery-progress",
  sum_stats: "get-summary-stats",
  cont_on_progress: "get-delivery-progress",
  get_plants: "get-all-plants",
};

const mapState = (state) => {
  return {
    authStatus: state.auth.user.data.status,
    plant_data: state.auth.user.data.plant_data,
    loadings: {
      overdue: getLoading(state, keys.overdue),
      sa_gr: getLoading(state, keys.sa_gr),
      cont_price: getLoading(state, keys.cont_price),
      cont_progress: getLoading(state, keys.cont_progress),
      dev_progress: getLoading(state, keys.dev_progress),
      sum_stats: getLoading(state, keys.sum_stats),
      cont_on_progress: getLoading(state, keys.cont_on_progress),
      get_plants: getLoading(state, keys.get_plants),
    },
  };
};

const mapDispatch = {
  fetchApiSg: fetch_api_sg,
};

export default connect(mapState, mapDispatch)(DashboardDM);
