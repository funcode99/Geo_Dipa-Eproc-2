import React, { useState, useRef } from "react";
import { Card, CardBody } from "_metronic/_partials/controls";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "_metronic/_helpers/index";
import UpdateButton from "app/components/button/ButtonGlobal/UpdateButton";

import ButtonAction from "app/components/buttonAction/ButtonAction";
import DialogGlobal from "app/components/modals/DialogGlobal";

import { useParams } from "react-router-dom";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from "@material-ui/core";

import { ReactSelect } from "percobaan/ReactSelect";

import { fetch_api_sg, getLoading } from "redux/globalReducer";
import { connect } from "react-redux";

import { useCollapse } from "react-collapsed";
import { makeStyles } from "@material-ui/core/styles";
import Input from "@material-ui/core/Input";
import IconButton from "@material-ui/core/IconButton";
import DoneIcon from "@material-ui/icons/DoneAllTwoTone";
import RevertIcon from "@material-ui/icons/NotInterestedOutlined";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";

import {
  submitParties,
  submitJobPrice,
  submitTimePeriod,
  submitPaymentMethod,
  submitFine,
  submitGuarantee,
  submitAccountNumber,
} from "app/modules/AddendumContract/service/DeliveryMonitoringCrud";

const CustomTableCell = ({ row, name, onChange }) => {
  const classes = useStyles();
  const { isEditMode } = row;

  return (
    <TableCell align="left" className={classes.tableCell}>
      {isEditMode ? (
        <Input
          value={row[name]}
          name={name}
          onChange={(e) => onChange(e, row)}
          className={classes.input}
        />
      ) : (
        row[name]
      )}
    </TableCell>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(3),
    overflowX: "auto",
  },
  table: {
    minWidth: 650,
  },
  selectTableCell: {
    width: 60,
  },
  tableCell: {
    width: 130,
    height: 40,
  },
  input: {
    width: 130,
    height: 40,
  },
  content: {
    display: "table-row",
    width: "100%",
  },
}));

const createNewData = (
  item_desc,
  qty,
  unit,
  unit_price,
  total_price,
  information
) => ({
  id: item_desc.replace(" ", "_"),
  item_desc,
  qty,
  unit,
  unit_price,
  total_price,
  information,
  isEditMode: false,
  children: [],
});

const createNewPlaceman = (
  name,
  fullname,
  position,
  address,
  phone_number,
  fax
) => ({
  name,
  fullname,
  position,
  address,
  phone_number,
  fax,
});

const createNewPaymentStage = (description, percentage) => ({
  description,
  percentage,
});

const CollapsibleRow = ({
  classes,
  index,
  onAddMode,
  onAddChildMode,
  onChange,
  onChangeChild,
  onDeleteMode,
  onDeleteChildMode,
  onRevert,
  onRevertChild,
  onToggleEditMode,
  onToggleEditChildMode,
  row,
}) => {
  const { getCollapseProps, getToggleProps, isExpanded } = useCollapse();

  return (
    <>
      {/* parent table */}
      <TableRow>
        <TableCell className={classes.tableCell}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {`${index + 1}`}
            {/* it work like a charm! */}
            {row.children.length > 0 && (
              <button {...getToggleProps()}>
                {isExpanded ? (
                  <KeyboardArrowUpIcon />
                ) : (
                  <KeyboardArrowDownIcon />
                )}
              </button>
            )}
          </div>
        </TableCell>
        <CustomTableCell {...{ row, name: "item_desc", onChange }} />
        <CustomTableCell {...{ row, name: "qty", onChange }} />
        <CustomTableCell {...{ row, name: "unit", onChange }} />
        <CustomTableCell {...{ row, name: "unit_price", onChange }} />
        <CustomTableCell {...{ row, name: "total_price", onChange }} />
        <CustomTableCell {...{ row, name: "information", onChange }} />
        {row.isEditMode ? (
          <TableCell>
            <IconButton
              aria-label="done"
              onClick={() => onToggleEditMode(row.id)}
            >
              <DoneIcon />
            </IconButton>
            <IconButton aria-label="revert" onClick={() => onRevert(row.id)}>
              <RevertIcon />
            </IconButton>
          </TableCell>
        ) : (
          <TableCell>
            <ButtonAction
              handleAction={(a, b, c) => {
                if (c === "Hapus") {
                  onDeleteMode(row.id);
                } else if (c === "Edit") {
                  onToggleEditMode(row.id);
                } else if (c === "Tambah") {
                  onAddMode();
                } else if (c === "Tambah Sub Item") {
                  onAddChildMode(row.id, index);
                }
              }}
              ops={[
                {
                  label: "Edit",
                },
                {
                  label: "Hapus",
                },
                // {
                //   label: "Tambah",
                // },
                {
                  label: "Tambah Sub Item",
                },
              ]}
            ></ButtonAction>
          </TableCell>
        )}
      </TableRow>

      {/* children table */}
      {row?.children &&
        row.children.map((data, childIndex) => (
          <TableRow key={index} {...getCollapseProps()}>
            <TableCell>
              <div></div>
            </TableCell>
            <TableCell align="left" className={classes.tableCell}>
              {data.isEditMode ? (
                <Input
                  value={data.item_desc}
                  name={"item_desc"}
                  onChange={(e) => onChangeChild(e, data, index, childIndex)}
                  className={classes.input}
                />
              ) : (
                data.item_desc
              )}
            </TableCell>
            <TableCell align="left" className={classes.tableCell}>
              {data.isEditMode ? (
                <Input
                  value={data.calories}
                  name={"calories"}
                  onChange={(e) => onChangeChild(e, data, index, childIndex)}
                  className={classes.input}
                />
              ) : (
                data.calories
              )}
            </TableCell>
            <TableCell align="left" className={classes.tableCell}>
              {data.isEditMode ? (
                <Input
                  value={data.fat}
                  name={"fat"}
                  onChange={(e) => onChangeChild(e, data, index, childIndex)}
                  className={classes.input}
                />
              ) : (
                data.fat
              )}
            </TableCell>
            <TableCell align="left" className={classes.tableCell}>
              {data.isEditMode ? (
                <Input
                  value={data.carbs}
                  name={"carbs"}
                  onChange={(e) => onChangeChild(e, data, index, childIndex)}
                  className={classes.input}
                />
              ) : (
                data.carbs
              )}
            </TableCell>
            <TableCell align="left" className={classes.tableCell}>
              {data.isEditMode ? (
                <Input
                  value={data.protein}
                  name={"protein"}
                  onChange={(e) => onChangeChild(e, data, index, childIndex)}
                  className={classes.input}
                />
              ) : (
                data.protein
              )}
            </TableCell>

            {/* error karena data nya gak sampai kesini dulu */}

            {data.isEditMode ? (
              <TableCell>
                <IconButton
                  aria-label="done-child"
                  onClick={() => onToggleEditChildMode(data.id, index)}
                >
                  <DoneIcon />
                </IconButton>
                <IconButton
                  aria-label="revert-child"
                  onClick={() => onRevertChild(data.id, index)}
                >
                  <RevertIcon />
                </IconButton>
              </TableCell>
            ) : (
              <TableCell>
                <ButtonAction
                  handleAction={(a, b, c) => {
                    if (c === "Hapus") {
                      onDeleteChildMode(data.id, index);
                    } else if (c === "Edit") {
                      onToggleEditChildMode(data.id, index);
                    }
                  }}
                  ops={[
                    {
                      label: "Edit",
                    },
                    {
                      label: "Hapus",
                    },
                  ]}
                ></ButtonAction>
              </TableCell>
            )}
          </TableRow>
        ))}
    </>
  );
};

