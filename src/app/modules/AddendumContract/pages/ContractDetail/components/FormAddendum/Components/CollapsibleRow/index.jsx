import React from "react";
import { useCollapse } from "react-collapsed";
import { TableCell, TableRow } from "@material-ui/core";

import ButtonAction from "app/components/buttonAction/ButtonAction";
import Input from "@material-ui/core/Input";
import IconButton from "@material-ui/core/IconButton";
import DoneIcon from "@material-ui/icons/DoneAllTwoTone";
import RevertIcon from "@material-ui/icons/NotInterestedOutlined";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";

import CustomTableCell from "../CustomTableCell";

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
  console.log("isi row", row);

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
        <CustomTableCell {...{ row, name: "qty_total", onChange }} />
        <CustomTableCell {...{ row, name: "uom", onChange }} />
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
            <TableCell>
              <div></div>
            </TableCell>
            <TableCell align="left" className={classes.tableCell}>
              {data.isEditMode ? (
                <Input
                  value={data.product_title}
                  name={"product_title"}
                  onChange={(e) => onChangeChild(e, data, index, childIndex)}
                  className={classes.input}
                />
              ) : (
                data.product_title
              )}
            </TableCell>
            <TableCell align="left" className={classes.tableCell}>
              {data.isEditMode ? (
                <Input
                  value={data.qty_total}
                  name={"qty_total"}
                  onChange={(e) => onChangeChild(e, data, index, childIndex)}
                  className={classes.input}
                />
              ) : (
                data.qty_total
              )}
            </TableCell>
            <TableCell align="left" className={classes.tableCell}>
              {data.isEditMode ? (
                <Input
                  value={data.uom}
                  name={"uom"}
                  onChange={(e) => onChangeChild(e, data, index, childIndex)}
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
                  className={classes.input}
                />
              ) : (
                data.unit_price
              )}
            </TableCell>
            <TableCell align="left" className={classes.tableCell}>
              {data.isEditMode ? (
                <Input
                  value={data.total_price}
                  name={"total_price"}
                  onChange={(e) => onChangeChild(e, data, index, childIndex)}
                  className={classes.input}
                />
              ) : (
                data.total_price
              )}
            </TableCell>
            <TableCell>Tidak ada</TableCell>

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

export default CollapsibleRow;
