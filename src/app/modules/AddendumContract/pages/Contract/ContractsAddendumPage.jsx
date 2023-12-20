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

const tableHeaderContractsNew = [
  {
    name: "no",
    title: "No",
    order: { active: false, status: true, type: true },
    filter: { active: false, type: "text" },
  },
  {
    name: "contract_status",
    title: <FormattedMessage id="CONTRACT_DETAIL.LABEL.DOCUMENT_TYPE" />,
    order: { active: true, status: true, type: true },
    filter: { active: true, type: "text" },
  },
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
    order: { active: true, status: false },
    filter: { active: true, type: "text" },
  },

  {
    name: "contract_date",
    title: <FormattedMessage id="CONTRACT_DETAIL.LABEL.CONTRACT_DATE" />,
    order: { active: true, status: false },
    filter: { active: true, type: "text" },
  },
  {
    name: "contract_end_date",
    title: <FormattedMessage id="CONTRACT_DETAIL.LABEL.CONTRACT_END_DATE" />,
    order: { active: true, status: false },
    filter: { active: true, type: "text" },
  },
  {
    name: "group",
    title: <FormattedMessage id="CONTRACT_DETAIL.LABEL.GROUP" />,
    order: { active: true, status: false },
    filter: { active: true, type: "text" },
  },
  {
    name: "vendor",
    title: <FormattedMessage id="CONTRACT_DETAIL.LABEL.VENDOR" />,
    order: { active: true, status: false },
    filter: { active: true, type: "text" },
  },
  // {
  //   name: "status",
  //   title: <FormattedMessage id="CONTRACT_DETAIL.TABLE_HEAD.STATUS" />,
  //   order: { active: false, status: false },
  //   filter: { active: true, type: "text" },
  // },
  {
    name: "status",
    title: <FormattedMessage id="CONTRACT_DETAIL.LABEL.CONTRACT_STATUS" />,
    order: { active: true, status: false },
    filter: { active: true, type: "text" },
  },
  {
    name: "latest_status",
    title: "Latest Addendum Status",
    order: { active: true, status: false },
    filter: { active: true, type: "text" },
  },
  // kenapa action disini gak muncul ya?
  {
    name: "action",
    title: <FormattedMessage id="CONTRACT_DETAIL.TABLE_HEAD.ACTION" />,
    order: { active: false, status: false },
    // kenapa filter nya false?
    filter: { active: false, type: "text" },
  },
];

// const tableHeaderContractsVendor = [
//   {
//     name: "req_number",
//     title: "Addendum Request Number",
//     order: { active: true, status: true, type: true },
//     filter: { active: true, type: "text" },
//   },
//   {
//     name: "req_date",
//     title: "Addendum Request Date",
//     order: { active: true, status: true, type: true },
//     filter: { active: true, type: "text" },
//   },
//   {
//     name: "contract_number",
//     title: "Contract Number",
//     order: { active: true, status: true, type: true },
//     filter: { active: true, type: "text" },
//   },
//   {
//     name: "po_num",
//     title: "PO Number",
//     order: { active: true, status: true, type: true },
//     filter: { active: true, type: "text" },
//   },
//   {
//     name: "procurement_title",
//     title: "Procurement Contract Title",
//     order: { active: true, status: true, type: true },
//     filter: { active: true, type: "text" },
//   },
//   {
//     name: "end_date",
//     title: "Contract End Date",
//     order: { active: true, status: true, type: true },
//     filter: { active: true, type: "text" },
//   },
//   {
//     name: "customer",
//     title: "Customer",
//     order: { active: true, status: true, type: true },
//     filter: { active: true, type: "text" },
//   },
//   {
//     name: "provider",
//     title: "Provider",
//     order: { active: true, status: true, type: true },
//     filter: { active: true, type: "text" },
//   },
//   {
//     name: "req_status",
//     title: "Request Addendum Status",
//     order: { active: true, status: true, type: true },
//     filter: { active: true, type: "text" },
//   },
//   {
//     name: "action",
//     title: "Action",
//     order: { active: true, status: true, type: true },
//     filter: { active: false, type: "text" },
//   }
// ]

const keys = {
  fetch: "get-data-contracts",
};

