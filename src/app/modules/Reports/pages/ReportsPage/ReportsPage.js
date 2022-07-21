import { Paper } from "@material-ui/core";
import React from "react";
import TablePaginationCustom from "../../../../components/tables/TablePagination";
import { HeaderActionSection } from "./components";
import { tableLabel } from "./constants";
import { useReportsLogic } from "./hooks";

const ReportsPage = () => {
  const {
    ExcelDownloder,
    Type,
    classes,
    content,
    setQuery,
    query,
  } = useReportsLogic();

  return (
    <Paper className={classes.root}>
      <HeaderActionSection
        downloadProps={{
          ExcelDownloder,
          type: Type.Button,
        }}
        data={content}
        setQuery={setQuery}
        query={query}
      />
      <TablePaginationCustom
        headerRows={tableLabel.map((label) => ({
          id: label,
          label: label,
        }))}
        rows={content}
        withSearch={false}
        initialRowsPerPage={10}
        width={4700}
      />
    </Paper>
  );
};

export default ReportsPage;
