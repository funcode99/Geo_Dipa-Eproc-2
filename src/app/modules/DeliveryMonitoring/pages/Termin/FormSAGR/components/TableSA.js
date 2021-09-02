import React, { useMemo } from "react";
import { headerTableSA, sa_field } from "./DUMMY_DATA";
import TablePaginationCustom from "../../../../../../components/tables/TablePagination";
import RowTableSA from "./RowTableSA";

const TableSA = () => {
  const dataRow = useMemo(
    () => [
      {
        name_service: "Jasa 1",
        gl_account: "Jasa 1 gl_account",
        bus_area: "Jasa 1 bus_area",
        cost_center: "Jasa 1 cost_center",
        dist_type: "Jasa 1 dist_type",
        wbs: "Jasa 1 wbs",
        value: "Jasa 1 value",
      },
      {
        name_service: "Jasa 2",
        gl_account: "Jasa 2 gl_account",
        bus_area: "Jasa 2 bus_area",
        cost_center: "Jasa 2 cost_center",
        dist_type: "Jasa 2 dist_type",
        wbs: "Jasa 2 wbs",
        value: "Jasa 2 value",
      },
      {
        name_service: "Jasa 3",
        gl_account: "Jasa 3 gl_account",
        bus_area: "Jasa 3 bus_area",
        cost_center: "Jasa 3 cost_center",
        dist_type: "Jasa 3 dist_type",
        wbs: "Jasa 3 wbs",
        value: "Jasa 3 value",
      },
    ],
    []
  );

  return (
    <TablePaginationCustom
      headerRows={headerTableSA}
      rows={dataRow}
      width={1800}
      loading={false}
      withPagination={false}
      withSearch={false}
      renderRows={RowTableSA}
    />
  );
};

export default TableSA;
