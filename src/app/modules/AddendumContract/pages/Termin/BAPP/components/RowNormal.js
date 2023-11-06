import React from "react";
import { StyledTableRow } from "../../style";
import { TableCell } from "@material-ui/core";

const RowNormal = ({ data }) => {
  return (
    <StyledTableRow>
      {data.map((el, idx) => (
        <TableCell key={idx} className="text-dark text-left">
          {el}
        </TableCell>
      ))}
    </StyledTableRow>
  );
};

export default RowNormal;
