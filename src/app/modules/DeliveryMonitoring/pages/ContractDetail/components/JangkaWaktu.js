import React from "react";
import { Col, Row } from "react-bootstrap";
import { FormControl } from "react-bootstrap";
import { InputGroup } from "react-bootstrap";
import { Card, CardBody } from "../../../../../../_metronic/_partials/controls";
import FieldBuilder from "../../../../../components/builder/FieldBuilder";
import RenderInput from "../../../../../components/input/RenderInput";
import TitleField from "../../../../../components/input/TitleField";
import withBox from "./withBox";

const InputBulanHari = ({ valueBulan, valueHari }) => (
  <Row>
    <Col md={6}>
      <InputGroup className="mb-3">
        <FormControl aria-label="Month" value={valueBulan} />
        <InputGroup.Append>
          <InputGroup.Text>Bulan</InputGroup.Text>
        </InputGroup.Append>
      </InputGroup>
    </Col>
    <Col md={6}>
      <InputGroup className="mb-3">
        <FormControl value={valueHari} aria-label="Days" />
        <InputGroup.Append>
          <InputGroup.Text>Hari</InputGroup.Text>
        </InputGroup.Append>
      </InputGroup>
    </Col>
  </Row>
);

const formData1 = [
  [
    {
      Child: TitleField,
      ChildrenProps: {
        title: "Jangka Waktu Perjanjian",
      },
    },
  ],
  [
    {
      name: "start_perjanjian",
      label: "Mulai",
    },
    {
      name: "end_perjanjian",
      label: "Berakhir",
    },
  ],
  [
    {
      children: <InputBulanHari valueBulan={5} valueHari={21} />,
    },
  ],
  [
    {
      Child: TitleField,
      ChildrenProps: {
        title: "Jangka Waktu Pelaksanaan Pekerjaan",
      },
    },
  ],
  [
    {
      name: "start_pelaksanaan",
      label: "Mulai",
    },
    {
      name: "end_pelaksanaan",
      label: "Berakhir",
    },
  ],
  [
    {
      children: <InputBulanHari valueBulan={5} valueHari={21} />,
    },
  ],
  [
    {
      Child: TitleField,
      ChildrenProps: {
        title: "Jangka Waktu Masa Garansi",
      },
    },
  ],
  [
    {
      name: "start_garansi",
      label: "Mulai",
    },
    {
      name: "end_garansi",
      label: "Berakhir",
    },
  ],
  [
    {
      children: <InputBulanHari valueBulan={5} valueHari={21} />,
    },
  ],
  [
    {
      Child: TitleField,
      ChildrenProps: {
        title: "Jangka Waktu Masa Pemeliharaan",
      },
    },
  ],
  [
    {
      name: "start_pemeliharaan",
      label: "Mulai",
    },
    {
      name: "end_pemeliharaan",
      label: "Berakhir",
    },
  ],
  [
    {
      children: <InputBulanHari valueBulan={5} valueHari={21} />,
    },
  ],
];

const Item = ({ title }) => {
  return (
    <React.Fragment>
      <TitleField title={title} />
      <Row>
        <Col md={4}>
          <RenderInput name={"namama"} label={"Mulai"} />
        </Col>
        <Col md={4}>
          <RenderInput name={"namama"} label={"Berakhir"} />
        </Col>
        <Col md={2}>
          <InputGroup className="mb-3">
            <FormControl aria-label="Month" value={"5"} />
            <InputGroup.Append>
              <InputGroup.Text>Bulan</InputGroup.Text>
            </InputGroup.Append>
          </InputGroup>
        </Col>
        <Col md={2}>
          <InputGroup className="mb-3">
            <FormControl value={"21"} aria-label="Days" />
            <InputGroup.Append>
              <InputGroup.Text>Hari</InputGroup.Text>
            </InputGroup.Append>
          </InputGroup>
        </Col>
      </Row>
    </React.Fragment>
  );
};

const JangkaWaktu = () => {
  return (
    <Card>
      <CardBody>
        {/* <FieldBuilder formData={formData1} /> */}
        <Item title={"Jangka Waktu Perjanjian"} />
        <Item title={"Jangka Waktu Pelaksanaan Pekerjaan"} />
        <Item title={"Jangka Waktu Masa Garansi"} />
        <Item title={"Jangka Waktu Masa Pemeliharaan"} />
      </CardBody>
    </Card>
  );
};

export default JangkaWaktu;
