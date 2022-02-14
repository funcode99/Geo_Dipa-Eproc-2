import React from "react";
import TablePaginationCustom from "../../../../../components/tables/TablePagination";
import { FormattedMessage } from "react-intl";
import { NavLink } from "react-router-dom";
import { formatDate } from "../../../../../libs/date";
import ButtonAction from "../../../../../components/buttonAction/ButtonAction";

const tableHeaderContractsNew = [
  //   {
  //     id: "contract_no",
  //     label: <FormattedMessage id="CONTRACT_DETAIL.LABEL.CONTRACT_NUMBER" />,
  //   },
  //   {
  //     id: "po_number",
  //     label: <FormattedMessage id="CONTRACT_DETAIL.LABEL.PO_NUMBER" />,
  //   },
  {
    id: "procurement_title",
    label: <FormattedMessage id="CONTRACT_DETAIL.LABEL.PROCUREMENT_TITLE" />,
  },
  //   {
  //     id: "po_date",
  //     label: <FormattedMessage id="CONTRACT_DETAIL.LABEL.PO_DATE" />,
  //   },
  {
    id: "contract_date",
    label: <FormattedMessage id="CONTRACT_DETAIL.LABEL.CONTRACT_DATE" />,
  },
  {
    id: "group",
    label: <FormattedMessage id="CONTRACT_DETAIL.LABEL.GROUP" />,
  },
  {
    id: "vendor",
    label: <FormattedMessage id="CONTRACT_DETAIL.LABEL.VENDOR" />,
  },
  //   {
  //     id: "status",
  //     label: <FormattedMessage id="CONTRACT_DETAIL.TABLE_HEAD.STATUS" />,
  //   },
  //   {
  //     id: "action",
  //     label: <FormattedMessage id="CONTRACT_DETAIL.TABLE_HEAD.ACTION" />,
  //     sortable: false,
  //   },
];
const ContractSumTable = ({ data, loading, status }) => {
  const [newContent, setNewContent] = React.useState([]);
  console.log(`data`, data);

  const generateTableContent = React.useCallback(() => {
    let dataArr = data.map((item, id) => ({
      procurement_title: (
        <NavLink to={`/${status}/delivery-monitoring/contract/${item?.id}`}>
          {item?.contract_name}
        </NavLink>
      ),
      // po_number: item?.purch_order_no,
      //   procurement_title: item?.contract_name,
      contract_date: !!item?.purch_order?.issued_date
        ? formatDate(new Date(item?.purch_order?.issued_date))
        : null,
      //   po_date:
      //     item?.issued_date !== null
      //       ? formatDate(new Date(item?.issued_date))
      //       : null,
      group: item?.user_group?.party?.full_name,
      vendor: item?.vendor?.party?.full_name,
      //   status: item?.state,
      //   action: (
      //     <ButtonAction
      //       hoverLabel="More"
      //       data={"1"}
      //       // handleAction={console.log(null)}
      //       ops={[
      //         {
      //           label: "CONTRACT.TABLE_ACTION.CONTRACT_DETAILS",
      //           icon: "fas fa-search text-primary pointer",
      //           to: {
      //             url: `/${status}/delivery-monitoring/contract/${item.id}`,
      //             style: {
      //               color: "black",
      //             },
      //           },
      //         },
      //       ]}
      //     />
      //   ),
    }));
    setNewContent(dataArr);
  }, [data, status]);

  React.useEffect(() => {
    generateTableContent();
  }, [data]);

  return (
    <TablePaginationCustom
      headerRows={tableHeaderContractsNew}
      rows={newContent}
      width={1000}
      loading={loading}
      withPagination={true}
      withSearch={false}
    />
  );
};

export default ContractSumTable;
