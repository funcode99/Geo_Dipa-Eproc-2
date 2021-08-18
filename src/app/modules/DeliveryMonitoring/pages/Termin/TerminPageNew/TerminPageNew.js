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
        summary: {},
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

  handleApiCenter = ({ key, onSuccess, ...other }) => {
    // other termasuk : params, onFail, alertAppear
    const { fetch_api_sg, save_data_task } = this.props;
    const { task_id } = this.props.match.params;
    switch (key) {
      case KEYS_TERMIN.f_termin:
        fetch_api_sg({
          key,
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
              termin: {
                ...prev.termin,
                stepper: mappedStepper,
                summary: res.data,
              },
            }));
            if (typeof onSuccess === "function") onSuccess(res);
          },
          ...other,
        });
        break;
      case KEYS_TERMIN.p_t_summary:
        fetch_api_sg({
          key,
          type: "post",
          url: `/delivery/task/${task_id}`,
          onSuccess,
          ...other,
        });
        break;

      case KEYS_TERMIN.p_t_upload_do:
        fetch_api_sg({
          key,
          url: `/delivery/task-delivery/${other.url_id}/upload`,
          alertAppear: "both",
          onSuccess,
          params: { file: other.params.data },
          type: "postForm",
          ...other,
        });
        break;

      case KEYS_TERMIN.p_t_approve_do_doc:
        fetch_api_sg({
          key,
          url: `delivery/task-delivery/${other.url_id}/status-file`,
          alertAppear: "both",
          onSuccess,
          type: "post",
          ...other,
        });
        break;

      case KEYS_TERMIN.f_sa_gr:
        fetch_api_sg({
          key,
          url: `/delivery/task/${task_id}/sa-gr`,
          onSuccess,
          type: "get",
          ...other,
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

          // task_id: "136dee5a-8670-41e0-a855-c9f346949f06",
          // task_id: "28a08954-17a4-43d4-a710-7d8f17b3de9e",
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
        [KEYS_TERMIN.f_sa_gr]: getLoading(state, KEYS_TERMIN.f_sa_gr),
        [KEYS_TERMIN.p_t_upload_do]: getLoading(
          state,
          KEYS_TERMIN.p_t_upload_do
        ),
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
