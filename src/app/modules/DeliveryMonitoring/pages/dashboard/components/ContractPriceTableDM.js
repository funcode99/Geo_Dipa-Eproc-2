/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, { useState, useCallback } from "react";
import { Dropdown } from "react-bootstrap";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Link } from "react-router-dom";
import { DropdownMenu2 } from "../../../../../../_metronic/_partials/dropdowns";
import { rupiah } from "../../../../../libs/currency";

const ContractPriceTable = ({
  data,
  option,
  authStatus,
  onFetch,
  loading,
  className,
}) => {
  const [selected, setSelected] = useState(option?.[0]?.name);
  React.useEffect(() => {
    if (!!option) {
      // onFetch(option?.[0]?.plant_id);
      onFetch(option?.[0]?.id);
      setSelected(option?.[0]?.name);
    }
  }, [option]);

  const handleSelect = useCallback(
    (item) => {
      // onFetch(item?.plant_id);
      onFetch(item?.id);
      setSelected(item?.name);
    },
    [onFetch, setSelected]
  );
  return (
    <>
      {/* begin::Advance Table Widget 9 */}
      <div className={`card card-custom ${className}`}>
        {/* begin::Header */}
        <div className="card-header border-0 py-5">
          <h3 className="card-title align-items-start flex-column">
            <span className="card-label font-weight-bolder text-dark">
              Contract Prices
            </span>
          </h3>
          <div className="card-toolbar">
            {/* <div className="card-toolbar"> */}
            <Dropdown className="dropdown-inline" drop="down" alignRight>
              <Dropdown.Toggle
                className="btn-primary btn-sm font-weight-bolder dropdown-toggle px-5"
                variant="transparent"
                id="dropdown-toggle-top"
              >
                {selected || "Choose Group"}
              </Dropdown.Toggle>
              <Dropdown.Menu className="dropdown-menu dropdown-menu-sm dropdown-menu-right">
                <ul className="navi navi-hover">
                  {option?.map((opt, id) => (
                    <li key={id} className="navi-item">
                      <Dropdown.Item
                        // href="#"
                        className="navi-link"
                        onClick={() => handleSelect(opt)}
                      >
                        <span className="navi-text">{opt?.name}</span>
                      </Dropdown.Item>
                    </li>
                  ))}
                </ul>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
        {/* end::Header */}

        {/* begin::Body */}
        <div className="card-body pt-0 pb-3">
          <div className="tab-content">
            {/* begin::Table */}
            <div className="table-responsive">
              <table className="table table-head-custom table-vertical-center table-head-bg table-borderless">
                <thead>
                  <tr className="text-left">
                    <th style={{ minWidth: "450px" }} className="pl-7">
                      <span className="text-dark-75">Contract</span>
                    </th>
                    <th style={{ minWidth: "120px" }}>Price</th>
                    {/* <th style={{ minWidth: "100px" }}>comission</th>
                    <th style={{ minWidth: "100px" }}>company</th>
                    <th style={{ minWidth: "100px" }}>rating</th> */}
                    <th style={{ minWidth: "150px" }} />
                  </tr>
                </thead>
                {/* <PerfectScrollbar
                  options={perfectScrollbarOptions}
                  className="scroll"
                  style={{
                    maxHeight: "calc(100% - 25px)",
                    position: "relative",
                  }}
                > */}
                <tbody>
                  {data?.map((item, id) => (
                    <tr key={id}>
                      <td className="pl-0 py-8">
                        <div className="d-flex align-items-center">
                          <div>
                            <Link
                              to="#"
                              className="text-dark-75 font-weight-bolder text-hover-primary mb-1 font-size-lg"
                            >
                              {item?.contract_name}
                            </Link>
                            <span className="text-muted font-weight-bold d-block">
                              {item?.contract_no}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="text-dark-75 font-weight-bolder d-block font-size-lg">
                          {rupiah(parseInt(item?.contract_value))}
                        </span>
                      </td>
                      <td className="pr-0 text-right">
                        <Link
                          to={`/${authStatus}/delivery-monitoring/contract/${item?.id}`}
                          className="btn btn-light-success font-weight-bolder font-size-sm"
                        >
                          View More
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
                {/* </PerfectScrollbar> */}
              </table>
            </div>
            {/* end::Table */}
          </div>
        </div>
        {/* end::Body */}
      </div>
      {/* end::Advance Table Widget 9 */}
    </>
  );
};
const perfectScrollbarOptions = {
  wheelSpeed: 2,
  wheelPropagation: false,
};
export default ContractPriceTable;
