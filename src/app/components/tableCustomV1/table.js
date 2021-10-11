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
import NumberFormat from "react-number-format";
import "./styles.scss";

const format = (countryCode, currency, number) => {
  const options = {
    currency,
    style: "currency",
    currencyDisplay: "symbol",
  };

  return new Intl.NumberFormat(countryCode, options).format(number);
};

export const rupiah = (number) => format("id-ID", "IDR", number);

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
        (value) => value.order.status === true && value.order.active === true
      ).length > 0
        ? dataHeader
            .filter(
              (value) =>
                value.order.status === true && value.order.active === true
            )[0]
            .name.replace(/\s/g, "")
        : "",
    order:
      dataHeader.filter(
        (value) => value.order.status === true && value.order.active === true
      ).length > 0
        ? dataHeader.filter(
            (value) =>
              value.order.status === true && value.order.active === true
          )[0].order.status
        : true,
    type:
      dataHeader.filter(
        (value) =>
          value.order.status === true &&
          value.order.active === true &&
          value.order.type !== null
      ).length > 0
        ? dataHeader.filter(
            (value) =>
              value.order.status === true &&
              value.order.active === true &&
              value.order.type !== null
          )[0].order.type
        : null,
  });
  const [filterTable, setFilterTable] = React.useState({});
  const [filterSort, setFilterSort] = React.useState({ filter: {}, sort: {} });
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedCollection, setSelectedCollection] = React.useState({});
  const [selectedCollectionFix, setSelectedCollectionFix] = React.useState({});

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

  const updateValueFilter = (property, type, collection) => {
    let filterTables = filterTable;
    if (type === "collection") {
      filterTables = Object.assign({}, filterTables, collection);
      setFilterTable({ ...filterTables });
      requestFilterSort(filterTables);
    } else {
      filterTables["filter-" + property] = document.getElementById(
        "filter-" + property
      ).value;
      if (type === "currency") {
        filterTables["filter-" + property] = filterTables["filter-" + property]
          .replace(/[Rp .]/g, "")
          .replace(/[,]/g, ".");
      }
      setFilterTable({ ...filterTables });
      requestFilterSort();
    }
  };

  const resetValueFilter = (property, type) => {
    let filterTables = filterTable;
    if (type === "collection") {
      filterTables[property] = [];
    } else {
      filterTables[property] = "";
      document.getElementById(property).value = "";
    }
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

  const handleClick = (id, type) => {
    if (type === "collection") {
      setSelectedCollection(selectedCollectionFix);
    }
    setAnchorEl(id);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCollection = (e, item, item_) => {
    var data = Object.assign([], selectedCollection);
    if (data["collection-" + item.name]) {
      if (e.target.checked) {
        data["collection-" + item.name].push(item_);
      } else {
        var idx_ = data["collection-" + item.name].findIndex(
          (value) => value.label === item_.label
        );
        data["collection-" + item.name].splice(idx_, 1);
      }
      setSelectedCollection(data);
    } else {
      data["collection-" + item.name] = [item_];
      setSelectedCollection(data);
    }
  };
  return (
    <React.Fragment>
      <div>
        <form id="filter-form-all" className="panel-filter-table mb-1">
          <span className="mr-2 mt-1 float-left">
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
                          handleClick(index, item.filter.type);
                        }}
                      >
                        <span>{item.title}:</span>
                        <strong style={{ paddingRight: 1, paddingLeft: 1 }}>
                          <span
                            className="filter-label"
                            id={"filter-span-" + index}
                          >
                            {item.filter.type === "currency" &&
                            filterTable[
                              "filter-" + item.name.replace(/\s/g, "")
                            ]
                              ? rupiah(
                                  Number(
                                    filterTable[
                                      "filter-" + item.name.replace(/\s/g, "")
                                    ]
                                  )
                                )
                              : item.filter.type === "collection" &&
                                filterTable[
                                  "collection-" + item.name.replace(/\s/g, "")
                                ]
                              ? filterTable[
                                  "collection-" + item.name.replace(/\s/g, "")
                                ]
                                  .map(function(elem) {
                                    return elem.label;
                                  })
                                  .join(",")
                              : filterTable[
                                  "filter-" + item.name.replace(/\s/g, "")
                                ]}
                          </span>
                        </strong>
                        {filterTable[
                          "filter-" + item.name.replace(/\s/g, "")
                        ] ||
                        filterTable[
                          "collection-" + item.name.replace(/\s/g, "")
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
                        keepMounted={false}
                        open={
                          `sub-filter-${index}` === `sub-filter-${anchorEl}`
                        }
                        onClose={handleClose}
                        PaperProps={{
                          style: {
                            transform: `translateX(0px) translateY(${
                              item.filter.type === "collection" ? "23" : "40"
                            }px)`,
                          },
                        }}
                      >
                        <div className="px-2">
                          <div className="float-left">
                            {item.filter.type === "currency" ? (
                              <NumberFormat
                                value={
                                  filterTable[
                                    "filter-" + item.name.replace(/\s/g, "")
                                  ] || ""
                                }
                                displayType="input"
                                className="form-control form-control-sm"
                                name={"filter-" + item.name.replace(/\s/g, "")}
                                id={"filter-" + item.name.replace(/\s/g, "")}
                                thousandSeparator={"."}
                                decimalSeparator={","}
                                allowEmptyFormatting={true}
                                allowLeadingZeros={true}
                                prefix={"Rp "}
                                onValueChange={(e) => {}}
                              />
                            ) : item.filter.type === "collection" ? (
                              <div className="mb-3">
                                <div className="mb-2">
                                  <span>Includes: </span>
                                </div>
                                {item.filter &&
                                  item.filter.data &&
                                  item.filter.data.length > 0 &&
                                  item.filter.data.map((item_, idx) => {
                                    return (
                                      <div
                                        id={`${item.name}-${item.filter.type}-${idx}`}
                                        key={idx.toString()}
                                      >
                                        <input
                                          type="checkbox"
                                          className="mx-2"
                                          style={{ width: 16, height: 16 }}
                                          checked={
                                            selectedCollection[
                                              "collection-" + item.name
                                            ]
                                              ? selectedCollection[
                                                  "collection-" + item.name
                                                ].findIndex(
                                                  (value) =>
                                                    value.label === item_.label
                                                ) !== -1
                                              : false
                                          }
                                          onChange={(e) => {
                                            handleCollection(e, item, item_);
                                          }}
                                        />
                                        <span className="align-top">
                                          {item_.label}
                                        </span>
                                      </div>
                                    );
                                  })}
                                {item.filter &&
                                item.filter.data &&
                                item.filter.data.length > 0 ? (
                                  <div className="d-flex mt-2">
                                    <button
                                      type="button"
                                      className="mx-1 float-left btn btn-sm btn-primary"
                                      onClick={() => {
                                        setSelectedCollectionFix(
                                          selectedCollection
                                        );
                                        updateValueFilter(
                                          item.name.replace(/\s/g, ""),
                                          item.filter.type,
                                          selectedCollection
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
                                        setSelectedCollection({});
                                        setSelectedCollectionFix({});
                                        resetValueFilter(
                                          "collection-" +
                                            item.name.replace(/\s/g, ""),
                                          item.filter.type
                                        );
                                        handleClose();
                                      }}
                                    >
                                      <i className="fas fa-redo fa-right py-1 mx-1"></i>
                                      <span>
                                        <FormattedMessage id="TITLE.FILTER.RESET.TABLE" />
                                      </span>
                                    </button>
                                  </div>
                                ) : (
                                  <div>
                                    <h6>Insert Data</h6>
                                  </div>
                                )}
                              </div>
                            ) : (
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
                            )}
                          </div>
                          {item.filter.type !== "collection" && (
                            <div className="d-flex">
                              <button
                                type="button"
                                className="mx-1 float-left btn btn-sm btn-primary"
                                onClick={() => {
                                  updateValueFilter(
                                    item.name.replace(/\s/g, ""),
                                    item.filter.type
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
                                <i className="fas fa-redo fa-right py-1 mx-1"></i>
                                <span>
                                  <FormattedMessage id="TITLE.FILTER.RESET.TABLE" />
                                </span>
                              </button>
                            </div>
                          )}
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
                              sortData.name === item.name.replace(/\s/g, "")
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
