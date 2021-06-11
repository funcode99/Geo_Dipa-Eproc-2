import React, { useState, useEffect } from "react";
import { connect, shallowEqual, useSelector } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import { Card, CardBody } from "../../../../../_metronic/_partials/controls";
import { Table, Pagination } from "react-bootstrap";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../_metronic/_helpers/AssetsHelpers";
import { Link } from "react-router-dom";
import { getContractClient } from "../../_redux/InvoiceMonitoringCrud";
import useToast from "../../../../components/toast";

function DashboardListContract(props) {
  const { intl } = props;

  const openFilterTable = (index) => {
    // let idFilter = "filter-" + "asd";
    // let idInputFilter = "loop-value-" + index;
    // let status = document.getElementById(idFilter).getAttribute("status");
    // if (nameStateFilter === "") {
    //   nameStateFilter = idFilter;
    //   this.setState({ nameStateFilter }, () => {
    //     document.getElementById(idFilter).setAttribute("status", "open");
    //     document.getElementById(idFilter).classList.add("open");
    //   });
    // } else if (nameStateFilter === idFilter) {
    //   if (status === "closed") {
    //     document.getElementById(idFilter).setAttribute("status", "open");
    //     document.getElementById(idFilter).classList.add("open");
    //   } else {
    //     document.getElementById(idFilter).setAttribute("status", "closed");
    //     document.getElementById(idFilter).classList.remove("open");
    //     document.getElementById(idInputFilter).value =
    //       filterTable[idInputFilter] || "";
    //   }
    // } else {
    //   document.getElementById(nameStateFilter).setAttribute("status", "closed");
    //   document.getElementById(nameStateFilter).classList.remove("open");
    //   nameStateFilter = idFilter;
    //   this.setState({ nameStateFilter }, () => {
    //     document.getElementById(idFilter).setAttribute("status", "open");
    //     document.getElementById(idFilter).classList.add("open");
    //   });
    // }
  };

  const updateValueFilter = (property) => {
    // let filterTable = this.state.filterTable;
    // filterTable[property] = document.getElementById(property).value;
    // this.setState({ filterTable });
  };

  const resetValueFilter = (property) => {
    // let filterTable = this.state.filterTable;
    // filterTable[property] = "";
    // document.getElementById(property).value = "";
    // this.setState({ filterTable });
  };

  const resetFilter = () => {
    // let filterTable = {};
    // this.setState({ filterTable });
  };

  const vendor_id = useSelector(
    (state) => state.auth.user.data.vendor_id,
    shallowEqual
  );

  const [filterTable, setFilterTable] = useState({});
  const [contractData, setContractData] = useState([]);
  const [nameStateFilter, setNameStateFilter] = useState([]);
  const [Toast, setToast] = useToast();

  const getListContractData = () => {
    getContractClient()
      .then((response) => {
        setContractData(response.data.data);
      })
      .catch((error) => {
        if (
          error.response?.status !== 400 &&
          error.response?.data.message !== "TokenExpiredError"
        )
          setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 10000);
      });
  };

  useEffect(() => {
    getListContractData();
  }, []);

  return (
    <React.Fragment>
      <Card>
        <CardBody>
          {/* begin: Filter Table */}
          <div className="panel-filter-table mb-1">
            <span className="mr-2 mt-2 float-left">
              <FormattedMessage id="TITLE.FILTER.TABLE" />
            </span>
            <div className="d-block">
              <div className="float-left">
                {contractData.map((item, index) => {
                  return (
                    <div
                      key={index.toString()}
                      className="btn-group hover-filter-table"
                      status="closed"
                      id={"filter-" + index}
                    >
                      <div
                        className="btn btn-sm dropdown-toggle"
                        data-toggle="dropdown"
                        aria-expanded="false"
                        onClick={openFilterTable(index)}
                      >
                        <span>Nomor Kontrak:</span>
                        <strong style={{ paddingRight: 1, paddingLeft: 1 }}>
                          <span
                            className="filter-label"
                            id={"filter-span-" + index}
                          >
                            {filterTable["loop-value-" + index]}
                          </span>
                        </strong>
                        {filterTable["loop-value-" + index] ? null : (
                          <span style={{ color: "#777777" }}>
                            <FormattedMessage id="TITLE.ALL" />
                          </span>
                        )}
                      </div>
                      <ul
                        role="menu"
                        className="dropdown-menu"
                        style={{ zIndex: 90 }}
                      >
                        <li style={{ width: 360, padding: 5 }}>
                          <form className="clearfix">
                            <div className="float-left">
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                name={"loop-value-" + index}
                                id={"loop-value-" + index}
                                defaultValue={
                                  filterTable["loop-value-" + index] || ""
                                }
                                placeholder={intl.formatMessage({
                                  id: "TITLE.ALL",
                                })}
                              />
                            </div>
                            <button
                              type="button"
                              className="ml-2 float-left btn btn-sm btn-primary"
                              onClick={updateValueFilter.bind(
                                "loop-value-" + index
                              )}
                            >
                              Perbaharui
                            </button>
                            <button
                              type="button"
                              className="float-right btn btn-sm btn-light"
                              onClick={resetValueFilter.bind(
                                "loop-value-" + index
                              )}
                            >
                              <i className="fas fa-redo fa-right"></i>
                              <span>
                                <FormattedMessage id="TITLE.FILTER.RESET.TABLE" />
                              </span>
                            </button>
                          </form>
                        </li>
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
            <button
              type="button"
              className="btn btn-sm btn-danger ml-2 mt-2 button-filter-submit float-left"
              onClick={resetFilter}
            >
              <FormattedMessage id="TITLE.FILTER.RESET.TABLE" />
            </button>
          </div>
          {/* end: Filter Table */}

          {/* begin: Table */}
          <div className="table-wrapper-scroll-y my-custom-scrollbar">
            <div className="segment-table">
              <div className="hecto-8">
                <Table className="overflow-auto">
                  <thead>
                    <tr>
                      <th className="text-primary align-middle td-25">
                        <span className="svg-icon svg-icon-sm svg-icon-primary ml-1">
                          <SVG
                            src={toAbsoluteUrl(
                              "/media/svg/icons/Navigation/Down-2.svg"
                            )}
                          />
                        </span>
                        Nomor Kontrak
                        {/* <span className="svg-icon svg-icon-sm svg-icon-primary ml-1">
                                                <SVG src={toAbsoluteUrl("/media/svg/icons/Navigation/Up-2.svg")}/>
                                            </span> */}
                      </th>
                      <th className="text-muted align-middle td-20">
                        Judul Pengadaan
                      </th>
                      <th className="text-muted align-middle td-10">
                        Nomor PO
                      </th>
                      <th className="text-muted align-middle td-10">Termin</th>
                      <th className="text-muted align-middle td-15">
                        Nomor SA
                      </th>
                      <th className="text-muted align-middle td-17">
                        Nomor Invoice
                      </th>
                      <th className="text-muted align-middle td-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contractData.map((item, index) => {
                      return (
                        <tr key={index.toString()}>
                          <td>
                            <Link
                              to={
                                `/client/invoice_monitoring/contract/` + item.id
                              }
                            >
                              {item.contract_no}
                            </Link>
                          </td>
                          <td>
                            <Link
                              to={
                                `/client/invoice_monitoring/contract/` + item.id
                              }
                            >
                              {item.contract_name}
                            </Link>
                          </td>
                          <td>
                            <Link
                              to={
                                `/client/invoice_monitoring/contract/` + item.id
                              }
                            >
                              {item.purch_order_no}
                            </Link>
                          </td>
                          <td>
                            <Link
                              to={
                                `/client/invoice_monitoring/contract/` + item.id
                              }
                            >
                              {index === 0
                                ? 1
                                : index === 1
                                ? 2
                                : index === 2
                                ? 3
                                : index === 3
                                ? 4
                                : 5}
                            </Link>
                          </td>
                          <td>
                            <Link
                              to={
                                `/client/invoice_monitoring/contract/` + item.id
                              }
                            >
                              80000035434
                            </Link>
                          </td>
                          <td>
                            <Link
                              to={
                                `/client/invoice_monitoring/contract/` + item.id
                              }
                            >
                              INV0352345
                            </Link>
                          </td>
                          <td>
                            {index === 1 ? (
                              <label
                                className="font-weight-bold font-italic text-white bg-info rounded px-1 py-1 text-center text-uppercase"
                                style={{ width: 150 }}
                              >
                                Waiting SA
                              </label>
                            ) : index === 2 ? (
                              <label
                                className="font-weight-bold font-italic text-white bg-warning rounded px-1 py-1 text-center text-uppercase"
                                style={{ width: 150 }}
                              >
                                Waiting Invoice
                              </label>
                            ) : index === 3 ? (
                              <label
                                className="font-weight-bold font-italic text-white bg-primary rounded px-1 py-1 text-center text-uppercase"
                                style={{ width: 150 }}
                              >
                                Waiting Document
                              </label>
                            ) : index === 4 ? (
                              <label
                                className="font-weight-bold font-italic text-white bg-danger rounded px-1 py-1 text-center text-uppercase"
                                style={{ width: 150 }}
                              >
                                Document Rejected
                              </label>
                            ) : (
                              <label
                                className="font-weight-bold font-italic text-white bg-success rounded px-1 py-1 text-center text-uppercase"
                                style={{ width: 150 }}
                              >
                                Paid
                              </label>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            </div>
            <div className="table-loading-data">
              <div className="text-center font-weight-bold">
                <div className="table-loading-data-potition">
                  {/* <span>
                      <i className="fas fa-spinner fa-pulse text-dark mr-1"></i>
                      <FormattedMessage id="TITLE.TABLE.WAITING_DATA" />
                    </span>
                    <span>
                      <i className="far fa-frown text-dark mr-1"></i>
                      <FormattedMessage id="TITLE.TABLE.NO_DATA_AVAILABLE" />
                    </span> */}
                </div>
              </div>
            </div>
          </div>
          {/* end: Table */}

          {/* begin: Pagination Table */}
          <div className="mt-3">
            <span>
              <FormattedMessage id="TITLE.COUNT_DATA.TABLE" /> 5/5
            </span>
          </div>
          <div className="d-flex mt-4">
            <select
              className="form-control form-control-sm font-weight-bold mr-4 border-0 bg-light mr-1"
              style={{ width: 75 }}
              defaultValue={5}
            >
              {["5", "10", "20", "50", "100"].map((item, index) => {
                return (
                  <option key={index.toString()} value={item}>
                    {item}
                  </option>
                );
              })}
            </select>
            <Pagination>
              <Pagination.First />
              <Pagination.Prev />

              <Pagination.Item>{11}</Pagination.Item>
              <Pagination.Item active>{12}</Pagination.Item>
              <Pagination.Item disabled>{13}</Pagination.Item>

              <Pagination.Next disabled />
              <Pagination.Last disabled />
            </Pagination>
          </div>
          {/* end: Pagination Table */}
        </CardBody>
      </Card>
    </React.Fragment>
  );
}

export default injectIntl(connect(null, null)(DashboardListContract));
