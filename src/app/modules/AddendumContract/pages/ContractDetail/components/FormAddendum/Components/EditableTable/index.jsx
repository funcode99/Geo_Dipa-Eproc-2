import React from "react";

import { useState, useEffect } from "react";
import CustomTableCell from "../CustomTableCell";
import CollapsibleRow from "../CollapsibleRow";
import DialogGlobal from "app/components/modals/DialogGlobal";
import { Formik, Field, Form } from "formik";
import ButtonAction from "app/components/buttonAction/ButtonAction";

import IconButton from "@material-ui/core/IconButton";
import DoneIcon from "@material-ui/icons/DoneAllTwoTone";

import CurrencyInput from "react-currency-input-field";
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

const createChildData = (item_name, qty, uom, unit_price, total, note) => ({
  id: item_name.replace(" ", "_"),
  item_name,
  qty,
  uom,
  unit_price,
  total,
  note,
  isEditMode: false,
});

const createNewData = (
  product_title,
  qty_total,
  uom,
  unit_price,
  subtotal,
  note
) => ({
  id: product_title.replace(" ", "_"),
  product_title,
  qty_total,
  uom,
  unit_price,
  subtotal,
  note,
  isEditMode: false,
  item_detail: [],
});

const EditableTable = ({
  openCloseAddDetail,
  previousData,
  func,
  grandTotal,
  jobPriceCurrent,
  isDisable,
}) => {
  let jobPriceData = jobPriceCurrent;
  console.log("isi jobPriceData", jobPriceData);
  const [init, setInit] = useState(0);
  let parsedJobPrice = null;
  if (init === 0) {
    parsedJobPrice = jobPriceData?.items?.map((item) => {
      return {
        ...item,
        subtotal: Math.round(item?.subtotal),
        unit_price: Math.round(item?.unit_price),
        item_detail: [],
      };
    });
    setInit(1);
  }
  let result = parsedJobPrice;
  console.log("parsedJobPrice", parsedJobPrice);
  const [rows, setRows] = useState(result);
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

  const onDeleteMode = (index) => {
    console.log("masuk ke delete mode");
    setRows((prev) => {
      const newState = [...prev];
      newState.splice(index, 1);
      return newState;
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

  const onAddMode = (a, b, c, d, e, f, g) => {
    setRows((state) => {
      if (typeof state === "undefined") {
        return [createNewData(a, b, c, d, e, f, g)];
      } else {
        return [...state, createNewData(a, b, c, d, e, f, g)];
      }
      console.log(state);
    });
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
      let changedParentSubtotal = "";
      let changedParentQuantity = "";
      if (newState[index].item_detail) {
        function sum(total, data) {
          return total + Math.round(data.total);
        }
        function sumQuantity(total, data) {
          return total + Math.round(data.qty);
        }
        changedParentSubtotal = newState[index].item_detail.reduce(sum, 0);
        changedParentQuantity = newState[index].item_detail.reduce(
          sumQuantity,
          0
        );
      }
      newState[index].subtotal = changedParentSubtotal;
      newState[index].qty_total = changedParentQuantity;
      return [...newState];
    });
  };

  const onDeleteChildMode = (childIndex, index) => {
    // akhirnya bisa juga ngentiaw
    setRows((prev) => {
      const newState = prev;
      newState[index].item_detail.splice(childIndex, 1);
      // const items = rows[index].item_detail.filter(
      //   (variant) => variant.id !== childId
      // );
      // console.log("setelah filter", items);
      // newState[index].item_detail = items;
      let changedParentSubtotal = "";
      let changedParentQuantity = "";
      if (newState[index].item_detail) {
        function sum(total, data) {
          return total + Math.round(data.total);
        }
        function sumQuantity(total, data) {
          return total + Math.round(data.qty);
        }
        changedParentSubtotal = newState[index].item_detail.reduce(sum, 0);
        changedParentQuantity = newState[index].item_detail.reduce(
          sumQuantity,
          0
        );
      }
      newState[index].subtotal = changedParentSubtotal;
      newState[index].qty_total = changedParentQuantity;
      return [...newState];
    });
  };

  const onChangeChild = (e, row, parentIndex, childIndex) => {
    // console.log("isi row di onchangechild", row);
    // OALAH TERNYATA DISINI CARA PAKAI OBJEK SEBAGAI NAMA PROPERTI
    if (!previous[row.id]) {
      setPrevious((state) => ({ ...state, [row.id]: row }));
    }

    const value = e.target.value === "" ? 0 : e.target.value;
    const name = e.target.name;
    const newRows = rows[parentIndex].item_detail.map((item, index) => {
      if (index === childIndex) {
        if (name === "unit_price" || name === "qty") {
          let newSubtotal = parseInt(row.qty) * parseInt(row.unit_price);
          return {
            ...row,
            total: newSubtotal,
            [name]: parseInt(value),
          };
        } else {
          return {
            ...row,
            [name]: value,
          };
        }
      } else {
        return {
          ...item,
        };
      }
    });

    setRows((prev) => {
      const newState = prev;
      newState[parentIndex].item_detail = newRows;
      return [...newState];
    });
  };

  const onAddChildMode = (parentId, index) => {
    console.log("masuk ke fungsi onaddchildmode", parentId);
    let result = rows.map((row) => {
      if (row.id === parentId) {
        if (row.item_detail) {
          console.log("masuk ke kondisi 1 (kedua)");
          return {
            ...row,
            item_detail: [
              ...row.item_detail,
              createChildData("Item 1", 0, "mL", 0, 0, "Keterangan", row),
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
                "isi keterangan",
                row
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

  // const [grandTotal, setGrandTotal] = useState(0);

  // useEffect(() => {
  //   function sum(total, data) {
  //     return total + Math.round(data.subtotal);
  //   }
  //   // grandTotal = rows.reduce(sum, 0);
  //   setGrandTotal(rows?.reduce(sum, 0));
  //   console.log("grandTotal", grandTotal);
  // }, [rows]);

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
            product_title: "",
            qty_total: "",
            uom: "",
            unit_price: "",
            subtotal: "",
            note: "",
            item_detail: [],
          }}
          onSubmit={(values) => {
            onAddMode(
              values?.product_title,
              values?.qty_total,
              values?.uom,
              values?.unit_price,
              values?.subtotal,
              values?.note,
              values?.item_detail
            );
            openCloseAddDetail.current.close();
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
                        name="product_title"
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

                    {/* <div
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
                    </div> */}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 14,
                      flex: 1,
                    }}
                  >
                    {/* <div
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
                    </div> */}

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
          {/* <TableBody>
            <TableRow>
            </TableRow>
          </TableBody> */}
          {/* <TableCell align="1">No.</TableCell> */}
          {/* <TableCell align="left">No.</TableCell> */}

          <TableBody>
            <TableRow>
              <TableCell>No.</TableCell>
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
                    <TableCell>{index + 1}</TableCell>
                    <CustomTableCell
                      {...{
                        row,
                        name: "product_title",
                        onChange,
                      }}
                    />
                    <CustomTableCell
                      {...{ row, name: "qty_total", onChange }}
                    />
                    <CustomTableCell {...{ row, name: "uom", onChange }} />
                    <CustomTableCell
                      {...{ row, name: "unit_price", onChange }}
                    />
                    <CustomTableCell {...{ row, name: "subtotal", onChange }} />
                    <CustomTableCell {...{ row, name: "note", onChange }} />
                    <TableCell className={classes.selectTableCell}>
                      {row.isEditMode || isDisable ? (
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
                          handleAction={(type, data, label) => {
                            console.log("masuk ke handleAction", label);
                            if (label === "Delete") {
                              onDeleteMode(index);
                            } else if (label === "Edit") {
                              onToggleEditMode(row.id);
                            } else if (label === "Add Sub Item") {
                              onAddChildMode(row.id, index);
                            }
                          }}
                          ops={[
                            {
                              label: "JOB_PRICE.TABLE_ACTION.EDIT",
                            },
                            {
                              label: "JOB_PRICE.TABLE_ACTION.DELETE",
                            },
                            {
                              label: "JOB_PRICE.TABLE_ACTION.ADD_SUB_ITEM",
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

          <TableBody>
            <TableRow>
              <TableCell colSpan={5}>Grand Total</TableCell>
              <TableCell colSpan={3}>{grandTotal}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>
    </>
  );
};

export default EditableTable;
