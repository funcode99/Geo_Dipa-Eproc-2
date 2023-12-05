import React from "react";
import Tables from "app/components/tableCustomV1/table";
import { formatCurrencyIDR } from "../Helper/formartCurrencyIDR";
import { TableCell, TableRow, Paper, makeStyles } from "@material-ui/core";

const TableRincianHargaPekerjaanAwal = ({ data }) => {
  const useStyles = makeStyles((theme) => ({
    root: {
      width: "100%",
      overflowX: "auto",
      padding: theme.spacing(1),
    },
    table: {
      minWidth: 650,
    },
  }));
  const classes = useStyles();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("");
  const [filterBy, setFilterBy] = React.useState({});
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  function handleChangePage(newPage) {
    setPage(newPage);
  }
  function handleChangeRowsPerPage(event) {
    setRowsPerPage(+event.target.value);
  }

  const handleFilter = (data, data2) => {
    const sort = JSON.parse(data2.sort);
    const filter = JSON.parse(data2.filter);
    setOrder(sort.order ? "asc" : "desc");
    setOrderBy(sort.name);
    setFilterBy(filter);
  };
  const tableHeader = [
    {
      name: "number",
      title: "No",
      order: { active: false, status: true, type: true },
      filter: { active: false, type: "text" },
    },
    {
      name: "item_desc",
      title: "Deskripsi Item",
      order: { active: false, status: true, type: true },
      filter: { active: true, type: "text" },
    },
    {
      name: "qty",
      title: "QTY",
      order: { active: false, status: true, type: true },
      filter: { active: true, type: "text" },
    },
    {
      name: "uom",
      title: "Satuan",
      order: { active: false, status: true, type: true },
      filter: { active: true, type: "text" },
    },
    {
      name: "unit_price",
      title: "Harga Satuan",
      order: { active: false, status: true, type: true },
      filter: { active: true, type: "text" },
    },
    {
      name: "total_price",
      title: "Harga Total",
      order: { active: false, status: true, type: true },
      filter: { active: true, type: "text" },
    },
    {
      name: "note",
      title: "Keterangan",
      order: { active: false, status: true, type: true },
      filter: { active: true, type: "text" },
    },
  ];

  const grandTotal = data.reduce(
    (total, item) => total + parseFloat(item.subtotal),
    0
  );

  return (
    <>
      <Paper className={classes.root}>
        <Tables
          dataHeader={tableHeader}
          handleParams={handleFilter}
          err={false}
          loading={false}
          countData={data?.length}
          onChangePage={handleChangePage}
          onChangePerPage={handleChangeRowsPerPage}
        >
          {data?.map((item, index) => (
            <TableRow>
              <TableCell align="left">{index + 1}</TableCell>
              <TableCell align="left">{item.product_name}</TableCell>
              <TableCell align="left">{item.qty}</TableCell>
              <TableCell align="left">{item.uom}</TableCell>
              <TableCell align="left">
                {formatCurrencyIDR(item.unit_price)}
              </TableCell>
              <TableCell align="left">
                {formatCurrencyIDR(item.subtotal)}
              </TableCell>
              <TableCell align="left">{item.note}</TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell align="left" colSpan={5}>
              Grand Total
            </TableCell>
            <TableCell align="left" colSpan={2}>
              {formatCurrencyIDR(grandTotal)}
            </TableCell>
          </TableRow>
        </Tables>
      </Paper>
    </>
  );
};
export default TableRincianHargaPekerjaanAwal;
