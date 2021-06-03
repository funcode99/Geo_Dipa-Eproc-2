import React from 'react';
import {
  Paper,
  makeStyles,
  Icon,
  CircularProgress,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
} from '@material-ui/core';
import { Form, Row, Col, Container } from 'react-bootstrap';
import SVG from 'react-inlinesvg';
import { toAbsoluteUrl } from '../../../../../_metronic/_helpers';
import { Link, useParams, withRouter } from 'react-router-dom';
import Tabs from '../../../../components/tabs';
import * as deliveryMonitoring from '../../service/DeliveryMonitoringCrud';
import useToast from '../../../../components/toast';
import Subheader from '../../../../components/subheader';
import SubBreadcrumbs from '../../../../components/SubBreadcrumbs';
import { useSelector, useDispatch } from 'react-redux';
import { actionTypes } from '../../_redux/deliveryMonitoringAction';
import CustomTable from '../../../../components/tables';
import { rupiah } from '../../../../libs/currency';
import { StyledModal } from '../../../../components/modals';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { format } from 'date-fns';
import formatDate from '../../../../libs/date';
import * as Option from '../../../../service/Option';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(1),
    overflowX: 'auto',
  },
  table: {
    minWidth: 650,
  },
  textField: {
    width: '75%',
    marginBottom: theme.spacing(2),
  },
}));

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
  const [modals, setModals] = React.useState(false);
  const [update, setUpdate] = React.useState({ id: '', update: false });
  const [confirm, setConfirm] = React.useState({ show: false, id: '' });
  const [options, setOptions] = React.useState();

  const FormSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, 'Input minimal 3 karakter')
      .required('Field ini wajib diisi'),
    due_date: Yup.date()
      .required('Field ini wajib diisi')
      .nullable()
      .min(new Date(Date.now() - 86400000), 'Minimal hari ini'),
  });

  const initialValues = {
    name: '',
    due_date: format(new Date(), 'yyy-MM-dd'),
    status: 876,
  };

  const formik = useFormik({
    initialValues,
    validationSchema: FormSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      try {
        enableLoading();
        console.log(values);
        console.log(formik.errors);
        console.log(formik.status);

        let requestData = {};

        if (update.update) {
          requestData = {
            name: values.name,
            due_date: values.due_date,
            task_status_id: values.status,
          };
        } else {
          requestData = {
            contract_id: contract_id,
            name: values.name,
            due_date: values.due_date,
          };
        }

        console.log(requestData);

        const {
          data: { status },
        } = update.update
          ? await deliveryMonitoring.submitTask(requestData, update)
          : await deliveryMonitoring.submitTask(requestData);

        console.log(status);

        if (status) {
          getContractById(contract_id);
          setModals(false);
        }
      } catch (error) {
        setToast('Error API, Please contact developer!');
        setSubmitting(false);
        setStatus('Failed Submit Data');
      } finally {
        disableLoading();
      }
    },
  });

  const enableLoading = () => {
    setLoading(true);
  };

  const disableLoading = () => {
    setLoading(false);
  };

  // generate isi table task
  const generateTableContent = (data) => {
    setTableContent([]);
    data.forEach((item, index) => {
      const rows = [
        { content: (index += 1) },
        { content: item.name },
        {
          content:
            item.due_date !== null ? formatDate(new Date(item.due_date)) : null,
        },
        { content: '' },
        { content: '' },
        { content: item.progress },
        { content: '' },
        {
          content: (
            <Link
              to={{
                pathname: `/client/delivery-monitoring/contract/task/${item.id}`,
              }}
            >
              <span>Document</span>
            </Link>
          ),
        },
        { content: item.task_status.name },
        {
          content: (
            <div className="d-flex justify-content-between flex-row">
              <button
                disabled={
                  item.task_status_id === '89a4fe6c-9ce2-4595-b8f0-914d17c91bb4'
                    ? true
                    : false
                }
                className="btn btn-sm p-1"
                onClick={() => handleModal('update', item)}
              >
                <Icon className="fas fa-edit text-primary" />
              </button>
              <button
                className="btn btn-sm p-1 mr-2"
                onClick={() => setConfirm({ show: true, id: item.id })}
              >
                <Icon className="fas fa-trash text-danger" />
              </button>
            </div>
          ),
        },
      ];
      setTableContent((prev) => [...prev, rows]);
    });
  };

  // get data contract detail from api
  const getContractById = async (contract_id) => {
    try {
      dispatch({
        type: actionTypes.SetContractById,
        payload: [],
      });

      setLoading(true);
      const {
        data: { data },
      } = await deliveryMonitoring.getContractById(contract_id);

      dispatch({
        type: actionTypes.SetContractById,
        payload: data,
      });

      generateTableContent(data[0].tasks);
    } catch (error) {
      if (
        error.response?.status !== 400 &&
        error.response?.data.message !== 'TokenExpiredError'
      ) {
        setToast('Error API, please contact developer!');
      }
    } finally {
      setLoading(false);
    }
  };

  const getOptions = async () => {
    try {
      setLoading(true);
      const {
        data: { data },
      } = await Option.getAllOptions();

      // console.log(data.task_status);

      setOptions(data.task_status);
    } catch (error) {
      setToast('Error API, please contact developer!');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    getContractById(contract_id);
    getOptions();
    // eslint-disable-next-line
  }, []);

  function handleChangeTab(event, newTabActive) {
    setTabActive(newTabActive);
  }

  const handleClose = () => {
    setModals(false);
  };

  const handleModal = async (type, items) => {
    if (type === 'update') {
      // console.log(`type: ${type}`);
      // console.log(items);
      // console.log(items.due_date);

      setUpdate({ id: items.id, update: true });

      formik.setValues({
        name: items.name,
        due_date: items.due_date
          ? format(new Date(items.due_date), 'yyy-MM-dd')
          : format(new Date(), 'yyy-MM-dd'),
        status: items.task_status_id,
      });
    } else if (type === 'create') {
      formik.setValues(initialValues);
      setUpdate({ id: '', update: false });
    }

    setModals(true);
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deliveryMonitoring.deleteTask(confirm.id);
      setConfirm({ ...confirm, show: false });
      getContractById(contract_id);
    } catch (error) {
      setToast('Error with API, please contact Developer!');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <React.Fragment>
      <Toast />

      <StyledModal
        visible={modals}
        onClose={handleClose}
        hideCloseIcon={false}
        disableBackdrop
        minWidth="40vw"
      >
        <form
          noValidate
          autoComplete="off"
          className="d-flex flex-column"
          onSubmit={formik.handleSubmit}
        >
          <div className="d-flex align-items-start flex-column mb-5">
            <h3>{update.update ? 'Update ' : 'Create '} Termin</h3>
          </div>

          <TextField
            label="Scope of Work"
            variant="outlined"
            name="name"
            className={classes.textField}
            size="small"
            {...formik.getFieldProps('name')}
          />
          <p style={{ color: 'red' }}>
            {formik.touched.name && formik.errors.name
              ? formik.errors.name
              : null}
          </p>

          <TextField
            label="Due Date"
            variant="outlined"
            name="due_date"
            className={classes.textField}
            size="small"
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
            {...formik.getFieldProps('due_date')}
          />
          <p style={{ color: 'red' }}>
            {formik.touched.due_date && formik.errors.due_date
              ? formik.errors.due_date
              : null}
          </p>

          {update.update ? (
            <React.Fragment>
              <InputLabel id="task-status">Status</InputLabel>
              <Select
                labelId="task-status"
                id="task-status-id"
                name="status"
                size="small"
                className={classes.textField}
                {...formik.getFieldProps('status')}
              >
                <MenuItem value={876}>Select Item</MenuItem>
                {options &&
                  options.map((val) => (
                    <MenuItem key={val.id} value={val.id}>
                      {val.name}
                    </MenuItem>
                  ))}
              </Select>
              <p style={{ color: 'red' }}>
                {formik.touched.status && formik.errors.status
                  ? formik.errors.status
                  : null}
              </p>
            </React.Fragment>
          ) : null}

          <div className="d-flex mt-5">
            <Button
              // disabled={loading}
              className="btn btn-primary ml-auto"
              type="submit"
              variant="contained"
            >
              {loading ? <CircularProgress /> : null}&nbsp;
              {update.update ? 'Update ' : 'Create '}
            </Button>
          </div>
        </form>
      </StyledModal>

      <StyledModal
        visible={confirm.show}
        onClose={() => setConfirm({ ...confirm, show: false })}
        hideCloseIcon={false}
        disableBackdrop
        minWidth="40vw"
      >
        <div className="d-flex justify-content-center mb-3">
          <h3>Are you sure want to delete?</h3>
        </div>
        <div>
          <Button
            variant="contained"
            disabled={loading}
            style={{
              width: '40%',
              background: 'red',
              color: 'white',
              marginInline: 10,
            }}
            onClick={() => handleDelete()}
          >
            {loading ? <CircularProgress /> : null}&nbsp; Delete
          </Button>
          <Button
            variant="contained"
            disabled={loading}
            style={{ width: '40%', marginInline: 10 }}
            onClick={() => setConfirm({ ...confirm, show: false })}
          >
            Cancel
          </Button>
        </div>
      </StyledModal>

      {loading ? (
        <div className="d-flex justify-content-center m-5 border-danger">
          <CircularProgress />
        </div>
      ) : null}

      <Subheader
        text={
          dataContractById?.[0]
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
            to: '/client/delivery-monitoring/contract',
          },
          {
            label: `${
              dataContractById?.[0] ? dataContractById[0].contract_name : 'x'
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
        {tabActive === 0 ? (
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
                          defaultValue={dataContractById?.[0]?.contract_no}
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
                          defaultValue={dataContractById?.[0]?.contract_name}
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
                          defaultValue={dataContractById?.[0]?.purch_order_no}
                          disabled
                        />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                      <Form.Label column md="4">
                        Nama PO
                      </Form.Label>
                      <Col md="8">
                        <Form.Control
                          required
                          type="text"
                          placeholder="Header Text PO"
                          defaultValue={dataContractById?.[0]?.purch_order.name}
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
                          defaultValue={rupiah(
                            parseInt(dataContractById?.[0]?.total_amount)
                          )}
                          disabled
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
                          defaultValue={
                            dataContractById?.[0]?.vendor?.party?.full_name
                          }
                          disabled
                        />
                      </Col>
                    </Form.Group>
                  </Col>
                </Row>
              </Container>
            </Form>

            <Container>
              <div className="d-flex justify-content-end w-100">
                <button
                  className="btn btn-outline-success btn-sm mt-3 mb-1"
                  onClick={() => handleModal('create')}
                >
                  <span className="nav-icon">
                    <i className="flaticon2-plus"></i>
                  </span>
                  <span className="nav-text">Create</span>
                </button>
              </div>

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
    </React.Fragment>
  );
};

export default withRouter(ContractDetailPage);
