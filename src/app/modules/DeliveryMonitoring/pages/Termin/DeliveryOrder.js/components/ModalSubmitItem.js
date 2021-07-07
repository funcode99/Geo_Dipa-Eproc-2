import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import React from "react";
import ModalConfirmation from "../../../../../../components/modals/ModalConfirmation";
import { FormattedMessage } from "react-intl";

const tHeadSubmitItems = [
  "No",
  <FormattedMessage id="TITLE.NAME" />,
  <FormattedMessage id="TITLE.QUANTITY" />,
  <FormattedMessage id="TITLE.QUANTITY_APPROVED" />,
  <FormattedMessage id="TITLE.STATUS" />,
  <FormattedMessage id="TITLE.REMARKS" />,
];

const initData = [
  {
    id: 1,
    name: "barang 1",
    qty: 2,
    qty_approve: 2,
    status: "approve",
    remarks: "good",
  },
  {
    id: 2,
    name: "barang 2",
    qty: 3,
    qty_approve: 0,
    status: "reject",
    remarks: "salah",
  },
  {
    id: 3,
    name: "barang 3",
    qty: 4,
    qty_approve: 2,
    status: "approve",
    remarks: "yang 2 gak sesuai standar",
  },
];

const ModalSubmitItem = ({
  visible,
  onClose,
  title,
  textYes,
  textNo,
  onSubmit,
  loading,
  data = initData,
}) => {
  return (
    <ModalConfirmation
      visible={visible}
      onClose={onClose}
      title={title}
      textYes={textYes}
      textNo={textNo}
      submitColor="primary"
      onSubmit={onSubmit}
      loading={loading}
    >
      <Table
        // style={{ width: 450 }}
        size="small"
        className="mb-3"
      >
        {/* <colgroup>
          <col width="50px" />
          <col width="200px" />
          <col width="50px" />
        </colgroup> */}
        <TableHead>
          <TableRow>
            {tHeadSubmitItems.map((item, index) => (
              <TableCell
                key={index}
                // align={index > 1 ? "right" : "left"}
              >
                {item}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{(index += 1)}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.qty}</TableCell>
              <TableCell>{item.qty_approve}</TableCell>
              <TableCell>{item.status}</TableCell>
              <TableCell>{item.remarks}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ModalConfirmation>
  );
};

export default ModalSubmitItem;