export const ContractsAddendumPage = ({ fetch_api_sg, loadings, status }) => {
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

  const getDataContracts = async (page, limit) => {
    let urlName = "";

    if (typeof page === "undefined" || typeof limit === "undefined") {
      urlName = `/adendum/contract-released`;
    } else {
      urlName = `/adendum/contract-released?page=${page + 1}&limit=${limit}`;
    }

    fetch_api_sg({
      key: keys.fetch,
      type: "get",
      // url: `/adendum/contract-released?page=${page}&limit=${limit}`,
      url: urlName,
      onSuccess: (res) => {
        setDataArr(
          res.data.map((item) => ({
            id: item.id,
            contract_status: item?.contract_status,
            contract_no: item?.contract_no,
            po_number: item?.purch_order_no,
            procurement_title: item?.contract_name,
            po_date:
              item?.issued_date !== null
                ? formatDate(new Date(item?.issued_date))
                : null,
            contract_date:
              item?.from_time !== null
                ? formatDate(new Date(item?.from_time))
                : null,
            contract_end_date:
              item?.thru_time !== null
                ? formatDate(new Date(item?.thru_time))
                : null,
            group: item?.user_group?.party?.full_name,
            vendor: item?.vendor?.party?.full_name,
            status: item?.state,
            latest_status: item?.add_contracts[0]?.add_status?.status,
            action: (
              <>
                <ButtonAction
                  hoverLabel="More"
                  data={"1"}
                  ops={[
                    {
                      label: "CONTRACT.TABLE_ACTION.CONTRACT_DETAILS",
                      to: {
                        url: `/${status}/addendum-contract/contract/${item.id}`,
                        style: {
                          color: "black",
                        },
                      },
                    },
                    ...(item.add_contracts.length === 0 ||
                    item.add_contracts[0]?.add_status?.status === "Released"
                      ? [
                          {
                            label: "CONTRACT.TABLE_ACTION.ADD_ADDENDUM",
                            to: {
                              url: `/${status}/addendum-contract/add-addendum/${item.id}`,
                              style: {
                                color: "black",
                              },
                            },
                          },
                        ]
                      : []),
                  ]}
                />
              </>
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

  // const isClient = authStatus === "client";

  React.useEffect(() => {
    getDataContracts();
  }, []);

  return (
    <>
      {/* terpakai disini, ada judul & icon yang dikirim ke komponen subheader */}
      {/* komponen sudah muncul, tapi data tidak muncul */}
      <Subheader
        // text={isClient? "List of Contract & PO" : "List of Addendum Request"}
        text="List of Contract & SPK"
      />

      <Paper className={classes.root}>
        <Tables
          // header nya dari sini coeg
          // isClient ? tableHeaderContractsNew : tableHeaderContractsVendor
          func={getDataContracts}
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
          {/* komponen table ada disini */}
          {searchFindMulti(
            stableSort(dataArr, getSorting(order, orderBy)),
            filterBy
          )
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((item, index) => (
              <TableRow key={index.toString()}>
                <TableCell className="text-center">{index + 1}</TableCell>
                {/* document type */}
                <TableCell>
                  {item?.contract_status === "PO"
                    ? "Perjanjian"
                    : item?.contract_status}
                </TableCell>
                {/* contract number */}
                <TableCell>{item?.contract_no}</TableCell>
                {/* po number */}
                <TableCell>{item?.po_number}</TableCell>
                {/* procurement title */}
                <TableCell>{item?.procurement_title}</TableCell>
                {/* po date */}
                <TableCell>{item?.po_date}</TableCell>
                {/* contract date */}
                <TableCell>{item?.contract_date}</TableCell>
                {/* contract end date */}
                <TableCell>{item?.contract_end_date}</TableCell>
                <TableCell>{item?.group}</TableCell>
                <TableCell>{item?.vendor}</TableCell>
                <TableCell>{item.status}</TableCell>
                <TableCell>{item?.latest_status}</TableCell>
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
        {/* <TablePaginationCustom
            headerRows={tableHeaderContractsNew}
            rows={newContent}
            width={1500}
            loading={loadings.fetch}
          /> */}
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

export default connect(mapState, mapDispatch)(ContractsAddendumPage);
