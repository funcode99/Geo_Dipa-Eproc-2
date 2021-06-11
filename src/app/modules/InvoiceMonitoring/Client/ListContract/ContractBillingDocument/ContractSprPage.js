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
    Table
} from "react-bootstrap";
import {
    Card,
    CardBody,
    CardFooter
} from "../../../../../../_metronic/_partials/controls";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Slide,
    IconButton
} from "@material-ui/core";
import { getContractSummary, getSpp, rejectSpp, approveSpp, rejectSppStatus, getAllRejectedSpp } from '../../../_redux/InvoiceMonitoringCrud';
import useToast from '../../../../../components/toast';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { rupiah } from '../../../../../libs/currency';
import { Document, Page } from 'react-pdf';
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-perfect-scrollbar/dist/css/styles.css";
import moment from'moment';

const styles = (theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: "absolute",
        right: theme.spacing(3),
        top: theme.spacing(0),
        backgroundColor: "#187de4",
        "&:hover": {
            background: "#f00",
        },
    }
});

const useStyles = makeStyles((theme => ({
    textHover: {
        "&:hover i": {
            color: "#181C32 !important"
        },
    },
    textDisabled: {
        backgroundColor: "#F3F6F9"
    }
})))

const DialogTitleFile = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            {onClose ? (
                <IconButton
                    aria-label="close"
                    className={classes.closeButton}
                    onClick={onClose}
                >
                    <i className="fas fa-times text-light"></i>
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function ContractSprPage(props) {

    const [loading, setLoading] = useState(false);
    const [contractData, setContractData] = useState({})
    const [dialogState, setDialogState] = useState(false)
    const [dialogStateBank, setDialogStateBank] = useState(false)
    const [pageNumber, setPageNumber] = useState(1);
    const [numPages, setNumPages] = useState(null);
    const [pageNumberBank, setPageNumberBank] = useState(1);
    const [numPagesBank, setNumPagesBank] = useState(null);
    const [modalReject, setModalReject] = useState(false);
    const [modalApprove, setModalApprove] = useState(false);
    const [isSubmit, setIsSubmit] = useState(false);
    const classes = useStyles()
    const [sppData, setSppData] = useState(null)
    const [allRejectedSppData, setAllRejectedSppData] = useState([])

    const [Toast, setToast] = useToast();

    const user_id = useSelector((state) => state.auth.user.data.user_id, shallowEqual);
    const contract_id = props.match.params.contract;
    const termin = props.match.params.termin;
    const { intl } = props;

    const initialValues = {
        rejected_remark: ''
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

    const [data] = useState([
        {
            name: "BAPP",
            status: "Approved",
            approvedBy: "Dian",
            date: "30 Jan 2021",
            nameDoc: "BAPP.pdf",
        },
        {
            name: "User Manual",
            status: "Approved",
            approvedBy: "Dian",
            date: "30 Jan 2021",
            nameDoc: "BAPP.pdf",
        },
        {
            name: "Timesheet",
            status: "Waiting",
            approvedBy: null,
            date: null,
            nameDoc: null,
        },
        {
            name: "Invoice",
            status: "Waiting",
            approvedBy: null,
            date: null,
            nameDoc: null,
        },
        {
            name: "Faktur Pajak",
            status: "Waiting",
            approvedBy: null,
            date: null,
            nameDoc: null,
        },
        {
            name: "Surat Permohonan Pajak",
            status: "Waiting",
            approvedBy: null,
            date: null,
            nameDoc: null,
        },
        {
            name: "Kuitansi",
            status: "Waiting",
            approvedBy: null,
            date: null,
            nameDoc: null,
        },
    ]);

    const formik = useFormik({
        initialValues,
        validationSchema: InvoiceSchema,
        onSubmit: async (values, { setStatus, setSubmitting }) => {
            setLoading(true)
            var data = Object.assign({}, sppData)
            delete data.file
            delete data.file_bank
            data.rejected_by_id = user_id
            data.rejected_remark = values.rejected_remark
            rejectSpp(data)
                .then(response => {
                    rejectSppStatus(sppData.id)
                        .then(responses => {
                            rejectSppStatus(sppData.id)
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
                response['data']['data']['direksi'] = response['data']['data']['party_1_contract_signature_name'].concat(' - ', response['data']['data']['party_1_director_position'])
                response['data']['data']['full_name'] = response['data']['data']["data"]["legal_org_type_sub"]["name"].concat(". ", response['data']['data']["data"]["full_name"])
                response['data']['data']['full_address_party_2'] = `${response['data']['data']["data"]["address"]["postal_address"] ? response['data']['data']["data"]["address"]["postal_address"] : null} ${response['data']['data']["data"]["address"]["sub_district"] ? response['data']['data']["data"]["address"]["sub_district"]["name"] : null} ${response['data']['data']["data"]["address"]["district"] ? response['data']['data']["data"]["address"]["district"]["name"] : null} ${response['data']['data']["data"]["address"]["province"] ? response['data']['data']["data"]["address"]["province"]["name"] : null} ${response['data']['data']["data"]["address"]["postal_code"] ? response['data']['data']["data"]["address"]["postal_code"] : null}`
                response['data']['data']['full_data_party_2'] = `${response['data']['data']['full_name']} \n\n${response['data']['data']['full_address_party_2']} \n${response['data']['data']["data"]["phone_number"]["number"]} ${response['data']['data']["data"]["phone_number"]["ext"] ? "\next: ".concat(response['data']['data']["data"]["phone_number"]["ext"]) : ''}`
                response['data']['data']['full_data_party_1'] = `PT. GEO DIPA ENERGI \n\n${response['data']['data']['name']} \n${response['data']['data']['address']}`
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

    const getSppData = useCallback(() => {
        getSpp(contract_id, termin)
            .then(response => {
                setSppData(response['data']['data'])
                getAllRejectedSppData(response['data']['data']['id'])
            })
            .catch((error) => {
                if (
                    error.response?.status !== 400 &&
                    error.response?.data.message !== "TokenExpiredError"
                )
                    setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 10000);
            });
    }, [contract_id, termin, formik, intl, setToast, user_id])

    const getAllRejectedSppData = useCallback((spr_id) => {
        getAllRejectedSpp(spr_id)
            .then(response => {
                setAllRejectedSppData(response['data']['data'])
            })
            .catch((error) => {
                if (
                    error.response?.status !== 400 &&
                    error.response?.data.message !== "TokenExpiredError"
                )
                    setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 10000);
            });
    }, [contract_id, termin, formik, intl, setToast, user_id])

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    const onDocumentLoadSuccessBank = ({ numPages }) => {
        setNumPagesBank(numPages);
    };

    const approveSppData = () => {
        setLoading(true)
        approveSpp(sppData.id, { approved_by_id: user_id })
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

    const downloadFile = (data) => {
        const newWindow = window.open(data, '_blank', 'noopener,noreferrer')
        if (newWindow) newWindow.opener = null
    };

    useEffect(getContractData, []);
    useEffect(getSppData, []);

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
                <DialogTitle id="alert-dialog-slide-title">Setujui Dokumen SPP</DialogTitle>
                <DialogContent>
                    <p>
                        <span>Apa anda yakin menyetujui dokumen SPP?</span>
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
                        onClick={approveSppData}
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
                    <DialogTitle id="alert-dialog-slide-title">Tolak Dokumen SPP</DialogTitle>
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
                    <span>Modal title</span>
                </DialogTitleFile>
                <PerfectScrollbar>
                    <DialogContent>
                        <div className="react-component">
                            <Document file={sppData?.file} onLoadSuccess={onDocumentLoadSuccess}>
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
                open={dialogStateBank}
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
                        setDialogStateBank(false);
                    }}
                >
                </DialogTitleFile>
                <PerfectScrollbar>
                    <DialogContent>
                        <div className="react-component">
                            <Document file={sppData?.file_bank} onLoadSuccess={onDocumentLoadSuccessBank}>
                                <Page pageNumber={pageNumberBank} renderMode="svg" />
                                <div className="page-controls">
                                    <button
                                        type="button"
                                        disabled={pageNumberBank === 1}
                                        onClick={() => {
                                            setPageNumberBank(pageNumberBank - 1);
                                        }}
                                    >
                                        <span><i className={`fas fa-chevron-left ${pageNumberBank === 1 ? '' : 'text-secondary'}`}></i></span>
                                    </button>
                                    <span>{pageNumberBank} of {numPagesBank}</span>
                                    <button
                                        type="button"
                                        disabled={pageNumberBank === numPagesBank}
                                        onClick={() => {
                                            setPageNumberBank(pageNumberBank + 1);
                                        }}
                                    >
                                        <span><i className={`fas fa-chevron-right ${pageNumberBank === numPagesBank ? '' : 'text-secondary'}`}></i></span>
                                    </button>
                                </div>
                            </Document>
                        </div>
                    </DialogContent>
                </PerfectScrollbar>
            </Dialog>
            <Card>
                <CardBody>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group row">
                                <label htmlFor="numberSpp" className="col-sm-4 col-form-label"><FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.SPR_DOCUMENT.SPR_NUMBER" /></label>
                                <div className="col-sm-8">
                                    <input type="text" className="form-control" id="numberSpp" disabled defaultValue={sppData?.spr_no} />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="dateSpp" className="col-sm-4 col-form-label"><FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.SPR_DOCUMENT.SPR_DATE" /></label>
                                <div className="col-sm-8">
                                    <input type="date" className="form-control" id="dateSpp" disabled defaultValue={sppData?.spr_date} />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="note" className="col-sm-4 col-form-label"><FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.INVOICE_DOCUMENT.INVOICE_DESCRIPTION" /></label>
                                <div className="col-sm-8">
                                    <textarea rows="4" cols="" className="form-control" id="note" disabled defaultValue={sppData?.description}></textarea>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-4 col-form-label"><FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.SPR_DOCUMENT.SPR_UPLOAD" /></label>
                                <label className="input-group mb-3 col-sm-8">
                                    <span className={`form-control ${classes.textDisabled}`}>{sppData ? sppData?.file_name : 'Pilih File'}</span>
                                    <div className="input-group-append pointer">
                                        <span className={`input-group-text ${classes.textHover}`}><a download={sppData?.file_name} href={sppData?.file}><i className="fas fa-download"></i></a></span>
                                        <span className={`input-group-text ${classes.textHover}`} onClick={() => setDialogState(true)}><i className="fas fa-eye"></i></span>
                                    </div>
                                </label>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="accountNumberSpp" className="col-sm-4 col-form-label">Referensi Data Bank</label>
                                <div className="col-sm-8 col-form-label">
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="radio" disabled name="RadioOptions" defaultChecked={sppData?.bank_refference} />
                                        <label className="form-check-label">Gunakan Data Referensi</label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="radio" disabled name="RadioOptions" defaultChecked={!sppData?.bank_refference} />
                                        <label className="form-check-label">Masukkan Sendiri</label>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="accountNumberSpp" className="col-sm-4 col-form-label"><FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.SPR_DOCUMENT.ACCOUNT_NUMBER" /></label>
                                <div className="col-sm-8">
                                    <input type="text" className="form-control" id="accountNumberSpp" disabled defaultValue={sppData?.bank_account_no} />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="accountNameSpp" className="col-sm-4 col-form-label">Nama Rekening</label>
                                <div className="col-sm-8">
                                    <input type="text" className="form-control" id="accountNameSpp" disabled defaultValue={sppData?.bank_account_name} />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="bankNameSpp" className="col-sm-4 col-form-label">Nama Bank</label>
                                <div className="col-sm-8">
                                    <input type="text" className="form-control" id="bankNameSpp" disabled defaultValue={sppData?.bank_name} />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="bankAddressSpp" className="col-sm-4 col-form-label">Alamat Bank</label>
                                <div className="col-sm-8">
                                    <textarea rows="4" className="form-control" id="bankAddressSpp" disabled defaultValue={sppData?.bank_address}></textarea>
                                </div>
                            </div>
                            {!sppData?.bank_refference && <div className="form-group row">
                                <label htmlFor="upload_bank" className="col-sm-4 col-form-label">Upload Surat Ganti Bank</label>
                                <label htmlFor="upload_bank" className="input-group mb-3 col-sm-8 pointer">
                                    <span className={`form-control ${classes.textDisabled}`}>{sppData ? sppData?.new_bank_file : 'Pilih File'}</span>
                                    <div className="input-group-append pointer">
                                        <span className={`input-group-text ${classes.textHover}`}><a download={sppData?.new_bank_file} href={sppData?.file_bank}><i className="fas fa-download"></i></a></span>
                                        <span className={`input-group-text ${classes.textHover}`} onClick={() => setDialogStateBank(true)}><i className="fas fa-eye"></i></span>
                                    </div>
                                </label>
                            </div>}
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
                                <label htmlFor="priceStep1" className="col-sm-5 col-form-label"><FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.TERMIN_VALUE" values={{ termin: 1 }} /></label>
                                <div className="col-sm-7">
                                    <input type="text" className="form-control" id="priceStep1" defaultValue="Rp. 1.000.000" disabled />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="priceTaxSpp" className="col-sm-5 col-form-label">Harga Pekerjaan Tahap 1 dengan PPN</label>
                                <div className="col-sm-7">
                                    <input type="text" className="form-control" id="priceTaxSpp" defaultValue="Rp. 1.100.000" disabled />
                                </div>
                            </div>
                        </div>
                    </div>
                </CardBody>
                <CardFooter className="text-right">
                    <button type="button" onClick={() => setModalApprove(true)} disabled={isSubmit || sppData?.state === 'REJECTED' || sppData?.state === 'APPROVED' || sppData === null} className="btn btn-primary mx-1">Terima</button>
                    <button type="button" onClick={() => setModalReject(true)} disabled={isSubmit || sppData?.state === 'REJECTED' || sppData?.state === 'APPROVED' || sppData === null} className="btn btn-danger mx-1">Tolak</button>
                </CardFooter>
            </Card>
            <Card className="mt-5">
                <CardBody>
                    <div className="my-5 text-center">
                        <h6>Riwayat Dokumen SPP</h6>
                    </div>
                    {/* begin: Table */}
                    <div className="table-wrapper-scroll-y my-custom-scrollbar">
                        <div className="segment-table">
                            <div className="hecto-10">
                                <Table className="table-bordered overflow-auto">
                                    <thead>
                                        <tr>
                                            <th className="bg-primary text-white align-middle"><span>No</span></th>
                                            <th className="bg-primary text-white align-middle">
                                                <span>Nomor SPP</span>
                                            </th>
                                            <th className="bg-primary text-white align-middle">
                                                <span>Tanggal SPP</span>
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
                                                <span>Ditolak Oleh</span>
                                            </th>
                                            <th className="bg-primary text-white align-middle">
                                                <span>Tanggal Ditolak</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {allRejectedSppData?.map((item, index) => {
                                            return (
                                                <tr key={index.toString()}>
                                                    <td className="align-middle text-center">
                                                        {index + 1}
                                                    </td>
                                                    <td>{item.spr_no}</td>
                                                    <td>{item.spr_date}</td>
                                                    <td className="align-middle text-center">
                                                        {item.file_name}
                                                    </td>
                                                    <td className="align-middle">{item.created_by_id}</td>
                                                    <td className="align-middle">{moment(new Date(item.created_at)).format("YYYY-MM-DD HH:mm:ss")}</td>
                                                    <td className="align-middle">{item['user']['party']['full_name']}</td>
                                                    <td className="align-middle">{moment(new Date(item.rejected_at)).format("YYYY-MM-DD HH:mm:ss")}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                    </div>
                    {/* end: Table */}
                </CardBody>
            </Card>
        </React.Fragment>
    )
}
export default injectIntl(connect(null, null)(ContractSprPage));