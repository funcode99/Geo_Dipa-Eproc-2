import { IconButton, TableCell, TableRow } from "@material-ui/core";
import { ExpandLessOutlined, ExpandMoreOutlined } from "@material-ui/icons";
import React from "react";
import { StyledTableRow } from "../../../../../../components/tables/style";

const RowAccordion = ({ id, data, dataAll, classBtn, children }) => {
  const [visible, setVisible] = React.useState(false);
  const handleVisible = React.useCallback(() => setVisible((prev) => !prev), [
    setVisible,
  ]);
  const isChildExist = typeof children === "function";

  return (
    <React.Fragment>
      <TableRow hover onClick={handleVisible}>
        <TableCell>
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
          (element, id) => id > 0 && <TableCell key={id}>{element}</TableCell>
        )}
      </TableRow>
      {isChildExist && visible && children(dataAll)}
    </React.Fragment>
  );
};

export default RowAccordion;
