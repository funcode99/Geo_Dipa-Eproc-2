import React, { useState, useEffect, useCallback } from "react";
import { connect, shallowEqual, useSelector } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import { Card, CardBody } from "../../../../../_metronic/_partials/controls";
import { Table, Pagination } from "react-bootstrap";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../_metronic/_helpers/AssetsHelpers";
import { Link } from "react-router-dom";
import { getContractClient } from "../../_redux/InvoiceMonitoringCrud";
import useToast from "../../../../components/toast";
import { getListSpt } from "../../_redux/InvoiceMonitoringCrud";
import { TablePagination } from "@material-ui/core";
import ButtonAction from "../../../../components/buttonAction/ButtonAction";
import { rupiah } from "../../../../libs/currency";
import { useHistory } from "react-router-dom";

const data_ops = [
  {
    label: "TITLE.OPEN_INVOICE",
    icon: "fas fa-search text-primary",
    type: "open",
  },
];

function DashboardListContract(props) {
  const { intl } = props;
  const vendor_id = useSelector(
    (state) => state.auth.user.data.vendor_id,
    shallowEqual
  );
  const [contractData, setContractData] = useState([]);
  const [Toast, setToast] = useToast();
  const [filterTable, setFilterTable] = useState({});
  const [nameStateFilter, setNameStateFilter] = useState("");
  const [paginations, setPaginations] = useState({
    numberColum: 0,
    page: 0,
    count: 15,
    rowsPerPage: 10,
  });
  const [filterData] = useState([
    {
      title: intl.formatMessage({
        id: "CONTRACT_DETAIL.LABEL.CONTRACT_NUMBER",
      }),
      name: "contract_no",
      type: "text",
    },
    {
      title: intl.formatMessage({
        id: "TITLE.PROCUREMENT_TITLE",
      }),
      name: "procurement_title",
      type: "text",
    },
    {
      title: intl.formatMessage({
        id: "TITLE.PO_NUMBER",
      }),
      name: "po_no",
      type: "text",
    },
  ]);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [filterSort, setFilterSort] = useState({ filter: {}, sort: {} });
  const [sortData, setSortData] = useState({
    name: "contract_no",
    order: false,
  });
  const [err, setErr] = useState(false);
  const [dialogState, setDialogState] = useState(false);
  const history = useHistory();

  const requestFilterSort = useCallback(
    (updateFilterTable, updateSortTable) => {
      setErr(false);
      setLoading(true);
      setData([]);
      let pagination = Object.assign({}, paginations);
      let filterSorts = filterSort;
      filterSorts.filter = JSON.stringify(
        updateFilterTable ? updateFilterTable : filterTable
      );
      filterSorts.sort = JSON.stringify(
        updateSortTable ? updateSortTable : sortData
      );
      pagination.page = pagination.page + 1;
      filterSorts = Object.assign({}, filterSorts, pagination);
      setFilterSort({ ...filterSorts });
      let params = new URLSearchParams(filterSorts).toString();
      getListSpt(params)
        .then((result) => {
          setLoading(false);
          setData(result.data.data);
          setPaginations({ ...paginations, count: result.data.count || 0 });
        })
        .catch((err) => {
          setErr(true);
          setLoading(false);
          setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 5000);
        });
    },
    [filterTable, sortData, filterSort, intl, setToast, paginations]
  );

  // useEffect(requestFilterSort, []);

  const openFilterTable = (name, index) => {
    let idFilter = "filter-" + index;
    let idInputFilter = "filter-" + name;
    let status = document.getElementById(idFilter).getAttribute("status");
    if (nameStateFilter === "") {
      setNameStateFilter(idFilter);
      document.getElementById(idFilter).setAttribute("status", "open");
      document.getElementById(idFilter).classList.add("open");
    } else if (nameStateFilter === idFilter) {
      if (status === "closed") {
        document.getElementById(idFilter).setAttribute("status", "open");
        document.getElementById(idFilter).classList.add("open");
      } else {
        document.getElementById(idFilter).setAttribute("status", "closed");
        document.getElementById(idFilter).classList.remove("open");
        document.getElementById(idInputFilter).value =
          filterTable[idInputFilter] || "";
      }
    } else {
      document.getElementById(nameStateFilter).setAttribute("status", "closed");
      document.getElementById(nameStateFilter).classList.remove("open");
      setNameStateFilter(idFilter);
      document.getElementById(idFilter).setAttribute("status", "open");
      document.getElementById(idFilter).classList.add("open");
    }
  };

  const updateValueFilter = (property, index) => {
    let filterTables = filterTable;
    filterTables["filter-" + property] = document.getElementById(
      "filter-" + property
    ).value;
    setFilterTable({ ...filterTables });
    openFilterTable(property, index);
    // requestFilterSort();
  };

  const resetValueFilter = (property) => {
    let filterTables = filterTable;
    filterTables[property] = "";
    document.getElementById(property).value = "";
    setFilterTable({ ...filterTables });
    // requestFilterSort();
  };

  const resetFilter = () => {
    setFilterTable({});
    document.getElementById("filter-form-all").reset();
    // requestFilterSort({});
  };

  const handleChangePage = (event, newPage) => {
    let pagination = paginations;
    pagination.numberColum =
      newPage > pagination.page
        ? pagination.numberColum + pagination.rowsPerPage
        : pagination.numberColum - pagination.rowsPerPage;
    pagination.page = newPage;
    setPaginations({
      ...pagination,
    });
    // requestFilterSort();
  };

  const handleChangeRowsPerPage = (event) => {
    let pagination = paginations;
    pagination.page = 0;
    pagination.rowsPerPage = parseInt(event.target.value, 10);
    pagination.numberColum = 0;
    setPaginations({
      ...pagination,
    });
    // requestFilterSort();
  };

  const getListContractData = () => {
    setErr(false);
    setLoading(true);
    getContractClient()
      .then((response) => {
        setContractData(response.data.data);
        setErr(false);
        setLoading(false);
      })
      .catch((error) => {
        setErr(true);
        setLoading(false);
          setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 10000);
      });
  };

  useEffect(() => {
    getListContractData();
  }, []);

  const handleAction = (type, data) => {
    console.log("type: ", type, " - ", "data: ", data);
    history.push(`/client/invoice_monitoring/contract/${data.id}`);
  };

  return (
    <React.Fragment>
      <Card>
        <CardBody>
          {/* begin: Filter Table */}
          <form id="filter-form-all" className="panel-filter-table mb-1">
            <span className="mr-2 mt-2 float-left">
              <FormattedMessage id="TITLE.FILTER.TABLE" />
            </span>
            <div className="d-block">
              <div className="">
                {filterData.map((item, index) => {
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
                        onClick={() => {
                          openFilterTable(item.name, index);
                        }}
                      >
                        <span>{item.title}:</span>
                        <strong style={{ paddingRight: 1, paddingLeft: 1 }}>
                          <span
                            className="filter-label"
                            id={"filter-span-" + index}
                          >
                            {filterTable["filter-" + item.name]}
                          </span>
                        </strong>
                        {filterTable["filter-" + item.name] ? null : (
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
                          <div className="clearfix">
                            <div className="float-left">
                              <input
                                type={item.type}
                                className="form-control form-control-sm"
                                min="0"
                                name={"filter-" + item.name}
                                id={"filter-" + item.name}
                                defaultValue={
                                  filterTable["filter-" + item.name] || ""
                                }
                                placeholder={intl.formatMessage({
                                  id: "TITLE.ALL",
                                })}
                              />
                            </div>
                            <button
                              type="button"
                              className="ml-2 float-left btn btn-sm btn-primary"
                              onClick={() => {
                                updateValueFilter(item.name, index);
                              }}
                            >
                              Perbaharui
                            </button>
                            <button
                              type="button"
                              className="float-right btn btn-sm btn-light"
                              onClick={() => {
                                resetValueFilter("filter-" + item.name);
                              }}
                            >
                              <i className="fas fa-redo fa-right"></i>
                              <span>
                                <FormattedMessage id="TITLE.FILTER.RESET.TABLE" />
                              </span>
                            </button>
                          </div>
                        </li>
                      </ul>
                    </div>
                  );
                })}
                <button
                  type="button"
                  className="btn btn-sm btn-danger ml-2 mt-2 button-filter-submit"
                  onClick={() => {
                    resetFilter();
                  }}
                >
                  <FormattedMessage id="TITLE.FILTER.RESET.TABLE" />
                </button>
              </div>
            </div>
          </form>
          {/* end: Filter Table */}

          {/* begin: Table */}
          <div className="table-wrapper-scroll-y my-custom-scrollbar">
            <div className="segment-table">
              <div className="hecto-8">
                <table className="table-bordered overflow-auto">
                  <thead>
                    <tr>
                      <th
                        className="bg-primary text-white align-middle pointer"
                        id="contract_no"
                        onClick={(e) => {
                          let sortDatas = sortData;
                          sortDatas.name = e.target.id;
                          sortDatas.order = sortDatas.order ? false : true;
                          setSortData({ ...sortDatas });
                          // requestFilterSort();
                        }}
                      >
                        {sortData.name === "contract_no" && (
                          <span
                            id="iconSort"
                            className="svg-icon svg-icon-sm svg-icon-white ml-1"
                          >
                            {sortData.order ? (
                              <SVG
                                src={toAbsoluteUrl(
                                  "/media/svg/icons/Navigation/Up-2.svg"
                                )}
                              />
                            ) : (
                              <SVG
                                src={toAbsoluteUrl(
                                  "/media/svg/icons/Navigation/Down-2.svg"
                                )}
                              />
                            )}
                          </span>
                        )}
                        Nomor Kontrak
                      </th>
                      <th
                        className="bg-primary text-white align-middle pointer"
                        id="procurement_title"
                        onClick={(e) => {
                          let sortDatas = sortData;
                          sortDatas.name = e.target.id;
                          sortDatas.order = sortDatas.order ? false : true;
                          setSortData({ ...sortDatas });
                          // requestFilterSort();
                        }}
                      >
                        {sortData.name === "procurement_title" && (
                          <span
                            id="iconSort"
                            className="svg-icon svg-icon-sm svg-icon-white ml-1"
                          >
                            {sortData.order ? (
                              <SVG
                                src={toAbsoluteUrl(
                                  "/media/svg/icons/Navigation/Up-2.svg"
                                )}
                              />
                            ) : (
                              <SVG
                                src={toAbsoluteUrl(
                                  "/media/svg/icons/Navigation/Down-2.svg"
                                )}
                              />
                            )}
                          </span>
                        )}
                        Judul Pengadaan
                      </th>
                      <th
                        className="bg-primary text-white align-middle pointer"
                        id="po_no"
                        onClick={(e) => {
                          let sortDatas = sortData;
                          sortDatas.name = e.target.id;
                          sortDatas.order = sortDatas.order ? false : true;
                          setSortData({ ...sortDatas });
                          // requestFilterSort();
                        }}
                      >
                        {sortData.name === "po_no" && (
                          <span
                            id="iconSort"
                            className="svg-icon svg-icon-sm svg-icon-white ml-1"
                          >
                            {sortData.order ? (
                              <SVG
                                src={toAbsoluteUrl(
                                  "/media/svg/icons/Navigation/Up-2.svg"
                                )}
                              />
                            ) : (
                              <SVG
                                src={toAbsoluteUrl(
                                  "/media/svg/icons/Navigation/Down-2.svg"
                                )}
                              />
                            )}
                          </span>
                        )}
                        Nomor PO
                      </th>
                      <th className="bg-primary text-white align-middle">
                        Tanggal
                      </th>
                      <th className="bg-primary text-white align-middle">
                        Status
                      </th>
                      <th className="bg-primary text-white align-middle">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {contractData.map((item, index) => {
                      return (
                        <tr key={index.toString()}>
                          <td>{item.contract_no}</td>
                          <td>{item.contract_name}</td>
                          <td>{item.purch_order_no}</td>
                          <td>
                            {window
                              .moment(new Date(item.from_time))
                              .format("DD MMM YYYY")}
                          </td>
                          <td></td>
                          <td>
                            <ButtonAction
                              data={item}
                              handleAction={handleAction}
                              ops={data_ops}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="table-loading-data">
              <div className="text-center font-weight-bold">
                <div className="table-loading-data-potition">
                  {loading && (
                    <span>
                      <i className="fas fa-spinner fa-pulse text-dark mr-1"></i>
                      <FormattedMessage id="TITLE.TABLE.WAITING_DATA" />
                    </span>
                  )}
                  {err && (
                    <span className="text-danger">
                      <i className="far fa-frown text-danger mr-1"></i>
                      <FormattedMessage id="TITLE.ERROR_REQUEST" />
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* end: Table */}

          {/* begin: Pagination Table */}
          <TablePagination
            component="div"
            count={paginations.count}
            page={paginations.page}
            onChangePage={handleChangePage}
            rowsPerPage={paginations.rowsPerPage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
          {/* end: Pagination Table */}
        </CardBody>
      </Card>
    </React.Fragment>
  );
}

export default injectIntl(connect(null, null)(DashboardListContract));
