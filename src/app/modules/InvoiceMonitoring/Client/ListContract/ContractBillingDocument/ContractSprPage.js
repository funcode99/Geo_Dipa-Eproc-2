import React, { useState, useEffect, useCallback } from "react";
import { connect, shallowEqual, useSelector } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import { Table } from "react-bootstrap";
import {
  Card,
  CardBody,
  CardFooter,
} from "../../../../../../_metronic/_partials/controls";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  IconButton,
  TableRow,
  TableCell,
} from "@material-ui/core";
import {
  getContractSummary,
  getSpp,
  rejectSpp,
  approveSpp,
  rejectSppStatus,
  getAllRejectedSpp,
  getAllApprovedSpp,
  getFileSpp,
  getFileBank,
  getBillingDocumentId,
  softcopy_save,
  getTerminProgress
} from "../../../_redux/InvoiceMonitoringCrud";
import useToast from "../../../../../components/toast";
import { useFormik } from "formik";
import * as Yup from "yup";
import { rupiah } from "../../../../../libs/currency";
import { Document, Page } from "react-pdf";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-perfect-scrollbar/dist/css/styles.css";
import moment from "moment";
import TableOnly from "../../../../../components/tableCustomV1/tableOnly";
import { SOCKET } from "../../../../../../redux/BaseHost";

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
  },
});

