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
import FormBuilder from "../../../../../components/builder/FormBuilder";
import TableBuilder from "../../../../../components/builder/TableBuilder";
import BasicInput from "../../../../../components/input/BasicInput";
import RenderInput from "../../../../../components/input/RenderInput";
import TitleField from "../../../../../components/input/TitleField";
import Navs from "../../../../../components/navs";
import TablePaginationCustom from "../../../../../components/tables/TablePagination";
import { printMoney } from "../../../../../libs/currency";
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
  const formDataRef = React.useRef([]);
  const {
    contract_value,
    payment_method_data,
    data_bank,
    contract_items,
    payment_method,
    total_amount,
  } = useSelector((state) => state.deliveryMonitoring.dataContractById);

  const initValues = React.useMemo(() => {
    var val = {};
    var form = [];
    let dataxx = payment_method_data?.forEach((el, id) => {
      val[`tahap_${id + 1}`] = el?.value;
      form[id] = { name: `tahap_${id + 1}`, label: "Tahap " + el?.payment };
      return;
    });
    formDataRef.current = form;
    return { ...val };
  }, [payment_method_data, formDataRef]);

  React.useEffect(() => {
    if (payment_method === "gradually") setNavActive(navLists[1].id);
  }, [payment_method]);
  console.log(`payment_method`, payment_method);
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
                  defaultValue={printMoney(contract_value).substring(3)}
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
          rows={contract_items?.map((el, id) => ({
            no: id + 1,
            desc: el?.product_title,
            qty: el?.qty,
            satuan: el?.uom,
            harga_satuan: printMoney(el?.unit_price),
            sum: printMoney(el?.subtotal),
            ket: "",
          }))}
          footerComponent={
            <React.Fragment>
              <RowAdditional
                label={"Subtotal"}
                value={printMoney(total_amount)}
              />
              <RowAdditional
                label={"PPN 11%"}
                value={printMoney(total_amount * (11 / 100))}
              />
              <RowAdditional
                label={"Grand Total"}
                value={printMoney(contract_value)}
              />
            </React.Fragment>
          }
        />
        <Row className={"mt-3"}>
          <Col md={6}>
            <TitleField title={"Metode Pembayaran"} />
          </Col>
        </Row>
        <Navs
          navLists={navLists}
          // handleSelect={(selectedKey) => setNavActive(selectedKey)}
          activeKey={navActive}
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
        {navActive === "kedua" && (
          <Row>
            <Col md={6}>
              <FormBuilder
                withSubmit={false}
                initial={initValues}
                formData={formDataRef.current}
                fieldProps={{ readOnly: true }}
              />
            </Col>
          </Row>
        )}
        <Row>
          <Col md={12}>
            <TitleField title={"Referensi Bank Penyedia"} />
          </Col>
          <Col md={12}>
            <TablePaginationCustom
              headerRows={tableHeader2}
              // width={1210}
              withPagination={false}
              withSearch={false}
              rows={data_bank?.map((el, id) => ({
                no: id + 1,
                behalf: el?.account_holder_name,
                bank_name: el?.bank?.full_name,
                address: el?.address?.postal_address,
                account_no: el?.account_number,
              }))}
            />
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default withBox(HargaPekerjaan);
