import React, { useState, useEffect, useCallback } from "react";
import { connect, shallowEqual, useSelector } from "react-redux";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  makeStyles,
} from "@material-ui/core";
import { Card, CardBody } from "../../../../_metronic/_partials/controls";
import { Table, Pagination } from "react-bootstrap";
import { FormattedMessage, injectIntl } from "react-intl";
import { toAbsoluteUrl } from "../../../../_metronic/_helpers/AssetsHelpers";
import SVG from "react-inlinesvg";
import { SubWrap } from "./style";
import { getSla, updateSla } from "../service/MasterCrud";
import useToast from "../../../components/toast";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(2),
  },
}));

const ServiceLevelAgreement = (props) => {
  const { intl } = props;
  const classes = useStyles();
  const [filterTable, setFilterTable] = useState({});
  const [nameStateFilter, setNameStateFilter] = useState("");
  const [filterData] = useState([
    {
      title: intl.formatMessage({
        id: "TITLE.SERVICE_LEVEL_AGREEMENT",
      }),
      id: "TITLE.SERVICE_LEVEL_AGREEMENT",
      name: "sla",
      type: "text",
    },
    {
      title: intl.formatMessage({
        id: "TITLE.DURATION",
      }),
      id: "TITLE.DURATION",
      name: "duration",
      type: "number",
    },
  ]);
  const [sortData, setSortData] = useState({
    name: "sla",
    order: true,
  });
  const [dialogState, setDialogState] = useState(false);
  const [filterSort, setFilterSort] = useState({ filter: {}, sort: {} });
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [Toast, setToast] = useToast();
  const [err, setErr] = useState(false);
  const [dataEdit, setDataEdit] = useState({});
  const [onSubmit, setOnSubmit] = useState(false);
  const [statusSubmit, setStatusSubmit] = useState(false);
  const [errOnSubmit, setErrOnSubmit] = useState(false);
  const user_id = useSelector(
    (state) => state.auth.user.data.user_id,
    shallowEqual
  );

  useEffect(() => {
    requestFilterSort();
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

  const requestFilterSort = useCallback(
    (updateFilterTable, updateSortTable) => {
    setLoading(true);
    setData([]);
    let filterSorts = filterSort;
    filterSorts.filter = JSON.stringify(
      updateFilterTable ? updateFilterTable : filterTable
    );
    filterSorts.sort = JSON.stringify(
      updateSortTable ? updateSortTable : sortData
    );
    setFilterSort({ ...filterSorts });
    let params = new URLSearchParams(filterSorts).toString();
    getSla(params)
      .then((result) => {
        setLoading(false);
        setData(result.data.data);
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
    []
  );

  const sendUpdate = () => {
    setOnSubmit(true);
    setErrOnSubmit(false);
    var data = {
      id: dataEdit.id,
      request: {
        days: Number(dataEdit.days),
        user_id: user_id,
      },
    };
    updateSla(data.id, data.request)
      .then((result) => {
        setStatusSubmit(true);
        setTimeout(() => {
          setDialogState(false);
          setOnSubmit(false);
          setStatusSubmit(false);
          requestFilterSort();
        }, 2000);
      })
      .catch((err) => {
        if (
          err.response?.status !== 400 &&
          err.response?.data.message !== "TokenExpiredError"
        ) {
          setOnSubmit(false);
          setErrOnSubmit(true);
        }
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
        <DialogTitle id="alert-dialog-title">
          Edit <FormattedMessage id="TITLE.SERVICE_LEVEL_AGREEMENT" />
        </DialogTitle>
        <DialogContent>
          <div className="form-group row">
            <label htmlFor="static_1" className="col-sm-5 col-form-label">
              <FormattedMessage id="TITLE.SERVICE_LEVEL_AGREEMENT" />
            </label>
            <div className="col-sm-7">
              <input
                type="text"
                disabled
                className="form-control"
                id="static_1"
                value={dataEdit?.name || ""}
              />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="static_2" className="col-sm-5 col-form-label">
              <FormattedMessage id="TITLE.DURATION" />
            </label>
            <div className="col-sm-7">
              <input
                type="text"
                min="0"
                className="form-control"
                id="static_2"
                disabled={onSubmit}
                value={dataEdit?.days || 0}
                onChange={(e) => {
                  let dataEdit_ = Object.assign({}, dataEdit);
                  var s = e.target.value.replace(/\D/g, "");
                  while (s.charAt(0) === "0") {
                    s = s.substring(1);
                  }
                  dataEdit_.days = s;
                  setDataEdit({ ...dataEdit_ });
                }}
              />
            </div>
          </div>
          {errOnSubmit && !onSubmit && (
            <div>
              <p className="text-danger font-italic" style={{ fontSize: 11 }}>
                Error: <FormattedMessage id="REQ.UPDATE_FAILED" />
              </p>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <button
            id="kt_login_signin_submit"
            type="submit"
            disabled={onSubmit}
            className={`btn btn-primary font-weight-bold btn-sm`}
            onClick={() => {
              sendUpdate();
            }}
          >
            {!onSubmit && (
              <span>
                <FormattedMessage id="TITLE.SAVE" />
              </span>
            )}
            {onSubmit &&
              (statusSubmit && onSubmit ? (
                <div>
                  <span>
                    <FormattedMessage id="TITLE.UPDATE_DATA_SUCCESS" />
                  </span>
                  <span className="ml-2 fas fa-check"></span>
                </div>
              ) : (
                <div>
                  <span>
                    <FormattedMessage id="TITLE.WAITING" />
                  </span>
                  <span className="ml-2 mr-4 spinner spinner-white"></span>
                </div>
              ))}
          </button>
          <button
            onClick={() => {
              setDialogState(false);
            }}
            disabled={onSubmit}
            className="btn btn-sm btn-danger"
          >
            <FormattedMessage id="TITLE.CANCEL" />
          </button>
        </DialogActions>
      </Dialog>
      <div className="d-flex align-items-center flex-wrap mr-1">
        <SubWrap className="mr-2 iconWrap">
          <span className="svg-icon menu-icon">
            <SVG src={toAbsoluteUrl("/media/svg/icons/Home/Book-open.svg")} />
          </span>
        </SubWrap>
        <div className="d-flex align-items-baseline mr-5">
          <h2 className="text-dark font-weight-bold my-2 mr-5">
            Master <FormattedMessage id="TITLE.SERVICE_LEVEL_AGREEMENT" />
          </h2>
        </div>
      </div>
      <Card className={classes.paper}>
        <CardBody>
          {/* begin: Filter Table */}
          <div className="panel-filter-table mb-1">
            <span className="mr-2 mt-2 float-left">
              <FormattedMessage id="TITLE.FILTER.TABLE" />
            </span>
            <div className="d-block">
              <div className="float-left">
                <form id="filter-form-all" className="form">
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
                            <span style={{ color: "#777777" }}>semua</span>
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
                                  placeholder="semua"
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
                </form>
              </div>
            </div>
            <button
              type="button"
              className="btn btn-sm btn-danger ml-2 mt-2 button-filter-submit float-left"
              onClick={() => {
                resetFilter();
              }}
            >
              <FormattedMessage id="TITLE.FILTER.RESET.TABLE" />
            </button>
          </div>
          {/* end: Filter Table */}
          <div className="table-wrapper-scroll-y my-custom-scrollbar">
            <div className="segment-table">
              <div className="hecto-8">
                <Table className="table-bordered overflow-auto">
                  <thead>
                    <tr>
                      <th className="bg-primary text-white align-middle td-2">
                        <FormattedMessage id="TITLE.NO" />
                      </th>
                      <th
                        className="bg-primary text-white align-middle td-56 pointer"
                        id="sla"
                        onClick={(e) => {
                          let sortDatas = sortData;
                          sortDatas.name = e.target.id;
                          sortDatas.order = sortDatas.order ? false : true;
                          setSortData({ ...sortDatas });
                          requestFilterSort();
                        }}
                      >
                        {sortData.name === "sla" && (
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

                        <FormattedMessage id="TITLE.SERVICE_LEVEL_AGREEMENT" />
                      </th>
                      <th
                        className="bg-primary text-white align-middle td-27 pointer"
                        id="duration"
                        onClick={(e) => {
                          let sortDatas = sortData;
                          sortDatas.name = e.target.id;
                          sortDatas.order = sortDatas.order ? false : true;
                          setSortData({ ...sortDatas });
                          requestFilterSort();
                        }}
                      >
                        {sortData.name === "duration" && (
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
                        <FormattedMessage id="TITLE.DURATION" />
                      </th>
                      <th className="bg-primary text-white align-middle td-15">
                        <FormattedMessage id="MENU.ACTIONS" />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, index) => {
                      return (
                        <tr key={index.toString()}>
                          <td>{index + 1}</td>
                          <td>{item.name}</td>
                          <td>{item.days}</td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-sm btn-success"
                              onClick={() => {
                                setDataEdit(item);
                                setDialogState(true);
                              }}
                            >
                              <i className="fas fa-pen-alt"></i>
                              Edit
                            </button>
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
                  {loading && (
                    <span>
                      <i className="fas fa-spinner fa-pulse text-dark mr-1"></i>
                      <FormattedMessage id="TITLE.TABLE.WAITING_DATA" />
                    </span>
                  )}
                  {err && (
                    <span>
                      <i className="far fa-frown text-danger mr-1"></i>
                      <FormattedMessage id="TITLE.TABLE.NO_DATA_AVAILABLE" />
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
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
};

export default injectIntl(connect(null, null)(ServiceLevelAgreement));
