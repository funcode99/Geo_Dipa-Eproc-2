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
  { id: "gr_price", label: "Gross Value" },
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
  contract_type: [
    { value: "full_payment", label: "Full Payment" },
    { value: "term", label: "Term" },
    { value: "confirmation_order", label: "Confirmation Order" },
  ],
};

const fieldKickOff = [
  {
    name: "po_document",
    typeInput: "UploadInput",
    label: <FormattedMessage id="TITLE.PO_DOCUMENT" />,
    labelSize: 2,
    formInputSize: 10,
    isPreview: true,
  },
  // {
  //   name: "docType",
  //   typeInput: "SelectInputCustom",
  //   label: <FormattedMessage id="TITLE.DOCUMENT_TYPE" />,
  //   labelSize: 2,
  //   formInputSize: 10,
  // },
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
      name: "skpp_document",
      typeInput: "UploadInput",
      label: "SKPP",
      isPreview: true,
    },
    {
      name: "skpp_date",
      typeInput: "SelectDateInput",
      label: <FormattedMessage id="TITLE.DATE" />,
    },
  ],
  [
    {
      name: "spmk_document",
      typeInput: "UploadInput",
      label: "SPMK",
      isPreview: true,
    },
    {
      name: "spmk_date",
      typeInput: "SelectDateInput",
      label: <FormattedMessage id="TITLE.DATE" />,
    },
  ],
  {
    name: "contract_type",
    typeInput: "SelectInputCustom",
    label: <FormattedMessage id="TITLE.CONTRACT_TYPE" />,
    labelSize: 2,
    formInputSize: 10,
  },
];

export { theadService, theadItem, fieldKickOff, docOptions };
