import React, {
    useState,
    useEffect,
    useCallback
} from 'react';
import {
    connect, shallowEqual, useSelector
} from "react-redux";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogActions
} from "@material-ui/core";
import {
    FormattedMessage,
    injectIntl
} from "react-intl";
import {
    Card,
    CardBody,
    CardFooter
} from "../../../../../../_metronic/_partials/controls";
import { getContractSummary, saveReceipt, updateReceipt, getReceipt, getAllApprovedReceipt, getAllRejectedReceipt, getFileReceipt } from '../../../_redux/InvoiceMonitoringCrud';
import useToast from '../../../../../components/toast';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { rupiah } from '../../../../../libs/currency';
import { Document, Page } from 'react-pdf';
import PerfectScrollbar from "react-perfect-scrollbar";
import { DialogTitleFile } from '../ItemContractInvoice';
import moment from 'moment';

function ContractReceiptPage(props) {

    const [loading, setLoading] = useState(false);
    const [contractData, setContractData] = useState({})
    const [uploadFilename, setUploadFilename] = useState('Pilih File')
    const [receiptStatus, setReceiptStatus] = useState(false)
    const [receiptData, setReceiptData] = useState({})
    const [receiptUpdate, setReceiptUpdate] = useState(false)
    const [receiptId, setReceiptId] = useState('')
    const [dialogState, setDialogState] = useState(false)
    const [pageNumber, setPageNumber] = useState(1)
    const [numPages, setNumPages] = useState(null)
    const [historyReceiptData, setHistoryReceiptData] = useState([])
    const [modalHistory, setModalHistory] = useState(false)
    const [modalHistoryData, setModalHistoryData] = useState({})

    const [Toast, setToast] = useToast();

    const user_id = useSelector((state) => state.auth.user.data.user_id, shallowEqual);
    const contract_id = props.match.params.contract;
    const termin = props.match.params.termin;
    const { intl, classes } = props;

    const initialValues = {
        receipt_no: '',
        receipt_date: '',
        contract_id: '',
        vendor_id: '',
        term_id: '',
        payment_value: '',
        file_name: '',
        description: '',
        state: '',
        created_at: '',
        created_by_id: '',
        file: ''
    }

    const ReceiptSchema = Yup.object().shape({
        file: Yup
            .mixed()
            .required(
                intl.formatMessage({
                    id: "AUTH.VALIDATION.REQUIRED_FIELD",
                })
            ),
        description: Yup
            .string()
            .required(
                intl.formatMessage({
                    id: "AUTH.VALIDATION.REQUIRED_FIELD",
                })
            ),
        receipt_date: Yup
            .string()
            .required(
                intl.formatMessage({
                    id: "AUTH.VALIDATION.REQUIRED_FIELD",
                })
            ),
        receipt_no: Yup
            .string()
            .required(
                intl.formatMessage({
                    id: "AUTH.VALIDATION.REQUIRED_FIELD",
                })
            )
    });

    const getHistoryReceiptData = useCallback((invoice_id) => {
        getAllRejectedReceipt(invoice_id)
            .then(responseReject => {
                getAllApprovedReceipt(invoice_id)
                    .then(responseApprove => {
                        setHistoryReceiptData([...responseReject['data']['data'], ...responseApprove['data']['data']])
                    })
                    .catch((error) => {
                        setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 10000);
                    });
                // setHistoryReceiptData(response['data']['data'])
            })
            .catch((error) => {
                setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 10000);
            });
    }, [intl, setToast])

    const getReceiptData = useCallback(() => {
        getReceipt(contract_id, termin)
            .then(response => {
                if (!response['data']['data']) {
                    setReceiptStatus(false)
                } else {
                    getHistoryReceiptData(response['data']['data']['id'])
                    setReceiptId(response['data']['data']['id'])
                    if (response['data']['data']['state'] === 'REJECTED') {
                        setReceiptStatus(false)
                        setReceiptUpdate(true)
                    } else {
                        setReceiptStatus(true)
                        formik.setFieldValue('receipt_no', response['data']['data']['receipt_no'])
                        formik.setFieldValue('receipt_date', response['data']['data']['receipt_date'])
                        formik.setFieldValue('description', response['data']['data']['description'])
                        formik.setFieldValue('file_name', response['data']['data']['file_name'])
                        setUploadFilename(response['data']['data']['file_name'])
                        setReceiptData(response['data']['data'])
                    }
                }
            })
            .catch((error) => {
                setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 10000);
            });
    }, [contract_id, termin, getHistoryReceiptData, formik, intl, setToast])

    const formik = useFormik({
        initialValues,
        validationSchema: ReceiptSchema,
        onSubmit: async (values, { setStatus, setSubmitting }) => {
            setLoading(true)
            setReceiptStatus(true)
            var data = new FormData()
            for (var key in values) {
                data.append(key, values[key])
            }
            if (receiptUpdate) {
                updateReceipt(receiptId, data)
                    .then(response => {
                        setToast(intl.formatMessage({ id: "REQ.UPDATE_SUCCESS" }), 10000);
                        setLoading(false)
                    })
                    .catch((error) => {
                        setToast(intl.formatMessage({ id: "REQ.UPDATE_FAILED" }), 10000);
                        setLoading(false)
                        setReceiptStatus(false)
                    });
            } else {
                saveReceipt(data)
                    .then(response => {
                        setToast(intl.formatMessage({ id: "REQ.UPDATE_SUCCESS" }), 10000);
                        setLoading(false)
                    })
                    .catch((error) => {
                        setToast(intl.formatMessage({ id: "REQ.UPDATE_FAILED" }), 10000);
                        setLoading(false);
                        setReceiptStatus(false)
                    });
            }
        },
    });

    const getContractData = useCallback(() => {
        getContractSummary(contract_id)
            .then(response => {
                response['data']['data']['contract_value_new'] = rupiah(response['data']['data']['contract_value'])
                setContractData(response.data.data)
                formik.setValues({
                    contract_id: response['data']['data']['id'],
                    vendor_id: response['data']['data']['vendor_id'],
                    term_id: termin,
                    payment_value: response['data']['data']['contract_value'],
                    created_by_id: user_id
                })
            })
            .catch((error) => {
                setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 10000);
            });
    }, [contract_id, formik, intl, setToast, user_id])

    const handleUpload = (e) => {
        setUploadFilename(e.currentTarget.files[0].name)
        formik.setFieldValue('file_name', e.currentTarget.files[0].name)
        formik.setFieldValue('file', e.currentTarget.files[0])
    }

    const handleDate = (e) => {
        formik.setFieldValue('receipt_date', e.target.value)
    }

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    const handleHistory = (index) => {
        setModalHistoryData(historyReceiptData[index])
        setModalHistory(true)
    }

    useEffect(getContractData, []);
    useEffect(getReceiptData, []);

    return (
        <React.Fragment>
            <Toast />
            <Dialog
                open={dialogState}
                // keepMounted
                maxWidth={false}
                fullWidth={true}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                PaperProps={{
                    style: {
                        backgroundColor: 'transparent',
                        boxShadow: "none",
                    },
                }}
            >
                <DialogTitleFile
                    id="alert-dialog-description"
                    onClose={() => {
                        setDialogState(false);
                    }}
                >
                </DialogTitleFile>
                <PerfectScrollbar>
                    <DialogContent>
                        <div className="react-component">
                            <Document file={receiptData?.file} onLoadSuccess={onDocumentLoadSuccess}>
                                <Page pageNumber={pageNumber} renderMode="svg" />
                                <div className="page-controls">
                                    <button
                                        type="button"
                                        disabled={pageNumber === 1}
                                        onClick={() => {
                                            setPageNumber(pageNumber - 1);
                                        }}
                                    >
                                        <span><i className={`fas fa-chevron-left ${pageNumber === 1 ? '' : 'text-secondary'}`}></i></span>
                                    </button>
                                    <span>{pageNumber} <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.PDF.OF" /> {numPages}</span>
                                    <button
                                        type="button"
                                        disabled={pageNumber === numPages}
                                        onClick={() => {
                                            setPageNumber(pageNumber + 1);
                                        }}
                                    >
                                        <span><i className={`fas fa-chevron-right ${pageNumber === numPages ? '' : 'text-secondary'}`}></i></span>
                                    </button>
                                </div>
                            </Document>
                        </div>
                    </DialogContent>
                </PerfectScrollbar>
            </Dialog>
            <Dialog
                open={modalHistory}
                // keepMounted
                maxWidth='sm'
                fullWidth={true}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle>
                    <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.RECEIPT_DOCUMENT.DETAIL_HISTORY" />
                </DialogTitle>
                <PerfectScrollbar>
                    <DialogContent>
                        <div className="form-group row mb-0">
                            <label className="col-sm-3 col-form-label"><FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.RECEIPT_DOCUMENT.RECEIPT_NUMBER" /></label>
                            <div className="col-sm-9">
                                <span className="form-control-plaintext">: {modalHistoryData['receipt_no']}</span>
                            </div>
                        </div>
                        <div className="form-group row mb-0">
                            <label className="col-sm-3 col-form-label"><FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.RECEIPT_DOCUMENT.RECEIPT_DATE" /></label>
                            <div className="col-sm-9">
                                <span className="form-control-plaintext">: {moment(new Date(modalHistoryData['receipt_date'])).format("YYYY-MM-DD")}</span>
                            </div>
                        </div>
                        <div className="form-group row mb-0">
                            <label className="col-sm-3 col-form-label"><FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.SEND_BY" /></label>
                            <div className="col-sm-9">
                                <span className="form-control-plaintext">: {modalHistoryData['created_by_name']}</span>
                            </div>
                        </div>
                        <div className="form-group row mb-0">
                            <label className="col-sm-3 col-form-label"><FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.SEND_DATE" /></label>
                            <div className="col-sm-9">
                                <span className="form-control-plaintext">: {moment(new Date(modalHistoryData['created_at'])).format("YYYY-MM-DD HH:mm:ss")}</span>
                            </div>
                        </div>
                        <div className="form-group row mb-0">
                            <label className="col-sm-3 col-form-label">{modalHistoryData['state'] == 'REJECTED' ? <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.REJECTED_BY" /> : <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.APPROVED_BY" />}</label>
                            <div className="col-sm-9">
                                <span className="form-control-plaintext">: {modalHistoryData['state'] == 'REJECTED' ? modalHistoryData['rejected_by_name'] : modalHistoryData['approved_by_name']}</span>
                            </div>
                        </div>
                        <div className="form-group row mb-0">
                            <label className="col-sm-3 col-form-label">{modalHistoryData['state'] == 'REJECTED' ? <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.REJECTED_DATE" /> : <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.APPROVED_DATE" />}</label>
                            <div className="col-sm-9">
                                <span className="form-control-plaintext">: {modalHistoryData['state'] == 'REJECTED' ? moment(new Date(modalHistoryData['rejected_at'])).format("YYYY-MM-DD HH:mm:ss") : moment(new Date(modalHistoryData['approved_at'])).format("YYYY-MM-DD HH:mm:ss")}</span>
                            </div>
                        </div>
                        {modalHistoryData['state'] == 'REJECTED' && <div className="form-group row mb-0">
                            <label className="col-sm-12 col-form-label"><FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.REJECTED_DESC" /></label>
                            <div className="col-sm-12">
                                <textarea disabled className="form-control" defaultValue={modalHistoryData['rejected_remark']}></textarea>
                            </div>
                        </div>}
                    </DialogContent>
                </PerfectScrollbar>
                <DialogActions>
                    <button
                        className="btn btn-secondary"
                        onClick={() => setModalHistory(false)}
                        disabled={loading}
                    >
                        <FormattedMessage id="AUTH.GENERAL.BACK_BUTTON" />
                    </button>
                </DialogActions>
            </Dialog>
            <Card>
                <form
                    noValidate
                    autoComplete="off"
                    onSubmit={formik.handleSubmit}
                >
                    <CardBody>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group row">
                                    <label htmlFor="numberReceipt" className="col-sm-4 col-form-label"><FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.RECEIPT_DOCUMENT.RECEIPT_NUMBER" /></label>
                                    <div className="col-sm-8">
                                        <input type="text" className="form-control" id="numberReceipt" disabled={loading || receiptStatus} {...formik.getFieldProps('receipt_no')} />
                                    </div>
                                    {(formik.touched.receipt_no && formik.errors.receipt_no) ? (
                                        <span className="col-sm-8 offset-sm-4 text-center text-danger" >
                                            {formik.errors.receipt_no}
                                        </span>
                                    ) : null}
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="dateReceipt" className="col-sm-4 col-form-label"><FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.RECEIPT_DOCUMENT.RECEIPT_DATE" /></label>
                                    <div className="col-sm-8">
                                        <input type="date" className="form-control" id="dateReceipt" disabled={loading || receiptStatus} defaultValue={receiptData ? receiptData['receipt_date'] : null} onChange={handleDate} />
                                    </div>
                                    {(formik.touched.receipt_date && formik.errors.receipt_date) ? (
                                        <span className="col-sm-8 offset-sm-4 text-center text-danger" >
                                            {formik.errors.receipt_date}
                                        </span>
                                    ) : null}
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="note" className="col-sm-4 col-form-label"><FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.DESCRIPTION" /></label>
                                    <div className="col-sm-8">
                                        <textarea rows="4" cols="" className="form-control" id="note" disabled={loading || receiptStatus} {...formik.getFieldProps('description')}></textarea>
                                    </div>
                                    {(formik.touched.description && formik.errors.description) ? (
                                        <span className="col-sm-8 offset-sm-4 text-center text-danger" >
                                            {formik.errors.description}
                                        </span>
                                    ) : null}
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="upload" className="col-sm-4 col-form-label"><FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.RECEIPT_DOCUMENT.RECEIPT_UPLOAD" /></label>
                                    <label htmlFor="upload" className={`input-group mb-3 col-sm-8 ${!receiptStatus ? 'pointer' : ''}`}>
                                        {!receiptStatus && <div className="input-group-prepend">
                                            <span className="input-group-text"><i className="fas fa-file-upload"></i></span>
                                        </div>}
                                        <span className={`form-control text-truncate ${receiptStatus ? classes.textDisabled : ''}`}>{uploadFilename}</span>
                                        {receiptStatus && <div className="input-group-append pointer">
                                            <span className={`input-group-text ${classes.textHover}`}><a download={receiptData?.file_name} href={receiptData?.file}><i className="fas fa-download"></i></a></span>
                                            <span className={`input-group-text ${classes.textHover}`} onClick={() => setDialogState(true)}><i className="fas fa-eye"></i></span>
                                        </div>}
                                    </label>
                                    {(formik.touched.file && formik.errors.file) ? (
                                        <span className="col-sm-8 offset-sm-4 text-center text-danger" >
                                            {formik.errors.file}
                                        </span>
                                    ) : null}
                                    <input type="file" className="d-none" id="upload" disabled={loading || receiptStatus} onChange={(e => handleUpload(e))} />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group row">
                                    <label htmlFor="priceContract" className="col-sm-5 col-form-label"><FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.CONTRACT_VALUE" /></label>
                                    <div className="col-sm-7">
                                        <input type="text" className="form-control" id="priceContract" defaultValue={contractData['contract_value_new']} disabled />
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="poNumber" className="col-sm-5 col-form-label"><FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.PO_NUMBER" /></label>
                                    <div className="col-sm-7">
                                        <input type="text" className="form-control" id="poNumber" defaultValue={contractData['purch_order_no']} disabled />
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="priceStep1" className="col-sm-5 col-form-label"><FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.TERMIN_VALUE" values={{ termin: termin }} /></label>
                                    <div className="col-sm-7">
                                        <input type="text" className="form-control" id="priceStep1" disabled />
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="priceTaxInvoice" className="col-sm-5 col-form-label"><FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.TERMIN_VALUE_PPN" values={{ termin: termin }} /></label>
                                    <div className="col-sm-7">
                                        <input type="text" className="form-control" id="priceTaxReceipt" disabled />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardBody>
                    <CardFooter className="text-right">
                        <button type="submit" className="btn btn-primary mx-1" disabled={loading || (formik.touched && !formik.isValid) || receiptStatus}>
                            <FormattedMessage id="TITLE.UPLOAD" />
                            {loading && <span className="spinner-border spinner-border-sm ml-1" aria-hidden="true"></span>}
                        </button>
                        <div className="my-5 text-center">
                            <h6><FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.RECEIPT_DOCUMENT.HISTORY" /></h6>
                        </div>
                        {/* begin: Table */}
                        <div className="table-wrapper-scroll-y my-custom-scrollbar">
                            <div className="segment-table">
                                <div className="hecto-10">
                                    <table className="table-bordered overflow-auto">
                                        <thead>
                                            <tr>
                                                <th className="bg-primary text-white align-middle"><FormattedMessage id="TITLE.NO" /></th>
                                                <th className="bg-primary text-white align-middle">
                                                    <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.RECEIPT_DOCUMENT.RECEIPT_NUMBER" />
                                                </th>
                                                <th className="bg-primary text-white align-middle">
                                                    <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.RECEIPT_DOCUMENT.RECEIPT_DATE" />
                                                </th>
                                                <th className="bg-primary text-white align-middle">
                                                    <FormattedMessage id="TITLE.FILE" />
                                                </th>
                                                <th className="bg-primary text-white align-middle">
                                                    <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.SEND_BY" />
                                                </th>
                                                <th className="bg-primary text-white align-middle">
                                                    <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.SEND_DATE" />
                                                </th>
                                                <th className="bg-primary text-white align-middle">
                                                    <FormattedMessage id="TITLE.STATUS" />
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {historyReceiptData?.map((item, index) => {
                                                return (
                                                    <tr key={index.toString()}>
                                                        <td className="align-middle text-center">
                                                            {index + 1}
                                                        </td>
                                                        <td>{item.receipt_no}</td>
                                                        <td>{item.receipt_date}</td>
                                                        <td className="align-middle text-center">
                                                            <a href={getFileReceipt + item.file_name}>{item.file_name}</a>
                                                        </td>
                                                        <td className="align-middle">{item.created_by_name}</td>
                                                        <td className="align-middle">{moment(new Date(item.created_at)).format("YYYY-MM-DD HH:mm:ss")}</td>
                                                        <td className="align-middle"><span className={`${item.state === 'REJECTED' ? 'text-danger' : 'text-success'} pointer font-weight-bold`} onClick={() => handleHistory(index)}>{item.state === 'REJECTED' ? <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.REJECTED" /> : <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.APPROVED" />} <i className="fas fa-caret-down"></i></span></td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </React.Fragment>
    )
}
export default injectIntl(connect(null, null)(ContractReceiptPage));