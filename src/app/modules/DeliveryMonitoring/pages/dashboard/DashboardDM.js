import React, { Component, createRef } from "react";
import { connect } from "react-redux";
import { fetch_api_sg, getLoading } from "../../../../../redux/globalReducer";
import { DemoOnly } from "../../../../../_metronic/_partials/dashboards/DemoOnly";
import DialogGlobal from "../../../../components/modals/DialogGlobal";
import ActivityDM from "./components/ActivityDM";
import ContractPriceTable from "./components/ContractPriceTableDM";
import ContractSumTable from "./components/ContractSumTable";
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
      on_progress_list: [],
      overdue_list: [],
      finished_list: [],
      finished_late_list: [],
      selected_contract: "on_progress_list",
      pie_chart_datas: [],
    };
  }

  componentDidMount() {
    this.fetchSummaryStats();
    this.fetchContFinished();
    this.fetchContFinishedLate();
    this.fetchContOnProgress();
    this.fetchContOnProgressLate();
    this.fetchPlantData();
    this.fetchPieChartData();
  }

  fetchPrice = (group_id) => {
    const params = { group_id };
    this.props.fetchApiSg({
      key: keys.cont_price,
      type: "getParams",
      params,
      url: "/delivery/dashboard/contract-price",
      onSuccess: (res) => {
        this.setState({ contract_prices: res?.data });
      },
    });
  };

  fetchSummaryStats = () => {
    this.props.fetchApiSg({
      key: keys.sum_stats,
      type: "get",
      url: "/delivery/dashboard/summary-stats",
      onSuccess: (res) => {
        this.setState({ summary_stat: res?.data });
      },
    });
  };

  // data inside modal start
  fetchContFinished = () => {
    this.props.fetchApiSg({
      key: keys.cont_finished,
      type: "get",
      url: "/delivery/dashboard/finished-contract",
      onSuccess: (res) => {
        this.setState({ finished_list: res?.data });
      },
    });
  };
  fetchContFinishedLate = () => {
    this.props.fetchApiSg({
      key: keys.cont_finished_late,
      type: "get",
      url: "/delivery/dashboard/finished-contract-late",
      onSuccess: (res) => {
        this.setState({ finished_late_list: res?.data });
      },
    });
  };
  fetchContOnProgress = () => {
    this.props.fetchApiSg({
      key: keys.cont_on_progress,
      type: "get",
      url: "/delivery/dashboard/contract-on-progress",
      onSuccess: (res) => {
        this.setState({ on_progress_list: res?.data });
      },
    });
  };
  fetchContOnProgressLate = () => {
    this.props.fetchApiSg({
      key: keys.cont_overdue,
      type: "get",
      url: "/delivery/dashboard/contract-on-progress-late",
      onSuccess: (res) => {
        this.setState({ overdue_list: res?.data });
      },
    });
  };
  //data inside modal end

  fetchPlantData = () => {
    this.props.fetchApiSg({
      key: keys.get_plants,
      type: "get",
      url: "/invoice/get_dashboard_plant",
      onSuccess: (res) => {
        this.setState({
          plant_datas: res?.data,
        });
      },
    });
  };
  fetchPieChartData = () => {
    this.props.fetchApiSg({
      key: keys.get_pie_charts,
      type: "get",
      url: "/delivery/dashboard/pie-chart-price",
      onSuccess: (res) => {
        this.setState({
          pie_chart_datas: res?.data,
        });
      },
    });
  };

  openModal = (type) => {
    this.modalRef.current.open();
    this.setState({ selected_contract: type });
  };

  render() {
    // return <DemoOnly />;
    const {
      summary_stat,
      plant_datas,
      contract_prices,
      selected_contract,
      pie_chart_datas,
    } = this.state;
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
              className="card-stretch gutter-b"
              data={summary_stat}
              pie_chart_datas={pie_chart_datas}
              authStatus={authStatus}
              openModal={this.openModal}
            />
          </div>
        </div>
        <div className={"row"}>
          <div className="col-lg-8 col-xxl-12">
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
          maxWidth={"md"}
          // textNo={
          //   <FormattedMessage id="TITLE.MODAL_CREATE.LABEL.BUTTON_FAILED" />
          // }
          title={`Contract ${selected_contract.replace(/_/g, " ")}`}
        >
          <ContractSumTable
            status={authStatus}
            data={this.state[`${selected_contract}_list`]}
            // loading={true}
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
  cont_overdue: "get-delivery-progress-late",
  cont_finished: "get-delivery-finished",
  cont_finished_late: "get-delivery-finished-late",
  get_plants: "get-all-plants",
  get_pie_charts: "get-pie-chart-data",
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
      get_pie_charts: getLoading(state, keys.get_pie_charts),
    },
  };
};

const mapDispatch = {
  fetchApiSg: fetch_api_sg,
};

export default connect(mapState, mapDispatch)(DashboardDM);
