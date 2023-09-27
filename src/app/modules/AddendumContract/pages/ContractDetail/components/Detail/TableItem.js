import React from "react";
import {
  StyledTable,
  StyledTableHead,
  StyledHead,
  StyledTableRow,
} from "../../../../../../components/tables/style";
import { TableBody, TableCell, CircularProgress } from "@material-ui/core";

const theadItems = [
  { id: "action", label: "" },
  { id: "keterangan", label: "Keterangan" },
  { id: "due-date", label: "Due Date" },
  { id: "qty", label: "Qty" },
  { id: "uom", label: "Uom" },
  { id: "unit-price", label: "Unit Price" },
  // { id: 'wbs', label: 'WBS' },
];

const TableItem = (props) => {
  const { children, data = [], loading = false } = props;

  return (
    <div className="responsive">
      <div className="table-wrapper-scroll-y my-custom-scrollbar">
        <div className="segment-table">
          <div className="hecto-5">
            <StyledTable>
              <StyledTableHead>
                <StyledHead>
                  {theadItems.map((item) => (
                    <TableCell
                      className="text-white align-middle"
                      key={item.id}
                    >
                      {item.label}
                    </TableCell>
                  ))}
                </StyledHead>
              </StyledTableHead>
              <TableBody>
                {data?.length < 1 && !loading ? (
                  <StyledTableRow>
                    <TableCell
                      colSpan={theadItems.length}
                      className="text-center"
                    >
                      Empty Data
                    </TableCell>
                  </StyledTableRow>
                ) : null}
                {loading ? (
                  <StyledTableRow>
                    <TableCell
                      colSpan={theadItems.length}
                      className="text-center"
                    >
                      <CircularProgress />
                    </TableCell>
                  </StyledTableRow>
                ) : null}
                {children}
              </TableBody>
            </StyledTable>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableItem;