function EditableTable({ openCloseAddDetail }) {
  const [rows, setRows] = React.useState([
    createNewData(
      "TX-76543 -- 001 ABCDEFFGH",
      10,
      "EA",
      "100.000.000",
      "1.000.000.000",
      "Tidak Ada"
    ),
    createNewData(
      "TX-76543 -- 002 ABCDEFFGH",
      10,
      "EA",
      "100.000.000",
      "1.000.000.000",
      "Tidak Ada"
    ),
    createNewData(
      "TX-76543 -- 003 ABCDEFFGH",
      10,
      "EA",
      "100.000.000",
      "1.000.000.000",
      "Tidak Ada"
    ),
  ]);
  const [previous, setPrevious] = React.useState({});
  const classes = useStyles();

  const onToggleEditMode = (id) => {
    setRows((state) => {
      // isi state nya semua baris objek di dalam array tsb
      console.log("isi state onToggleEditMode", state);
      return rows.map((row) => {
        if (row.id === id) {
          return { ...row, isEditMode: !row.isEditMode };
        }
        return row;
      });
    });
  };

  const onDeleteMode = (id) => {
    setRows(() => {
      return rows.filter((row) => {
        return row.id !== id;
      });
    });
  };

  const onChange = (e, row) => {
    if (!previous[row.id]) {
      setPrevious((state) => ({ ...state, [row.id]: row }));
    }
    const value = e.target.value;
    const name = e.target.name;
    const { id } = row;
    const newRows = rows.map((row) => {
      if (row.id === id) {
        return { ...row, [name]: value };
      }
      return row;
    });
    setRows(newRows);
  };

  const onRevert = (id) => {
    const newRows = rows.map((row) => {
      if (row.id === id) {
        return previous[id] ? previous[id] : row;
      }
      return row;
    });
    // console.log('isi previous', previous[id])
    // console.log('isi new rows', newRows)
    setRows(newRows);
    setPrevious((state) => {
      delete state[id];
      return state;
    });
    onToggleEditMode(id);
  };

  const onAddMode = (a, b, c, d, e, f) => {
    setRows((state) => [...state, createNewData(a, b, c, d, e, f)]);
  };

  const onToggleEditChildMode = (id, index) => {
    setRows((prev) => {
      const newState = prev;
      const changedData = rows[index].children.map((row) => {
        if (row.id === id) {
          return { ...row, isEditMode: !row.isEditMode };
        }
        return row;
      });
      newState[index].children = changedData;
      return [...newState];
    });
  };

  const onDeleteChildMode = (childId, index) => {
    // akhirnya bisa juga ngentiaw
    setRows((prev) => {
      const newState = prev;
      const items = rows[index].children.filter(
        (variant) => variant.id !== childId
      );
      console.log("setelah filter", items);
      newState[index].children = items;
      return [...newState];
    });
  };

  const onChangeChild = (e, row, parentIndex, childIndex) => {
    console.log("isi row di onchangechild", row);

    if (!previous[row.id]) {
      setPrevious((state) => ({ ...state, [row.id]: row }));
    }

    const value = e.target.value;
    const name = e.target.name;
    const { id } = row;
    const newRows = rows[parentIndex].children.map((item) => {
      return { ...row, [name]: value };
    });

    console.log("isi new rows", newRows);

    setRows((prev) => {
      const newState = prev;
      newState[parentIndex].children = newRows;
      return [...newState];
    });
  };

  const onAddChildMode = (parentId, index) => {
    let result = rows.map((row) => {
      if (row.id === parentId) {
        if (row.children) {
          return {
            ...row,
            children: [
              ...row.children,
              createNewData("Pudding", 591, 9.1, 60, 7.2),
            ],
          };
        } else {
          return {
            ...row,
            children: [createData("Pudding", 591, 9.1, 60, 7.2)],
          };
        }
      }
      // wajib ada, kalo gak ada bakal error
      return row;
    });
    setRows(result);
  };

  const onRevertChild = (id, index) => {
    // const newRows = rows[index].children.map(row => {
    //     if (row.id === id) {
    //       return previous[id] ? previous[id] : row;
    //     }
    //     return row;
    //   })
    //   setRows(newRows);
    //   setPrevious(state => {
    //     delete state[index].children[id];
    //     return state[index];
    //   })

    onToggleEditChildMode(id, index);
  };

  return (
    <>
      {/* modal tambah rincian harga pekerjaan */}
      <DialogGlobal
        ref={openCloseAddDetail}
        isCancel={false}
        isSubmit={false}
        yesButton={false}
        noButton={false}
        maxWidth={"sm"}
      >
        <Formik
          initialValues={{
            item_desc: "",
            quantity: "",
            uom: "",
            unit_price: "",
            total_price: "",
            note: "",
          }}
          onSubmit={(values) => {
            onAddMode(
              values?.item_desc,
              values?.qty,
              values?.uom,
              values?.unit_price,
              values?.total_price,
              values?.note
            );
          }}
        >
          {() => (
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
                    Tambah Rincian Harga Pekerjaan
                  </h1>
                </div>

                {/* form flex */}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    padding: "0 12px",
                    columnGap: "72px",
                    rowGap: "14px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 14,
                      flex: 1,
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
                        Deskripsi Item
                      </span>
                      <Field
                        type="text"
                        name="item_desc"
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
                        QTY
                      </span>
                      <Field
                        type="text"
                        name="quantity"
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
                        Satuan
                      </span>
                      <Field
                        type="text"
                        name="uom"
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
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 14,
                      flex: 1,
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
                        Harga Satuan
                      </span>

                      <Field
                        type="text"
                        name="unit_price"
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
                        Harga Total
                      </span>
                      <Field
                        type="text"
                        name="total_price"
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
                        Keterangan
                      </span>
                      <Field
                        type="text"
                        name="note"
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
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: 52,
                    padding: "0 12px",
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
      <Paper className={classes.root}>
        <Table className={classes.table} aria-label="caption table">
          {/* Table Header */}
          <TableBody>
            <TableRow>
              <TableCell size="small">No.</TableCell>
              <TableCell align="left">Deskripsi Item</TableCell>
              <TableCell align="left">QTY</TableCell>
              <TableCell align="left">Satuan</TableCell>
              <TableCell align="left">Harga Satuan</TableCell>
              <TableCell align="left">Harga Total</TableCell>
              <TableCell align="left">Keterangan</TableCell>
              <TableCell align="left">Aksi</TableCell>
            </TableRow>
          </TableBody>

          <TableBody>
            {rows.map((row, index) =>
              row.children ? (
                <>
                  <CollapsibleRow
                    row={row}
                    index={index}
                    classes={classes}
                    onAddMode={onAddMode}
                    onAddChildMode={onAddChildMode}
                    onChange={onChange}
                    onChangeChild={onChangeChild}
                    onDeleteMode={onDeleteMode}
                    onDeleteChildMode={onDeleteChildMode}
                    onRevert={onRevert}
                    onRevertChild={onRevertChild}
                    onToggleEditChildMode={onToggleEditChildMode}
                    onToggleEditMode={onToggleEditMode}
                  />
                </>
              ) : (
                <>
                  {/* selalu masuk kesini */}
                  <TableRow key={row.id}>
                    <CustomTableCell {...{ row, name: "name", onChange }} />
                    <CustomTableCell {...{ row, name: "calories", onChange }} />
                    <CustomTableCell {...{ row, name: "fat", onChange }} />
                    <CustomTableCell {...{ row, name: "carbs", onChange }} />
                    <CustomTableCell {...{ row, name: "protein", onChange }} />
                    <TableCell className={classes.selectTableCell}>
                      {row.isEditMode ? (
                        <>
                          <IconButton
                            aria-label="done"
                            onClick={() => onToggleEditMode(row.id)}
                          >
                            <DoneIcon />
                          </IconButton>
                          <IconButton
                            aria-label="revert"
                            onClick={() => onRevert(row.id)}
                          >
                            <RevertIcon />
                          </IconButton>
                        </>
                      ) : (
                        <ButtonAction
                          handleAction={(a, b, c) => {
                            if (c === "Hapus") {
                              onDeleteMode(row.id);
                            } else if (c === "Edit") {
                              onToggleEditMode(row.id);
                            }
                            // else if (c === "Tambah") {
                            //   onAddMode();
                            // }
                            else if (c === "Tambah Sub Item") {
                              onAddChildMode(row.id, index);
                            }
                          }}
                          ops={[
                            {
                              label: "Edit",
                            },
                            {
                              label: "Hapus",
                            },
                            {
                              label: "Tambah",
                            },
                            {
                              label: "Tambah Sub Item",
                            },
                          ]}
                        ></ButtonAction>
                      )}
                    </TableCell>
                  </TableRow>
                </>
              )
            )}
          </TableBody>
        </Table>
      </Paper>
    </>
  );
}

const timePeriodBeforeAddendum = [
  {
    title: "Jangka Waktu Perjanjian",
    startDate: "2023-09-29",
    endDate: "2023-09-30",
    totalMonth: 6,
    calendarDay: 15,
    radio: "SKPP",
    prefix: "contract",
  },
  {
    title: "Jangka Waktu Pelaksanaan Pekerjaan",
    startDate: "2023-09-29",
    endDate: "2023-09-30",
    totalMonth: 6,
    calendarDay: 15,
    radio: "SPMK",
    prefix: "worked",
  },
  {
    title: "Jangka Waktu Masa Garansi",
    startDate: "2023-09-29",
    endDate: "2023-09-30",
    totalMonth: 6,
    calendarDay: 15,
    prefix: "guarantee",
  },
  {
    title: "Jangka Waktu Masa Pemeliharaan",
    startDate: "2023-09-29",
    endDate: "2023-09-30",
    totalMonth: 6,
    calendarDay: 15,
    prefix: "maintenance",
  },
];

const guaranteeBeforeAddendum = [
  {
    title: "Jaminan Uang Muka",
    startDate: "2023-09-19",
    endDate: "2023-10-29",
    filename: "bla_blah.pdf",
    radio: "yes",
    nameTitle: "dp_guarantee",
    nameStart: "dp_guarantee_start_date",
    nameEnd: "dp_guarantee_end_date",
    nameEvidence: "dp_guarantee_evidence_file",
  },
  {
    title: "Jaminan Pelaksanaan",
    startDate: "2023-09-19",
    endDate: "2023-10-29",
    filename: "secret.docx",
    radio: "no",
    nameTitle: "implementation_guarantee",
    nameStart: "implementation_guarantee_start_date",
    nameEnd: "implementation_guarantee_end_date",
    nameEvidence: "implementation_guarantee_evidence_file",
  },
  {
    title: "Jaminan Pemeliharaan",
    startDate: "2023-09-19",
    endDate: "2023-10-29",
    filename: "another_file.xlsx",
    radio: "yes",
    nameTitle: "maintenance_guarantee",
    nameStart: "maintenance_guarantee_start_date",
    nameEnd: "maintenance_guarantee_end_date",
    nameEvidence: "maintenance_guarantee_evidence_file",
  },
];

const actionButton = (
  <ButtonAction
    style={{
      backgroundColor: "#e8f4fb",
    }}
    hoverLabel="More"
    data={"1"}
    ops={[
      {
        label: "Edit",
      },
      {
        label: "Hapus",
      },
    ]}
  />
);

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData(1, "Keterlambatan Pekerjaan", 10, 30, "%"),
  createData(2, "Keterlambatan Pekerjaan", 15, 60, "%"),
];

const FormParameter = ({
  currentActiveTab,
  fetch_api_sg,
  jsonData,
  authorizedOfficial,
  jobDirector,
  jobSupervisor,
}) => {
  console.log("isi auth official", authorizedOfficial);
  console.log("isi direksi pekerjaan", jobDirector);
  console.log("isi pengawas pekerjaan", jobSupervisor);
  console.log("isi jsonData", jsonData);

  const [bankIndex, setBankIndex] = useState(0);
  const [authorizedOfficialIndex, setauthorizedOfficialIndex] = useState(0);
  const [jobDirectorIndex, setJobDirectorIndex] = useState(0);
  const [jobSupervisorIndex, setJobSupervisorIndex] = useState(0);
  const changeDataBankIndex = (num) => {
    setBankIndex(num);
  };
  const changeDataauthorizedOfficial = (num) => {
    setauthorizedOfficialIndex(num);
  };
  const changeDataJobDirector = (num) => {
    setJobDirectorIndex(num);
  };
  const changeDataJobSupervisor = (num) => {
    setJobSupervisorIndex(num);
  };

  const submitFormParameterContractParties = (values) => {
    submitParties(
      {
        add_contract_id: jsonData?.add_contracts[0]?.id,
        party_1_autorized_username: values?.official_username,
        party_1_autorized_name: values?.official_name,
        party_1_autorized_position: values?.official_position,
        party_1_autorized_address: values?.official_address,
        party_1_autorized_telp: values?.official_phone,
        party_1_autorized_fax: values?.official_fax,
        party_1_autorized_sk_no: values?.official_assignment_no,
        party_1_autorized_sk_date: values?.official_assignment_date,
        party_1_autorized_notary_act_name: values?.official_notary,
        party_1_autorized_notary_act_no: values?.official_deed_no,
        party_1_autorized_notary_act_date: values?.official_deed_date,
        party_1_autorized_kemenkumham_no: values?.official_sk_kemenkumham_no,
        party_1_autorized_kemenkumham_date:
          values?.official_sk_kemenkumham_date,
        party_1_job_director: values?.jobDirector,
        party_1_job_supervisor: values?.jobSupervisor,
        body_clause_data: [],
        attachment_clause_data: [],
      },
      contract_id
    );
  };

  const submitFormParameterJobPrice = () => {
    submitJobPrice(
      {
        add_contract_id: jsonData?.add_contracts[0]?.id,
        product_title: "",
        uom: "",
        subtotal: "",
        qty_total: "",
        clause_note: "",
        item_detail: [],
        body_clause_data: [],
        attachment_clause_data: [],
      },
      contract_id
    );
  };

  const submitFormParameterTimePeriod = (values) => {
    submitTimePeriod(
      {
        add_contract_id: jsonData?.add_contracts[0]?.id,
        from_time: values?.contract_start_date,
        thru_time: values?.contract_end_date,
        worked_start_date: values?.worked_start_date,
        worked_end_date: values?.worked_end_date,
        guarantee_start_date: values?.guarantee_start_date,
        guarantee_end_date: values?.guarantee_end_date,
        maintenance_start_date: values?.maintenance_start_date,
        maintenance_end_date: values?.maintenance_end_date,
        add_contract_periode_range_month: "6",
        add_contract_periode_range_day: "123",
        add_work_implement_period_month: "6",
        add_work_implement_period_day: "123",
        add_guarantee_period_month: "6",
        add_guarantee_period_day: "123",
        add_maintenance_period_month: "6",
        add_maintenance_period_day: "123",
        skpp_no: "",
        skpp_date: "",
        spmk_no: "",
        spmk_date: "",
        body_clause_data: [],
        attachment_clause_data: [],
      },
      contract_id
    );
  };

  const submitFormParameterPaymentMethod = (values) => {
    submitPaymentMethod(
      {
        add_contract_id: jsonData?.add_contracts[0]?.id,
        payment_method_name: values.payment_method,
        payment_method_data: values.payment_data,
        // payment_method_data: {
        //   payment_name: "2984029834",
        //   percentage_value: 10,
        //   description: "ini deskripsi",
        //   // body_clause_data: [],
        //   // attachment_clause_data: [],
        // },
      },
      contract_id
    );
  };

  const submitFormParameterFine = (values) => {
    submitFine(
      {
        add_contract_id: jsonData?.add_contracts[0]?.id,
        penalty_fine_data: values.fine_data,
        // body_clause_data: [],
        // attachment_clause_data: [],
      },
      contract_id
    );
  };

  const submitFormParameterGuarantee = (values) => {
    submitGuarantee(
      {
        add_contract_id: jsonData?.add_contracts[0]?.id,
        down_payment_guarantee: values.dp_guarantee,
        down_payment_guarantee_start_date: values.dp_guarantee_start_date,
        down_payment_guarantee_end_date: values.dp_guarantee_end_date,
        down_payment_guarantee_evidence_file: values.dp_guarantee_evidence_file,
        implementation_guarantee: values.implementation_guarantee,
        implementation_guarantee_start_date:
          values.implementation_guarantee_start_date,
        implementation_guarantee_end_date:
          values.implementation_guarantee_end_date,
        implementation_guarantee_evidence_file:
          values.implementation_guarantee_evidence_file,
        maintenance_guarantee: values.maintenance_guarantee,
        maintenance_guarantee_start_date:
          values.maintenance_guarantee_start_date,
        maintenance_guarantee_end_date: values.maintenance_guarantee_end_date,
        maintenance_guarantee_evidence_file:
          values.maintenance_guarantee_evidence_file,
        // body_clause_data: [],
        // attachment_clause_data: [],
      },
      contract_id
    );
  };

  const submitFormParameterAccountNumber = () => {
    submitAccountNumber(
      {
        add_contract_id: jsonData?.add_contracts[0]?.id,
        data_bank: [
          {
            bank: {
              id: "55f154b2-5f38-4cd6-899a-95c135643e16",
              code: "7",
              full_name: "BRI",
            },
            address: {
              postal_address: "Jl. Sultan Hasanudin No. 62 Jakarta Selatan",
            },
            currency: {
              id: "75bcc84d-7ed5-4bd9-8a07-1b064fef1ff0",
              code: "IDR",
              name: "Rupiah",
            },
            branch_name: null,
            account_number: "0193-01-001287-30-7",
            account_holder_name: "Koperasi Pekerja PT Geo Dipa Energi",
          },
        ],
        body_clause_data: [],
        attachment_clause_data: [],
      },
      contract_id
    );
  };

  const [addendumRows, setAddendumRows] = useState([
    createData(1, "Keterlambatan Pekerjaan", 10, 30, "%"),
  ]);
  // console.log('tab yang aktif sekarang', currentActiveTab)
  console.log("isi jsonData", jsonData);

  const [dataArr, setDataArr] = useState([]);
  const [dataArrFine, setDataArrFine] = useState([]);
  const [currencies, setDataCurrencies] = useState([]);
  const { contract_id } = useParams();
  const [placeman, setPlaceman] = useState({
    workDirector: [],
    workSupervisor: [],
  });
  const [stagePayment, setStagePayment] = useState([]);
  const [fine, setFine] = useState([]);
  const [accountNumber, setAccountNumber] = useState([]);

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

  const getCurrencies = async () => {
    fetch_api_sg({
      key: keys.fetch,
      type: "get",
      url: `/adendum/currencies`,
      onSuccess: (res) => {
        console.log("response currencies", res);
        setDataCurrencies(
          // res.data.map((item) => ({
          //   id: item.id,
          //   code: item.code,
          //   name: item.name,
          // }))
          res
        );
      },
    });
  };

  React.useEffect(() => {
    getDataPenalties();
    getDataBankAccounts();
    getCurrencies();
  }, []);

  React.useEffect(() => {
    console.log("isi dataArr", dataArr);
    console.log("isi currencies", currencies);
  }, [dataArr, currencies]);

  const [addendumPaymentMethod, setAddendumPaymentMethod] = useState("full");

  const openCloseAddFine = React.useRef();
  const showAddFine = () => {
    openCloseAddFine.current.open();
  };

  const openCloseAddDetail = React.useRef();
  const showAddDetail = () => {
    openCloseAddDetail.current.open();
  };

  const openCloseAddPayment = React.useRef();
  const showAddPayment = () => {
    openCloseAddPayment.current.open();
  };

  const openCloseWorkSupervisor = React.useRef();
  const showAddWorkSupervisor = () => {
    openCloseWorkSupervisor.current.open();
  };

  const openCloseWorkDirector = React.useRef();
  const showAddWorkDirector = () => {
    openCloseWorkDirector.current.open();
  };

  return (
    <>
      {/* modal tambah supervisor pekerjaan */}
      <DialogGlobal
        ref={openCloseWorkSupervisor}
        isCancel={false}
        onYes={() => {
          setPlaceman((placeman) => {
            return {
              ...placeman,
              workSupervisor: [
                ...placeman.workSupervisor,
                createNewPlaceman(
                  "",
                  "",
                  "EA",
                  "100.000.000",
                  "500.000.000",
                  "Tidak Ada"
                ),
              ],
            };
          });
        }}
      >
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
            Tambah Pengawas Pekerjaan
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
              <span>Jabatan</span>
              <input
                style={{
                  padding: 8,
                  borderRadius: 4,
                  border: 1,
                  borderStyle: "solid",
                  borderColor: "#8c8a8a",
                  opacity: 0.8,
                }}
                value={""}
              />
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <span>Alamat</span>
              {/* <input
                style={{
                  padding: 8,
                  borderRadius: 4,
                  border: 1,
                  borderStyle: "solid",
                  borderColor: "#8c8a8a",
                  opacity: 0.8,
                }}
              /> */}
              <ReactSelect
                data={jobSupervisor}
                func={changeDataJobSupervisor}
                labelName={"facility_name"}
              />
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <span>Telp</span>
              <input
                style={{
                  padding: 8,
                  borderRadius: 4,
                  border: 1,
                  borderStyle: "solid",
                  borderColor: "#8c8a8a",
                  opacity: 0.8,
                }}
                value={
                  jobSupervisor
                    ? jobSupervisor[jobSupervisorIndex]?.phone
                    : null
                }
              />
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <span>Fax</span>
              <input
                style={{
                  padding: 8,
                  borderRadius: 4,
                  border: 1,
                  borderStyle: "solid",
                  borderColor: "#8c8a8a",
                  opacity: 0.8,
                }}
                value={
                  jobSupervisor ? jobSupervisor[jobSupervisorIndex]?.fax : null
                }
              />
            </div>
          </div>
        </div>
      </DialogGlobal>

      {/* modal tambah direksi pekerjaan */}
      <DialogGlobal
        ref={openCloseWorkDirector}
        isCancel={false}
        onYes={() => {
          setPlaceman((placeman) => {
            console.log(jobDirectorIndex);

            return {
              ...placeman,
              workDirector: [
                ...placeman.workDirector,
                createNewPlaceman(
                  jobDirector ? jobDirector[jobDirectorIndex]?.username : null,
                  jobDirector ? jobDirector[jobDirectorIndex]?.full_name : null,
                  jobDirector
                    ? jobDirector[jobDirectorIndex]?.position_name
                    : null,
                  authorizedOfficial
                    ? authorizedOfficial[authorizedOfficialIndex]?.address
                    : null,
                  authorizedOfficial
                    ? authorizedOfficial[authorizedOfficialIndex]?.phone
                    : null,
                  authorizedOfficial
                    ? authorizedOfficial[authorizedOfficialIndex]?.fax
                    : null
                ),
              ],
            };
          });
        }}
      >
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
            Tambah Direksi Pekerjaan
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
              <span>Username</span>
              {/* <input
                style={{
                  padding: 8,
                  borderRadius: 4,
                  border: 1,
                  borderStyle: "solid",
                  borderColor: "#8c8a8a",
                  opacity: 0.8,
                }}
                value={"10%"}
              /> */}
              <ReactSelect
                data={jobDirector}
                func={changeDataJobDirector}
                labelName={`username`}
              />
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <span>Nama Lengkap</span>
              <input
                style={{
                  padding: 8,
                  borderRadius: 4,
                  border: 1,
                  borderStyle: "solid",
                  borderColor: "#8c8a8a",
                  opacity: 0.8,
                }}
                value={
                  jobDirector ? jobDirector[jobDirectorIndex]?.full_name : null
                }
                disabled
              />
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <span>Jabatan</span>
              <input
                style={{
                  padding: 8,
                  borderRadius: 4,
                  border: 1,
                  borderStyle: "solid",
                  borderColor: "#8c8a8a",
                  opacity: 0.8,
                }}
                value={
                  jobDirector
                    ? jobDirector[jobDirectorIndex]?.position_name
                    : null
                }
                disabled
              />
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <span>Alamat</span>
              <input
                style={{
                  padding: 8,
                  borderRadius: 4,
                  border: 1,
                  borderStyle: "solid",
                  borderColor: "#8c8a8a",
                  opacity: 0.8,
                }}
                value={
                  authorizedOfficial
                    ? authorizedOfficial[authorizedOfficialIndex]?.address
                    : null
                }
                disabled
                // kalo ada value nya jadi statis, gabisa diisi apa2
                // value={""}
              />
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <span>Telp</span>
              <input
                style={{
                  padding: 8,
                  borderRadius: 4,
                  border: 1,
                  borderStyle: "solid",
                  borderColor: "#8c8a8a",
                  opacity: 0.8,
                }}
                value={
                  authorizedOfficial
                    ? authorizedOfficial[authorizedOfficialIndex]?.phone
                    : null
                }
                disabled
              />
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <span>Fax</span>
              <input
                style={{
                  padding: 8,
                  borderRadius: 4,
                  border: 1,
                  borderStyle: "solid",
                  borderColor: "#8c8a8a",
                  opacity: 0.8,
                }}
                value={
                  authorizedOfficial
                    ? authorizedOfficial[authorizedOfficialIndex]?.fax
                    : null
                }
                disabled
              />
            </div>
          </div>
        </div>
      </DialogGlobal>

      {/* modal tambah denda */}
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
            fine_type: "",
            value: "",
            max_day: "",
            value_type: "",
          }}
          onSubmit={(values) => {
            setAddendumRows((data) => {
              return [
                ...data,
                createData(
                  1,
                  values.fine_type,
                  values.value,
                  values.max_day,
                  values.value_type
                ),
              ];
            });
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
                        Jenis Denda
                      </span>
                      <Field
                        as="select"
                        name="fine_type"
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

      {/* modal tambah pembayaran */}
      <DialogGlobal
        ref={openCloseAddPayment}
        isCancel={false}
        isSubmit={false}
        yesButton={false}
        noButton={false}
      >
        <Formik
          initialValues={{
            percentage: "",
            description: "",
          }}
          onSubmit={(values) => {
            setStagePayment((data) => {
              return [
                ...data,
                createNewPaymentStage(values.description, values.percentage),
              ];
            });
            openCloseAddPayment.current.close();
          }}
        >
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
                Tambah pembayaran bertahap
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
                  <span>Persentase</span>
                  <Field
                    style={{
                      padding: 8,
                      borderRadius: 4,
                      border: 1,
                      borderStyle: "solid",
                      borderColor: "#8c8a8a",
                      opacity: 0.8,
                    }}
                    name="percentage"
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  <span>Deskripsi</span>
                  <Field
                    style={{
                      padding: 8,
                      borderRadius: 4,
                      border: 1,
                      borderStyle: "solid",
                      borderColor: "#8c8a8a",
                      opacity: 0.8,
                    }}
                    name="description"
                  />
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
        </Formik>
      </DialogGlobal>

      <Card>
        <CardBody>
          {/* Para Pihak */}
          {currentActiveTab === 0 && (
            <>
              <Formik
                enableReinitialize={true}
                initialValues={{
                  official_username: authorizedOfficial
                    ? authorizedOfficial[authorizedOfficialIndex]
                        ?.authorized_official_username
                    : null,
                  official_name: authorizedOfficial
                    ? authorizedOfficial[authorizedOfficialIndex]
                        ?.authorized_official_name
                    : null,
                  official_position: authorizedOfficial
                    ? authorizedOfficial[authorizedOfficialIndex]
                        ?.authorized_official_position
                    : null,
                  official_address: authorizedOfficial
                    ? authorizedOfficial[authorizedOfficialIndex]?.address
                    : null,
                  official_phone: authorizedOfficial
                    ? authorizedOfficial[authorizedOfficialIndex]?.phone
                    : null,
                  official_fax: authorizedOfficial
                    ? authorizedOfficial[authorizedOfficialIndex]?.fax
                    : null,
                  official_assignment_no: authorizedOfficial
                    ? authorizedOfficial[authorizedOfficialIndex]
                        ?.assignment_deed_no
                    : null,
                  official_assignment_date: authorizedOfficial
                    ? authorizedOfficial[authorizedOfficialIndex]
                        ?.assignment_deed_date
                    : null,
                  official_notary: authorizedOfficial
                    ? authorizedOfficial[authorizedOfficialIndex]
                        ?.name_notary_deed_of_authorized_official
                    : null,
                  official_deed_no: authorizedOfficial
                    ? authorizedOfficial[authorizedOfficialIndex]
                        ?.authorized_official_deed_no
                    : null,
                  official_deed_date: authorizedOfficial
                    ? authorizedOfficial[authorizedOfficialIndex]
                        ?.authorized_official_deed_date
                    : null,
                  official_sk_kemenkumham_no: authorizedOfficial
                    ? authorizedOfficial[authorizedOfficialIndex]
                        ?.authorized_official_sk_kemenkumham_no
                    : null,
                  official_sk_kemenkumham_date: authorizedOfficial
                    ? authorizedOfficial[authorizedOfficialIndex]
                        ?.authorized_official_sk_kemenkumham_date
                    : null,
                  jobDirector: placeman.workDirector,
                  jobSupervisor: placeman.workSupervisor,
                }}
                onSubmit={(values) => {
                  submitFormParameterContractParties(values);
                }}
              >
                {() => (
                  <Form>
                    {/* Pihak 1 + 2 */}
                    <div
                      className="parties-wrapper"
                      style={{
                        border: 1,
                        borderStyle: "solid",
                        borderColor: "black",
                        borderRadius: 14,
                        padding: "28px 15.5px",
                        marginBottom: 40,
                      }}
                    >
                      {/* Header pihak pertama */}
                      <div
                        style={{
                          backgroundColor: "#cdcdcd",
                          display: "inline-block",
                          padding: 8,
                          borderRadius: 6,
                          marginBottom: 14,
                          marginLeft: 12.5,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 14,
                            fontWeight: 500,
                            color: "#2e1f22",
                          }}
                        >
                          A. Pihak Pertama
                        </span>
                      </div>

                      {/* Baris pihak pertama */}
                      <div className="row col-md-12">
                        {/* Pihak pertama */}
                        <div
                          className="col-md-6"
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 28,
                          }}
                        >
                          {/* Pejabat Berwenang */}
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 14,
                            }}
                          >
                            <h1
                              style={{
                                fontSize: "16px",
                              }}
                            >
                              Pejabat berwenang
                            </h1>
                            <div>
                              <label
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  rowGap: 4,
                                  height: 65.5,
                                }}
                              >
                                <span>Username</span>
                                <input
                                  type="text"
                                  className="form-control"
                                  style={{ backgroundColor: "#e8f4fb" }}
                                  value={`${jsonData?.contract_party?.party_1_contract_signature_username}`}
                                />
                              </label>
                            </div>
                            <div>
                              <label
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  rowGap: 4,
                                }}
                              >
                                <span>Nama</span>
                                <input
                                  type="text"
                                  value={`${jsonData?.contract_party?.party_1_contract_signature_name}`}
                                  className="form-control"
                                  style={{ backgroundColor: "#e8f4fb" }}
                                />
                              </label>
                            </div>
                            <div>
                              <label
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  rowGap: 4,
                                }}
                              >
                                <span>Jabatan</span>
                                <input
                                  type="text"
                                  value={`${jsonData?.contract_party?.party_1_position_of_autorize}`}
                                  className="form-control"
                                  style={{ backgroundColor: "#e8f4fb" }}
                                />
                              </label>
                            </div>
                            <div>
                              <label
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  rowGap: 4,
                                }}
                              >
                                <span>Alamat</span>
                                <input
                                  className="form-control"
                                  type="text"
                                  value={`${jsonData?.authority?.address}`}
                                  style={{ backgroundColor: "#e8f4fb" }}
                                />
                              </label>
                            </div>
                            <div>
                              <label
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  rowGap: 4,
                                }}
                              >
                                <span>Telp</span>
                                <input
                                  className="form-control"
                                  type="text"
                                  style={{ backgroundColor: "#e8f4fb" }}
                                  value={`${jsonData?.authority?.phone}`}
                                />
                              </label>
                            </div>
                            <div>
                              <label
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  rowGap: 4,
                                }}
                              >
                                <span>FAX</span>
                                <input
                                  className="form-control"
                                  type="text"
                                  value={`${jsonData?.authority?.fax}`}
                                  style={{ backgroundColor: "#e8f4fb" }}
                                />
                              </label>
                            </div>
                            <div>
                              <label
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  rowGap: 4,
                                }}
                              >
                                <span>Nomor SK Penugasan</span>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    columnGap: 8,
                                  }}
                                >
                                  <input
                                    type="text"
                                    value={`${jsonData?.contract_party?.party_1_sk_no}`}
                                    className="form-control"
                                    style={{
                                      backgroundColor: "#e8f4fb",
                                    }}
                                  />
                                  -
                                  <input
                                    type="date"
                                    value={`${jsonData?.contract_party?.party_1_sk_date}`}
                                    className="form-control"
                                    style={{
                                      backgroundColor: "#e8f4fb",
                                    }}
                                  />
                                </div>
                              </label>
                            </div>
                            <div>
                              <label
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  rowGap: 4,
                                }}
                              >
                                <span>Nama Notaris</span>
                                <input
                                  type="text"
                                  value={`${jsonData?.contract_party?.party_1_notary_act_autorized_name}`}
                                  className="form-control"
                                  style={{ backgroundColor: "#e8f4fb" }}
                                />
                              </label>
                            </div>
                            <div>
                              <label
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  rowGap: 4,
                                }}
                              >
                                <span>Nomor Akta</span>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    columnGap: 8,
                                  }}
                                >
                                  <input
                                    type="text"
                                    value={`${jsonData?.contract_party?.party_1_notary_act_autorized_no}`}
                                    className="form-control"
                                    style={{
                                      backgroundColor: "#e8f4fb",
                                    }}
                                  />
                                  -
                                  <input
                                    type="date"
                                    value={`${jsonData?.contract_party?.party_1_notary_act_autorized_no}`}
                                    className="form-control"
                                    style={{
                                      backgroundColor: "#e8f4fb",
                                    }}
                                  />
                                </div>
                              </label>
                            </div>
                            <div>
                              <label
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  rowGap: 4,
                                }}
                              >
                                <span>Nomor SK Kemenkumham</span>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    columnGap: 8,
                                  }}
                                >
                                  <input
                                    type="text"
                                    value={`${jsonData?.contract_party?.party_1_autorized_kemenkumham_no}`}
                                    className="form-control"
                                    style={{
                                      backgroundColor: "#e8f4fb",
                                    }}
                                  />
                                  -
                                  <input
                                    type="date"
                                    value={`${jsonData?.contract_party?.party_1_autorized_kemenkumham_no}`}
                                    className="form-control"
                                    style={{
                                      backgroundColor: "#e8f4fb",
                                    }}
                                  />
                                </div>
                              </label>
                            </div>
                          </div>

                          {/* Direksi Pekerjaan */}
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 14,
                            }}
                          >
                            <div
                              style={{
                                height: 44.89,
                              }}
                            >
                              <h1
                                style={{
                                  fontSize: "16px",
                                  minHeight: 38.17,
                                }}
                              >
                                Direksi pekerjaan
                              </h1>
                            </div>

                            <div>
                              <label
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  rowGap: 4,
                                  height: 65.5,
                                }}
                              >
                                <span>Username</span>
                                <input
                                  type="text"
                                  value={`${jsonData?.contract_party?.party_1_director_position_username}`}
                                  className="form-control"
                                  style={{ backgroundColor: "#e8f4fb" }}
                                />
                              </label>
                            </div>

                            <div>
                              <label
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  rowGap: 4,
                                }}
                              >
                                <span>Nama Lengkap</span>
                                <input
                                  type="text"
                                  value={`${jsonData?.contract_party?.party_1_director_position_full_name}`}
                                  className="form-control"
                                  style={{ backgroundColor: "#e8f4fb" }}
                                />
                              </label>
                            </div>

                            <div>
                              <label
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  rowGap: 4,
                                }}
                              >
                                <span>Jabatan</span>
                                <input
                                  type="text"
                                  value={`${jsonData?.contract_party?.party_1_director_position}`}
                                  className="form-control"
                                  style={{ backgroundColor: "#e8f4fb" }}
                                />
                              </label>
                            </div>

                            <div>
                              <label
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  rowGap: 4,
                                }}
                              >
                                <span>Alamat</span>
                                <input
                                  type="text"
                                  value={`${jsonData?.contract_party?.party_1_director_position_address}`}
                                  className="form-control"
                                  style={{ backgroundColor: "#e8f4fb" }}
                                />
                              </label>
                            </div>

                            <div>
                              <label
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  rowGap: 4,
                                }}
                              >
                                <span>Telp</span>
                                <input
                                  type="text"
                                  value={`${jsonData?.contract_party?.party_1_director_position_phone}`}
                                  className="form-control"
                                  style={{ backgroundColor: "#e8f4fb" }}
                                />
                              </label>
                            </div>

                            <div>
                              <label
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  rowGap: 4,
                                }}
                              >
                                <span>FAX</span>
                                <input
                                  type="text"
                                  value={`${jsonData?.contract_party?.party_1_director_position_fax}`}
                                  className="form-control"
                                  style={{ backgroundColor: "#e8f4fb" }}
                                />
                              </label>
                            </div>
                          </div>

                          {/* Pengawas Pekerjaan */}
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 14,
                            }}
                          >
                            <div
                              style={{
                                height: 44.89,
                              }}
                            >
                              <h1
                                style={{
                                  fontSize: "16px",
                                }}
                              >
                                Pengawas pekerjaan
                              </h1>
                            </div>

                            <div>
                              <label
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  rowGap: 4,
                                }}
                              >
                                <span>Jabatan</span>
                                <input
                                  type="text"
                                  value={`${jsonData?.contract_party?.party_1_job_supervisor.name}`}
                                  className="form-control"
                                  style={{ backgroundColor: "#e8f4fb" }}
                                />
                              </label>
                            </div>

                            <div>
                              <label
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  rowGap: 4,
                                }}
                              >
                                <span>Alamat</span>
                                <input
                                  type="text"
                                  value={`${jsonData?.contract_party?.party_1_job_supervisor.address}`}
                                  className="form-control"
                                  style={{ backgroundColor: "#e8f4fb" }}
                                />
                              </label>
                            </div>

                            <div>
                              <label
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  rowGap: 4,
                                }}
                              >
                                <span>Telp</span>
                                <input
                                  type="text"
                                  value={`${jsonData?.contract_party?.party_1_job_supervisor.telp}`}
                                  className="form-control"
                                  style={{ backgroundColor: "#e8f4fb" }}
                                />
                              </label>
                            </div>

                            <div>
                              <label
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  rowGap: 4,
                                }}
                              >
                                <span>FAX</span>
                                <input
                                  type="text"
                                  value={`${jsonData?.contract_party?.party_1_job_supervisor.fax}`}
                                  className="form-control"
                                  style={{ backgroundColor: "#e8f4fb" }}
                                />
                              </label>
                            </div>
                          </div>
                        </div>

                        {/* Addendum pihak pertama */}
                        <div
                          className="col-md-6"
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 28,
                          }}
                        >
                          {/* Pejabat Berwenang */}
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 14,
                            }}
                          >
                            <h1
                              style={{
                                fontSize: "16px",
                              }}
                            >
                              Addendum Pejabat berwenang
                            </h1>

                            <div>
                              <label
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  rowGap: 4,
                                }}
                              >
                                <span>Username</span>
                                <ReactSelect
                                  data={authorizedOfficial}
                                  func={changeDataauthorizedOfficial}
                                  labelName={`authorized_official_username`}
                                />
                              </label>
                            </div>

                            <div>
                              <label
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  rowGap: 4,
                                }}
                              >
                                <span>Nama</span>
                                <Field
                                  className="form-control"
                                  style={{
                                    backgroundColor: "#e8f4fb",
                                  }}
                                  value={
                                    authorizedOfficial
                                      ? authorizedOfficial[
                                          authorizedOfficialIndex
                                        ]?.authorized_official_name
                                      : null
                                  }
                                  disabled
                                />
                              </label>
                            </div>

                            <div>
                              <label
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  rowGap: 4,
                                }}
                              >
                                <span>Jabatan</span>
                                <input
                                  type="text"
                                  value={
                                    authorizedOfficial
                                      ? authorizedOfficial[
                                          authorizedOfficialIndex
                                        ]?.authorized_official_position
                                      : null
                                  }
                                  className="form-control"
                                  style={{ backgroundColor: "#e8f4fb" }}
                                  disabled
                                />
                              </label>
                            </div>

                            <div>
                              <label
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  rowGap: 4,
                                }}
                              >
                                <span>Alamat</span>
                                <input
                                  className="form-control"
                                  type="text"
                                  value={
                                    authorizedOfficial
                                      ? authorizedOfficial[
                                          authorizedOfficialIndex
                                        ]?.address
                                      : null
                                  }
                                  style={{ backgroundColor: "#e8f4fb" }}
                                  disabled
                                />
                              </label>
                            </div>

                            <div>
                              <label
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  rowGap: 4,
                                }}
                              >
                                <span>Telp</span>
                                <input
                                  className="form-control"
                                  type="text"
                                  value={
                                    authorizedOfficial
                                      ? authorizedOfficial[
                                          authorizedOfficialIndex
                                        ]?.phone
                                      : null
                                  }
                                  style={{ backgroundColor: "#e8f4fb" }}
                                  disabled
                                />
                              </label>
                            </div>

                            <div>
                              <label
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  rowGap: 4,
                                }}
                              >
                                <span>FAX</span>
                                <input
                                  className="form-control"
                                  type="text"
                                  value={
                                    authorizedOfficial
                                      ? authorizedOfficial[
                                          authorizedOfficialIndex
                                        ]?.fax
                                      : null
                                  }
                                  style={{ backgroundColor: "#e8f4fb" }}
                                  disabled
                                />
                              </label>
                            </div>

                            <div>
                              <label
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  rowGap: 4,
                                }}
                              >
                                <span>Nomor SK Penugasan</span>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    columnGap: 8,
                                  }}
                                >
                                  <input
                                    type="text"
                                    value={
                                      authorizedOfficial
                                        ? authorizedOfficial[
                                            authorizedOfficialIndex
                                          ]?.assignment_deed_no
                                        : null
                                    }
                                    className="form-control"
                                    style={{
                                      backgroundColor: "#e8f4fb",
                                    }}
                                    disabled
                                  />
                                  -
                                  <input
                                    type="date"
                                    value={
                                      authorizedOfficial
                                        ? authorizedOfficial[
                                            authorizedOfficialIndex
                                          ]?.assignment_deed_date
                                        : null
                                    }
                                    className="form-control"
                                    style={{
                                      backgroundColor: "#e8f4fb",
                                    }}
                                    disabled
                                  />
                                </div>
                              </label>
                            </div>

                            <div>
                              <label
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  rowGap: 4,
                                }}
                              >
                                <span>Nama Notaris</span>
                                <input
                                  type="text"
                                  value={
                                    authorizedOfficial
                                      ? authorizedOfficial[
                                          authorizedOfficialIndex
                                        ]
                                          ?.name_notary_deed_of_authorized_official
                                      : null
                                  }
                                  className="form-control"
                                  style={{ backgroundColor: "#e8f4fb" }}
                                  disabled
                                />
                              </label>
                            </div>

                            <div>
                              <label
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  rowGap: 4,
                                }}
                              >
                                <span>Nomor Akta</span>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    columnGap: 8,
                                  }}
                                >
                                  <input
                                    type="text"
                                    value={
                                      authorizedOfficial
                                        ? authorizedOfficial[
                                            authorizedOfficialIndex
                                          ]?.authorized_official_deed_no
                                        : null
                                    }
                                    className="form-control"
                                    style={{
                                      backgroundColor: "#e8f4fb",
                                    }}
                                    disabled
                                  />
                                  -
                                  <input
                                    type="date"
                                    value={
                                      authorizedOfficial
                                        ? authorizedOfficial[
                                            authorizedOfficialIndex
                                          ]?.authorized_official_deed_date
                                        : null
                                    }
                                    className="form-control"
                                    style={{
                                      backgroundColor: "#e8f4fb",
                                    }}
                                    disabled
                                  />
                                </div>
                              </label>
                            </div>

                            <div>
                              <label
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  rowGap: 4,
                                }}
                              >
                                <span>Nomor SK Kemenkumham</span>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    columnGap: 8,
                                  }}
                                >
                                  <input
                                    type="text"
                                    value={
                                      authorizedOfficial
                                        ? authorizedOfficial[
                                            authorizedOfficialIndex
                                          ]
                                            ?.authorized_official_sk_kemenkumham_no
                                        : null
                                    }
                                    className="form-control"
                                    style={{
                                      backgroundColor: "#e8f4fb",
                                    }}
                                    disabled
                                  />
                                  -
                                  <input
                                    type="date"
                                    value={
                                      authorizedOfficial
                                        ? authorizedOfficial[
                                            authorizedOfficialIndex
                                          ]
                                            ?.authorized_official_sk_kemenkumham_date
                                        : null
                                    }
                                    className="form-control"
                                    style={{
                                      backgroundColor: "#e8f4fb",
                                    }}
                                    disabled
                                  />
                                </div>
                              </label>
                            </div>
                          </div>

                          {/* Direksi Pekerjaan */}
                          {/* addendum direksi pekerjaan 1 */}
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
                                justifyContent: "space-between",
                                // height: 38.17,
                                // 3.61 + 44.89
                                height: 48.5,
                              }}
                            >
                              <h1
                                style={{
                                  fontSize: "16px",
                                }}
                              >
                                Addendum Direksi pekerjaan
                              </h1>

                              <button
                                type="button"
                                className="btn btn-primary mx-1"
                                onClick={showAddWorkDirector}
                              >
                                Tambah
                              </button>
                              {/* {index === 0 && (
                                              )} */}
                            </div>
                            {placeman.workDirector &&
                              placeman.workDirector.map((data, index) => {
                                return (
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                      gap: 14,
                                    }}
                                  >
                                    <div>
                                      <label
                                        style={{
                                          display: "flex",
                                          flexDirection: "column",
                                          rowGap: 4,
                                        }}
                                      >
                                        <span>Username</span>
                                        {/* {index === 0 ? (
                                                    <ReactSelect
                                                      data={jobDirector}
                                                      func={changeDataJobDirector}
                                                      labelName={`username`}
                                                    />
                                                  ) : (
                                                    <input
                                                      type="text"
                                                      value={data.name}
                                                      className="form-control"
                                                      style={{ backgroundColor: "#e8f4fb" }}
                                                    />
                                                  )} */}
                                        <input
                                          type="text"
                                          value={data.name}
                                          className="form-control"
                                          style={{ backgroundColor: "#e8f4fb" }}
                                        />
                                      </label>
                                    </div>

                                    <div>
                                      <label
                                        style={{
                                          display: "flex",
                                          flexDirection: "column",
                                          rowGap: 4,
                                        }}
                                      >
                                        <span>Nama Lengkap</span>
                                        <input
                                          type="text"
                                          value={
                                            index === 0
                                              ? jobDirector
                                                ? jobDirector[jobDirectorIndex]
                                                    ?.full_name
                                                : null
                                              : data.fullname
                                          }
                                          className="form-control"
                                          style={{ backgroundColor: "#e8f4fb" }}
                                        />
                                      </label>
                                    </div>

                                    <div>
                                      <label
                                        style={{
                                          display: "flex",
                                          flexDirection: "column",
                                          rowGap: 4,
                                        }}
                                      >
                                        <span>Jabatan</span>
                                        <input
                                          type="text"
                                          value={
                                            index === 0
                                              ? jobDirector
                                                ? jobDirector[jobDirectorIndex]
                                                    ?.position_name
                                                : null
                                              : data.position
                                          }
                                          className="form-control"
                                          style={{ backgroundColor: "#e8f4fb" }}
                                        />
                                      </label>
                                    </div>

                                    <div>
                                      <label
                                        style={{
                                          display: "flex",
                                          flexDirection: "column",
                                          rowGap: 4,
                                        }}
                                      >
                                        <span>Alamat</span>
                                        <input
                                          type="text"
                                          value={
                                            index === 0
                                              ? authorizedOfficial
                                                ? authorizedOfficial[
                                                    authorizedOfficialIndex
                                                  ]?.address
                                                : null
                                              : data.address
                                          }
                                          className="form-control"
                                          style={{ backgroundColor: "#e8f4fb" }}
                                        />
                                      </label>
                                    </div>

                                    <div>
                                      <label
                                        style={{
                                          display: "flex",
                                          flexDirection: "column",
                                          rowGap: 4,
                                        }}
                                      >
                                        <span>Telp</span>
                                        <input
                                          type="text"
                                          value={
                                            index === 0
                                              ? authorizedOfficial
                                                ? authorizedOfficial[
                                                    authorizedOfficialIndex
                                                  ]?.phone
                                                : null
                                              : data.phone_number
                                          }
                                          className="form-control"
                                          style={{ backgroundColor: "#e8f4fb" }}
                                        />
                                      </label>
                                    </div>

                                    <div>
                                      <label
                                        style={{
                                          display: "flex",
                                          flexDirection: "column",
                                          rowGap: 4,
                                        }}
                                      >
                                        <span>FAX</span>
                                        <input
                                          type="text"
                                          value={
                                            index === 0
                                              ? authorizedOfficial
                                                ? authorizedOfficial[
                                                    authorizedOfficialIndex
                                                  ]?.fax
                                                : null
                                              : data.fax
                                          }
                                          className="form-control"
                                          style={{ backgroundColor: "#e8f4fb" }}
                                        />
                                      </label>
                                    </div>
                                  </div>
                                );
                              })}
                          </div>

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
                                justifyContent: "space-between",
                              }}
                            >
                              <h1
                                style={{
                                  fontSize: "16px",
                                }}
                              >
                                Addendum Pengawas pekerjaan
                              </h1>

                              <button
                                type="button"
                                className="btn btn-primary mx-1"
                                onClick={showAddWorkSupervisor}
                              >
                                Tambah
                              </button>
                              {/* {index === 0 && (
                                        )} */}
                            </div>

                            {/* Pengawas Pekerjaan */}
                            {placeman.workSupervisor &&
                              placeman.workSupervisor.map((data, index) => {
                                return (
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                      gap: 14,
                                    }}
                                  >
                                    <div>
                                      <label
                                        style={{
                                          display: "flex",
                                          flexDirection: "column",
                                          rowGap: 4,
                                        }}
                                      >
                                        <span>Jabatan</span>
                                        <input
                                          type="text"
                                          value={`${data.position}`}
                                          className="form-control"
                                          style={{ backgroundColor: "#e8f4fb" }}
                                        />
                                      </label>
                                    </div>

                                    <div>
                                      <label
                                        style={{
                                          display: "flex",
                                          flexDirection: "column",
                                          rowGap: 4,
                                        }}
                                      >
                                        <span>Alamat</span>
                                        {/* <ReactSelect
                                                    data={jobSupervisor}
                                                    func={changeDataJobSupervisor}
                                                    labelName={"facility_name"}
                                                  /> */}
                                        <input
                                          type="text"
                                          value={`${data.address}`}
                                          className="form-control"
                                          style={{ backgroundColor: "#e8f4fb" }}
                                        />
                                      </label>
                                    </div>

                                    <div>
                                      <label
                                        style={{
                                          display: "flex",
                                          flexDirection: "column",
                                          rowGap: 4,
                                        }}
                                      >
                                        <span>Telp</span>
                                        <input
                                          type="text"
                                          value={
                                            jobSupervisor
                                              ? jobSupervisor[
                                                  jobSupervisorIndex
                                                ]?.phone
                                              : null
                                          }
                                          className="form-control"
                                          style={{ backgroundColor: "#e8f4fb" }}
                                        />
                                      </label>
                                    </div>

                                    <div>
                                      <label
                                        style={{
                                          display: "flex",
                                          flexDirection: "column",
                                          rowGap: 4,
                                        }}
                                      >
                                        <span>FAX</span>
                                        <input
                                          type="text"
                                          value={
                                            jobSupervisor
                                              ? jobSupervisor[
                                                  jobSupervisorIndex
                                                ]?.fax
                                              : null
                                          }
                                          className="form-control"
                                          style={{ backgroundColor: "#e8f4fb" }}
                                        />
                                      </label>
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      </div>

                      {/* Header pihak kedua */}
                      <div
                        style={{
                          backgroundColor: "#cdcdcd",
                          display: "inline-block",
                          padding: 8,
                          borderRadius: 6,
                          marginBottom: 14,
                          marginTop: 40,
                          marginLeft: 12.5,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 14,
                            fontWeight: 500,
                            color: "#2e1f22",
                          }}
                        >
                          B. Pihak Kedua
                        </span>
                      </div>

                      {/* Baris pihak kedua */}
                      <div className="row col-md-12">
                        {/* Pihak kedua */}
                        <div
                          className="col-md-6"
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 28,
                          }}
                        >
                          {/* Pejabat Berwenang */}
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 14,
                            }}
                          >
                            <div>
                              <h1
                                style={{
                                  fontSize: "16px",
                                }}
                              >
                                Pejabat berwenang
                              </h1>
                            </div>

                            <div>
                              <label
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  rowGap: 4,
                                  height: 65.5,
                                }}
                              >
                                <span>Username</span>
                                <input
                                  type="text"
                                  value={`${jsonData?.contract_party?.party_2_contract_signature_username}`}
                                  className="form-control"
                                  style={{ backgroundColor: "#e8f4fb" }}
                                />
                              </label>
                            </div>

                            <div>
                              <label
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  rowGap: 4,
                                }}
                              >
                                <span>Nama</span>
                                <input
                                  type="text"
                                  value={`${jsonData?.contract_party?.party_2_autorize_name}`}
                                  className="form-control"
                                  style={{ backgroundColor: "#e8f4fb" }}
                                />
                              </label>
                            </div>

                            <div>
                              <label
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  rowGap: 4,
                                }}
                              >
                                <span>Jabatan</span>
                                <input
                                  type="text"
                                  value={`${jsonData?.contract_party?.party_2_position}`}
                                  className="form-control"
                                  style={{ backgroundColor: "#e8f4fb" }}
                                />
                              </label>
                            </div>

                            <div>
                              <label
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  rowGap: 4,
                                }}
                              >
                                <span>Alamat</span>
                                <input
                                  className="form-control"
                                  type="text"
                                  value={`${jsonData?.contract_party?.party_2_director_position_address}`}
                                  style={{ backgroundColor: "#e8f4fb" }}
                                />
                              </label>
                            </div>

                            <div>
                              <label
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  rowGap: 4,
                                }}
                              >
                                <span>Telp</span>
                                <input
                                  className="form-control"
                                  type="text"
                                  value={`${jsonData?.contract_party?.party_2_director_position_phone}`}
                                  style={{ backgroundColor: "#e8f4fb" }}
                                />
                              </label>
                            </div>

                            <div>
                              <label
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  rowGap: 4,
                                }}
                              >
                                <span>FAX</span>
                                <input
                                  className="form-control"
                                  type="text"
                                  value={`${jsonData?.contract_party?.party_2_director_position_fax}`}
                                  style={{ backgroundColor: "#e8f4fb" }}
                                />
                              </label>
                            </div>

                            <div>
                              <label
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  rowGap: 4,
                                }}
                              >
                                <span>Nomor SK Penugasan</span>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    columnGap: 8,
                                  }}
                                >
                                  <input
                                    type="text"
                                    value={`${jsonData?.contract_party?.party_2_sk_no}`}
                                    className="form-control"
                                    style={{
                                      backgroundColor: "#e8f4fb",
                                    }}
                                  />
                                  -
                                  <input
                                    type="date"
                                    value={`${jsonData?.contract_party?.party_2_sk_date}`}
                                    className="form-control"
                                    style={{
                                      backgroundColor: "#e8f4fb",
                                    }}
                                  />
                                </div>
                              </label>
                            </div>

                            <div>
                              <label
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  rowGap: 4,
                                }}
                              >
                                <span>Nama Notaris</span>
                                <input
                                  type="text"
                                  value={`${jsonData?.contract_party?.party_2_notary_act_autorized_name}`}
                                  className="form-control"
                                  style={{ backgroundColor: "#e8f4fb" }}
                                />
                              </label>
                            </div>

                            <div>
                              <label
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  rowGap: 4,
                                }}
                              >
                                <span>Nomor Akta</span>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    columnGap: 8,
                                  }}
                                >
                                  <input
                                    type="text"
                                    value={`${jsonData?.contract_party?.party_2_notary_act_autorized_no}`}
                                    className="form-control"
                                    style={{
                                      backgroundColor: "#e8f4fb",
                                    }}
                                  />
                                  -
                                  <input
                                    type="date"
                                    value={`${jsonData?.contract_party?.party_2_notary_act_autorized_date}`}
                                    className="form-control"
                                    style={{
                                      backgroundColor: "#e8f4fb",
                                    }}
                                  />
                                </div>
                              </label>
                            </div>

                            <div>
                              <label
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  rowGap: 4,
                                }}
                              >
                                <span>Nomor SK Kemenkumham</span>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    columnGap: 8,
                                  }}
                                >
                                  <input
                                    type="text"
                                    value={`${jsonData?.contract_party?.party_2_autorized_kemenkumham_no}`}
                                    className="form-control"
                                    style={{
                                      backgroundColor: "#e8f4fb",
                                    }}
                                  />
                                  -
                                  <input
                                    type="date"
                                    value={`${jsonData?.contract_party?.party_2_autorized_kemenkumham_date}`}
                                    className="form-control"
                                    style={{
                                      backgroundColor: "#e8f4fb",
                                    }}
                                  />
                                </div>
                              </label>
                            </div>
                          </div>

                          {/* Direksi Pekerjaan */}
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 14,
                            }}
                          >
                            <div
                              style={{
                                minHeight: 44.89,
                              }}
                            >
                              <h1
                                style={{
                                  fontSize: "16px",
                                }}
                              >
                                Direksi pekerjaan
                              </h1>
                            </div>

                            <div>
                              <label
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  rowGap: 4,
                                  height: 65.5,
                                }}
                              >
                                <span>Username</span>
                                <input
                                  type="text"
                                  value={`${jsonData?.contract_party?.party_2_director_position_username}`}
                                  className="form-control"
                                  style={{ backgroundColor: "#e8f4fb" }}
                                />
                              </label>
                            </div>

                            <div>
                              <label
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  rowGap: 4,
                                }}
                              >
                                <span>Nama Lengkap</span>
                                <input
                                  type="text"
                                  value={`${jsonData?.contract_party?.party_2_director_position_full_name}`}
                                  className="form-control"
                                  style={{ backgroundColor: "#e8f4fb" }}
                                />
                              </label>
                            </div>

                            <div>
                              <label
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  rowGap: 4,
                                }}
                              >
                                <span>Jabatan</span>
                                <input
                                  type="text"
                                  value={`${jsonData?.contract_party?.party_2_director_position}`}
                                  className="form-control"
                                  style={{ backgroundColor: "#e8f4fb" }}
                                />
                              </label>
                            </div>

                            <div>
                              <label
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  rowGap: 4,
                                }}
                              >
                                <span>Alamat</span>
                                <input
                                  type="text"
                                  value={`${jsonData?.contract_party?.party_2_director_position_address}`}
                                  className="form-control"
                                  style={{ backgroundColor: "#e8f4fb" }}
                                />
                              </label>
                            </div>

                            <div>
                              <label
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  rowGap: 4,
                                }}
                              >
                                <span>Telp</span>
                                <input
                                  type="text"
                                  value={`${jsonData?.contract_party?.party_2_director_position_phone}`}
                                  className="form-control"
                                  style={{ backgroundColor: "#e8f4fb" }}
                                />
                              </label>
                            </div>

                            <div>
                              <label
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  rowGap: 4,
                                }}
                              >
                                <span>FAX</span>
                                <input
                                  type="text"
                                  value={`${jsonData?.contract_party?.party_2_director_position_fax}`}
                                  className="form-control"
                                  style={{ backgroundColor: "#e8f4fb" }}
                                />
                              </label>
                            </div>
                          </div>

                          {/* Pengawas Pekerjaan */}
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 14,
                            }}
                          >
                            <div
                              style={{
                                minHeight: 44.89,
                              }}
                            >
                              <h1
                                style={{
                                  fontSize: "16px",
                                }}
                              >
                                Pengawas pekerjaan
                              </h1>
                            </div>

                            <div>
                              <label
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  rowGap: 4,
                                  // height: 65.5
                                }}
                              >
                                <span>Jabatan</span>
                                <input
                                  type="text"
                                  value={`${jsonData?.contract_party?.party_2_job_supervisor.name}`}
                                  className="form-control"
                                  style={{ backgroundColor: "#e8f4fb" }}
                                />
                              </label>
                            </div>

                            <div>
                              <label
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  rowGap: 4,
                                }}
                              >
                                <span>Alamat</span>
                                <input
                                  type="text"
                                  value={`${jsonData?.contract_party?.party_2_job_supervisor.address}`}
                                  className="form-control"
                                  style={{ backgroundColor: "#e8f4fb" }}
                                />
                              </label>
                            </div>

                            <div>
                              <label
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  rowGap: 4,
                                }}
                              >
                                <span>Telp</span>
                                <input
                                  type="text"
                                  value={`${jsonData?.contract_party?.party_2_job_supervisor.telp}`}
                                  className="form-control"
                                  style={{ backgroundColor: "#e8f4fb" }}
                                />
                              </label>
                            </div>

                            <div>
                              <label
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  rowGap: 4,
                                }}
                              >
                                <span>FAX</span>
                                <input
                                  type="text"
                                  value={`${jsonData?.contract_party?.party_2_job_supervisor.fax}`}
                                  className="form-control"
                                  style={{ backgroundColor: "#e8f4fb" }}
                                />
                              </label>
                            </div>
                          </div>
                        </div>

                        {/* Addendum pihak kedua */}
                        <div
                          className="col-md-6"
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 28,
                          }}
                        >
                          {/* Pejabat Berwenang */}
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 14,
                            }}
                          >
                            <div>
                              <h1
                                style={{
                                  fontSize: "16px",
                                }}
                              >
                                Addendum Pejabat berwenang
                              </h1>
                            </div>

                            <div>
                              <label
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  rowGap: 4,
                                }}
                              >
                                <span>Username</span>
                                {/* <input 
                                                              type="text" 
                                                              value={"herdian"}
                                                              className="form-control"
                                                              style={{ backgroundColor: "#e8f4fb" }}
                                                          /> */}
                                <ReactSelect />
                              </label>
                            </div>

                            <div>
                              <label
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  rowGap: 4,
                                }}
                              >
                                <span>Nama</span>
                                <input
                                  type="text"
                                  value={"Herdian Ardi Febrianto"}
                                  className="form-control"
                                  style={{ backgroundColor: "#e8f4fb" }}
                                />
                              </label>
                            </div>

                            <div>
                              <label
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  rowGap: 4,
                                }}
                              >
                                <span>Jabatan</span>
                                <input
                                  type="text"
                                  value={"General Manager Unit Dieng"}
                                  className="form-control"
                                  style={{ backgroundColor: "#e8f4fb" }}
                                />
                              </label>
                            </div>

                            <div>
                              <label
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  rowGap: 4,
                                }}
                              >
                                <span>Alamat</span>
                                <input
                                  className="form-control"
                                  type="text"
                                  value={
                                    "Jl Raya Dieng - Batur Banjarnegara PO BOX 01 Wonosobo"
                                  }
                                  style={{ backgroundColor: "#e8f4fb" }}
                                />
                              </label>
                            </div>

                            <div>
                              <label
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  rowGap: 4,
                                }}
                              >
                                <span>Telp</span>
                                <input
                                  className="form-control"
                                  type="text"
                                  value={"+62-286-3342020"}
                                  style={{ backgroundColor: "#e8f4fb" }}
                                />
                              </label>
                            </div>

                            <div>
                              <label
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  rowGap: 4,
                                }}
                              >
                                <span>FAX</span>
                                <input
                                  className="form-control"
                                  type="text"
                                  value={"+62-286-3342022"}
                                  style={{ backgroundColor: "#e8f4fb" }}
                                />
                              </label>
                            </div>

                            <div>
                              <label
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  rowGap: 4,
                                }}
                              >
                                <span>Nomor SK Penugasan</span>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    columnGap: 8,
                                  }}
                                >
                                  <input
                                    type="text"
                                    value={"015.PJ/PST.100-GDE/I/2023"}
                                    className="form-control"
                                    style={{
                                      backgroundColor: "#e8f4fb",
                                    }}
                                  />
                                  -
                                  <input
                                    type="date"
                                    defaultValue={"2022-03-25"}
                                    className="form-control"
                                    style={{
                                      backgroundColor: "#e8f4fb",
                                    }}
                                  />
                                </div>
                              </label>
                            </div>

                            <div>
                              <label
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  rowGap: 4,
                                }}
                              >
                                <span>Nama Notaris</span>
                                <input
                                  type="text"
                                  value={""}
                                  className="form-control"
                                  style={{ backgroundColor: "#e8f4fb" }}
                                />
                              </label>
                            </div>

                            <div>
                              <label
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  rowGap: 4,
                                }}
                              >
                                <span>Nomor Akta</span>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    columnGap: 8,
                                  }}
                                >
                                  <input
                                    type="text"
                                    value={""}
                                    className="form-control"
                                    style={{
                                      backgroundColor: "#e8f4fb",
                                    }}
                                  />
                                  -
                                  <input
                                    type="date"
                                    defaultValue={"2022-03-25"}
                                    className="form-control"
                                    style={{
                                      backgroundColor: "#e8f4fb",
                                    }}
                                  />
                                </div>
                              </label>
                            </div>

                            <div>
                              <label
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  rowGap: 4,
                                }}
                              >
                                <span>Nomor SK Kemenkumham</span>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    columnGap: 8,
                                  }}
                                >
                                  <input
                                    type="text"
                                    value={""}
                                    className="form-control"
                                    style={{
                                      backgroundColor: "#e8f4fb",
                                    }}
                                  />
                                  -
                                  <input
                                    type="date"
                                    defaultValue={"2022-03-25"}
                                    className="form-control"
                                    style={{
                                      backgroundColor: "#e8f4fb",
                                    }}
                                  />
                                </div>
                              </label>
                            </div>
                          </div>

                          {/* Direksi Pekerjaan */}
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 14,
                            }}
                          >
                            {/* addendum direksi pekerjaan pihak kedua */}
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                height: 44.89,
                              }}
                            >
                              <h1
                                style={{
                                  fontSize: "16px",
                                }}
                              >
                                Addendum Direksi pekerjaan
                              </h1>
                              <button
                                className="btn btn-primary mx-1"
                                onClick={showAddWorkDirector}
                              >
                                Tambah
                              </button>
                            </div>

                            <div>
                              <label
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  rowGap: 4,
                                }}
                              >
                                <span>Username</span>
                                {/* <input
                                                              type="text" 
                                                              value={"weni"}
                                                              className="form-control"
                                                              style={{ backgroundColor: "#e8f4fb" }}
                                                          /> */}
                                <ReactSelect />
                              </label>
                            </div>

                            <div>
                              <label
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  rowGap: 4,
                                }}
                              >
                                <span>Nama Lengkap</span>
                                <input
                                  type="text"
                                  value={"Weni Kusumaningrum"}
                                  className="form-control"
                                  style={{ backgroundColor: "#e8f4fb" }}
                                />
                              </label>
                            </div>

                            <div>
                              <label
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  rowGap: 4,
                                }}
                              >
                                <span>Jabatan</span>
                                <input
                                  type="text"
                                  value={"Procurement Superintendent"}
                                  className="form-control"
                                  style={{ backgroundColor: "#e8f4fb" }}
                                />
                              </label>
                            </div>

                            <div>
                              <label
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  rowGap: 4,
                                }}
                              >
                                <span>Alamat</span>
                                <input
                                  type="text"
                                  value={
                                    "Jl. Raya Dieng - Batur PO BOX 01 Wonosobo"
                                  }
                                  className="form-control"
                                  style={{ backgroundColor: "#e8f4fb" }}
                                />
                              </label>
                            </div>

                            <div>
                              <label
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  rowGap: 4,
                                }}
                              >
                                <span>Telp</span>
                                <input
                                  type="text"
                                  value={"+62-286-3342020"}
                                  className="form-control"
                                  style={{ backgroundColor: "#e8f4fb" }}
                                />
                              </label>
                            </div>

                            <div>
                              <label
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  rowGap: 4,
                                }}
                              >
                                <span>FAX</span>
                                <input
                                  type="text"
                                  value={"+62-286-3342022"}
                                  className="form-control"
                                  style={{ backgroundColor: "#e8f4fb" }}
                                />
                              </label>
                            </div>
                          </div>

                          {/* Pengawas Pekerjaan */}
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
                                justifyContent: "space-between",
                              }}
                            >
                              <h1
                                style={{
                                  fontSize: "16px",
                                }}
                              >
                                Addendum Pengawas pekerjaan
                              </h1>

                              <button
                                type="button"
                                className="btn btn-primary mx-1"
                                onClick={showAddWorkSupervisor}
                              >
                                Tambah
                              </button>
                            </div>

                            <div>
                              <label
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  rowGap: 4,
                                }}
                              >
                                <span>Jabatan</span>
                                <input
                                  type="text"
                                  value={"Logistic Supervisor"}
                                  className="form-control"
                                  style={{ backgroundColor: "#e8f4fb" }}
                                  disabled
                                />
                              </label>
                            </div>

                            <div>
                              <label
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  rowGap: 4,
                                }}
                              >
                                <span>Alamat</span>
                                <input
                                  type="text"
                                  value={
                                    "Jl. Raya Dieng Batur, Karangtengah Batur Banjarnegara"
                                  }
                                  className="form-control"
                                  style={{ backgroundColor: "#e8f4fb" }}
                                />
                              </label>
                            </div>

                            <div>
                              <label
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  rowGap: 4,
                                }}
                              >
                                <span>Telp</span>
                                <input
                                  type="text"
                                  value={"+62-286-3342020"}
                                  className="form-control"
                                  style={{ backgroundColor: "#e8f4fb" }}
                                />
                              </label>
                            </div>

                            <div>
                              <label
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  rowGap: 4,
                                }}
                              >
                                <span>FAX</span>
                                <input
                                  type="text"
                                  value={"+62-286-3342022"}
                                  className="form-control"
                                  style={{ backgroundColor: "#e8f4fb" }}
                                />
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Klausul Perubahan */}
                    <div
                      className="clause-change-wrapper"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 14,
                        border: 1,
                        borderColor: "black",
                        borderStyle: "solid",
                        padding: 28,
                        borderRadius: 14,
                      }}
                    >
                      <div>
                        <div
                          style={{
                            backgroundColor: "#cdcdcd",
                            display: "inline-block",
                            padding: 8,
                            borderRadius: 14,
                          }}
                        >
                          <span
                            style={{
                              fontSize: 14,
                              fontWeight: 500,
                              color: "#2e1f22",
                            }}
                          >
                            C. Perubahan Klausul Kontrak Para Pihak
                          </span>
                        </div>
                      </div>

                      <h1
                        style={{
                          fontWeight: 600,
                          fontSize: 16,
                          margin: 0,
                        }}
                      >
                        C.1 Body Kontrak
                      </h1>

                      <div>
                        <input
                          type="text"
                          placeholder="Masukkan Nomor Pasal"
                          style={{
                            padding: 8,
                            borderRadius: 4,
                            minWidth: 400,
                          }}
                        />
                      </div>

                      {/* Pasal */}
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 14,
                          // marginTop: 28
                        }}
                      >
                        {/* pasal sebelum addendum */}
                        <div>
                          <p
                            style={{
                              fontWeight: 500,
                              marginBottom: 14,
                            }}
                          >
                            Pasal Sebelum Addendum
                          </p>
                          <textarea
                            rows="4"
                            className="form-control"
                          ></textarea>
                        </div>

                        {/* pasal setelah addendum */}
                        <div>
                          <p
                            style={{
                              fontWeight: 500,
                              marginBottom: 14,
                            }}
                          >
                            Pasal Setelah Addendum
                          </p>
                          <textarea
                            rows="4"
                            className="form-control"
                          ></textarea>
                        </div>
                      </div>

                      <h1
                        style={{
                          fontWeight: 600,
                          fontSize: 16,
                          margin: 0,
                        }}
                      >
                        C.2 Lampiran
                      </h1>

                      <div>
                        <input
                          type="text"
                          placeholder="Masukkan Angka Lampiran"
                          style={{
                            padding: 8,
                            borderRadius: 4,
                            minWidth: 400,
                          }}
                        />
                      </div>

                      <div>
                        <textarea rows="4" className="form-control"></textarea>
                      </div>

                      <div>
                        <button
                          className="btn btn-primary text-white add-new-clause"
                          style={{
                            marginTop: 14,
                          }}
                        >
                          Tambah Klausul Lampiran
                        </button>
                      </div>
                    </div>

                    <UpdateButton />
                  </Form>
                )}
              </Formik>
            </>
          )}

          {/* Harga Pekerjaan */}
          {currentActiveTab === 1 && (
            <>
              <Formik
                initialValues={{
                  a: "a",
                }}
              >
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
                            >
                              {currencies?.count?.map((item) => {
                                return <option>{item.code}</option>;
                              })}
                            </select>
                            <input
                              className="form-control"
                              type="text"
                              style={{
                                width: "100%",
                                border: 1,
                                borderStyle: "solid",
                                borderColor: "#d1d1d1",
                                backgroundColor: "#e8f4fb",
                              }}
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
                            >
                              {currencies.count.map((item) => {
                                return <option>{item.code}</option>;
                              })}
                            </select>
                            <input
                              className="form-control"
                              type="text"
                              style={{
                                width: "100%",
                                border: 1,
                                borderStyle: "solid",
                                borderColor: "#d1d1d1",
                              }}
                            />
                          </div>
                        </label>
                      </div>

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
                                <TableCell align="left">
                                  {row.product_name}
                                </TableCell>
                                <TableCell align="left">{row.qty}</TableCell>
                                <TableCell align="left">{row.uom}</TableCell>
                                <TableCell align="left">
                                  {row.unit_price}
                                </TableCell>
                                <TableCell align="left">
                                  {row.subtotal}
                                </TableCell>
                                <TableCell align="left">{row.note}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
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
                                <TableCell align="left">
                                  {row.protein}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>

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
                        />
                      </TableContainer>
                    </div>

                    {/* Klausul Perubahan */}
                    <div
                      className="clause-change-wrapper"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 14,
                        border: 1,
                        borderColor: "black",
                        borderStyle: "solid",
                        padding: 28,
                        borderRadius: 14,
                      }}
                    >
                      <div>
                        <div
                          style={{
                            backgroundColor: "#cdcdcd",
                            display: "inline-block",
                            padding: 8,
                            borderRadius: 14,
                          }}
                        >
                          <span
                            style={{
                              fontSize: 14,
                              fontWeight: 500,
                              color: "#2e1f22",
                            }}
                          >
                            C. Perubahan Klausul Kontrak Harga Pekerjaan
                          </span>
                        </div>
                      </div>

                      <h1
                        style={{
                          fontWeight: 600,
                          fontSize: 16,
                          margin: 0,
                        }}
                      >
                        C.1 Body Kontrak
                      </h1>

                      <div>
                        <input
                          type="text"
                          placeholder="Masukkan Nomor Pasal"
                          style={{
                            padding: 8,
                            borderRadius: 4,
                            minWidth: 400,
                          }}
                        />
                      </div>

                      {/* Pasal */}
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 14,
                          // marginTop: 28
                        }}
                      >
                        {/* pasal sebelum addendum */}
                        <div>
                          <p
                            style={{
                              fontWeight: 500,
                              marginBottom: 14,
                            }}
                          >
                            Pasal Sebelum Addendum
                          </p>
                          <textarea
                            rows="4"
                            className="form-control"
                          ></textarea>
                        </div>

                        {/* pasal setelah addendum */}
                        <div>
                          <p
                            style={{
                              fontWeight: 500,
                              marginBottom: 14,
                            }}
                          >
                            Pasal Setelah Addendum
                          </p>
                          <textarea
                            rows="4"
                            className="form-control"
                          ></textarea>
                        </div>
                      </div>

                      <h1
                        style={{
                          fontWeight: 600,
                          fontSize: 16,
                          margin: 0,
                        }}
                      >
                        C.2 Lampiran
                      </h1>

                      <div>
                        <input
                          type="text"
                          placeholder="Masukkan Angka Lampiran"
                          style={{
                            padding: 8,
                            borderRadius: 4,
                            minWidth: 400,
                          }}
                        />
                      </div>

                      <div>
                        <textarea rows="4" className="form-control"></textarea>
                      </div>

                      <div>
                        <button
                          className="btn btn-primary text-white add-new-clause"
                          style={{
                            marginTop: 14,
                          }}
                        >
                          Tambah Klausul Lampiran
                        </button>
                      </div>
                    </div>
                  </div>

                  <UpdateButton />
                </Form>
              </Formik>
            </>
          )}

          {currentActiveTab === 2 && (
            <>
              <Formik
                enableReinitialize={true}
                initialValues={{
                  contract_start_date: "",
                  contract_end_date: "",
                  worked_start_date: "",
                  worked_end_date: "",
                  guarantee_start_date: "",
                  guarantee_end_date: "",
                  maintenance_start_date: "",
                  maintenance_end_date: "",
                  contract_range_month: "",
                  contract_range_day: "",
                  work_range_month: "",
                  work_range_day: "",
                  guarantee_range_month: "",
                  guarantee_range_day: "",
                  maintenance_range_month: "",
                  maintenance_range_day: "",
                }}
                onSubmit={(values) => {
                  console.log("isi jangka waktu", values);
                  submitFormParameterTimePeriod(values);
                }}
              >
                <Form>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 14,
                      border: 1,
                      borderColor: "black",
                      borderStyle: "solid",
                      borderRadius: 14,
                      padding: 28,
                    }}
                  >
                    {/* Jangka waktu kontrak awal */}
                    <h1
                      style={{
                        fontSize: "16px",
                        fontWeight: 600,
                        marginBottom: 14,
                      }}
                    >
                      Jangka waktu kontrak awal
                    </h1>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 14,
                      }}
                    >
                      {timePeriodBeforeAddendum &&
                        timePeriodBeforeAddendum.map((data, index) => (
                          <>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "flex-end",
                                columnGap: 18,
                              }}
                            >
                              <div>
                                <div className="upper-for-title">
                                  <p
                                    style={{
                                      margin: 0,
                                    }}
                                  >
                                    {data.title}
                                  </p>
                                </div>

                                <div
                                  className="bottom-for-input col-md-3"
                                  style={{
                                    display: "flex",
                                    alignItems: "flex-end",
                                    columnGap: 10,
                                    padding: 0,
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                      rowGap: 4,
                                      padding: 0,
                                    }}
                                  >
                                    <input
                                      type="date"
                                      style={{
                                        backgroundColor: "#e8f4fb",
                                        borderRadius: 4,
                                        padding: "10px 12px",
                                        border: "none",
                                        display: "flex",
                                        flexDirection: "row-reverse",
                                        columnGap: 10,
                                      }}
                                      value={data.startDate}
                                      disabled
                                    />
                                  </div>

                                  <div
                                    style={{
                                      display: "flex",
                                      placeItems: "center",
                                      minHeight: 41.5,
                                    }}
                                  >
                                    -
                                  </div>

                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                      rowGap: 4,
                                      padding: 0,
                                    }}
                                  >
                                    <span></span>

                                    <input
                                      type="date"
                                      disabled
                                      style={{
                                        backgroundColor: "#e8f4fb",
                                        borderRadius: 4,
                                        padding: "10px 12px",
                                        border: "none",
                                        display: "flex",
                                        flexDirection: "row-reverse",
                                        columnGap: 10,
                                      }}
                                      value={data.endDate}
                                    />
                                  </div>
                                </div>
                              </div>

                              <div
                                className="month-day-wrapper"
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  minHeight: 41.5,
                                }}
                              >
                                <p
                                  style={{
                                    margin: 0,
                                  }}
                                >
                                  {data.totalMonth} Bulan {data.calendarDay}{" "}
                                  Hari
                                </p>
                              </div>

                              {data.radio && (
                                <div
                                  style={{
                                    display: "flex",
                                    gap: 20,
                                    marginLeft: 10,
                                    alignItems: "center",
                                    minHeight: 41.5,
                                  }}
                                >
                                  <label
                                    style={{
                                      margin: 0,
                                      display: "flex",
                                      flexWrap: "wrap",
                                      alignItems: "center",
                                      columnGap: 8,
                                    }}
                                  >
                                    <input
                                      type="radio"
                                      name={`${index}_down_payment_guarantee`}
                                      value={"SKPP"}
                                      checked={data.radio === "SKPP"}
                                    />
                                    <span>SKPP</span>
                                  </label>

                                  <label
                                    style={{
                                      margin: 0,
                                      display: "flex",
                                      flexWrap: "wrap",
                                      alignItems: "center",
                                      columnGap: 8,
                                    }}
                                  >
                                    <input
                                      type="radio"
                                      name={`${data.title}_down_payment_guarantee`}
                                      value={"SPMK"}
                                      checked={data.radio === "SPMK"}
                                    />
                                    <span>SPMK</span>
                                  </label>
                                </div>
                              )}
                            </div>
                          </>
                        ))}
                    </div>

                    {/* Addendum jangka waktu */}
                    <h1
                      style={{
                        fontSize: "16px",
                        fontWeight: 600,
                        marginTop: 28,
                        marginBottom: 14,
                      }}
                    >
                      A. Addendum jangka waktu
                    </h1>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 14,
                      }}
                    >
                      {timePeriodBeforeAddendum &&
                        timePeriodBeforeAddendum.map((data, index) => (
                          <>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "flex-end",
                                columnGap: 18,
                              }}
                            >
                              <div>
                                <div className="upper-for-title">
                                  <p
                                    style={{
                                      margin: 0,
                                    }}
                                  >
                                    {data.title}
                                  </p>
                                </div>

                                <div
                                  className="bottom-for-input col-md-3"
                                  style={{
                                    display: "flex",
                                    alignItems: "flex-end",
                                    columnGap: 10,
                                    padding: 0,
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                      rowGap: 4,
                                      padding: 0,
                                    }}
                                  >
                                    <Field
                                      type="date"
                                      style={{
                                        borderRadius: 4,
                                        padding: "10px 12px",
                                        border: "none",
                                        display: "flex",
                                        flexDirection: "row-reverse",
                                        columnGap: 10,
                                        backgroundColor:
                                          data.title ===
                                            "Jangka Waktu Perjanjian" ||
                                          data.title ===
                                            "Jangka Waktu Pelaksanaan Pekerjaan"
                                            ? "#e8f4fb"
                                            : "",
                                      }}
                                      name={data.prefix + "_start_date"}
                                      //
                                      value={
                                        data.title ===
                                          "Jangka Waktu Perjanjian" ||
                                        data.title ===
                                          "Jangka Waktu Pelaksanaan Pekerjaan"
                                          ? data.startDate
                                          : null
                                      }
                                      disabled={
                                        data.title ===
                                          "Jangka Waktu Perjanjian" ||
                                        data.title ===
                                          "Jangka Waktu Pelaksanaan Pekerjaan"
                                      }
                                    />
                                  </div>

                                  <div
                                    style={{
                                      display: "flex",
                                      placeItems: "center",
                                      minHeight: 41.5,
                                    }}
                                  >
                                    -
                                  </div>

                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                      rowGap: 4,
                                      padding: 0,
                                    }}
                                  >
                                    <span></span>

                                    <Field
                                      type="date"
                                      style={{
                                        borderRadius: 4,
                                        padding: "10px 12px",
                                        border: "none",
                                        display: "flex",
                                        flexDirection: "row-reverse",
                                        columnGap: 10,
                                      }}
                                      name={data.prefix + "_end_date"}

                                      // value={data.endDate}
                                    />
                                  </div>
                                </div>
                              </div>

                              <div
                                className="month-day-wrapper"
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  minHeight: 41.5,
                                }}
                              >
                                <p
                                  style={{
                                    margin: 0,
                                  }}
                                >
                                  {data.totalMonth} Bulan {data.calendarDay}{" "}
                                  Hari
                                </p>
                              </div>

                              {data.radio && (
                                <div
                                  style={{
                                    display: "flex",
                                    gap: 20,
                                    marginLeft: 10,
                                    alignItems: "center",
                                    minHeight: 41.5,
                                  }}
                                >
                                  <label
                                    style={{
                                      margin: 0,
                                      display: "flex",
                                      flexWrap: "wrap",
                                      alignItems: "center",
                                      columnGap: 8,
                                    }}
                                  >
                                    <input
                                      type="radio"
                                      name={`${index +
                                        1}_down_payment_guarantee`}
                                      value={"SKPP"}
                                    />
                                    <span>SKPP</span>
                                  </label>

                                  <label
                                    style={{
                                      margin: 0,
                                      display: "flex",
                                      flexWrap: "wrap",
                                      alignItems: "center",
                                      columnGap: 8,
                                    }}
                                  >
                                    <input
                                      type="radio"
                                      name={`${index +
                                        2}_down_payment_guarantee`}
                                      value={"SPMK"}
                                    />
                                    <span>SPMK</span>
                                  </label>
                                </div>
                              )}
                            </div>
                          </>
                        ))}
                    </div>
                  </div>

                  {/* Klausul Perubahan */}
                  <div
                    className="clause-change-wrapper"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 14,
                      border: 1,
                      borderColor: "black",
                      borderStyle: "solid",
                      padding: 28,
                      borderRadius: 14,
                      marginTop: 40,
                    }}
                  >
                    <div>
                      <span
                        style={{
                          fontSize: 16,
                          fontWeight: 600,
                          color: "#2e1f22",
                        }}
                      >
                        B. Perubahan Klausul Kontrak Jangka Waktu
                      </span>
                    </div>

                    <h1
                      style={{
                        fontWeight: 600,
                        fontSize: 16,
                        margin: 0,
                      }}
                    >
                      B.1 Body Kontrak
                    </h1>

                    <div>
                      <input
                        type="text"
                        placeholder="Masukkan Nomor Pasal"
                        style={{
                          padding: 8,
                          borderRadius: 4,
                          minWidth: 400,
                        }}
                      />
                    </div>

                    {/* Pasal */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 14,
                        // marginTop: 28
                      }}
                    >
                      {/* pasal sebelum addendum */}
                      <div>
                        <p
                          style={{
                            fontWeight: 500,
                            marginBottom: 14,
                          }}
                        >
                          Pasal Sebelum Addendum
                        </p>
                        <textarea rows="4" className="form-control"></textarea>
                      </div>

                      {/* pasal setelah addendum */}
                      <div>
                        <p
                          style={{
                            fontWeight: 500,
                            marginBottom: 14,
                          }}
                        >
                          Pasal Setelah Addendum
                        </p>
                        <textarea rows="4" className="form-control"></textarea>
                      </div>
                    </div>

                    <h1
                      style={{
                        fontWeight: 600,
                        fontSize: 16,
                        margin: 0,
                      }}
                    >
                      B.2 Lampiran
                    </h1>

                    <div>
                      <input
                        type="text"
                        placeholder="Masukkan Angka Lampiran"
                        style={{
                          padding: 8,
                          borderRadius: 4,
                          minWidth: 400,
                        }}
                      />
                    </div>

                    <div>
                      <textarea rows="4" className="form-control"></textarea>
                    </div>

                    <div>
                      <button
                        className="btn btn-primary text-white add-new-clause"
                        style={{
                          marginTop: 14,
                        }}
                      >
                        Tambah Klausul Lampiran
                      </button>
                    </div>
                  </div>

                  <UpdateButton />
                </Form>
              </Formik>
            </>
          )}

          {currentActiveTab === 3 && (
            <>
              <Formik
                enableReinitialize={true}
                initialValues={{
                  payment_method: addendumPaymentMethod,
                  payment_data: stagePayment,
                  // body_data: [
                  //   {
                  //     clause_number: "",
                  //     before_clause_note: "",
                  //     after_clause_note: "",
                  //   },
                  // ],
                  // attachment_data: [],
                }}
                onSubmit={(values) => {
                  console.log("submit di metode pembayaran", values);
                  submitFormParameterPaymentMethod(values);
                }}
              >
                <Form>
                  <div
                    style={{
                      padding: 28,
                      borderRadius: 14,
                      border: 1,
                      borderStyle: "solid",
                      borderColor: "#8c8a8a",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    {/* Metode Pembayaran Kontrak Awal */}
                    <div
                      style={{
                        flex: 1,
                      }}
                    >
                      <h1
                        style={{
                          fontSize: 16,
                          fontWeight: 600,
                        }}
                      >
                        Metode pembayaran kontrak awal
                      </h1>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          rowGap: 14,
                          paddingTop: 14,
                        }}
                      >
                        <label
                          style={{
                            display: "flex",
                            gap: 12,
                          }}
                        >
                          <input type="radio" name="payment" disabled checked />
                          Full Pembayaran
                        </label>
                        <label
                          style={{
                            display: "flex",
                            gap: 12,
                          }}
                        >
                          <input type="radio" name="payment" disabled />
                          Pembayaran Bertahap
                        </label>
                      </div>
                    </div>

                    {/* Addendum Metode Pembayaran */}
                    <div
                      style={{
                        flex: 1,
                      }}
                    >
                      <h1
                        style={{
                          fontSize: 16,
                          fontWeight: 600,
                        }}
                      >
                        A. Addendum metode pembayaran
                      </h1>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          rowGap: 14,
                          paddingTop: 14,
                        }}
                      >
                        <label
                          style={{
                            display: "flex",
                            gap: 12,
                          }}
                        >
                          <input
                            type="radio"
                            name="payment_addendum"
                            onClick={() => setAddendumPaymentMethod("full")}
                            checked={addendumPaymentMethod === "full"}
                          />
                          Full Pembayaran
                        </label>
                        <label
                          style={{
                            display: "flex",
                            gap: 12,
                            margin: 0,
                          }}
                        >
                          <input
                            type="radio"
                            name="payment_addendum"
                            onClick={() => setAddendumPaymentMethod("gradual")}
                            checked={addendumPaymentMethod === "gradual"}
                          />
                          Pembayaran Bertahap
                        </label>
                      </div>
                      {stagePayment.map((item, index) => {
                        return (
                          <>
                            <div
                              style={{
                                display: "flex",
                                columnGap: 10,
                                placeItems: "center",
                                marginTop: "0.5rem",
                                marginBottom: "0.5rem",
                              }}
                            >
                              Tahap {index + 1}
                              <input
                                style={{
                                  flex: 1,
                                  padding: "10px 12px",
                                  borderRadius: 4,
                                }}
                                type="text"
                                placeholder="Persentase"
                                value={item.percentage}
                                disabled={addendumPaymentMethod !== "gradual"}
                              />
                            </div>
                            <div
                              style={{
                                marginTop: 14,
                                display: "flex",
                              }}
                            >
                              <textarea
                                style={{
                                  flex: 1,
                                  padding: "10px 12px",
                                  borderRadius: 4,
                                }}
                                placeholder="Deskripsi"
                                value={item.description}
                                disabled={addendumPaymentMethod !== "gradual"}
                              ></textarea>
                            </div>
                          </>
                        );
                      })}
                      {addendumPaymentMethod === "gradual" && (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            marginTop: 28,
                          }}
                        >
                          <button
                            className="btn btn-primary mx-1"
                            onClick={showAddPayment}
                          >
                            Tambah
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Klausul Perubahan */}
                  <div
                    className="clause-change-wrapper"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 14,
                      border: 1,
                      borderColor: "black",
                      borderStyle: "solid",
                      padding: 28,
                      borderRadius: 14,
                      marginTop: 40,
                    }}
                  >
                    <div>
                      <span
                        style={{
                          fontSize: 16,
                          fontWeight: 600,
                          color: "#2e1f22",
                        }}
                      >
                        B. Perubahan Klausul Kontrak Metode Pembayaran
                      </span>
                    </div>

                    <h1
                      style={{
                        fontWeight: 600,
                        fontSize: 16,
                        margin: 0,
                      }}
                    >
                      B.1 Body Kontrak
                    </h1>

                    <div>
                      <input
                        type="text"
                        placeholder="Masukkan Nomor Pasal"
                        style={{
                          padding: 8,
                          borderRadius: 4,
                          minWidth: 400,
                        }}
                      />
                    </div>

                    {/* Pasal */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 14,
                        // marginTop: 28
                      }}
                    >
                      {/* pasal sebelum addendum */}
                      <div>
                        <p
                          style={{
                            fontWeight: 500,
                            marginBottom: 14,
                          }}
                        >
                          Pasal Sebelum Addendum
                        </p>
                        <textarea rows="4" className="form-control"></textarea>
                      </div>

                      {/* pasal setelah addendum */}
                      <div>
                        <p
                          style={{
                            fontWeight: 500,
                            marginBottom: 14,
                          }}
                        >
                          Pasal Setelah Addendum
                        </p>
                        <textarea rows="4" className="form-control"></textarea>
                      </div>
                    </div>

                    <h1
                      style={{
                        fontWeight: 600,
                        fontSize: 16,
                        margin: 0,
                      }}
                    >
                      B.2 Lampiran
                    </h1>

                    <div>
                      <input
                        type="text"
                        placeholder="Masukkan Angka Lampiran"
                        style={{
                          padding: 8,
                          borderRadius: 4,
                          minWidth: 400,
                        }}
                      />
                    </div>

                    <div>
                      <textarea rows="4" className="form-control"></textarea>
                    </div>

                    <div>
                      <button
                        className="btn btn-primary text-white add-new-clause"
                        style={{
                          marginTop: 14,
                        }}
                      >
                        Tambah Klausul Lampiran
                      </button>
                    </div>
                  </div>

                  <UpdateButton />
                </Form>
              </Formik>
            </>
          )}

          {/* denda */}
          {currentActiveTab === 4 && (
            <>
              <Formik
                enableReinitialize={true}
                initialValues={{
                  fine_data: addendumRows,
                  body_data: [],
                  attachment_data: [],
                }}
                onSubmit={(values) => {
                  console.log("isi submit", values);
                }}
              >
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
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                          <TableBody>
                            <TableRow>
                              <TableCell align="left">No</TableCell>
                              <TableCell align="left">Jenis Denda</TableCell>
                              <TableCell align="left">Nilai</TableCell>
                              <TableCell align="left">Maksimal Hari</TableCell>
                              <TableCell align="left">Type Nilai</TableCell>
                            </TableRow>
                          </TableBody>
                          <TableBody>
                            {jsonData?.penalty_fine_data?.map((data, index) => (
                              <TableRow
                                key={data.id}
                                sx={{
                                  "&:last-child td, &:last-child th": {
                                    border: 0,
                                  },
                                }}
                              >
                                <TableCell component="th">
                                  {index + 1}
                                </TableCell>
                                <TableCell align="left" scope="row">
                                  {data.pinalty_name}
                                </TableCell>
                                <TableCell align="left">{data.nilai}</TableCell>
                                <TableCell align="left">
                                  {data.max_day}
                                </TableCell>
                                <TableCell align="left">
                                  {data.type_nilai}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
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
                              <TableCell align="left">Aksi</TableCell>
                            </TableRow>
                          </TableBody>
                          <TableBody>
                            {addendumRows.map((row, index) => (
                              <TableRow
                                key={row.name}
                                sx={{
                                  "&:last-child td, &:last-child th": {
                                    border: 0,
                                  },
                                }}
                              >
                                <TableCell component="th">
                                  {index + 1}
                                </TableCell>
                                <TableCell align="left" scope="row">
                                  {row.calories}
                                </TableCell>
                                <TableCell align="left">{row.fat}</TableCell>
                                <TableCell align="left">{row.carbs}</TableCell>
                                <TableCell align="left">
                                  {row.protein}
                                </TableCell>
                                <TableCell align="left">
                                  {actionButton}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </div>
                  </div>

                  {/* Klausul Perubahan */}
                  <div
                    className="clause-change-wrapper"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 14,
                      border: 1,
                      borderColor: "black",
                      borderStyle: "solid",
                      padding: 28,
                      borderRadius: 14,
                      // marginTop: 40
                    }}
                  >
                    <div>
                      <span
                        style={{
                          fontSize: 16,
                          fontWeight: 600,
                          color: "#2e1f22",
                        }}
                      >
                        B. Perubahan Klausul Kontrak Denda
                      </span>
                    </div>

                    <h1
                      style={{
                        fontWeight: 600,
                        fontSize: 16,
                        margin: 0,
                      }}
                    >
                      B.1 Body Kontrak
                    </h1>

                    <div>
                      <input
                        type="text"
                        placeholder="Masukkan Nomor Pasal"
                        style={{
                          padding: 8,
                          borderRadius: 4,
                          minWidth: 400,
                        }}
                      />
                    </div>

                    {/* Pasal */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 14,
                        // marginTop: 28
                      }}
                    >
                      {/* pasal sebelum addendum */}
                      <div>
                        <p
                          style={{
                            fontWeight: 500,
                            marginBottom: 14,
                          }}
                        >
                          Pasal Sebelum Addendum
                        </p>
                        <textarea rows="4" className="form-control"></textarea>
                      </div>

                      {/* pasal setelah addendum */}
                      <div>
                        <p
                          style={{
                            fontWeight: 500,
                            marginBottom: 14,
                          }}
                        >
                          Pasal Setelah Addendum
                        </p>
                        <textarea rows="4" className="form-control"></textarea>
                      </div>
                    </div>

                    <h1
                      style={{
                        fontWeight: 600,
                        fontSize: 16,
                        margin: 0,
                      }}
                    >
                      B.2 Lampiran
                    </h1>

                    <div>
                      <input
                        type="text"
                        placeholder="Masukkan Angka Lampiran"
                        style={{
                          padding: 8,
                          borderRadius: 4,
                          minWidth: 400,
                        }}
                      />
                    </div>

                    <div>
                      <textarea rows="4" className="form-control"></textarea>
                    </div>

                    <div>
                      <button
                        className="btn btn-primary text-white add-new-clause"
                        style={{
                          marginTop: 14,
                        }}
                      >
                        Tambah Klausul Lampiran
                      </button>
                    </div>
                  </div>

                  <UpdateButton />
                </Form>
              </Formik>
            </>
          )}

          {/* jaminan */}
          {currentActiveTab === 5 && (
            <>
              <Formik
                initialValues={{
                  dp_guarantee: "",
                  dp_guarantee_start_date: "",
                  dp_guarantee_end_date: "",
                  dp_guarantee_evidence_file: "",
                  implementation_guarantee: "",
                  implementation_guarantee_start_date: "",
                  implementation_guarantee_end_date: "",
                  implementation_guarantee_evidence_file: "",
                  maintenance_guarantee: "",
                  maintenance_guarantee_start_date: "",
                  maintenance_guarantee_end_data: "",
                  maintenance_guarantee_evidence_file: "",
                  // body_data: [],
                  // attachment_data: [],
                }}
                onSubmit={(values) => {
                  submitFormParameterGuarantee(values);
                }}
              >
                <Form>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      rowGap: 28,
                      border: 1,
                      borderStyle: "solid",
                      borderColor: "black",
                      borderRadius: 14,
                      padding: 28,
                      marginBottom: 40,
                    }}
                  >
                    {/* jaminan kontrak awal */}
                    <div>
                      <span
                        style={{
                          fontSize: 16,
                          fontWeight: 600,
                        }}
                      >
                        Jaminan Kontrak Awal
                      </span>
                    </div>

                    {/* jaminan uang muka */}
                    {guaranteeBeforeAddendum &&
                      guaranteeBeforeAddendum.map((data, index) => (
                        <>
                          <div>
                            <div
                              style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 30,
                                alignItems: "center",
                              }}
                            >
                              {/* jaminan uang muka */}
                              <p
                                style={{
                                  width: 150,
                                  margin: 0,
                                }}
                              >
                                {data.title}
                              </p>

                              {/* ya / tidak */}
                              <div
                                style={{
                                  display: "flex",
                                  gap: 14,
                                  alignItems: "center",
                                }}
                              >
                                <label
                                  style={{
                                    margin: 0,
                                    display: "flex",
                                    flexWrap: "wrap",
                                    alignItems: "center",
                                    columnGap: 8,
                                  }}
                                >
                                  <input
                                    type="radio"
                                    name={`${index}_down_payment_guarantee`}
                                    checked={data.radio === "yes"}
                                  />
                                  <span>Ya</span>
                                </label>

                                <label
                                  style={{
                                    margin: 0,
                                    display: "flex",
                                    flexWrap: "wrap",
                                    alignItems: "center",
                                    columnGap: 8,
                                  }}
                                >
                                  <input
                                    type="radio"
                                    name={`${index}_down_payment_guarantee`}
                                    checked={data.radio === "no"}
                                  />
                                  <span>Tidak</span>
                                </label>
                              </div>
                            </div>

                            {/* tanggal mulai, selesai, evidence */}
                            <div
                              style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 20,
                                marginTop: 15,
                              }}
                            >
                              {/* tanggal mulai */}
                              <div className="col-sm-3">
                                <label
                                  style={{
                                    margin: 0,
                                    display: "flex",
                                    flexDirection: "column",
                                  }}
                                >
                                  <span>Tanggal Mulai</span>
                                  <input
                                    type="date"
                                    style={{
                                      borderRadius: 4,
                                      padding: "10px 12px",
                                      border: "none",
                                      display: "flex",
                                      flexDirection: "row-reverse",
                                      columnGap: 10,
                                    }}
                                    value={data.startDate}
                                    disabled
                                  />
                                </label>
                              </div>

                              {/* tanggal selesai */}
                              <div className="col-sm-3">
                                <label
                                  style={{
                                    margin: 0,
                                    display: "flex",
                                    flexDirection: "column",
                                  }}
                                >
                                  <span>Tanggal Selesai</span>
                                  <input
                                    type="date"
                                    style={{
                                      borderRadius: 4,
                                      padding: "10px 12px",
                                      border: "none",
                                      display: "flex",
                                      flexDirection: "row-reverse",
                                      columnGap: 10,
                                    }}
                                    value={data.endDate}
                                    disabled
                                  />
                                </label>
                              </div>

                              {/* evidence */}
                              <div
                                className="col-md-5"
                                style={{
                                  padding: 0,
                                }}
                              >
                                <label
                                  style={{
                                    margin: 0,
                                    display: "flex",
                                    flexDirection: "column",
                                  }}
                                >
                                  <span>Evidence</span>
                                  <div>
                                    <label
                                      htmlFor="upload"
                                      className={`input-group mb-3 col-sm-12 pointer`}
                                      style={{
                                        padding: 0,
                                      }}
                                    >
                                      <span
                                        className={`form-control text-truncate`}
                                        style={{
                                          backgroundColor: "#e8f4fb",
                                        }}
                                      >
                                        {/* nama_file_upload.pdf */}
                                        {data.filename}
                                      </span>
                                      <div className="input-group-prepend">
                                        <span
                                          className="input-group-text"
                                          style={{
                                            backgroundColor: "#e8f4fb",
                                          }}
                                        >
                                          <i className="fas fa-file-upload"></i>
                                        </span>
                                      </div>
                                    </label>
                                    <input
                                      type="file"
                                      className="d-none"
                                      id="upload"
                                      style={{
                                        backgroundColor: "#E8F4FB",
                                      }}
                                      disabled
                                    />
                                  </div>
                                </label>
                              </div>
                            </div>
                          </div>
                        </>
                      ))}

                    {/* Addendum jaminan */}
                    <div>
                      <span
                        style={{
                          fontSize: 16,
                          fontWeight: 600,
                        }}
                      >
                        A. Addendum Jaminan
                      </span>
                    </div>

                    {guaranteeBeforeAddendum &&
                      guaranteeBeforeAddendum.map((data, index) => (
                        <>
                          <div>
                            <div
                              style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 30,
                                alignItems: "center",
                              }}
                            >
                              {/* jaminan uang muka */}
                              <p
                                style={{
                                  width: 150,
                                  margin: 0,
                                }}
                              >
                                {data.title}
                              </p>

                              {/* ya / tidak */}
                              <div
                                style={{
                                  display: "flex",
                                  gap: 14,
                                  alignItems: "center",
                                }}
                              >
                                <label
                                  style={{
                                    margin: 0,
                                    display: "flex",
                                    flexWrap: "wrap",
                                    alignItems: "center",
                                    columnGap: 8,
                                  }}
                                >
                                  <Field
                                    type="radio"
                                    value="1"
                                    name={data.nameTitle}
                                  />
                                  <span>Ya</span>
                                </label>

                                <label
                                  style={{
                                    margin: 0,
                                    display: "flex",
                                    flexWrap: "wrap",
                                    alignItems: "center",
                                    columnGap: 8,
                                  }}
                                >
                                  <Field
                                    type="radio"
                                    value="0"
                                    name={data.nameTitle}
                                  />
                                  <span>Tidak</span>
                                </label>
                              </div>
                            </div>

                            {/* tanggal mulai, selesai, evidence */}
                            <div
                              style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 20,
                                marginTop: 15,
                              }}
                            >
                              {/* tanggal mulai */}
                              <div className="col-sm-3">
                                <label
                                  style={{
                                    margin: 0,
                                    display: "flex",
                                    flexDirection: "column",
                                  }}
                                >
                                  <span>Tanggal Mulai</span>
                                  <Field
                                    type="date"
                                    style={{
                                      borderRadius: 4,
                                      padding: "10px 12px",
                                      border: "none",
                                      display: "flex",
                                      flexDirection: "row-reverse",
                                      columnGap: 10,
                                    }}
                                    name={data.nameStart}
                                  />
                                </label>
                              </div>

                              {/* tanggal selesai */}
                              <div className="col-sm-3">
                                <label
                                  style={{
                                    margin: 0,
                                    display: "flex",
                                    flexDirection: "column",
                                  }}
                                >
                                  <span>Tanggal Selesai</span>
                                  <Field
                                    type="date"
                                    style={{
                                      borderRadius: 4,
                                      padding: "10px 12px",
                                      border: "none",
                                      display: "flex",
                                      flexDirection: "row-reverse",
                                      columnGap: 10,
                                    }}
                                    name={data.nameEnd}
                                  />
                                </label>
                              </div>

                              {/* evidence */}
                              <div
                                className="col-md-5"
                                style={{
                                  padding: 0,
                                }}
                              >
                                <label
                                  style={{
                                    margin: 0,
                                    display: "flex",
                                    flexDirection: "column",
                                  }}
                                >
                                  <span>Evidence</span>
                                  <div>
                                    <label
                                      htmlFor="upload"
                                      className={`input-group mb-3 col-sm-12 pointer`}
                                      style={{
                                        padding: 0,
                                      }}
                                    >
                                      <span
                                        className={`form-control text-truncate`}
                                        style={{
                                          backgroundColor: "#e8f4fb",
                                        }}
                                      >
                                        {data.filename}
                                      </span>
                                      <div className="input-group-prepend">
                                        <span
                                          className="input-group-text"
                                          style={{
                                            backgroundColor: "#e8f4fb",
                                          }}
                                        >
                                          <i className="fas fa-file-upload"></i>
                                        </span>
                                      </div>
                                    </label>
                                    <input
                                      type="file"
                                      className="d-none"
                                      name={data.nameEvidence}
                                      // value={data.filename}
                                      filename={data.filename}
                                      id="upload"
                                      style={{
                                        backgroundColor: "#E8F4FB",
                                      }}
                                    />
                                  </div>
                                </label>
                              </div>
                            </div>
                          </div>
                        </>
                      ))}
                  </div>

                  {/* Klausul Perubahan */}
                  <div
                    className="clause-change-wrapper"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 14,
                      border: 1,
                      borderColor: "black",
                      borderStyle: "solid",
                      padding: 28,
                      borderRadius: 14,
                      // marginTop: 40
                    }}
                  >
                    <div>
                      <span
                        style={{
                          fontSize: 16,
                          fontWeight: 600,
                          color: "#2e1f22",
                        }}
                      >
                        B. Perubahan Klausul Kontrak Jaminan
                      </span>
                    </div>

                    <h1
                      style={{
                        fontWeight: 600,
                        fontSize: 16,
                        margin: 0,
                      }}
                    >
                      B.1 Body Kontrak
                    </h1>

                    <div>
                      <input
                        type="text"
                        placeholder="Masukkan Nomor Pasal"
                        style={{
                          padding: 8,
                          borderRadius: 4,
                          minWidth: 400,
                        }}
                      />
                    </div>

                    {/* Pasal */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 14,
                        // marginTop: 28
                      }}
                    >
                      {/* pasal sebelum addendum */}
                      <div>
                        <p
                          style={{
                            fontWeight: 500,
                            marginBottom: 14,
                          }}
                        >
                          Pasal Sebelum Addendum
                        </p>
                        <textarea rows="4" className="form-control"></textarea>
                      </div>

                      {/* pasal setelah addendum */}
                      <div>
                        <p
                          style={{
                            fontWeight: 500,
                            marginBottom: 14,
                          }}
                        >
                          Pasal Setelah Addendum
                        </p>
                        <textarea rows="4" className="form-control"></textarea>
                      </div>
                    </div>

                    <h1
                      style={{
                        fontWeight: 600,
                        fontSize: 16,
                        margin: 0,
                      }}
                    >
                      B.2 Lampiran
                    </h1>

                    <div>
                      <input
                        type="text"
                        placeholder="Masukkan Angka Lampiran"
                        style={{
                          padding: 8,
                          borderRadius: 4,
                          minWidth: 400,
                        }}
                      />
                    </div>

                    <div>
                      <textarea rows="4" className="form-control"></textarea>
                    </div>

                    <div>
                      <button
                        className="btn btn-primary text-white add-new-clause"
                        style={{
                          marginTop: 14,
                        }}
                      >
                        Tambah Klausul Lampiran
                      </button>
                    </div>
                  </div>

                  <UpdateButton />
                </Form>
              </Formik>
            </>
          )}

          {/* nomor rekening */}
          {currentActiveTab === 6 && (
            <>
              <Formik
                initialValues={{
                  data_bank: [],
                  body_data: [],
                  attachment_data: [],
                }}
              >
                <Form>
                  {/* <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      rowGap: 40,
                    }}
                  > */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 14,
                      border: 1,
                      borderColor: "black",
                      borderStyle: "solid",
                      padding: 28,
                      borderRadius: 14,
                      marginBottom: 40,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        rowGap: 24,
                      }}
                    >
                      <div>
                        <h1
                          style={{
                            fontSize: 16,
                            fontWeight: 600,
                            marginBottom: 14,
                          }}
                        >
                          Nomor rekening kontrak awal
                        </h1>

                        <div
                          style={{
                            // display: 'grid',
                            // gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 24,
                            fontSize: 14,
                            fontWeight: 500,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              flex: 1,
                            }}
                          >
                            <span>Nomor rekening</span>
                            <input
                              type="text"
                              style={{
                                width: "100%",
                                backgroundColor: "#e8f4fb",
                                padding: "10px 12px",
                                borderColor: "black",
                                border: 1,
                                borderStyle: "solid",
                                borderRadius: 4,
                                fontSize: 14,
                                fontWeight: 500,
                                marginTop: 4,
                              }}
                              disabled
                              value={"128574647483"}
                            />
                          </div>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              flex: 1,
                            }}
                          >
                            <span>Nama rekening</span>
                            <input
                              type="text"
                              style={{
                                width: "100%",
                                backgroundColor: "#e8f4fb",
                                padding: "10px 12px",
                                borderColor: "black",
                                border: 1,
                                borderStyle: "solid",
                                borderRadius: 4,
                                fontSize: 14,
                                fontWeight: 500,
                                marginTop: 4,
                              }}
                              disabled
                              value={"GOLDEN PRATAMA ENGINEERING"}
                            />
                          </div>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              flex: 1,
                            }}
                          >
                            <span>Nama bank</span>
                            <input
                              type="text"
                              style={{
                                width: "100%",
                                backgroundColor: "#e8f4fb",
                                padding: "10px 12px",
                                borderColor: "black",
                                border: 1,
                                borderStyle: "solid",
                                borderRadius: 4,
                                fontSize: 14,
                                fontWeight: 500,
                                marginTop: 4,
                              }}
                              disabled
                              value={"MANDIRI"}
                            />
                          </div>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              flex: 1,
                            }}
                          >
                            <span>Alamat bank</span>
                            <input
                              type="text"
                              style={{
                                width: "100%",
                                backgroundColor: "#e8f4fb",
                                padding: "10px 12px",
                                borderColor: "black",
                                border: 1,
                                borderStyle: "solid",
                                borderRadius: 4,
                                fontSize: 14,
                                fontWeight: 500,
                                marginTop: 4,
                              }}
                              disabled
                              value={"Jl Warung Buncit Raya"}
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <h1
                          style={{
                            fontSize: 16,
                            fontWeight: 600,
                            marginBottom: 14,
                          }}
                        >
                          A. Addendum nomor rekening
                        </h1>

                        <div
                          style={{
                            // display: 'grid',
                            // gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 24,
                            fontSize: 14,
                            fontWeight: 500,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              flex: 1,
                            }}
                          >
                            <span>Nomor rekening</span>
                            <ReactSelect
                              data={jsonData?.data_bank}
                              func={changeDataBankIndex}
                              labelName={`account_number`}
                            />
                          </div>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              flex: 1,
                            }}
                          >
                            <span>Nama rekening</span>
                            <input
                              type="text"
                              style={{
                                width: "100%",
                                padding: "10px 12px",
                                borderColor: "black",
                                border: 1,
                                borderStyle: "solid",
                                borderRadius: 4,
                                fontSize: 14,
                                fontWeight: 500,
                                marginTop: 4,
                              }}
                              disabled
                              value={
                                jsonData?.data_bank[bankIndex]
                                  ?.account_holder_name
                              }
                            />
                          </div>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              flex: 1,
                            }}
                          >
                            <span>Nama bank</span>
                            <input
                              type="text"
                              style={{
                                width: "100%",
                                padding: "10px 12px",

                                borderColor: "black",
                                border: 1,
                                borderStyle: "solid",
                                borderRadius: 4,
                                fontSize: 14,
                                fontWeight: 500,
                                marginTop: 4,
                              }}
                              disabled
                              value={
                                jsonData?.data_bank[bankIndex]?.bank.full_name
                              }
                            />
                          </div>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              flex: 1,
                            }}
                          >
                            <span>Alamat bank</span>
                            <input
                              type="text"
                              style={{
                                width: "100%",
                                padding: "10px 12px",
                                borderColor: "black",
                                border: 1,
                                borderStyle: "solid",
                                borderRadius: 4,
                                fontSize: 14,
                                fontWeight: 500,
                                marginTop: 4,
                              }}
                              disabled
                              value={
                                jsonData?.data_bank[bankIndex]?.address
                                  ?.postal_address
                              }
                            />
                          </div>
                        </div>
                      </div>

                      {/* surat pernyataan dari bank */}
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                          gap: 24,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <span
                            style={{
                              fontSize: 14,
                              fontWeight: 500,
                            }}
                          >
                            Surat pernyataan dari bank
                          </span>
                          <div
                            style={{
                              position: "relative",
                              padding: 0,
                              margin: 0,
                            }}
                          >
                            <input
                              style={{
                                width: "100%",
                                padding: "10px 12px 10px 46px",
                                color: "#3699ff",
                                borderColor: "black",
                                border: 1,
                                borderStyle: "solid",
                                borderRadius: 4,
                                fontSize: 14,
                                fontWeight: 500,
                                marginTop: 4,
                              }}
                              type="text"
                              value={`surat_pernyataan_bank_bca.pdf`}
                              disabled
                            />
                            <SVG
                              style={{
                                position: "absolute",
                                top: 0,
                                bottom: 0,
                                left: 12,
                                margin: "auto 0",
                                // width:10,
                                // height:10
                              }}
                              src={toAbsoluteUrl(
                                "/media/svg/icons/All/upload.svg"
                              )}
                            />
                          </div>

                          {/* <div>
                                                        <label
                                                            htmlFor="upload"
                                                            className={`input-group mb-3 col-sm-3 pointer`}
                                                            style={{
                                                                padding: 0
                                                            }}
                                                        >
                                                            <span
                                                                            className={`form-control text-truncate`} 
                                                                            style={{
                                                                                backgroundColor: '#e8f4fb'
                                                                            }}
                                                                            >
                                                                            nama_file_upload.pdf
                                                            </span>
                                                            <div 
                                                                                className="input-group-prepend"
                                                                            >
                                                                                <span className="input-group-text"
                                                                                    style={{
                                                                                        backgroundColor: '#e8f4fb'
                                                                                    }}    
                                                                                >
                                                                                <i className="fas fa-file-upload"></i>
                                                                                </span>
                                                            </div>
                                                        </label>
                                                        <input
                                                            type="file"
                                                            className="d-none"
                                                            id="upload"
                                                            style={{
                                                                backgroundColor: '#E8F4FB'
                                                            }}
                                                        />
                                                    </div> */}
                        </div>
                        <div></div>
                      </div>
                    </div>
                  </div>

                  {/* Klausul Perubahan */}
                  <div
                    className="clause-change-wrapper"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 14,
                      border: 1,
                      borderColor: "black",
                      borderStyle: "solid",
                      padding: 28,
                      borderRadius: 14,
                      // marginTop: 40
                    }}
                  >
                    <div>
                      <span
                        style={{
                          fontSize: 16,
                          fontWeight: 600,
                          color: "#2e1f22",
                        }}
                      >
                        B. Perubahan Klausul Kontrak Nomor Rekening
                      </span>
                    </div>

                    <h1
                      style={{
                        fontWeight: 600,
                        fontSize: 16,
                        margin: 0,
                      }}
                    >
                      B.1 Body Kontrak
                    </h1>

                    <div>
                      <input
                        type="text"
                        placeholder="Masukkan Nomor Pasal"
                        style={{
                          padding: 8,
                          borderRadius: 4,
                          minWidth: 400,
                        }}
                      />
                    </div>

                    {/* Pasal */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 14,
                        // marginTop: 28
                      }}
                    >
                      {/* pasal sebelum addendum */}
                      <div>
                        <p
                          style={{
                            fontWeight: 500,
                            marginBottom: 14,
                          }}
                        >
                          Pasal Sebelum Addendum
                        </p>
                        <textarea rows="4" className="form-control"></textarea>
                      </div>

                      {/* pasal setelah addendum */}
                      <div>
                        <p
                          style={{
                            fontWeight: 500,
                            marginBottom: 14,
                          }}
                        >
                          Pasal Setelah Addendum
                        </p>
                        <textarea rows="4" className="form-control"></textarea>
                      </div>
                    </div>

                    <h1
                      style={{
                        fontWeight: 600,
                        fontSize: 16,
                        margin: 0,
                      }}
                    >
                      B.2 Lampiran
                    </h1>

                    <div>
                      <input
                        type="text"
                        placeholder="Masukkan Angka Lampiran"
                        style={{
                          padding: 8,
                          borderRadius: 4,
                          minWidth: 400,
                        }}
                      />
                    </div>

                    <div>
                      <textarea rows="4" className="form-control"></textarea>
                    </div>

                    <div>
                      <button
                        className="btn btn-primary text-white add-new-clause"
                        style={{
                          marginTop: 14,
                        }}
                      >
                        Tambah Klausul Lampiran
                      </button>
                    </div>
                  </div>

                  <UpdateButton />
                  {/* </div> */}
                </Form>
              </Formik>
            </>
          )}

          {/* lainnya */}
          {currentActiveTab === 7 && (
            <>
              {/* Klausul Perubahan */}
              <div
                className="clause-change-wrapper"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                  border: 1,
                  borderColor: "black",
                  borderStyle: "solid",
                  padding: 28,
                  borderRadius: 14,
                  // marginTop: 40
                }}
              >
                <div>
                  <span
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      color: "#2e1f22",
                    }}
                  >
                    A. Perubahan Klausul Kontrak Lainnya
                  </span>
                </div>

                <h1
                  style={{
                    fontWeight: 600,
                    fontSize: 16,
                    margin: 0,
                  }}
                >
                  A.1 Body Kontrak
                </h1>

                <div>
                  <input
                    type="text"
                    placeholder="Masukkan Nomor Pasal"
                    style={{
                      padding: 8,
                      borderRadius: 4,
                      minWidth: 400,
                    }}
                  />
                </div>

                {/* Pasal */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 14,
                    // marginTop: 28
                  }}
                >
                  {/* pasal sebelum addendum */}
                  <div>
                    <p
                      style={{
                        fontWeight: 500,
                        marginBottom: 14,
                      }}
                    >
                      Pasal Sebelum Addendum
                    </p>
                    <textarea rows="4" className="form-control"></textarea>
                  </div>

                  {/* pasal setelah addendum */}
                  <div>
                    <p
                      style={{
                        fontWeight: 500,
                        marginBottom: 14,
                      }}
                    >
                      Pasal Setelah Addendum
                    </p>
                    <textarea rows="4" className="form-control"></textarea>
                  </div>
                </div>

                <h1
                  style={{
                    fontWeight: 600,
                    fontSize: 16,
                    margin: 0,
                  }}
                >
                  A.2 Lampiran
                </h1>

                <div>
                  <input
                    type="text"
                    placeholder="Masukkan Angka Lampiran"
                    style={{
                      padding: 8,
                      borderRadius: 4,
                      minWidth: 400,
                    }}
                  />
                </div>

                <div>
                  <textarea rows="4" className="form-control"></textarea>
                </div>

                <div>
                  <button
                    className="btn btn-primary text-white add-new-clause"
                    style={{
                      marginTop: 14,
                    }}
                  >
                    Tambah Klausul Lampiran
                  </button>
                </div>
              </div>
            </>
          )}
        </CardBody>
      </Card>
    </>
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
});

const mapDispatch = {
  fetch_api_sg,
};

export default connect(mapState, mapDispatch)(FormParameter);
