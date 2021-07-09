import React, { useState, useEffect, useCallback, useRef } from "react";
import { connect, shallowEqual, useSelector } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import { Card, CardBody } from "../../../../_metronic/_partials/controls";
import useToast from "../../../components/toast";
import { TablePagination } from "@material-ui/core";
import { Dialog, DialogActions, DialogContent, Slide } from "@material-ui/core";
import {
  getVendors,
  getContractByPic,
  assignPic,
} from "../_redux/UserManagementCrud";
import { withStyles } from "@material-ui/core/styles";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import StyledSelect from "../../../components/select-multiple";
import { getContractVendor } from "../../InvoiceMonitoring/_redux/InvoiceMonitoringCrud";

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, disabled } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root}>
      <h4>{children}</h4>
      {onClose ? (
        <IconButton
          aria-label="Close"
          className={classes.closeButton}
          onClick={onClose}
          disabled={disabled}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

function PicRoles(props) {
  const { intl } = props;
  const [Toast, setToast] = useToast();
  const picTableRef = useRef(null);
  const invoice_monitoring_type = "INVOICE";
  const delivery_monitoring_type = "DELIVERY";
  const [contractVendor, setContractVendor] = useState([]);
  const [filterTable, setFilterTable] = useState({});
  const [nameStateFilter, setNameStateFilter] = useState("");
  const [dialogState, setDialogState] = useState(false);
  const [paginations, setPaginations] = useState({
    numberColum: 0,
    page: 0,
    count: 0,
    rowsPerPage: 10,
  });
  const user_id = useSelector(
    (state) => state.auth.user.data.user_id,
    shallowEqual
  );
  const [filterData] = useState([
    {
      title: intl.formatMessage({
        id: "TITLE.USER_MANAGEMENT.PIC_ROLES.VENDOR_CODE",
      }),
      name: "vendor_code",
      type: "text",
    },
    {
      title: intl.formatMessage({
        id: "TITLE.USER_MANAGEMENT.PIC_ROLES.VENDOR_NAME",
      }),
      name: "vendor_name",
      type: "text",
    },
  ]);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [picData, setPicData] = useState([]);
  const [picId, setPicId] = useState("");
  const [picInvoiceData, setPicInvoiceData] = useState([]);
  const [picDeliveryData, setPicDeliveryData] = useState([]);
  const [dataUser, setDataUser] = useState({});
  const [filterSort, setFilterSort] = useState({ filter: {}, sort: {} });
  const [sortData, setSortData] = useState({
    name: "",
    order: false,
  });
  const [err, setErr] = useState(false);

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
      getVendors()
        .then((result) => {
          setLoading(false);
          setData(result.data.data);
          //   setPaginations({ ...paginations, count: result.data.count || 0 });
        })
        .catch((err) => {
          setErr(true);
          setLoading(false);
          setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 5000);
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

  const handleModal = (index) => {
    setDataUser(picData[index]);
    setDialogState(true);
    setPicId(picData[index].pic_id);
    getContractByPic(picData[index].pic_id).then((result) => {
      setPicInvoiceData(result.data.data.invoice_data);
      setPicDeliveryData(result.data.data.delivery_data);
    });
  };

  const handleClick = (e, index) => {
    e.preventDefault();
    const vendor_id = data[index].vendor_id;
    getContractVendor(vendor_id, "").then((result) => {
      const data = result.data.data.map(function(row) {
        return { value: row.contract_id, label: row.contract_no };
      });
      setContractVendor(data);
    });
    setPicData(data[index].pic_data);
    picTableRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleDelivery = (e) => {
    setPicDeliveryData(e);
  };

  const handleInvoice = (e) => {
    setPicInvoiceData(e);
  };

  const handleSubmit = () => {
    setLoading(true);
    var data = {
      invoice_data: picInvoiceData,
      delivery_data: picDeliveryData,
      created_by_id: user_id,
      pic_id: picId,
      invoice_monitoring_type: invoice_monitoring_type,
      delivery_monitoring_type: delivery_monitoring_type,
    };
    assignPic(data)
      .then((response) => {
        setLoading(false);
        setToast(intl.formatMessage({ id: "REQ.UPDATE_SUCCESS" }), 5000);
        setDialogState(false);
      })
      .catch((error) => {
        setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 5000);
        setLoading(false);
      });
  };

  return (
    <React.Fragment>
      <Toast />
      <Dialog
        open={dialogState}
        keepMounted
        maxWidth={"sm"}
        fullWidth={true}
        TransitionComponent={Transition}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <form noValidate autoComplete="off">
          <DialogTitle
            id="alert-dialog-slide-title"
            onClose={() => {
              setDialogState(false);
            }}
            disabled={loading}
          >
            <FormattedMessage id="TITLE.USER_MANAGEMENT.PIC_ROLES.MODAL.MODAL_TITLE" />
          </DialogTitle>
          <DialogContent>
            <div className="form-group row mb-3">
              <label htmlFor="static_1" className="col-sm-3 col-form-label">
                <FormattedMessage id="TITLE.USER_MANAGEMENT.PIC_ROLES.NAME" />
              </label>
              <div className="col-sm-9">
                <input
                  type="text"
                  disabled
                  className="form-control"
                  defaultValue={dataUser.full_name}
                />
              </div>
            </div>
            <div className="form-group row mb-3">
              <label htmlFor="static_1" className="col-sm-3 col-form-label">
                <FormattedMessage id="TITLE.USER_MANAGEMENT.PIC_ROLES.EMAIL" />
              </label>
              <div className="col-sm-9">
                <input
                  type="text"
                  disabled
                  className="form-control"
                  defaultValue={dataUser.email}
                />
              </div>
            </div>
            <div className="form-group row mb-3">
              <label htmlFor="static_1" className="col-sm-3 col-form-label">
                <FormattedMessage id="TITLE.USER_MANAGEMENT.PIC_ROLES.DELIVERY_CONTRACT" />
              </label>
              <div className="col-sm-9">
                <StyledSelect
                  options={contractVendor}
                  value={picDeliveryData}
                  isMulti
                  placeholder={intl.formatMessage({
                    id:
                      "TITLE.USER_MANAGEMENT.PIC_ROLES.MULTI_SELECT.PLACEHOLDER",
                  })}
                  onChange={handleDelivery}
                />
              </div>
            </div>
            <div className="form-group row mb-3">
              <label htmlFor="static_1" className="col-sm-3 col-form-label">
                <FormattedMessage id="TITLE.USER_MANAGEMENT.PIC_ROLES.INVOICE_CONTRACT" />
              </label>
              <div className="col-sm-9">
                <StyledSelect
                  options={contractVendor}
                  value={picInvoiceData}
                  isMulti
                  placeholder={intl.formatMessage({
                    id:
                      "TITLE.USER_MANAGEMENT.PIC_ROLES.MULTI_SELECT.PLACEHOLDER",
                  })}
                  onChange={handleInvoice}
                />
              </div>
            </div>
          </DialogContent>
          <DialogActions>
            <button
              className="btn btn-secondary"
              type="button"
              onClick={() => setDialogState(false)}
              disabled={loading}
            >
              <span>
                <FormattedMessage id="AUTH.GENERAL.BACK_BUTTON" />
              </span>
            </button>
            <button
              className="btn btn-primary"
              type="button"
              onClick={handleSubmit}
              disabled={loading}
            >
              <span>
                <FormattedMessage id="TITLE.UPDATE" />
              </span>
              {loading && (
                <span
                  className="spinner-border spinner-border-sm ml-1"
                  aria-hidden="true"
                ></span>
              )}
            </button>
          </DialogActions>
        </form>
      </Dialog>
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
                              <FormattedMessage id="TITLE.UPDATE" />
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
              <div className="hecto-10">
                <table className="table-bordered overflow-auto">
                  <thead>
                    <tr>
                      <th className="bg-primary text-white text-center align-middle td-5">
                        <FormattedMessage id="TITLE.NO" />
                      </th>
                      <th className="bg-primary text-white text-center align-middle td-15">
                        <FormattedMessage id="TITLE.USER_MANAGEMENT.PIC_ROLES.VENDOR_CODE" />
                      </th>
                      <th className="bg-primary text-white text-center align-middle td-30">
                        <FormattedMessage id="TITLE.USER_MANAGEMENT.PIC_ROLES.VENDOR_NAME" />
                      </th>
                      <th className="bg-primary text-white text-center align-middle td-15">
                        <FormattedMessage id="TITLE.USER_MANAGEMENT.PIC_ROLES.STATUS" />
                      </th>
                      <th className="bg-primary text-white text-center align-middle td-30">
                        <FormattedMessage id="TITLE.USER_MANAGEMENT.PIC_ROLES.PIC" />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, index) => {
                      return (
                        <tr key={index.toString()}>
                          <td>{index + 1}</td>
                          <td>{item.code}</td>
                          <td>
                            <a href="#" onClick={(e) => handleClick(e, index)}>
                              {item.full_name}
                            </a>
                          </td>
                          <td>{item.state}</td>
                          <td
                            style={{ maxWidth: "1px" }}
                            className="text-truncate"
                          >
                            {item.pic_vendor}
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
                              <FormattedMessage id="TITLE.UPDATE" />
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
              <div className="hecto-10">
                <table
                  className="table-bordered overflow-auto"
                  ref={picTableRef}
                >
                  <thead>
                    <tr>
                      <th className="bg-primary text-white text-center align-middle td-5">
                        <FormattedMessage id="TITLE.NO" />
                      </th>
                      <th className="bg-primary text-white text-center align-middle td-20">
                        <FormattedMessage id="TITLE.USER_MANAGEMENT.PIC_ROLES.EMAIL" />
                      </th>
                      <th className="bg-primary text-white text-center align-middle td-25">
                        <FormattedMessage id="TITLE.USER_MANAGEMENT.PIC_ROLES.NAME" />
                      </th>
                      <th className="bg-primary text-white text-center align-middle td-20">
                        <FormattedMessage id="TITLE.USER_MANAGEMENT.PIC_ROLES.VENDOR" />
                      </th>
                      <th className="bg-primary text-white text-center align-middle td-10">
                        <FormattedMessage id="TITLE.USER_MANAGEMENT.PIC_ROLES.ACTIVE" />
                      </th>
                      <th className="bg-primary text-white text-center align-middle td-5">
                        <FormattedMessage id="CONTRACT_DETAIL.TABLE_HEAD.ACTION" />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {picData.map((item, index) => {
                      return (
                        <tr key={index.toString()}>
                          <td>{index + 1}</td>
                          <td>{item.email}</td>
                          <td>{item.full_name}</td>
                          <td>{item.vendor_name}</td>
                          <td>
                            {!item.active && (
                              <span className="text-danger">
                                <FormattedMessage id="TITLE.USER_MANAGEMENT.PIC_ROLES.NONACTIVE" />
                              </span>
                            )}
                            {item.active && (
                              <span className="text-success">
                                <FormattedMessage id="TITLE.USER_MANAGEMENT.PIC_ROLES.ACTIVE" />
                              </span>
                            )}
                          </td>
                          <td className="text-center">
                            <button
                              className="btn"
                              onClick={() => handleModal(index)}
                            >
                              <i className="fas fa-edit text-primary pointer"></i>
                            </button>
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

export default injectIntl(connect(null, null)(PicRoles));
