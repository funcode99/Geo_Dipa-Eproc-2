import { makeStyles, Paper } from "@material-ui/core";
import React from "react";
import SVG from "react-inlinesvg";
import { FormattedMessage } from "react-intl";
import { TableRow, TableCell } from "@material-ui/core";
import { toAbsoluteUrl } from "../../../../../_metronic/_helpers";
import ButtonAction from "../../../../components/buttonAction/ButtonAction";
import Subheader from "../../../../components/subheader";
import { formatDate } from "../../../../libs/date";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { fetch_api_sg, getLoading } from "../../../../../redux/globalReducer";
import Tables from "../../../../components/tableCustomV1/table";
import {
  getSorting,
  searchFindMulti,
  stableSort,
} from "../../../../components/tables/TablePagination/TablePaginationCustom";

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
    name: "contract_no",
    title: <FormattedMessage id="CONTRACT_DETAIL.LABEL.CONTRACT_NUMBER" />,
    order: { active: true, status: true, type: true },
    filter: { active: true, type: "text" },
  },
  {
    name: "po_number",
    title: <FormattedMessage id="CONTRACT_DETAIL.LABEL.PO_NUMBER" />,
    order: { active: true, status: true, type: true },
    filter: { active: true, type: "text" },
  },
  {
    name: "procurement_title",
    title: <FormattedMessage id="CONTRACT_DETAIL.LABEL.PROCUREMENT_TITLE" />,
    order: { active: true, status: true, type: true },
    filter: { active: true, type: "text" },
  },
  {
    name: "po_date",
    title: <FormattedMessage id="CONTRACT_DETAIL.LABEL.PO_DATE" />,
    order: { active: false, status: false },
    filter: { active: true, type: "text" },
  },
  {
    name: "contract_date",
    title: <FormattedMessage id="CONTRACT_DETAIL.LABEL.CONTRACT_DATE" />,
    order: { active: false, status: false },
    filter: { active: true, type: "text" },
  },
  {
    name: "group",
    title: <FormattedMessage id="CONTRACT_DETAIL.LABEL.GROUP" />,
    order: { active: false, status: false },
    filter: { active: true, type: "text" },
  },
  {
    name: "vendor",
    title: <FormattedMessage id="CONTRACT_DETAIL.LABEL.VENDOR" />,
    order: { active: false, status: false },
    filter: { active: true, type: "text" },
  },
  {
    name: "status",
    title: <FormattedMessage id="CONTRACT_DETAIL.TABLE_HEAD.STATUS" />,
    order: { active: false, status: false },
    filter: { active: true, type: "text" },
  },
  {
    name: "action",
    title: <FormattedMessage id="CONTRACT_DETAIL.TABLE_HEAD.ACTION" />,
    order: { active: false, status: false },
    filter: { active: false, type: "text" },
  },
];

const keys = {
  fetch: "get-data-contracts",
};

export const ContractsPage = ({ fetch_api_sg, loadings, status }) => {
  const classes = useStyles();
  const [dataArr, setDataArr] = React.useState([]);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("");
  const [filterBy, setFilterBy] = React.useState({});
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleFilter = (data, data2) => {
    const sort = JSON.parse(data2.sort);
    const filter = JSON.parse(data2.filter);
    setOrder(sort.order ? "asc" : "desc");
    setOrderBy(sort.name);
    setFilterBy(filter);
  };

  function handleChangePage(newPage) {
    setPage(newPage);
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(+event.target.value);
  }

  const getDataContracts = async () => {
    fetch_api_sg({
      key: keys.fetch,
      type: "get",
      url: `/delivery/contract`,
      onSuccess: (res) => {
        // generateTableContent(res.data);
        setDataArr(
          res.data.map((item, index) => ({
            id: item.id,
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
            group: item?.user_group?.party?.full_name,
            vendor: item?.vendor?.party?.full_name,
            status: item?.state,
            action: (
              <ButtonAction
                hoverLabel="More"
                data={"1"}
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
          }))
        );
      },
    });
  };

  React.useEffect(() => {
    getDataContracts();
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
        <Tables
          dataHeader={tableHeaderContractsNew}
          handleParams={handleFilter}
          err={false}
          loading={false}
          countData={
            searchFindMulti(
              stableSort(dataArr, getSorting(order, orderBy)),
              filterBy
            ).length
          }
          hecto={20}
          onChangePage={handleChangePage}
          onChangePerPage={handleChangeRowsPerPage}
        >
          {searchFindMulti(
            stableSort(dataArr, getSorting(order, orderBy)),
            filterBy
          )
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((item, index) => (
              <TableRow key={index.toString()}>
                <TableCell>
                  <NavLink
                    to={`/${status}/delivery-monitoring/contract/${item.id}`}
                  >
                    {item?.contract_no}
                  </NavLink>
                </TableCell>
                <TableCell>{item.po_number}</TableCell>
                <TableCell>{item.procurement_title}</TableCell>
                <TableCell>{item.po_date}</TableCell>
                <TableCell>{item.contract_date}</TableCell>
                <TableCell>{item.group}</TableCell>
                <TableCell>{item?.vendor}</TableCell>
                <TableCell>{item.status}</TableCell>
                <TableCell>{item.action}</TableCell>
              </TableRow>
            ))}
        </Tables>
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