const useStyles = makeStyles((theme) => ({
  textHover: {
    "&:hover i": {
      color: "#181C32 !important",
    },
  },
  textDisabled: {
    backgroundColor: "#F3F6F9",
  },
}));

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
  const { intl, classes, progressTermin, setProgressTermin, dataProgress, setDataProgress } = props;
  const [loading, setLoading] = useState(false);
  const [contractData, setContractData] = useState({});
  const [dialogState, setDialogState] = useState(false);
  const [dialogStateBank, setDialogStateBank] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(null);
  const [pageNumberBank, setPageNumberBank] = useState(1);
  const [numPagesBank, setNumPagesBank] = useState(null);
  const [modalReject, setModalReject] = useState(false);
  const [modalApprove, setModalApprove] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [sppData, setSppData] = useState(null);
  const [historySppData, setHistorySppData] = useState([]);
  const [modalHistory, setModalHistory] = useState(false);
  const [modalHistoryData, setModalHistoryData] = useState({});
  const [invoiceBillingId, setInvoiceBillingId] = useState("");

  const headerTable = [
    {
      title: intl.formatMessage({
        id: "TITLE.TABLE_HEADER.NO",
      }),
    },
    {
      title: intl.formatMessage({
        id: "TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.SPP_DOCUMENT.SPP_NUMBER",
      }),
    },
    {
      title: intl.formatMessage({
        id: "TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.SPP_DOCUMENT.SPP_DATE",
      }),
    },
    {
      title: intl.formatMessage({ id: "TITLE.FILE" }),
    },
    {
      title: intl.formatMessage({
        id: "TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.SEND_BY",
      }),
    },
    {
      title: intl.formatMessage({
        id: "TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.SEND_DATE",
      }),
    },
    {
      title: intl.formatMessage({
        id: "TITLE.STATUS",
      }),
    },
  ];

  const [Toast, setToast] = useToast();

  const user_id = useSelector(
    (state) => state.auth.user.data.user_id,
    shallowEqual
  );
  const contract_id = props.match.params.contract;
  const termin = props.match.params.termin;
  const invoiceName = "SPP";

  const initialValues = {
    rejected_remark: "",
  };

  const SppSchema = Yup.object().shape({
    rejected_remark: Yup.string().required(
      intl.formatMessage({
        id: "AUTH.VALIDATION.REQUIRED_FIELD",
      })
    ),
  });

  const formik = useFormik({
    initialValues,
    validationSchema: SppSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      var data = Object.assign({}, sppData);
      delete data.file;
      delete data.file_bank;
      data.rejected_by_id = user_id;
      data.rejected_remark = values.rejected_remark;
      rejectSpp(data)
        .then((response) => {
          rejectSppStatus(sppData.id)
            .then((responses) => {
              setToast(intl.formatMessage({ id: "REQ.UPDATE_SUCCESS" }), 10000);
              setLoading(false);
              setModalReject(false);
              setIsSubmit(true);
              getHistorySppData(sppData.id);
              SOCKET.emit('get_all_notification', user_id);
            })
            .catch((error) => {
              setToast(intl.formatMessage({ id: "REQ.UPDATE_FAILED" }), 10000);
              setLoading(false);
            });
        })
        .catch((error) => {
          setToast(intl.formatMessage({ id: "REQ.UPDATE_FAILED" }), 10000);
          setLoading(false);
        });
    },
  });

  const getContractData = useCallback(() => {
    getContractSummary(contract_id, termin)
      .then((response) => {
        response["data"]["data"]["contract_value_new"] = rupiah(
          response["data"]["data"]["contract_value"]
        );
        response["data"]["data"]["termin_value_new"] = rupiah(
          response["data"]["data"]["termin_value"]
        );
        response["data"]["data"]["termin_value_ppn_new"] = rupiah(
          response["data"]["data"]["termin_value"] * 1.1
        );
        setContractData(response.data.data);
      })
      .catch((error) => {
        setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 10000);
      });
  }, [contract_id, formik, intl, setToast, user_id]);

  const getSppData = useCallback(() => {
    getSpp(contract_id, termin)
      .then((response) => {
        setSppData(response["data"]["data"]);
        if (response["data"]["data"]) {
          getHistorySppData(response["data"]["data"]["id"]);
        }
      })
      .catch((error) => {
        setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 10000);
      });
  }, [contract_id, termin, formik, intl, setToast, user_id]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const onDocumentLoadSuccessBank = ({ numPages }) => {
    setNumPagesBank(numPages);
  };

  const approveSppData = () => {
    setLoading(true);
    var data_1 = {
      contract_id: contract_id,
      term_id: termin,
      softcopy_state: "APPROVED",
      document_id: invoiceBillingId,
      document_no: sppData?.spr_no,
      created_by_id: user_id,
      filename: sppData?.file_name
    };
    approveSpp(sppData.id, {
      approved_by_id: user_id,
      contract_id: contract_id,
      term_id: termin
    })
      .then((response) => {
        setToast(intl.formatMessage({ id: "REQ.UPDATE_SUCCESS" }), 10000);
        setLoading(false);
        setModalApprove(false);
        setIsSubmit(true);
        getHistorySppData(sppData.id);
        softcopy_save(data_1);
        getTerminProgress(termin)
          .then((result) => {
            setProgressTermin(result.data.data?.progress_type);
            setDataProgress(result.data.data?.data);
          })
        SOCKET.emit('get_all_notification', user_id);
      })
      .catch((error) => {
        setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 10000);
        setLoading(false);
      });
  };

  const getHistorySppData = useCallback(
    (spp_id) => {
      getAllRejectedSpp(spp_id)
        .then((responseReject) => {
          getAllApprovedSpp(spp_id)
            .then((responseApprove) => {
              setHistorySppData([
                ...responseReject["data"]["data"],
                ...responseApprove["data"]["data"],
              ]);
            })
            .catch((error) => {
              setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 10000);
            });
          // setHistorySppData(response['data']['data'])
        })
        .catch((error) => {
          setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 10000);
        });
    },
    [intl, setToast]
  );

  const handleHistory = (index) => {
    setModalHistoryData(historySppData[index]);
    setModalHistory(true);
  };

  const getBillingDocumentIdData = useCallback(() => {
    getBillingDocumentId(invoiceName)
      .then((response) => {
        setInvoiceBillingId(response.data.data.id);
      })
      .catch((error) => {
        setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 10000);
      });
  }, [invoiceName, setInvoiceBillingId, formik, intl, setToast]);

  useEffect(getContractData, []);
  useEffect(getSppData, []);
  useEffect(getBillingDocumentIdData, []);

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
        <DialogTitle id="alert-dialog-slide-title">
          <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.SPP_DOCUMENT.APPROVED.APPROVE_TITLE" />
        </DialogTitle>
        <DialogContent>
          <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.SPP_DOCUMENT.APPROVED.APPROVE_BODY" />
        </DialogContent>
        <DialogActions>
          <button
            className="btn btn-secondary"
            onClick={() => setModalApprove(false)}
            disabled={loading}
          >
            <span>
              <FormattedMessage id="AUTH.GENERAL.BACK_BUTTON" />
            </span>
          </button>
          <button
            className="btn btn-primary"
            disabled={loading}
            onClick={approveSppData}
          >
            <span>
              <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.SPP_DOCUMENT.APPROVED.APPROVE_SUBMIT" />
            </span>
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
        <form noValidate autoComplete="off" onSubmit={formik.handleSubmit}>
          <DialogTitle id="alert-dialog-slide-title">
            <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.SPP_DOCUMENT.REJECTED.REJECT_TITLE" />
          </DialogTitle>
          <DialogContent>
            <p>
              <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.SPP_DOCUMENT.REJECTED.REJECT_BODY" />
            </p>
            <textarea
              rows="2"
              cols=""
              className="form-control"
              placeholder="komentar"
              disabled={loading}
              {...formik.getFieldProps("rejected_remark")}
            ></textarea>
            {formik.touched.rejected_remark && formik.errors.rejected_remark ? (
              <span className="text-center text-danger">
                {formik.errors.rejected_remark}
              </span>
            ) : null}
          </DialogContent>
          <DialogActions>
            <button
              className="btn btn-secondary"
              type="button"
              onClick={() => setModalReject(false)}
              disabled={loading}
            >
              <span>
                <FormattedMessage id="AUTH.GENERAL.BACK_BUTTON" />
              </span>
            </button>
            <button
              className="btn btn-danger"
              type="submit"
              disabled={
                loading || (formik.touched && !formik.isValid) || !formik.dirty
              }
            >
              <span>
                <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.SPP_DOCUMENT.REJECTED.REJECT_SUBMIT" />
              </span>
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
            backgroundColor: "transparent",
            boxShadow: "none",
          },
        }}
      >
        <DialogTitleFile
          id="alert-dialog-description"
          onClose={() => {
            setDialogState(false);
          }}
        ></DialogTitleFile>
        <PerfectScrollbar>
          <DialogContent>
            <div className="react-component">
              <Document
                file={sppData?.file}
                onLoadSuccess={onDocumentLoadSuccess}
              >
                <Page pageNumber={pageNumber} renderMode="svg" />
                <div className="page-controls">
                  <button
                    type="button"
                    disabled={pageNumber === 1}
                    onClick={() => {
                      setPageNumber(pageNumber - 1);
                    }}
                  >
                    <span>
                      <i
                        className={`fas fa-chevron-left ${pageNumber === 1 ? "" : "text-secondary"
                          }`}
                      ></i>
                    </span>
                  </button>
                  <span>
                    {pageNumber}{" "}
                    <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.PDF.OF" />{" "}
                    {numPages}
                  </span>
                  <button
                    type="button"
                    disabled={pageNumber === numPages}
                    onClick={() => {
                      setPageNumber(pageNumber + 1);
                    }}
                  >
                    <span>
                      <i
                        className={`fas fa-chevron-right ${pageNumber === numPages ? "" : "text-secondary"
                          }`}
                      ></i>
                    </span>
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
            backgroundColor: "transparent",
            boxShadow: "none",
          },
        }}
      >
        <DialogTitleFile
          id="alert-dialog-description"
          onClose={() => {
            setDialogStateBank(false);
          }}
        ></DialogTitleFile>
        <PerfectScrollbar>
          <DialogContent>
            <div className="react-component">
              <Document
                file={sppData?.file_bank}
                onLoadSuccess={onDocumentLoadSuccessBank}
              >
                <Page pageNumber={pageNumberBank} renderMode="svg" />
                <div className="page-controls">
                  <button
                    type="button"
                    disabled={pageNumberBank === 1}
                    onClick={() => {
                      setPageNumberBank(pageNumberBank - 1);
                    }}
                  >
                    <span>
                      <i
                        className={`fas fa-chevron-left ${pageNumberBank === 1 ? "" : "text-secondary"
                          }`}
                      ></i>
                    </span>
                  </button>
                  <span>
                    {pageNumberBank}{" "}
                    <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.PDF.OF" />{" "}
                    {numPagesBank}
                  </span>
                  <button
                    type="button"
                    disabled={pageNumberBank === numPagesBank}
                    onClick={() => {
                      setPageNumberBank(pageNumberBank + 1);
                    }}
                  >
                    <span>
                      <i
                        className={`fas fa-chevron-right ${pageNumberBank === numPagesBank
                          ? ""
                          : "text-secondary"
                          }`}
                      ></i>
                    </span>
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
        maxWidth="md"
        fullWidth={true}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle>
          <span>
            <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.SPP_DOCUMENT.DETAIL_HISTORY" />
          </span>
        </DialogTitle>
        <PerfectScrollbar>
          <DialogContent>
            <div className="form-group row mb-0">
              <div className="col-md-6">
                <div className="form-group row mb-0">
                  <label className="col-sm-4 col-form-label">
                    <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.SPP_DOCUMENT.SPP_NUMBER" />
                  </label>
                  <div className="col-sm-8">
                    <span className="form-control-plaintext">
                      : {modalHistoryData["spr_no"]}
                    </span>
                  </div>
                </div>
                <div className="form-group row mb-0">
                  <label className="col-sm-4 col-form-label">
                    <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.SPP_DOCUMENT.SPP_DATE" />
                  </label>
                  <div className="col-sm-8">
                    <span className="form-control-plaintext">
                      :{" "}
                      {moment(new Date(modalHistoryData["spr_date"])).format(
                        "YYYY-MM-DD"
                      )}
                    </span>
                  </div>
                </div>
                <div className="form-group row mb-0">
                  <label className="col-sm-4 col-form-label">
                    <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.SEND_BY" />
                  </label>
                  <div className="col-sm-8">
                    <span className="form-control-plaintext">
                      : {modalHistoryData["created_by_name"]}
                    </span>
                  </div>
                </div>
                <div className="form-group row mb-0">
                  <label className="col-sm-4 col-form-label">
                    <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.SEND_DATE" />
                  </label>
                  <div className="col-sm-8">
                    <span className="form-control-plaintext">
                      :{" "}
                      {moment(new Date(modalHistoryData["created_at"])).format(
                        "YYYY-MM-DD HH:mm:ss"
                      )}
                    </span>
                  </div>
                </div>
                <div className="form-group row mb-0">
                  <label className="col-sm-4 col-form-label">
                    {modalHistoryData["state"] === "REJECTED" ? (
                      <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.REJECTED_BY" />
                    ) : (
                      <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.APPROVED_BY" />
                    )}
                  </label>
                  <div className="col-sm-8">
                    <span className="form-control-plaintext">
                      :{" "}
                      {modalHistoryData["state"] === "REJECTED"
                        ? modalHistoryData["rejected_by_name"]
                        : modalHistoryData["approved_by_name"]}
                    </span>
                  </div>
                </div>
                <div className="form-group row mb-0">
                  <label className="col-sm-4 col-form-label">
                    {modalHistoryData["state"] === "REJECTED" ? (
                      <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.REJECTED_DATE" />
                    ) : (
                      <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.APPROVED_DATE" />
                    )}
                  </label>
                  <div className="col-sm-8">
                    <span className="form-control-plaintext">
                      :{" "}
                      {modalHistoryData["state"] === "REJECTED"
                        ? moment(
                          new Date(modalHistoryData["rejected_at"])
                        ).format("YYYY-MM-DD HH:mm:ss")
                        : moment(
                          new Date(modalHistoryData["approved_at"])
                        ).format("YYYY-MM-DD HH:mm:ss")}
                    </span>
                  </div>
                </div>
                {modalHistoryData["state"] === "REJECTED" && (
                  <div className="form-group row mb-0">
                    <label className="col-sm-12 col-form-label">
                      <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.REJECTED_DESC" />
                    </label>
                    <div className="col-sm-12">
                      <textarea
                        disabled
                        className="form-control"
                        defaultValue={modalHistoryData["rejected_remark"]}
                      ></textarea>
                    </div>
                  </div>
                )}
              </div>
              <div className="col-md-6">
                <div className="form-group row mb-0">
                  <label className="col-sm-4 col-form-label">
                    <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.SPP_DOCUMENT.BANK_REFFERENCE" />
                  </label>
                  <div className="col-sm-8">
                    <span className="form-control-plaintext">
                      :{" "}
                      {modalHistoryData["bank_refference"] ? (
                        <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.SPP_DOCUMENT.BANK_REFFERENCE_TRUE" />
                      ) : (
                        <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.SPP_DOCUMENT.BANK_REFFERENCE_FALSE" />
                      )}
                    </span>
                  </div>
                </div>
                <div className="form-group row mb-0">
                  <label className="col-sm-4 col-form-label">
                    <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.SPP_DOCUMENT.MAIL_BANK" />
                  </label>
                  <div className="col-sm-8">
                    <span className="form-control-plaintext">
                      :{" "}
                      <a href={getFileBank + modalHistoryData["new_bank_file"]}>
                        {modalHistoryData["new_bank_file"]}
                      </a>
                    </span>
                  </div>
                </div>
                <div className="form-group row mb-0">
                  <label className="col-sm-4 col-form-label">
                    <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.SPP_DOCUMENT.ACCOUNT_NUMBER" />
                  </label>
                  <div className="col-sm-8">
                    <span className="form-control-plaintext">
                      : {modalHistoryData["bank_account_no"]}
                    </span>
                  </div>
                </div>
                <div className="form-group row mb-0">
                  <label className="col-sm-4 col-form-label">
                    <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.SPP_DOCUMENT.ACCOUNT_NAME" />
                  </label>
                  <div className="col-sm-8">
                    <span className="form-control-plaintext">
                      : {modalHistoryData["bank_account_name"]}
                    </span>
                  </div>
                </div>
                <div className="form-group row mb-0">
                  <label className="col-sm-4 col-form-label">
                    <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.SPP_DOCUMENT.BANK_NAME" />
                  </label>
                  <div className="col-sm-8">
                    <span className="form-control-plaintext">
                      : {modalHistoryData["bank_name"]}
                    </span>
                  </div>
                </div>
                <div className="form-group row mb-0">
                  <label className="col-sm-4 col-form-label">
                    <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.SPP_DOCUMENT.BANK_ADDRESS" />
                  </label>
                  <div className="col-sm-8">
                    <span className="form-control-plaintext">
                      : {modalHistoryData["bank_address"]}
                    </span>
                  </div>
                </div>
              </div>
            </div>
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
                <label htmlFor="numberSpp" className="col-sm-4 col-form-label">
                  <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.SPP_DOCUMENT.SPP_NUMBER" />
                </label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    className="form-control"
                    id="numberSpp"
                    disabled
                    defaultValue={sppData?.spr_no}
                  />
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="dateSpp" className="col-sm-4 col-form-label">
                  <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.SPP_DOCUMENT.SPP_DATE" />
                </label>
                <div className="col-sm-8">
                  <input
                    type="date"
                    className="form-control"
                    id="dateSpp"
                    disabled
                    defaultValue={sppData?.spr_date}
                  />
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="note" className="col-sm-4 col-form-label">
                  <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.DESCRIPTION" />
                </label>
                <div className="col-sm-8">
                  <textarea
                    rows="4"
                    cols=""
                    className="form-control"
                    id="note"
                    disabled
                    defaultValue={sppData?.description}
                  ></textarea>
                </div>
              </div>
              <div className="form-group row">
                <label className="col-sm-4 col-form-label">
                  <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.SPP_DOCUMENT.SPP_UPLOAD" />
                </label>
                <label className="input-group mb-3 col-sm-8">
                  <span
                    className={`form-control text-truncate ${classes.textDisabled}`}
                  >
                    {sppData ? sppData?.file_name : "Pilih File"}
                  </span>
                  <div className="input-group-append pointer">
                    <span className={`input-group-text ${classes.textHover}`}>
                      <a download={sppData?.file_name} href={sppData?.file}>
                        <i className="fas fa-download"></i>
                      </a>
                    </span>
                    <span
                      className={`input-group-text ${classes.textHover}`}
                      onClick={() => setDialogState(true)}
                    >
                      <i className="fas fa-eye"></i>
                    </span>
                  </div>
                </label>
              </div>
              <div className="form-group row">
                <label
                  htmlFor="accountNumberSpp"
                  className="col-sm-4 col-form-label"
                >
                  <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.SPP_DOCUMENT.BANK_REFFERENCE" />
                </label>
                <div className="col-sm-8 col-form-label">
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      disabled
                      name="RadioOptions"
                      defaultChecked={sppData?.bank_refference}
                    />
                    <label className="form-check-label">
                      <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.SPP_DOCUMENT.BANK_REFFERENCE_TRUE" />
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      disabled
                      name="RadioOptions"
                      defaultChecked={!sppData?.bank_refference}
                    />
                    <label className="form-check-label">
                      <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.SPP_DOCUMENT.BANK_REFFERENCE_FALSE" />
                    </label>
                  </div>
                </div>
              </div>
              <div className="form-group row">
                <label
                  htmlFor="accountNumberSpp"
                  className="col-sm-4 col-form-label"
                >
                  <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.SPP_DOCUMENT.ACCOUNT_NUMBER" />
                </label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    className="form-control"
                    id="accountNumberSpp"
                    disabled
                    defaultValue={sppData?.bank_account_no}
                  />
                </div>
              </div>
              <div className="form-group row">
                <label
                  htmlFor="accountNameSpp"
                  className="col-sm-4 col-form-label"
                >
                  <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.SPP_DOCUMENT.ACCOUNT_NAME" />
                </label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    className="form-control"
                    id="accountNameSpp"
                    disabled
                    defaultValue={sppData?.bank_account_name}
                  />
                </div>
              </div>
              <div className="form-group row">
                <label
                  htmlFor="bankNameSpp"
                  className="col-sm-4 col-form-label"
                >
                  <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.SPP_DOCUMENT.BANK_NAME" />
                </label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    className="form-control"
                    id="bankNameSpp"
                    disabled
                    defaultValue={sppData?.bank_name}
                  />
                </div>
              </div>
              <div className="form-group row">
                <label
                  htmlFor="bankAddressSpp"
                  className="col-sm-4 col-form-label"
                >
                  <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.SPP_DOCUMENT.BANK_ADDRESS" />
                </label>
                <div className="col-sm-8">
                  <textarea
                    rows="4"
                    className="form-control"
                    id="bankAddressSpp"
                    disabled
                    defaultValue={sppData?.bank_address}
                  ></textarea>
                </div>
              </div>
              {!sppData?.bank_refference && (
                <div className="form-group row">
                  <label
                    htmlFor="upload_bank"
                    className="col-sm-4 col-form-label"
                  >
                    <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.SPP_DOCUMENT.BANK_UPLOAD" />
                  </label>
                  <label
                    htmlFor="upload_bank"
                    className="input-group mb-3 col-sm-8 pointer"
                  >
                    <span
                      className={`form-control text-truncate h-100 ${classes.textDisabled}`}
                    >
                      {sppData ? (
                        sppData?.new_bank_file
                      ) : (
                        <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.DEFAULT_FILENAME" />
                      )}
                    </span>
                    <div className="input-group-append pointer">
                      <span className={`input-group-text ${classes.textHover}`}>
                        <a
                          download={sppData?.new_bank_file}
                          href={sppData?.file_bank}
                        >
                          <i className="fas fa-download"></i>
                        </a>
                      </span>
                      <span
                        className={`input-group-text ${classes.textHover}`}
                        onClick={() => setDialogStateBank(true)}
                      >
                        <i className="fas fa-eye"></i>
                      </span>
                    </div>
                  </label>
                </div>
              )}
            </div>
            <div className="col-md-6">
              <div className="form-group row">
                <label
                  htmlFor="priceContract"
                  className="col-sm-4 col-form-label"
                >
                  <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.CONTRACT_AMMOUNT" />
                </label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    className="form-control"
                    id="priceContract"
                    defaultValue={contractData["contract_value_new"]}
                    disabled
                  />
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="poNumber" className="col-sm-4 col-form-label">
                  <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.PO_NUMBER" />
                </label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    className="form-control"
                    id="poNumber"
                    defaultValue={contractData["purch_order_no"]}
                    disabled
                  />
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="priceStep1" className="col-sm-4 col-form-label">
                  <FormattedMessage
                    id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.TERMIN_VALUE"
                    values={{ termin: contractData["termin_name"] }}
                  />
                </label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    className="form-control"
                    id="priceStep1"
                    defaultValue={contractData["termin_value_new"]}
                    disabled
                  />
                </div>
              </div>
            </div>
          </div>
        </CardBody>
        <CardFooter className="text-right">
          <button
            type="button"
            onClick={() => setModalApprove(true)}
            disabled={
              isSubmit ||
              sppData?.state === "REJECTED" ||
              sppData?.state === "APPROVED" ||
              sppData === null ||
              !props.billingStaffStatus ||
              progressTermin?.ident_name !== "BILLING_SOFTCOPY"
            }
            className="btn btn-primary mx-1"
          >
            <FormattedMessage id="TITLE.ACCEPT_DOCUMENT" />
          </button>
          <button
            type="button"
            onClick={() => setModalReject(true)}
            disabled={
              isSubmit ||
              sppData?.state === "REJECTED" ||
              sppData?.state === "APPROVED" ||
              sppData === null ||
              !props.billingStaffStatus ||
              progressTermin?.ident_name !== "BILLING_SOFTCOPY"
            }
            className="btn btn-danger mx-1"
          >
            <FormattedMessage id="TITLE.REJECT_DOCUMENT" />
          </button>
          <div className="my-5 text-center">
            <h6>
              <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.SPP_DOCUMENT.HISTORY" />
            </h6>
          </div>

          <TableOnly
            dataHeader={headerTable}
            loading={loading}
            // err={err}
            hecto={10}
          >
            {historySppData.map((item, index) => {
              return (
                <TableRow key={index.toString()}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.spr_no}</TableCell>
                  <TableCell>{item.spr_date}</TableCell>
                  <TableCell>
                    <a href={getFileSpp + item.file_name}>{item.file_name}</a>
                  </TableCell>
                  <TableCell>{item.created_by_name}</TableCell>
                  <TableCell>
                    {moment(new Date(item.created_at)).format(
                      "YYYY-MM-DD HH:mm:ss"
                    )}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`${item.state === "REJECTED"
                        ? "text-danger"
                        : "text-success"
                        } pointer font-weight-bold`}
                      onClick={() => handleHistory(index)}
                    >
                      {item.state === "REJECTED" ? (
                        <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.REJECTED" />
                      ) : (
                        <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.APPROVED" />
                      )}{" "}
                      <i className="fas fa-caret-down"></i>
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableOnly>
        </CardFooter>
      </Card>
    </React.Fragment>
  );
}
export default injectIntl(connect(null, null)(ContractSprPage));
