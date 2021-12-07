import _ from "lodash";
import React from "react";
import NoDataBox from "../../../../../../components/boxes/NoDataBox/NoDataBox";
import TablePaginationCustom from "../../../../../../components/tables/TablePagination";
import { tblHeadGRItems } from "../fieldData";
import DetailGR from "./DetailGR";
import GRAccord from "./GRAccord";

const GoodReceipt = ({ data, loading }) => {
  const task_gr = data?.task_gr;
  const task_gr_new = data?.task_gr_new;
  if (_.isEmpty(task_gr_new)) {
    return <NoDataBox text={"Good Receipt not Available"} />;
  }
  console.log(`task_gr_new`, task_gr_new);

  return (
    <div className={"mt-5"}>
      {task_gr_new.map((els, id) => (
        <GRAccord key={id} id={els.material_document} label={`GR ${els.type}`}>
          <div>
            <DetailGR data={els?.gr_header} item={els} fullData={data} />
            <TablePaginationCustom
              headerRows={tblHeadGRItems}
              // width={1210}
              withPagination={false}
              withSearch={false}
              rows={els?.gr_items.map((el, id) => ({
                line: el?.line_id,
                mat_no: parseInt(el?.material) || "-",
                desc: el?.item_text,
                order_qty: el?.po_pr_qnt,
                rcvd_qty: el?.entry_qnt,
                uom: el?.entry_uom,
                sloc: el?.stge_loc,
                stor_bin: "",
              }))}
            />
          </div>
        </GRAccord>
      ))}
    </div>
  );
};

export default GoodReceipt;
