import { makeStyles, Paper } from "@material-ui/core";
import React from "react";
import SVG from "react-inlinesvg";
import { FormattedMessage } from "react-intl";
import { toAbsoluteUrl } from "../../../../../_metronic/_helpers";
import ButtonAction from "../../../../components/buttonAction/ButtonAction";
import Subheader from "../../../../components/subheader";
import TablePaginationCustom from "../../../../components/tables/TablePagination";
import { formatDate } from "../../../../libs/date";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { fetch_api_sg, getLoading } from "../../../../../redux/globalReducer";

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
    id: "procurement_title",
    label: <FormattedMessage id="CONTRACT_DETAIL.LABEL.PROCUREMENT_TITLE" />,
  },
  {
    id: "contract_no",
    label: <FormattedMessage id="CONTRACT_DETAIL.LABEL.CONTRACT_NUMBER" />,
  },
  {
    id: "po_number",
    label: <FormattedMessage id="CONTRACT_DETAIL.LABEL.PO_NUMBER" />,
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

const keys = {
  fetch: "get-data-contracts",
};

export const ContractsPage = ({ fetch_api_sg, loadings, status }) => {
  const classes = useStyles();
  const [newContent, setNewContent] = React.useState([]);

  const generateTableContent = (data) => {
    let dataArr = data.map((item, id) => ({
      procurement_title: (
        <NavLink to={`/${status}/delivery-monitoring/contract/${item.id}`}>
          {item?.contract_name}
        </NavLink>
      ),
      contract_no: item?.contract_no,
      po_number: item?.purch_order_no,
      po_date:
        item?.issued_date !== null
          ? formatDate(new Date(item?.issued_date))
          : null,
      contract_date:
        item?.issued_date !== null
          ? formatDate(new Date(item?.issued_date))
          : null,
      group: item?.user_group?.party?.full_name,
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
                url: `/${status}/delivery-monitoring/contract/${item.id}`,
                style: {
                  color: "black",
                },
              },
            },
          ]}
        />
      ),
    }));
    setNewContent(dataArr);
  };

  const getDataContracts = async () => {
    fetch_api_sg({
      keys: keys.fetch,
      type: "get",
      url: `/delivery/contract`,
      onSuccess: (res) => {
        // console.log(`res.data`, res.data);
        generateTableContent(res.data);
      },
    });
  };

  React.useEffect(() => {
    getDataContracts();
    // eslint-disable-next-line
  }, []);

  return (
    <>
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
          loading={loadings.fetch}
        />
      </Paper>
    </>
  );
};

const mapState = (state) => ({
  loadings: {
    fetch: getLoading(state, keys.fetch),
  },
  status: state.auth.user.data.status,
});

const mapDispatch = {
  fetch_api_sg,
};

export default connect(mapState, mapDispatch)(ContractsPage);
