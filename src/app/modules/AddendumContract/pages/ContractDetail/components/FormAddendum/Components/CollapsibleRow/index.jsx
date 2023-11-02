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

export default CollapsibleRow;
