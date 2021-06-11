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
import { getContractSummary, getInvoice } from '../../../_redux/InvoiceMonitoringCrud';
import useToast from '../../../../../components/toast';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { rupiah } from '../../../../../libs/currency';
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-perfect-scrollbar/dist/css/styles.css";
import { Document, Page, pdfjs } from 'react-pdf';
import PerfectScrollbar from "react-perfect-scrollbar";
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';
import { DialogTitleFile } from '../ItemContractInvoice'

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker

function ContractInvoicePage(props) {

    const [loading, setLoading] = useState(false);
    const [contractData, setContractData] = useState({})
    const [invoiceData, setInvoiceData] = useState({})
    const [dialogState, setDialogState] = useState(false)
    const [pageNumber, setPageNumber] = useState(1);
    const [numPages, setNumPages] = useState(null);

    const [Toast, setToast] = useToast();

    const user_id = useSelector((state) => state.auth.user.data.user_id, shallowEqual);
    const contract_id = props.match.params.contract;
    const termin = props.match.params.termin;
    const { intl, classes } = props;

    const initialValues = {

    }

    const InvoiceSchema = Yup.object().shape({

    });

    const formik = useFormik({
        initialValues,
        validationSchema: InvoiceSchema,
        onSubmit: async (values, { setStatus, setSubmitting }) => {
            setLoading(true)

        },
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

    useEffect(() => {
        getContractData();
        getInvoiceData();
    }, []);

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
                    <span>Modal title</span>
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
                                    <label htmlFor="upload" className="input-group mb-3 col-sm-8 pointer">
                                        <span className={`form-control ${classes.textDisabled}`}>{invoiceData ? invoiceData?.file_name : 'Pilih File'}</span>
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
                        <button type="button" className="btn btn-primary mx-1">Terima</button>
                        <button type="button" className="btn btn-danger mx-1">Tolak</button>
                    </CardFooter>
                </form>
            </Card>
        </React.Fragment>
    )
}
export default injectIntl(connect(null, null)(ContractInvoicePage));