import React, { useState, useEffect, useCallback } from "react";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import { Card, CardBody } from "../../../../../_metronic/_partials/controls";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../_metronic/_helpers/AssetsHelpers";
import { Link } from "react-router-dom";
import { getListSpt } from "../../_redux/InvoiceMonitoringCrud";
import useToast from "../../../../components/toast";
import { TablePagination } from "@material-ui/core";
import ButtonAction from "../../../../components/buttonAction/ButtonAction";
import { rupiah } from "../../../../libs/currency";
import { useHistory } from "react-router-dom";

const data_ops = [
  {
    label: "TITLE.OPEN_DATA",
    icon: "fas fa-search text-primary",
    type: "open",
  },
];

function DashboardListSpt(props) {
  const { intl } = props;
  const [filterTable, setFilterTable] = useState({});
  const [nameStateFilter, setNameStateFilter] = useState("");
  const [Toast, setToast] = useToast();
  const [paginations, setPaginations] = useState({
    numberColum: 0,
    page: 0,
    count: 15,
    rowsPerPage: 10,
  });
  const [filterData] = useState([
    {
      title: intl.formatMessage({
        id: "TITLE.SPT_NO",
      }),
      name: "no_spt",
      type: "text",
    },
    // {
    //   title: intl.formatMessage({
    //     id: "TITLE.CEK_NO",
    //   }),
    //   name: "no_cek",
    //   type: "text",
    // },
    {
      title: intl.formatMessage({
        id: "TITLE.TOTAL_PAYMENT",
      }),
      name: "total_payment",
      type: "text",
    },
    {
      title: intl.formatMessage({
        id: "TITLE.ACCOUNT_NUMBER",
      }),
      name: "account_number",
      type: "text",
    },
  ]);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [filterSort, setFilterSort] = useState({ filter: {}, sort: {} });
  const [sortData, setSortData] = useState({
    name: "no_spt",
    order: false,
  });
  const [err, setErr] = useState(false);
  const [dialogState, setDialogState] = useState(false);
  const history = useHistory();

  const requestFilterSort = useCallback(
    (updateFilterTable, updateSortTable) => {
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
          if (
            err.response?.status !== 400 &&
            err.response?.data.message !== "TokenExpiredError"
          )
            setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 10000);
        });
    },
    [filterTable, sortData, filterSort, intl, setToast, paginations]
  );

  useEffect(requestFilterSort, []);

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
    requestFilterSort();
  };

  const resetValueFilter = (property) => {
    let filterTables = filterTable;
    filterTables[property] = "";
    document.getElementById(property).value = "";
    setFilterTable({ ...filterTables });
    requestFilterSort();
  };

  const resetFilter = () => {
    setFilterTable({});
    document.getElementById("filter-form-all").reset();
    requestFilterSort({});
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
    requestFilterSort();
  };

  const handleChangeRowsPerPage = (event) => {
    let pagination = paginations;
    pagination.page = 0;
    pagination.rowsPerPage = parseInt(event.target.value, 10);
    pagination.numberColum = 0;
    setPaginations({
      ...pagination,
    });
    requestFilterSort();
  };

  const handleAction = (type, data) => {
    if (type === "open")
      history.push(`/client/invoice_monitoring/spt/${data.id}`);
  };

  return (
    <React.Fragment>
      <Toast />
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
              <div className="hecto-11">
                <table className="table-bordered overflow-auto">
                  <thead>
                    <tr>
                      <th className="bg-primary text-white align-middle td-5">
                        <FormattedMessage id="TITLE.TABLE_HEADER.NO" />
                      </th>
                      <th
                        className="bg-primary text-white align-middle td-25 pointer"
                        id="no_spt"
                        onClick={(e) => {
                          let sortDatas = sortData;
                          sortDatas.name = e.target.id;
                          sortDatas.order = sortDatas.order ? false : true;
                          setSortData({ ...sortDatas });
                          requestFilterSort();
                        }}
                      >
                        <span className="svg-icon svg-icon-sm svg-icon-white ml-1">
                          {sortData.name === "no_spt" && (
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
                        </span>
                        <FormattedMessage id="TITLE.SPT_NO" />
                      </th>
                      <th
                        className="bg-primary text-white pointer align-middle td-20"
                        id="no_cek"
                        onClick={(e) => {
                          let sortDatas = sortData;
                          sortDatas.name = e.target.id;
                          sortDatas.order = sortDatas.order ? false : true;
                          setSortData({ ...sortDatas });
                          // requestFilterSort();
                        }}
                      >
                        <span className="svg-icon svg-icon-sm svg-icon-white ml-1">
                          {sortData.name === "no_cek" && (
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
                        </span>
                        <FormattedMessage id="TITLE.CEK_NO" />
                      </th>
                      <th
                        className="bg-primary text-white pointer align-middle td-15"
                        id="total_payment"
                        onClick={(e) => {
                          let sortDatas = sortData;
                          sortDatas.name = e.target.id;
                          sortDatas.order = sortDatas.order ? false : true;
                          setSortData({ ...sortDatas });
                          requestFilterSort();
                        }}
                      >
                        <span className="svg-icon svg-icon-sm svg-icon-white ml-1">
                          {sortData.name === "total_payment" && (
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
                        </span>
                        <FormattedMessage id="TITLE.TOTAL_PAYMENT" />
                      </th>
                      <th
                        className="bg-primary text-white pointer align-middle td-20"
                        id="account_number"
                        onClick={(e) => {
                          let sortDatas = sortData;
                          sortDatas.name = e.target.id;
                          sortDatas.order = sortDatas.order ? false : true;
                          setSortData({ ...sortDatas });
                          requestFilterSort();
                        }}
                      >
                        <span className="svg-icon svg-icon-sm svg-icon-white ml-1">
                          {sortData.name === "account_number" && (
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
                        </span>
                        <FormattedMessage id="TITLE.ACCOUNT_NUMBER" />
                      </th>
                      <th className="bg-primary text-white align-middle td-15">
                        <FormattedMessage id="TITLE.DATE" />
                      </th>
                      <th className="bg-primary text-white align-middle td-5">
                        <FormattedMessage id="TITLE.TABLE_HEADER.ACTION" />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, index) => {
                      return (
                        <tr key={index.toString()}>
                          <td>{index + 1 + paginations.numberColum}</td>
                          <td>{item.spt_no}</td>
                          <td>-----</td>
                          <td>{rupiah(item.sub_total)}</td>
                          <td>{item.account_number}</td>
                          <td>
                            {window
                              .moment(new Date(item.createdAt))
                              .format("DD MMM YYYY")}
                          </td>
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

export default injectIntl(connect(null, null)(DashboardListSpt));
