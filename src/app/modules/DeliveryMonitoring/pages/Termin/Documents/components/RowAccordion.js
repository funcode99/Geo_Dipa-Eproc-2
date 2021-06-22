import { TableCell, TableRow } from "@material-ui/core";
import React, { Children } from "react";
import {
  SelectStyled,
  CheckBoxStyled,
  StyledTable,
  StyledTableHead,
  StyledHead,
  StyledTableRow,
} from "../../style";
import {
  ExpandLessOutlined,
  ExpandMoreOutlined,
  Send,
} from "@material-ui/icons";

const RowAccordion = ({ id, data, dataAll, classBtn, children }) => {
  const [visible, setVisible] = React.useState(false);
  const handleVisible = React.useCallback(() => setVisible((prev) => !prev), [
    setVisible,
  ]);
  const isChildExist = typeof children === "function";
  return (
    <React.Fragment>
      <TableRow hover onClick={handleVisible}>
        <TableCell className={`align-middle ${classBtn}`}>
          {isChildExist && (
            <button
              className={`btn btn-primary btn-sm p-0 align-middle`}
              // onClick={handleVisible}
            >
              {visible ? <ExpandLessOutlined /> : <ExpandMoreOutlined />}
            </button>
          )}
        </TableCell>
        {data?.map(
          (element, id) =>
            id > 0 && (
              <TableCell
                key={id}
                className={`align-middle ${id === 1 && classBtn}`}
              >
                {element}
              </TableCell>
            )
        )}
      </TableRow>
      {isChildExist && visible && children(dataAll)}
    </React.Fragment>
  );
};

export default RowAccordion;
