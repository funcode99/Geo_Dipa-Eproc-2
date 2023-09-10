import React from "react";
import { FormattedMessage } from "react-intl";

const formData = [
  {
    name: "date",
    label: "Delivery Date",
    typeInput: "SelectDateInput",
  },
  {
    name: "item",
    label: "Item",
    typeInput: "SelectInputCustom",
    // isMulti: true,
  },
  {
    name: "qty",
    label: "Quantity",
    type: "number",
    step: 1,
    placeholder: 1,
    // min: 1,
  },
];

const tblHeadDlvItem = [
  {
    id: "no",
    label: <FormattedMessage id="TITLE.NO" />,
  },
  {
    id: "desc",
    label: <FormattedMessage id="TITLE.DESCRIPTION" />,
  },
  {
    id: "date",
    label: <FormattedMessage id="TITLE.DATE" />,
  },
  {
    id: "remarks",
    label: <FormattedMessage id="TITLE.REMARKS" />,
  },
  {
    id: "approve_status",
    label: <FormattedMessage id="TITLE.STATUS" />,
  },
  {
    id: "action",
    label: <FormattedMessage id="TITLE.ACTION" />,
    sortable: false,
  },
];

export { formData, tblHeadDlvItem };
