import React from "react";
import { Card, CardBody } from "../../../../../_metronic/_partials/controls";
import { Form, Row, Col } from "react-bootstrap";
import { makeStyles, Button } from "@material-ui/core";
import CustomTable from "../../../../components/tables";
import { Send } from "@material-ui/icons";
import Navs from "../../../../components/navs";
import { useSelector, useDispatch } from "react-redux";
import BAPP from "./BAPP";
import BAST from "../ContractDetail/components/BAST";

const useStyles = makeStyles((theme) => ({
  navLink: {
    fontWeight: 600,
  },
  button: {
    margin: theme.spacing(1),
  },
  iconButton: {
    marginRight: theme.spacing(0.5),
  },
}));

const tableHeaderBAPP = [
  { label: "Nomor BAPP" },
  { label: "Tanggal" },
  { label: "Approve By" },
  { label: "Lampiran BAPP TTD" },
  { label: "Action" },
];

const tempDataBAPP = [
  {
    id: 1,
    no_bapp: "012.BA/PST/.30-GDE/IX/2020",
    tanggal: "01 Januari 2020",
    approve_by: "Dian PS",
    lampiran: "012.BA/PST/.30-GDE/IX/2020.pdf",
  },
  {
    id: 1,
    no_bapp: "012.BA/PST/.30-GDE/IX/2020",
    tanggal: "02 Januari 2020",
    approve_by: "Dian PS",
    lampiran: "012.BA/PST/.30-GDE/IX/2020.pdf",
  },
];

const navLists = [
  { id: "link-bapp", label: "BAPP" },
  { id: "link-bast", label: "BAST" },
];

export default function BeritaAcara(props) {
  const classes = useStyles();
  const { dataContractById } = useSelector((state) => state.deliveryMonitoring);
  const [navActive, setNavActive] = React.useState(navLists[0].id);
  const [tableContent, setTableContent] = React.useState([]);
  const [dataBAPP, setDataBAPP] = React.useState(tempDataBAPP);

  console.log(`berita acara`);

  // const generateTableContent = (data) => {
  //   data.forEach((item) => {
  //     const rows = [
  //       { content: item.no_bapp },
  //       { content: item.tanggal },
  //       { content: item.approve_by },
  //       { content: item.lampiran },
  //       {
  //         content: (
  //           <div className="d-flex flex-row justify-content-center">
  //             <button
  //               className="btn btn-sm p-1"
  //               onClick={(e) => console.log(e)}
  //             >
  //               <i className="fas fa-edit text-primary"></i>
  //             </button>
  //             <button
  //               className="btn btn-sm p-1 mr-2"
  //               onClick={(e) => console.log(e)}
  //             >
  //               <i className="fas fa-trash text-danger"></i>
  //             </button>
  //           </div>
  //         ),
  //       },
  //     ];
  //     setTableContent((prev) => [...prev, rows]);
  //   });
  // };

  // React.useEffect(() => {
  //   generateTableContent(tempDataBAPP);
  // }, []);

  return (
    <React.Fragment>
      <Card>
        <CardBody>
          <Navs
            navLists={navLists}
            handleSelect={(selectedKey) => setNavActive(selectedKey)}
          />

          <div className="mt-5">
            {navActive === "link-bapp" && <BAPP {...props} />}
            {navActive === "link-bast" && <BAST {...props} />}
          </div>
          {/* <React.Fragment>
            <Form className="mt-3">
              <Row>
                <Col>
                  <Form.Group as={Row} controlId="nomor-bapp" className="mb-2">
                    <Form.Label column sm="4">
                      Nomor BAPP
                    </Form.Label>
                    <Col sm="8">
                      <Form.Control
                        type="text"
                        size="sm"
                        placeholder="Nomor BAPP..."
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group
                    as={Row}
                    controlId="tanggal-bapp"
                    className="mb-2"
                  >
                    <Form.Label column sm="4">
                      Tanggal BAPP
                    </Form.Label>
                    <Col sm="8">
                      <Form.Control type="text" size="sm" />
                    </Col>
                  </Form.Group>
                  <Form.Group
                    as={Row}
                    controlId="jenis-pekerjaan"
                    className="mb-2"
                  >
                    <Form.Label column sm="4">
                      Jenis Pekerjaan
                    </Form.Label>
                    <Col sm="8">
                      <Form.Control
                        type="text"
                        size="sm"
                        disabled
                        value={dataContractById?.contract_name}
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group
                    as={Row}
                    controlId="pelaksana-pekerjaan"
                    className="mb-2"
                  >
                    <Form.Label column sm="4">
                      Pelaksana Pekerjaan
                    </Form.Label>
                    <Col sm="8" className="d-flex align-items-center">
                      <Form.Control
                        type="text"
                        size="sm"
                        disabled
                        value={`PT ${dataContractById?.vendor?.party?.full_name}`}
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group
                    as={Row}
                    controlId="dasar-pelaksanaan"
                    className="mb-2"
                  >
                    <Form.Label column sm="4">
                      Dasar Pelaksanaan
                    </Form.Label>
                    <Col sm="8" className="mb-2 d-flex align-items-center">
                      <Form.Control
                        type="text"
                        size="sm"
                        disabled
                        value={dataContractById?.contract_no}
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} controlId="nomor-po" className="mb-2">
                    <Col sm="4"></Col>
                    <Col sm="8">
                      <Form.Control
                        type="text"
                        size="sm"
                        disabled
                        value={dataContractById?.purch_order_no}
                      />
                    </Col>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group as={Col} controlId="hasil-pekerjaan">
                    <Form.Label>
                      Hasil pekerjaan yang telah diselesaikan
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      size="sm"
                      placeholder="Isikan hasil pekerjaan yang telah diselesaikan"
                    />
                  </Form.Group>
                  <Form.Group as={Col} controlId="file-attachment">
                    <Form.Label>Attachment</Form.Label>
                    <Form.File size="sm" />
                  </Form.Group>
                </Col>
              </Row>
              <div className="d-flex justify-content-end w-100">
                <Button variant="contained" color="secondary" size="medium">
                  <span className="mr-1">Submit</span>
                  <Send />
                </Button>
              </div>
            </Form>
          </React.Fragment> */}
        </CardBody>
      </Card>

      {/* <Card className="mt-5">
        <CardBody>
          {navActive === "link-bapp" && (
            <React.Fragment>
              <Button
                variant="contained"
                color="secondary"
                className={classes.button}
                size="small"
                onClick={(e) => console.log("tableContent: ", tableContent)}
              >
                <i
                  className={`fas fa-eye text-white ${classes.iconButton}`}
                ></i>
                preview
              </Button>
              <Button
                variant="contained"
                color="secondary"
                className={classes.button}
                size="small"
              >
                <i
                  className={`fas fa-upload text-white ${classes.iconButton}`}
                ></i>
                upload
              </Button>
              <Button
                variant="contained"
                color="secondary"
                className={classes.button}
                size="small"
              >
                <i
                  className={`fas fa-print text-white ${classes.iconButton}`}
                ></i>
                print BAPP
              </Button>
              <CustomTable
                tableHeader={tableHeaderBAPP}
                tableContent={tableContent}
                marginY="my-3"
              />
            </React.Fragment>
          )}
        </CardBody>
      </Card> */}
    </React.Fragment>
  );
}
