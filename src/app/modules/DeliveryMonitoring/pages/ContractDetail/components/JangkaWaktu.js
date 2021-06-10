import React from "react";
import { Col, Row } from "react-bootstrap";
import { FormControl } from "react-bootstrap";
import { InputGroup } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Card, CardBody } from "../../../../../../_metronic/_partials/controls";
import FieldBuilder from "../../../../../components/builder/FieldBuilder";
import BasicInput from "../../../../../components/input/BasicInput";
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

const Item = ({ title, data }) => {
  // console.log(`dataContraacct`, dataContractById);
  return (
    <React.Fragment>
      <TitleField title={title} />
      <Row>
        <Col md={4}>
          <BasicInput
            name={"namama"}
            label={"Mulai"}
            defaultValue={data?.[0]}
          />
        </Col>
        <Col md={4}>
          <BasicInput
            name={"namama"}
            label={"Berakhir"}
            defaultValue={data?.[1]}
          />
        </Col>
        <Col md={2}>
          <InputGroup className="mb-3">
            <FormControl aria-label="Month" defaultValue={data?.[2]} />
            <InputGroup.Append>
              <InputGroup.Text>Bulan</InputGroup.Text>
            </InputGroup.Append>
          </InputGroup>
        </Col>
        <Col md={2}>
          <InputGroup className="mb-3">
            <FormControl defaultValue={data?.[3]} aria-label="Days" />
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
  const {
    from_time,
    thru_time,
    worked_start_date,
    worked_end_date,
    maintenance_end_date,
    maintenance_start_date,
    guarantee_end_date,
    guarantee_start_date,
  } = useSelector((state) => state.deliveryMonitoring.dataContractById);
  return (
    <Card>
      <CardBody>
        {/* <FieldBuilder formData={formData1} /> */}
        <Item title={"Jangka Waktu Perjanjian"} data={[from_time, thru_time]} />
        <Item
          title={"Jangka Waktu Pelaksanaan Pekerjaan"}
          data={[worked_start_date, worked_end_date]}
        />
        <Item
          title={"Jangka Waktu Masa Garansi"}
          data={[guarantee_start_date, guarantee_end_date]}
        />
        <Item
          title={"Jangka Waktu Masa Pemeliharaan"}
          data={[maintenance_start_date, maintenance_end_date]}
        />
      </CardBody>
    </Card>
  );
};

export default JangkaWaktu;
