import React from "react";
import TablePaginationCustom from "../../../../../../components/tables/TablePagination";
import { FormattedMessage } from "react-intl";
import { TableCell, TableRow } from "@material-ui/core";

const tableHeader = [
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
  },
  {
    id: "unit_price",
    label: <FormattedMessage id="TITLE.UNIT_PRICE" />,
  },
  {
    id: "approve_status",
    label: <FormattedMessage id="TITLE.STATUS" />,
  },
];

const DeliveryOrderItem = ({ data }) => {
  const { task_delivery_items } = data;

  let tableContent = [];
  task_delivery_items.forEach((item, index) => {
    let objData = {
      no: (index += 1),
      name: item?.item?.desc,
      qty: item?.qty,
      unit_price: item?.item?.unit_price,
      approve_status: item?.approve_status?.name,
    };
    tableContent.push(objData);
  });

  return (
    <div className="mt-8">
      <TablePaginationCustom
        headerRows={tableHeader}
        rows={tableContent}
        // width={1000}
        maxHeight={300}
        // loading={loading.fetch}
        withSearch={false}
        renderRows={({ item, index }) => {
          return (
            <TableRow key={index}>
              <TableCell>{(index += 1)}</TableCell>
              <TableCell>{item?.name}</TableCell>
              <TableCell>{item?.qty}</TableCell>
              <TableCell>{item?.unit_price}</TableCell>
              <TableCell>{item?.approve_status}</TableCell>
            </TableRow>
          );
        }}
      />
    </div>
  );
};

export default DeliveryOrderItem;
