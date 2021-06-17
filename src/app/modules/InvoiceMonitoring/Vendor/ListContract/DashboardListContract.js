import React, { useState, useEffect, useCallback } from "react";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import {
  Card,
  CardBody,
  CardHeader,
} from "../../../../../_metronic/_partials/controls";
import { Table } from "react-bootstrap";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../_metronic/_helpers/AssetsHelpers";
import { Link } from "react-router-dom";
import { getContractClient } from "../../_redux/InvoiceMonitoringCrud";
import useToast from "../../../../components/toast";
import {
  TablePagination,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
  IconButton,
} from "@material-ui/core";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import { withStyles } from "@material-ui/core/styles";
import { Document, Page, pdfjs } from "react-pdf";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-perfect-scrollbar/dist/css/styles.css";

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(3),
    top: theme.spacing(0),
    backgroundColor: "#187de4",
    "&:hover": {
      background: "#f00",
    },
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <i className="fas fa-times text-light"></i>
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

function DashboardListContract(props) {
  const { intl } = props;
  // const vendor_id = useSelector(
  //   (state) => state.auth.user.data.vendor_id,
  //   shallowEqual
  // );
  const [filterTable, setFilterTable] = useState({});
  const [contractData, setContractData] = useState([]);
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
        id: "TITLE.CONTRACT_NO",
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
      name: "no_po",
      type: "text",
    },
    {
      title: intl.formatMessage({
        id: "TITLE.TERMIN",
      }),
      name: "termin",
      type: "text",
    },
    {
      title: intl.formatMessage({
        id: "TITLE.SA_NUMBER",
      }),
      name: "no_sa",
      type: "text",
    },
    {
      title: intl.formatMessage({
        id: "TITLE.INVOICE_NO",
      }),
      name: "no_invoice",
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

  useEffect(() => {
    getListContractData();
  }, []);

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
      // getSla(params)
      //   .then((result) => {
      //     setLoading(false);
      //     setData(result.data.data);
      //     setPaginations({ ...paginations, count: result.data.count || 0 });
      //   })
      //   .catch((err) => {
      //     setErr(true);
      //     setLoading(false);
      //     if (
      //       err.response?.status !== 400 &&
      //       err.response?.data.message !== "TokenExpiredError"
      //     )
      //       setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 10000);
      //   });
    },
    [filterTable, sortData, filterSort, intl, setToast, paginations]
  );

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

  const handleChangePage = (event, newPage) => {
    console.log("newPage", newPage);
    let pagination = paginations;
    pagination.numberColum =
      newPage > pagination.page
        ? pagination.numberColum + pagination.rowsPerPage
        : pagination.numberColum - pagination.rowsPerPage;
    pagination.page = newPage;
    setPaginations({
      ...pagination,
    });
  };
  const handleChangeRowsPerPage = (event) => {
    let pagination = paginations;
    pagination.page = 0;
    pagination.rowsPerPage = parseInt(event.target.value, 10);
    pagination.numberColum = 0;
    setPaginations({
      ...pagination,
    });
  };

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    console.log("numPages", numPages);
    setNumPages(numPages);
  }

  return (
    <React.Fragment>
      <Toast />
      <Dialog
        open={dialogState}
        // keepMounted
        maxWidth={false}
        fullWidth={true}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          style: {
            backgroundColor: "transparent",
            boxShadow: "none",
          },
        }}
      >
        <DialogTitle
          id="alert-dialog-description"
          onClose={() => {
            setDialogState(false);
          }}
        >
          Modal title
        </DialogTitle>
        <PerfectScrollbar>
          <DialogContent>
            <div className="react-component">
              <Document file="" onLoadSuccess={onDocumentLoadSuccess}>
                <Page pageNumber={pageNumber} renderMode="svg" />
                <div className="page-controls">
                  <button type="button" disabled="">
                    ‹
                  </button>
                  <span>1 of 4</span>
                  <button
                    type="button"
                    onClick={() => {
                      setPageNumber(2);
                    }}
                  >
                    ›
                  </button>
                </div>
              </Document>
            </div>
          </DialogContent>
        </PerfectScrollbar>
      </Dialog>
      <Card>
        <CardHeader>
          <button
            onClick={() => {
              setDialogState(true);
            }}
          >
            Open
          </button>
        </CardHeader>
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
                      <th
                        className="bg-primary text-white align-middle td-23 pointer"
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
                        className="bg-primary text-white pointer align-middle td-20"
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
                        className="bg-primary text-white pointer align-middle td-12"
                        id="no_po"
                        onClick={(e) => {
                          let sortDatas = sortData;
                          sortDatas.name = e.target.id;
                          sortDatas.order = sortDatas.order ? false : true;
                          setSortData({ ...sortDatas });
                          // requestFilterSort();
                        }}
                      >
                        {sortData.name === "no_po" && (
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
                      <th
                        className="bg-primary text-white pointer align-middle td-10"
                        id="termin"
                        onClick={(e) => {
                          let sortDatas = sortData;
                          sortDatas.name = e.target.id;
                          sortDatas.order = sortDatas.order ? false : true;
                          setSortData({ ...sortDatas });
                          // requestFilterSort();
                        }}
                      >
                        {sortData.name === "termin" && (
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
                        Termin
                      </th>
                      <th
                        className="bg-primary text-white pointer align-middle td-15"
                        id="no_sa"
                        onClick={(e) => {
                          let sortDatas = sortData;
                          sortDatas.name = e.target.id;
                          sortDatas.order = sortDatas.order ? false : true;
                          setSortData({ ...sortDatas });
                          // requestFilterSort();
                        }}
                      >
                        {sortData.name === "no_sa" && (
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
                        Nomor SA
                      </th>
                      <th
                        className="bg-primary text-white pointer align-middle td-17"
                        id="no_invoice"
                        onClick={(e) => {
                          let sortDatas = sortData;
                          sortDatas.name = e.target.id;
                          sortDatas.order = sortDatas.order ? false : true;
                          setSortData({ ...sortDatas });
                          // requestFilterSort();
                        }}
                      >
                        {sortData.name === "no_invoice" && (
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
                        Nomor Invoice
                      </th>
                      <th className="bg-primary text-white align-middle td-3">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {contractData.map((item, index) => {
                      return (
                        <tr key={index.toString()}>
                          <td>
                            <Link
                              to={`/vendor/invoice_monitoring/1/` + item.id}
                            >
                              {item.contract_no}
                            </Link>
                          </td>
                          <td>
                            <Link
                              to={`/vendor/invoice_monitoring/1/` + item.id}
                            >
                              {item.contract_name}
                            </Link>
                          </td>
                          <td>
                            <Link
                              to={`/vendor/invoice_monitoring/1/` + item.id}
                            >
                              {item.purch_order_no}
                            </Link>
                          </td>
                          <td>
                            <Link
                              to={`/vendor/invoice_monitoring/1/` + item.id}
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
                              to={`/vendor/invoice_monitoring/1/` + item.id}
                            >
                              80000035434
                            </Link>
                          </td>
                          <td>
                            <Link
                              to={`/vendor/invoice_monitoring/1/` + item.id}
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
                </table>
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
