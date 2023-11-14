import { debounce } from "lodash";
import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import {
  fetch_api_sg,
  getLoading,
} from "../../../../../../redux/globalReducer";
import {
  save_data_task,
  set_contract_id,
} from "../../../_redux/addendumContractAction";
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
      showForm: true,
    };
  }

  componentDidMount() {
    const { task_id } = this.props.match.params;
    this.handleRefresh();
    if (!task_id) {
      this.props.history.goBack();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    console.log(`thispprops`, this.props, prevProps);
    if (this.props.location.pathname !== prevProps.location.pathname) {
      this.handleRefresh();
      return;
    }
    if (
      prevProps.map_state.dataContractById.id !==
      this.props.map_state.dataTask.contract_id
    ) {
      this.handleFetchContract();
      return;
    }
  }

  handleFetchContract = debounce(() => {
    let isFetching = this.props.map_state.loadings[KEYS_TERMIN.f_contract];
    // no need to refetch if it is already fetching
    if (isFetching) return;
    this.handleApiCenter({ key: KEYS_TERMIN.f_contract });
  }, 500);

  handleRefresh = () => {
    this.handleApiCenter({ key: KEYS_TERMIN.f_termin });
  };

  handleApiCenter = ({ key, onSuccess, ...other }) => {
    // other termasuk : params, onFail, alertAppear
    const {
      fetch_api_sg,
      save_data_task,
      set_contract_id,
      map_state,
    } = this.props;
    const { task_id } = this.props.match.params;
    switch (key) {
      case KEYS_TERMIN.f_contract:
        if (
          map_state?.dataTask?.contract_id ||
          map_state?.dataContractById?.id
        ) {
          fetch_api_sg({
            key,
            type: "get",
            url: `/delivery/contract/${map_state?.dataTask?.contract_id ||
              map_state?.dataContractById?.id}`,
            onSuccess: (res) => {
              set_contract_id(res?.data);
            },
          });
        }
        break;
      case KEYS_TERMIN.f_termin:
        fetch_api_sg({
          key,
          type: "get",
          url: `/delivery/task/${task_id}/item-service`,
          onSuccess: (res) => {
            console.log(`res item-service`, res);
            save_data_task(res.data);
            const mappedStepper = res.data.task_steppers.map((el) => ({
              label: el.label,
              status: STATE_STEPPER[el.state],
            }));
            const isSAGRCompleted = mappedStepper.reduce(
              (acc, el, idx) =>
                !!el.label === "SA / GR" && !el.status === "COMPLETE"
                  ? false
                  : acc,
              true
            );

            this.setState((prev) => ({
              ...prev,
              showForm: isSAGRCompleted,
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
      case KEYS_TERMIN.p_t_edit_termin:
        fetch_api_sg({
          key,
          url: `/delivery/task/${task_id}`,
          onSuccess,
          type: "post",
          alertAppear: "both",
          ...other,
        });
        break;
      default:
        break;
    }
  };

  render() {
    const { history, map_state, match } = this.props;
    const { task_id, tab } = match.params;

    return (
      <TerminPageContext.Provider
        value={{
          keys: KEYS_TERMIN,
          history,
          match,
          task_id,
          forceTabActive: tab || null,

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
        {/* {map_state.loadings[KEYS_TERMIN.f_termin] ? <div /> : <TerminPaper />} */}
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
        [KEYS_TERMIN.f_contract]: getLoading(state, KEYS_TERMIN.f_contract),
        [KEYS_TERMIN.f_termin]: getLoading(state, KEYS_TERMIN.f_termin),
        [KEYS_TERMIN.f_sa_gr]: getLoading(state, KEYS_TERMIN.f_sa_gr),
        [KEYS_TERMIN.p_t_approve_do_doc]: getLoading(
          state,
          KEYS_TERMIN.p_t_approve_do_doc
        ),
        [KEYS_TERMIN.p_t_upload_do]: getLoading(
          state,
          KEYS_TERMIN.p_t_upload_do
        ),
        [KEYS_TERMIN.p_t_edit_termin]: getLoading(
          state,
          KEYS_TERMIN.p_t_edit_termin
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
      isRejected: dataTask?.approve_status?.code === "rejected" ? true : false,
      isRevision: dataTask?.approve_status?.code === "revision" ? true : false,
    },
  };
};

const mapDispatch = {
  fetch_api_sg,
  save_data_task,
  set_contract_id,
};

export default compose(
  withRouter,
  connect(mapState, mapDispatch)
)(TerminPageNew);
