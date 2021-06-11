import { TableCell } from "@material-ui/core";
import { ExpandLessOutlined, ExpandMoreOutlined } from "@material-ui/icons";
import React from "react";
import { StyledTableRow } from "../../../../../../components/tables/style";

const RowAccordion = ({ id, data, dataAll, classBtn, children }) => {
  const [visible, setVisible] = React.useState(false);
  const handleVisible = React.useCallback(() => setVisible((prev) => !prev), [
    setVisible,
  ]);
  const isChildExist = typeof children === "function";
  // console.log(isChildExist);
  // console.log(visible);

  return (
    <React.Fragment>
      <StyledTableRow>
        <TableCell>
          {isChildExist && (
            <button
              className={`btn btn-primary btn-sm p-0 align-middle`}
              onClick={handleVisible}
            >
              {visible ? <ExpandLessOutlined /> : <ExpandMoreOutlined />}
            </button>
          )}
        </TableCell>
        {data?.map(
          (element, id) => id > 0 && <TableCell key={id}>{element}</TableCell>
        )}
      </StyledTableRow>
      {isChildExist && visible && children(dataAll)}
    </React.Fragment>
  );
};

export default RowAccordion;
