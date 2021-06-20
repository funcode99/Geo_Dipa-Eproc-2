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

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, proteins: protein };
}

// const rows = [
//   createData("Cupcake", 305, 3.7, 67, 4.3),
//   createData("Donut", 452, 25.0, 51, 4.9),
//   createData("Eclair", 262, 16.0, 24, 6.0),
//   createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
//   createData("Gingerbread", 356, 16.0, 49, 3.9),
//   createData("Honeycomb", 408, 3.2, 87, 6.5),
//   createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
//   createData("Jelly Bean", 375, 0.0, 94, 0.0),
//   createData("KitKat", 518, 26.0, 65, 7.0),
//   createData("Lollipop", 392, 0.2, 98, 0.0),
//   createData("Marshmallow", 318, 0, 81, 2.0),
//   createData("Nougat", 360, 19.0, 9, 37.0),
//   createData("Oreo", 437, 18.0, 63, 4.0),
// ];

const headRows = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Judul 1",
  },
  { id: "calories", numeric: true, disablePadding: false, label: "Judul 2" },
  { id: "fat", numeric: true, disablePadding: false, label: "Judul 3" },
  { id: "carbs", numeric: true, disablePadding: false, label: "Judul 4" },
  { id: "protein", numeric: true, disablePadding: false, label: "Judul 5" },
];

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

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const emptyRows = 0;
  return (
    <div className={classes.root}>
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
                {stableSort(rows, getSorting(order, orderBy))
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
