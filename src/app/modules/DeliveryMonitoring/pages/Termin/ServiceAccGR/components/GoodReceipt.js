import React from "react";
// import FieldBuilder from "../../../../../../components/builder/FieldBuilder";
import { tblHeadGRItems, tableHeader2 } from "../fieldData";
// import { Row, Col } from "react-bootstrap";
// import FormBuilder from "../../../../../../components/builder/FormBuilder";
import TablePaginationCustom from "../../../../../../components/tables/TablePagination";
// import { TableRow } from "@material-ui/core";
// import { TableCell } from "@material-ui/core";
import {
  Card,
  CardBody,
} from "../../../../../../../_metronic/_partials/controls";
import RowAdditional from "./RowAdditional";
import { connect } from "react-redux";
import DetailGR from "./DetailGR";
import NoDataBox from "../../../../../../components/boxes/NoDataBox/NoDataBox";
import GRAccord from "./GRAccord";

const GoodReceipt = ({ data, loading }) => {
  const task_gr = data?.task_gr;
  const task_gr_new = data?.task_gr_new;
  console.log(`task_gr`, task_gr, data);
  if (task_gr == null) {
    return <NoDataBox text={"Good Receipt not Available"} />;
  }

  return (
    <div className={"mt-5"}>
      {task_gr_new.map((els, id) => (
        <GRAccord key={id} label={`GR ${els.type}`}>
          <div>
            <DetailGR data={els?.gr_header} fullData={data} />
            <TablePaginationCustom
              headerRows={tblHeadGRItems}
              // width={1210}
              withPagination={false}
              withSearch={false}
              rows={els?.gr_items.map((el, id) => ({
                line: el?.line_id,
                mat_no: parseInt(el?.material),
                desc: "",
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
