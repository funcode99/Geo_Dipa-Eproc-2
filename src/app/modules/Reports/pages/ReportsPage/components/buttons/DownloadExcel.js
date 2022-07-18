import React, { useCallback } from "react";
import { Dropdown } from "react-bootstrap";

const DownloadExcel = ({ ExcelDownloder, data, type }) => {
  return (
    <div>
      <ExcelDownloder
        data={data}
        filename={"book"}
        type={type}
        className="btn btn-success btn-sm px-5 ml-3"
      >
        {"Download"}
      </ExcelDownloder>
      {/* <div
        className="btn btn-success btn-sm px-5 ml-3"
        // variant="transparent"
        // id="dropdown-toggle-top"
      >
      {"Download"}
      </div> */}
      {/* <Dropdown className="dropdown-inline ml-3" drop="down" alignRight>
        <Dropdown.Toggle
          className="btn-success btn-sm font-weight-bolder dropdown-toggle px-5"
          variant="transparent"
          id="dropdown-toggle-top"
        >
          {"Download (xlsx)"}
        </Dropdown.Toggle>
        <Dropdown.Menu className="dropdown-menu dropdown-menu-sm dropdown-menu-right">
          <ul className="navi navi-hover">
            <Dropdown.Item
              // href="#"
              className="navi-link"
              onClick={() => handleDownloadExcel()}
            >
              <span className="navi-text">Excel (xlsx)</span>
            </Dropdown.Item>
          </ul>
        </Dropdown.Menu>
      </Dropdown> */}
    </div>
  );
};

export default DownloadExcel;
