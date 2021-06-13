import React from "react";
import { Row, Col } from "react-bootstrap";
import {
  Card,
  CardBody,
} from "../../../../../../../_metronic/_partials/controls";
import FieldBuilder from "../../../../../../components/builder/FieldBuilder";
import { formData1, formData2, formData3 } from "./fieldData";
import TableBuilder from "../../../../../../components/builder/TableBuilder";
import TitleField from "../../../../../../components/input/TitleField";
import FormBuilder from "../../../../../../components/builder/FormBuilder";
import { object } from "yup";
import validation from "../../../../../../service/helper/validationHelper";

const validationSchema = object().shape({
  nomor_bast: validation.require("Nomor BAST"),
  tanggal_bast: validation.require("Tanggal BAST"),
  hasil_pekerjaan: validation.require("Hasil Pekerjaan"),
  file_attachment: validation.require("File"),
});

const BastPage = () => {
  const initialValues = {
    nomor_bast: "",
    // tanggal_bast: "2021-06-15",
    tanggal_bast: "",
    jenis: "Pekerjaan",
    pelaksana: "Pelaksana",
    nomor_contract: "Dasar pekerjaan",
    // nomor_po: "NAOSDIASD",
    // hasil_pekerjaan: "NAOSDIASD",
    file_attachment: "",
    // select_example: {
    //   label: "isi",
    //   value: "value",
    // },
  };

  const _handleSubmit = (data) => {
    console.log(`data`, data);
  };

  const disabledInput = ["jenis", "pelaksana", "nomor_contract", "nomor_po"];
  const optionsList = {
    select_example: [
      { value: 1, label: "data1" },
      { value: 2, label: "data2" },
      { value: 3, label: "data3" },
    ],
  };

  return (
    <Card>
      <CardBody>
        {/* <Row>
          <Col>
            <FieldBuilder readOnly formData={formData1} />
          </Col>
          <Col>
            <FieldBuilder readOnly formData={formData2} />
          </Col>
        </Row> */}
        {/* <FieldBuilder readOnly formData={formData3} /> */}
        <FormBuilder
          onSubmit={_handleSubmit}
          formData={formData3}
          initial={initialValues}
          validation={validationSchema}
          fieldProps={{
            readOnly: false,
            disabledFields: disabledInput,
            listOptions: optionsList,
          }}
        />
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
