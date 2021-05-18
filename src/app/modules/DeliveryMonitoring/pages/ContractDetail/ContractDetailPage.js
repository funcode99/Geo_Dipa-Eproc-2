import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  makeStyles,
  Icon,
} from '@material-ui/core';
import { Form, Row, Col, Container } from 'react-bootstrap';
import SVG from 'react-inlinesvg';
import { toAbsoluteUrl } from '../../../../../_metronic/_helpers';
import { Link, useParams } from 'react-router-dom';
import { Tabs } from '../../components';
// import http from '../libs/http';
// import { rupiah } from '../libs/currency';
// import { useSelector, useDispatch } from 'react-redux'
// import { setDataContracts } from '../../_redux/deliveryMonitoringCrud';

import * as deliveryMonitoring from '../../service/DeliveryMonitoringCrud';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto',
  },
  table: {
    minWidth: 650,
  },
}));

function createDetailContract(
  nomor_kontrak,
  no_po,
  judul_pengadaan,
  kewenangan,
  user,
  header_text_po,
  harga_pekerjaan,
  penyedia,
  status
) {
  return {
    nomor_kontrak,
    no_po,
    judul_pengadaan,
    kewenangan,
    user,
    header_text_po,
    harga_pekerjaan,
    penyedia,
    status,
  };
}

const detailContractRows = createDetailContract(
  '011.PJ/PST30-GDE/X/2020',
  'PO.I',
  'Pengadaan Leapfrog',
  '',
  'Juned',
  '',
  2000000,
  'PT. XYZ',
  'Selesai'
);

// function createTermin(
//   termin_id,
//   scope_of_work,
//   due_date,
//   bobot,
//   harga_pekerjaan,
//   project_progress,
//   document_progress,
//   status
// ) {
//   return {
//     termin_id,
//     scope_of_work,
//     due_date,
//     bobot,
//     harga_pekerjaan,
//     project_progress,
//     document_progress,
//     status,
//   };
// }

// const terminRows = [
//   createTermin(1, '', '', 20, '', '', '', ''),
//   createTermin(2, '', '', 20, '', '', '', ''),
//   createTermin(3, '', '', 30, '', '', '', ''),
//   createTermin(4, '', '', 30, '', '', '', ''),
// ];

const TabLists = [
  {
    id: 'detail',
    label: 'Detail',
    icon: '',
  },
  {
    id: 'dokumen-kontrak',
    label: 'Dokumen Kontrak',
    icon: '',
  },
  {
    id: 'jaminan',
    label: 'Jaminan',
    icon: '',
  },
  {
    id: 'harga-pekerjaan',
    label: 'Harga Pekerjaan',
    icon: '',
  },
  {
    id: 'jangka-waktu',
    label: 'Jangka Waktu',
    icon: '',
  },
  {
    id: 'para-pihak',
    label: 'Para Pihak',
    icon: '',
  },
];

