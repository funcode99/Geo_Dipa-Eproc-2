import React, {
    useState, useEffect
} from 'react';
import {
    connect, shallowEqual, useSelector
} from "react-redux";
import {
    injectIntl,
    FormattedMessage
} from "react-intl";
import {
    Container,
    makeStyles,
    Paper,
    Table,
    Button
} from '@material-ui/core';
import useToast from '../../../components/toast';
import SVG from 'react-inlinesvg';
import { toAbsoluteUrl } from '../../../../_metronic/_helpers';
import {
    SubWrap,
    Flex,
    Input,
} from './style';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { StyledModal } from '../../../components/modals';
import { getInvoicePeriods, updateInvoicePeriods } from '../service/MasterCrud';


const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(2),
    },
}));

const InvoicePeriode = (props) => {

    const { intl } = props;
    const classes = useStyles();
    const [loading, setLoading] = useState(false);
    const [Toast, setToast] = useToast();
    const [modals, setModals] = useState(false);
    const [loadData, setLoadData] = useState(true);
    const [invoicePeriodsData, setInvoicePeriodsData] = useState([]);
    const [errorData, setErrorData] = useState(false);

    const user_id = useSelector((state) => state.auth.user.data.user_id, shallowEqual);

    const getInvoicePeriodsData = () => {
        setLoadData(true)
        getInvoicePeriods()
            .then(response => { setInvoicePeriodsData(response.data.data); setLoadData(false) })
            .catch(() => { setLoadData(false); setErrorData(true) })
    }

    useEffect(() => {
        getInvoicePeriodsData()
    }, []);

    const FormSchema = Yup.object().shape({
        accepted_from_day: Yup.number()
            .required(
                intl.formatMessage({
                    id: "AUTH.VALIDATION.REQUIRED_FIELD",
                })
            )
            .integer(
                intl.formatMessage({
                    id: "AUTH.VALIDATION.NUMBER_ONLY",
                })
            )
            .positive(
                intl.formatMessage({
                    id: "AUTH.VALIDATION.POSITIVE_NUMBER_ONLY",
                })
            )
            .max(31,
                intl.formatMessage({
                    id: "AUTH.VALIDATION.MAX_DATE",
                })
            ),
        accepted_thru_day: Yup.number()
            .required(
                intl.formatMessage({
                    id: "AUTH.VALIDATION.REQUIRED_FIELD",
                })
            )
            .integer(
                intl.formatMessage({
                    id: "AUTH.VALIDATION.NUMBER_ONLY",
                })
            )
            .positive(
                intl.formatMessage({
                    id: "AUTH.VALIDATION.POSITIVE_NUMBER_ONLY",
                })
            )
            .max(31,
                intl.formatMessage({
                    id: "AUTH.VALIDATION.MAX_DATE",
                })
            ),
    });

    const formik = useFormik({
        initialValues,
        validationSchema: FormSchema,
        onSubmit: async (values, { setStatus, setSubmitting }) => {
            setLoading(true);
            console.log(values)
            updateInvoicePeriods(values)
                .then(() => {
                    setToast(intl.formatMessage({ id: "REQ.UPDATE_SUCCESS" }), 10000);
                    setLoading(false);
                    setModals(false);
                    getInvoicePeriodsData();
                })
                .catch(() => {
                    setToast(intl.formatMessage({ id: "REQ.UPDATE_FAILED" }), 10000);
                    setLoading(false);
                    setModals(false);
                });
        },
    });

    const handleModal = async (index) => {
        formik.setValues({
            id: invoicePeriodsData[index].id,
            name: invoicePeriodsData[index].name,
            accepted_from_day: invoicePeriodsData[index].accepted_from_day,
            accepted_thru_day: invoicePeriodsData[index].accepted_thru_day,
            user_id: user_id
        });
        setModals(true);
    };

    const handleClose = () => {
        setModals(false);
    };

    const initialValues = {
        name: "",
        accepted_from_day: "",
        accepted_thru_day: "",
        user_id: user_id
    };

    return (
        <Container className="px-0">
            <div className="d-flex align-items-center flex-wrap mr-1">
                <SubWrap className="mr-2 iconWrap">
                    <span className="svg-icon menu-icon">
                        <SVG src={toAbsoluteUrl('/media/svg/icons/Home/Book-open.svg')} />
                    </span>
                </SubWrap>
                <div className="d-flex align-items-baseline mr-5">
                    <h2 className="text-dark font-weight-bold my-2 mr-5">
                        Master Invoice Periode
                    </h2>
                </div>
            </div>
            <Paper className={classes.paper}>
                <hr className="p-0 m-0" />
                <Container className="pt-10 pb-10">
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
                                        <h3><FormattedMessage id="TITLE.MODAL_UPDATE.TITLE" /></h3>
                                    </div>
                                    <div style={{ justifyContent: 'center', display: 'flex' }}>
                                        <div style={{ width: '70%', alignSelf: 'center' }}>
                                            <Input
                                                label={intl.formatMessage({ id: "TITLE.MASTER_DATA.INVOICE_PERIODS.TABLE_HEADER.NAME" })}
                                                type="text"
                                                variant="outlined"
                                                name="name"
                                                InputProps={{
                                                    readOnly: true,
                                                }}
                                                disabled={loading}
                                                {...formik.getFieldProps('name')}
                                            />
                                            <p style={{ textAlign: 'center', color: 'red', margin: 5 }}>
                                                {formik.touched.name && formik.errors.name ? formik.errors.name : null}
                                            </p>
                                        </div>
                                        <div style={{ width: '70%', alignSelf: 'center' }}>
                                            <Input
                                                label={intl.formatMessage({ id: "TITLE.MASTER_DATA.INVOICE_PERIODS.TABLE_HEADER.ACCEPTED_FROM_TIME" })}
                                                type="number"
                                                variant="outlined"
                                                name="accepted_from_day"
                                                disabled={loading}
                                                {...formik.getFieldProps('accepted_from_day')}
                                            />
                                            <p style={{ textAlign: 'center', color: 'red', margin: 5 }}>
                                                {formik.touched.accepted_from_day && formik.errors.accepted_from_day ? formik.errors.accepted_from_day : null}
                                            </p>
                                        </div>
                                        <div style={{ width: '70%', alignSelf: 'center' }}>
                                            <Input
                                                label={intl.formatMessage({ id: "TITLE.MASTER_DATA.INVOICE_PERIODS.TABLE_HEADER.ACCEPTED_THRU_TIME" })}
                                                type="number"
                                                variant="outlined"
                                                name="accepted_thru_day"
                                                disabled={loading}
                                                {...formik.getFieldProps('accepted_thru_day')}
                                            />
                                            <p style={{ textAlign: 'center', color: 'red', margin: 5 }}>
                                                {formik.touched.accepted_thru_day && formik.errors.accepted_thru_day ? formik.errors.accepted_thru_day : null}
                                            </p>
                                        </div>
                                    </div>
                                    <div style={{ justifyContent: 'center', display: 'flex' }}>
                                        <Button
                                            disabled={(formik.touched && !formik.isValid) || loading}
                                            type="submit"
                                            color="secondary"
                                            variant="contained"
                                            style={{ width: '50%' }}
                                        >
                                            <FormattedMessage id="TITLE.UPDATE" />
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
                                                <th className="bg-primary text-white align-middle"><FormattedMessage id="TITLE.TABLE_HEADER.NO" /></th>
                                                <th className="bg-primary text-white align-middle"><FormattedMessage id="TITLE.MASTER_DATA.INVOICE_PERIODS.TABLE_HEADER.NAME" /></th>
                                                <th className="bg-primary text-white align-middle"><FormattedMessage id="TITLE.MASTER_DATA.INVOICE_PERIODS.TABLE_HEADER.ACCEPTED_FROM_TIME" /></th>
                                                <th className="bg-primary text-white align-middle"><FormattedMessage id="TITLE.MASTER_DATA.INVOICE_PERIODS.TABLE_HEADER.ACCEPTED_THRU_TIME" /></th>
                                                <th className="bg-primary text-white align-middle text-center"><FormattedMessage id="TITLE.TABLE_HEADER.ACTION" /></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                invoicePeriodsData.map((item, index) => {
                                                    return (
                                                        <tr key={index.toString()}>
                                                            <td>{index + 1}</td>
                                                            {/* <td className="align-middle text-center">{index + 1}</td> */}
                                                            <td>
                                                                {item.name}
                                                            </td>
                                                            <td>
                                                                {item.accepted_from_day}
                                                            </td>
                                                            <td>
                                                                {item.accepted_thru_day}
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
                            {/* <div className="table-loading-data">
                                <div className="text-center font-weight-bold">
                                    <div className={`table-loading-data-potition ${errorData ? 'text-danger' : null}`}>
                                        {loadData && <span>
                                            <i className="fas fa-spinner fa-pulse text-dark mr-1"></i>
                                            <FormattedMessage id="TITLE.TABLE.WAITING_DATA" />
                                        </span>}
                                        {errorData && <span>
                                            <FormattedMessage id="TITLE.ERROR_REQUEST" />
                                        </span>}
                                    </div>
                                </div>
                            </div> */}
                        </div>
                    </Paper >
                </Container>
            </Paper>
        </Container>
    );
}

export default injectIntl(connect(null, null)(InvoicePeriode));