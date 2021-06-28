import { TableCell, TableRow } from "@material-ui/core";
import React from "react";
import {
  Col,
  Dropdown,
  DropdownButton,
  FormControl,
  InputGroup,
  Row,
} from "react-bootstrap";
import { useSelector } from "react-redux";
import { Card, CardBody } from "../../../../../../_metronic/_partials/controls";
import TableBuilder from "../../../../../components/builder/TableBuilder";
import BasicInput from "../../../../../components/input/BasicInput";
import RenderInput from "../../../../../components/input/RenderInput";
import TitleField from "../../../../../components/input/TitleField";
import Navs from "../../../../../components/navs";
import TablePaginationCustom from "../../../../../components/tables/TablePagination";
import { StyledTableRow } from "../../Termin/style";
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

const tableHeader = [
  { id: "no", label: "No" },
  { id: "desc", label: "Deskripsi" },
  { id: "qty", label: "QTY" },
  { id: "satuan", label: "Satuan" },
  { id: "harga_satuan", label: "Harga Satuan" },
  { id: "sum", label: "Harga Total" },
  { id: "ket", label: "Keterangan" },
];
const tableHeader2 = [
  { id: "no", label: "No" },
  { id: "behalf", label: "Atas Nama" },
  { id: "bank_name", label: "Nama Bank" },
  { id: "address", label: "Alamat Bank" },
  { id: "account_no", label: "Nomor Rekening" },
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
const RowBank = ({ data }) => {
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
    <TableRow>
      <TableCell colSpan={4}></TableCell>
      <TableCell className="text-dark">{label}</TableCell>
      <TableCell colSpan={2} className="text-dark text-left">
        {value}
      </TableCell>
      {/* <TableCell className="text-dark text-right"></TableCell> */}
    </TableRow>
  );
};

const HargaPekerjaan = () => {
  const [navActive, setNavActive] = React.useState(navLists[0].id);
  const { contract_value, data_bank } = useSelector(
    (state) => state.deliveryMonitoring.dataContractById
  );

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
                <FormControl
                  disabled
                  defaultValue={contract_value}
                  aria-describedby="basic-addon1"
                />
              </InputGroup>
            </div>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <TitleField title={"Rincian Harga Pekerjaan"} />
          </Col>
        </Row>
        <TablePaginationCustom
          headerRows={tableHeader}
          width={1210}
          withPagination={false}
          withSearch={false}
          rows={[1, 2, 3].map((el, id) => ({
            no: id + 1,
            desc: "desc",
            qty: "qty",
            satuan: "satuan",
            harga_satuan: "harga_satuan",
            sum: "sum",
            ket: "ket",
          }))}
          footerComponent={
            <React.Fragment>
              <RowAdditional label={"Subtotal"} />
              <RowAdditional label={"PPN 10%"} />
              <RowAdditional label={"Grand Total"} value={contract_value} />
            </React.Fragment>
          }
        />
        {/* <TableBuilder
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
          dataBody={[
            { value: "oke" },
            { value: "oke" },
            { value: contract_value },
          ]}
          renderRowBody={({ item, index }) => (
            <RowNormal key={index} {...item} />
          )}
          footerComponent={
            <React.Fragment>
              <RowAdditional label={"Subtotal"} />
              <RowAdditional label={"PPN 10%"} />
              <RowAdditional label={"Grand Total"} value={contract_value} />
            </React.Fragment>
          }
        /> */}
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
        {/* {navActive === "pertama" &&
          [1, 2, 3, 4].map((el, id) => (
            <Row key={id}>
              <Col md={6}>
                <RenderInput
                  disabled
                  values={{}}
                  name={"namama"}
                  label={"Tahap 1"}
                />
              </Col>
            </Row>
          ))} */}
        {navActive === "kedua" &&
          [1, 2, 3, 4].map((el, id) => (
            <Row key={id}>
              <Col md={6}>
                <BasicInput
                  disabled
                  values={{}}
                  name={"namama"}
                  label={"Tahap 1"}
                />
              </Col>
            </Row>
          ))}
        <Row>
          <Col md={12}>
            <TitleField title={"Referensi Bank Penyedia"} />
          </Col>
          <Col md={12}>
            <TablePaginationCustom
              headerRows={tableHeader2}
              width={1210}
              withPagination={false}
              withSearch={false}
              rows={[1, 2, 3].map((el, id) => ({
                no: id + 1,
                behalf: "behalf",
                bank_name: "bank_name",
                address: "address",
                account_no: "account_no",
              }))}
            />

            {/* <TableBuilder
              hecto={12}
              dataHead={[
                "No",
                "Atas Nama",
                "Nama Bank",
                "Alamat Bank",
                "Nomor Rekening",
              ]}
              dataBody={data_bank}
              renderRowBody={({ item, index }) => (
                <RowBank
                  key={index}
                  data={[
                    index + 1,
                    item?.account_holder_name,
                    item?.bank?.full_name,
                    item?.address?.postal_address,
                    item?.account_number,
                  ]}
                />
              )}
            /> */}
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default withBox(HargaPekerjaan);
