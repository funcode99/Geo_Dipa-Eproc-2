import { makeStyles, Paper } from "@material-ui/core";
import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import { FormattedMessage } from "react-intl";
import { TableRow, TableCell } from "@material-ui/core";
import { connect } from "react-redux";

import SVG from "react-inlinesvg";
import { NavLink } from "react-router-dom";
import { toAbsoluteUrl } from "_metronic/_helpers";
import { formatDate } from "app/libs/date";

import ButtonAction from "app/components/buttonAction/ButtonAction";
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

const tableHeaderAddendumRequest = [
  {
    name: "number",
    title: "No",
    order: { active: false, status: true, type: true },
    filter: { active: false, type: "text" },
  },
  {
    name: "addnm_req_number",
    title: "Addendum Request Number",
    order: { active: true, status: true, type: true },
    filter: { active: true, type: "text" },
  },
  {
    name: "addnm_req_date",
    title: "Addendum Request Date",
    order: { active: true, status: true, type: true },
    filter: { active: true, type: "text" },
  },
  {
    name: "contract_no",
    title: "Contract Number",
    order: { active: true, status: true, type: true },
    filter: { active: true, type: "text" },
  },
  {
    name: "po_no",
    title: "PO Number",
    order: { active: true, status: true, type: true },
    filter: { active: true, type: "text" },
  },
  {
    name: "procurement_contract_title",
    title: "Procurement Contract Title",
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
    name: "group",
    title: "User",
    order: { active: true, status: true, type: true },
    filter: { active: true, type: "text" },
  },
  {
    name: "vendor",
    title: "Vendor",
    order: { active: true, status: true, type: true },
    filter: { active: true, type: "text" },
  },
  {
    name: "addnm_req_status",
    title: "Request Addendum Status",
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

export const AddendumRequestListPage = ({
  fetch_api_sg,
  loadings,
  status,
  purch_group_id,
}) => {
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
    console.log(`datazzz`, filter, data2);
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
      url: `/adendum/add-contracts-request`,
      onSuccess: (res) => {
        console.log("hasil respon di add contracts request", res.data);
        setDataArr(
          res.data.map((item) => ({
            id: item.id,
            addnm_req_number: item?.add_request_number,
            addnm_req_date: item?.add_request_date,
            contract_no: item?.contract?.contract_no,
            po_no: item?.contract?.purch_order_no,
            proc_contract_title: item?.contract?.contract_name,
            // contract_end_date: item?,
            group: item?.contract?.user_group?.party?.full_name,
            vendor: item?.contract?.vendor?.party?.full_name,
            addnm_req_status: item?.add_status.status,
            admin_test: item?.admin_purch_group_id === purch_group_id,
            user_test: item?.user_purch_group_id === purch_group_id,

            // add_request_date
            // add_request_approval_date
            // contract.contract_date
            // contract.issued_date
            // contract.from_time
            // contract.thru_time
            // guarantee_start_end_date
            // maintenance_start_end_date
            // worked_start_end_date

            action: (
              <ButtonAction
                hoverLabel="More"
                data={"1"}
                exclude={["another"]}
                ops={[
                  // item?.admin_purch_group_id === purch_group_id
                  //   ? {
                  //       label: "CONTRACT.TABLE_ACTION.CONTRACT_DETAILS",
                  //       to: {
                  //         url: `/${status}/addendum-contract/approval/${item.id}`,
                  //         style: {
                  //           color: "black",
                  //         },
                  //       },
                  //     }
                  //   : {
                  //       label: "CONTRACT.TABLE_ACTION.DRAFTING",
                  //       type: "another",
                  //     },
                  // item?.user_purch_group_id === purch_group_id
                  //   ? {
                  //       label: "CONTRACT.TABLE_ACTION.SEE_DETAILS",
                  //       to: {
                  //         url: `/${status}/addendum-contract/approval/${item.id}`,
                  //         style: {
                  //           color: "black",
                  //         },
                  //       },
                  //     }
                  //   : {
                  //       label: "CONTRACT_DETAIL.LABEL.PO_DATE",
                  //       type: "another",
                  //     },
                  {
                    label: "CONTRACT.TABLE_ACTION.CONTRACT_DETAILS",
                    to: {
                      url: `/${status}/addendum-contract/draft-request/${item.contract_id}/${item.id}`,
                      style: {
                        color: "black",
                      },
                    },
                  },
                  ,
                  {
                    label: "CONTRACT.TABLE_ACTION.APPROVAL_REQUEST",
                    to: {
                      url: `/${status}/addendum-contract/approval/${item.contract_id}`,
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
      <Subheader text="List of Addendum Request" />

      <Paper className={classes.root}>
        <Tables
          dataHeader={tableHeaderAddendumRequest}
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
                <TableCell>{item?.addnm_req_number}</TableCell>
                <TableCell>{item?.addnm_req_date}</TableCell>
                <TableCell>{item?.contract_no}</TableCell>
                <TableCell>{item.po_no}</TableCell>
                <TableCell>{item.proc_contract_title}</TableCell>
                <TableCell></TableCell>
                <TableCell>{item?.group}</TableCell>
                <TableCell>{item?.vendor}</TableCell>
                <TableCell>{item?.addnm_req_status}</TableCell>
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
                  {/* item?.admin_test === false ||
                    item?.user_test === false && */}
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
  purch_group_id: state.auth.user.data.purch_group,
});

const mapDispatch = {
  fetch_api_sg,
};

export default connect(mapState, mapDispatch)(AddendumRequestListPage);
