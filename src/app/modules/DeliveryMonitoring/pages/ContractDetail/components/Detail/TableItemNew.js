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
  { id: "qty", label: "Qty Total" },
  { id: "qty_avail", label: "Qty Available" },
  { id: "uom", label: "Uom" },
  { id: "unit-price", label: "Unit Price" },
  // { id: 'wbs', label: 'WBS' },
];

const TableItemNew = ({
  dataRows,
  loading,
  renderRows,
  tableHeader = theadItems,
  withPagination = false,
  classContainer,
}) => {
  return (
    <TablePaginationCustom
      headerRows={tableHeader}
      rows={dataRows}
      width={1200}
      loading={loading}
      withSearch={false}
      withPagination={withPagination}
      renderRows={renderRows}
      classContainer={classContainer}
    />
  );
};

export default TableItemNew;
