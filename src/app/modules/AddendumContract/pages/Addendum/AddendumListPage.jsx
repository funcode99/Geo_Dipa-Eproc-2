import { makeStyles, Paper } from "@material-ui/core"
import React from "react"
import { shallowEqual, useSelector } from "react-redux";
import SVG from "react-inlinesvg"
import { FormattedMessage } from "react-intl"
import { TableRow, TableCell } from "@material-ui/core"
import { NavLink } from "react-router-dom"
import { connect } from "react-redux"
import { toAbsoluteUrl } from "_metronic/_helpers"

import ButtonAction from "app/components/buttonAction/ButtonAction"
import { formatDate } from "app/libs/date"
import Subheader from "app/components/subheader"
import Tables from "app/components/tableCustomV1/table"
import {
  getSorting,
  searchFindMulti,
  stableSort,
} from "app/components/tables/TablePagination/TablePaginationCustom"
import { 
  fetch_api_sg, 
  getLoading 
} from "redux/globalReducer"

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
  }))
  
  const tableHeaderContractsNew = [
    {
      name: "document_type",
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
      name: "contract_end_date",
      title: <FormattedMessage id="CONTRACT_DETAIL.LABEL.CONTRACT_END_DATE" />,
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
    // {
    //   name: "status",
    //   title: <FormattedMessage id="CONTRACT_DETAIL.TABLE_HEAD.STATUS" />,
    //   order: { active: false, status: false },
    //   filter: { active: true, type: "text" },
    // },
    {
      name: "status",
      title: <FormattedMessage id="CONTRACT_DETAIL.LABEL.CONTRACT_STATUS" />,
      order: { active: false, status: false },
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
  ]

  const tableHeaderAddendum = [
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
      name: "end_date",
      title: "Contract End Date",
      order: { active: true, status: true, type: true },
      filter: { active: true, type: "text" },
    },
    {
      name: "customer",
      title: "Customer",
      order: { active: true, status: true, type: true },
      filter: { active: true, type: "text" },
    },
    {
      name: "provider",
      title: "Provider",
      order: { active: true, status: true, type: true },
      filter: { active: true, type: "text" },
    },
    {
      name: "req_status",
      title: "Request Addendum Status",
      order: { active: true, status: true, type: true },
      filter: { active: true, type: "text" },
    },
    {
      name: "action", 
      title: "Action",
      order: { active: true, status: true, type: true },
      filter: { active: false, type: "text" },
    }
  ]
  
  const keys = {
    fetch: "get-data-contracts",
  }
  
  export const AddendumListPage = ({ fetch_api_sg, loadings, status }) => {
    const classes = useStyles()
    const [dataArr, setDataArr] = React.useState([])
    const [order, setOrder] = React.useState("asc")
    const [orderBy, setOrderBy] = React.useState("")
    const [filterBy, setFilterBy] = React.useState({})
    const [newContent, setNewContent] = React.useState([])
    const [page, setPage] = React.useState(0)
    const [rowsPerPage, setRowsPerPage] = React.useState(10)
  
    const generateTableContent = (data) => {
      setNewContent(dataArr);
    }
  
    const handleFilter = (data, data2) => {
      const sort = JSON.parse(data2.sort)
      const filter = JSON.parse(data2.filter)
      setOrder(sort.order ? "asc" : "desc")
      setOrderBy(sort.name)
      setFilterBy(filter)
      console.log(`datazzz`, filter, data2)
    }
  
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
          console.log('apakah menarik data', res)
          // console.log(`res.data`, res.data);
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
                  // handleAction={console.log(null)}
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
    }

    let authStatus = useSelector(
      (state) => state.auth.user.data.status,
      shallowEqual
    );

    const isClient = authStatus === "client"
  
    React.useEffect(() => {
      getDataContracts();
    }, [])
  
    return (
      <>

        {/* terpakai disini, ada judul & icon yang dikirim ke komponen subheader */}
        {/* komponen sudah muncul, tapi data tidak muncul */}
        <Subheader
          text="List of Addendum"
        />
  
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
                  <TableCell className="text-center">
                    {index}
                  </TableCell>
                  <TableCell>
                      {item?.contract_no}
                  </TableCell>
                  <TableCell>{item.po_number}</TableCell>
                  <TableCell>{item.procurement_title}</TableCell>
                  <TableCell>{item.po_date}</TableCell>
                  <TableCell>{item.contract_date}</TableCell>
                  <TableCell>{item.group}</TableCell>
                  <TableCell>{item?.vendor}</TableCell>
                  <TableCell>{item.status}</TableCell>
                  <TableCell
                    style={{
                      position: 'sticky',
                      right: 0,
                      background: 'white',
                      display: 'flex',
                      justifyContent: 'center',
                      minHeight: 65
                    }}
                  >{item.action}</TableCell>
                </TableRow>
              ))}
          </Tables>
        </Paper>
  
      </>
    )
  }
  
  const mapState = (state) => ({
    loadings: {
      fetch: getLoading(state, keys.fetch),
    },
    status: state.auth.user.data.status,
  })
  
  const mapDispatch = {
    fetch_api_sg,
  }
  
  export default connect(mapState, mapDispatch)(AddendumListPage)