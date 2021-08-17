import React from "react";
// import FieldBuilder from "../../../../../../components/builder/FieldBuilder";
import {
  detailSA,
  // formData1,
  // formData2,
  tableHeader1,
  tableHeader2,
} from "../fieldData";
// import { Row, Col, Container } from "react-bootstrap";
// import FormBuilder from "../../../../../../components/builder/FormBuilder";
import TablePaginationCustom from "../../../../../../components/tables/TablePagination";
import {
  Card,
  CardBody,
} from "../../../../../../../_metronic/_partials/controls";
import DetailSA from "./DetailSA";
import { connect } from "react-redux";
import { rupiah } from "../../../../../../libs/currency";
import FooterSA from "./FooterSA";
import RowAdditional from "./RowAdditional";

const ServiceAcceptance = ({ task_sa }) => {
  // const { sa_header, sa_items } = task_sa;

  return (
    <React.Fragment>
      {task_sa ? (
        <DetailSA data={task_sa?.sa_header} type="SA" />
      ) : (
        <DetailSA />
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
      {task_sa ? (
        <TablePaginationCustom
          headerRows={tableHeader1}
          // width={1210}
          withPagination={false}
          withSearch={false}
          rows={task_sa?.sa_items.map((el, id) => ({
            no: id + 1,
            service: el?.short_text,
            qty: el?.actual_qty,
            uom: el?.base_uom,
            unit_price: rupiah(el?.price_unit),
            net_value: rupiah(el?.net_value),
          }))}
          footerComponent={<FooterSA data={task_sa?.sa_items} />}
        />
      ) : (
        <TablePaginationCustom
          headerRows={tableHeader1}
          // width={1210}
          withPagination={false}
          withSearch={false}
          rows={[1].map((el, id) => ({
            no: id + 1,
            service: "Mobilisasi & Demobilisasi",
            qty: 1,
            uom: "AU",
            unit_price: "Rp 20.000.000,00",
            net_value: "Rp 20.000.000,00",
          }))}
          footerComponent={
            <React.Fragment>
              <RowAdditional label={"Subtotal"} value={"Rp 20.000.000,00"} />
              <RowAdditional label={"PPN 10%"} value={`10%`} />
              <RowAdditional label={"Total"} value={"Rp 21.000.000,00"} />
            </React.Fragment>
          }
        />
      )}
      {/* </CardBody>
      </Card> */}

      {/* <Card>
        <CardBody> */}
      <TablePaginationCustom
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
      />
      {/* </CardBody>
      </Card> */}
    </React.Fragment>
  );
};

const mapState = (state) => ({
  task_sa: state.deliveryMonitoring.dataTask?.task_sa,
});

const mapDispatch = {};

export default connect(mapState, mapDispatch)(ServiceAcceptance);
