import React from 'react';
import { Card, CardBody } from '../../../../../_metronic/_partials/controls';
import { Nav, Form, Row, Col } from 'react-bootstrap';
import { makeStyles, Button } from '@material-ui/core';
import CustomTable from '../../../../components/tables';

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

const tableHeader = [
  'Nomor BAPP',
  'Tanggal',
  'Approve By',
  'Lampiran BAPP TTD',
  'Action',
];

const dataBAPP = [
  {
    id: 1,
    no_bapp: '012.BA/PST/.30-GDE/IX/2020',
    tanggal: '01 Januari 2020',
    approve_by: 'Dian PS',
    lampiran: '012.BA/PST/.30-GDE/IX/2020.pdf',
  },
  {
    id: 1,
    no_bapp: '012.BA/PST/.30-GDE/IX/2020',
    tanggal: '02 Januari 2020',
    approve_by: 'Dian PS',
    lampiran: '012.BA/PST/.30-GDE/IX/2020.pdf',
  },
];

export default function BeritaAcara() {
  const classes = useStyles();
  const [navActive, setNavActive] = React.useState('BAPP');
  const [tableContent, setTableContent] = React.useState([]);

  React.useEffect(() => {
    dataBAPP.forEach((item) => {
      const rows = [
        { content: item.no_bapp },
        { content: item.tanggal },
        { content: item.approve_by },
        { content: item.lampiran },
        {
          content: (
            <div className="d-flex justify-content-between flex-row">
              <button
                className="btn btn-sm p-1"
                onClick={(e) => console.log(e)}
              >
                <i className="fas fa-edit text-primary"></i>
              </button>
              <button
                className="btn btn-sm p-1 mr-2"
                onClick={(e) => console.log(e)}
              >
                <i className="fas fa-trash text-danger"></i>
              </button>
            </div>
          ),
        },
      ];
      setTableContent((prev) => [...prev, rows]);
    });
  }, []);

  return (
    <React.Fragment>
      <Card>
        <CardBody>
          <Nav variant="pills" defaultActiveKey="link-bapp">
            <Nav.Item onClick={() => setNavActive('BAPP')}>
              <Nav.Link eventKey="link-bapp" className={classes.navLink}>
                BAPP
              </Nav.Link>
            </Nav.Item>
            <Nav.Item onClick={() => setNavActive('BAST')}>
              <Nav.Link eventKey="link-bast" className={classes.navLink}>
                BAST
              </Nav.Link>
            </Nav.Item>
          </Nav>
          {navActive === 'BAPP' && (
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
                    controlId="tanggal BAPP"
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
                        value="judul kontrak"
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
                        value="Nama PT Pelaksana/SPK nya"
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
                        value="Nomor Kontrak SPK atau Perjanjian"
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
                        value="Nomor PO"
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
                      defaultValue="Isikan hasil pekerjaan yang telah diselesaikan"
                    />
                  </Form.Group>
                  <Form.Group as={Col} controlId="file-attachment">
                    <Form.Label>Attachment</Form.Label>
                    <Form.File size="sm" />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          )}
          {navActive === 'BAST' && <div>Ini BAST</div>}
        </CardBody>
      </Card>

      <Card className="mt-5">
        <CardBody>
          <Button
            variant="contained"
            color="secondary"
            className={classes.button}
            size="small"
            onClick={(e) => console.log('tableContent: ', tableContent)}
          >
            <i className={`fas fa-eye text-white ${classes.iconButton}`}></i>
            preview
          </Button>
          <Button
            variant="contained"
            color="secondary"
            className={classes.button}
            size="small"
          >
            <i className={`fas fa-print text-white ${classes.iconButton}`}></i>
            print BAPP
          </Button>
          <Button
            variant="contained"
            color="secondary"
            className={classes.button}
            size="small"
          >
            <i className={`fas fa-upload text-white ${classes.iconButton}`}></i>
            upload
          </Button>
          <CustomTable tableHeader={tableHeader} tableContent={tableContent} />
        </CardBody>
      </Card>
    </React.Fragment>
  );
}
