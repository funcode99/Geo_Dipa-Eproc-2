import React from "react";
import { Paper, makeStyles, Icon } from "@material-ui/core";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../_metronic/_helpers";
import * as deliveryMonitoring from "../../service/DeliveryMonitoringCrud";
import useToast from "../../../../components/toast";
import Subheader from "../../../../components/subheader";
import CustomTable from "../../../../components/tables";
import { formatDate } from "../../../../libs/date";
import ButtonAction from "../../../../components/buttonAction/ButtonAction";
import { FormattedMessage } from "react-intl";

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

const tableHeaderContracts = [
  {
    label: <FormattedMessage id="CONTRACT_DETAIL.LABEL.CONTRACT_NUMBER" />,
    props: { align: "left" },
  },
  { label: <FormattedMessage id="CONTRACT_DETAIL.LABEL.PO_NUMBER" /> },
  {
    label: <FormattedMessage id="CONTRACT_DETAIL.LABEL.PROCUREMENT_TITLE" />,
    props: { align: "left" },
  },
  { label: <FormattedMessage id="CONTRACT_DETAIL.LABEL.PO_DATE" /> },
  { label: <FormattedMessage id="CONTRACT_DETAIL.LABEL.CONTRACT_DATE" /> },
  { label: <FormattedMessage id="CONTRACT_DETAIL.LABEL.GROUP" /> },
  { label: <FormattedMessage id="CONTRACT_DETAIL.LABEL.VENDOR" /> },
  { label: <FormattedMessage id="CONTRACT_DETAIL.TABLE_HEAD.STATUS" /> },
  { label: <FormattedMessage id="CONTRACT_DETAIL.TABLE_HEAD.ACTION" /> },
];

export const ContractsPage = () => {
  const classes = useStyles();
  const [Toast, setToast] = useToast();
  const [loading, setLoading] = React.useState(false);
  const [tableContent, setTableContent] = React.useState([]);

  const generateTableContent = (data) => {
    data.forEach((item) => {
      const rows = [
        { content: item?.contract_no, props: { align: "left" } },
        { content: item?.purch_order_no },
        { content: item?.contract_name, props: { align: "left" } },
        {
          content:
            item?.issued_date !== null
              ? formatDate(new Date(item?.issued_date))
              : null,
        },
        {
          content:
            item?.issued_date !== null
              ? formatDate(new Date(item?.issued_date))
              : null,
        },
        { content: item?.purch_order?.purch_group?.alias_name },
        { content: item?.vendor.party?.full_name },
        { content: item?.state },
        {
          content: (
            <ButtonAction
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
        },
      ];
      setTableContent((prev) => [...prev, rows]);
    });
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
        <CustomTable
          tableHeader={tableHeaderContracts}
          tableContent={tableContent}
          marginY="my-1"
          hecto="hecto-15"
          loading={loading}
        />
      </Paper>
    </>
  );
};

export default ContractsPage;
