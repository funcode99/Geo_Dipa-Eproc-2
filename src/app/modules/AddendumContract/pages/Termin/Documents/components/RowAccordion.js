import { IconButton, TableCell, TableRow } from "@material-ui/core";
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

const RowAccordion = ({
  id,
  data,
  dataAll,
  classBtn,
  children,
  initialState = false,
}) => {
  const [visible, setVisible] = React.useState(false);
  const handleVisible = React.useCallback(() => setVisible((prev) => !prev), [
    setVisible,
  ]);
  const isChildExist = typeof children === "function";
  const sticky = [0, 1];
  const rightSticky = 7;
  React.useEffect(() => {
    setVisible(initialState);
  }, [initialState]);
  return (
    <React.Fragment>
      <TableRow hover onClick={handleVisible}>
        <TableCell className={`align-middle ${classBtn}`}>
          {isChildExist && (
            <IconButton
              size="small"
              className={`btn btn-primary btn-sm p-0 align-middle`}
              // onClick={handleVisible}
            >
              {visible ? <ExpandLessOutlined /> : <ExpandMoreOutlined />}
            </IconButton>
          )}
        </TableCell>
        {data?.map(
          (element, id) =>
            id > 0 && (
              <TableCell
                key={id}
                className={`align-middle ${id === 1 && classBtn}`}
                style={
                  sticky.includes(id)
                    ? {
                        position: "sticky",
                        left: 0,
                        zIndex: 10,
                        backgroundColor: "white",
                      }
                    : id == rightSticky
                    ? {
                        position: "sticky",
                        right: 0,
                        zIndex: 10,
                        backgroundColor: "white",
                      }
                    : {}
                }
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
