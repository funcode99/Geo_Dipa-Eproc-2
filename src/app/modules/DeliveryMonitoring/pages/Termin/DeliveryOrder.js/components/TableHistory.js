import { TableBody, TableHead, TableRow } from "@material-ui/core";
import { TableCell } from "@material-ui/core";
import { Table } from "@material-ui/core";
import React from "react";
import { FormattedMessage } from "react-intl";
import { formatDate } from "../../../../../../libs/date";

const initTHead = [
  {
    id: "no",
    label: <FormattedMessage id="TITLE.NO" />,
  },
  {
    id: "description",
    label: <FormattedMessage id="TITLE.NAME" />,
  },
  {
    id: "date",
    label: <FormattedMessage id="TITLE.DATE" />,
  },
];

const initData = [
  {
    id: 1,
    description: "Vendor membuat permintaan barang",
    date: "1 Juli 2021",
  },
  {
    id: 2,
    description: "User melakukan perubahan status (approved)",
    date: "2 Juli 2021",
  },
  {
    id: 2,
    description: "Vendor melakukan perubahan status (approved) item barang 1",
    date: "3 Juli 2021",
  },
];

const TableHistory = ({ data = initData, tableHeader = initTHead }) => {
  return (
    <Table
      // style={{
      //   height: 300,
      // }}
      // stickyHeader
      size="small"
    >
      <TableHead style={{ background: "lightgrey" }}>
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
              <TableCell>{item.description}</TableCell>
              <TableCell>
                {item?.createdAt !== null
                  ? formatDate(new Date(item?.createdAt))
                  : null}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default TableHistory;
