import { connect } from "react-redux";
import React from "react";
import { useParams } from "react-router-dom";
import { fetch_api_sg, getLoading } from "../../../../../redux/globalReducer";
import DetailGR from "../Termin/ServiceAccGR/components/DetailGR";
import TablePaginationCustom from "../../../../components/tables/TablePagination";
import { Paper } from "@material-ui/core";
import { Card, CardBody } from "../../../../../_metronic/_partials/controls";

const tblHeadGRItems = [
  { id: "line", label: "Line" },
  { id: "mat_no", label: "Material Number" },
  { id: "desc", label: "Description" },
  { id: "order_qty", label: "Order Qty" },
  { id: "rcvd_qty", label: "Rcvd Qty" },
  { id: "uom", label: "UoM" },
  { id: "sloc", label: "SLoc" },
  { id: "stor_bin", label: "Stor Bin" },
];

const key = "fetch-gr";
const DetailGRPage = ({ fetch_api_sg, loading }) => {
  const { task_id, gr_id } = useParams();
  const [content, setContent] = React.useState();
  const handleRefresh = () => {
    fetch_api_sg({
      key,
      url: `/delivery/gr/${gr_id}`,
      type: "get",
      onSuccess: (res) => {
        console.log(`res`, res);
        setContent(res.data);
      },
    });
  };
  React.useEffect(() => {
    handleRefresh();
  }, []);

  return (
    <Card>
      <CardBody>
        <DetailGR data={content?.gr_header} item={content} fullData={{}} />
        <TablePaginationCustom
          headerRows={tblHeadGRItems}
          // width={1210}
          withPagination={false}
          withSearch={false}
          rows={content?.gr_items.map((el, id) => ({
            line: el?.line_id,
            mat_no: parseInt(el?.material),
            desc: el?.item_text,
            order_qty: el?.po_pr_qnt,
            rcvd_qty: el?.entry_qnt,
            uom: el?.entry_uom,
            sloc: el?.stge_loc,
            stor_bin: "",
          }))}
        />
      </CardBody>
    </Card>
  );
};

const mapState = (state) => ({
  loading: getLoading(state, key),
});

const mapDispatch = {
  fetch_api_sg,
};

export default connect(mapState, mapDispatch)(DetailGRPage);
