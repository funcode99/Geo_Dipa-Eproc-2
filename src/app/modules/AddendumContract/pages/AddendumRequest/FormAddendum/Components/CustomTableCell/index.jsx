import React from "react";

import Input from "@material-ui/core/Input";
import { TableCell } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  // HANYA TERPAKAI YANG INI, SISA NYA ENGGAK!
  tableCell: {
    height: 40,
  },
}));

const CustomTableCell = ({ row, name, onChange, isDisabled = false }) => {
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
          disabled={isDisabled && row["item_detail"].length > 0}
        />
      ) : (
        row[name]
      )}
    </TableCell>
  );
};

export default CustomTableCell;
