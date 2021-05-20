import React from 'react';
import {
  // Table,
  // TableBody,
  // TableCell,
  Paper,
  makeStyles,
  Icon,
  Button,
  Container,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
} from '@material-ui/core';
// import SVG from 'react-inlinesvg';
import { useFormik } from 'formik';
// import { toAbsoluteUrl } from '../../../../_metronic/_helpers';
// import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import * as master from '../service/MasterCrud';
// import http from '../../libs/http';
import {
  Flex,
  // StyledTableHead,
  Input,
  IconWrapper,
  // StyledTableRow,
  // StyledHead,
  // SubWrap,
  InputWrapper,
  SelectStyled,
  FormContent,
} from './style';
import { StyledModal } from '../../../components/modals';
import useToast from '../../../components/toast';
import CustomTable from '../../../components/tables';
import Subheader from '../../../components/subheader';
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

export const Documents = ({ typeId }) => {
  const classes = useStyles();
  const [Toast, setToast] = useToast();
  // const [dataList, setData] = React.useState();
  const [modals, setModals] = React.useState(false);
  const [confirm, setConfirm] = React.useState({ show: false, id: '' });
  const [update, setUpdate] = React.useState({ id: '', update: false });
  const [loading, setLoading] = React.useState(false);
  const [periodic, setPeriodic] = React.useState(false);
  const [options, setOptions] = React.useState();
  const [tableContent, setTableContent] = React.useState([]);

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
    document_type: 709,
    document_periode: 0,
  };

  // const getList = async () => {
  //   try {
  //     setLoading(true);
  //     const {
  //       data: { data },
  //     } = await master.getDocList();
  //     setData(data.data);
  //   } catch (error) {
  //     setToast('Error API, please contact developer!');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const generateTableContent = (data) => {
    data.forEach((item, i) => {
      const rows = [
        { content: i + 1, props: { width: '5%' } },
        { content: item.name },
        {
          content: item.is_periodic ? (
            <Icon className="fas fa-check-circle" color="primary" />
          ) : (
            <Icon className="fas fa-times-circle" color="error" />
          ),
        },
        {
          content: (
            <IconWrapper>
              <Icon
                style={{ marginInline: 5 }}
                className="fas fa-edit"
                onClick={() => handleModal('update', item.id)}
              />
              <Icon
                style={{ marginInline: 5 }}
                className="fas fa-trash"
                color="error"
                onClick={() => setConfirm({ show: true, id: item.id })}
              />
            </IconWrapper>
          ),
        },
      ];
      setTableContent((prev) => [...prev, rows]);
    });
  };

  const getOptions = async () => {
    try {
      setLoading(true);
      const {
        data: { data },
      } = await master.getDocList();
      const { options } = data;
      // console.log(options);
      const value = options.document_types.filter((item) => {
        return item.id === typeId;
      });
      if (value.length > 0) {
        setPeriodic(value[0].periode !== null);
      }
      setOptions(options);
      // setData(data.data);
    } catch (error) {
      setToast('Error API, please contact developer!');
    } finally {
      setLoading(false);
    }
  };

  const getListID = async () => {
    try {
      setLoading(true);
      const {
        data: { data },
      } = await master.getDocumentByType(typeId);
      if (typeId !== ' ') {
        formik.setValues({ document_type: typeId });
      }
      // setData(data.data);
      // setData(data);
      generateTableContent(data);
    } catch (error) {
      setToast('Error API, please contact developer!');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    // console.log(typeId);
    getListID();
    getOptions();

    // eslint-disable-next-line
  }, [typeId]);

  const formik = useFormik({
    initialValues,
    validationSchema: FormSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      try {
        enableLoading();
        // console.log(values);
        const requestData = periodic
          ? {
              name: values.document_name,
              document_type_id: values.document_type,
              periode_id: values.document_type,
            }
          : {
              name: values.document_name,
              document_type_id: values.document_type,
            };

        const {
          data: { status },
        } = update.update
          ? await master.submitDocument(requestData, update)
          : await master.submitDocument(requestData);

        if (status) {
          getListID();
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

  const handleClose = () => {
    setModals(false);
  };

  const handleModal = async (type, id) => {
    if (type === 'update') {
      const {
        data: {
          data: { data },
        },
      } = await master.getDocumentID(id);
      // console.log(data[0].is_periodic);
      setUpdate({ id, update: true });
      // formik.setFieldValue('document_name', data[0].name);
      formik.setValues({
        document_name: data[0].name,
        document_type: data[0].document_type_id,
        document_periode: data[0].periode_id,
      });
    } else {
      // formik.setValues(initialValues);
    }
    setModals(true);
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await master.deleteDocument(confirm.id);
      setConfirm({ ...confirm, show: false });
      getListID();
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
          <form noValidate autoComplete="off" onSubmit={formik.handleSubmit}>
            <div style={{ justifyContent: 'center', display: 'flex' }}>
              <h3>Input Form</h3>
            </div>
            <FormContent>
              <InputWrapper>
                <Input
                  label="Nama Document"
                  variant="outlined"
                  name="document_name"
                  {...formik.getFieldProps('document_name')}
                />
                <p style={{ textAlign: 'center', color: 'red', margin: 5 }}>
                  {formik.touched.document_name && formik.errors.document_name
                    ? formik.errors.document_name
                    : null}
                </p>
              </InputWrapper>
              <InputWrapper>
                <FormControl
                  variant="outlined"
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <InputLabel
                    id="demo-simple-select-label"
                    style={{ marginTop: '1%', marginLeft: '5%' }}
                  >
                    Document Type
                  </InputLabel>
                  <SelectStyled
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    labelWidth={150}
                    name="document_type"
                    {...formik.getFieldProps('document_type')}
                  >
                    <MenuItem value={709}>Select Item</MenuItem>
                    {options &&
                      options.document_types.map((val) => (
                        <MenuItem key={val.id} value={val.id}>
                          {val.name}
                        </MenuItem>
                      ))}
                  </SelectStyled>
                </FormControl>
              </InputWrapper>

              {periodic ? (
                <InputWrapper>
                  <FormControl
                    variant="outlined"
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <InputLabel
                      id="demo-simple-select-label"
                      style={{ marginTop: '1%', marginLeft: '5%' }}
                    >
                      Periode
                    </InputLabel>
                    <SelectStyled
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      labelWidth={150}
                      {...formik.getFieldProps('document_periode')}
                    >
                      {/* <MenuItem value="">Select Item</MenuItem> */}
                      {options &&
                        options.periodes.map((val) => (
                          <MenuItem key={val.id} value={val.id}>
                            {val.name}
                          </MenuItem>
                        ))}
                    </SelectStyled>
                  </FormControl>
                </InputWrapper>
              ) : null}
            </FormContent>
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
        <Subheader
          text="Master Dokumen"
          // IconComponent={<DescriptionOutlined style={{ color: 'white' }} />}
        />
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
          <CustomTable
            tableHeader={['No', 'Dokumen', 'Periode Hari', 'Action']}
            tableContent={tableContent}
            marginY="my-1"
            hecto="hecto-10"
            loading={loading}
          />
          {/* <Table className={classes.table}>
            <StyledTableHead>
              <StyledHead>
                <TableCell>No</TableCell>
                <TableCell>Document Name</TableCell>
                <TableCell align="center">Periode Value</TableCell>

                <TableCell align="center" className="MuiTableCell-sizeSmall">
                  Action
                </TableCell>
              </StyledHead>
            </StyledTableHead>
            <TableBody>
              {loading ? (
                <StyledTableRow hover>
                  <TableCell colSpan={4} align="center">
                    <CircularProgress />
                  </TableCell>
                </StyledTableRow>
              ) : null}

              {dataList?.length < 1 ? (
                <StyledTableRow hover>
                  <TableCell colSpan={4} align="center">
                    Empty Data
                  </TableCell>
                </StyledTableRow>
              ) : null}

              {dataList?.map((row, i) => (
                <StyledTableRow key={row.id} hover>
                  <TableCell scope="row">{i + 1}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell align="center">
                    {row.periode_id !== null ? (
                      `${row.periode.value} Hari`
                    ) : (
                      <Icon className="fas fa-times-circle" color="error" />
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <IconWrapper>
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
          </Table> */}
        </Paper>
        {/* {docId ? <DocumentsTable dataList={docId} /> : null} */}
      </div>
    </Container>
  );
};

export default Documents;
// export default injectIntl(connect(null, null)(DashboardListContract));
