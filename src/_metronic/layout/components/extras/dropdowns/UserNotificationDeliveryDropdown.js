/* eslint-disable no-unused-vars */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, { useMemo } from "react";
import { Dropdown, OverlayTrigger, Tooltip } from "react-bootstrap";
import SVG from "react-inlinesvg";
import { injectIntl } from "react-intl";
import PerfectScrollbar from "react-perfect-scrollbar";
import { connect, shallowEqual, useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import Badge from "@material-ui/core/Badge";
import { makeStyles } from "@material-ui/core/styles";
import { ceil } from "lodash";
import objectPath from "object-path";
import { store_notif_dm_rd } from "../../../../../app/modules/DeliveryMonitoring/_redux/deliveryMonitoringSlice";
import * as reducer from "../../../../../app/modules/InvoiceMonitoring/_redux/InvoiceMonitoringSlice";
import { DEV_NODE2 } from "../../../../../redux/BaseHost";
import { fetch_api_sg } from "../../../../../redux/globalReducer";
import { toAbsoluteUrl } from "../../../../_helpers";
import { DropdownTopbarItemToggler } from "../../../../_partials/dropdowns";
import { useHtmlClassService } from "../../../_core/MetronicLayout";
import PaginationNotif from "./PaginationNotif";
import { actionTypes } from "../../../../../app/modules/DeliveryMonitoring/_redux/deliveryMonitoringAction";

const perfectScrollbarOptions = {
  wheelSpeed: 2,
  wheelPropagation: false,
};

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(2),
    marginRight: theme.spacing(3),
  },
}));

const key = "notif-dm";
const key_contract = "get-contract-by-id";
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

