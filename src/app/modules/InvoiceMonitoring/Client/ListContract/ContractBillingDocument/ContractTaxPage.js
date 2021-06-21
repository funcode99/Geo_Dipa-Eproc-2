import React, {
    useState,
    useEffect,
    useCallback
} from 'react';
import {
    connect, shallowEqual, useSelector
} from "react-redux";
import {
    FormattedMessage,
    injectIntl
} from "react-intl";
import {
    Card,
    CardBody,
    CardFooter
} from "../../../../../../_metronic/_partials/controls";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogActions,
    Slide
} from "@material-ui/core";
import { getContractSummary, getTax, getFileTax, approveTax, getAllRejectedTax, getAllApprovedTax, rejectTax, rejectTaxStatus } from '../../../_redux/InvoiceMonitoringCrud';
import useToast from '../../../../../components/toast';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { rupiah } from '../../../../../libs/currency';
import { Document, Page } from 'react-pdf';
import PerfectScrollbar from "react-perfect-scrollbar";
import { DialogTitleFile } from '../ItemContractInvoice';
import moment from 'moment';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function ContractTaxPage(props) {

    const [loading, setLoading] = useState(false);
    const [contractData, setContractData] = useState({})
    const [taxData, setTaxData] = useState({})
    const [dialogState, setDialogState] = useState(false)
    const [pageNumber, setPageNumber] = useState(1);
    const [numPages, setNumPages] = useState(null);
    const [modalReject, setModalReject] = useState(false);
    const [modalApprove, setModalApprove] = useState(false);
    const [isSubmit, setIsSubmit] = useState(false);
    const [historyTaxData, setHistoryTaxData] = useState([])
    const [modalHistory, setModalHistory] = useState(false)
    const [modalHistoryData, setModalHistoryData] = useState({})

    const [Toast, setToast] = useToast();

    const user_id = useSelector((state) => state.auth.user.data.user_id, shallowEqual);
    const contract_id = props.match.params.contract;
    const termin = props.match.params.termin;
    const { intl, classes } = props;

    const initialValues = {

    }

    const TaxSchema = Yup.object().shape({
        rejected_remark: Yup
            .string()
            .required(
                intl.formatMessage({
                    id: "AUTH.VALIDATION.REQUIRED_FIELD",
                })
            )
    });

    const formik = useFormik({
        initialValues,
        validationSchema: TaxSchema,
        onSubmit: async (values, { setStatus, setSubmitting }) => {
            setLoading(true)
            var data = Object.assign({}, taxData)
            delete data.file
            delete data.file_bank
            data.rejected_by_id = user_id
            data.rejected_remark = values.rejected_remark
            rejectTax(data)
                .then(response => {
                    rejectTaxStatus(taxData.id)
                        .then(responses => {
                            setToast(intl.formatMessage({ id: "REQ.UPDATE_SUCCESS" }), 10000);
                            setLoading(false)
                            setModalReject(false)
                            setIsSubmit(true)
                            getHistoryTaxData(taxData.id)
                        })
                        .catch((error) => {
                            if (error.response?.status === 400 && error.response?.data.message !== "TokenExpiredError")
                                setToast(intl.formatMessage({ id: "REQ.UPDATE_FAILED" }), 10000);
                            setLoading(false);
                        });
                })
                .catch((error) => {
                    if (error.response?.status === 400 && error.response?.data.message !== "TokenExpiredError")
                        setToast(intl.formatMessage({ id: "REQ.UPDATE_FAILED" }), 10000);
                    setLoading(false);
                });
        }
    });

    const getContractData = useCallback(() => {
        getContractSummary(contract_id)
            .then(response => {
                response['data']['data']['contract_value_new'] = rupiah(response['data']['data']['contract_value'])
                setContractData(response.data.data)
            })
            .catch((error) => {
                setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 10000);
            });
    }, [contract_id, formik, intl, setToast, user_id])

    const getTaxData = useCallback(() => {
        getTax(contract_id, termin)
            .then(response => {
                setTaxData(response.data.data)
                getHistoryTaxData(response['data']['data']['id'])
            })
            .catch((error) => {
                setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 10000);
            });
    }, [contract_id, formik, intl, setToast])

    const getHistoryTaxData = useCallback((tax_id) => {
        getAllRejectedTax(tax_id)
            .then(responseReject => {
                getAllApprovedTax(tax_id)
                    .then(responseApprove => {
                        setHistoryTaxData([...responseReject['data']['data'], ...responseApprove['data']['data']])
                    })
                    .catch((error) => {
                        setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 10000);
                    });
                // setHistoryTaxData(response['data']['data'])
            })
            .catch((error) => {
                setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 10000);
            });
    }, [intl, setToast])

    const handleHistory = (index) => {
        setModalHistoryData(historyTaxData[index])
        setModalHistory(true)
    }

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    const approveTaxData = () => {
        setLoading(true)
        approveTax(taxData.id, { approved_by_id: user_id })
            .then((response) => {
                setToast(
                    intl.formatMessage({ id: "REQ.UPDATE_SUCCESS" }),
                    10000
                );
                setLoading(false)
                setModalApprove(false)
                setIsSubmit(true)
                getHistoryTaxData(taxData.id)
            })
            .catch((error) => {
                setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 10000);
                setLoading(false);
            });
    };

    useEffect(getContractData, []);
    useEffect(getTaxData, []);

    return (
        <React.Fragment>
            <Toast />
            <Dialog
                open={modalApprove}
                TransitionComponent={Transition}
                keepMounted
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
                maxWidth="xs"
                fullWidth={true}
            >
                <DialogTitle id="alert-dialog-slide-title"><FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.TAX_DOCUMENT.APPROVED.APPROVE_TITLE" /></DialogTitle>
                <DialogContent>
                    <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.TAX_DOCUMENT.APPROVED.APPROVE_BODY" />
                </DialogContent>
                <DialogActions>
                    <button
                        className="btn btn-secondary"
                        onClick={() => setModalApprove(false)}
                        disabled={loading}
                    >
                        <FormattedMessage id="AUTH.GENERAL.BACK_BUTTON" />
                    </button>
                    <button
                        className="btn btn-primary"
                        disabled={loading}
                        onClick={approveTaxData}
                    >
                        <span><FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.TAX_DOCUMENT.APPROVED.APPROVE_SUBMIT" /></span>
                        {loading && (
                            <span
                                className="spinner-border spinner-border-sm ml-1"
                                aria-hidden="true"
                            ></span>
                        )}
                    </button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={modalReject}
                TransitionComponent={Transition}
                keepMounted
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
                maxWidth="xs"
                fullWidth={true}
            >
                <form
                    noValidate
                    autoComplete="off"
                    onSubmit={formik.handleSubmit}
                >
                    <DialogTitle id="alert-dialog-slide-title"><FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.TAX_DOCUMENT.REJECTED.REJECT_TITLE" /></DialogTitle>
                    <DialogContent>
                        <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.TAX_DOCUMENT.REJECTED.REJECT_BODY" />
                        <textarea rows="2" cols="" className="form-control" placeholder="komentar" disabled={loading} {...formik.getFieldProps('rejected_remark')}></textarea>
                        {(formik.touched.rejected_remark && formik.errors.rejected_remark) ? (
                            <span className="text-center text-danger" >
                                {formik.errors.rejected_remark}
                            </span>
                        ) : null}
                    </DialogContent>
                    <DialogActions>
                        <button
                            className="btn btn-secondary"
                            onClick={() => setModalReject(false)}
                            disabled={loading}
                        >
                            <FormattedMessage id="AUTH.GENERAL.BACK_BUTTON" />
                        </button>
                        <button
                            className="btn btn-danger"
                            disabled={loading || (formik.touched && !formik.isValid) || !formik.dirty}
                        >
                            <span><FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.TAX_DOCUMENT.REJECTED.REJECT_SUBMIT" /></span>
                            {loading && (
                                <span
                                    className="spinner-border spinner-border-sm ml-1"
                                    aria-hidden="true"
                                ></span>
                            )}
                        </button>
                    </DialogActions>
                </form>
            </Dialog>
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
                            <Document file={taxData?.file} onLoadSuccess={onDocumentLoadSuccess}>
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
                    <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.TAX_DOCUMENT.DETAIL_HISTORY" />
                </DialogTitle>
                <PerfectScrollbar>
                    <DialogContent>
                        <div className="form-group row mb-0">
                            <label className="col-sm-3 col-form-label"><FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.TAX_DOCUMENT.TAX_NUMBER" /></label>
                            <div className="col-sm-9">
                                <span className="form-control-plaintext">: {modalHistoryData['tax_no']}</span>
                            </div>
                        </div>
                        <div className="form-group row mb-0">
                            <label className="col-sm-3 col-form-label"><FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.TAX_DOCUMENT.TAX_DATE" /></label>
                            <div className="col-sm-9">
                                <span className="form-control-plaintext">: {moment(new Date(modalHistoryData['tax_date'])).format("YYYY-MM-DD")}</span>
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
                <CardBody>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group row">
                                <label htmlFor="numberTax" className="col-sm-4 col-form-label"><FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.TAX_DOCUMENT.TAX_NUMBER" /></label>
                                <div className="col-sm-8">
                                    <input type="text" className="form-control" id="numberInvoice" disabled defaultValue={taxData?.tax_no} />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="dateTax" className="col-sm-4 col-form-label"><FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.TAX_DOCUMENT.TAX_DATE" /></label>
                                <div className="col-sm-8">
                                    <input type="date" className="form-control" id="dateTax" disabled defaultValue={taxData?.tax_date} />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="npwpTax" className="col-sm-4 col-form-label"><FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.TAX_DOCUMENT.TAX_NPWP" /></label>
                                <div className="col-sm-8">
                                    <input type="text" className="form-control" id="npwpTax" disabled defaultValue={taxData?.npwp} />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="note" className="col-sm-4 col-form-label"><FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.DESCRIPTION" /></label>
                                <div className="col-sm-8">
                                    <textarea rows="4" cols="" className="form-control" id="note" disabled defaultValue={taxData?.description}></textarea>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="upload" className="col-sm-4 col-form-label"><FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.TAX_DOCUMENT.TAX_UPLOAD" /></label>
                                <label htmlFor="upload" className="input-group mb-3 col-sm-8">
                                    <span className={`form-control text-truncate ${classes.textDisabled}`}>{taxData ? taxData?.file_name : 'Pilih File'}</span>
                                    <div className="input-group-append pointer">
                                        <span className={`input-group-text ${classes.textHover}`}><a download={taxData?.file_name} href={taxData?.file}><i className="fas fa-download"></i></a></span>
                                        <span className={`input-group-text ${classes.textHover}`} onClick={() => setDialogState(true)}><i className="fas fa-eye"></i></span>
                                    </div>
                                </label>
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
                                <label htmlFor="priceTax" className="col-sm-5 col-form-label"><FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.TERMIN_VALUE_PPN" values={{ termin: termin }} /></label>
                                <div className="col-sm-7">
                                    <input type="text" className="form-control" id="priceTax" disabled />
                                </div>
                            </div>
                        </div>
                    </div>
                </CardBody>
                <CardFooter className="text-right">
                    <button type="button" onClick={() => setModalApprove(true)} disabled={isSubmit || taxData?.state === 'REJECTED' || taxData?.state === 'APPROVED' || taxData === null} className="btn btn-primary mx-1"><FormattedMessage id="TITLE.ACCEPT_DOCUMENT" /></button>
                    <button type="button" onClick={() => setModalReject(true)} disabled={isSubmit || taxData?.state === 'REJECTED' || taxData?.state === 'APPROVED' || taxData === null} className="btn btn-danger mx-1"><FormattedMessage id="TITLE.REJECT_DOCUMENT" /></button>
                    <div className="my-5 text-center">
                        <h6><FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.TAX_DOCUMENT.HISTORY" /></h6>
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
                                                <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.TAX_DOCUMENT.TAX_NUMBER" />
                                            </th>
                                            <th className="bg-primary text-white align-middle">
                                                <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.TAX_DOCUMENT.TAX_DATE" />
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
                                        {historyTaxData?.map((item, index) => {
                                            return (
                                                <tr key={index.toString()}>
                                                    <td className="align-middle text-center">
                                                        {index + 1}
                                                    </td>
                                                    <td>{item.tax_no}</td>
                                                    <td>{item.tax_date}</td>
                                                    <td className="align-middle text-center">
                                                        <a href={getFileTax + item.file_name}>{item.file_name}</a>
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
            </Card>
        </React.Fragment>
    )
}
export default injectIntl(connect(null, null)(ContractTaxPage));