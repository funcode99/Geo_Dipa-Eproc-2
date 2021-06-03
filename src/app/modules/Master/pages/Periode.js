import React from 'react';
import {
  Paper,
  makeStyles,
  Icon,
  Button,
  Container,
  CircularProgress,
} from '@material-ui/core';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import * as master from '../service/MasterCrud';
import useTranslate from '../../../libs/translation';
import { Flex, Input, IconWrapper } from './style';
import { StyledModal } from '../../../components/modals';
import useToast from '../../../components/toast';
import CustomTable from '../../../components/tables';
import Subheader from '../../../components/subheader';

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

export const Periode = () => {
  const classes = useStyles();
  const { t } = useTranslate('MASTER');
  const [Toast, setToast] = useToast();
  // const [data, setData] = React.useState();
  const [modals, setModals] = React.useState(false);
  const [confirm, setConfirm] = React.useState({ show: false, id: '' });
  const [update, setUpdate] = React.useState({ id: '', update: false });
  const [loading, setLoading] = React.useState(false);
  const [tableContent, setTableContent] = React.useState([]);

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

  const generateTableContent = (data) => {
    setTableContent([]);
    data.forEach((item, i) => {
      const rows = [
        { content: i + 1, props: { width: '5%' } },
        { content: item.name },
        { content: item.value },
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

  const getList = async () => {
    try {
      setLoading(true);
      const {
        data: { data },
      } = await master.getPeriodeList();
      generateTableContent(data);
      // setData(data);
    } catch (error) {
      setToast('Error API, please contact developer!');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    getList();
    console.log(t('update'));
    // console.log(messages);
    // console.log(lang);
    // console.log(messages['TITLE.MASTER_DATA.PERIODE.HEADER.NAME']);
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

        const {
          data: { status },
        } = update.update
          ? await master.submitPeriode(requestData, update)
          : await master.submitPeriode(requestData);

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

  const handleClose = () => {
    setModals(false);
  };
  const handleModal = async (type, id) => {
    if (type === 'update') {
      const {
        data: { data },
      } = await master.getPeriodeID(id);
      // console.log(data[0]);
      setUpdate({ id, update: true });
      // formik.setFieldValue('document_name', data[0].name);
      formik.setValues({
        periode_name: data[0].name,
        periode_value: data[0].value,
      });
    } else {
      setUpdate({ id: '', update: false });
      formik.setValues(initialValues);
    }
    setModals(true);
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await master.deletePeriode(confirm.id);
      setConfirm({ ...confirm, show: false });
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
                {update.update ? t('update') : t('create')}
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
            <p>{t('confirmation')}</p>
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
              {loading ? <CircularProgress /> : null}&nbsp; {t('delete')}
            </Button>
            <Button
              variant="contained"
              disabled={loading}
              style={{ width: '40%', marginInline: 10 }}
              onClick={() => setConfirm({ ...confirm, show: false })}
            >
              {t('cancel')}
            </Button>
          </div>
        </Flex>
      </StyledModal>
      <div>
        <Subheader text="Master Periode" />
        <Flex>
          <div></div>
          <Button
            color="secondary"
            variant="contained"
            style={{ marginLeft: 'auto' }}
            onClick={() => handleModal('create')}
          >
            {t('create')}
          </Button>
        </Flex>

        <Paper className={classes.root} style={{ marginBottom: 30 }}>
          <CustomTable
            tableHeader={[
              'No',
              t('periode.name'),
              t('periode.val'),
              t('periode.action'),
            ]}
            tableContent={tableContent}
            marginY="my-1"
            hecto="hecto-10"
            loading={loading}
          />
        </Paper>
      </div>
    </Container>
  );
};

export default Periode;
// export default injectIntl(connect(null, null)(DashboardListContract));
