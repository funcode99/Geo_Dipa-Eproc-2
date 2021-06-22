import { makeStyles, Paper } from "@material-ui/core";
import React from "react";
import SVG from "react-inlinesvg";
import { FormattedMessage } from "react-intl";
import { toAbsoluteUrl } from "../../../../../_metronic/_helpers";
import ButtonAction from "../../../../components/buttonAction/ButtonAction";
import Subheader from "../../../../components/subheader";
import TablePaginationCustom from "../../../../components/tables/TablePagination";
import useToast from "../../../../components/toast";
import { formatDate } from "../../../../libs/date";
import * as deliveryMonitoring from "../../service/DeliveryMonitoringCrud";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(1),
    overflowX: "auto",
    padding: theme.spacing(2),
  },
  table: {
    minWidth: 650,
  },
}));

const tableHeaderContractsNew = [
  {
    id: "contract_no",
    label: <FormattedMessage id="CONTRACT_DETAIL.LABEL.CONTRACT_NUMBER" />,
  },
  {
    id: "po_number",
    label: <FormattedMessage id="CONTRACT_DETAIL.LABEL.PO_NUMBER" />,
  },
  {
    id: "procurement_title",
    label: <FormattedMessage id="CONTRACT_DETAIL.LABEL.PROCUREMENT_TITLE" />,
  },
  {
    id: "po_date",
    label: <FormattedMessage id="CONTRACT_DETAIL.LABEL.PO_DATE" />,
  },
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
  {
    id: "status",
    label: <FormattedMessage id="CONTRACT_DETAIL.TABLE_HEAD.STATUS" />,
  },
  {
    id: "action",
    label: <FormattedMessage id="CONTRACT_DETAIL.TABLE_HEAD.ACTION" />,
    sortable: false,
  },
];

export const ContractsPage = () => {
  const classes = useStyles();
  const [Toast, setToast] = useToast();
  const [loading, setLoading] = React.useState(false);
  const [newContent, setNewContent] = React.useState([]);

  const generateTableContent = (data) => {
    let dataArr = [];
    // console.log(`data`, data);
    data.forEach((item) => {
      let objData = {
        contract_no: item?.contract_no,
        po_number: item?.purch_order_no,
        procurement_title: item?.contract_name,
        po_date:
          item?.issued_date !== null
            ? formatDate(new Date(item?.issued_date))
            : null,
        contract_date:
          item?.issued_date !== null
            ? formatDate(new Date(item?.issued_date))
            : null,
        group: item?.purch_order?.purch_group?.alias_name,
        vendor: item?.vendor.party?.full_name,
        status: item?.state,
        action: (
          <ButtonAction
            hoverLabel="More"
            data={"1"}
            // handleAction={console.log(null)}
            ops={[
              {
                label: "CONTRACT.TABLE_ACTION.CONTRACT_DETAILS",
                icon: "fas fa-search text-primary pointer",
                to: {
                  url: `/client/delivery-monitoring/contract/${item.id}`,
                  style: {
                    color: "black",
                  },
                },
              },
            ]}
          />
        ),
      };
      dataArr.push(objData);
    });
    console.log(`objData`, dataArr);
    setNewContent(dataArr);
  };

  const getDataContracts = async () => {
    try {
      setLoading(true);
      const {
        data: { data },
      } = await deliveryMonitoring.getDataContracts();
      generateTableContent(data);
    } catch (error) {
      if (
        error.response?.status !== 400 &&
        error.response?.data.message !== "TokenExpiredError"
      ) {
        setToast("Error API, please contact developer!");
      }
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    getDataContracts();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <Toast />
      <Subheader
        text="Daftar Kontrak & PO"
        IconComponent={
          <SVG
            src={toAbsoluteUrl("/media/svg/icons/Home/Book-open.svg")}
            style={{ color: "white" }}
          />
        }
      />

      <Paper className={classes.root}>
        <TablePaginationCustom
          headerRows={tableHeaderContractsNew}
          rows={newContent}
          width={1500}
          loading={false}
        />
      </Paper>
    </>
  );
};

export default ContractsPage;
