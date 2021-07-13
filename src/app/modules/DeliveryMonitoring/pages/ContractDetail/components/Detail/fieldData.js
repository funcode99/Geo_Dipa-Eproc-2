import React from "react";
import { FormattedMessage } from "react-intl";

const theadService = [
  { id: "action", label: "" },
  { id: "keterangan", label: <FormattedMessage id="TITLE.DESCRIPTION" /> },
  {
    id: "due-date",
    label: <FormattedMessage id="CONTRACT_DETAIL.TABLE_HEAD.DUE_DATE" />,
  },
  { id: "qty", label: "Qty Total" },
  { id: "qty_avail", label: <FormattedMessage id="TITLE.QTY_AVAILABLE" /> },
  { id: "uom", label: "Uom" },
  { id: "net_value", label: <FormattedMessage id="TITLE.NET_VALUE" /> },
];

const theadItem = [
  { id: "action", label: "" },
  { id: "keterangan", label: <FormattedMessage id="TITLE.DESCRIPTION" /> },
  {
    id: "due-date",
    label: <FormattedMessage id="CONTRACT_DETAIL.TABLE_HEAD.DUE_DATE" />,
  },
  { id: "qty", label: "Qty Total" },
  { id: "qty_avail", label: <FormattedMessage id="TITLE.QTY_AVAILABLE" /> },
  { id: "uom", label: "Uom" },
  { id: "unit-price", label: <FormattedMessage id="TITLE.UNIT_PRICE" /> },
];

const fieldKickOff = [
  {
    name: "docType",
    typeInput: "SelectInputCustom",
    label: "Tipe Dokumen",
  },
  {
    name: "docFile",
    typeInput: "UploadInput",
    label: "File Dokumen",
  },
  {
    name: "docDate",
    typeInput: "SelectDateInput",
    label: "Tanggal Dokumen",
  },
];

export { theadService, theadItem, fieldKickOff };
