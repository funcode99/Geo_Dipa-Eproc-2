import { makeStyles, Paper } from "@material-ui/core";
import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import SVG from "react-inlinesvg";
import { FormattedMessage } from "react-intl";
import { TableRow, TableCell } from "@material-ui/core";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { toAbsoluteUrl } from "_metronic/_helpers";

import ButtonAction from "app/components/buttonAction/ButtonAction";
import { formatDate } from "app/libs/date";
import Subheader from "app/components/subheader";
import Tables from "app/components/tableCustomV1/table";
import {
  getSorting,
  searchFindMulti,
  stableSort,
} from "app/components/tables/TablePagination/TablePaginationCustom";
import { fetch_api_sg, getLoading } from "redux/globalReducer";

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

const tableHeaderAddendum = [
  {
    name: "number",
    title: "No",
    order: { active: false, status: true, type: true },
    filter: { active: false, type: "text" },
  },
  {
    name: "req_number",
    title: "Addendum Document Number",
    order: { active: true, status: true, type: true },
    filter: { active: true, type: "text" },
  },
  {
    name: "req_date",
    title: "Addendum Request Date",
    order: { active: true, status: true, type: true },
    filter: { active: true, type: "text" },
  },
  {
    name: "adnm_type",
    title: "Addendum Type",
    order: { active: true, status: true, type: true },
    filter: { active: true, type: "text" },
  },
  {
    name: "contract_number",
    title: "Contract Number",
    order: { active: true, status: true, type: true },
    filter: { active: true, type: "text" },
  },
  {
    name: "po_num",
    title: "PO Number",
    order: { active: true, status: true, type: true },
    filter: { active: true, type: "text" },
  },
  {
    name: "procurement_title",
    title: "Procurement Contract Title",
    order: { active: true, status: true, type: true },
    filter: { active: true, type: "text" },
  },
  {
    name: "po_date",
    title: "PO Date",
    order: { active: true, status: true, type: true },
    filter: { active: true, type: "text" },
  },
  {
    name: "start_date",
    title: "Contract Start Date",
    order: { active: true, status: true, type: true },
    filter: { active: true, type: "text" },
  },
  {
    name: "end_date",
    title: "Contract End Date",
    order: { active: true, status: true, type: true },
    filter: { active: true, type: "text" },
  },
  {
    name: "customer",
    title: "User Group",
    order: { active: true, status: true, type: true },
    filter: { active: true, type: "text" },
  },
  {
    name: "provider",
    title: "Vendor",
    order: { active: true, status: true, type: true },
    filter: { active: true, type: "text" },
  },
  {
    name: "req_status",
    title: "Status",
    order: { active: true, status: true, type: true },
    filter: { active: true, type: "text" },
  },
  {
    name: "action",
    title: "Action",
    order: { active: true, status: true, type: true },
    filter: { active: false, type: "text" },
  },
];

const keys = {
  fetch: "get-data-contracts",
};

export const AddendumListPage = ({ fetch_api_sg, loadings, status }) => {
  const classes = useStyles();
  const [dataArr, setDataArr] = React.useState([]);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("");
  const [filterBy, setFilterBy] = React.useState({});
  const [newContent, setNewContent] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const generateTableContent = (data) => {
    setNewContent(dataArr);
  };

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
      url: `/adendum/add-contracts`,
      onSuccess: (res) => {
        // generateTableContent(res.data);
        setDataArr(
          res.data.map((item, index) => ({
            id: item.id,
            doc_number: item?.add_doc_number,
            adnm_request_date: item?.add_request_date,
            adnm_type: item?.doc_type,
            contract_no: item?.contract.contract_no,
            po_number: item?.contract.purch_order.number,
            procurement_title: item?.contract.contract_name,
            // po_date belom ada, harus nya dari issued
            po_date:
              item?.contract.issued_date !== null
                ? formatDate(new Date(item?.contract.issued_date))
                : null,
            contract_start_date:
              item?.contract.from_time !== null
                ? formatDate(new Date(item?.contract.from_time))
                : null,
            contract_end_date:
              item?.contract.thru_time !== null
                ? formatDate(new Date(item?.contract.thru_time))
                : null,
            // group: item?.user_group?.party?.full_name,
            // vendor: item?.vendor?.party?.full_name,
            group: item?.contract?.user_group?.party?.full_name,
            vendor: item?.contract?.vendor?.party?.full_name,
            // status: item?.state,
            status: item?.add_status?.status,
            action: (
              <ButtonAction
                hoverLabel="More"
                data={"1"}
                ops={[
                  {
                    // contract details ada disini
                    label: "CONTRACT.TABLE_ACTION.SEE_DETAILS",
                    to: {
                      url: `/${status}/addendum-contract/draft/${item.id}`,
                      style: {
                        color: "black",
                      },
                    },
                  },
                  // {
                  //   // mari kita tambahkan addendum disini
                  //   label: "CONTRACT.TABLE_ACTION.DRAFTING",
                  //   to: {
                  //     url: `/${status}/addendum-contract/draft/${item.id}`,
                  //     style: {
                  //       color: "black",
                  //     },
                  //   },
                  // },
                ]}
              />
            ),
          }))
        );
      },
    });
  };

  let authStatus = useSelector(
    (state) => state.auth.user.data.status,
    shallowEqual
  );

  const isClient = authStatus === "client";

  React.useEffect(() => {
    getDataContracts();
  }, []);

  return (
    <>
      {/* terpakai disini, ada judul & icon yang dikirim ke komponen subheader */}
      {/* komponen sudah muncul, tapi data tidak muncul */}
      <Subheader text="List of Addendum" />

      <Paper className={classes.root}>
        <Tables
          isAddendum={true}
          dataHeader={tableHeaderAddendum}
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
          {/* komponen table ada disini */}
          {searchFindMulti(
            stableSort(dataArr, getSorting(order, orderBy)),
            filterBy
          )
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((item, index) => (
              <TableRow key={index.toString()}>
                <TableCell className="text-center">{index + 1}</TableCell>
                <TableCell>{item?.doc_number}</TableCell>
                <TableCell>{item?.adnm_request_date}</TableCell>
                <TableCell>{item?.adnm_type}</TableCell>
                <TableCell>{item?.contract_no}</TableCell>
                <TableCell>{item?.po_number}</TableCell>
                <TableCell>{item?.procurement_title}</TableCell>
                <TableCell>{item?.po_date}</TableCell>
                <TableCell>{item?.contract_start_date}</TableCell>
                <TableCell>{item?.contract_end_date}</TableCell>
                <TableCell>{item?.group}</TableCell>
                <TableCell>{item?.vendor}</TableCell>
                <TableCell>{item?.status}</TableCell>
                <TableCell
                  style={{
                    position: "sticky",
                    right: 0,
                    background: "white",
                    display: "flex",
                    justifyContent: "center",
                    minHeight: 65,
                  }}
                >
                  {item.action}
                </TableCell>
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

export default connect(mapState, mapDispatch)(AddendumListPage);
