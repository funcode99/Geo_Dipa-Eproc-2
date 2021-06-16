import { TableCell } from "@material-ui/core";
import { ExpandLessOutlined, ExpandMoreOutlined } from "@material-ui/icons";
import React from "react";
import { StyledTableRow } from "../style";

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
