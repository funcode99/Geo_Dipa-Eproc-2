import React from "react";
import FieldBuilder from "../../../../../../components/builder/FieldBuilder";
import { formData1, formData2 } from "../fieldData";
import { Row, Col } from "react-bootstrap";
import FormBuilder from "../../../../../../components/builder/FormBuilder";
import TablePaginationCustom from "../../../../../../components/tables/TablePagination";
import { TableRow } from "@material-ui/core";
import { TableCell } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import {
  Card,
  CardBody,
} from "../../../../../../../_metronic/_partials/controls";

const tableHeader1 = [
  { id: "no", label: <FormattedMessage id="TITLE.NO" /> },
  { id: "service", label: <FormattedMessage id="TITLE.SERVICE" /> },
  { id: "qty", label: <FormattedMessage id="TITLE.QUANTITY" /> },
  { id: "uom", label: "UoM" },
  { id: "unit_price", label: <FormattedMessage id="TITLE.UNIT_PRICE" /> },
  { id: "net_value", label: <FormattedMessage id="TITLE.NET_VALUE" /> },
];

const tableHeader2 = [
  { id: "no", label: <FormattedMessage id="TITLE.NO" /> },
  { id: "name", label: <FormattedMessage id="TITLE.NAME" /> },
  { id: "position", label: <FormattedMessage id="TITLE.POSITION" /> },
  { id: "activity", label: <FormattedMessage id="TITLE.ACTIVITY" /> },
  { id: "start_date", label: <FormattedMessage id="TITLE.START_DATE" /> },
  { id: "end_date", label: <FormattedMessage id="TITLE.END_DATE" /> },
  { id: "comment", label: <FormattedMessage id="TITLE.COMMENT" /> },
];

const RowAdditional = ({ label, value }) => {
  return (
    <TableRow>
      <TableCell colSpan={4}></TableCell>
      <TableCell className="text-dark">{label}</TableCell>
      <TableCell className="text-dark text-left">{value}</TableCell>
    </TableRow>
  );
};

const ServiceAcceptance = () => {
  return (
    <React.Fragment>
      <FormBuilder
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
      </FormBuilder>

      <Card className="my-5">
        <CardBody>
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
        </CardBody>
      </Card>

      <Card>
        <CardBody>
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
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

export default ServiceAcceptance;
