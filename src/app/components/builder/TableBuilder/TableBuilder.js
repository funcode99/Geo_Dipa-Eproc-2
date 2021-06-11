import { TableBody } from "@material-ui/core";
import React from "react";
import {
  StyledHead,
  StyledTable,
  StyledTableHead,
  TableCellStyled,
} from "./styledComponent";

const TableBuilder = ({
  hecto,
  dataHead,
  dataBody,
  renderRowBody,
  footerComponent,
}) => {
  return (
    <div
      className="table-wrapper-scroll-y my-custom-scrollbar"
      style={{ height: "30vh", marginBottom: 21 }}
    >
      <div className="segment-table">
        <div className={`hecto-${hecto}`}>
          <StyledTable>
            <StyledTableHead>
              <StyledHead>
                {dataHead.map((el, id) => (
                  <TableCellStyled key={id} className="text-white align-middle">
                    {el}
                  </TableCellStyled>
                ))}
              </StyledHead>
            </StyledTableHead>
            <TableBody>
              {dataBody?.map(
                (item, index) =>
                  typeof renderRowBody === "function" &&
                  renderRowBody({ item, index })
              )}
              {footerComponent}
            </TableBody>
          </StyledTable>
        </div>
      </div>
    </div>
  );
};

TableBuilder.defaultProps = {
  hecto: 10,
  dataHead: ["No", "Nama"],
};

export default TableBuilder;
