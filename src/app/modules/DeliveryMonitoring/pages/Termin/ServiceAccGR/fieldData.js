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

export { formData1, formData2 };
