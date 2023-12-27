import { Formik, Form, Field } from "formik";
import { useDispatch, connect } from "react-redux";
import React, { useState, useEffect } from "react";
import Tables from "app/components/tableCustomV1/table";
import DialogGlobal from "app/components/modals/DialogGlobal";
import { fetch_api_sg, getLoading } from "redux/globalReducer";
import ButtonAction from "app/components/buttonAction/ButtonAction";
import UpdateButton from "app/components/button/ButtonGlobal/UpdateButton.jsx";
import { actionTypes } from "app/modules/AddendumContract/_redux/addendumContractAction";
import { submitFine } from "app/modules/AddendumContract/service/AddendumContractCrudService";
import PerubahanKlausulKontrak from "app/modules/AddendumContract/pages/ContractDetail/components/FormAddendum/Components/PerubahanKlausulKontrak";
import {
  getSorting,
  searchFindMulti,
  stableSort,
} from "app/components/tables/TablePagination/TablePaginationCustom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  makeStyles,
} from "@material-ui/core";

const Denda = ({
  jsonData,
  isDisable,
  fromWhere,
  fineCurrent,
  contract_id,
  dataNewClause,
  is_add_fine,
  dataNewClauseDrafting,
}) => {
  const dispatch = useDispatch();
  const [dataArr, setDataArr] = useState([]);
  const [dataArrFine, setDataArrFine] = useState([]);

  const getDataPenalties = async () => {
    fetch_api_sg({
      key: keys.fetch,
      type: "get",
      url: `/adendum/refference/get-all-pinalties`,
      onSuccess: (res) => {
        setDataArr(
          res.data.map((item) => ({
            id: item.id,
            name: item.pinalty_name,
          }))
        );
      },
    });
  };

  const getDataBankAccounts = async () => {
    fetch_api_sg({
      key: keys.fetch,
      type: "get",
      url: `/adendum/refference/get-party-bank/${contract_id}`,
      onSuccess: (res) => {
        setDataArrFine(
          res.data.map((item) => ({
            id: item.id,
            name: item.pinalty_name,
          }))
        );
      },
    });
  };

  useEffect(() => {
    if (fineCurrent !== null) {
      dispatch({
        type: actionTypes.SetDraftingClause,
        payload: fineCurrent?.attachment_clause_data || [
          {
            attachment_number: "",
            clause_note: "",
          },
        ],
        fieldType: "refill_attachment_clause_data",
        fromWhere: fromWhere,
      });
    }
    if (fineCurrent !== null) {
      dispatch({
        type: actionTypes.SetDraftingClause,
        payload: fineCurrent?.body_clause_data[0] || {
          clause_number: "",
          before_clause_note: "",
          after_clause_note: "",
        },
        fieldType: "refill_body_clause_data",
        fromWhere: fromWhere,
      });
    }
    getDataPenalties();
    getDataBankAccounts();
  }, []);

  useEffect(() => {
    getDataPenalties();
    getDataBankAccounts();
  }, []);

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

  const createData = (id, pinalty_name, value, max_day, value_type) => {
    return { id, pinalty_name, value, max_day, value_type };
  };

  return (
    <div className="bg-white p-10">
      <DialogGlobal
        ref={openCloseAddFine}
        isCancel={false}
        isSubmit={false}
        yesButton={false}
        noButton={false}
        maxWidth={"sm"}
      >
        <Formik
          initialValues={{
            pinalty_name: "",
            value: "",
            max_day: "",
            value_type: "",
          }}
          onSubmit={(values) => {
            setFine((data) => {
              return [
                ...data,
                createData(
                  fine.length + 1,
                  values.pinalty_name,
                  values.value,
                  values.max_day,
                  values.value_type
                ),
              ];
            });
            openCloseAddFine.current.close();
          }}
        >
          {({ values }) => (
            <>
              <Form>
                <div
                  style={{
                    padding: "0 17%",
                  }}
                >
                  <h1
                    style={{
                      marginBottom: 40,
                      fontSize: 16,
                      fontWeight: 600,
                      textAlign: "center",
                    }}
                  >
                    Tambah Denda
                  </h1>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 14,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                        }}
                      >
                        Jenis Denda nya
                      </span>
                      <Field
                        as="select"
                        name="pinalty_name"
                        style={{
                          padding: "10px 0",
                          backgroundColor: "#e8f4fb",
                          borderRadius: 4,
                        }}
                      >
                        {dataArrFine.length > 0 &&
                          dataArr.map((data) => {
                            return (
                              <>
                                <option
                                  style={{
                                    display: "none",
                                  }}
                                ></option>
                                <option
                                  key={data.id}
                                  style={{
                                    padding: "10px 12px",
                                    backgroundColor: "white",
                                    borderRadius: 4,
                                  }}
                                  value={data.name}
                                >
                                  {data.name}
                                </option>
                              </>
                            );
                          })}
                      </Field>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                        }}
                      >
                        Nilai
                      </span>
                      <Field
                        type="text"
                        name="value"
                        style={{
                          padding: 8,
                          borderRadius: 4,
                          border: 1,
                          borderStyle: "solid",
                          borderColor: "#8c8a8a",
                          opacity: 0.8,
                        }}
                      />
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                        }}
                      >
                        Maksimal Hari
                      </span>
                      <Field
                        type="text"
                        name="max_day"
                        style={{
                          padding: 8,
                          borderRadius: 4,
                          border: 1,
                          borderStyle: "solid",
                          borderColor: "#8c8a8a",
                          opacity: 0.8,
                        }}
                      />
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                        }}
                      >
                        Type Nilai
                      </span>
                      <div
                        style={{
                          display: "flex",
                          gap: 20,
                        }}
                      >
                        <label>
                          <Field type="radio" name="value_type" value="%" />%
                        </label>
                        <label>
                          <Field type="radio" name="value_type" value="nilai" />
                          Nilai
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: 52,
                    padding: "0 7%",
                  }}
                >
                  <button type="submit" className="btn btn-primary">
                    Save
                  </button>
                </div>
              </Form>
            </>
          )}
        </Formik>
      </DialogGlobal>
      <Formik
        enableReinitialize={true}
        initialValues={{
          fine_data: fine,
          body_data: dataNewClauseDrafting.fine.bodyClauseData,
          attachment_data: dataNewClauseDrafting.fine.attachmentClauseData,
        }}
        onSubmit={(values) => {
          submitFormParameterFine(values);
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
                          <TableCell align="left" scope="row">
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
              values={values}
              title={"Denda"}
              isDrafting={true}
              fromWhere={"fine"}
              isDisable={!isDisable}
              showAddClause={showAddClause}
            />

            <UpdateButton
              fromWhere={"fine"}
              isDrafting={true}
              isDisable={isDisable}
            />
          </Form>
        )}
      </Formik>
    </div>
  );
};

const keys = {
  fetch: "get-data-penalties",
};

const mapState = (state) => ({
  loadings: {
    fetch: getLoading(state, keys.fetch),
  },
  status: state.auth.user.data.status,
  dataNewClause: state.addendumContract.dataNewClause,
  dataNewClauseDrafting: state.addendumContract.dataNewClauseDrafting,
});

const mapDispatch = {
  fetch_api_sg,
};

export default connect(mapState, mapDispatch)(Denda);
