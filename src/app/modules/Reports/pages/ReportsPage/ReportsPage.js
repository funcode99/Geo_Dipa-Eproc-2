import React from "react";
import { Paper } from "@material-ui/core";
import TablePaginationCustom from "../../../../components/tables/TablePagination";
import { tableHeaderReports, TEMP_DUMMY_DATA_TABLE } from "./constants";
import { useReportsLogic } from "./hooks";
import { HeaderActionSection } from "./components";

const ReportsPage = () => {
  const { ExcelDownloder, Type, classes } = useReportsLogic();

  return (
    <Paper className={classes.root}>
      <HeaderActionSection
        downloadProps={{
          ExcelDownloder,
          data: TEMP_DUMMY_DATA_TABLE,
          type: Type.Button,
        }}
      />
      {/* <ExcelDownloder
        data={TEMP_DUMMY_DATA_TABLE}
        filename={"book"}
        type={Type.Link} // or type={'button'}
      >
        Download
      </ExcelDownloder> */}
      <TablePaginationCustom
        headerRows={tableHeaderReports}
        rows={TEMP_DUMMY_DATA_TABLE?.animals}
        withSearch={false}
        withPagination={false}
      />
    </Paper>
  );
};

export default ReportsPage;
