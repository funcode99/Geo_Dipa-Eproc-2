import { CircularProgress } from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import React from "react";
import HeaderTable from "./components/HeaderTable";
import PaginationTable from "./components/PaginationTable";
import Skeleton from "@material-ui/lab/Skeleton";
import SearchBox from "./components/SearchBox";
import "./styles.scss";

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function getSorting(order, orderBy) {
  return order === "desc"
    ? (a, b) => desc(a, b, orderBy)
    : (a, b) => -desc(a, b, orderBy);
}

function searchFind(rows, query) {
  const columns = rows[0] && Object.keys(rows[0]);
  // (row) => row.procurement_title.toLowerCase().indexOf(query) > -1
  return rows.filter((row) =>
    columns.some((column) => {
      if (row[column] !== null)
        return (
          row[column]
            .toString()
            .toLowerCase()
            .indexOf(query) > -1
        );
    })
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    // width: "100%",
    // marginTop: theme.spacing(3),
  },
  paper: {
    // width: "100%",
    marginBottom: theme.spacing(2),
    overflowX: "auto",
  },
  table: {
    minWidth: 750,
  },
  tableBox: {
    // width: "100%",
  },
  tableWrapper: {
    overflowX: "auto",
  },
}));

TablePaginationCustom.defaultProps = {
  rows: [],
};

export default function TablePaginationCustom({
  headerRows,
  rows,
  loading,
  width,
}) {
  const classes = useStyles();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [query, setQuery] = React.useState("");

  function handleRequestSort(event, property) {
    const isDesc = orderBy === property && order === "desc";
    setOrder(isDesc ? "asc" : "desc");
    setOrderBy(property);
  }

  function handleSelectAllClick(event) {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  }

  function handleClick(event, name) {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  }

  function handleChangePage(event, newPage) {
    setPage(newPage);
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(+event.target.value);
  }

  function handleChangeQuery(event) {
    setQuery(event.target.value);
  }

  const isSelected = (name) => selected.indexOf(name) !== -1;

  console.log(
    `rows`,
    searchFind(stableSort(rows, getSorting(order, orderBy)), query)
  );

  const emptyRows = 0;
  return (
    <div className={classes.root}>
      <SearchBox onChange={handleChangeQuery} />
      <Paper className={classes.paper}>
        <div className={classes.tableBox}>
          <TableContainer className={classes.table}>
            <Table
              // className={"table-bordered"}
              aria-labelledby="tableTitle"
              style={{ width: width ? width : undefined }}
            >
              {/* <colgroup>
              <col width="150px" />
              <col width="150px" />
              <col width="150px" />
              <col width="150px" />
              <col width="150px" />
              <col width="100px" />
              <col width="100px" />
              <col width="100px" />
              <col width="100px" />
            </colgroup> */}
              <HeaderTable
                rows={headerRows}
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
              />
              <TableBody style={{ maxHeight: 500 }}>
                {/* stableSort(rows, getSorting(order, orderBy)) */}
                {searchFind(stableSort(rows, getSorting(order, orderBy)), query)
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.name);
                    const labelId = `enhanced-table-checkbox-${index}`;
                    return (
                      <TableRow
                        hover
                        // onClick={(event) => handleClick(event, row.name)}
                        // role="checkbox"
                        // role=""
                        // aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={index}
                        // selected={isItemSelected}
                      >
                        {headerRows.length &&
                          Object.keys(row).map((el, id) => {
                            return (
                              <TableCell key={id}>
                                {row[headerRows?.[id]?.id]}
                              </TableCell>
                            );
                          })}
                      </TableRow>
                    );
                  })}
                {loading
                  ? [1, 2, 3].map((el) => (
                      <TableRow style={{ height: 49 }} key={el}>
                        <TableCell colSpan={headerRows.length}>
                          <Skeleton
                            variant="rect"
                            height={10}
                            width={width || 750}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  : rows.length === 0 && (
                      <TableRow style={{ height: 49 }}>
                        <TableCell colSpan={headerRows.length} align={"center"}>
                          No Data ...
                        </TableCell>
                      </TableRow>
                    )}
              </TableBody>
            </Table>
          </TableContainer>
          <PaginationTable
            rows={rows}
            rowsPerPage={rowsPerPage}
            page={page}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </div>
      </Paper>
    </div>
  );
}
