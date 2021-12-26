/* eslint-disable jsx-a11y/role-supports-aria-props */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router";
import { NavLink } from "react-router-dom";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl, checkIsActive } from "../../../../_helpers";
import {
  FormattedMessage,
  // injectIntl
} from "react-intl";
import { useSelector, shallowEqual } from "react-redux";
import {
  DataAsideMenuListClient,
  DataAsideMenuListVendor,
} from "./DataAsideMenuList";
import { getRolesAdmin } from "../../../../../app/modules/Master/service/MasterCrud";
import { getFinanceUser } from "../../../../../redux/globalReducer";

export function AsideMenuList({ layoutProps }) {
  const location = useLocation();
  const getMenuItemActive = (url, hasSubmenu = false) => {
    return checkIsActive(location, url)
      ? ` ${!hasSubmenu &&
          "menu-item-active"} menu-item-open menu-item-not-hightlighted`
      : "";
  };
  let status = useSelector(
    (state) => state.auth.user.data.status,
    shallowEqual
  );
  let isFinance = useSelector((state) => getFinanceUser(state));
  const dataUser = useSelector((state) => state.auth.user.data);
  let monitoring_role = dataUser.monitoring_role
    ? dataUser.monitoring_role
    : [];
  const [asideMenu, setAsideMenu] = useState([]);
  // let asideMenu =
  //   status === "client" ? DataAsideMenuListClient : DataAsideMenuListVendor;

  // asideMenu = asideMenu.filter(function (obj) {
  //   return obj.title !== "MENU.USER_MANAGEMENT";
  // });

  const getRolesAdminData = useCallback(() => {
    getRolesAdmin().then((responseRoles) => {
      if (status === "client" && !isFinance) {
        // replace sub menu invoice monitoring, if only user is not finance department
        let newList = DataAsideMenuListClient.reduce(
          (acc, item, index, arr) => {
            if (item.title === "MENU.INVOICE_MONITORING")
              return [
                ...acc,
                {
                  ...item,
                  subMenu: [
                    {
                      rootPath: "/client/invoice_monitoring/contract",
                      title: "MENU.DELIVERY_MONITORING.LIST_CONTRACT_PO",
                      subMenu: null,
                    },
                  ],
                },
              ];
            return [...acc, item];
          },
          []
        );
        console.log(`newList`, newList);
        setAsideMenu(newList);
        return;
      }
      setAsideMenu(
        status === "client" ? DataAsideMenuListClient : DataAsideMenuListVendor
      );
      let found = false;
      responseRoles["data"]["data"].map((item, index) => {
        if (
          monitoring_role.findIndex((element) => element === item.name) >= 0
        ) {
          found = true;
        }
      });
      if (!found) {
        let asideMenuTemp = DataAsideMenuListClient.filter(function(obj) {
          return (
            obj.title !== "MENU.USER_MANAGEMENT" &&
            obj.title !== "MENU.MASTER_DATA"
          );
        });
        setAsideMenu(
          status === "client" ? asideMenuTemp : DataAsideMenuListVendor
        );
      }
    });
  }, [isFinance]);

  useEffect(getRolesAdminData, []);

  return (
    <>
      <ul className={`menu-nav ${layoutProps.ulClasses}`}>
        <li
          className={`menu-item ${getMenuItemActive(
            `/${status}/dashboard`,
            false
          )}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to={`/${status}/dashboard`}>
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Design/Layers.svg")} />
            </span>
            <span className="menu-text">Dashboard</span>
          </NavLink>
        </li>
        {asideMenu.map((item, index) => {
          return (
            <li
              key={index.toString()}
              className={`${
                item.subMenu && item.subMenu.length > 0
                  ? "menu-item menu-item-submenu"
                  : "menu-item"
              } ${getMenuItemActive(item.rootPath, true)}`}
              aria-haspopup="true"
              data-menu-toggle="hover"
            >
              <NavLink
                className={
                  item.subMenu && item.subMenu.length > 0
                    ? "menu-link menu-toggle"
                    : "menu-link"
                }
                to={item.rootPath}
              >
                <span className="svg-icon menu-icon">
                  <SVG src={toAbsoluteUrl("/media/svg/icons" + item.icon)} />
                </span>
                <span className="menu-text">
                  <FormattedMessage id={item.title} />
                </span>
                {item.subMenu && item.subMenu.length > 0 && (
                  <i className="menu-arrow" />
                )}
              </NavLink>
              {item.subMenu && item.subMenu.length > 0 && (
                <div className="menu-submenu ">
                  <i className="menu-arrow" />
                  <ul className="menu-subnav">
                    <li
                      className="menu-item menu-item-parent"
                      aria-haspopup="true"
                    >
                      <span className="menu-link">
                        <span className="menu-text">
                          <FormattedMessage id={item.title} />
                        </span>
                      </span>
                    </li>
                    {item.subMenu.map((submenu, index_1) => {
                      return (
                        <li
                          key={index_1.toString()}
                          className={`${
                            submenu.subMenu && submenu.subMenu.length > 0
                              ? "menu-item menu-item-submenu"
                              : "menu-item"
                          }  ${getMenuItemActive(submenu.rootPath)}`}
                          aria-haspopup="true"
                        >
                          <NavLink
                            className={
                              submenu.subMenu && submenu.subMenu.length > 0
                                ? "menu-link menu-toggle"
                                : "menu-link"
                            }
                            to={submenu.rootPath}
                          >
                            <i className="menu-bullet menu-bullet-dot">
                              <span />
                            </i>
                            <span className="menu-text">
                              <FormattedMessage id={submenu.title} />
                            </span>
                            {submenu.subMenu && submenu.subMenu.length > 0 && (
                              <i className="menu-arrow" />
                            )}
                          </NavLink>
                          {submenu.subMenu && submenu.subMenu.length > 0 && (
                            <div className="menu-submenu ">
                              <i className="menu-arrow" />
                              <ul className="menu-subnav">
                                {submenu.subMenu.map((submenus, index_2) => {
                                  return (
                                    <li
                                      key={index_2.toString()}
                                      className={`menu-item  ${getMenuItemActive(
                                        submenus.rootPath
                                      )}`}
                                      aria-haspopup="true"
                                    >
                                      <NavLink
                                        className="menu-link"
                                        to={submenus.rootPath}
                                      >
                                        <i className="menu-bullet menu-bullet-dot">
                                          <span />
                                        </i>
                                        <span className="menu-text">
                                          <FormattedMessage
                                            id={submenus.title}
                                          />
                                        </span>
                                      </NavLink>
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
}
