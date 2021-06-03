/* eslint-disable jsx-a11y/role-supports-aria-props */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from 'react';
import { useLocation } from 'react-router';
import { NavLink } from 'react-router-dom';
import SVG from 'react-inlinesvg';
import { toAbsoluteUrl, checkIsActive } from '../../../../_helpers';
import {
  FormattedMessage,
  // injectIntl
} from 'react-intl';
import { useSelector, shallowEqual } from 'react-redux';
import {
  DataAsideMenuListClient,
  DataAsideMenuListVendor,
} from './DataAsideMenuList';

export function AsideMenuList({ layoutProps }) {
  const location = useLocation();
  const getMenuItemActive = (url, hasSubmenu = false) => {
    return checkIsActive(location, url)
      ? ` ${!hasSubmenu &&
          'menu-item-active'} menu-item-open menu-item-not-hightlighted`
      : '';
  };
  let status = useSelector(
    (state) => state.auth.user.data.status,
    shallowEqual
  );
  let asideMenu =
    status === 'client' ? DataAsideMenuListClient : DataAsideMenuListVendor;

  return (
    <>
      {/* begin::Menu Nav */}
      <ul className={`menu-nav ${layoutProps.ulClasses}`}>
        {/*begin::1 Level*/}
        <li
          className={`menu-item ${getMenuItemActive(
            `/${status}/dashboard`,
            false
          )}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to={`/${status}/dashboard`}>
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl('/media/svg/icons/Design/Layers.svg')} />
            </span>
            <span className="menu-text">Dashboard</span>
          </NavLink>
        </li>
        {/*end::1 Level*/}
        {asideMenu.map((item, index) => {
          return (
            <li
              key={index.toString()}
              className={`${
                item.subMenu && item.subMenu.length > 0
                  ? 'menu-item menu-item-submenu'
                  : 'menu-item'
              } ${getMenuItemActive(item.rootPath, true)}`}
              aria-haspopup="true"
              data-menu-toggle="hover"
            >
              <NavLink
                className={
                  item.subMenu && item.subMenu.length > 0
                    ? 'menu-link menu-toggle'
                    : 'menu-link'
                }
                to={item.rootPath}
              >
                <span className="svg-icon menu-icon">
                  <SVG src={toAbsoluteUrl('/media/svg/icons' + item.icon)} />
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
                              ? 'menu-item menu-item-submenu'
                              : 'menu-item'
                          }  ${getMenuItemActive(submenu.rootPath)}`}
                          aria-haspopup="true"
                        >
                          <NavLink
                            className={
                              submenu.subMenu && submenu.subMenu.length > 0
                                ? 'menu-link menu-toggle'
                                : 'menu-link'
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
        {/* begin: Delivery Monitoring */}
        {/* <li
          className={`menu-item menu-item-submenu ${getMenuItemActive(
            '/client/delivery-monitoring',
            true
          )}`}
          aria-haspopup="true"
          data-menu-toggle="hover"
        >
          <NavLink
            className="menu-link menu-toggle"
            to="/client/delivery-monitoring"
          >
            <span className="svg-icon menu-icon">
              <SVG
                src={toAbsoluteUrl("/media/svg/icons/All/route-solid.svg")}
              />
            </span>
            <span className="menu-text">
              <FormattedMessage id="MENU.DELIVERY_MONITORING" />
            </span>
            <i className="menu-arrow" />
          </NavLink>
          <div className="menu-submenu ">
            <i className="menu-arrow" />
            <ul className="menu-subnav">
              <li className="menu-item  menu-item-parent" aria-haspopup="true">
                <span className="menu-link">
                  <span className="menu-text">
                    <FormattedMessage id="MENU.DELIVERY_MONITORING" />
                  </span>
                </span>
              </li>
              <li
                className={`menu-item ${getMenuItemActive(
                  '/client/delivery-monitoring'
                )}`}
                aria-haspopup="true"
              >
                <NavLink className="menu-link" to="/client/delivery-monitoring">
                  <i className="menu-bullet menu-bullet-dot">
                    <span />
                  </i>
                  <span className="menu-text">
                    <FormattedMessage id="MENU.DELIVERY_MONITORING.LIST_CONTRACT_PO" />
                  </span>
                </NavLink>
              </li>
              <li
                className={`menu-item ${getMenuItemActive(
                  '/client/delivery-monitoring/error-v2'
                )}`}
                aria-haspopup="true"
              >
                <NavLink
                  className="menu-link"
                  to="/client/delivery-monitoring/error-v2"
                >
                  <i className="menu-bullet menu-bullet-dot">
                    <span />
                  </i>
                  <span className="menu-text">
                    <FormattedMessage id="MENU.DELIVERY_MONITORING.GOOD_RECEIPT" />
                  </span>
                </NavLink>
              </li>
              <li
                className={`menu-item ${getMenuItemActive(
                  '/client/delivery-monitoring/error-v3'
                )}`}
                aria-haspopup="true"
              >
                <NavLink
                  className="menu-link"
                  to="/client/delivery-monitoring/error-v3"
                >
                  <i className="menu-bullet menu-bullet-dot">
                    <span />
                  </i>
                  <span className="menu-text">
                    <FormattedMessage id="MENU.DELIVERY_MONITORING.SERVICE_ACCEPTANCE" />
                  </span>
                </NavLink>
              </li>
            </ul>
          </div>
        </li> */}
        {/* end: Delivery Monitoring */}

        {/* begin: Invoice Monitoring || Create By Jeffry Azhari Rosman || jeffryazhari@gmail.com */}
        {/* <li
          className={`menu-item menu-item-submenu ${getMenuItemActive(
            "/client/invoice_monitoring",
            false
          )}`}
          aria-haspopup="true"
          data-menu-toggle="hover"
        >
          <NavLink
            className="menu-link menu-toggle"
            to="/client/invoice_monitoring/list"
          >
            <span className="svg-icon menu-icon">
              <SVG
                src={toAbsoluteUrl(
                  "/media/svg/icons/All/file-invoice-dollar-solid.svg"
                )}
              />
            </span>
            <span className="menu-text">
              <FormattedMessage id="MENU.INVOICE_MONITORING" />
            </span>
            <i className="menu-arrow" />
          </NavLink>
          <div className="menu-submenu ">
            <i className="menu-arrow" />
            <ul className="menu-subnav">
              <li className="menu-item  menu-item-parent" aria-haspopup="true">
                <span className="menu-link">
                  <span className="menu-text">
                    <FormattedMessage id="MENU.INVOICE_MONITORING" />
                  </span>
                </span>
              </li>
              <li
                className={`menu-item ${getMenuItemActive(
                  "/client/invoice_monitoring"
                )}`}
                aria-haspopup="true"
              >
                <NavLink className="menu-link" to="/client/invoice_monitoring">
                  <i className="menu-bullet menu-bullet-dot">
                    <span />
                  </i>
                  <span className="menu-text">
                    <FormattedMessage id="MENU.DELIVERY_MONITORING.LIST_CONTRACT_PO" />
                  </span>
                </NavLink>
              </li>
              <li
                className={`menu-item ${getMenuItemActive(
                  "/invoice_monitoring/error-v2"
                )}`}
                aria-haspopup="true"
              >
                <NavLink
                  className="menu-link"
                  to="/invoice_monitoring/error-v2"
                >
                  <i className="menu-bullet menu-bullet-dot">
                    <span />
                  </i>
                  <span className="menu-text">
                    <FormattedMessage id="MENU.INVOICE_MONITORING.INVOICE_DOCUMENT" />
                  </span>
                </NavLink>
              </li>
              <li
                className={`menu-item ${getMenuItemActive(
                  "/invoice_monitoring/error-v3"
                )}`}
                aria-haspopup="true"
              >
                <NavLink
                  className="menu-link"
                  to="/invoice_monitoring/error-v3"
                >
                  <i className="menu-bullet menu-bullet-dot">
                    <span />
                  </i>
                  <span className="menu-text">
                    <FormattedMessage id="MENU.INVOICE_MONITORING.BKB_FV" />
                  </span>
                </NavLink>
              </li>
              <li
                className={`menu-item ${getMenuItemActive(
                  "/invoice_monitoring/error-v3"
                )}`}
                aria-haspopup="true"
              >
                <NavLink
                  className="menu-link"
                  to="/invoice_monitoring/error-v3"
                >
                  <i className="menu-bullet menu-bullet-dot">
                    <span />
                  </i>
                  <span className="menu-text">
                    <FormattedMessage id="MENU.INVOICE_MONITORING.SPT" />
                  </span>
                </NavLink>
              </li>
              <li
                className={`menu-item ${getMenuItemActive(
                  "/invoice_monitoring/error-v3"
                )}`}
                aria-haspopup="true"
              >
                <NavLink
                  className="menu-link"
                  to="/invoice_monitoring/error-v3"
                >
                  <i className="menu-bullet menu-bullet-dot">
                    <span />
                  </i>
                  <span className="menu-text">
                    <FormattedMessage id="MENU.INVOICE_MONITORING.TAX" />
                  </span>
                </NavLink>
              </li>
            </ul>
          </div>
        </li> */}
        {/* end: Invoice Monitoring || Create By Jeffry Azhari Rosman || jeffryazhari@gmail.com */}

        {/* begin: User Management */}
        {/* <li
          className={`menu-item ${getMenuItemActive(
            "/user_management",
            false
          )}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/user_management">
            <span className="svg-icon menu-icon">
              <SVG
                src={toAbsoluteUrl("/media/svg/icons/All/users-solid.svg")}
              />
            </span>
            <span className="menu-text">
              <FormattedMessage id="MENU.USER_MANAGEMENT" />
            </span>
          </NavLink>
        </li> */}
        {/* end: User Management */}

        {/* begin: Master Data || Farhan Aziz */}
        {/* <li
          className={`menu-item menu-item-submenu ${getMenuItemActive(
            "/client/master",
            true
          )}`}
          aria-haspopup="true"
          data-menu-toggle="hover"
        >
          <NavLink className="menu-link menu-toggle" to="/client/master">
            <span className="svg-icon menu-icon">
              <SVG
                src={toAbsoluteUrl("/media/svg/icons/All/table-solid.svg")}
              />
            </span>
            <span className="menu-text">
              <FormattedMessage id="MENU.MASTER_DATA" />
            </span>
            <i className="menu-arrow" />
          </NavLink>
          <div className="menu-submenu ">
            <i className="menu-arrow" />
            <ul className="menu-subnav">
              <li className="menu-item  menu-item-parent" aria-haspopup="true">
                <span className="menu-link">
                  <span className="menu-text">
                    Master Data
                  </span>
                </span>
              </li>
              <li
                className={`menu-item ${getMenuItemActive(
                  '/client/master/document_types'
                )}`}
                aria-haspopup="true"
              >
                <NavLink
                  className="menu-link"
                  to="/client/master/document_types"
                >
                  <i className="menu-bullet menu-bullet-dot">
                    <span />
                  </i>
                  <span className="menu-text">
                    Document Types
                  </span>
                </NavLink>
              </li>
              <li
                className={`menu-item ${getMenuItemActive(
                  '/client/master/periode'
                )}`}
                aria-haspopup="true"
              >
                <NavLink className="menu-link" to="/client/master/periode">
                  <i className="menu-bullet menu-bullet-dot">
                    <span />
                  </i>
                  <span className="menu-text">Periode</span>
                </NavLink>
              </li>
              <li
                className={`menu-item ${getMenuItemActive(
                  '/client/master/roles'
                )}`}
                aria-haspopup="true"
              >
                <NavLink className="menu-link" to="/client/master/roles">
                  <i className="menu-bullet menu-bullet-dot">
                    <span />
                  </i>
                  <span className="menu-text">Roles</span>
                </NavLink>
              </li>
              <li
                className={`menu-item ${getMenuItemActive(
                  "/client/master/service_level_agreement"
                )}`}
                aria-haspopup="true"
              >
                <NavLink
                  className="menu-link"
                  to="/client/master/service_level_agreement"
                >
                  <i className="menu-bullet menu-bullet-dot">
                    <span />
                  </i>
                  <span className="menu-text">
                    <FormattedMessage id="TITLE.SERVICE_LEVEL_AGREEMENT" />
                  </span>
                </NavLink>
              </li>
            </ul>
          </div>
        </li> */}
        {/* end: Master Data || Create By Farhan Aziz  */}
      </ul>

      {/* end::Menu Nav */}
    </>
  );
}
