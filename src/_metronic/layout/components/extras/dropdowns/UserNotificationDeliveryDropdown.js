/* eslint-disable no-unused-vars */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, { useState, useMemo } from "react";
import { Nav, Tab, Dropdown, OverlayTrigger, Tooltip } from "react-bootstrap";
import PerfectScrollbar from "react-perfect-scrollbar";
import SVG from "react-inlinesvg";
import objectPath from "object-path";
import { useHtmlClassService } from "../../../_core/MetronicLayout";
import { toAbsoluteUrl } from "../../../../_helpers";
import { DropdownTopbarItemToggler } from "../../../../_partials/dropdowns";
import { Link } from "react-router-dom";
import Badge from "@material-ui/core/Badge";
import { makeStyles } from "@material-ui/core/styles";
import { connect, shallowEqual, useDispatch, useSelector } from "react-redux";
import * as reducer from "../../../../../app/modules/InvoiceMonitoring/_redux/InvoiceMonitoringSlice";
import { injectIntl } from "react-intl";
import { useLocation } from "react-router";
import { store_notif_dm_rd } from "../../../../../app/modules/DeliveryMonitoring/_redux/deliveryMonitoringSlice";
import { fetch_api_sg } from "../../../../../redux/globalReducer";
import { DEV_NODE2 } from "../../../../../redux/BaseHost";

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

