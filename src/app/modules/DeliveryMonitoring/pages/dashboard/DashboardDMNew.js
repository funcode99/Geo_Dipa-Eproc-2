import { connect } from "react-redux";
import React, { Component } from "react";
import { fetch_api_sg, getLoading } from "../../../../../redux/globalReducer";
import { DemoOnly } from "../../../../../_metronic/_partials/dashboards/DemoOnly";

class DashboardDM extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.fetchOverdueContract();
    this.fetchSAGR();
    this.fetchPrice();
    this.fetchContProgress();
    this.fetchDeliveryProgress();
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

  fetchPrice = () => {
    this.props.fetchApiSg({
      key: keys.cont_price,
      type: "get",
      url: "/delivery/dashboard/contract-price",
      onSuccess: (res) => {
        console.log("res" + keys.cont_price, res);
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

  render() {
    return <DemoOnly />;
  }
}

const keys = {
  overdue: "get-overdue-contract",
  sa_gr: "get-sa-gr-contract",
  cont_price: "get-contract-price",
  cont_progress: "get-contract-progress",
  dev_progress: "get-delivery-progress",
};

const mapState = (state) => {
  return {
    loadings: {
      overdue: getLoading(state, keys.overdue),
      sa_gr: getLoading(state, keys.sa_gr),
      cont_price: getLoading(state, keys.cont_price),
      cont_progress: getLoading(state, keys.cont_progress),
      dev_progress: getLoading(state, keys.dev_progress),
    },
  };
};

const mapDispatch = {
  fetchApiSg: fetch_api_sg,
};

export default connect(mapState, mapDispatch)(DashboardDM);
