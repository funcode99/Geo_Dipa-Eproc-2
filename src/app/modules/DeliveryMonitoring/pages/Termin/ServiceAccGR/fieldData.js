import React from "react";
import { FormattedMessage } from "react-intl";

const formData1 = [
  {
    name: "nomor_sa",
    label: <FormattedMessage id="LABEL.SA_NUMBER" />,
  },
  {
    name: "posting_date",
    label: <FormattedMessage id="LABEL.POSTING_DATE" />,
    typeInput: "SelectDateInput",
  },
  {
    name: "document_date",
    label: <FormattedMessage id="LABEL.DOCUMENT_DATE" />,
    typeInput: "SelectDateInput",
  },
  {
    name: "nomor_po",
    label: <FormattedMessage id="TITLE.PO_NUMBER" />,
  },
  {
    name: "purchasing_group",
    label: <FormattedMessage id="LABEL.PURCHASING_GROUP" />,
  },
  {
    name: "telephone",
    label: <FormattedMessage id="LABEL.TELEPHONE" />,
  },
  {
    name: "ref_qa",
    label: "Ref. QA",
  },
];

const formData2 = [
  {
    name: "pihak_pertama",
    label: <FormattedMessage id="LABEL.DM.PARTIES.1_PARTY" />,
  },
  {
    name: "pihak_kedua",
    label: <FormattedMessage id="LABEL.DM.PARTIES.2_PARTY" />,
  },
];

const tableHeader1 = [
  { id: "no", label: <FormattedMessage id="TITLE.NO" /> },
  { id: "service", label: <FormattedMessage id="TITLE.SERVICE" /> },
  { id: "qty", label: <FormattedMessage id="TITLE.QUANTITY" /> },
  { id: "uom", label: "UoM" },
  { id: "unit_price", label: <FormattedMessage id="TITLE.UNIT_PRICE" /> },
  { id: "net_value", label: <FormattedMessage id="TITLE.NET_VALUE" /> },
];

const tblHeadGRItems = [
  { id: "line", label: "Line" },
  { id: "mat_no", label: "Material Number" },
  { id: "desc", label: "Description" },
  { id: "order_qty", label: "Order Qty" },
  { id: "rcvd_qty", label: "Rcvd Qty" },
  { id: "uom", label: "UoM" },
  { id: "sloc", label: "SLoc" },
  { id: "stor_bin", label: "Stor Bin" },
];

const tableHeader2 = [
  { id: "no", label: <FormattedMessage id="TITLE.NO" /> },
  { id: "name", label: <FormattedMessage id="TITLE.NAME" /> },
  { id: "position", label: <FormattedMessage id="TITLE.POSITION" /> },
  { id: "activity", label: <FormattedMessage id="TITLE.ACTIVITY" /> },
  { id: "start_date", label: <FormattedMessage id="TITLE.START_DATE" /> },
  { id: "end_date", label: <FormattedMessage id="TITLE.END_DATE" /> },
  { id: "comment", label: <FormattedMessage id="TITLE.COMMENT" /> },
];

const detailSA = {
  client: {
    name: "PT. GEO DIPA ENERGI",
    address1: "Plant Pusat",
    address2: "Aldevco Octagon, Jl. Warung Jati",
    address3: "Barat 75",
  },
  document: {
    number: "1000006788",
    posting_date: "01.11.2020",
    document_date: "30.04.2020",
  },
  vendor: {
    name: "Company The Jakarta consulting Group",
    address1: "Wisma 46 Kota BNI Lt 32",
    address2: "Jl. Jend Sudirman Kav 1",
    address3: "Jakarta 10220",
    vendor_number: "30000210",
  },
  contract: {
    po_number: "8000003580",
    purch_group: "T01 - PST-GA",
    telephone: "021 7245673",
    currency: "IDR",
    external_number: "",
    ref_qa: "BAPP APRIL 20",
  },
};

const detailGR = {
  client: {
    name: "PT. GEO DIPA ENERGI",
    address1: "Plant Pusat",
    address2: "Aldevco Octagon, Jl. Warung Jati",
    address3: "Barat 75",
  },
  document: {
    number: "1000006788",
    posting_date: "01.11.2020",
    document_date: "30.04.2020",
  },
  vendor: {
    name: "Company The Jakarta consulting Group",
    address1: "Wisma 46 Kota BNI Lt 32",
    address2: "Jl. Jend Sudirman Kav 1",
    address3: "Jakarta 10220",
    vendor_number: "30000210",
  },
  contract: {
    po_number: "8000003580",
    movement_type: "101 - GR for acct assgmt",
    purch_group: "T02 - PO-PST-UMUM & SDM",
    telephone: "021 7245673",
    delivery_note: "PI",
    ref_qa: "BAPP APRIL 20",
  },
};

export {
  formData1,
  formData2,
  tableHeader1,
  tableHeader2,
  detailSA,
  detailGR,
  tblHeadGRItems,
};
