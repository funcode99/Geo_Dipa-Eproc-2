import TablePagination from "@material-ui/core/TablePagination";
import React from "react";
const PaginationTable = ({
  rows,
  rowsPerPage,
  page,
  handleChangePage,
  handleChangeRowsPerPage,
}) => {
  return (
    <TablePagination
      rowsPerPageOptions={[5, 10]}
      component="div"
      count={rows.length}
      rowsPerPage={rowsPerPage}
      page={page}
      backIconButtonProps={{
        "aria-label": "Previous Page",
      }}
      nextIconButtonProps={{
        "aria-label": "Next Page",
      }}
      onChangePage={handleChangePage}
      onChangeRowsPerPage={handleChangeRowsPerPage}
    />
  );
};

export default PaginationTable;
