import React from "react";
import { TableRow, TableCell } from "@material-ui/core";

const RowAdditional = ({ label, value }) => {
  return (
    <TableRow>
      <TableCell colSpan={4}></TableCell>
      <TableCell className="text-dark">{label}</TableCell>
      <TableCell className="text-dark text-left">{value}</TableCell>
    </TableRow>
  );
};

export default RowAdditional;
