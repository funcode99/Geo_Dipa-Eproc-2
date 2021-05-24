import React, {
  useState, useEffect
} from 'react';
import {
  connect
} from "react-redux";
import {
  FormattedMessage,
  injectIntl
} from "react-intl";
import {
  Table,
  Paper,
  Button
} from '@material-ui/core';
import {
  Flex,
  Input
} from '../style';
import { getRolesBKB, getRolesVerification, getRolesPayment, updateRoles } from '../../service/MasterCrud';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { StyledModal } from '../../../../components/modals';
import useToast from '../../../../components/toast';
import { rupiah } from '../../../../libs/currency';

const RolesPage = (props) => {
  const { intl } = props;
  const [loading, setLoading] = useState(false);
  const [rolesData, setRolesData] = useState([]);
  const [Toast, setToast] = useToast();
  const [modals, setModals] = useState(false);
  const [loadData, setLoadData] = useState(true);
  const [errorData, setErrorData] = useState(false);

  const getRolesData = () => {
    setLoadData(true)
    if (props.data.type === "BKB") {
      getRolesBKB()
        .then(response => { setRolesData(response.data.data); setLoadData(false) })
        .catch(() => { setLoadData(false); setErrorData(true) })
    } else if (props.data.type === "Verification") {
      getRolesVerification()
        .then(response => { setRolesData(response.data.data); setLoadData(false) })
        .catch(() => { setLoadData(false); setErrorData(true) })
    } else {
      getRolesPayment()
        .then(response => { setRolesData(response.data.data); setLoadData(false) })
        .catch(() => { setLoadData(false); setErrorData(true) })
    }
  }

  useEffect(() => {
    getRolesData()
    // eslint-disable-next-line
  }, []);

  const handleClose = () => {
    setModals(false);
  };

  const handleModal = async (index) => {
    if (props.data.type === "BKB") {
      formik.setValues({
        min_value: rolesData[index].bkb_min_value,
        max_value: rolesData[index].bkb_max_value,
        role_name: rolesData[index].name,
        id: rolesData[index].id,
        type: props.data.type
      });
    } else if (props.data.type === "Verification") {
      formik.setValues({
        min_value: rolesData[index].verification_min_value,
        max_value: rolesData[index].verification_max_value,
        role_name: rolesData[index].name,
        id: rolesData[index].id,
        type: props.data.type
      });
    } else {
      formik.setValues({
        min_value: rolesData[index].payment_min_value,
        max_value: rolesData[index].payment_max_value,
        role_name: rolesData[index].name,
        id: rolesData[index].id,
        type: props.data.type
      });
    }
    setModals(true);
  };

  const initialValues = {
    min_value: 0,
    max_value: 0,
    role_name: "",
    id: "",
    type: ""
  };

  const FormSchema = Yup.object().shape({
    min_value: Yup.string()
      .matches(/^[0-9]*$/,
        intl.formatMessage({
          id: "AUTH.VALIDATION.NUMBER_ONLY",
        })
      )
      .required(
        intl.formatMessage({
          id: "AUTH.VALIDATION.REQUIRED_FIELD",
        })
      ),
    max_value: Yup.string()
      .matches(/^[0-9]*$/,
        intl.formatMessage({
          id: "AUTH.VALIDATION.NUMBER_ONLY",
        })
      )
      .required(
        intl.formatMessage({
          id: "AUTH.VALIDATION.REQUIRED_FIELD",
        })
      ),
  });

  const formik = useFormik({
    initialValues,
    validationSchema: FormSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      updateRoles(values)
        .then(() => {
          setToast(intl.formatMessage({ id: "REQ.UPDATE_SUCCESS" }), 10000);
          setLoading(false);
          setModals(false);
          getRolesData();
        })
        .catch(() => {
          setToast(intl.formatMessage({ id: "REQ.UPDATE_FAILED" }), 10000);
          setLoading(false);
          setModals(false);
        });
    },
  });

  return (
    <Paper>
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
            onSubmit={formik.handleSubmit}
          >
            <div style={{ justifyContent: 'center', display: 'flex' }}>
              <h3><FormattedMessage id="TITLE.MASTER_DATA.ROLES.MODAL_UPDATE.TITLE" /></h3>
            </div>
            <div style={{ justifyContent: 'center', display: 'flex' }}>
              <div style={{ width: '70%', alignSelf: 'center' }}>
                <Input
                  label={intl.formatMessage({ id: "TITLE.MASTER_DATA.ROLES.MODAL_UPDATE.ROLE_NAME" })}
                  type="text"
                  variant="outlined"
                  name="role_name"
                  InputProps={{
                    readOnly: true,
                  }}
                  disabled={loading}
                  {...formik.getFieldProps('role_name')}
                />
                <p style={{ textAlign: 'center', color: 'red', margin: 5 }}>
                  {formik.touched.role_name && formik.errors.role_name
                    ? formik.errors.role_name
                    : null}
                </p>
              </div>
              <div style={{ width: '70%', alignSelf: 'center' }}>
                <Input
                  label={intl.formatMessage({ id: "TITLE.MASTER_DATA.ROLES.MODAL_UPDATE.MIN_VALUE" })}
                  type="number"
                  variant="outlined"
                  name="min_value"
                  disabled={loading}
                  {...formik.getFieldProps('min_value')}
                />
                <p style={{ textAlign: 'center', color: 'red', margin: 5 }}>
                  {formik.touched.min_value && formik.errors.min_value
                    ? formik.errors.min_value
                    : null}
                </p>
              </div>
              <div style={{ width: '70%', alignSelf: 'center' }}>
                <Input
                  label={intl.formatMessage({ id: "TITLE.MASTER_DATA.ROLES.MODAL_UPDATE.MAX_VALUE" })}
                  type="number"
                  variant="outlined"
                  name="max_value"
                  disabled={loading}
                  {...formik.getFieldProps('max_value')}
                />
                <p style={{ textAlign: 'center', color: 'red', margin: 5 }}>
                  {formik.touched.max_value && formik.errors.max_value
                    ? formik.errors.max_value
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
                <FormattedMessage id="TITLE.UPDATE" />
                {loading && <span className="spinner-border spinner-border-sm ml-1" aria-hidden="true"></span>}
              </Button>
            </div>
          </form>
        </Flex>
      </StyledModal>
      <div className="table-wrapper-scroll-y my-custom-scrollbar">
        <div className="segment-table">
          <div className="hecto-10">
            <Table className="table-bordered overflow-auto">
              <thead>
                <tr>
                  <th className="bg-primary text-white align-middle"><FormattedMessage id="TITLE.MASTER_DATA.ROLES.TABLE_HEADER.NO" /></th>
                  <th className="bg-primary text-white align-middle"><FormattedMessage id="TITLE.MASTER_DATA.ROLES.TABLE_HEADER.NAME" /></th>
                  <th className="bg-primary text-white align-middle"><FormattedMessage id="TITLE.MASTER_DATA.ROLES.TABLE_HEADER.MIN" /></th>
                  <th className="bg-primary text-white align-middle"><FormattedMessage id="TITLE.MASTER_DATA.ROLES.TABLE_HEADER.MAX" /></th>
                  <th className="bg-primary text-white align-middle text-center"><FormattedMessage id="TITLE.MASTER_DATA.ROLES.TABLE_HEADER.ACTION" /></th>
                </tr>
              </thead>
              <tbody>
                {
                  rolesData.map((item, index) => {
                    return (
                      <tr key={index.toString()}>
                        <td className="align-middle text-center">{index + 1}</td>
                        <td>
                          {item.name}
                        </td>
                        <td>
                          {item.bkb_min_value ? rupiah(item.bkb_min_value) : item.verification_min_value ? rupiah(item.verification_min_value) : rupiah(item.payment_min_value)}
                        </td>
                        <td>
                          {item.bkb_max_value ? rupiah(item.bkb_max_value) : item.verification_max_value ? rupiah(item.verification_max_value) : rupiah(item.payment_max_value)}
                        </td>
                        <td className="text-center">
                          <button className="btn" onClick={() => handleModal(index)}><i className="fas fa-edit text-primary pointer"></i></button>
                        </td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </Table>
          </div>
        </div>
        <div className="table-loading-data">
          <div className="text-center font-weight-bold">
            <div className="table-loading-data-potition">
              {loadData && <span>
                <i className="fas fa-spinner fa-pulse text-dark mr-1"></i>
                <FormattedMessage id="TITLE.TABLE.WAITING_DATA" />
              </span>}
              {errorData && <span>
                <FormattedMessage id="TITLE.ERROR_REQUEST" />
              </span>}
            </div>
          </div>
        </div>
      </div>
    </Paper >

  );
}

export default injectIntl(connect(null, null)(RolesPage));