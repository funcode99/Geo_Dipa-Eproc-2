import React from "react";
import { FormattedMessage } from "react-intl";

export const TABLE_HEAD_DATA = [
  "No",
  <FormattedMessage id="TITLE.NAME" />,
  <FormattedMessage id="TITLE.QUANTITY" />,
];

export const TABLE_ITEMS = [
  { id: "action", label: "" },
  { id: "keterangan", label: "Keterangan" },
  { id: "due-date", label: "Due Date" },
  { id: "qty", label: "Qty" },
  { id: "qty_avail", label: "Qty Available" },
  { id: "uom", label: "Uom" },
  { id: "net-value", label: "Net Value" },
  // { id: 'wbs', label: 'WBS' },
];

export const NAV_LISTS = [
  { id: "link-jasa", label: <FormattedMessage id="SUMMARY.NAV.SERVICE" /> },
  { id: "link-barang", label: <FormattedMessage id="SUMMARY.NAV.ITEM" /> },
];
