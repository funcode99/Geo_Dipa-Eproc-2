import { makeStyles, Paper } from "@material-ui/core";
import React from "react";
import { useExcelDownloder } from "react-xls";
import TablePaginationCustom from "../../../../components/tables/TablePagination";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(1),
    overflowX: "auto",
    padding: theme.spacing(2),
  },
  table: {
    minWidth: 650,
  },
}));

const tableHeaderContractsNew = [
  {
    id: "No",
    label: "No",
  },
  {
    id: "Name",
    label: "Name",
  },
  {
    id: "Category",
    label: "Category",
  },
  {
    id: "Age",
    label: "Age",
  },
  {
    id: "Gender",
    label: "Gender",
  },
];

const ReportsPage = () => {
  const classes = useStyles();

  const { ExcelDownloder, Type } = useExcelDownloder();

  const data = {
    animals: [
      { No: 1, Name: "cat", Category: "animal", Age: 12, Gender: "male" },
      { No: 2, Name: "dog", Category: "animal", Age: 17, Gender: "female" },
      { No: 3, Name: "fish", Category: "animal", Age: 22, Gender: "male" },
    ],
  };

  return (
    <Paper className={classes.root}>
      <div>Reports page</div>
      <ExcelDownloder
        data={data}
        filename={"book"}
        type={Type.Link} // or type={'button'}
      >
        Download
      </ExcelDownloder>
      <TablePaginationCustom
        headerRows={tableHeaderContractsNew}
        rows={data?.animals}
        withSearch={false}
        withPagination={false}
      />
    </Paper>
  );
};

export default ReportsPage;
