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
    DialogActions,
    DialogContent,
    DialogTitle,
    Slide
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
import { getContractSummary, getInvoice, approveInvoice, rejectInvoice, rejectInvoiceStatus, getAllRejectedInvoice, getFileInvoice, getAllApprovedInvoice } from '../../../_redux/InvoiceMonitoringCrud';
import useToast from '../../../../../components/toast';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { rupiah } from '../../../../../libs/currency';
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-perfect-scrollbar/dist/css/styles.css";
import { Document, Page, pdfjs } from 'react-pdf';
import PerfectScrollbar from "react-perfect-scrollbar";
import { DialogTitleFile } from '../ItemContractInvoice';
import moment from 'moment';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function ContractInvoicePage(props) {

    const [loading, setLoading] = useState(false);
    const [contractData, setContractData] = useState({})
    const [invoiceData, setInvoiceData] = useState({})
    const [dialogState, setDialogState] = useState(false)
    const [pageNumber, setPageNumber] = useState(1);
    const [numPages, setNumPages] = useState(null);
    const [modalReject, setModalReject] = useState(false);
    const [modalApprove, setModalApprove] = useState(false);
    const [isSubmit, setIsSubmit] = useState(false);
    const [historyInvoiceData, setHistoryInvoiceData] = useState([])
    const [modalHistory, setModalHistory] = useState(false)
    const [modalHistoryData, setModalHistoryData] = useState({})

    const [Toast, setToast] = useToast();

    const user_id = useSelector((state) => state.auth.user.data.user_id, shallowEqual);
    const contract_id = props.match.params.contract;
    const termin = props.match.params.termin;
    const { intl, classes } = props;

    const initialValues = {

    }

    const InvoiceSchema = Yup.object().shape({
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
        validationSchema: InvoiceSchema,
        onSubmit: async (values, { setStatus, setSubmitting }) => {
            setLoading(true)
            var data = Object.assign({}, invoiceData)
            delete data.file
            delete data.file_bank
            data.rejected_by_id = user_id
            data.rejected_remark = values.rejected_remark
            rejectInvoice(data)
                .then(response => {
                    rejectInvoiceStatus(invoiceData.id)
                        .then(responses => {
                            setToast(intl.formatMessage({ id: "REQ.UPDATE_SUCCESS" }), 10000);
                            setLoading(false)
                            setModalReject(false)
                            setIsSubmit(true)
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
                if (
                    error.response?.status !== 400 &&
                    error.response?.data.message !== "TokenExpiredError"
                )
                    setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 10000);
            });
    }, [contract_id, formik, intl, setToast, user_id])

    const getInvoiceData = useCallback(() => {
        getInvoice(contract_id, termin)
            .then(response => {
                setInvoiceData(response.data.data)
                getHistoryInvoiceData(response['data']['data']['id'])
            })
            .catch((error) => {
                if (
                    error.response?.status !== 400 &&
                    error.response?.data.message !== "TokenExpiredError"
                )
                    setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 10000);
            });
    }, [contract_id, formik, intl, setToast])

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    const approveInvoiceData = () => {
        setLoading(true)
        approveInvoice(invoiceData.id, { approved_by_id: user_id })
            .then((response) => {
                setToast(
                    intl.formatMessage({ id: "REQ.UPDATE_SUCCESS" }),
                    10000
                );
                setLoading(false)
                setModalApprove(false)
                setIsSubmit(true)
            })
            .catch((error) => {
                if (
                    error.response?.status !== 400 &&
                    error.response?.data.message !== "TokenExpiredError"
                )
                    setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 10000);
                setLoading(false);
            });
    };

    const getHistoryInvoiceData = useCallback((invoice_id) => {
        getAllRejectedInvoice(invoice_id)
            .then(responseReject => {
                getAllApprovedInvoice(invoice_id)
                    .then(responseApprove => {
                        setHistoryInvoiceData([...responseReject['data']['data'], ...responseApprove['data']['data']])
                    })
                    .catch((error) => {
                        if (
                            error.response?.status !== 400 &&
                            error.response?.data.message !== "TokenExpiredError"
                        )
                            setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 10000);
                    });
                // setHistoryInvoiceData(response['data']['data'])
            })
            .catch((error) => {
                if (
                    error.response?.status !== 400 &&
                    error.response?.data.message !== "TokenExpiredError"
                )
                    setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 10000);
            });
    }, [intl, setToast])

    const handleHistory = (index) => {
        setModalHistoryData(historyInvoiceData[index])
        setModalHistory(true)
    }

    useEffect(() => {
        getContractData();
        getInvoiceData();
    }, []);

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
                <DialogTitle id="alert-dialog-slide-title">Setujui Dokumen Invoice</DialogTitle>
                <DialogContent>
                    <p>
                        <span>Apa anda yakin menyetujui dokumen Invoice?</span>
                    </p>
                </DialogContent>
                <DialogActions>
                    <button
                        className="btn btn-secondary"
                        onClick={() => setModalApprove(false)}
                        disabled={loading}
                    >
                        <span>Kembali</span>
                    </button>
                    <button
                        className="btn btn-primary"
                        disabled={loading}
                        onClick={approveInvoiceData}
                    >
                        <span>Setujui</span>
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
                    <DialogTitle id="alert-dialog-slide-title">Tolak Dokumen Invoice</DialogTitle>
                    <DialogContent>
                        <p>
                            <span>Komentar</span>
                        </p>
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
                            <span>Kembali</span>
                        </button>
                        <button
                            className="btn btn-danger"
                            disabled={loading || (formik.touched && !formik.isValid) || !formik.dirty}
                        >
                            <span>Tolak</span>
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
                            <Document file={invoiceData?.file} onLoadSuccess={onDocumentLoadSuccess}>
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
                                    <span>{pageNumber} of {numPages}</span>
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
                    <span>Detail Riwayat</span>
                </DialogTitle>
                <PerfectScrollbar>
                    <DialogContent>
                        <div className="form-group row mb-0">
                            <label className="col-sm-3 col-form-label">Nomor Invoice</label>
                            <div className="col-sm-9">
                                <span className="form-control-plaintext">: {modalHistoryData['invoice_no']}</span>
                            </div>
                        </div>
                        <div className="form-group row mb-0">
                            <label className="col-sm-3 col-form-label">Tanggal Invoice</label>
                            <div className="col-sm-9">
                                <span className="form-control-plaintext">: {moment(new Date(modalHistoryData['from_time'])).format("YYYY-MM-DD")}</span>
                            </div>
                        </div>
                        <div className="form-group row mb-0">
                            <label className="col-sm-3 col-form-label">Dikirim Oleh</label>
                            <div className="col-sm-9">
                                <span className="form-control-plaintext">: {modalHistoryData['created_by_name']}</span>
                            </div>
                        </div>
                        <div className="form-group row mb-0">
                            <label className="col-sm-3 col-form-label">Tanggal Dikirim</label>
                            <div className="col-sm-9">
                                <span className="form-control-plaintext">: {moment(new Date(modalHistoryData['created_at'])).format("YYYY-MM-DD HH:mm:ss")}</span>
                            </div>
                        </div>
                        <div className="form-group row mb-0">
                            <label className="col-sm-3 col-form-label">{modalHistoryData['state'] == 'REJECTED' ? 'Ditolak Oleh' : 'Disetujui Oleh'}</label>
                            <div className="col-sm-9">
                                <span className="form-control-plaintext">: {modalHistoryData['state'] == 'REJECTED' ? modalHistoryData['rejected_by_name'] : modalHistoryData['approved_by_name']}</span>
                            </div>
                        </div>
                        <div className="form-group row mb-0">
                            <label className="col-sm-3 col-form-label">{modalHistoryData['state'] == 'REJECTED' ? 'Tanggal Ditolak' : 'Tanggal Disetujui'}</label>
                            <div className="col-sm-9">
                                <span className="form-control-plaintext">: {modalHistoryData['state'] == 'REJECTED' ? moment(new Date(modalHistoryData['rejected_at'])).format("YYYY-MM-DD HH:mm:ss") : moment(new Date(modalHistoryData['approved_at'])).format("YYYY-MM-DD HH:mm:ss")}</span>
                            </div>
                        </div>
                        {modalHistoryData['state'] == 'REJECTED' && <div className="form-group row mb-0">
                            <label className="col-sm-12 col-form-label">Alasan Penolakan Dokumen</label>
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
                        <span>Kembali</span>
                    </button>
                </DialogActions>
            </Dialog>
            <Card>
                <CardBody>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group row">
                                <label htmlFor="numberInvoice" className="col-sm-4 col-form-label"><FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.INVOICE_DOCUMENT.INVOICE_NUMBER" /></label>
                                <div className="col-sm-8">
                                    <input type="text" className="form-control" id="numberInvoice" disabled defaultValue={invoiceData?.invoice_no} />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="dateInvoice" className="col-sm-4 col-form-label"><FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.INVOICE_DOCUMENT.INVOICE_DATE" /></label>
                                <div className="col-sm-8">
                                    <input type="date" className="form-control" id="dateInvoice" disabled defaultValue={invoiceData?.from_time} />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="note" className="col-sm-4 col-form-label"><FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.INVOICE_DOCUMENT.INVOICE_DESCRIPTION" /></label>
                                <div className="col-sm-8">
                                    <textarea rows="4" cols="" className="form-control" id="note" disabled defaultValue={invoiceData?.description}></textarea>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="upload" className="col-sm-4 col-form-label"><FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.INVOICE_DOCUMENT.INVOICE_UPLOAD" /></label>
                                <label htmlFor="upload" className="input-group mb-3 col-sm-8">
                                    <span className={`form-control text-truncate ${classes.textDisabled}`}>{invoiceData ? invoiceData?.file_name : 'Pilih File'}</span>
                                    <div className="input-group-append pointer">
                                        <span className={`input-group-text ${classes.textHover}`}><a download={invoiceData?.file_name} href={invoiceData?.file}><i className="fas fa-download"></i></a></span>
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
                                    <input type="text" className="form-control" id="priceStep1" defaultValue="Rp. 1.000.000" disabled />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="priceTaxInvoice" className="col-sm-5 col-form-label">Harga Pekerjaan Tahap 1 dengan PPN</label>
                                <div className="col-sm-7">
                                    <input type="text" className="form-control" id="priceTaxInvoice" defaultValue="Rp. 1.100.000" disabled />
                                </div>
                            </div>
                        </div>
                    </div>
                </CardBody>
                <CardFooter className="text-right">
                    <button type="button" onClick={() => setModalApprove(true)} disabled={isSubmit || invoiceData?.state === 'REJECTED' || invoiceData?.state === 'APPROVED' || invoiceData === null} className="btn btn-primary mx-1">Terima</button>
                    <button type="button" onClick={() => setModalReject(true)} disabled={isSubmit || invoiceData?.state === 'REJECTED' || invoiceData?.state === 'APPROVED' || invoiceData === null} className="btn btn-danger mx-1">Tolak</button>
                </CardFooter>
            </Card>
            <Card className="mt-5">
                <CardBody>
                    <div className="my-5 text-center">
                        <h6>Riwayat Dokumen Invoice</h6>
                    </div>
                    {/* begin: Table */}
                    <div className="table-wrapper-scroll-y my-custom-scrollbar">
                        <div className="segment-table">
                            <div className="hecto-10">
                                <table className="table-bordered overflow-auto">
                                    <thead>
                                        <tr>
                                            <th className="bg-primary text-white align-middle"><span>No</span></th>
                                            <th className="bg-primary text-white align-middle">
                                                <span>Nomor Invoice</span>
                                            </th>
                                            <th className="bg-primary text-white align-middle">
                                                <span>Tanggal Invoice</span>
                                            </th>
                                            <th className="bg-primary text-white align-middle">
                                                <span>File</span>
                                            </th>
                                            <th className="bg-primary text-white align-middle">
                                                <span>Dikirim Oleh</span>
                                            </th>
                                            <th className="bg-primary text-white align-middle">
                                                <span>Tanggal Dikirim</span>
                                            </th>
                                            <th className="bg-primary text-white align-middle">
                                                <span>Status</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {historyInvoiceData?.map((item, index) => {
                                            return (
                                                <tr key={index.toString()}>
                                                    <td className="align-middle text-center">
                                                        {index + 1}
                                                    </td>
                                                    <td>{item.invoice_no}</td>
                                                    <td>{item.from_time}</td>
                                                    <td className="align-middle text-center">
                                                        <a href={getFileInvoice + item.file_name}>{item.file_name}</a>
                                                    </td>
                                                    <td className="align-middle">{item.created_by_name}</td>
                                                    <td className="align-middle">{moment(new Date(item.created_at)).format("YYYY-MM-DD HH:mm:ss")}</td>
                                                    <td className="align-middle"><span className={`${item.state === 'REJECTED' ? 'text-danger' : 'text-success'} pointer font-weight-bold`} onClick={() => handleHistory(index)}>{item.state === 'REJECTED' ? 'DITOLAK' : 'DISETUJUI'} <i className="fas fa-caret-down"></i></span></td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    {/* end: Table */}
                </CardBody>
            </Card>
        </React.Fragment>
    )
}
export default injectIntl(connect(null, null)(ContractInvoicePage));