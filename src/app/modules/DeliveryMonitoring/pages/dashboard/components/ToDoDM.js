/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import Skeleton from "@material-ui/lab/Skeleton";
import { ceil } from "lodash";
import React from "react";
import { injectIntl } from "react-intl";
import PerfectScrollbar from "react-perfect-scrollbar";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { isEmpty } from "lodash";
import { DEV_NODE2 } from "../../../../../../redux/BaseHost";
import {
  fetch_api_sg,
  getLoading,
} from "../../../../../../redux/globalReducer";
import PaginationNotif from "../../../../../../_metronic/layout/components/extras/dropdowns/PaginationNotif";
import { actionTypes } from "../../../_redux/deliveryMonitoringAction";

const perfectScrollbarOptions = {
  wheelSpeed: 2,
  wheelPropagation: false,
};

const key = "get-data-todo-dm";
const contract_pages = {
  checkIsUploadedDocumentPO: 1,
  checkIsUploadedContractGuaranteeDocument: 7,
  checkIsTerminSet: 2,
  checkIsTerminApproved: 2,
};
const termin_pages = {
  checkIsDeliverableSet: 1,
  checkIsUploadedDeliverable: 1,
  checkIsDeliverableDocumentApproved: 1,
  checkIsDeliverOrderApproved: 2,
  checkIsDeliverOrderItemApproved: 2,
  checkIsUploadDeliverOrderSignedDocument: 2,
  checkIsApprovedDeliverOrderSignedDocument: 2,
  checkIsNeedCreateBAPP: 3,
  checkIsUploadedSignedBAPP: 3,
  checkIsApprovedUploadedSignedBAPP: 3,
};

const sort = (data) => {
  return data.sort(function(a, b) {
    return new Date(b.created_at) - new Date(a.created_at);
  });
};

const ToDoDM = (props) => {
  const {
    className,
    fetchApiSg,
    intl,
    status,
    loading,
    saveContractById,
  } = props;
  const [dataTodo, setDataTodo] = React.useState({
    list: [],
    meta: {
      page: 1,
      per_page: 10,
      data_unread: 0,
      data_available: 0,
      total_page: 1,
    },
  });

  const callApiTodo = ({ refresh, page }) => {
    const current_page = !!refresh ? 1 : page;
    const limit = 10;
    const offset = (current_page - 1) * limit;
    fetchApiSg({
      key,
      type: "getParams",
      url: DEV_NODE2 + "/todo",
      params: { limit, offset },
      onSuccess: (res) => {
        console.log("restodo", res);
        if (isEmpty(res.result.data)) return;
        const { data, total_data } = res.result;
        setDataTodo({
          list: data,
          meta: {
            page: current_page,
            per_page: 10,
            data_unread: total_data,
            data_available: total_data,
            total_page: ceil(total_data / 10),
          },
        });
        //   const { data, total_data, total_unread } = res.result;
      },
    });

    // setLoading(true);
    // getTodoByUser(user_id)
    //   .then((result) => {
    //     setLoading(false);
    //     setDataTodo(result.data.data);
    //   })
    //   .catch((err) => {
    //     setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 5000);
    //   });
  };
  React.useEffect(() => callApiTodo({ refresh: true }), []);

  const getColor = () => {
    var randomColor = Math.floor(Math.random() * 16777215).toString(16);
    return randomColor;
  };

  const getContractById = React.useCallback(
    (contractId) => {
      fetchApiSg({
        keys: "key_contract",
        type: "get",
        url: `/delivery/contract/${contractId}`,
        onSuccess: (res) => {
          console.log(`res`, res?.data);
          saveContractById(res?.data);
        },
      });
    },
    [saveContractById, fetchApiSg]
  );

  console.log(`dataTodo`, dataTodo);
  return (
    <>
      <div className={`card card-custom ${className}`}>
        {/* Head */}
        <div className="card-header border-0">
          <h3 className="card-title font-weight-bolder text-dark">
            Delivery Todo
          </h3>
          <div className="card-toolbar">
            <PaginationNotif
              onChange={callApiTodo}
              total_page={dataTodo.meta?.total_page}
              page={dataTodo.meta?.page}
            />
          </div>
        </div>
        {/* Body */}
        <div className="card-body pt-2">
          <PerfectScrollbar
            options={perfectScrollbarOptions}
            className="scroll pr-7 mr-n7"
            style={{
              maxHeight: "calc(100% - 25px)",
              position: "relative",
            }}
          >
            {loading ? (
              <div className="d-flex align-items-center mb-10">
                <div className="w-100">
                  {[1, 2, 3, 4, 5, 6, 7].map((el, id) => (
                    <div key={id} className="timeline-item align-items-start">
                      <Skeleton animation="wave" className="w-100" />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              sort(dataTodo.list)?.map((item, index) => {
                var bgColor = getColor();
                const isContractPage = Object.keys(contract_pages).filter(
                  (e) => e === item?.node_type
                )?.[0];
                const isTerminPage = Object.keys(termin_pages).filter(
                  (e) => e === item?.node_type
                )?.[0];
                const linkContract = `/${status}/delivery-monitoring/contract/${item?.data?.contract_id}/${contract_pages[isContractPage]}`;
                const linkTermin = `/${status}/delivery-monitoring/contract/task/${item?.data?.task_id}/${termin_pages[isTerminPage]}`;
                return (
                  <div
                    className="d-flex align-items-center mb-10"
                    key={index.toString()}
                  >
                    <span
                      className="bullet bullet-bar align-self-stretch"
                      style={{ backgroundColor: `#${bgColor}` }}
                    ></span>

                    <label className="checkbox checkbox-lg checkbox-light-success checkbox-single flex-shrink-0 m-0 mx-4">
                      <input
                        type="checkbox"
                        name=""
                        onChange={() => {}}
                        value={item.is_finished ? "1" : "0"}
                        checked
                      />
                      <span style={{ backgroundColor: `#${bgColor}` }}></span>
                    </label>

                    <div className="d-flex flex-column flex-grow-1">
                      <Link
                        to={!!isContractPage ? linkContract : linkTermin}
                        className="text-dark-75 text-hover-primary font-weight-bold font-size-sm mb-1"
                        onClick={() => {
                          getContractById(item?.data?.contract_id);

                          //   tabInvoice.tab = item.menu_tab || 0;
                          //   tabInvoice.tabInvoice = item.sub_menu_tab || 0;
                          //   props.set_data_tab_invaoice(tabInvoice);
                        }}
                      >
                        {item.title}
                      </Link>
                      <span className="text-danger font-weight-bold font-size-sm">
                        {`${item?.data?.contract_no} - ${item?.data
                          ?.contract_name || item?.data?.task_name}`}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </PerfectScrollbar>
        </div>
      </div>
    </>
  );
};

const mapState = (state) => ({
  loading: getLoading(state, key),
  status: state.auth.user.data.status,
  user_id: state.auth.user.data.user_id,
});

// const mapDispatch = {
//   fetch_api_sg,
//   saveContractById: (payload) => {
//     dispatch({
//       type: actionTypes.SetContractById,
//       payload,
//     });
//   },
// };

const mapDispatch = (dispatch) => ({
  saveContractById: (payload) => {
    dispatch({
      type: actionTypes.SetContractById,
      payload,
    });
  },
  fetchApiSg: (payload) => dispatch(fetch_api_sg(payload)),
});

export default injectIntl(connect(mapState, mapDispatch)(ToDoDM));
