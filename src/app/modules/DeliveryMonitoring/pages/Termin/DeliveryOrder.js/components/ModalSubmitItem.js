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
import DialogGlobal from "../../../../../../components/modals/DialogGlobal";

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
    qty_approved: 2,
    approve_status: "approve",
    reject_text: "good",
  },
  {
    id: 2,
    name: "barang 2",
    qty: 3,
    qty_approved: 0,
    approve_status: "reject",
    reject_text: "salah",
  },
  {
    id: 3,
    name: "barang 3",
    qty: 4,
    qty_approved: 2,
    approve_status: "approve",
    reject_text: "yang 2 gak sesuai standar",
  },
];

const ModalSubmitItem = ({
  visible,
  onClose,
  onSubmit,
  loading,
  data = initData,
  innerRef,
  // itemForm = [],
  ...other
}) => {
  return (
    <React.Fragment>
      <DialogGlobal
        ref={innerRef}
        visible={visible}
        title={<FormattedMessage id="TITLE.APPROVAL_DELIVERY_ORDER_ITEMS" />}
        textYes={<FormattedMessage id="BUTTON.SUBMIT" />}
        textNo={<FormattedMessage id="BUTTON.CANCEL" />}
        onYes={onSubmit}
        onNo={onClose}
        loading={loading}
        btnNoProps={{
          className: "bg-secondary text-black",
        }}
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
                <TableCell>{item.qty_approved}</TableCell>
                <TableCell>{item.approve_status}</TableCell>
                <TableCell>{item.reject_text}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <h4 className="text-center mt-5">
          <FormattedMessage id="MESSAGE.DATA_IS_CORRECT" />
        </h4>
      </DialogGlobal>
    </React.Fragment>
  );
};

export default ModalSubmitItem;
