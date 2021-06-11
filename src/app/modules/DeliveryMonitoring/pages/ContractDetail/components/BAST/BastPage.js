import React from "react";
import { Row, Col } from "react-bootstrap";
import {
  Card,
  CardBody,
} from "../../../../../../../_metronic/_partials/controls";
import FieldBuilder from "../../../../../../components/builder/FieldBuilder";
import { formData1, formData2 } from "./fieldData";
import TableBuilder from "../../../../../../components/builder/TableBuilder";
import TitleField from "../../../../../../components/input/TitleField";

const BastPage = () => {
  return (
    <Card>
      <CardBody>
        <Row>
          <Col>
            <FieldBuilder readOnly formData={formData1} />
          </Col>
          <Col>
            <FieldBuilder readOnly formData={formData2} />
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <TitleField title={"History"} />
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <TableBuilder
              hecto={5}
              dataHead={[
                "No BAST",
                "Tanggal",
                "Approved by",
                "Dokumen",
                "Aksi",
              ]}
              // dataBody={data_bank}
              // renderRowBody={({ item, index }) => (
              //   <RowBank
              //     key={index}
              //     data={[
              //       index + 1,
              //       item?.account_holder_name,
              //       item?.bank?.full_name,
              //       item?.address?.postal_address,
              //       item?.account_number,
              //     ]}
              //   />
              // )}
            />
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default BastPage;
