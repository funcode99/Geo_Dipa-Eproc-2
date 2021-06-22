import { Checkbox, TableCell } from "@material-ui/core";
import React from "react";
import { StyledTableRow } from "../../../../../../components/tables/style";
import TablePaginationCustom from "../../../../../../components/tables/TablePagination";
import RowAccordion from "./RowAccordion";
import { Form, Container } from "react-bootstrap";
import { rupiah } from "../../../../../../libs/currency";

const theadItems = [
  { id: "action", label: "" },
  { id: "keterangan", label: "Keterangan" },
  { id: "due-date", label: "Due Date" },
  { id: "qty", label: "Qty" },
  { id: "uom", label: "Uom" },
  { id: "unit-price", label: "Unit Price" },
  // { id: 'wbs', label: 'WBS' },
];

const TableItemNew = ({ dataRows, loading, renderRows }) => {
  return (
    <TablePaginationCustom
      headerRows={theadItems}
      rows={dataRows}
      width={1207}
      loading={loading}
      withSearch={false}
      renderRows={renderRows}
    />
  );
};

export default TableItemNew;
