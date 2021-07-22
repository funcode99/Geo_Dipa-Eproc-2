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

const docOptions = {
  docType: [
    { value: "spmk", label: "SPMK" },
    { value: "skpp", label: "SKPP" },
  ],
  contractType: [
    { value: "full_payment", label: "Full Payment" },
    { value: "term", label: "Term" },
    { value: "confirmation_order", label: "Confirmation Order" },
  ],
};

const fieldKickOff = [
  {
    name: "poFile",
    typeInput: "UploadInput",
    label: <FormattedMessage id="TITLE.PO_DOCUMENT" />,
    labelSize: 2,
    formInputSize: 10,
  },
  {
    name: "docType",
    typeInput: "SelectInputCustom",
    label: <FormattedMessage id="TITLE.DOCUMENT_TYPE" />,
    labelSize: 2,
    formInputSize: 10,
  },
  // {
  //   name: "docFile",
  //   typeInput: "UploadInput",
  //   label: <FormattedMessage id="TITLE.FILE" />,
  // },
  // {
  //   name: "docDate",
  //   typeInput: "SelectDateInput",
  //   label: <FormattedMessage id="LABEL.DOCUMENT_DATE" />,
  // },
  [
    {
      name: "skppFile",
      typeInput: "UploadInput",
      label: "SKPP",
    },
    {
      name: "skppdate",
      typeInput: "SelectDateInput",
      label: <FormattedMessage id="TITLE.DATE" />,
    },
  ],
  [
    {
      name: "spmkFile",
      typeInput: "UploadInput",
      label: "SPMK",
    },
    {
      name: "spmkdate",
      typeInput: "SelectDateInput",
      label: <FormattedMessage id="TITLE.DATE" />,
    },
  ],
  {
    name: "contractType",
    typeInput: "SelectInputCustom",
    label: <FormattedMessage id="TITLE.CONTRACT_TYPE" />,
    labelSize: 2,
    formInputSize: 10,
  },
];

export { theadService, theadItem, fieldKickOff, docOptions };
