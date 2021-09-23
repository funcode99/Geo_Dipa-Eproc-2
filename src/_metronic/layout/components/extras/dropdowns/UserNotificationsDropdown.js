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

export function UserNotificationsDropdown(props) {
  const bgImage = toAbsoluteUrl("/media/misc/bg-1.jpg");
  const classes = useStyles();
  const uiService = useHtmlClassService();
  const layoutProps = useMemo(() => {
    return {
      offcanvas:
        objectPath.get(uiService.config, "extras.notifications.layout") ===
        "offcanvas",
    };
  }, [uiService]);

  return (
    <>
      {layoutProps.offcanvas && (
        <div className="topbar-item">
          <div
            className={`btn btn-icon btn-clean btn-lg mr-1 ${
              props?.countMessage !== 0 ? "pulse pulse-primary" : ""
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
                    props?.countMessage !== 0 ? "bell" : ""
                  }`}
                >
                  <Badge
                    className={classes.margin}
                    badgeContent={props?.countMessage || 0}
                    color="primary"
                  >
                    <SVG
                      src={toAbsoluteUrl(
                        "/media/svg/icons/All/bell-regular.svg"
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
                    {props?.countMessage || 0} new
                  </span>
                </h4>

                <div className="bg-white">
                  <PerfectScrollbar
                    options={perfectScrollbarOptions}
                    className="navi navi-hover scroll my-4"
                    style={{ maxHeight: "300px", position: "relative" }}
                  >
                    {props.newsTodo.map((item, index) => {
                      return (
                        <Link
                          to={
                            "/client/invoice_monitoring/contract/" +
                            item.contract_id +
                            "/" +
                            item.term_id
                          }
                          className="navi-item"
                          key={index.toString()}
                        >
                          <div className="navi-link">
                            <div className="navi-icon mr-2">
                              {item.status_todo === "0" ? (
                                <i className="far fa-dot-circle text-danger"></i>
                              ) : (
                                <i className="fas fa-check text-success"></i>
                              )}
                            </div>
                            <div className="navi-text">
                              <div className="font-weight-bold">
                                {item.todo_name}
                              </div>
                              <div className="text-muted">
                                {`${item.contract_no ||
                                  "Nomor Kontrak"}-${item.task_name ||
                                  "Nama Termin"}(${item.vendor_name ||
                                  "Nama Vendor"})`}
                              </div>
                            </div>
                          </div>
                        </Link>
                      );
                    })}

                    {/* <a href="#" className="navi-item">
                      <div className="navi-link">
                        <div className="navi-icon mr-2">
                          <i className="flaticon2-paper-plane text-danger"></i>
                        </div>
                        <div className="navi-text">
                          <div className="font-weight-bold">
                            Finance report has been generated
                          </div>
                          <div className="text-muted">25 hrs ago</div>
                        </div>
                      </div>
                    </a>

                    <a href="#" className="navi-item">
                      <div className="navi-link">
                        <div className="navi-icon mr-2">
                          <i className="flaticon2-user flaticon2-line- text-success"></i>
                        </div>
                        <div className="navi-text">
                          <div className="font-weight-bold">
                            New order has been received
                          </div>
                          <div className="text-muted">2 hrs ago</div>
                        </div>
                      </div>
                    </a>

                    <a href="#" className="navi-item">
                      <div className="navi-link">
                        <div className="navi-icon mr-2">
                          <i className="flaticon2-pin text-primary"></i>
                        </div>
                        <div className="navi-text">
                          <div className="font-weight-bold">
                            New customer is registered
                          </div>
                          <div className="text-muted">3 hrs ago</div>
                        </div>
                      </div>
                    </a>

                    <a href="#" className="navi-item">
                      <div className="navi-link">
                        <div className="navi-icon mr-2">
                          <i className="flaticon2-sms text-danger"></i>
                        </div>
                        <div className="navi-text">
                          <div className="font-weight-bold">
                            Application has been approved
                          </div>
                          <div className="text-muted">3 hrs ago</div>
                        </div>
                      </div>
                    </a>

                    <a href="#" className="navi-item">
                      <div className="navi-link">
                        <div className="navi-icon mr-2">
                          <i className="flaticon2-pie-chart-3 text-warning"></i>
                        </div>
                        <div className="navinavinavi-text">
                          <div className="font-weight-bold">
                            New file has been uploaded
                          </div>
                          <div className="text-muted">5 hrs ago</div>
                        </div>
                      </div>
                    </a>

                    <a href="#" className="navi-item">
                      <div className="navi-link">
                        <div className="navi-icon mr-2">
                          <i className="flaticon-pie-chart-1 text-info"></i>
                        </div>
                        <div className="navi-text">
                          <div className="font-weight-bold">
                            New user feedback received
                          </div>
                          <div className="text-muted">8 hrs ago</div>
                        </div>
                      </div>
                    </a>

                    <a href="#" className="navi-item">
                      <div className="navi-link">
                        <div className="navi-icon mr-2">
                          <i className="flaticon2-settings text-success"></i>
                        </div>
                        <div className="navi-text">
                          <div className="font-weight-bold">
                            System reboot has been successfully completed
                          </div>
                          <div className="text-muted">12 hrs ago</div>
                        </div>
                      </div>
                    </a>

                    <a href="#" className="navi-item">
                      <div className="navi-link">
                        <div className="navi-icon mr-2">
                          <i className="flaticon-safe-shield-protection text-primary"></i>
                        </div>
                        <div className="navi-text">
                          <div className="font-weight-bold">
                            New order has been placed
                          </div>
                          <div className="text-muted">15 hrs ago</div>
                        </div>
                      </div>
                    </a>

                    <a href="#" className="navi-item">
                      <div className="navi-link">
                        <div className="navi-icon mr-2">
                          <i className="flaticon2-notification text-primary"></i>
                        </div>
                        <div className="navi-text">
                          <div className="font-weight-bold">
                            Company meeting canceled
                          </div>
                          <div className="text-muted">19 hrs ago</div>
                        </div>
                      </div>
                    </a>

                    <a href="#" className="navi-item">
                      <div className="navi-link">
                        <div className="navi-icon mr-2">
                          <i className="flaticon2-fax text-success"></i>
                        </div>
                        <div className="navi-text">
                          <div className="font-weight-bold">
                            New report has been received
                          </div>
                          <div className="text-muted">23 hrs ago</div>
                        </div>
                      </div>
                    </a>

                    <a href="#" className="navi-item">
                      <div className="navi-link">
                        <div className="navi-icon mr-2">
                          <i className="flaticon-download-1 text-danger"></i>
                        </div>
                        <div className="navi-text">
                          <div className="font-weight-bold">
                            Finance report has been generated
                          </div>
                          <div className="text-muted">25 hrs ago</div>
                        </div>
                      </div>
                    </a>

                    <a href="#" className="navi-item">
                      <div className="navi-link">
                        <div className="navi-icon mr-2">
                          <i className="flaticon-security text-warning"></i>
                        </div>
                        <div className="navi-text">
                          <div className="font-weight-bold">
                            New customer comment recieved
                          </div>
                          <div className="text-muted">2 days ago</div>
                        </div>
                      </div>
                    </a>

                    <a href="#" className="navi-item">
                      <div className="navi-link">
                        <div className="navi-icon mr-2">
                          <i className="flaticon2-analytics-1 text-success"></i>
                        </div>
                        <div className="navi-text">
                          <div className="font-weight-bold">
                            New customer is registered
                          </div>
                          <div className="text-muted">3 days ago</div>
                        </div>
                      </div>
                    </a> */}
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
