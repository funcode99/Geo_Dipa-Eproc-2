import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import {
  fetch_api_sg,
  getLoading,
} from "../../../../../../redux/globalReducer";
import { save_data_task } from "../../../_redux/deliveryMonitoringAction";
import TerminPaper from "./components/TerminPaper";
import { KEYS_TERMIN, STATE_STEPPER } from "./STATIC_DATA";

export const TerminPageContext = React.createContext({ keys: KEYS_TERMIN });

export class TerminPageNew extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      termin: {
        stepper: [],
      },
      summary: {},
      deliverable: {},
    };
  }

  componentDidMount() {
    const { task_id } = this.props.match.params;
    this.handleRefresh();
    if (!task_id) {
      this.props.history.goBack();
    }
  }

  handleRefresh = () => {
    this.handleApiCenter({ key: KEYS_TERMIN.f_termin });
  };

  handleApiCenter = ({ key, params, onSuccess, onFail }) => {
    const { fetch_api_sg, save_data_task } = this.props;
    const { task_id } = this.props.match.params;
    switch (key) {
      case KEYS_TERMIN.f_termin:
        fetch_api_sg({
          key,
          params,
          type: "get",
          url: `/delivery/task/${task_id}/item-service`,
          onSuccess: (res) => {
            save_data_task(res.data);
            const mappedStepper = res.data.task_steppers.map((el) => ({
              label: el.label,
              status: STATE_STEPPER[el.state],
            }));
            this.setState((prev) => ({
              ...prev,
              termin: { ...prev.termin, stepper: mappedStepper },
            }));
            if (typeof onSuccess === "function") onSuccess(res);
          },
          onFail,
        });
        break;

      default:
        break;
    }
  };

  render() {
    // console.log(`this.props`, this.props, this.state);
    const { history, map_state, match } = this.props;
    const { task_id } = match.params;

    return (
      <TerminPageContext.Provider
        value={{
          keys: KEYS_TERMIN,
          history,
          match,
          task_id,
          func: {
            onRefresh: this.handleRefresh,
            handleApi: this.handleApiCenter,
          },
          ...map_state,
          states: this.state,
        }}
      >
        <TerminPaper />
      </TerminPageContext.Provider>
    );
  }
}

const mapState = (state) => {
  const {
    dataContractById,
    dataBarang,
    dataTask,
    dataJasa,
  } = state.deliveryMonitoring;
  return {
    map_state: {
      loadings: {
        [KEYS_TERMIN.f_termin]: getLoading(state, KEYS_TERMIN.f_termin),
      },
      authStatus: state.auth.user.data.status,
      dataContractById,
      items: dataContractById?.items,
      dataBarang,
      dataJasa,
      task_sa: dataTask?.task_sa,
      task_gr: dataTask?.task_gr,
      dataTask,
    },
  };
};

const mapDispatch = {
  fetch_api_sg,
  save_data_task,
};

export default compose(
  withRouter,
  connect(mapState, mapDispatch)
)(TerminPageNew);
