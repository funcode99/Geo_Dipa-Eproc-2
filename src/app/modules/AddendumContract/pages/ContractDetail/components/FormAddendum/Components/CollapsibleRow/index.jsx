import React from "react";
import useCollapse from "react-collapsed";
import { TableCell, TableRow } from "@material-ui/core";

import ButtonAction from "app/components/buttonAction/ButtonAction";
import Input from "@material-ui/core/Input";
import IconButton from "@material-ui/core/IconButton";
import DoneIcon from "@material-ui/icons/DoneAllTwoTone";
import RevertIcon from "@material-ui/icons/NotInterestedOutlined";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";

import CustomTableCell from "../CustomTableCell";

// const { useCollapse } = require("react-collapsed");

const CollapsibleRow = ({
  classes,
  index,
  onAddMode,
  onAddChildMode,
  onChange,
  onChangeChild,
  onDeleteMode,
  onDeleteChildMode,
  // onRevert,
  // onRevertChild,
  onToggleEditMode,
  onToggleEditChildMode,
  row,
  parentIndex,
}) => {
  // console.log("isi row", row);

  const { getCollapseProps, getToggleProps, isExpanded } = useCollapse();

  return (
    <>
      {/* parent table */}
      <TableRow>
        <TableCell
          sx={{
            width: 130,
            height: 40,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {`${index + 1}`}
            {/* it work like a charm! */}
            {row.item_detail.length > 0 && (
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
        <CustomTableCell {...{ row, name: "product_name", onChange }} />
        <CustomTableCell
          {...{ row, name: "qty", onChange, isDisabled: true }}
        />
        <CustomTableCell {...{ row, name: "uom", onChange }} />
        <CustomTableCell {...{ row, name: "unit_price", onChange }} />
        <CustomTableCell
          {...{ row, name: "subtotal", onChange, isDisabled: true }}
        />
        <CustomTableCell {...{ row, name: "note", onChange }} />
        {row.isEditMode ? (
          <TableCell>
            <IconButton
              aria-label="done"
              onClick={() => onToggleEditMode(row.id)}
            >
              <DoneIcon />
            </IconButton>
            {/* <IconButton aria-label="revert" onClick={() => onRevert(row.id)}>
              <RevertIcon />
            </IconButton> */}
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
                {
                  label: "Tambah Sub Item",
                },
              ]}
            ></ButtonAction>
          </TableCell>
        )}
      </TableRow>

      {/* children table */}
      {row?.item_detail &&
        row.item_detail.map((data, childIndex) => (
          <TableRow key={index} {...getCollapseProps()}>
            <TableCell
              sx={{
                width: 130,
                height: 40,
              }}
            >
              {parentIndex}.{childIndex + 1}
            </TableCell>
            <TableCell align="left" className={classes.tableCell}>
              {data.isEditMode ? (
                <Input
                  value={data.product_name}
                  name={"product_name"}
                  onChange={(e) => onChangeChild(e, data, index, childIndex)}
                  onKeyUp={(e) => onChangeChild(e, data, index, childIndex)}
                  className={classes.input}
                />
              ) : (
                data.product_name
              )}
            </TableCell>
            <TableCell align="left" className={classes.tableCell}>
              {data.isEditMode ? (
                <Input
                  value={data.qty}
                  name={"qty"}
                  onChange={(e) => onChangeChild(e, data, index, childIndex)}
                  onKeyUp={(e) => onChangeChild(e, data, index, childIndex)}
                  className={classes.input}
                />
              ) : (
                data.qty
              )}
            </TableCell>
            <TableCell align="left" className={classes.tableCell}>
              {data.isEditMode ? (
                <Input
                  value={data.uom}
                  name={"uom"}
                  onChange={(e) => onChangeChild(e, data, index, childIndex)}
                  onKeyUp={(e) => onChangeChild(e, data, index, childIndex)}
                  className={classes.input}
                />
              ) : (
                data.uom
              )}
            </TableCell>
            <TableCell align="left" className={classes.tableCell}>
              {data.isEditMode ? (
                <Input
                  value={data.unit_price}
                  name={"unit_price"}
                  onChange={(e) => onChangeChild(e, data, index, childIndex)}
                  onKeyUp={(e) => onChangeChild(e, data, index, childIndex)}
                  className={classes.input}
                />
              ) : (
                data.unit_price
              )}
            </TableCell>
            <TableCell align="left" className={classes.tableCell}>
              {data.subtotal}
            </TableCell>
            <TableCell align="left" className={classes.tableCell}>
              {data.isEditMode ? (
                <Input
                  value={data.note}
                  name={"note"}
                  onChange={(e) => onChangeChild(e, data, index, childIndex)}
                  onKeyUp={(e) => onChangeChild(e, data, index, childIndex)}
                  className={classes.input}
                />
              ) : (
                data.note
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
                {/* <IconButton
                  aria-label="revert-child"
                  onClick={() => onRevertChild(data.id, index)}
                >
                  <RevertIcon />
                </IconButton> */}
              </TableCell>
            ) : (
              <TableCell>
                <ButtonAction
                  handleAction={(a, b, c) => {
                    if (c === "Hapus") {
                      onDeleteChildMode(childIndex, index);
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

export default CollapsibleRow;
