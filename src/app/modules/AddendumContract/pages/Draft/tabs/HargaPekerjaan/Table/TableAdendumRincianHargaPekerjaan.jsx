import CollapsibleRow from "../CollapsibleRow";
import CustomTableCell from "../CustomTableCell";
import React, { useState, useEffect } from "react";
import IconButton from "@material-ui/core/IconButton";
import DoneIcon from "@material-ui/icons/DoneAllTwoTone";
import ButtonAction from "app/components/buttonAction/ButtonAction";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  Paper,
} from "@material-ui/core";

const TableAdendumRincianHargaPekerjaanAwal = ({
  openCloseAddDetail,
  previousData,
  func,
  grandTotal,
}) => {
  const createChildData = (
    product_name,
    qty,
    uom,
    unit_price,
    subtotal,
    note,
    row
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

  const createNewData = (
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
    item_detail: [],
  });
  let jobPriceData = previousData;
  const [init, setInit] = useState(0);
  let parsedJobPrice = null;
  if (init === 0) {
    parsedJobPrice = jobPriceData.map((item) => {
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
  const [rows, setRows] = useState(result);
  const [previous, setPrevious] = React.useState({});
  const classes = useStyles();

  useEffect(() => {
    func(rows);
  }, [rows]);

  const onToggleEditMode = (id) => {
    setRows((state) => {
      return rows.map((row) => {
        if (row.id === id) {
          return { ...row, isEditMode: !row.isEditMode };
        }
        return row;
      });
    });
  };

  const onDeleteMode = (index) => {
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

  const onAddMode = (a, b, c, d, e, f, g) => {
    setRows((state) => [...state, createNewData(a, b, c, d, e, f, g)]);
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
          return total + Math.round(data.subtotal);
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
      newState[index].qty = changedParentQuantity;
      return [...newState];
    });
  };

  const onDeleteChildMode = (childIndex, index) => {
    setRows((prev) => {
      const newState = prev;
      newState[index].item_detail.splice(childIndex, 1);
      let changedParentSubtotal = "";
      let changedParentQuantity = "";
      if (newState[index].item_detail) {
        function sum(total, data) {
          return total + Math.round(data.subtotal);
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
      newState[index].qty = changedParentQuantity;
      return [...newState];
    });
  };

  const onChangeChild = (e, row, parentIndex, childIndex) => {
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
            subtotal: newSubtotal,
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
      return row;
    });
    setRows(result);
  };
  return (
    <>
      <Paper className={classes.root}>
        <Table className={classes.table} aria-label="caption table">
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
                    onToggleEditChildMode={onToggleEditChildMode}
                    onToggleEditMode={onToggleEditMode}
                    parentIndex={index + 1}
                  />
                </>
              ) : (
                <>
                  <TableRow key={row.id}>
                    <TableCell>{index + 1}</TableCell>
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
                        </>
                      ) : (
                        <ButtonAction
                          handleAction={(a, b, c) => {
                            if (c === "Hapus") {
                              onDeleteMode(index);
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
export default TableAdendumRincianHargaPekerjaanAwal;
