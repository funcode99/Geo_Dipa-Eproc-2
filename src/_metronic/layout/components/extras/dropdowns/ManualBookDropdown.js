/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import { Help } from "@material-ui/icons";
import clsx from "clsx";
import React, { useMemo } from "react";
import { Dropdown, OverlayTrigger, Tooltip } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import { openLinkTab } from "../../../../../app/service/helper/urlHelper";
import { useLang } from "../../../../i18n";
import { DropdownTopbarItemToggler } from "../../../../_partials/dropdowns";

// User Manual Delivery Monitoring Direksi dan General Manager.pdf
// User Manual Delivery Monitoring External (Vendor)_Bahasa Indonesia.pdf
// User Manual Delivery Monitoring External (Vendor)_English.pdf
// User Manual Delivery Monitoring.pdf
// User Manual Invoice Monitoring External (Vendor)_Bahasa Indonesia.pdf
// User Manual Invoice Monitoring External (Vendor)_English.pdf
// User Manual Invoice Monitoring.pdf

const manual_books = [
  {
    lang: "en",
    name: "User Manual Delivery Monitoring Direksi dan General Manager",
    url: "/User Manual Delivery Monitoring Direksi dan General Manager.pdf",
    type: "all",
  },
  {
    lang: "en",
    name: "User Manual Delivery Monitoring External (Vendor)_Bahasa Indonesia",
    url:
      "/User Manual Delivery Monitoring External (Vendor)_Bahasa Indonesia.pdf",
    type: "vendor",
  },
  {
    lang: "en",
    name: "User Manual Delivery Monitoring External (Vendor)_English",
    url: "/User Manual Delivery Monitoring External (Vendor)_English.pdf",
    type: "vendor",
  },
  {
    lang: "en",
    name: "User Manual Delivery Monitoring",
    url: "/User Manual Delivery Monitoring.pdf",
    type: "all",
  },
  {
    lang: "en",
    name: "User Manual Invoice Monitoring External (Vendor)_Bahasa Indonesia",
    url:
      "/User Manual Invoice Monitoring External (Vendor)_Bahasa Indonesia.pdf",
    type: "vendor",
  },
  {
    lang: "en",
    name: "User Manual Invoice Monitoring External (Vendor)_English",
    url: "/User Manual Invoice Monitoring External (Vendor)_English.pdf",
    type: "vendor",
  },
  {
    lang: "en",
    name: "User Manual Invoice Monitoring",
    url: "/User Manual Invoice Monitoring.pdf",
    type: "all",
  },
];

const BASE_URL_PROD = "https://api-eproc2.geodipa.co.id/v1";

export function ManualBookDropdown() {
  const lang = useLang();
  let status = useSelector(
    (state) => state.auth.user.data.status,
    shallowEqual
  );

  const listUsed = useMemo(
    () =>
      status === "vendor"
        ? manual_books.filter((el) => el.type === "vendor")
        : manual_books,
    [status]
  );
  return (
    <Dropdown drop="down" alignRight>
      <Dropdown.Toggle
        as={DropdownTopbarItemToggler}
        id="dropdown-toggle-my-cart"
      >
        <OverlayTrigger
          placement="bottom"
          overlay={<Tooltip id="language-panel-tooltip">Manual Book</Tooltip>}
        >
          <div className="btn btn-icon btn-clean btn-dropdown btn-lg mr-1">
            <Help />
          </div>
        </OverlayTrigger>
      </Dropdown.Toggle>
      <Dropdown.Menu
        className="p-0 m-0 dropdown-menu-right dropdown-menu-anim dropdown-menu-top-unround"
        style={{ width: 300 }}
      >
        <ul className="navi navi-hover py-4">
          {listUsed.map((book, id) => (
            <li key={`book${id}`} className={clsx("navi-item")}>
              <a
                href="#"
                onClick={() => {
                  openLinkTab(BASE_URL_PROD + book.url);
                }}
                className="navi-link"
              >
                <span className="navi-text">{book.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </Dropdown.Menu>
    </Dropdown>
  );
}
