import { TableBody, TableCell } from "@material-ui/core";
import React from "react";
import { Col, DropdownButton } from "react-bootstrap";
import { FormControl } from "react-bootstrap";
import { Row } from "react-bootstrap";
import { Dropdown } from "react-bootstrap";
import { InputGroup } from "react-bootstrap";
import { Card, CardBody } from "../../../../../../_metronic/_partials/controls";
import FieldBuilder from "../../../../../components/builder/FieldBuilder";
import TableBuilder from "../../../../../components/builder/TableBuilder";
import RenderInput from "../../../../../components/input/RenderInput";
import TitleField from "../../../../../components/input/TitleField";
import Navs from "../../../../../components/navs";
import {
  StyledHead,
  StyledTable,
  StyledTableHead,
  StyledTableRow,
} from "../../Termin/style";
import withBox from "./withBox";

const navLists = [
  {
    id: "pertama",
    label: "Full Pembayaran",
  },
  {
    id: "kedua",
    label: "Bertahap Pembayaran",
  },
];

const RowNormal = () => {
  return (
    <StyledTableRow>
      {["1", "Barang 1", "3", "EA", "10,00", "20,00", ""].map((el, idx) => (
        <TableCell key={idx} className="text-dark text-left">
          {el}
        </TableCell>
      ))}
    </StyledTableRow>
  );
};
const RowBank = () => {
  return (
    <StyledTableRow>
      {[
        "1",
        "PT Abyor International",
        "BNI",
        "PT Abyor International",
        "21456378",
      ].map((el, idx) => (
        <TableCell key={idx} className="text-dark text-left">
          {el}
        </TableCell>
      ))}
    </StyledTableRow>
  );
};

const RowAdditional = ({ label, value }) => {
  return (
    <StyledTableRow>
      <TableCell colSpan={5} className="text-dark text-right">
        {label}
      </TableCell>
      <TableCell colSpan={2} className="text-dark text-left">
        2.5123.1231
      </TableCell>
      {/* <TableCell className="text-dark text-right"></TableCell> */}
    </StyledTableRow>
  );
};

const HargaPekerjaan = () => {
  const [navActive, setNavActive] = React.useState(navLists[0].id);

  return (
    <Card>
      <CardBody>
        <Row>
          <Col md={6}>
            <div className="form-group row">
              <label className="col-sm-4 col-form-label">
                Nilai Perjanjian
              </label>
              <InputGroup className="col-sm-8 mb-3">
                <DropdownButton
                  as={InputGroup.Prepend}
                  variant="outline-secondary"
                  title="IDR"
                  disabled
                  id="input-group-dropdown-1"
                >
                  <Dropdown.Item href="#">IDR</Dropdown.Item>
                  <Dropdown.Item href="#">USD</Dropdown.Item>
                </DropdownButton>
                <FormControl disabled aria-describedby="basic-addon1" />
              </InputGroup>
            </div>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <TitleField title={"Rincian Harga Pekerjaan"} />
          </Col>
        </Row>
        <TableBuilder
          hecto={10}
          dataHead={[
            "No",
            "Deskripsi",
            "QTY",
            "Satuan",
            "Harga Satuan",
            "Harga Total",
            "Keterangan",
          ]}
          dataBody={[{ name: "oke" }, { name: "oke" }, { name: "oke" }]}
          renderRowBody={({ item, index }) => <RowNormal key={index} />}
          footerComponent={
            <React.Fragment>
              <RowAdditional label={"Subtotal"} />
              <RowAdditional label={"PPN 10%"} />
              <RowAdditional label={"Grand Total"} />
            </React.Fragment>
          }
        />
        <Row>
          <Col md={6}>
            <TitleField title={"Metode Pembayaran"} />
          </Col>
        </Row>
        <Navs
          navLists={navLists}
          handleSelect={(selectedKey) => setNavActive(selectedKey)}
          style={{ marginBottom: 21 }}
        />
        {navActive === "pertama" &&
          [1, 2, 3, 4].map((el, id) => (
            <Row key={id}>
              <Col md={6}>
                <RenderInput name={"namama"} label={"Tahap 1"} />
              </Col>
            </Row>
          ))}
        {navActive === "kedua" &&
          [1, 2, 3, 4].map((el, id) => (
            <Row key={id}>
              <Col md={6}>
                <RenderInput name={"namama"} label={"Tahap 1"} />
              </Col>
            </Row>
          ))}
        <Row>
          <Col md={12}>
            <TitleField title={"Referensi Bank Penyedia"} />
          </Col>
          <Col md={12}>
            <TableBuilder
              hecto={12}
              dataHead={[
                "No",
                "Atas Nama",
                "Nama Bank",
                "Alamat Bank",
                "Nomor Rekening",
              ]}
              dataBody={[
                { name: "oke" },
                { name: "oke" },
                { name: "oke" },
                { name: "oke" },
              ]}
              renderRowBody={({ item, index }) => <RowBank key={index} />}
            />
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default withBox(HargaPekerjaan);
