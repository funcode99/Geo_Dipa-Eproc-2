import React from "react";
import { FormattedMessage } from "react-intl";
import {
  DescriptionOutlined,
  AssignmentOutlined,
  BookmarkBorderOutlined,
  LocalShipping,
} from "@material-ui/icons";

export const KEYS_TERMIN = {
  // fetch
  f_termin: "fetch-termin",
  f_summary_item: "fetch-summary_item",
  f_deliverable: "fetch-deliverable",
  f_deliv_order: "fetch-deliv_order",
  f_bapp: "fetch-bapp",
  f_bast: "fetch-bast",
  f_sv_acc: "fetch-sv_acc",
  f_gr: "fetch-gr",

  // upload

  // post

  // approve

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
    icon: <DescriptionOutlined className="mb-0 mr-2" />,
  },
  {
    id: "delivery-order",
    label: <FormattedMessage id="CONTRACT_DETAIL.TAB.DELIVERY_ORDER" />,
    icon: <LocalShipping className="mb-0 mr-2" />,
  },
  {
    id: "berita-acara",
    label: <FormattedMessage id="CONTRACT_DETAIL.TAB.OFFICIAL_REPORT" />,
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
