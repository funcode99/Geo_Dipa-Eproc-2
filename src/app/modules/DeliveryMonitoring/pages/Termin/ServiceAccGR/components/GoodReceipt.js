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

const GoodReceipt = ({ data, loading }) => {
  const task_gr = data?.task_gr;
  // console.log(`task_gr`, task_gr);
  if (task_gr == null) {
    return <NoDataBox text={"Good Receipt not Available"} />;
  }

  return (
    <React.Fragment>
      {task_gr ? (
        <DetailGR data={task_gr?.gr_header} fullData={data} />
      ) : (
        <DetailGR />
      )}
      {/* <FormBuilder
        // ref={formikRef}
        // onSubmit={_handleSubmit}
        // formData={formData3}
        // loading={loadings.post}
        // initial={initialValues}
        // validation={isClient ? validationClient : validationVendor}
        fieldProps={{
          readOnly: false,
          // disabledFields: disabledInput,
          // disabledFields: disabledInput.filter((el) =>
          //   isClient
          //     ? !allowedClient.includes(el)
          //     : !allowedVendor.includes(el)
          // ),
        }}
      >
        {({ fieldProps }) => (
          <Row>
            <Col>
              <FieldBuilder formData={formData1} {...fieldProps} />
            </Col>
            <Col>
              <FieldBuilder formData={formData2} {...fieldProps} />
            </Col>
          </Row>
        )}
      </FormBuilder> */}

      {/* <Card className="my-5">
        <CardBody> */}
      {task_gr ? (
        <TablePaginationCustom
          headerRows={tblHeadGRItems}
          // width={1210}
          withPagination={false}
          withSearch={false}
          rows={task_gr?.gr_items.map((el, id) => ({
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
      ) : (
        <TablePaginationCustom
          headerRows={tblHeadGRItems}
          // width={1210}
          withPagination={false}
          withSearch={false}
          rows={[1].map((el, id) => ({
            line: `000${id}`,
            mat_no: "",
            desc: "Voucher Pakaian Kantor Pusat",
            order_qty: "3.330",
            rcvd_qty: "3.330",
            uom: "LBR",
            sloc: "",
            stor_bin: "",
          }))}
        />
      )}
      {/* </CardBody>
      </Card> */}

      {/* <Card>
        <CardBody> */}
      {/* <TablePaginationCustom
        headerRows={tableHeader2}
        // width={1210}
        withPagination={false}
        withSearch={false}
        rows={[1].map((el, id) => ({
          no: id + 1,
          name: "Dian PS",
          position: "IT Asman",
          activity: "Create GR",
          start_date: "30 Jan 2021",
          end_date: "29 Feb 2021",
          comment: "Test comment",
        }))}
      /> */}
      {/* </CardBody>
      </Card> */}
    </React.Fragment>
  );
};

// const mapState = (state) => ({
//   task_gr: state.deliveryMonitoring.dataTask?.task_gr,
// });

// const mapDispatch = {};

// export default connect(mapState, mapDispatch)(GoodReceipt);

export default GoodReceipt;
