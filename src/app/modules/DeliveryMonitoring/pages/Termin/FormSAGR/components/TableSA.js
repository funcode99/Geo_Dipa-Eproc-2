import React, { useMemo } from "react";
import { headerTableSA, option_dist_type, sa_field } from "./DUMMY_DATA";
import TablePaginationCustom from "../../../../../../components/tables/TablePagination";
import RowTableSA from "./RowTableSA";
import { FormSAContext } from "./FormSA";

const TableSA = ({ itemJasa }) => {
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
    ],
    []
  );
  const { readOnly, dataSA } = React.useContext(FormSAContext);
  const dataUsed = readOnly ? dataSA.services : itemJasa;
  // console.log(`dataUsed`, dataUsed);

  return (
    <TablePaginationCustom
      headerRows={headerTableSA}
      rows={dataUsed?.map((el) => ({
        name_service: el?.service?.short_text || "",
        service_id: el?.service?.id || "",
        qty: el?.qty,
        wbsdata: el?.wbs,
        dist_type: option_dist_type.filter(
          (els) => els.value === el?.distribution_type
        )[0],
        cost_center: el?.costcenter,
        ...el,
      }))}
      // rows={dataRow}
      width={2000}
      loading={false}
      withPagination={false}
      withSearch={false}
      renderRows={RowTableSA}
      fieldProps={{
        listOptions: {
          dist_type: option_dist_type,
        },
      }}
    />
  );
};

export default TableSA;