export const ContractDetailPage = () => {
  const classes = useStyles();
  const { id } = useParams();
  const [dataContract, setDataContract] = React.useState([]);
  const [tabActive, setTabActive] = React.useState(0);

  const getContractById = async (id) => {
    try {
      const {
        data: { data },
      } = await deliveryMonitoring.getContractById(id);
      setDataContract(data);
      console.log(data);
    } catch (error) {
      window.console.error(error);
    }
  };

  React.useEffect(() => {
    getContractById(id);
    // eslint-disable-next-line
  }, []);

  function handleChangeTab(event, newTabActive) {
    setTabActive(newTabActive);
  }

  return (
    <>
      {dataContract[0] && (
        <div className="d-flex align-items-center flex-wrap mr-1">
          <div className="mr-2 iconWrap">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl('/media/svg/icons/Home/Book-open.svg')} />
            </span>
          </div>
          <div className="d-flex align-items-baseline mr-5">
            <h2 className="text-dark font-weight-bold my-2 mr-5">
              {dataContract[0] &&
                `${dataContract[0].id} - ${dataContract[0].name}`}
            </h2>
          </div>
        </div>
      )}
      {dataContract[0] && (
        <Paper className={classes.root}>
          <Container>
            <Tabs
              tabActive={tabActive}
              handleChange={handleChangeTab}
              tabLists={TabLists}
            />
          </Container>
          <hr className="p-0 m-0" />
          {tabActive === 0 && (
            <>
              <Form className="my-3">
                <Container>
                  <Row>
                    <Col>
                      <Form.Group as={Row}>
                        <Form.Label column md="4">
                          Nomor Kontrak
                        </Form.Label>
                        <Col sm="8">
                          <Form.Control
                            required
                            type="text"
                            placeholder="Nomor Kontrak"
                            defaultValue={dataContract[0].id}
                          />
                        </Col>
                      </Form.Group>
                      <Form.Group as={Row}>
                        <Form.Label column md="4">
                          Judul Pengadaan
                        </Form.Label>
                        <Col md="8">
                          <Form.Control
                            required
                            type="text"
                            placeholder="Judul Pengadaan"
                            defaultValue={dataContract[0].name}
                          />
                        </Col>
                      </Form.Group>
                      <Form.Group as={Row} controlId="validationCustom02">
                        <Form.Label column sm="4">
                          Kewenangan
                        </Form.Label>
                        <Col md="8">
                          <Form.Control
                            required
                            type="text"
                            placeholder="Kewenangan"
                            defaultValue={detailContractRows.kewenangan}
                          />
                        </Col>
                      </Form.Group>
                      <Form.Group as={Row} controlId="validationCustom02">
                        <Form.Label column md="4">
                          User
                        </Form.Label>
                        <Col md="8">
                          <Form.Control
                            required
                            type="text"
                            placeholder="User"
                            defaultValue={detailContractRows.user}
                          />
                        </Col>
                      </Form.Group>
                    </Col>

                    <Col>
                      <Form.Group as={Row}>
                        <Form.Label column md="4">
                          Nomor PO
                        </Form.Label>
                        <Col sm="8">
                          <Form.Control
                            required
                            type="text"
                            placeholder="Nomor PO"
                            defaultValue={detailContractRows.no_po}
                          />
                        </Col>
                      </Form.Group>
                      <Form.Group as={Row}>
                        <Form.Label column md="4">
                          Header Text PO
                        </Form.Label>
                        <Col md="8">
                          <Form.Control
                            required
                            type="text"
                            placeholder="Header Text PO"
                            defaultValue={detailContractRows.header_text_po}
                          />
                        </Col>
                      </Form.Group>
                      <Form.Group as={Row}>
                        <Form.Label column sm="4">
                          Harga Pekerjaan
                        </Form.Label>
                        <Col md="8">
                          <Form.Control
                            required
                            type="text"
                            placeholder="Harga Pekerjaan"
                            // defaultValue={rupiah(contract.contract_value)}
                          />
                        </Col>
                      </Form.Group>
                      <Form.Group as={Row}>
                        <Form.Label column md="4">
                          Penyedia
                        </Form.Label>
                        <Col md="8">
                          <Form.Control
                            required
                            type="text"
                            placeholder="Penyedia"
                            defaultValue={detailContractRows.penyedia}
                          />
                        </Col>
                      </Form.Group>
                    </Col>
                  </Row>
                </Container>
              </Form>

              <Container>
                <Table className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <TableCell className="text-white bg-primary">
                        No
                      </TableCell>
                      <TableCell className="text-white bg-primary" align="left">
                        Scope of Work
                      </TableCell>
                      <TableCell
                        className="text-white bg-primary"
                        align="center"
                      >
                        Due Date
                      </TableCell>
                      <TableCell
                        className="text-white bg-primary"
                        align="center"
                      >
                        Bobot
                      </TableCell>
                      <TableCell
                        className="text-white bg-primary"
                        align="center"
                      >
                        Harga Pekerjaan
                      </TableCell>
                      <TableCell
                        className="text-white bg-primary"
                        align="center"
                      >
                        Project Progress
                      </TableCell>
                      <TableCell
                        className="text-white bg-primary"
                        align="center"
                      >
                        Document Progress
                      </TableCell>
                      <TableCell
                        className="text-white bg-primary"
                        align="center"
                      >
                        Deliverables Document
                      </TableCell>
                      <TableCell
                        className="text-white bg-primary"
                        align="center"
                      >
                        Status
                      </TableCell>
                      <TableCell
                        className="text-white bg-primary"
                        align="center"
                      >
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dataContract[0].tasks.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell scope="row">{(index += 1)}</TableCell>
                        <TableCell align="center"></TableCell>
                        <TableCell align="left">{item.due_date}</TableCell>
                        <TableCell align="center"></TableCell>
                        <TableCell align="center"></TableCell>
                        <TableCell align="center">{item.progress}</TableCell>
                        <TableCell align="center">
                          {item.document_progress}
                        </TableCell>
                        <TableCell align="center">
                          <Link
                            to={`/delivery_monitoring/contract/${item.id}/item`}
                          >
                            <span>Document</span>
                          </Link>
                        </TableCell>
                        <TableCell align="center"></TableCell>
                        <TableCell align="center">
                          <div className="d-flex justify-content-between flex-row">
                            <button className="btn btn-sm p-1">
                              <Icon className="fas fa-edit text-primary" />
                            </button>
                            <button className="btn btn-sm p-1 mr-2">
                              <Icon className="fas fa-trash text-danger" />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Container>
            </>
          )}
          {tabActive === 1 && <div>Dokumen Kontrak</div>}
          {tabActive === 2 && <div>Jaminan</div>}
          {tabActive === 3 && <div>Harga Pekerjaan</div>}
          {tabActive === 4 && <div>Jangka Waktu</div>}
          {tabActive === 5 && <div>Para Pihak</div>}
        </Paper>
      )}
    </>
  );
};

export default ContractDetailPage;
