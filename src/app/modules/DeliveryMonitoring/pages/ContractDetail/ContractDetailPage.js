import React from 'react';
import { Paper, makeStyles, Icon, CircularProgress } from '@material-ui/core';
import { Form, Row, Col, Container } from 'react-bootstrap';
import SVG from 'react-inlinesvg';
import { toAbsoluteUrl } from '../../../../../_metronic/_helpers';
import { Link, useParams } from 'react-router-dom';
import Tabs from '../../../../components/tabs';
import * as deliveryMonitoring from '../../service/DeliveryMonitoringCrud';
import useToast from '../../../../components/toast';
import Subheader from '../../../../components/subheader';
import SubBreadcrumbs from '../../../../components/SubBreadcrumbs';
import { useSelector, useDispatch } from 'react-redux';
import { actionTypes } from '../../_redux/deliveryMonitoringAction';
import CustomTable from '../../../../components/tables';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(1),
    overflowX: 'auto',
  },
  table: {
    minWidth: 650,
  },
}));

// function createDetailContract(
//   nomor_kontrak,
//   no_po,
//   judul_pengadaan,
//   kewenangan,
//   user,
//   header_text_po,
//   harga_pekerjaan,
//   penyedia,
//   status
// ) {
//   return {
//     nomor_kontrak,
//     no_po,
//     judul_pengadaan,
//     kewenangan,
//     user,
//     header_text_po,
//     harga_pekerjaan,
//     penyedia,
//     status,
//   };
// }

// const detailContractRows = createDetailContract(
//   '011.PJ/PST30-GDE/X/2020',
//   'PO.I',
//   'Pengadaan Leapfrog',
//   '',
//   'Juned',
//   '',
//   2000000,
//   'PT. XYZ',
//   'Selesai'
// );

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

const tableHeaderTermin = [
  'No',
  'Scope of Work',
  'Due Date',
  'Bobot',
  'Harga Pekerjaan',
  'Project Progress',
  'Document Progress',
  'Deliverables Document',
  'Status',
  'Action',
];

export const ContractDetailPage = () => {
  const classes = useStyles();
  const { contract_id } = useParams();
  const [Toast, setToast] = useToast();
  const { dataContractById } = useSelector((state) => state.deliveryMonitoring);
  const dispatch = useDispatch();
  const [tabActive, setTabActive] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [tableContent, setTableContent] = React.useState([]);

  const generateTableContent = (data) => {
    data.forEach((item, index) => {
      const rows = [
        { content: (index += 1) },
        { content: item.name },
        { content: item.due_date },
        { content: '' },
        { content: '' },
        { content: item.progress },
        { content: '' },
        {
          content: (
            <Link
              to={`/delivery_monitoring/contract/${contract_id}/task/${item.id}`}
            >
              <span>Document</span>
            </Link>
          ),
        },
        { content: item.task_status.name },
        {
          content: (
            <div className="d-flex justify-content-between flex-row">
              <button className="btn btn-sm p-1">
                <Icon className="fas fa-edit text-primary" />
              </button>
              <button className="btn btn-sm p-1 mr-2">
                <Icon className="fas fa-trash text-danger" />
              </button>
            </div>
          ),
        },
      ];
      setTableContent((prev) => [...prev, rows]);
    });
  };

  const getContractById = async (contract_id) => {
    try {
      setLoading(true);
      const {
        data: { data },
      } = await deliveryMonitoring.getContractById(contract_id);
      console.log(data);

      dispatch({
        type: actionTypes.SetContractById,
        payload: data,
      });

      console.log(data[0].tasks);

      generateTableContent(data[0].tasks);
    } catch (error) {
      console.log(error);
      setToast('Error API, please contact developer!');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    getContractById(contract_id);
    // eslint-disable-next-line
  }, []);

  function handleChangeTab(event, newTabActive) {
    setTabActive(newTabActive);
  }

  return (
    <>
      <Toast />

      {loading ? (
        <div className="d-flex justify-content-center m-5 border-danger">
          <CircularProgress />
        </div>
      ) : null}

      <Subheader
        text={
          dataContractById[0]
            ? `${dataContractById[0].contract_no} - ${dataContractById[0].contract_name}`
            : null
        }
        IconComponent={
          <SVG
            src={toAbsoluteUrl('/media/svg/icons/Home/Book-open.svg')}
            style={{ color: 'white' }}
          />
        }
      />

      <SubBreadcrumbs
        items={[
          {
            label: 'List of Contract & PO',
            to: '/delivery_monitoring/contract',
          },
          {
            label: `${
              dataContractById[0] ? dataContractById[0].contract_name : 'x'
            }`,
            to: '/',
          },
        ]}
      />

      <Paper className={classes.root}>
        <Container>
          <Tabs
            tabActive={tabActive}
            handleChange={handleChangeTab}
            tabLists={TabLists}
          />
        </Container>
        <hr className="p-0 m-0" />
        {tabActive === 0 && dataContractById[0] ? (
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
                          defaultValue={dataContractById[0].contract_no}
                          disabled
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
                          defaultValue={dataContractById[0].contract_name}
                          disabled
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
                          // defaultValue={detailContractRows.kewenangan}
                          disabled
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
                          // defaultValue={detailContractRows.user}
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
                          defaultValue={dataContractById[0].purch_order_no}
                          disabled
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
                          defaultValue={dataContractById[0].purch_order.name}
                          disabled
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
                          defaultValue={dataContractById[0].vendor.code}
                          disabled
                        />
                      </Col>
                    </Form.Group>
                  </Col>
                </Row>
              </Container>
            </Form>

            <Container>
              <CustomTable
                tableHeader={tableHeaderTermin}
                tableContent={tableContent}
                marginY="my-5"
                hecto="hecto-16"
              />
            </Container>
          </>
        ) : null}
        {tabActive === 1 && <div>Dokumen Kontrak</div>}
        {tabActive === 2 && <div>Jaminan</div>}
        {tabActive === 3 && <div>Harga Pekerjaan</div>}
        {tabActive === 4 && <div>Jangka Waktu</div>}
        {tabActive === 5 && <div>Para Pihak</div>}
      </Paper>
    </>
  );
};

export default ContractDetailPage;