function UserNotificationDeliveryDropdown({ saveContractById, fetchApiSg }) {
  const bgImage = toAbsoluteUrl("/media/misc/bg-1.jpg");
  const classes = useStyles();
  const uiService = useHtmlClassService();
  const location = useLocation();
  const dispatch = useDispatch();

  const layoutProps = useMemo(() => {
    return {
      offcanvas:
        objectPath.get(uiService.config, "extras.notifications.layout") ===
        "offcanvas",
    };
  }, [uiService]);

  let status = useSelector(
    (state) => state.auth.user.data.status,
    shallowEqual
  );

  const { notifDeliveryMonitoring, notifMeta } = useSelector(
    (state) => state.deliveryMonitoring
  );

  const unreadNotifCount = notifMeta?.data_unread || 0;

  const fetchNotif = ({ refresh, page }) => {
    const current_page = refresh ? 1 : page;
    const limit = 10;
    const offset = (current_page - 1) * limit;
    dispatch(
      fetch_api_sg({
        key,
        type: "getParams",
        url: DEV_NODE2 + "/notification",
        params: { limit, offset },
        onSuccess: (res) => {
          // console.log("resnotif", res);
          const { data, total_data, total_unread } = res?.result;
          dispatch(
            store_notif_dm_rd({
              list: data,
              meta: {
                page: current_page,
                per_page: 10,
                data_unread: total_unread,
                data_available: total_data,
                total_page: ceil(total_data / 10),
              },
            })
          );
        },
      })
    );
  };

  const fetchDetailNotif = React.useCallback(
    ({ id }) => {
      dispatch(
        fetch_api_sg({
          key,
          type: "get",
          url: DEV_NODE2 + `/notification/${id}`,
          onSuccess: (res) => {
            // console.log("resnotif", res);
            fetchNotif({ refresh: true });
          },
        })
      );
    },
    [dispatch, fetch_api_sg]
  );

  const getContractById = React.useCallback(
    (contractId) => {
      dispatch(
        fetch_api_sg({
          keys: key_contract,
          type: "get",
          url: `/delivery/contract/${contractId}`,
          onSuccess: (res) => {
            console.log(`res`, res.data);
            saveContractById(res?.data);
          },
        })
      );
    },
    [saveContractById, fetch_api_sg]
  );

  React.useEffect(() => {
    fetchNotif({ refresh: true });
  }, [location]);

  return (
    <>
      {layoutProps.offcanvas && (
        <div className="topbar-item">
          <div
            className={`btn btn-icon btn-clean btn-lg mr-1 ${
              unreadNotifCount !== 0 ? "pulse pulse-primary" : ""
            }`}
            id="kt_quick_notifications_toggle"
          >
            <span className="svg-icon svg-icon-xl svg-icon-primary ">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Code/Compiling.svg")} />
            </span>
            <span className="pulse-ring"></span>
          </div>
        </div>
      )}
      {!layoutProps.offcanvas && (
        <Dropdown drop="down" alignRight>
          <Dropdown.Toggle
            as={DropdownTopbarItemToggler}
            id="kt_quick_notifications_toggle"
          >
            <OverlayTrigger
              placement="bottom"
              overlay={
                <Tooltip id="user-notification-tooltip">
                  User Notifications
                </Tooltip>
              }
            >
              <div
                className={`btn btn-icon btn-clean btn-lg mr-1`}
                id="kt_quick_notifications_toggle"
              >
                <span
                  className={`svg-icon svg-icon-xl svg-icon-primary ${
                    unreadNotifCount !== 0 ? "bell" : ""
                  }`}
                >
                  <Badge
                    className={classes.margin}
                    badgeContent={unreadNotifCount}
                    color="primary"
                  >
                    <SVG
                      src={toAbsoluteUrl(
                        "/media/svg/icons/All/delivery-notif.svg"
                      )}
                    />
                  </Badge>
                </span>
                <span className="pulse-ring"></span>
                <span className="pulse-ring" />
              </div>
            </OverlayTrigger>
          </Dropdown.Toggle>

          <Dropdown.Menu className="dropdown-menu p-0 m-0 dropdown-menu-right dropdown-menu-anim-up dropdown-menu-lg">
            <form>
              {/** Head */}
              <div
                className="d-flex flex-column pt-12 bgi-size-cover bgi-no-repeat rounded-top"
                style={{ backgroundImage: `url(${bgImage})` }}
              >
                <h4 className="d-flex flex-center rounded-top">
                  <span className="text-white">User Notifications</span>
                  <span className="btn btn-text btn-success btn-sm font-weight-bold btn-font-md ml-2">
                    {unreadNotifCount} new
                  </span>
                </h4>

                <div className="bg-white">
                  <PerfectScrollbar
                    options={perfectScrollbarOptions}
                    className="navi navi-hover scroll my-4"
                    style={{ maxHeight: "300px", position: "relative" }}
                  >
                    {notifDeliveryMonitoring?.map((item, index) => {
                      const isContractPage = Object.keys(contract_pages).filter(
                        (e) => e === item?.node_type
                      )?.[0];
                      const isTerminPage = Object.keys(termin_pages).filter(
                        (e) => e === item?.node_type
                      )?.[0];
                      const linkContract = `/${status}/delivery-monitoring/contract/${item?.data?.contract_id}/${contract_pages[isContractPage]}`;
                      const linkTermin = `/${status}/delivery-monitoring/contract/task/${item?.data?.task_id}/${termin_pages[isTerminPage]}`;
                      console.log("notif", item, isContractPage, isTerminPage);
                      return (
                        <Link
                          to={!!isContractPage ? linkContract : linkTermin}
                          className="navi-item"
                          key={index.toString()}
                          onClick={() => {
                            // fetchDetailNotif({ id: item?._id });
                            getContractById(item?.data?.contract_id);
                            // tabInvoice.tab = item.menu_tab || 0;
                            // tabInvoice.tabInvoice = item.sub_menu_tab || 0;
                            // props.set_data_tab_invaoice(tabInvoice);
                          }}
                        >
                          <div className="navi-link">
                            <div className="navi-icon mr-2">
                              {item.is_read === false ? (
                                <i className="far fa-dot-circle text-danger"></i>
                              ) : (
                                <i className="fas fa-check text-success"></i>
                              )}
                            </div>
                            <div className="navi-text">
                              <div className="font-weight-bold">
                                {item?.title}
                              </div>
                              <div className="text-muted">
                                {linkContract &&
                                  `${item?.data?.contract_name ||
                                    "Nomor Kontrak"}`}
                                {linkTermin &&
                                  `${item?.data?.task_name || "Nomor Termin"}`}
                                {/* {`${item.data.contract_name ||
                                  "Nomor Kontrak"}-${item.data.task_name ||
                                  "Nama Termin"}`} */}
                              </div>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </PerfectScrollbar>
                </div>
                <PaginationNotif
                  onChange={fetchNotif}
                  total_page={notifMeta?.total_page}
                  page={notifMeta?.page}
                  withLabel
                />
              </div>
            </form>
          </Dropdown.Menu>
        </Dropdown>
      )}
    </>
  );
}

const mapDispatch = (dispatch) => ({
  saveContractById: (payload) => {
    dispatch({
      type: actionTypes.SetContractById,
      payload: payload,
    });
  },
  fetchApiSg: (payload) => dispatch(fetch_api_sg(payload)),
});

export default injectIntl(
  connect(null, mapDispatch)(UserNotificationDeliveryDropdown)
);
