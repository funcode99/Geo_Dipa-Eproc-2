import React from "react";

import { useState, useEffect } from "react";
import CustomTableCell from "../CustomTableCell";
import CollapsibleRow from "../CollapsibleRow";
import DialogGlobal from "app/components/modals/DialogGlobal";
import { Formik, Field, Form } from "formik";
import ButtonAction from "app/components/buttonAction/ButtonAction";
import CurrencyInput from "react-currency-input-field";

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

const createChildData = (
  product_name,
  qty,
  uom,
  unit_price,
  subtotal,
  note
) => ({
  id: product_name.replace(" ", "_"),
  product_name,
  qty,
  uom,
  unit_price,
  subtotal,
  note,
  isEditMode: false,
});

const createNewData = (product_name, qty, uom, unit_price, subtotal, note) => ({
  id: product_name.replace(" ", "_"),
  product_name,
  qty,
  uom,
  unit_price,
  subtotal,
  note,
  isEditMode: false,
  item_detail: [],
});

const EditableTable = ({ openCloseAddDetail, previousData, func }) => {
  const [rows, setRows] = useState(previousData);
  const [previous, setPrevious] = React.useState({});
  const classes = useStyles();

  useEffect(() => {
    func(rows);
  }, [rows]);

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

  // const onRevert = (id) => {
  // const newRows = rows.map((row) => {

  //   console.log('isi previous', previous)

  //   if (row.id === id) {
  //     return previous[id] ? previous[id] : row;
  //   }
  //   return row;
  // });
  // console.log('isi previous', previous[id])
  // console.log('isi new rows', newRows)
  // setRows(newRows);
  // setPrevious((state) => {
  //   delete state[id];
  //   return state;
  // });
  // onToggleEditMode(id);
  // };

  const onAddMode = (a, b, c, d, e, f) => {
    setRows((state) => [...state, createNewData(a, b, c, d, e, f)]);
  };

  const onToggleEditChildMode = (id, index) => {
    setRows((prev) => {
      const newState = prev;
      const changedData = rows[index].item_detail.map((row) => {
        if (row.id === id) {
          return { ...row, isEditMode: !row.isEditMode };
        }
        return row;
      });
      newState[index].item_detail = changedData;
      return [...newState];
    });
  };

  const onDeleteChildMode = (childId, index) => {
    // akhirnya bisa juga ngentiaw
    setRows((prev) => {
      const newState = prev;
      const items = rows[index].item_detail.filter(
        (variant) => variant.id !== childId
      );
      console.log("setelah filter", items);
      newState[index].item_detail = items;
      return [...newState];
    });
  };

  const onChangeChild = (e, row, parentIndex, childIndex) => {
    console.log("isi row di onchangechild", row);
    // OALAH TERNYATA DISINI CARA PAKAI OBJEK SEBAGAI NAMA PROPERTI
    if (!previous[row.id]) {
      setPrevious((state) => ({ ...state, [row.id]: row }));
    }

    const value = e.target.value;
    const name = e.target.name;
    const { id } = row;
    const newRows = rows[parentIndex].item_detail.map((item) => {
      if (name === "unit_price" || name === "qty") {
        let newSubtotal = parseInt(row.qty) + parseInt(row.unit_price);
        return {
          ...row,
          subtotal: newSubtotal,
          [name]: parseInt(value),
        };
      } else {
        return { ...row, [name]: value };
      }
    });

    console.log("isi new rows", newRows);

    setRows((prev) => {
      const newState = prev;
      newState[parentIndex].item_detail = newRows;
      return [...newState];
    });
  };

  const onAddChildMode = (parentId, index) => {
    let result = rows.map((row) => {
      if (row.id === parentId) {
        if (row.item_detail) {
          console.log("masuk ke kondisi 1 (kedua)");
          return {
            ...row,
            item_detail: [
              ...row.item_detail,
              createChildData("Pudding", 60, "mL", 60, 6000, "isi keterangan"),
            ],
          };
        } else {
          console.log("masuk ke kondisi 2 (pertama)");
          return {
            ...row,
            item_detail: [
              createChildData(
                "Pudding",
                60,
                "L",
                12000,
                24000,
                "isi keterangan"
              ),
            ],
          };
        }
      }
      // wajib ada, kalo gak ada bakal error
      return row;
    });
    setRows(result);
  };

  // const onRevertChild = (id, index) => {
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

  // onToggleEditChildMode(id, index);
  // };

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
            product_name: "",
            qty: "",
            uom: "",
            unit_price: "",
            subtotal: "",
            note: "",
          }}
          onSubmit={(values) => {
            onAddMode(
              values?.product_name,
              values?.qty,
              values?.uom,
              values?.unit_price,
              values?.subtotal,
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
                        name="product_name"
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
                        disableGroupSeparators={true}
                        type="text"
                        name="qty"
                        style={{
                          padding: 8,
                          borderRadius: 4,
                          border: 1,
                          borderStyle: "solid",
                          borderColor: "#8c8a8a",
                          opacity: 0.8,
                        }}
                        defaultValue={0}
                        decimalsLimit={0}
                        onValueChange={(value) => console.log(value)}
                        component={CurrencyInput}
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
                        disableGroupSeparators={true}
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
                        defaultValue={0}
                        decimalsLimit={0}
                        onValueChange={(value) => console.log(value)}
                        component={CurrencyInput}
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
                        defaultValue={0}
                        decimalsLimit={2}
                        decimalSeparator=","
                        groupSeparator="."
                        onValueChange={(value) => console.log(value)}
                        component={CurrencyInput}
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
                        name="subtotal"
                        style={{
                          padding: 8,
                          borderRadius: 4,
                          border: 1,
                          borderStyle: "solid",
                          borderColor: "#8c8a8a",
                          opacity: 0.8,
                        }}
                        defaultValue={0}
                        decimalsLimit={2}
                        decimalSeparator=","
                        groupSeparator="."
                        onValueChange={(value) => console.log(value)}
                        component={CurrencyInput}
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
            {rows?.map((row, index) =>
              row?.item_detail ? (
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
                    // onRevert={onRevert}
                    // onRevertChild={onRevertChild}
                    onToggleEditChildMode={onToggleEditChildMode}
                    onToggleEditMode={onToggleEditMode}
                    parentIndex={index + 1}
                  />
                </>
              ) : (
                <>
                  {/* selalu masuk kesini diawal */}
                  {/* kalo pake tablerow gak rapih */}
                  <TableRow key={row.id}>
                    <TableCell align="left" className={classes.tableCell}>
                      {index + 1}
                    </TableCell>
                    <CustomTableCell
                      {...{ row, name: "product_name", onChange }}
                    />
                    <CustomTableCell {...{ row, name: "qty", onChange }} />
                    <CustomTableCell {...{ row, name: "uom", onChange }} />
                    <CustomTableCell
                      {...{ row, name: "unit_price", onChange }}
                    />
                    <CustomTableCell {...{ row, name: "subtotal", onChange }} />
                    <CustomTableCell {...{ row, name: "note", onChange }} />
                    <TableCell className={classes.selectTableCell}>
                      {row.isEditMode ? (
                        <>
                          <IconButton
                            aria-label="done"
                            onClick={() => onToggleEditMode(row.id)}
                          >
                            <DoneIcon />
                          </IconButton>
                          {/* <IconButton
                            aria-label="revert"
                            onClick={() => onRevert(row.id)}
                          >
                            <RevertIcon />
                          </IconButton> */}
                        </>
                      ) : (
                        <ButtonAction
                          handleAction={(a, b, c) => {
                            if (c === "Hapus") {
                              onDeleteMode(row.id);
                            } else if (c === "Edit") {
                              onToggleEditMode(row.id);
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
