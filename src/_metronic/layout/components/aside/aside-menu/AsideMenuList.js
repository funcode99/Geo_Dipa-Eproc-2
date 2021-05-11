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

export function AsideMenuList({ layoutProps }) {
  const location = useLocation();
  const getMenuItemActive = (url, hasSubmenu = false) => {
    return checkIsActive(location, url)
      ? ` ${!hasSubmenu &&
          'menu-item-active'} menu-item-open menu-item-not-hightlighted`
      : '';
  };

  return (
    <>
      {/* begin::Menu Nav */}
      <ul className={`menu-nav ${layoutProps.ulClasses}`}>
        {/*begin::1 Level*/}
        <li
          className={`menu-item ${getMenuItemActive(
            '/client/dashboard',
            false
          )}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/client/dashboard">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl('/media/svg/icons/Design/Layers.svg')} />
            </span>
            <span className="menu-text">Dashboard</span>
          </NavLink>
        </li>
        {/*end::1 Level*/}

        {/* begin: Delivery Monitoring */}
        <li
          className={`menu-item menu-item-submenu ${getMenuItemActive(
            '/delivery_monitoring',
            true
          )}`}
          aria-haspopup="true"
          data-menu-toggle="hover"
        >
          <NavLink className="menu-link menu-toggle" to="/delivery_monitoring">
            <span className="svg-icon menu-icon">
              <SVG
                src={toAbsoluteUrl('/media/svg/icons/All/route-solid.svg')}
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
                  '/delivery_monitoring/error-v1'
                )}`}
                aria-haspopup="true"
              >
                <NavLink
                  className="menu-link"
                  to="/delivery_monitoring/error-v1"
                >
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
                  '/delivery_monitoring/error-v2'
                )}`}
                aria-haspopup="true"
              >
                <NavLink
                  className="menu-link"
                  to="/delivery_monitoring/error-v2"
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
                  '/delivery_monitoring/error-v3'
                )}`}
                aria-haspopup="true"
              >
                <NavLink
                  className="menu-link"
                  to="/delivery_monitoring/error-v3"
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
        </li>
        {/* end: Delivery Monitoring */}

        {/* begin: Invoice Monitoring || Create By Jeffry Azhari Rosman || jeffryazhari@gmail.com */}
        <li
          className={`menu-item menu-item-submenu ${getMenuItemActive(
            '/client/invoice_monitoring',
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
                  '/media/svg/icons/All/file-invoice-dollar-solid.svg'
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
                  '/client/invoice_monitoring'
                )}`}
                aria-haspopup="true"
              >
                <NavLink
                  className="menu-link"
                  to="/client/invoice_monitoring/list"
                >
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
                  '/invoice_monitoring/error-v2'
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
                  '/invoice_monitoring/error-v3'
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
                  '/invoice_monitoring/error-v3'
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
                  '/invoice_monitoring/error-v3'
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
        </li>
        {/* end: Invoice Monitoring || Create By Jeffry Azhari Rosman || jeffryazhari@gmail.com */}

        {/* begin: User Management */}
        <li
          className={`menu-item ${getMenuItemActive(
            '/user_management',
            false
          )}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/user_management">
            <span className="svg-icon menu-icon">
              <SVG
                src={toAbsoluteUrl('/media/svg/icons/All/users-solid.svg')}
              />
            </span>
            <span className="menu-text">
              <FormattedMessage id="MENU.USER_MANAGEMENT" />
            </span>
          </NavLink>
        </li>
        {/* end: User Management */}

        {/* begin: Master Data || Farhan Aziz */}
        <li
          className={`menu-item menu-item-submenu ${getMenuItemActive(
            '/master',
            true
          )}`}
          aria-haspopup="true"
          data-menu-toggle="hover"
        >
          <NavLink className="menu-link menu-toggle" to="/delivery_monitoring">
            <span className="svg-icon menu-icon">
              <SVG
                src={toAbsoluteUrl('/media/svg/icons/All/table-solid.svg')}
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
                    {/* <FormattedMessage id="MENU.MASTER_DATA" /> */}
                    Master Data
                  </span>
                </span>
              </li>
              <li
                className={`menu-item ${getMenuItemActive(
                  '/master/document_types'
                )}`}
                aria-haspopup="true"
              >
                <NavLink className="menu-link" to="/master/document_types">
                  <i className="menu-bullet menu-bullet-dot">
                    <span />
                  </i>
                  <span className="menu-text">
                    Document Types
                    {/* <FormattedMessage id="MENU.MASTER_DATA.LIST_CONTRACT_PO" /> */}
                  </span>
                </NavLink>
              </li>
              <li
                className={`menu-item ${getMenuItemActive('/master/error-v2')}`}
                aria-haspopup="true"
              >
                <NavLink
                  className="menu-link"
                  to="/delivery_monitoring/error-v2"
                >
                  <i className="menu-bullet menu-bullet-dot">
                    <span />
                  </i>
                  <span className="menu-text">
                    <FormattedMessage id="MENU.DELIVERY_MONITORING.GOOD_RECEIPT" />
                  </span>
                </NavLink>
              </li>
            </ul>
          </div>
        </li>
        {/* end: Master Data || Create By Farhan Aziz  */}
      </ul>

      {/* end::Menu Nav */}
    </>
  );
}
