import React from "react";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  TableSortLabel,
  Paper,
  Menu,
} from "@material-ui/core";
import "./styles.scss";

const Tables = (props) => {
  const {
    intl,
    dataHeader = [],
    handleParams,
    loading = false,
    err = false,
    children,
    countData = 0,
    hecto = 1,
  } = props;
  const [paginations, setPaginations] = React.useState({
    numberColum: 0,
    page: 0,
    count: countData,
    rowsPerPage: 10,
  });
  const [sortData, setSortData] = React.useState({
    name:
      dataHeader.filter(
        (value) => value.order.status == true && value.order.active == true
      ).length > 0
        ? dataHeader
            .filter(
              (value) =>
                value.order.status == true && value.order.active == true
            )[0]
            .name.replace(/\s/g, "")
        : "",
    order:
      dataHeader.filter(
        (value) => value.order.status == true && value.order.active == true
      ).length > 0
        ? dataHeader.filter(
            (value) => value.order.status == true && value.order.active == true
          )[0].order.status
        : true,
    type:
      dataHeader.filter(
        (value) =>
          value.order.status == true &&
          value.order.active == true &&
          value.order.type !== null
      ).length > 0
        ? dataHeader.filter(
            (value) =>
              value.order.status == true &&
              value.order.active == true &&
              value.order.type !== null
          )[0].order.type
        : null,
  });
  const [nameStateFilter, setNameStateFilter] = React.useState("");
  const [filterTable, setFilterTable] = React.useState({});
  const [filterSort, setFilterSort] = React.useState({ filter: {}, sort: {} });
  const [anchorEl, setAnchorEl] = React.useState(null);

  const requestFilterSort = React.useCallback(
    (updateFilterTable, updateSortTable) => {
      let pagination = Object.assign({}, paginations);
      let filterSorts = filterSort;
      filterSorts.filter = JSON.stringify(
        updateFilterTable ? updateFilterTable : filterTable
      );
      let sort = {
        name: sortData.name,
        order: sortData.type !== null ? sortData.type : sortData.order,
      };
      filterSorts.sort = JSON.stringify(
        updateSortTable ? updateSortTable : sort
      );
      pagination.page = pagination.page + 1;
      filterSorts = Object.assign({}, filterSorts, pagination);
      setFilterSort({ ...filterSorts });
      let params = new URLSearchParams(filterSorts).toString();
      handleParams(params);
    },
    [filterTable, sortData, filterSort, intl, paginations]
  );

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

  const createSortHandler = (item) => {
    let sortDatas = sortData;
    if (item.name.replace(/\s/g, "") === sortDatas.name) {
      sortDatas.type !== null
        ? (sortDatas.type = !sortDatas.type)
        : (sortDatas.order = !sortDatas.order);
    } else {
      sortDatas.name = item.name.replace(/\s/g, "");
      sortDatas.order = true;
      sortDatas.type = null;
    }
    setSortData({
      ...sortDatas,
    });
    requestFilterSort();
  };

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

  React.useEffect(requestFilterSort, []);
  React.useEffect(() => {
    setPaginations({ ...paginations, count: countData || 0 });
  }, [countData]);

  const handleClick = (id) => {
    setAnchorEl(id);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <React.Fragment>
      <div>
        <form id="filter-form-all" className="panel-filter-table mb-1">
          <span className="mr-2 mt-2 float-left">
            <FormattedMessage id="TITLE.FILTER.TABLE" />
          </span>
          <div className="d-block">
            <div className="">
              {dataHeader
                .filter((value) => value.filter.active === true)
                .map((item, index) => {
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
                        id={"sub-filter-" + index}
                        onClick={() => {
                          handleClick(index);
                        }}
                      >
                        <span>{item.title}:</span>
                        <strong style={{ paddingRight: 1, paddingLeft: 1 }}>
                          <span
                            className="filter-label"
                            id={"filter-span-" + index}
                          >
                            {
                              filterTable[
                                "filter-" + item.name.replace(/\s/g, "")
                              ]
                            }
                          </span>
                        </strong>
                        {filterTable[
                          "filter-" + item.name.replace(/\s/g, "")
                        ] ? null : (
                          <span style={{ color: "#777777" }}>
                            <FormattedMessage id="TITLE.ALL" />
                          </span>
                        )}
                      </div>
                      <Menu
                        anchorEl={
                          document.getElementById(`sub-filter-${anchorEl}`)
                            ? document.getElementById(`sub-filter-${anchorEl}`)
                            : null
                        }
                        keepMounted
                        open={
                          `sub-filter-${index}` === `sub-filter-${anchorEl}`
                        }
                        onClose={handleClose}
                        id="sub-filter"
                      >
                        <div className="px-2">
                            <div className="float-left">
                              <input
                                type={item.filter.type}
                                className="form-control form-control-sm"
                                min="0"
                                name={"filter-" + item.name.replace(/\s/g, "")}
                                id={"filter-" + item.name.replace(/\s/g, "")}
                                defaultValue={
                                  filterTable[
                                    "filter-" + item.name.replace(/\s/g, "")
                                  ] || ""
                                }
                                placeholder={intl.formatMessage({
                                  id: "TITLE.ALL",
                                })}
                                style={{ width: 200 }}
                              />
                            </div>
                            <div className="d-flex">
                            <button
                              type="button"
                                className="mx-1 float-left btn btn-sm btn-primary"
                              onClick={() => {
                                updateValueFilter(
                                  item.name.replace(/\s/g, ""),
                                  index
                                );
                                handleClose();
                              }}
                            >
                              <FormattedMessage id="TITLE.UPDATE" />
                            </button>
                            <button
                              type="button"
                                className="mx-1 float-right btn btn-sm btn-light d-flex"
                              onClick={() => {
                                resetValueFilter(
                                  "filter-" + item.name.replace(/\s/g, "")
                                );
                                handleClose();
                              }}
                            >
                              <i className="fas fa-redo fa-right"></i>
                              <span>
                                <FormattedMessage id="TITLE.FILTER.RESET.TABLE" />
                              </span>
                            </button>
                          </div>
                          </div>
                      </Menu>
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
        <div>
          <TableContainer component={Paper}>
            <Table className={"hecto-" + hecto}>
              <TableHead>
                <TableRow>
                  {dataHeader.map((item, index) => {
                    return (
                      <TableCell
                        className={`bg-primary ${item?.td ? item?.td : ""}`}
                        key={index.toString()}
                      >
                        {item.order.active ? (
                          <TableSortLabel
                            active={
                              sortData.name == item.name.replace(/\s/g, "")
                            }
                            direction={
                              sortData.type !== null
                                ? sortData.type
                                  ? "asc"
                                  : "desc"
                                : sortData.order
                                ? "asc"
                                : "desc"
                            }
                            onClick={() => {
                              createSortHandler(item);
                            }}
                          >
                            <span>{item.title}</span>
                          </TableSortLabel>
                        ) : (
                          <span>{item.title}</span>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableHead>
              <TableBody>{children}</TableBody>
            </Table>

            <div className="table-loading-data">
              <div className="text-center font-weight-bold py-5">
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
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50, 75, 100, 250, 500, 1000]}
            component="div"
            count={paginations.count}
            rowsPerPage={paginations.rowsPerPage}
            page={paginations.page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </div>
      </div>
    </React.Fragment>
  );
};

export default injectIntl(connect(null, null)(Tables));
