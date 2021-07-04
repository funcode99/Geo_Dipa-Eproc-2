import { TableBody, TableHead, TableRow } from "@material-ui/core";
import { TableCell } from "@material-ui/core";
import { Table } from "@material-ui/core";
import React from "react";
import { FormattedMessage } from "react-intl";

const initTHead = [
  {
    id: "no",
    label: <FormattedMessage id="TITLE.NO" />,
  },
  {
    id: "name",
    label: <FormattedMessage id="TITLE.NAME" />,
  },
  {
    id: "qty",
    label: <FormattedMessage id="TITLE.QUANTITY" />,
    align: "right",
  },
  {
    id: "unit_price",
    label: <FormattedMessage id="TITLE.UNIT_PRICE" />,
    align: "right",
  },
  {
    id: "date",
    label: <FormattedMessage id="TITLE.DATE" />,
  },
  {
    id: "status",
    label: <FormattedMessage id="TITLE.STATUS" />,
  },
];

const initData = [
  {
    id: 1,
    name: "Barang 1",
    qty: 2,
    unit_price: "Rp 10,00",
    date: "1 Juli 2021",
    status: "waiting",
  },
  {
    id: 2,
    name: "Barang 1",
    qty: 2,
    unit_price: "Rp 10,00",
    date: "2 Juli 2021",
    status: "reject",
  },
  {
    id: 3,
    name: "Barang 1",
    qty: 2,
    unit_price: "Rp 10,00",
    date: "2 Juli 2021",
    status: "waiting",
  },
  {
    id: 4,
    name: "Barang 1",
    qty: 2,
    unit_price: "Rp 10,00",
    date: "3 Juli 2021",
    status: "accept",
  },
];

const TableHistory = ({ data = initData, tableHeader = initTHead }) => {
  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          {initTHead.map((item, index) => {
            return (
              <TableCell key={index} align={item?.align ?? "left"}>
                {item?.label}
              </TableCell>
            );
          })}
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((item, index) => {
          return (
            <TableRow key={index}>
              <TableCell>{(index += 1)}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell align="right">{item.qty}</TableCell>
              <TableCell align="right">{item.unit_price}</TableCell>
              <TableCell>{item.date}</TableCell>
              <TableCell>{item.status}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default TableHistory;
