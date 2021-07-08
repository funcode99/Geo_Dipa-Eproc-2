import React from "react";
import { FormattedMessage } from "react-intl";

export const formData = [
  [
    {
      name: "deliv_status",
      label: <FormattedMessage id="TITLE.DELIVERY_ORDER_STATUS" />,
      readOnly: true,
    },
    {
      name: "deliv_status_remarks",
      label: <FormattedMessage id="TITLE.STATUS_REMARKS" />,
      readOnly: true,
    },
  ],
];

export const formData2 = [
  [
    {
      name: "qty_approved",
      label: <FormattedMessage id="TITLE.QUANTITY_APPROVED" />,
      type: "number",
      min: 0,
      step: 0.1,
    },
    {
      name: "reject_text",
      label: <FormattedMessage id="TITLE.REMARKS" />,
    },
  ],
];
export const formData3 = [
  {
    name: "qty_approved",
    label: "Quantity Approved",
  },
];
