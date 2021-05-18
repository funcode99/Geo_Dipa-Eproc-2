import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  Paper,
  makeStyles,
  Icon,
  Button,
  Container,
  FormControlLabel,
  Checkbox,
  CircularProgress,
} from '@material-ui/core';
import SVG from 'react-inlinesvg';
import { useFormik } from 'formik';
import { toAbsoluteUrl } from '../../../../_metronic/_helpers';
// import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import * as master from '../service/MasterCrud';
// import http from '../../libs/http';
import {
  Flex,
  StyledTableHead,
  Input,
  IconWrapper,
  StyledTableRow,
  StyledHead,
  SubWrap,
} from './style';
import { StyledModal } from '../../../components/modals';
import useToast from '../../../components/toast';
import DocumentsTable from './Document';

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

export const DocumentTypes = () => {
  const classes = useStyles();
  const [Toast, setToast] = useToast();
  const [docType, setDocType] = React.useState();
  const [modals, setModals] = React.useState(false);
  const [docId, setType] = React.useState();
  const [confirm, setConfirm] = React.useState({ show: false, id: '' });
  const [update, setUpdate] = React.useState({ id: '', update: false });
  const [loading, setLoading] = React.useState(false);
  // const [form, setForm] = React.useState({ name: '', checked: false });

  const FormSchema = Yup.object().shape({
    document_name: Yup.string()
      .min(3, 'Input minimal 3 karakter')
      .required('Field ini wajib diisi'),
  });

  const enableLoading = () => {
    setLoading(true);
  };

  const disableLoading = () => {
    setLoading(false);
  };
  const initialValues = {
    document_name: '',
    check_periodic: false,
  };

  const getList = async () => {
    try {
      setLoading(true);
      const {
        data: { data },
      } = await master.getList();
      setDocType(data);
    } catch (error) {
      setToast('Error API, please contact developer!');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    getList();
    // eslint-disable-next-line
  }, []);

  const formik = useFormik({
    initialValues,
    validationSchema: FormSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      try {
        enableLoading();
        console.log(values);
        const requestData = {
          name: values.document_name,
          is_periodic: values.check_periodic,
        };

        const {
          data: { status },
        } = update.update
          ? await master.submitDoctypes(requestData, update)
          : await master.submitDoctypes(requestData);

        if (status) {
          getList();
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

  // const getInputClasses = (fieldname) => {
  //   if (formik.touched[fieldname] && formik.errors[fieldname]) {
  //     return 'is-invalid';
  //   }

  //   if (formik.touched[fieldname] && !formik.errors[fieldname]) {
  //     return 'is-valid';
  //   }

  //   return '';
  // };

  // const {
  //   // register,
  //   handleSubmit,
  //   setValue,
  //   formState: { errors },
  // } = useForm({
  //   resolver: yupResolver(FormSchema),
  // });

  // const getDocType = async () => {
  //   try {
  //     const { data } = await http.get(`/document-type`);
  //     // console.log(data);
  //     setDocType(data);
  //   } catch (error) {
  //     setToast('Error with API, please contact Developer!');
  //     window.console.error(error);
  //   }
  // };

  const handleClose = () => {
    setModals(false);
  };
  const handleModal = async (type, id) => {
    if (type === 'update') {
      const {
        data: { data },
      } = await master.getByID(id);
      // console.log(data[0].is_periodic);
      setUpdate({ id, update: true });
      // formik.setFieldValue('document_name', data[0].name);
      formik.setValues({
        document_name: data[0].name,
        check_periodic: data[0].is_periodic,
      });
    } else {
      formik.setValues(initialValues);
    }
    setModals(true);
  };

  // TODO : delete unused code
  // const formSubmit = async (values) => {
  //   try {
  //     setLoading(true);

  //     const requestData = {
  //       name: values.document_name,
  //       is_periodic: values.check_periodic === 'true',
  //     };
  //     console.log(requestData);
  //     // const { status } = update.update
  //     //   ? await http.put(`/document-type/${update.id}`, requestData)
  //     //   : await http.post(`/document-type`, requestData);
  //     // if (status) {
  //     //   getDocType();
  //     //   setModals(false);
  //     //   setForm({ checked: false, name: '' });
  //     // }
  //   } catch (error) {
  //     setToast('Error with API, please contact Developer!');
  //     console.error(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await master.deleteDoctypes(confirm.id);
      setConfirm({ ...confirm, show: false });
      getList();
    } catch (error) {
      setToast('Error with API, please contact Developer!');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Toast />
      <StyledModal
        visible={modals}
        onClose={handleClose}
        hideCloseIcon={false}
        disableBackdrop
      >
        <Flex style={{ justifyContent: 'center' }}>
          <form
            noValidate
            autoComplete="off"
            // onSubmit={handleSubmit(formSubmit)}
            onSubmit={formik.handleSubmit}
          >
            <div style={{ justifyContent: 'center', display: 'flex' }}>
              <h3>Input Form</h3>
            </div>
            <div style={{ justifyContent: 'center', display: 'flex' }}>
              <div style={{ width: '70%', alignSelf: 'center' }}>
                <Input
                  label="Nama Dokumen"
                  variant="outlined"
                  name="document_name"
                  {...formik.getFieldProps('document_name')}
                />
                <p style={{ textAlign: 'center', color: 'red', margin: 5 }}>
                  {formik.touched.document_name && formik.errors.document_name
                    ? formik.errors.document_name
                    : null}
                </p>
              </div>
              <div style={{ alignSelf: 'center' }}>
                <FormControlLabel
                  style={{ alignSelf: 'center' }}
                  control={
                    <Checkbox
                      name="check_periodic"
                      color="primary"
                      size="medium"
                      checked={formik.values.check_periodic}
                      {...formik.getFieldProps('check_periodic')}
                    />
                  }
                  label="Periodik"
                />
              </div>
            </div>
            <div style={{ justifyContent: 'center', display: 'flex' }}>
              <Button
                disabled={loading}
                type="submit"
                color="secondary"
                variant="contained"
                style={{ width: '50%' }}
              >
                {loading ? <CircularProgress /> : null}&nbsp;
                {update.update ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </Flex>
      </StyledModal>
      <StyledModal
        visible={confirm.show}
        onClose={() => setConfirm({ ...confirm, show: false })}
        hideCloseIcon={false}
        disableBackdrop
        align="center"
      >
        <Flex>
          <div>
            <p>Yakin ingin menghapus?</p>
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
        </Flex>
      </StyledModal>
      <div>
        <div className="d-flex align-items-center flex-wrap mr-1">
          <SubWrap className="mr-2 iconWrap">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl('/media/svg/icons/Home/Book-open.svg')} />
            </span>
          </SubWrap>
          <div className="d-flex align-items-baseline mr-5">
            <h2 className="text-dark font-weight-bold my-2 mr-5">
              Master Document Type
            </h2>
          </div>
        </div>
        <Flex>
          <div></div>
          <Button
            color="secondary"
            variant="contained"
            style={{ marginLeft: 'auto' }}
            onClick={() => handleModal('create')}
          >
            Create
          </Button>
        </Flex>

        <Paper className={classes.root} style={{ marginBottom: 30 }}>
          <Table className={classes.table}>
            <StyledTableHead>
              <StyledHead>
                <TableCell>No</TableCell>
                <TableCell>Document Name</TableCell>
                <TableCell align="center">Periodic</TableCell>

                <TableCell align="center" className="MuiTableCell-sizeSmall">
                  Action
                </TableCell>
              </StyledHead>
            </StyledTableHead>
            <TableBody>
              {/* TODO: create open document table  */}
              <StyledTableRow hover onClick={() => setType(' ')}>
                {/* <StyledTableRow hover> */}
                <TableCell colSpan={4} align="center">
                  <Button variant="contained">See all document type</Button>
                </TableCell>
              </StyledTableRow>

              {loading ? (
                <StyledTableRow hover>
                  <TableCell colSpan={4} align="center">
                    <CircularProgress />
                  </TableCell>
                </StyledTableRow>
              ) : null}

              {docType?.map((row, i) => (
                <StyledTableRow
                  key={row.id}
                  hover
                  className={`${row.id === docId ? 'Mui-selected' : ''}`}
                >
                  <TableCell scope="row">{i + 1}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell align="center">
                    {row.is_periodic ? (
                      <Icon className="fas fa-check-circle" color="primary" />
                    ) : (
                      <Icon className="fas fa-times-circle" color="error" />
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <IconWrapper>
                      {/* TODO: select document row for open doc table  */}
                      <Icon
                        style={{ marginInline: 5 }}
                        className="fas fa-search"
                        onClick={() => setType(row.id)}
                      />
                      <Icon
                        style={{ marginInline: 5 }}
                        className="fas fa-edit"
                        onClick={() => handleModal('update', row.id)}
                      />
                      <Icon
                        style={{ marginInline: 5 }}
                        className="fas fa-trash"
                        color="error"
                        onClick={() => setConfirm({ show: true, id: row.id })}
                      />
                    </IconWrapper>
                  </TableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
        {docId ? <DocumentsTable typeId={docId} /> : null}
      </div>
    </Container>
  );
};

export default DocumentTypes;
// export default injectIntl(connect(null, null)(DashboardListContract));
