import React from "react";

import Input from "@material-ui/core/Input";
import { TableCell } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  // root: {
  //   width: "100%",
  //   marginTop: theme.spacing(3),
  //   overflowX: "auto",
  // },
  // table: {
  //   minWidth: 650,
  //   // backgroundColor: "red",
  // },
  // selectTableCell: {
  //   width: 60,
  // },
  // HANYA TERPAKAI YANG INI, SISA NYA ENGGAK!
  tableCell: {
    width: 130,
    height: 40,
  },
  // input: {
  //   width: 130,
  //   height: 40,
  // },
  // content: {
  //   display: "table-row",
  //   width: "100%",
  // },
}));

const CustomTableCell = ({ row, name, onChange }) => {
  const classes = useStyles();
  const { isEditMode } = row;

  return (
    <TableCell align="left" className={classes.tableCell}>
      {isEditMode ? (
        <Input
          value={row[name]}
          name={name}
          onChange={(e) => onChange(e, row)}
          className={classes.input}
        />
      ) : (
        row[name]
      )}
    </TableCell>
  );
};

export default CustomTableCell;
