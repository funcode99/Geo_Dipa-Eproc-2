import React from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import { lighten, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import DeleteIcon from "@material-ui/icons/Delete";
import FilterListIcon from "@material-ui/icons/FilterList";

const headRows = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Judul 1",
    width: 200,
  },
  { id: "calories", numeric: true, disablePadding: false, label: "Judul 2" },
  { id: "fat", numeric: true, disablePadding: false, label: "Judul 3" },
  { id: "carbs", numeric: true, disablePadding: false, label: "Judul 4" },
  { id: "protein", numeric: true, disablePadding: false, label: "Judul 5" },
];

function HeaderTable(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
    rows,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow style={{ backgroundColor: "#eff7ff" }}>
        {/* <TableCell width={"200px"}>
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ "aria-label": "Select all desserts" }}
          />
        </TableCell> */}
        {rows.map((row) => (
          <TableCell
            key={row.id}
            align={"left"}
            className={"bg-primary text-white"}
            // align={row.numeric ? "right" : "left"}
            padding={"default"}
            sortDirection={orderBy === row.id ? order : false}
          >
            {row?.sortable === false ? (
              row.label
            ) : (
              <TableSortLabel
                active={orderBy === row.id}
                direction={order}
                onClick={createSortHandler(row.id)}
              >
                {row.label}
              </TableSortLabel>
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

HeaderTable.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

export default HeaderTable;