function UserNotificationDeliveryDropdown(props) {
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

  const notifData = useSelector(
    (state) => state.deliveryMonitoring.notifDeliveryMonitoring
  );

  const unreadNotifCount = DUMMY_DATA?.result?.total_unread || 0;

  const refresh = () => {
    dispatch(
      fetch_api_sg({
        key: "tes notif",
        type: "getParams",
        url: DEV_NODE2 + "/notification",
        params: { limit: 10, offset: 0 },
        onSuccess: (res) => {
          console.log("resnotif", res);
          // dispatch(store_notif_dm_rd(res.data));
        },
        onFail: (err) => {
          console.log("resnotiferr", err);
        },
      })
    );
  };

  React.useEffect(() => {
    refresh();
  }, [location]);

  console.log(`topbar-location`, location);

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
                    {DUMMY_DATA.result.data.map((item, index) => {
                      return (
                        <Link
                          to={
                            `/${status}/delivery-monitoring/contract/` +
                            item.data.contract_id
                          }
                          className="navi-item"
                          key={index.toString()}
                          onClick={() => {
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
                                {`${item.data.contract_no ||
                                  "Nomor Kontrak"}-${item.data.task_name ||
                                  "Nama Termin"}`}
                              </div>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </PerfectScrollbar>
                </div>
              </div>
            </form>
          </Dropdown.Menu>
        </Dropdown>
      )}
    </>
  );
}

export default injectIntl(
  connect(null, reducer.actions)(UserNotificationDeliveryDropdown)
);

const DUMMY_DATA = {
  status: "success",
  result: {
    total_data: 42,
    total_unread: 42,
    data: [
      {
        _id: "619237f7ae1db9452a129bda",
        data: {
          contract_id: "0128863c-8067-4d7d-b428-966db898b181",
          contract_no: "Perjanjian Test",
          contract_name: "asd",
          delivery_contract_starts_id: null,
          po_document: null,
        },
        title: "Need Upload PO Document",
        created_at: "2021-11-15T10:35:35.393Z",
        is_read: false,
      },
      {
        _id: "618f288de4073bc6a399f8ee",
        data: {
          vendor_id: "7c9d965a-cc47-408d-9763-68cf347e94c6",
          contract_id: "ffab59fc-d6a6-4698-ae6e-1399edcc5fbf",
          task_id: "9d2042fc-51b6-455b-9996-43e1340ca5f9",
          contract_no: "PRJ05/PST/2021",
          contract_name: "Pekerjaan jasa inspection dan instalasi PCDP",
          task_name: "SR & Jr Inspection",
          document_type: "Mountly Report",
          task_document_id: "b7df9a8e-19cf-4f89-900c-ba2c15346d7e",
          task_document_url: "task-document/3 org.pdf",
          document_status: "WAITING",
        },
        title: "Need Approval Deliverables Document",
        created_at: "2021-11-13T02:53:01.716Z",
        is_read: false,
      },
      {
        _id: "618f288de4073bc6a399f8e2",
        data: {
          vendor_id: "d1d18757-3d7e-4c39-afb1-55a4f798438d",
          contract_id: "fc18e86c-76d7-47d9-bc33-d7bc5e4f04c4",
          task_id: "01dfea26-bd56-4e9e-89ef-b6f5ec668c73",
          contract_no: "025.PJ/PST.00.GDE/IX/2021",
          contract_name:
            "Pekerjaan Jasa Penutupan Asuransi Fasilitas Steam Field dan Power Plant Lapangan Panas Bumi Dieng Dan Patuha",
          task_name: "Pengiriman ke 8",
          document_type: "Daily Report",
          task_document_id: "496cb4de-daf1-4d12-afb8-467f9fd0f26f",
          task_document_url: "task-document/dummy.png",
          document_status: "WAITING",
        },
        title: "Need Approval Deliverables Document",
        created_at: "2021-11-13T02:53:01.672Z",
        is_read: false,
      },
      {
        _id: "618f288de4073bc6a399f8d6",
        data: {
          vendor_id: "d1d18757-3d7e-4c39-afb1-55a4f798438d",
          contract_id: "fc18e86c-76d7-47d9-bc33-d7bc5e4f04c4",
          task_id: "1e155569-7991-468d-bef9-f0ea6210fba4",
          contract_no: "025.PJ/PST.00.GDE/IX/2021",
          contract_name:
            "Pekerjaan Jasa Penutupan Asuransi Fasilitas Steam Field dan Power Plant Lapangan Panas Bumi Dieng Dan Patuha",
          task_name: "Termin ke tujuh",
          document_type: "Time Sheet",
          task_document_id: "362c9b4e-1a0c-4eaa-8366-e0839eff399c",
          task_document_url:
            "task-document/012.PJ-PST.00-GDE-VI-2021_User_13-09-2021 15-54.pdf",
          document_status: "REJECTED",
        },
        title: "Need Approval Deliverables Document",
        created_at: "2021-11-13T02:53:01.632Z",
        is_read: false,
      },
      {
        _id: "618f288de4073bc6a399f8c3",
        data: {
          vendor_id: "d1d18757-3d7e-4c39-afb1-55a4f798438d",
          contract_id: "fc18e86c-76d7-47d9-bc33-d7bc5e4f04c4",
          task_id: "40254cf7-295f-466b-928e-f9b97d840609",
          contract_no: "025.PJ/PST.00.GDE/IX/2021",
          contract_name:
            "Pekerjaan Jasa Penutupan Asuransi Fasilitas Steam Field dan Power Plant Lapangan Panas Bumi Dieng Dan Patuha",
          task_name: "Pengiriman Material Ke-3",
          document_type: "Weekly Report",
          task_document_id: "e2c168b3-c1b4-4af9-92b5-8c8fc27d32f0",
          task_document_url:
            "task-document/Project Timesheet ALIEK-Agustus 2021.pdf",
          document_status: "WAITING",
        },
        title: "Need Approval Deliverables Document",
        created_at: "2021-11-13T02:53:01.589Z",
        is_read: false,
      },
      {
        _id: "618f288de4073bc6a399f8af",
        data: {
          vendor_id: "d1d18757-3d7e-4c39-afb1-55a4f798438d",
          contract_id: "fc18e86c-76d7-47d9-bc33-d7bc5e4f04c4",
          task_id: "40254cf7-295f-466b-928e-f9b97d840609",
          contract_no: "025.PJ/PST.00.GDE/IX/2021",
          contract_name:
            "Pekerjaan Jasa Penutupan Asuransi Fasilitas Steam Field dan Power Plant Lapangan Panas Bumi Dieng Dan Patuha",
          task_name: "Pengiriman Material Ke-3",
          document_type: "Weekly Report",
          task_document_id: "e1eca3c9-a0a2-48d3-b2f2-b964ef9103a1",
          task_document_url:
            "task-document/Project Timesheet ALIEK-Agustus 2021.pdf",
          document_status: "WAITING",
        },
        title: "Need Approval Deliverables Document",
        created_at: "2021-11-13T02:53:01.540Z",
        is_read: false,
      },
      {
        _id: "618f288de4073bc6a399f89e",
        data: {
          vendor_id: "d1d18757-3d7e-4c39-afb1-55a4f798438d",
          contract_id: "fc18e86c-76d7-47d9-bc33-d7bc5e4f04c4",
          task_id: "40254cf7-295f-466b-928e-f9b97d840609",
          contract_no: "025.PJ/PST.00.GDE/IX/2021",
          contract_name:
            "Pekerjaan Jasa Penutupan Asuransi Fasilitas Steam Field dan Power Plant Lapangan Panas Bumi Dieng Dan Patuha",
          task_name: "Pengiriman Material Ke-3",
          document_type: "Weekly Report",
          task_document_id: "0904b381-9c3f-42d0-a0b5-050cc4b278ff",
          task_document_url:
            "task-document/Project Timesheet ALIEK-Agustus 2021.pdf",
          document_status: "WAITING",
        },
        title: "Need Approval Deliverables Document",
        created_at: "2021-11-13T02:53:01.505Z",
        is_read: false,
      },
      {
        _id: "618f288de4073bc6a399f88a",
        data: {
          vendor_id: "d1d18757-3d7e-4c39-afb1-55a4f798438d",
          contract_id: "fc18e86c-76d7-47d9-bc33-d7bc5e4f04c4",
          task_id: "945f358c-3fab-41f7-9315-625d9c963fd0",
          contract_no: "025.PJ/PST.00.GDE/IX/2021",
          contract_name:
            "Pekerjaan Jasa Penutupan Asuransi Fasilitas Steam Field dan Power Plant Lapangan Panas Bumi Dieng Dan Patuha",
          task_name: "Pengiriman Material Pertama",
          document_type: "Sertifikat OHSAS 18001:2007",
          task_document_id: "23614d39-f57a-4c33-9e98-9c3eb295b704",
          task_document_url:
            "task-document/109.PJ-PTH1.00-GDE-IX-2021_Vendor_20-09-2021 09-26.pdf",
          document_status: "REJECTED",
        },
        title: "Need Approval Deliverables Document",
        created_at: "2021-11-13T02:53:01.462Z",
        is_read: false,
      },
      {
        _id: "618f288de4073bc6a399f87b",
        data: {
          contract_id: "ffab59fc-d6a6-4698-ae6e-1399edcc5fbf",
          task_id: "4cf06693-7645-4c81-821d-791006763cce",
          vendor_id: "7c9d965a-cc47-408d-9763-68cf347e94c6",
          vendor_code: "00000180",
          contract_no: "PRJ05/PST/2021",
          contract_name: "Pekerjaan jasa inspection dan instalasi PCDP",
          task_name: "Engineer Civil & Drilling",
          delivery_news_no: null,
          delivery_news_document: null,
        },
        title: "Need to create BAPP",
        created_at: "2021-11-13T02:53:01.442Z",
        is_read: false,
      },
      {
        _id: "618f288de4073bc6a399f876",
        data: {
          contract_id: "25313be7-ae33-4f61-af9d-f3cb5538dd6e",
          vendor_id: "d1d18757-3d7e-4c39-afb1-55a4f798438d",
          task_id: "9d14c227-feca-4b8b-82dc-115b50b07b87",
          contract_no: "PRJ.02.GeneralAffairs",
          contract_name: "Pengadaan Perjanjian General Affairs",
          task_name: "Test111",
          task_document_id: null,
        },
        title: "Need Set Deliverables",
        created_at: "2021-11-13T02:53:01.431Z",
        is_read: false,
      },
    ],
  },
};
