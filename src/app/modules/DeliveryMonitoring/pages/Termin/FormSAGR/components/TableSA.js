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
  const { readOnly, dataSA, baseSA, saExist, listWBS } = React.useContext(
    FormSAContext
  );

  const dataUsed = readOnly ? dataSA?.services : itemJasa;

  const poUsed = useMemo(
    () => baseSA?.po_init?.find((el) => el.po_item === itemSA.po_item)?.data,
    [baseSA, itemSA]
  );
  const wbsUsed = useMemo(
    () => listWBS.find((el) => el.po_item === itemSA.po_item)?.wbs_value,
    [listWBS, itemSA]
  );
  return (
    <TablePaginationCustom
      headerRows={headerTableSA}
      rows={dataUsed?.map((el, i) => {
        const service = poUsed?.find(
          (ser) => ser?.line_no === el?.service?.line_no
        )?.data;

        let name_service = el?.service?.short_text || "";
        let service_id = el?.service?.id || "";
        let qty = el?.qty;
        let dist_type = option_dist_type?.[0];

        let wbsdata = [
          {
            name: service?.wbs?.work_breakdown_app,
            value: service?.wbs?.value * 1,
          },
        ];
        let bus_area = service?.bus_area;
        let gl_account = service?.gl_account?.code;
        let cost_center = service?.cost_center?.code;

        if (saExist) {
          wbsdata = el?.wbs;
          dist_type = option_dist_type.filter(
            (els) => els.value === el?.distribution_type
          )?.[0];
          bus_area = el?.bus_area;
          gl_account = el?.g_l_acct;
          cost_center = el?.costcenter;
        }

        return {
          name_service,
          service_id,
          qty,
          wbsdata,
          // wbsdata: saExist ? el?.wbs : baseSA?.wbs,
          dist_type,
          bus_area,
          gl_account,
          cost_center,
          ...el,
        };
      })}
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
          <RowTableSA wbs={wbsUsed} item={item} index={index} />
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
