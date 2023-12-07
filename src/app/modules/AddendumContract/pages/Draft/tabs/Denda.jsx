import React, { useState } from "react";
import { Formik, Form } from "formik";
import {
  getSorting,
  searchFindMulti,
  stableSort,
} from "app/components/tables/TablePagination/TablePaginationCustom";
import UpdateButton from "app/components/button/ButtonGlobal/UpdateButton.jsx";
import Tables from "app/components/tableCustomV1/table";
import PerubahanKlausulKontrak from "app/modules/AddendumContract/pages/ContractDetail/components/FormAddendum/Components/PerubahanKlausulKontrak";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  makeStyles,
} from "@material-ui/core";
import { submitFine } from "app/modules/AddendumContract/service/AddendumContractCrudService";
import ButtonAction from "app/components/buttonAction/ButtonAction";

const Denda = ({ fineCurrent, jsonData, contract_id, dataNewClause }) => {
  function handleChangePage(newPage) {
    setPage(newPage);
  }
  function handleChangeRowsPerPage(event) {
    setRowsPerPage(+event.target.value);
  }
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
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("");
  const [filterBy, setFilterBy] = React.useState({});
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const openCloseAddClause = React.useRef();
  const showAddClause = () => {
    openCloseAddClause.current.open();
  };
  const openCloseAddFine = React.useRef();
  const showAddFine = () => {
    openCloseAddFine.current.open();
  };
  const classes = useStyles();
  // const [fine, setFine] = useState(JSON.parse(localStorage.getItem("fine")));
  const [fine, setFine] = useState(fineCurrent?.penalty_fine_data);
  const handleFilter = (data, data2) => {
    const sort = JSON.parse(data2.sort);
    const filter = JSON.parse(data2.filter);
    setOrder(sort.order ? "asc" : "desc");
    setOrderBy(sort.name);
    setFilterBy(filter);
  };
  const submitFormParameterFine = (values) => {
    submitFine(
      {
        add_contract_id: localStorage.getItem("add_contract_id"),
        penalty_fine_data: values.fine_data,
        body_clause_data: values.body_data,
        attachment_clause_data: values.attachment_data,
      },
      contract_id
    );
  };
  const tableHeaderFine = [
    {
      name: "number",
      title: "No",
      order: { active: false, status: true, type: true },
      filter: { active: false, type: "text" },
    },
    {
      name: "item_desc",
      title: "Jenis Denda",
      order: { active: false, status: true, type: true },
      filter: { active: true, type: "text" },
    },
    {
      name: "qty",
      title: "Nilai",
      order: { active: false, status: true, type: true },
      filter: { active: true, type: "text" },
    },
    {
      name: "uom",
      title: "Maksimal Hari",
      order: { active: false, status: true, type: true },
      filter: { active: true, type: "text" },
    },
    {
      name: "unit_price",
      title: "Tipe Nilai",
      order: { active: false, status: true, type: true },
      filter: { active: true, type: "text" },
    },
  ];
  const actionButton = (id, deleteFine) => (
    <ButtonAction
      handleAction={(_, __, type) => {
        if (type === "Hapus") {
          deleteFine(id);
        }
      }}
      style={{
        backgroundColor: "#e8f4fb",
      }}
      hoverLabel="More"
      data={"1"}
      ops={[
        {
          label: "Hapus",
        },
      ]}
    />
  );
  const deleteFine = (id) => {
    setFine(() => {
      return fine.filter((data) => {
        return data.id !== id;
      });
    });
  };

  return (
    <div className="bg-white p-10">
      <Formik
        enableReinitialize={true}
        initialValues={{
          fine_data: fine,
          body_data: dataNewClause.fine.bodyClauseData,
          attachment_data: dataNewClause.fine.attachmentClauseData,
        }}
        onSubmit={(values) => {
          submitFormParameterFine(values);
          console.log("isi submit", values);
        }}
      >
        {({ values }) => (
          <Form>
            <div
              style={{
                padding: 28,
                borderRadius: 14,
                border: 1,
                borderStyle: "solid",
                borderColor: "#8c8a8a",
                display: "flex",
                flexDirection: "column",
                marginBottom: 40,
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 34.5,
                }}
              >
                <TableContainer
                  style={{
                    padding: 10,
                  }}
                  component={Paper}
                >
                  <h1
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      color: "#2e1f22",
                    }}
                  >
                    Denda Kontrak Awal
                  </h1>
                  <Paper className={classes.root}>
                    <Tables
                      dataHeader={tableHeaderFine}
                      handleParams={handleFilter}
                      err={false}
                      loading={false}
                      countData={
                        searchFindMulti(
                          stableSort(
                            jsonData?.penalty_fine_data,
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
                          jsonData?.penalty_fine_data,
                          getSorting(order, orderBy)
                        ),
                        filterBy
                      )
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        ?.map((data, index) => (
                          <TableRow key={index.toString()}>
                            <TableCell component="th">{index + 1}</TableCell>
                            <TableCell align="left" scope="row">
                              {data.pinalty_name}
                            </TableCell>
                            <TableCell align="left">{data.value}</TableCell>
                            <TableCell align="left">{data.max_day}</TableCell>
                            <TableCell align="left">
                              {data.type === "1" ? "%" : "Nilai"}
                            </TableCell>
                          </TableRow>
                        ))}
                    </Tables>
                  </Paper>
                </TableContainer>

                <TableContainer
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
                      // marginTop: 34,
                      // marginBottom: 20
                    }}
                  >
                    <h1
                      style={{
                        fontSize: 16,
                        fontWeight: 600,
                        color: "#2e1f22",
                      }}
                    >
                      A. Addendum Denda Pekerjaan
                    </h1>
                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{
                        maxHeight: 40,
                      }}
                      onClick={showAddFine}
                    >
                      Denda
                    </button>
                  </div>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableBody>
                      <TableRow>
                        <TableCell align="left">No</TableCell>
                        <TableCell align="left">Jenis Denda</TableCell>
                        <TableCell align="left">Nilai</TableCell>
                        <TableCell align="left">Maksimal Hari</TableCell>
                        <TableCell align="left">Tipe Nilai</TableCell>
                      </TableRow>
                    </TableBody>
                    <TableBody>
                      {fine?.map((row, index) => (
                        <TableRow
                          key={row.name}
                          sx={{
                            "&:last-child td, &:last-child th": {
                              border: 0,
                            },
                          }}
                        >
                          <TableCell component="th">{index + 1}</TableCell>
                          {/* <TableCell align="left" scope="row">
                                    {row.pinalty_name}
                                  </TableCell>
                                  <TableCell align="left">
                                    {row.value}
                                  </TableCell>
                                  <TableCell align="left">
                                    {row.max_day}
                                  </TableCell>
                                  <TableCell align="left">
                                    {row.value_type}
                                  </TableCell> */}
                          <TableCell align="left" scope="row">
                            {/* {row.pinalty_name} */}
                            {row.jenis_denda}
                          </TableCell>
                          <TableCell align="left">{row.nilai}</TableCell>
                          <TableCell align="left">{row.max_day}</TableCell>
                          <TableCell align="left">
                            {row.type_nilai === "1" ? "%" : "Nilai"}
                          </TableCell>
                          <TableCell align="left">
                            {actionButton(row.id, deleteFine)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </div>

            <PerubahanKlausulKontrak
              subTitle={"B"}
              title={"Denda"}
              fromWhere={"fine"}
              showAddClause={showAddClause}
              values={values}
            />

            <UpdateButton fromWhere={"fine"} />
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Denda;
