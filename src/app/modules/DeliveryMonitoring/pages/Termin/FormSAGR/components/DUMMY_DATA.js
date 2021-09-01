import { FormattedMessage } from "react-intl";

export const sa_field = [
  [
    {
      name: "wbs",
      label: "WBS",
    },
    {
      name: "buss-area",
      label: "Bussiness Area",
    },
  ],
  [
    {
      name: "cost-center",
      label: "Cost Center",
    },
    {
      name: "short-text",
      label: "Short Text",
    },
  ],
  {
    name: "location",
    label: "Location",
    labelSize: 2,
    formInputSize: 10,
    typeInput: "TextAreaInput",
  },
  [
    {
      name: "begin-date",
      label: "Start Date",
    },
    {
      name: "end-date",
      label: "Finish Date",
    },
  ],
  //   [
  //     {
  //       name: "doc-date",
  //       label: "Document Date",
  //     },
  //     {
  //       name: "post-date",
  //       label: "Post Date",
  //     },
  //   ],
  [
    {
      name: "person-internal",
      label: "Person Internal",
    },
    {
      name: "person-ext",
      label: "Person External",
    },
  ],
  [
    {
      name: "ref-doc-no",
      label: "Ref Doc No",
    },
    {
      name: "doc-text",
      label: "Document Text",
    },
  ],
];

export const gr_field = [
  [
    {
      name: "header_tx",
      label: "Header Text",
    },
    {
      name: "post_date",
      label: "Posting Date",
      typeInput: "SelectDateInput",
    },
  ],
  [
    {
      name: "bill_of_lading",
      label: "Bill of Lading",
    },
    {
      name: "ref_doc_no",
      label: "Ref Doc No",
    },
  ],
  [
    {
      name: "gr_receipt",
      label: "GR Receipt",
    },
    {
      name: "unload_pt",
      label: "Unload PT",
    },
  ],
  //   [
  //     {
  //       name: "doc-date",
  //       label: "Document Date",
  //     },
  //     {
  //       name: "post-date",
  //       label: "Post Date",
  //     },
  //   ],
];

export const headerTableSA = [
  {
    id: "name_service",
    label: "Name Service",
  },
  {
    id: "gl_account",
    label: "GL Account",
  },
  {
    id: "bus_area",
    label: "Bus Area",
  },
  {
    id: "cost_center",
    label: "Cost Center",
  },
  {
    id: "dist_type",
    label: "Distribution Type",
  },
  {
    id: "wbs",
    label: "WBS",
  },
  {
    id: "value",
    label: "Value",
  },
];

export const rowTableSA_field = [
  {
    name: "gl_account",
    label: "Header Text",
  },
  {
    name: "bus_area",
    label: "Header Text",
  },
  {
    name: "cost_center",
    label: "Header Text",
  },
  {
    name: "dist_type",
    label: "Header Text",
  },
  {
    name: "wbs",
    label: "Header Text",
  },
  {
    name: "value",
    label: "Header Text",
  },
];
