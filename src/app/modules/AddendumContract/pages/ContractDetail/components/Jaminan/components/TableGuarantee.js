import React from "react";
import { FormattedMessage } from "react-intl";
import TablePaginationCustom from "../../../../../../../components/tables/TablePagination";
import { JaminanContext } from "../Jaminan";
import RowGuarantee from "./RowGuarantee";

const tableHeaders = [
  {
    id: "no",
    label: <FormattedMessage id="TITLE.REQUIRED" />,
    sortable: false,
    // align: "center",
  },
  { id: "label", label: <FormattedMessage id="TITLE.GUARANTEE_TYPE" /> },
  { id: "status", label: <FormattedMessage id="TITLE.STATUS" /> },
  {
    id: "actions",
    label: <FormattedMessage id="MENU.ACTIONS" />,
    sortable: false,
  },
];
const tableHeadersVendor = [
  {
    id: "no",
    label: <FormattedMessage id="TITLE.REQUIRED" />,
    sortable: false,
    // align: "center",
  },
  { id: "label", label: <FormattedMessage id="TITLE.GUARANTEE_TYPE" /> },
  { id: "status", label: <FormattedMessage id="TITLE.STATUS" /> },
  {
    id: "actions",
    label: <FormattedMessage id="TITLE.UPLOAD" />,
    sortable: false,
  },
];

const TableGuarantee = () => {
  const { contractById, status } = React.useContext(JaminanContext);
  //   console.log(`dariContext`, dariContext);
  const dataRows = [
    {
      type: "down_payment_guarantee",
      label: "Jaminan Uang Muka",
      required: contractById?.down_payment_guarantee,
    },
    {
      type: "implementation_guarantee",
      label: "Jaminan Pelaksanaan",
      required: contractById?.implementation_guarantee,
    },
    {
      type: "maintenance_guarantee",
      label: "Jaminan Pemeliharaan",
      //   required: "0",
      required: contractById?.maintenance_guarantee,
    },
  ];
  return (
    <TablePaginationCustom
      withSearch={false}
      withPagination={false}
      //   headerRows={status === "vendor" ? tableHeadersVendor : tableHeaders}
      headerRows={tableHeaders}
      rows={dataRows}
      renderRows={(e) => <RowGuarantee key={e.index} {...e} />}
    />
  );
};

export default TableGuarantee;
