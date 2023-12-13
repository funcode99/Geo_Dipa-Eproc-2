import React from "react";
import useCollapse from "react-collapsed";
import Input from "@material-ui/core/Input";
import CustomTableCell from "../CustomTableCell";
import IconButton from "@material-ui/core/IconButton";
import { TableCell, TableRow } from "@material-ui/core";
import DoneIcon from "@material-ui/icons/DoneAllTwoTone";
import ButtonAction from "app/components/buttonAction/ButtonAction";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";

const CollapsibleRow = ({
  classes,
  index,
  onAddChildMode,
  onChange,
  onChangeChild,
  onDeleteMode,
  onDeleteChildMode,
  onToggleEditMode,
  onToggleEditChildMode,
  row,
  parentIndex,
}) => {
  const { getCollapseProps, getToggleProps, isExpanded } = useCollapse();

  return (
    <>
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
        <CustomTableCell {...{ row, name: "product_title", onChange }} />
        <CustomTableCell
          {...{ row, name: "qty_total", onChange, isDisabled: true }}
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
          </TableCell>
        ) : (
          <TableCell>
            <ButtonAction
              handleAction={(type, data, label) => {
                if (label === "JOB_PRICE.TABLE_ACTION.DELETE") {
                  onDeleteMode(index);
                } else if (label === "JOB_PRICE.TABLE_ACTION.EDIT") {
                  onToggleEditMode(row.id);
                } else if (label === "JOB_PRICE.TABLE_ACTION.ADD_SUB_ITEM") {
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
          </TableCell>
        )}
      </TableRow>
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
                  value={data.item_name}
                  name={"item_name"}
                  onChange={(e) => onChangeChild(e, data, index, childIndex)}
                  onKeyUp={(e) => onChangeChild(e, data, index, childIndex)}
                  className={classes.input}
                />
              ) : (
                data.item_name
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
              {data.total}
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
            {data.isEditMode ? (
              <TableCell>
                <IconButton
                  aria-label="done-child"
                  onClick={() => onToggleEditChildMode(data.id, index)}
                >
                  <DoneIcon />
                </IconButton>
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
