import React, { useMemo } from "react";
import { headerTableSA, option_dist_type, sa_field } from "./DUMMY_DATA";
import TablePaginationCustom from "../../../../../../components/tables/TablePagination";
import RowTableSA from "./RowTableSA";
import { FormSAContext } from "./FormSA";
import { isEmpty } from "lodash";

const TableSA = ({ itemJasa, itemSA }) => {
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
  const { readOnly, dataSA, baseSA, saExist, listWBS } = React.useContext(FormSAContext);

  const dataUsed = readOnly ? dataSA.services : itemJasa;
  const poUsed = useMemo(
    () =>
      baseSA?.po_account_assignment?.filter(
        (el) => el.po_item === itemSA.po_item
      )?.[0],
    [baseSA, itemSA]
  );

  const wbsUsed = useMemo(
    () =>
    listWBS.find((el) => el.po_item === itemSA.po_item)?.wbs_value,
    [listWBS, itemSA]
  );
  // console.log(
  //   `dataUsed`,
  //   itemSA,
  //   dataUsed,
  //   baseSA,
  //   baseSA?.po_account_assignment,
  //   poUsed
  // );

  // console.log(wbsUsed, "wbsUsed");

  return (
    <TablePaginationCustom
      headerRows={headerTableSA}
      rows={dataUsed?.map((el) => ({
        name_service: el?.service?.short_text || "",
        service_id: el?.service?.id || "",
        qty: el?.qty,
        wbsdata: saExist ? el?.wbs : null,
        // wbsdata: saExist ? el?.wbs : baseSA?.wbs,
        dist_type: saExist
          ? option_dist_type.filter(
              (els) => els.value === el?.distribution_type
            )?.[0]
          : option_dist_type?.[0],
        bus_area: saExist ? el?.bus_area : poUsed?.bus_area,
        gl_account: saExist ? el?.gl_account : poUsed?.g_l_acct,
        cost_center: saExist ? el?.costcenter : poUsed?.cost_ctr,
        ...el,
      }))}
      // rows={dataRow}
      width={2000}
      maxHeight={300}
      loading={false}
      withPagination={false}
      withSearch={false}
      renderRows={({ item, index }) =>
        isEmpty(item) ? (
          <div key={index}></div>
        ) : (
          <RowTableSA wbs={wbsUsed} poItem={itemSA.po_item} item={item} index={index} />
        )
      }
      fieldProps={{
        listOptions: {
          dist_type: option_dist_type,
        },
      }}
    />
  );
};

export default TableSA;
