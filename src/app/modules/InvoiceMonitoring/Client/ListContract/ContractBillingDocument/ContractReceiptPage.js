import React, { useState, useEffect, useCallback } from "react";
import { connect, shallowEqual, useSelector } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import {
  Card,
  CardBody,
  CardFooter,
} from "../../../../../../_metronic/_partials/controls";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Slide,
  TableRow,
  TableCell,
} from "@material-ui/core";
import {
  getContractSummary,
  getReceipt,
  getFileReceipt,
  approveReceipt,
  getAllRejectedReceipt,
  getAllApprovedReceipt,
  rejectReceipt,
  rejectReceiptStatus,
  getBillingDocumentId,
  softcopy_save,
  getTerminProgress,
  getInvoice,
  getInvoiceProgress
} from "../../../_redux/InvoiceMonitoringCrud";
import useToast from "../../../../../components/toast";
import { useFormik } from "formik";
import * as Yup from "yup";
import { rupiah,formatCurrency, currencySign } from "../../../../../libs/currency";
import { Document, Page } from "react-pdf";
import PerfectScrollbar from "react-perfect-scrollbar";
import { DialogTitleFile } from "../ItemContractInvoice";
import moment from "moment";
import TableOnly from "../../../../../components/tableCustomV1/tableOnly";
import { DEV_NODE, SOCKET } from "../../../../../../redux/BaseHost";
import NumberFormat from "react-number-format";
import { cloneDeep } from "lodash";
import { makeStyles } from "@material-ui/core/styles";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
  MuiDialogActionsPosistion: {
    justifyContent: "space-between",
  },
}));

