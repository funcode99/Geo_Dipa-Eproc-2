import React from "react";
import { FormattedMessage } from "react-intl";
import {
  DescriptionOutlined,
  AssignmentOutlined,
  BookmarkBorderOutlined,
  LocalShipping,
  MenuBook,
} from "@material-ui/icons";

export const KEYS_TERMIN = {
  // fetch
  f_contract: "fetch-contract",
  f_termin: "fetch-termin",
  f_summary_item: "fetch-summary_item",
  f_deliverable: "fetch-deliverable",
  f_deliv_order: "fetch-deliv_order",
  f_bapp: "fetch-bapp",
  f_bast: "fetch-bast",
  f_sv_acc: "fetch-sv_acc",
  f_gr: "fetch-gr",
  f_sa_gr: "fetch-sa-gr",
  // upload

  // post
  p_t_summary: "post-termin-summary",
  p_t_upload_do: "post-termin-upload-do",
  p_t_edit_termin: "post-termin-update-termin",
  // approve
  p_t_approve_do_doc: "post-termin-upload-do-document",
  // reject
};

export const KEYS_ACTION = {
  upload: "upload",
  approve: "approve",
  reject: "reject",
};

export const STATE_STEPPER = {
  done: "COMPLETE",
  on: "ON PROGRESS",
  wait: "NO STARTED",
};

export const TERMIN_TAB_LIST = [
  {
    id: "summary",
    label: <FormattedMessage id="CONTRACT_DETAIL.TAB.SUMMARY" />,
    icon: <MenuBook className="mb-0 mr-2" />,
  },
  {
    id: "delivery-order",
    label: <FormattedMessage id="CONTRACT_DETAIL.TAB.DELIVERY_ORDER" />,
    icon: <LocalShipping className="mb-0 mr-2" />,
  },
  {
    id: "berita-acara",
    label: <FormattedMessage id="CONTRACT_DETAIL.TAB.OFFICIAL_REPORT" />,
    icon: <DescriptionOutlined className="mb-0 mr-2" />,
  },
  {
    id: "form-sa-gr",
    // label: <FormattedMessage id="CONTRACT_DETAIL.TAB.SUMMARY" />,
    label: "Form SA / GR",
    icon: <AssignmentOutlined className="mb-0 mr-2" />,
  },
  {
    id: "sa-gr",
    label: "SA / GR",
    icon: <BookmarkBorderOutlined className="mb-0 mr-2" />,
  },
];

export const DUMMY_STEPPER = [
  {
    label: "Create Term",
    status: "NO STARTED",
  },
  {
    label: "Create Deliverables",
    status: "NO STARTED",
  },
  {
    label: "Upload Deliverables",
    status: "NO STARTED",
  },
  {
    label: "Create Delivery Order",
    status: "NO STARTED",
  },
  {
    label: "Create BAPP",
    status: "NO STARTED",
  },
  {
    label: "Approve SA/GR",
    status: "NO STARTED",
  },
];
// export const DUMMY_STEPPER_CONTRACT = [
//   {
//     label: "Kick Off",
//     status: "NO STARTED",
//   },
//   {
//     label: "Upload Guarantee",
//     status: "NO STARTED",
//   },
//   {
//     label: "Initialize Contract Periods",
//     status: "NO STARTED",
//   },
//   {
//     label: "Initialize Term",
//     status: "NO STARTED",
//   },
// ];

export const DUMMY_STEPPER_CONTRACT = [
  {
    label: "Isi Form Permohonan",
    status: "NO STARTED",
  },
  {
    label: "Isi Form Parameter",
    status: "ON PROGRESS",
  },
  {
    label: "Upload Dokumen Pendukung",
    status: "COMPLETE",
  },
  {
    label: "Verifikasi Permohonan",
    status: "NO STARTED",
  },
  {
    label: "Permohonan Disetujui",
    status: "NO STARTED",
  },
];

export const STEPPER_ADDENDUM_CONTRACT = [
  {
    label: "Drafting",
    status: "ON PROGRESS",
  },
  {
    label: "In Review",
    status: "NO STARTED",
  },
  {
    label: "Approval Vendor",
    status: "COMPLETE",
  },
  {
    label: "Approval User",
    status: "NO STARTED",
  },
  {
    label: "Final Draft",
    status: "NO STARTED",
  },
  {
    label: "Distribusi",
    status: "NO STARTED",
  },
];
