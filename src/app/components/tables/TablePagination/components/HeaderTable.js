import { makeStyles } from "@material-ui/core";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import { withStyles } from "@material-ui/styles";
import PropTypes from "prop-types";
import React from "react";

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

const useStyles = makeStyles({
  activeLabel: {
    color: "#ffffff",
  },
});

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

  const classes = useStyles();

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
                classes={{
                  active: classes.activeLabel,
                }}
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