function ContractReceiptPage(props) {
  const [loading, setLoading] = useState(false);
  const [loadingRcpt, setLoadingRcpt] = useState(false);
  const [contractData, setContractData] = useState({});
  const [receiptData, setReceiptData] = useState({});
  const [dialogState, setDialogState] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(null);
  const [modalReject, setModalReject] = useState(false);
  const [modalApprove, setModalApprove] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [historyReceiptData, setHistoryReceiptData] = useState([]);
  const [modalHistory, setModalHistory] = useState(false);
  const [modalHistoryData, setModalHistoryData] = useState({});
  const [invoiceBillingId, setInvoiceBillingId] = useState("");
  const [addtionalPayment, setAddtionalPayment] = useState([]);
  const [modalAddtionalPayment, setModalAddtionalPayment] = useState(false);
  const [isInvoiceComplete, setIsInvoiceComplete] = useState(false);
  const [currencyCode, setCurrencyCode] = useState(null);
  const [invoiceData, setInvoiceData] = useState({});

  const classes_ = useStyles();
  const [Toast, setToast] = useToast();

  const user_id = useSelector(
    (state) => state.auth.user.data.user_id,
    shallowEqual
  );
  const contract_id = props.match.params.contract;
  const termin = props.match.params.termin;

  const {
    intl,
    classes,
    progressTermin,
    setProgressTermin,
    setDataProgress,
    dataProgress,
  } = props;

  const initialValues = {};
  const invoiceName = "RECEIPT";

  const RecepitSchema = Yup.object().shape({
    rejected_remark: Yup.string().required(
      intl.formatMessage({
        id: "AUTH.VALIDATION.REQUIRED_FIELD",
      })
    ),
  });

  const headerTable = [
    {
      title: intl.formatMessage({
        id: "TITLE.TABLE_HEADER.NO",
      }),
    },
    {
      title: intl.formatMessage({
        id:
          "TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.RECEIPT_DOCUMENT.RECEIPT_NUMBER",
      }),
    },
    {
      title: intl.formatMessage({
        id:
          "TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.RECEIPT_DOCUMENT.RECEIPT_DATE",
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

  const formik = useFormik({
    initialValues,
    validationSchema: RecepitSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      var data = Object.assign({}, receiptData);
      delete data.file;
      delete data.file_bank;
      data.rejected_by_id = user_id;
      data.rejected_remark = values.rejected_remark;
      rejectReceipt(data)
        .then((response) => {
          rejectReceiptStatus(receiptData.id)
            .then((responses) => {
              setToast(intl.formatMessage({ id: "REQ.UPDATE_SUCCESS" }), 10000);
              setLoading(false);
              setModalReject(false);
              setIsSubmit(true);
              getHistoryReceiptData(receiptData.id);
              SOCKET.emit("send_notif");
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

  const getReceiptData = useCallback(() => {
    setLoadingRcpt(true);
    getReceipt(contract_id, termin)
      .then((response) => {
        setReceiptData(response.data.data);
        if (response.data.data) {
          getHistoryReceiptData(response["data"]["data"]["id"]);
        }
        if(response?.data?.data?.currency?.code) setCurrencyCode(response?.data?.data?.currency?.code);
        setLoadingRcpt(false);
      })
      .catch((error) => {
        setLoadingRcpt(false);
        setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 10000);
      });
  }, [contract_id, formik, intl, setToast]);

  const handleHistory = (index) => {
    setModalHistoryData(historyReceiptData[index]);
    setModalHistory(true);
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const approveReceiptData = () => {
    setLoading(true);
    var data_1 = {
      contract_id: contract_id,
      term_id: termin,
      softcopy_state: "APPROVED",
      document_id: invoiceBillingId,
      document_no: receiptData?.receipt_no,
      created_by_id: user_id,
      filename: receiptData?.file_name,
    };
    approveReceipt(receiptData.id, {
      approved_by_id: user_id,
      contract_id: contract_id,
      term_id: termin,
      progress_data: dataProgress,
    })
      .then((response) => {
        setToast(intl.formatMessage({ id: "REQ.UPDATE_SUCCESS" }), 10000);
        setLoading(false);
        setModalApprove(false);
        setIsSubmit(true);
        getHistoryReceiptData(receiptData.id);
        softcopy_save(data_1);
        getTerminProgress(termin).then((result) => {
          if (result.data.data.data) {
            setProgressTermin(result.data.data?.progress_type);
            setDataProgress(result.data.data?.data);
          }
        });
        SOCKET.emit("send_notif");
      })
      .catch((error) => {
        setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 10000);
        setLoading(false);
      });
  };

  const getHistoryReceiptData = useCallback(
    (receipt_id) => {
      getAllRejectedReceipt(receipt_id)
        .then((responseReject) => {
          getAllApprovedReceipt(receipt_id)
            .then((responseApprove) => {
              setHistoryReceiptData([
                ...responseReject["data"]["data"],
                ...responseApprove["data"]["data"],
              ]);
            })
            .catch((error) => {
              setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 10000);
            });
          // setHistoryReceiptData(response['data']['data'])
        })
        .catch((error) => {
          setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 10000);
        });
    },
    [intl, setToast]
  );

  const getBillingDocumentIdData = useCallback(() => {
    getBillingDocumentId(invoiceName)
      .then((response) => {
        setInvoiceBillingId(response.data.data.id);
      })
      .catch((error) => {
        setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 10000);
      });
  }, [invoiceName, setInvoiceBillingId, formik, intl, setToast]);

  const getInvoiceData = useCallback(() => {
    getInvoice(contract_id, termin)
      .then((response) => {
        setInvoiceData(response.data.data);
        if (response.data.data) {
          // getHistoryInvoiceData(response["data"]["data"]["id"]);
          setAddtionalPayment(
            response.data?.data?.invoice_additional_value_data
              ? response.data?.data?.invoice_additional_value_data
              : []
          );
        }
      })
      .catch((error) => {
        setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 10000);
      });
  }, [
    contract_id,
    setInvoiceData,
    // getHistoryInvoiceData,
    formik,
    intl,
    setToast,
  ]);

  const getInvoiceProgressData = () => {
    getInvoiceProgress(termin).then((response) => {
      const data = response?.data?.data;

      if(data) {
        setIsInvoiceComplete(true);
      }
      else {
        setIsInvoiceComplete(false);
      }
    }).catch((err) => {
      setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 5000);
    })
  }

  // useEffect(getInvoiceProgressData, []);
  useEffect(getContractData, []);
  useEffect(getReceiptData, []);
  useEffect(getBillingDocumentIdData, []);
  useEffect(getInvoiceData, []);

  const totalAddtionalPayment = () => {
    if (addtionalPayment && addtionalPayment.length === 0) return 0;
    var total = 0;
    addtionalPayment.forEach((element) => {
      total += element.value;
    });
    return total;
  };

  // console.log({"progressTermin?.ident_name" : progressTermin?.ident_name});
  // console.log(isSubmit,
  //   receiptData?.state === "REJECTED",
  //   receiptData?.state === "APPROVED",
  //   receiptData === null,
  //   !props.billingStaffStatus,
  //   progressTermin?.ident_name !== "BILLING_SOFTCOPY", "<<<<<");
  

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
          <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.RECEIPT_DOCUMENT.APPROVED.APPROVE_TITLE" />
        </DialogTitle>
        <DialogContent>
          <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.RECEIPT_DOCUMENT.APPROVED.APPROVE_BODY" />
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
            onClick={approveReceiptData}
          >
            <span>
              <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.RECEIPT_DOCUMENT.APPROVED.APPROVE_SUBMIT" />
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
            <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.RECEIPT_DOCUMENT.REJECTED.REJECT_TITLE" />
          </DialogTitle>
          <DialogContent>
            <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.RECEIPT_DOCUMENT.REJECTED.REJECT_BODY" />
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
              onClick={() => setModalReject(false)}
              disabled={loading}
            >
              <FormattedMessage id="AUTH.GENERAL.BACK_BUTTON" />
            </button>
            <button
              className="btn btn-danger"
              disabled={
                loading || (formik.touched && !formik.isValid) || !formik.dirty
              }
            >
              <span>
                <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.RECEIPT_DOCUMENT.REJECTED.REJECT_SUBMIT" />
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
                file={receiptData?.file}
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
                        className={`fas fa-chevron-left ${
                          pageNumber === 1 ? "" : "text-secondary"
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
                        className={`fas fa-chevron-right ${
                          pageNumber === numPages ? "" : "text-secondary"
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
        maxWidth="sm"
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
              <label className="col-sm-3 col-form-label">
                <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.RECEIPT_DOCUMENT.RECEIPT_NUMBER" />
              </label>
              <div className="col-sm-9">
                <span className="form-control-plaintext">
                  : {modalHistoryData["receipt_no"]}
                </span>
              </div>
            </div>
            <div className="form-group row mb-0">
              <label className="col-sm-3 col-form-label">
                <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.RECEIPT_DOCUMENT.RECEIPT_DATE" />
              </label>
              <div className="col-sm-9">
                <span className="form-control-plaintext">
                  :{" "}
                  {moment(new Date(modalHistoryData["receipt_date"])).format(
                    "YYYY-MM-DD"
                  )}
                </span>
              </div>
            </div>
            <div className="form-group row mb-0">
              <label className="col-sm-3 col-form-label">
                <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.SEND_BY" />
              </label>
              <div className="col-sm-9">
                <span className="form-control-plaintext">
                  : {modalHistoryData["created_by_name"]}
                </span>
              </div>
            </div>
            <div className="form-group row mb-0">
              <label className="col-sm-3 col-form-label">
                <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.SEND_DATE" />
              </label>
              <div className="col-sm-9">
                <span className="form-control-plaintext">
                  :{" "}
                  {moment(new Date(modalHistoryData["created_at"])).format(
                    "YYYY-MM-DD HH:mm:ss"
                  )}
                </span>
              </div>
            </div>
            <div className="form-group row mb-0">
              <label className="col-sm-3 col-form-label">
                {modalHistoryData["state"] === "REJECTED" ? (
                  <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.REJECTED_BY" />
                ) : (
                  <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.APPROVED_BY" />
                )}
              </label>
              <div className="col-sm-9">
                <span className="form-control-plaintext">
                  :{" "}
                  {modalHistoryData["state"] === "REJECTED"
                    ? modalHistoryData["rejected_by_name"]
                    : modalHistoryData["approved_by_name"]}
                </span>
              </div>
            </div>
            <div className="form-group row mb-0">
              <label className="col-sm-3 col-form-label">
                {modalHistoryData["state"] === "REJECTED" ? (
                  <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.REJECTED_DATE" />
                ) : (
                  <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.APPROVED_DATE" />
                )}
              </label>
              <div className="col-sm-9">
                <span className="form-control-plaintext">
                  :{" "}
                  {modalHistoryData["state"] === "REJECTED"
                    ? moment(new Date(modalHistoryData["rejected_at"])).format(
                        "YYYY-MM-DD HH:mm:ss"
                      )
                    : moment(new Date(modalHistoryData["approved_at"])).format(
                        "YYYY-MM-DD HH:mm:ss"
                      )}
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
      <Dialog
        open={modalAddtionalPayment}
        TransitionComponent={Transition}
        keepMounted
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        maxWidth="md"
        fullWidth={true}
      >
        <form
          autoComplete="off"
          onSubmit={(e) => {
            // e.preventDefault();
            // setModalAddtionalPayment(false);
          }}
        >
          <DialogTitle id="alert-dialog-slide-title">
            <FormattedMessage id="TITLE.ADDTIONAL_PAYMENT" />
          </DialogTitle>
          <DialogContent>
            <table>
              <thead>
                <tr>
                  <th style={{ width: "50%" }}>
                    <FormattedMessage id="TITLE.DESCRIPTION" />
                  </th>
                  <th style={{ width: "40%" }}>
                    <FormattedMessage id="TITLE.VALUE" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {addtionalPayment.map((item, index) => {
                  return (
                    <tr key={index.toString()}>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          value={item.description}
                          onChange={(e) => {
                            let addtionalPayments = cloneDeep(addtionalPayment);
                            addtionalPayments[index].description =
                              e.target.value;
                            setAddtionalPayment(addtionalPayments);
                          }}
                          required={true}
                          disabled
                        />
                      </td>
                      <td>
                        <NumberFormat
                          id="NumberFormat-text"
                          value={item.value}
                          displayType="text"
                          className="form-control"
                          thousandSeparator={"."}
                          decimalSeparator={","}
                          allowEmptyFormatting={true}
                          allowLeadingZeros={true}
                          prefix={currencySign(currencyCode)}
                          onValueChange={(e) => {
                            let addtionalPayments = cloneDeep(addtionalPayment);
                            addtionalPayments[index].value = e.floatValue
                              ? e.floatValue
                              : 0;
                            setAddtionalPayment(addtionalPayments);
                          }}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </DialogContent>
          <DialogActions className={classes_.MuiDialogActionsPosistion}>
            <div>
              <FormattedMessage id="TITLE.TOTAL_PRICE_IS" />:{" "}
              {formatCurrency(currencyCode, totalAddtionalPayment())}
            </div>
            <div>
              <button
                className="btn btn-secondary mx-1"
                onClick={() => {
                  setModalAddtionalPayment(false);
                  setAddtionalPayment(
                    cloneDeep(
                      invoiceData?.invoice_additional_value_data
                        ? invoiceData?.invoice_additional_value_data
                        : []
                    )
                  );
                }}
                disabled={loading}
                type="button"
              >
                <FormattedMessage id="AUTH.GENERAL.BACK_BUTTON" />
              </button>
            </div>
          </DialogActions>
        </form>
      </Dialog>
      <Card>
        <CardBody>
          {loadingRcpt && (
            <span>
              <i className="fas fa-spinner fa-pulse text-dark mr-1"></i>
              <FormattedMessage id="TITLE.TABLE.WAITING_DATA" />
            </span>
          )}
          <div className="row">
            <div className="col-md-6">
              <div className="form-group row">
                <label
                  htmlFor="numberInvoice"
                  className="col-sm-4 col-form-label"
                >
                  <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.RECEIPT_DOCUMENT.RECEIPT_NUMBER" />
                </label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    className="form-control"
                    id="numberInvoice"
                    disabled
                    defaultValue={receiptData?.receipt_no}
                  />
                </div>
              </div>
              <div className="form-group row">
                <label
                  htmlFor="dateReceipt"
                  className="col-sm-4 col-form-label"
                >
                  <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.RECEIPT_DOCUMENT.RECEIPT_DATE" />
                </label>
                <div className="col-sm-8">
                  <input
                    type="date"
                    className="form-control"
                    id="dateReceipt"
                    disabled
                    defaultValue={receiptData?.receipt_date}
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
                    defaultValue={receiptData?.description}
                  ></textarea>
                </div>
              </div>
              <div className="form-group row">
                <label className="col-sm-4 col-form-label">
                  <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.RECEIPT_DOCUMENT.RECEIPT_UPLOAD" />
                </label>
                <label className="input-group mb-3 col-sm-8">
                  <span
                    className={`form-control text-truncate ${classes.textDisabled}`}
                  >
                    {receiptData ? receiptData?.file_name : "Pilih File"}
                  </span>
                  <div className="input-group-append pointer">
                    <span className={`input-group-text ${classes.textHover}`}>
                      <a
                        onClick={() => {
                          window.open(
                            DEV_NODE + "/receipt/" + receiptData?.file_name,
                            "_blank"
                          );
                        }}
                        href={"#"}
                        // download={receiptData?.file_name}
                        // href={receiptData?.file}
                      >
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
                    defaultValue={formatCurrency(currencyCode, contractData?.contract_value)}
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
                    defaultValue={formatCurrency(currencyCode, contractData?.termin_value)}
                    disabled
                  />
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="priceStep1" className="col-sm-4 col-form-label">
                  <FormattedMessage id="TITLE.ADDTIONAL_PAYMENT" />
                </label>
                <div className="col-sm-8">
                  <button
                    type="button"
                    className="btn btn-sm btn-primary w-100"
                    onClick={() => {
                      setModalAddtionalPayment(true);
                    }}
                  >
                    <FormattedMessage id="TITLE.SELECT" />
                  </button>
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="priceStep1" className="col-sm-4 col-form-label">
                  <FormattedMessage id="TITLE.TOTAL_AMOUNT" />
                </label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    className="form-control"
                    id="priceContract"
                    value={formatCurrency(currencyCode, contractData?.termin_value, totalAddtionalPayment())}
                    onChange={() => {}}
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
              receiptData?.state === "REJECTED" ||
              receiptData?.state === "APPROVED" ||
              receiptData === null ||
              !props.billingStaffStatus 
              // ||
              // progressTermin?.ident_name !== "BILLING_SOFTCOPY"
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
              receiptData?.state === "REJECTED" ||
              receiptData?.state === "APPROVED" ||
              receiptData === null ||
              !props.billingStaffStatus
              // ||
              // progressTermin?.ident_name !== "BILLING_SOFTCOPY"
            }
            className="btn btn-danger mx-1"
          >
            <FormattedMessage id="TITLE.REJECT_DOCUMENT" />
          </button>
          <div className="my-5 text-center">
            <h6>
              <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.RECEIPT_DOCUMENT.HISTORY" />
            </h6>
          </div>

          <TableOnly
            dataHeader={headerTable}
            loading={loading}
            // err={err}
            hecto={10}
          >
            {historyReceiptData.map((item, index) => {
              return (
                <TableRow key={index.toString()}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.receipt_no}</TableCell>
                  <TableCell>{item.receipt_date}</TableCell>
                  <TableCell>
                    <a
                      onClick={() => {
                        window.open(
                          DEV_NODE + "/receipt/" + item?.file_name,
                          "_blank"
                        );
                      }}
                      href={"#"}
                      // href={getFileReceipt + item.file_name}
                    >
                      {item.file_name}
                    </a>
                  </TableCell>
                  <TableCell>{item.created_by_name}</TableCell>
                  <TableCell>
                    {moment(new Date(item.created_at)).format(
                      "YYYY-MM-DD HH:mm:ss"
                    )}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`${
                        item.state === "REJECTED"
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
export default injectIntl(connect(null, null)(ContractReceiptPage));
