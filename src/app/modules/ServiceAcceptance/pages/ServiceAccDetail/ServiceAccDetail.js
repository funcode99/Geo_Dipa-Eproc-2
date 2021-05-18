import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  Paper,
  makeStyles,
  // Icon,
  InputLabel,
  Button,
  Container,
  CircularProgress,
} from '@material-ui/core';
import SVG from 'react-inlinesvg';
import { useFormik } from 'formik';
import { toAbsoluteUrl } from '../../../../../_metronic/_helpers';
// import { Link } from 'react-router-dom';
import * as Yup from 'yup';
// import * as master from '../service/MasterCrud';
// import http from '../../libs/http';
import {
  Flex,
  StyledHead,
  StyledTableHead,
  Input,
  // Reject,
  StyledTableRow,
  // WaitingSA,
  // PendingTerbit,
  Wrapper,
  InputWrapper,
  InputSeparator,
  FlexCol,
} from './style';

import { StyledModal } from '../../../../components/modals';
import useToast from '../../../../components/toast';
import { SubWrap } from '../../../Master/pages/style';
// import DocumentsTable from './Document';

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

export const ServiceAccDetail = () => {
  const classes = useStyles();
  const [Toast, setToast] = useToast();
  const [data, setData] = React.useState();
  const [modals, setModals] = React.useState(false);
  const [confirm, setConfirm] = React.useState({ show: false, id: '' });
  const [update, setUpdate] = React.useState({ id: '', update: false });
  const [loading, setLoading] = React.useState(false);

  const FormSchema = Yup.object().shape({
    periode_name: Yup.string()
      .min(3, 'Input minimal 3 karakter')
      .required('Field ini wajib diisi'),
    periode_value: Yup.string().required('Field ini wajib diisi'),
  });

  const enableLoading = () => {
    setLoading(true);
  };

  const disableLoading = () => {
    setLoading(false);
  };
  const initialValues = {
    periode_name: '',
    periode_value: 0,
  };

  const getList = async () => {
    try {
      setLoading(true);
      // const {
      //   data: { data },
      // } = await master.getPeriodeList();
      // setData(data);
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

        const requestData = {
          name: values.periode_name,
          value: values.periode_value,
        };

        // const {
        //   data: { status },
        // } = update.update
        //   ? await master.submitPeriode(requestData, update)
        //   : await master.submitPeriode(requestData);

        // if (status) {
        //   getList();
        //   setModals(false);
        // }
      } catch (error) {
        setToast('Error API, Please contact developer!');
        setSubmitting(false);
        setStatus('Failed Submit Data');
      } finally {
        disableLoading();
      }
    },
  });

  const handleClose = () => {
    setModals(false);
  };
  const handleModal = async (type, id) => {
    if (type === 'update') {
      // const {
      //   data: { data },
      // } = await master.getPeriodeID(id);
      // // console.log(data[0]);
      // setUpdate({ id, update: true });
      // // formik.setFieldValue('document_name', data[0].name);
      // formik.setValues({
      //   periode_name: data[0].name,
      //   periode_value: data[0].value,
      // });
    } else {
      formik.setValues(initialValues);
    }
    setModals(true);
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      // await master.deletePeriode(confirm.id);
      // setConfirm({ ...confirm, show: false });
      getList();
    } catch (error) {
      setToast('Error with API, please contact Developer!');
      // console.error(error);
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
        <FlexCol style={{ justifyContent: 'center' }}>
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
                  label="Nama Periode"
                  variant="outlined"
                  name="periode_name"
                  {...formik.getFieldProps('periode_name')}
                />
                <p style={{ textAlign: 'center', color: 'red', margin: 5 }}>
                  {formik.touched.periode_name && formik.errors.periode_name
                    ? formik.errors.periode_name
                    : null}
                </p>
              </div>
              <div style={{ width: '70%', alignSelf: 'center' }}>
                <Input
                  label="Durasi (dalam hari)"
                  type="number"
                  variant="outlined"
                  name="periode_value"
                  {...formik.getFieldProps('periode_value')}
                />
                <p style={{ textAlign: 'center', color: 'red', margin: 5 }}>
                  {formik.touched.periode_value && formik.errors.periode_value
                    ? formik.errors.periode_value
                    : null}
                </p>
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
        </FlexCol>
      </StyledModal>
      <StyledModal
        visible={confirm.show}
        onClose={() => setConfirm({ ...confirm, show: false })}
        hideCloseIcon={false}
        disableBackdrop
        align="center"
      >
        <FlexCol>
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
        </FlexCol>
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
              012.PJ/PST.30-GDE/IX/2020 - 1000014264
            </h2>
          </div>
        </div>

        <Paper className={classes.root}>
          <Flex>
            <Wrapper>
              <InputWrapper>
                <InputSeparator w="25%">
                  <InputLabel>Nomor SA</InputLabel>
                </InputSeparator>
                <InputSeparator w="75%">
                  <Input
                    variant="outlined"
                    name="document_name"
                    // onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required

                    // {...register('document_name')}
                  />

                  {/* <p style={{ textAlign: 'center', color: 'red', margin: 5 }}>
                    {errors.document_name?.message}
                  </p> */}
                </InputSeparator>
              </InputWrapper>
              <InputWrapper>
                <InputSeparator w="25%">
                  <InputLabel>Posting Date</InputLabel>
                </InputSeparator>
                <InputSeparator w="75%">
                  <Input
                    variant="outlined"
                    name="document_name"
                    // onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required

                    // {...register('document_name')}
                  />
                  {/* <p style={{ textAlign: 'center', color: 'red', margin: 5 }}>
                    {errors.document_name?.message}
                  </p> */}
                </InputSeparator>
              </InputWrapper>
              <InputWrapper>
                <InputSeparator w="25%">
                  <InputLabel>Docuument Date</InputLabel>
                </InputSeparator>
                <InputSeparator w="75%">
                  <Input
                    variant="outlined"
                    name="document_name"
                    // onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required

                    // {...register('document_name')}
                  />
                  {/* <p style={{ textAlign: 'center', color: 'red', margin: 5 }}>
                    {errors.document_name?.message}
                  </p> */}
                </InputSeparator>
              </InputWrapper>
              <InputWrapper>
                <InputSeparator w="25%">
                  <InputLabel>PO Number</InputLabel>
                </InputSeparator>
                <InputSeparator w="75%">
                  <Input
                    variant="outlined"
                    name="document_name"
                    // onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required

                    // {...register('document_name')}
                  />
                  {/* <p style={{ textAlign: 'center', color: 'red', margin: 5 }}>
                    {errors.document_name?.message}
                  </p> */}
                </InputSeparator>
              </InputWrapper>
              <InputWrapper>
                <InputSeparator w="25%">
                  <InputLabel>Purchasing Group</InputLabel>
                </InputSeparator>
                <InputSeparator w="75%">
                  <Input
                    variant="outlined"
                    name="document_name"
                    // onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required

                    // {...register('document_name')}
                  />
                  {/* <p style={{ textAlign: 'center', color: 'red', margin: 5 }}>
                    {errors.document_name?.message}
                  </p> */}
                </InputSeparator>
              </InputWrapper>
              <InputWrapper>
                <InputSeparator w="25%">
                  <InputLabel>Telephone</InputLabel>
                </InputSeparator>
                <InputSeparator w="75%">
                  <Input
                    variant="outlined"
                    name="document_name"
                    // onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required

                    // {...register('document_name')}
                  />
                  {/* <p style={{ textAlign: 'center', color: 'red', margin: 5 }}>
                    {errors.document_name?.message}
                  </p> */}
                </InputSeparator>
              </InputWrapper>
              <InputWrapper>
                <InputSeparator w="25%">
                  <InputLabel>Currency</InputLabel>
                </InputSeparator>
                <InputSeparator w="75%">
                  <Input
                    variant="outlined"
                    name="document_name"
                    // onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required

                    // {...register('document_name')}
                  />
                  {/* <p style={{ textAlign: 'center', color: 'red', margin: 5 }}>
                    {errors.document_name?.message}
                  </p> */}
                </InputSeparator>
              </InputWrapper>
              <InputWrapper>
                <InputSeparator w="25%">
                  <InputLabel>Ref. QA</InputLabel>
                </InputSeparator>
                <InputSeparator w="75%">
                  <Input
                    variant="outlined"
                    name="document_name"
                    // onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required

                    // {...register('document_name')}
                  />
                  {/* <p style={{ textAlign: 'center', color: 'red', margin: 5 }}>
                    {errors.document_name?.message}
                  </p> */}
                </InputSeparator>
              </InputWrapper>
            </Wrapper>

            {/* Left  */}
            <Wrapper>
              <InputWrapper>
                <InputSeparator w="25%">
                  <InputLabel>Pihak Pertama</InputLabel>
                </InputSeparator>
                <InputSeparator w="75%">
                  <Input
                    //
                    multiline
                    variant="outlined"
                    name="document_name"
                    // onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required

                    // {...register('document_name')}
                  />
                  {/* <p style={{ textAlign: 'center', color: 'red', margin: 5 }}>
                    {errors.document_name?.message}
                  </p> */}
                </InputSeparator>
              </InputWrapper>
              <InputWrapper>
                <InputSeparator w="25%">
                  <InputLabel>Pihak Kedua</InputLabel>
                </InputSeparator>
                <InputSeparator w="75%">
                  <Input
                    //
                    multiline
                    variant="outlined"
                    name="document_name"
                    // onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required

                    // {...register('document_name')}
                  />
                  {/* <p style={{ textAlign: 'center', color: 'red', margin: 5 }}>
                    {errors.document_name?.message}
                  </p> */}
                </InputSeparator>
              </InputWrapper>

              <InputWrapper>
                <InputSeparator w="25%">
                  <InputLabel>Unggah SA</InputLabel>
                </InputSeparator>
                <InputSeparator w="75%">
                  <Button
                    color="secondary"
                    variant="contained"
                    onClick={() => handleModal('create')}
                  >
                    Upload SA - TTD
                  </Button>
                  <p style={{ margin: 10, color: '#6aa5e3' }}>jpg.pdf</p>
                </InputSeparator>
              </InputWrapper>
            </Wrapper>
          </Flex>
        </Paper>

        <Paper className={classes.root}>
          <Table className={classes.table}>
            <StyledTableHead>
              <StyledHead>
                <TableCell>No</TableCell>
                <TableCell>Service</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>UoM</TableCell>
                <TableCell>Unit Price</TableCell>
                <TableCell>Net Value</TableCell>
              </StyledHead>
            </StyledTableHead>
            <TableBody>
              <StyledTableRow hover>
                <TableCell>0001</TableCell>
                <TableCell>Mobilisasi & Demobilisasi</TableCell>
                <TableCell>1</TableCell>
                <TableCell>AU</TableCell>
                <TableCell>Rp. 20.000.000</TableCell>
                <TableCell>Rp. 20.000.000</TableCell>
              </StyledTableRow>
              <StyledTableRow>
                <TableCell rowSpan={3} colSpan={3} />
                <TableCell colSpan={2}>Sub Total</TableCell>
                <TableCell>Rp. 20.000.00</TableCell>
              </StyledTableRow>
              <StyledTableRow>
                <TableCell colSpan={2}>PPN</TableCell>
                <TableCell>10%</TableCell>
              </StyledTableRow>
              <StyledTableRow>
                <TableCell colSpan={2}>Total</TableCell>
                <TableCell>Rp. 21.000.000</TableCell>
              </StyledTableRow>
            </TableBody>
          </Table>
        </Paper>
      </div>
    </Container>
  );
};

export default ServiceAccDetail;
// export default injectIntl(connect(null, null)(DashboardListContract));
