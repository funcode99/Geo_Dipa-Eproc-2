import React, { useState, useRef, useEffect } from "react";
import { Formik, Field, FieldArray, Form, ErrorMessage } from "formik";
import { rupiah } from "app/libs/currency";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  makeStyles,
} from "@material-ui/core";
import GRAccord from "app/modules/DeliveryMonitoring/pages/Termin/ServiceAccGR/components/GRAccord";
import { FormattedMessage } from "react-intl";
import Item from "app/modules/AddendumContract/pages/ContractDetail/components/FormAddendum/Components/Item";
import NewClause from "../Components/Modal/NewClause";
import EditableTable from "app/modules/AddendumContract/pages/ContractDetail/components/FormAddendum/Components/EditableTable/index";
import PerubahanKlausulKontrak from "../Components/PerubahanKlausulKontrak";
import UpdateButton from "app/components/button/ButtonGlobal/UpdateButton.jsx";
import CurrencyInput from "react-currency-input-field";
import Tables from "app/components/tableCustomV1/table";
import {
  getSorting,
  searchFindMulti,
  stableSort,
} from "app/components/tables/TablePagination/TablePaginationCustom";

const JobPriceFormParameter = ({ currencies, headerData, jsonData }) => {
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
  const classes = useStyles();
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
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("");
  const [filterBy, setFilterBy] = React.useState({});
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const bodyClauseDataTemplate = {
    clause_number: "",
    before_clause_note: "",
    after_clause_note: "",
  };

  const attachmentClauseDataTemplate = {
    attachment_number: "",
    clause_note: "",
  };
  const [jobPriceBodyClauseData, setJobPriceBodyClauseData] = useState(
    bodyClauseDataTemplate
  );
  const [
    jobPriceAttachmentClauseData,
    setJobPriceAttachmentClauseData,
  ] = useState([attachmentClauseDataTemplate]);

  const openCloseAddDetail = React.useRef();
  const showAddDetail = () => {
    openCloseAddDetail.current.open();
  };
  const openCloseAddClause = React.useRef();
  const showAddClause = () => {
    openCloseAddClause.current.open();
  };

  function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
  }
  const rows = [
    createData(1, "Keterlambatan Pekerjaan", 10, 30, "%"),
    createData(2, "Keterlambatan Pekerjaan", 15, 60, "%"),
  ];

  const tableHeaderJobPrice = [
    {
      name: "number",
      title: "No",
      order: { active: false, status: true, type: true },
      filter: { active: false, type: "text" },
    },
    {
      name: "item_desc",
      title: "Deskripsi Item",
      order: { active: false, status: true, type: true },
      filter: { active: true, type: "text" },
    },
    {
      name: "qty",
      title: "QTY",
      order: { active: false, status: true, type: true },
      filter: { active: true, type: "text" },
    },
    {
      name: "uom",
      title: "Satuan",
      order: { active: false, status: true, type: true },
      filter: { active: true, type: "text" },
    },
    {
      name: "unit_price",
      title: "Harga Satuan",
      order: { active: false, status: true, type: true },
      filter: { active: true, type: "text" },
    },
    {
      name: "total_price",
      title: "Harga Total",
      order: { active: false, status: true, type: true },
      filter: { active: true, type: "text" },
    },
    {
      name: "note",
      title: "Keterangan",
      order: { active: false, status: true, type: true },
      filter: { active: true, type: "text" },
    },
  ];

  // const submitFormParameterJobPrice = (values) => {
  //   submitJobPrice(
  //     {
  //       add_contract_id: jsonData?.add_contracts[0]?.id,
  //       product_title: "",
  //       uom: "",
  //       subtotal: "",
  //       qty_total: "",
  //       clause_note: "",
  //       item_detail: [],
  //       body_clause_data: values.body_data,
  //       attachment_clause_data: values.attachment_data,
  //     },
  //     contract_id
  //   );
  // };

  let a = JSON.parse(localStorage.getItem("value_after_addendum"));

  return (
    <>
      <NewClause
        openCloseAddClause={openCloseAddClause}
        // setAttachmentClauseData={setJobPriceAttachmentClauseData}
        fromWhere={"job_price"}
        fieldType={"clause_attachment"}
      />
      <Formik
        enableReinitialize={true}
        initialValues={{
          body_data: jobPriceBodyClauseData,
          attachment_data: jobPriceAttachmentClauseData,
        }}
      >
        {({ values }) => (
          <Form>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 40,
              }}
            >
              {/* Rincian Harga Pekerjaan */}
              <div
                className="job-price-section"
                style={{
                  padding: 28,
                  borderRadius: 14,
                  border: 1,
                  borderStyle: "solid",
                  borderColor: "#8c8a8a",
                  display: "flex",
                  flexDirection: "column",
                  gap: 28,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: 28,
                    flexWrap: "wrap",
                  }}
                >
                  <label
                    style={{
                      flex: 1,
                    }}
                  >
                    <p
                      style={{
                        marginBottom: 14,
                        fontSize: 16,
                        fontWeight: 600,
                      }}
                    >
                      Nilai perjanjian kontrak awal
                    </p>
                    <div
                      style={{
                        display: "flex",
                        gap: 10,
                      }}
                    >
                      <select
                        style={{
                          borderRadius: 4,
                          padding: "10px 12px",
                        }}
                        disabled
                      >
                        {currencies?.count?.map((item) => {
                          return (
                            <option
                              selected={item.code === headerData?.currency}
                            >
                              {item.code}
                            </option>
                          );
                        })}
                      </select>
                      <CurrencyInput
                        className="form-control"
                        style={{
                          width: "100%",
                          border: 1,
                          borderStyle: "solid",
                          borderColor: "#d1d1d1",
                          backgroundColor: "#e8f4fb",
                        }}
                        placeholder="Please enter a number"
                        decimalsLimit={2}
                        decimalSeparator=","
                        groupSeparator="."
                        value={headerData?.initial_contract_value}
                        disabled
                      />
                    </div>
                  </label>

                  <label
                    style={{
                      flex: 1,
                    }}
                  >
                    <p
                      style={{
                        marginBottom: 14,
                        fontSize: 16,
                        fontWeight: 600,
                      }}
                    >
                      A. Nilai perjanjian setelah addendum
                    </p>
                    <div
                      style={{
                        display: "flex",
                        gap: 10,
                      }}
                    >
                      <select
                        style={{
                          borderRadius: 4,
                          padding: "10px 12px",
                        }}
                        disabled
                      >
                        {currencies?.count?.map((item) => {
                          return (
                            <option
                              selected={item.code === headerData?.currency}
                            >
                              {item.code}
                            </option>
                          );
                        })}
                      </select>
                      <CurrencyInput
                        className="form-control"
                        style={{
                          width: "100%",
                          border: 1,
                          borderStyle: "solid",
                          borderColor: "#d1d1d1",
                          backgroundColor: "#e8f4fb",
                        }}
                        placeholder="Please enter a number"
                        decimalsLimit={2}
                        decimalSeparator=","
                        groupSeparator="."
                        value={a}
                        disabled
                      />
                    </div>
                  </label>
                </div>

                {/* <TableContainer
                  style={{
                    padding: 10,
                  }}
                  component={Paper}
                >
                  <h1
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                    }}
                  >
                    Rincian harga pekerjaan awal
                  </h1>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableBody>
                      <TableRow>
                        <TableCell align="left">No</TableCell>
                        <TableCell align="left">Deskripsi Item</TableCell>
                        <TableCell align="left">QTY</TableCell>
                        <TableCell align="left">Satuan</TableCell>
                        <TableCell align="left">Harga Satuan</TableCell>
                        <TableCell align="left">Harga Total</TableCell>
                        <TableCell align="left">Keterangan</TableCell>
                      </TableRow>
                    </TableBody>
                    <TableBody>
                      {jsonData?.contract_items?.map((row, index) => (
                        <TableRow
                          key={row.product_name}
                          sx={{
                            "&:last-child td, &:last-child th": {
                              border: 0,
                            },
                          }}
                        >
                          <TableCell align="l">{index + 1}</TableCell>
                          <TableCell align="left">{row.product_name}</TableCell>
                          <TableCell align="left">{row.qty}</TableCell>
                          <TableCell align="left">{row.uom}</TableCell>
                          <TableCell align="left">{row.unit_price}</TableCell>
                          <TableCell align="left">{row.subtotal}</TableCell>
                          <TableCell align="left">{row.note}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer> */}

                <Paper className={classes.root}>
                  <Tables
                    dataHeader={tableHeaderJobPrice}
                    handleParams={handleFilter}
                    err={false}
                    loading={false}
                    countData={
                      searchFindMulti(
                        stableSort(
                          jsonData?.contract_items,
                          getSorting(order, orderBy)
                        ),
                        filterBy
                      ).length
                    }
                    onChangePage={handleChangePage}
                    onChangePerPage={handleChangeRowsPerPage}
                  >
                    {/* komponen table ada disini */}
                    {searchFindMulti(
                      stableSort(
                        jsonData?.contract_items,
                        getSorting(order, orderBy)
                      ),
                      filterBy
                    )
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row, index) => (
                        <TableRow key={index.toString()}>
                          <TableCell align="l">{index + 1}</TableCell>
                          <TableCell align="left">{row.product_name}</TableCell>
                          <TableCell align="left">{row.qty}</TableCell>
                          <TableCell align="left">{row.uom}</TableCell>
                          <TableCell align="left">{row.unit_price}</TableCell>
                          <TableCell align="left">{row.subtotal}</TableCell>
                          <TableCell align="left">{row.note}</TableCell>
                        </TableRow>
                      ))}
                  </Tables>
                </Paper>

                {/* <TableContainer
                  style={{
                    padding: 10,
                  }}
                  component={Paper}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <h1
                      style={{
                        fontSize: 16,
                        fontWeight: 600,
                      }}
                    >
                      Rincian harga PO-SAP
                    </h1>

                    <div>
                      <button
                        style={{
                          color: "white",
                          backgroundColor: "#ffc045",
                          borderRadius: 8,
                          border: "none",
                          padding: "8px 14px",
                        }}
                      >
                        Get PO-SAP
                      </button>
                    </div>
                  </div>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableBody>
                      <TableRow>
                        <TableCell align="left">No</TableCell>
                        <TableCell align="left">Deskripsi Item</TableCell>
                        <TableCell align="left">QTY</TableCell>
                        <TableCell align="left">Satuan</TableCell>
                        <TableCell align="left">Harga Satuan</TableCell>
                        <TableCell align="left">Harga Total</TableCell>
                        <TableCell align="left">Keterangan</TableCell>
                      </TableRow>
                    </TableBody>
                    <TableBody>
                      {rows.map((row) => (
                        <TableRow
                          key={row.name}
                          sx={{
                            "&:last-child td, &:last-child th": {
                              border: 0,
                            },
                          }}
                        >
                          <TableCell component="th">{row.name}</TableCell>
                          <TableCell align="left" scope="row">
                            {row.calories}
                          </TableCell>
                          <TableCell align="left">{row.fat}</TableCell>
                          <TableCell align="left">{row.carbs}</TableCell>
                          <TableCell align="left">{row.protein}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer> */}

                <GRAccord
                  id={"title.termtable"}
                  label={<FormattedMessage id="TITLE.ITEM_TABLE" />}
                >
                  {/* handleClick={() => handleModal("create")} */}
                  <Item />
                </GRAccord>

                <TableContainer>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <h1
                      style={{
                        fontSize: 16,
                        fontWeight: 600,
                      }}
                    >
                      B. Addendum Rincian Harga Pekerjaan
                    </h1>
                    <div
                      style={{
                        display: "flex",
                        gap: 14,
                      }}
                    >
                      <button className="btn btn-success text-white">
                        + Harga Pekerjaan By Excel
                      </button>
                      <button
                        className="btn btn-primary text-white"
                        onClick={showAddDetail}
                      >
                        + Tambah Rincian
                      </button>
                    </div>
                  </div>

                  <EditableTable
                    openCloseAddDetail={openCloseAddDetail}
                    previousData={jsonData?.contract_items}
                  />
                </TableContainer>
              </div>

              <PerubahanKlausulKontrak
                subTitle={"C"}
                title={"Harga Pekerjaan"}
                showAddClause={showAddClause}
                fromWhere={"job_price"}
                values={values}
              />
            </div>

            <UpdateButton fromWhere={"job_price"} />
          </Form>
        )}
      </Formik>
    </>
  );
};

export default JobPriceFormParameter;
