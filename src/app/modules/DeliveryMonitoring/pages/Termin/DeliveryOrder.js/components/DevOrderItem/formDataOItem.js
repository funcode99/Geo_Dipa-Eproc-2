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
      readOnly: false,
    },
    {
      name: "reject_text",
      label: <FormattedMessage id="TITLE.REMARKS" />,
      readOnly: false,
    },
  ],
  [
    {
      name: "spec",
      label: <FormattedMessage id="TITLE.SPESIFICATION" />,
      disabled: true,
    },
    {
      name: "desc",
      label: <FormattedMessage id="TITLE.DESCRIPTION" />,
      disabled: true,
    },
  ],
];
export const formData3 = [
  {
    name: "qty_approved",
    label: "Quantity Approved",
  },
];
export const form_gr = [
  {
    name: "header_tx",
    label: "Header Text",
  },

  {
    name: "post_date",
    label: "Posting Date",
    typeInput: "SelectDateInput",
  },

  {
    name: "bill_of_lading",
    label: "Bill of Lading",
  },

  {
    name: "ref_doc_no",
    label: "Ref Doc No",
    // type: "number",
  },

  {
    name: "gr_receipt",
    label: "GR Receipt",
  },

  {
    name: "unload_pt",
    label: "Unloading",
  },
];
