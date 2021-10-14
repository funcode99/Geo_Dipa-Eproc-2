import { FormattedMessage } from "react-intl";
import { object } from "yup";
import validation from "../../../../../../service/helper/validationHelper";
import InputWBS from "./InputWBS";
import React from "react";

export const sa_field = [
  [
    {
      name: "ext_number",
      label: "Extension Number",
    },
    // {
    //   name: "po_number",
    //   label: "PO Number",
    // },
    // {
    //   name: "po_item",
    //   label: "PO Item",
    // },
  ],
  [
    {
      name: "short_text",
      label: "Short Text",
    },
    {
      name: "location",
      label: "Location",
    },
  ],
  // [
  // ],
  [
    {
      name: "begdate",
      label: "Begin Date",
      typeInput: "SelectDateInput",
    },
    {
      name: "enddate",
      label: "End Date",
      typeInput: "SelectDateInput",
    },
  ],
  [
    {
      name: "person_int",
      label: "Person Internal",
    },
    {
      name: "person_ext",
      label: "Person External",
    },
  ],
  [
    // {
    //   name: "doc_date",
    //   label: "Document Date",
    // },
    {
      name: "post_date",
      label: "Post Date",
      typeInput: "SelectDateInput",
    },
  ],
  [
    {
      name: "ref_doc_no",
      label: "Ref Doc No",
    },
    {
      name: "doc_text",
      label: "Doc Text",
    },
  ],
  // [
  //   {
  //     name: "score_qual",
  //     label: "Score Qual",
  //   },
  //   {
  //     name: "score_time",
  //     label: "Score Time",
  //   },
  // ],
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
      type: "number",
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
    sticky: true,
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
  // {
  //   id: "value",
  //   label: "Value",
  // },
];

export const rowTableSA_field = [
  {
    name: "dist_type",
    label: "Header Text",
    typeInput: "SelectInputCustom",
  },
  {
    name: "wbsdata",
    label: "Header Text",
    // typeInput: "SelectInputCustom",
    ChildWithName: (props) => <InputWBS {...props} />,
  },
  {
    name: "gl_account",
    label: "GL Account",
    typeInput: "SelectInputCustom",
  },
  {
    name: "bus_area",
    label: "Header Text",
  },
  {
    name: "cost_center",
    label: "Header Text",
    typeInput: "SelectInputCustom",
  },
  // {
  //   name: "value",
  //   label: "Header Text",
  //   type: "number",
  //   size: "sm",
  //   min: "0.1",
  //   step: "0.1",
  // },
];

export const validationSchema_sa = object().shape({
  ext_number: validation.require("Extension Number"),
  short_text: validation.require("Short Text"),
  location: validation.require("Location"),
  begdate: validation.require("Begin Date"),
  enddate: validation.require("End Date"),
  person_int: validation.require("Person Internal"),
  person_ext: validation.require("Person External"),
  post_date: validation.require("Post Date"),
  ref_doc_no: validation.require("Ref Doc No"),
  doc_text: validation.require("Doc Text"),
  // po_item: validation.require("PO Item"),
  // po_number: validation.require("PO Number"),
  // doc_date: validation.require("Document Date"),
  // score_qual: validation.require("Score Qual"),
  // score_time: validation.require("Score Time"),
});

export const option_dist_type = [
  { value: "", label: "Full Payment" },
  { value: "1", label: "Gradual Payment (quantity)" },
  { value: "2", label: "Gradual Payment (percentage)" },
];

export const BASE_MODAL_CONF = [
  {
    type: "gr101",
    title: "Post GR 101 to SAP ?",
    // subTitle: "Pastikan dokumen yang dikirimkan telah sesuai !",
  },
  {
    type: "gr103",
    title: "Post GR 101 to SAP ?",
    // subTitle: "Pastikan dokumen yang dikirimkan tidak sesuai !",
    // isReject: true,
  },
];
