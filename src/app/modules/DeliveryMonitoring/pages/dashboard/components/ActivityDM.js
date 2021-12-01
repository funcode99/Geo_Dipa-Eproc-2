/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import Skeleton from "@material-ui/lab/Skeleton";
import { ceil } from "lodash";
import React from "react";
import { injectIntl } from "react-intl";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Dropdown } from "react-bootstrap";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { DEV_NODE2 } from "../../../../../../redux/BaseHost";
import {
  fetch_api_sg,
  getLoading,
} from "../../../../../../redux/globalReducer";
import PaginationNotif from "../../../../../../_metronic/layout/components/extras/dropdowns/PaginationNotif";
import {
  DropdownCustomToggler,
  DropdownMenuMyActivity,
} from "../../../../../../_metronic/_partials/dropdowns";

const perfectScrollbarOptions = {
  wheelSpeed: 2,
  wheelPropagation: false,
};

const key = "get-data-activity-dm";
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

const ActivityDM = (props) => {
  const { className, fetch_api_sg, intl, status, loading } = props;
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
    fetch_api_sg({
      key,
      type: "getParams",
      url: DEV_NODE2 + "/todo",
      params: { limit, offset, is_finished: true },
      onSuccess: (res) => {
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
      },
    });
  };
  React.useEffect(() => callApiTodo({ refresh: true }), []);

  const getColor = () => {
    var randomColor = Math.floor(Math.random() * 16777215).toString(16);
    return randomColor;
  };
  return (
    <>
      <div className={`card card-custom ${className}`}>
        {/* Head */}
        <div className="card-header border-0">
          <h3 className="card-title font-weight-bolder text-dark">
            Delivery Monitoring Activity
          </h3>
          <div className="card-toolbar">
            <PaginationNotif
              onChange={callApiTodo}
              total_page={dataTodo.meta?.total_page}
              page={dataTodo.meta?.page}
            />
          </div>
        </div>
        <div className={`card card-custom  ${className}`}>
          {/* Header */}

          {/* Body */}
          <div className="card-body pt-4">
            <PerfectScrollbar
              options={perfectScrollbarOptions}
              className="scroll pr-7 mr-n7"
              style={{
                maxHeight: "calc(100% - 25px)",
                position: "relative",
              }}
            >
              <div className="timeline timeline-6 mt-3">
                {loading ? (
                  <div>
                    <div className="timeline-item align-items-start">
                      <Skeleton animation="wave" className="w-100" />
                    </div>
                    <div className="timeline-item align-items-start">
                      <Skeleton animation="wave" className="w-100" />
                    </div>
                    <div className="timeline-item align-items-start">
                      <Skeleton animation="wave" className="w-100" />
                    </div>
                  </div>
                ) : (
                  dataTodo.list?.map((item, index) => {
                    return (
                      <div
                        className="timeline-item align-items-start cursor-pointer text-hover-primary"
                        key={index.toString()}
                      >
                        <div className="timeline-label font-weight-bolder text-dark-75 font-size-sm">
                          {window
                            .moment(new Date(item.created_at))
                            .format("HH:mm")}
                        </div>

                        <div className="timeline-badge">
                          <i className="fa fa-genderless text-success icon-xl"></i>
                        </div>

                        <div className="timeline-content font-weight-bolder font-size-sm text-dark-75 pl-3">
                          <span className="text-muted">
                            Nomor Kontrak{" "}
                            <span className="text-danger">
                              {item?.data?.contract_no}
                            </span>
                            {/* <span className="text-danger">
                              {item?.data?.contract_no + " (" + item.vendor_name + ")"}
                            </span> */}{" "}
                            -{" "}
                          </span>
                          {/* {`${item?.title}(${item.name_user})`} */}
                          {`${item?.title} `}
                          <span className="text-muted">
                            (
                            {window
                              .moment(new Date(item.created_at))
                              .format("DD MM YYYY")}
                            )
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </PerfectScrollbar>
          </div>
        </div>
        {/* Body */}
      </div>
    </>
  );
};

const mapState = (state) => ({
  loading: getLoading(state, key),
  status: state.auth.user.data.status,
  user_id: state.auth.user.data.user_id,
});

const mapDispatch = {
  fetch_api_sg,
};

export default injectIntl(connect(mapState, mapDispatch)(ActivityDM));
