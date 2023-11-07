import React from "react";

import CustomTableCell from "../CustomTableCell";
import CollapsibleRow from "../CollapsibleRow";
import DialogGlobal from "app/components/modals/DialogGlobal";
import { Formik, Field, Form } from "formik";
import ButtonAction from "app/components/buttonAction/ButtonAction";

import IconButton from "@material-ui/core/IconButton";
import DoneIcon from "@material-ui/icons/DoneAllTwoTone";
import RevertIcon from "@material-ui/icons/NotInterestedOutlined";

import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  Paper,
} from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";
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

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

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

const EditableTable = ({ openCloseAddDetail }) => {
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
};

export default EditableTable;