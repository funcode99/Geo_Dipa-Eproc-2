import React, { useState, useEffect, useCallback } from "react";
import { connect, shallowEqual, useSelector } from "react-redux";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  TableRow,
  TableCell,
} from "@material-ui/core";
import { FormattedMessage, injectIntl } from "react-intl";
import {
  Card,
  CardBody,
  CardFooter,
} from "../../../../../../_metronic/_partials/controls";
import {
  getContractSummary,
  getInvoice,
  approveInvoice,
  rejectInvoice,
  rejectInvoiceStatus,
  getAllRejectedInvoice,
  getFileInvoice,
  getAllApprovedInvoice,
  getBillingDocumentId,
  softcopy_save,
  getTerminProgress,
} from "../../../_redux/InvoiceMonitoringCrud";
import useToast from "../../../../../components/toast";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  formatCurrency,
  rupiah,
  currencySign,
} from "../../../../../libs/currency";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-perfect-scrollbar/dist/css/styles.css";
import { Document, Page } from "react-pdf";
import PerfectScrollbar from "react-perfect-scrollbar";
import { DialogTitleFile } from "../ItemContractInvoice";
import moment from "moment";
import TableOnly from "../../../../../components/tableCustomV1/tableOnly";
import NumberFormat from "react-number-format";
import { DEV_NODE, SOCKET } from "../../../../../../redux/BaseHost";
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

function ContractInvoicePage(props) {
  const [loading, setLoading] = useState(false);
  const [loadingInvoice, setLoadingInvoice] = useState(false);
  const [contractData, setContractData] = useState({});
  const [invoiceData, setInvoiceData] = useState({});
  const [dialogState, setDialogState] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(null);
  const [modalReject, setModalReject] = useState(false);
  const [modalApprove, setModalApprove] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [historyInvoiceData, setHistoryInvoiceData] = useState([]);
  const [modalHistory, setModalHistory] = useState(false);
  const [modalHistoryData, setModalHistoryData] = useState({});
  const [invoiceBillingId, setInvoiceBillingId] = useState("");
  const [addtionalPayment, setAddtionalPayment] = useState([]);
  const [modalAddtionalPayment, setModalAddtionalPayment] = useState(false);
  const [currencyCode, setCurrencyCode] = useState("");
  const classes_ = useStyles();

  const [Toast, setToast] = useToast();

  const user_id = useSelector(
    (state) => state.auth.user.data.user_id,
    shallowEqual
  );
  const contract_id = props.match.params.contract;
  const termin = props.match.params.termin;
  const invoiceName = "INVOICE";

  const {
    intl,
    classes,
    progressTermin,
    setProgressTermin,
    setDataProgress,
    dataProgress,
  } = props;

  const initialValues = {};

  const InvoiceSchema = Yup.object().shape({
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
          "TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.INVOICE_DOCUMENT.INVOICE_NUMBER",
      }),
    },
    {
      title: intl.formatMessage({
        id:
          "TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.INVOICE_DOCUMENT.INVOICE_DATE",
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
    validationSchema: InvoiceSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      var data = Object.assign({}, invoiceData);
      delete data.file;
      delete data.file_bank;
      data.rejected_by_id = user_id;
      data.rejected_remark = values.rejected_remark;
      rejectInvoice(data)
        .then((response) => {
          rejectInvoiceStatus(invoiceData.id)
            .then((responses) => {
              setToast(intl.formatMessage({ id: "REQ.UPDATE_SUCCESS" }), 10000);
              setLoading(false);
              setModalReject(false);
              setIsSubmit(true);
              getHistoryInvoiceData(invoiceData.id);
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
  }, [contract_id, termin, formik, intl, setToast, user_id]);

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
    setLoadingInvoice(true);
    getInvoice(contract_id, termin)
      .then((response) => {
        setInvoiceData(response.data.data);
        if (response.data.data) {
          getHistoryInvoiceData(response["data"]["data"]["id"]);
          setAddtionalPayment(
            response.data?.data?.invoice_additional_value_data
              ? response.data?.data?.invoice_additional_value_data
              : []
          );
        }
        if (response?.data?.data?.currency?.code)
          setCurrencyCode(response?.data?.data?.currency?.code);
        setLoadingInvoice(false);
      })
      .catch((error) => {
        setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 10000);
        setLoadingInvoice(false);
      });
  }, [
    contract_id,
    setInvoiceData,
    getHistoryInvoiceData,
    formik,
    intl,
    setToast,
    setLoadingInvoice,
  ]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const approveInvoiceData = () => {
    setLoading(true);
    var data_1 = {
      contract_id: contract_id,
      term_id: termin,
      softcopy_state: "APPROVED",
      document_id: invoiceBillingId,
      document_no: invoiceData?.invoice_no,
      created_by_id: user_id,
      filename: invoiceData?.file_name,
    };
    approveInvoice(invoiceData.id, {
      approved_by_id: user_id,
      contract_id: contract_id,
      term_id: termin,
      penalty: invoiceData?.penalty,
      progress_data: dataProgress,
      penalty_remark: invoiceData?.penalty_remark,
      invoice_additional_value_data: addtionalPayment,
    })
      .then((response) => {
        setToast(intl.formatMessage({ id: "REQ.UPDATE_SUCCESS" }), 10000);
        setLoading(false);
        setModalApprove(false);
        setIsSubmit(true);
        getHistoryInvoiceData(invoiceData.id);
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

  const getHistoryInvoiceData = useCallback(
    (invoice_id) => {
      getAllRejectedInvoice(invoice_id)
        .then((responseReject) => {
          getAllApprovedInvoice(invoice_id)
            .then((responseApprove) => {
              setHistoryInvoiceData([
                ...responseReject["data"]["data"],
                ...responseApprove["data"]["data"],
              ]);
            })
            .catch((error) => {
              setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 10000);
            });
          // setHistoryInvoiceData(response['data']['data'])
        })
        .catch((error) => {
          setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 10000);
        });
    },
    [intl, setToast]
  );

  const handleHistory = (index) => {
    setModalHistoryData(historyInvoiceData[index]);
    setModalHistory(true);
  };
  useEffect(getContractData, []);
  useEffect(getInvoiceData, []);
  useEffect(getBillingDocumentIdData, []);

  const totalAddtionalPayment = () => {
    if (addtionalPayment && addtionalPayment.length === 0) return 0;
    var total = 0;
    addtionalPayment.forEach((element) => {
      total += element.value;
    });
    return total;
  };

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
          <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.INVOICE_DOCUMENT.APPROVED.APPROVE_TITLE" />
        </DialogTitle>
        <DialogContent>
          <div>
            <FormattedMessage id="TITLE.FINE_ATTACHMENT" />
            <span className="text-danger">
              {formatCurrency(currencyCode, invoiceData?.penalty || 0)}
            </span>
          </div>
          <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.INVOICE_DOCUMENT.APPROVED.APPROVE_BODY" />
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
            onClick={approveInvoiceData}
          >
            <span>
              <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.INVOICE_DOCUMENT.APPROVED.APPROVE_SUBMIT" />
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
            <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.INVOICE_DOCUMENT.REJECTED.REJECT_TITLE" />
          </DialogTitle>
          <DialogContent>
            <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.INVOICE_DOCUMENT.REJECTED.REJECT_BODY" />
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
              type="button"
              className="btn btn-secondary"
              onClick={() => setModalReject(false)}
              disabled={loading}
            >
              <FormattedMessage id="AUTH.GENERAL.BACK_BUTTON" />
            </button>
            <button
              type="submit"
              className="btn btn-danger"
              disabled={
                loading || (formik.touched && !formik.isValid) || !formik.dirty
              }
            >
              <span>
                <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.INVOICE_DOCUMENT.REJECTED.REJECT_SUBMIT" />
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
                file={invoiceData?.file}
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
          <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.INVOICE_DOCUMENT.DETAIL_HISTORY" />
        </DialogTitle>
        <PerfectScrollbar>
          <DialogContent>
            <div className="form-group row mb-0">
              <label className="col-sm-3 col-form-label">
                <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.INVOICE_DOCUMENT.INVOICE_NUMBER" />
              </label>
              <div className="col-sm-9">
                <span className="form-control-plaintext">
                  : {modalHistoryData["invoice_no"]}
                </span>
              </div>
            </div>
            <div className="form-group row mb-0">
              <label className="col-sm-3 col-form-label">
                <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.INVOICE_DOCUMENT.INVOICE_DATE" />
              </label>
              <div className="col-sm-9">
                <span className="form-control-plaintext">
                  :{" "}
                  {moment(new Date(modalHistoryData["from_time"])).format(
                    "DD MMMM YYYY"
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
                    "DD MMMM YYYY hh:mm:ss"
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
                        "DD MMMM YYYY hh:mm:ss"
                      )
                    : moment(new Date(modalHistoryData["approved_at"])).format(
                        "DD MMMM YYYY hh:mm:ss"
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
            e.preventDefault();
            setModalAddtionalPayment(false);
            setInvoiceData({
              ...invoiceData,
              invoice_additional_value_data: cloneDeep(addtionalPayment),
            });
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
                  <th style={{ width: "10%" }}>
                    <button
                      type="button"
                      className="btn btn-sm btn-primary"
                      onClick={() => {
                        let addtionalPayments = cloneDeep(addtionalPayment);
                        let item = {
                          description: "",
                          value: 0,
                        };
                        addtionalPayments.push(item);
                        setAddtionalPayment(addtionalPayments);
                      }}
                      disabled
                    >
                      <FormattedMessage id="TITLE.ADD" />
                    </button>
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
                          // id={
                          //   isSubmit ||
                          //   invoiceData?.state === "REJECTED" ||
                          //   invoiceData?.state === "APPROVED" ||
                          //   invoiceData === null ||
                          //   progressTermin?.ident_name !== "BILLING_SOFTCOPY"
                          //     ? "NumberFormat-text"
                          //     : "NumberFormat-input"
                          // }
                          value={item.value}
                          displayType="text"
                          // displayType={
                          //   isSubmit ||
                          //   invoiceData?.state === "REJECTED" ||
                          //   invoiceData?.state === "APPROVED" ||
                          //   invoiceData === null ||
                          //   progressTermin?.ident_name !== "BILLING_SOFTCOPY"
                          //     ? "text"
                          //     : "input"
                          // }
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
                          // onClick={(e) => {
                          //   if (
                          //     !(
                          //       isSubmit ||
                          //       invoiceData?.state === "REJECTED" ||
                          //       invoiceData?.state === "APPROVED" ||
                          //       invoiceData === null ||
                          //       progressTermin?.ident_name !==
                          //         "BILLING_SOFTCOPY"
                          //     )
                          //   )
                          //     e.target.select();
                          // }}
                        />
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-sm btn-danger"
                          disabled
                          // onClick={() => {
                          //   let addtionalPayments = cloneDeep(addtionalPayment);
                          //   addtionalPayments.splice(index, 1);
                          //   setAddtionalPayment(addtionalPayments);
                          // }}
                          // disabled={
                          //   isSubmit ||
                          //   invoiceData?.state === "REJECTED" ||
                          //   invoiceData?.state === "APPROVED" ||
                          //   invoiceData === null ||
                          //   progressTermin?.ident_name !== "BILLING_SOFTCOPY"
                          // }
                        >
                          <FormattedMessage id="BUTTON.DELETE" />
                        </button>
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
              <button
                className="btn btn-primary mx-1"
                disabled
                // disabled={
                //   isSubmit ||
                //   invoiceData?.state === "REJECTED" ||
                //   invoiceData?.state === "APPROVED" ||
                //   invoiceData === null ||
                //   !props.billingStaffStatus ||
                //   progressTermin?.ident_name !== "BILLING_SOFTCOPY"
                // }
                type="submit"
              >
                <span>
                  <FormattedMessage id="TITLE.SAVE" />
                </span>
                {loading && (
                  <span
                    className="spinner-border spinner-border-sm ml-1"
                    aria-hidden="true"
                  ></span>
                )}
              </button>
            </div>
          </DialogActions>
        </form>
      </Dialog>
      <Card>
        <CardBody>
          {loadingInvoice && (
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
                  <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.INVOICE_DOCUMENT.INVOICE_NUMBER" />
                </label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    className="form-control"
                    id="numberInvoice"
                    disabled
                    defaultValue={invoiceData?.invoice_no}
                  />
                </div>
              </div>
              <div className="form-group row">
                <label
                  htmlFor="dateInvoice"
                  className="col-sm-4 col-form-label"
                >
                  <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.INVOICE_DOCUMENT.INVOICE_DATE" />
                </label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    className="form-control"
                    id="dateInvoice"
                    disabled
                    defaultValue={
                      invoiceData?.from_time
                        ? moment(invoiceData?.from_time).format("DD MMMM YYYY")
                        : ""
                    }
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
                    defaultValue={invoiceData?.description}
                  ></textarea>
                </div>
              </div>
              <div className="form-group row">
                <label className="col-sm-4 col-form-label">
                  <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.INVOICE_DOCUMENT.INVOICE_UPLOAD" />
                </label>
                <label className="input-group mb-3 col-sm-8">
                  <span
                    className={`form-control text-truncate ${classes.textDisabled}`}
                  >
                    {invoiceData ? invoiceData?.file_name : "Pilih File"}
                  </span>
                  <div className="input-group-append pointer">
                    <span className={`input-group-text ${classes.textHover}`}>
                      <a
                        // download={invoiceData?.file_name}
                        // href={invoiceData?.file}
                        onClick={() => {
                          window.open(
                            DEV_NODE + "/invoice/" + invoiceData?.file_name,
                            "_blank"
                          );
                        }}
                        href={"#"}
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
                <label htmlFor="createdAt" className="col-sm-4 col-form-label">
                  <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.SEND_DATE" />
                </label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    className="form-control"
                    id="createdAt"
                    defaultValue={
                      invoiceData?.created_at
                        ? moment(invoiceData?.created_at).format(
                            "DD MMMM YYYY hh:mm:ss"
                          )
                        : ""
                    }
                    disabled
                  />
                </div>
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
                    defaultValue={formatCurrency(
                      currencyCode,
                      contractData?.contract_value
                    )}
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
                    defaultValue={formatCurrency(
                      currencyCode,
                      contractData?.termin_value
                    )}
                    disabled
                  />
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="priceStep1" className="col-sm-4 col-form-label">
                  <FormattedMessage id="TITLE.ADDTIONAL_PAYMENT" />
                </label>
                <div className="col-sm-8">
                  {addtionalPayment.length > 0 && (
                    <table className="table table-sm mb-4">
                      <thead>
                        <tr>
                          <th style={{ width: "10%" }}>#</th>
                          <th style={{ width: "50%" }}>
                            <FormattedMessage id="TITLE.DESCRIPTION" />
                          </th>
                          <th style={{ width: "30%" }}>
                            <FormattedMessage id="TITLE.VALUE" />
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {addtionalPayment.map((item, index) => {
                          return (
                            <tr>
                              <td>{index + 1}</td>
                              <td>{item.description}</td>
                              <td>
                                {formatCurrency(currencyCode, item.value)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                  <button
                    type="button"
                    className="btn btn-sm btn-primary w-100"
                    onClick={() => {
                      setModalAddtionalPayment(true);
                    }}
                  >
                    <FormattedMessage id="TITLE.ADD" />
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
                    value={formatCurrency(
                      currencyCode,
                      contractData?.termin_value,
                      totalAddtionalPayment()
                    )}
                    onChange={() => {}}
                    disabled
                  />
                </div>
              </div>
              <div className="form-group row">
                <label
                  htmlFor="priceTaxInvoice"
                  className="col-sm-4 col-form-label"
                >
                  <FormattedMessage id="CONTRACT_DETAIL.TAB.FINE" />
                </label>
                <div className="col-sm-8">
                  <NumberFormat
                    id={
                      isSubmit ||
                      invoiceData?.state === "REJECTED" ||
                      invoiceData?.state === "APPROVED" ||
                      invoiceData === null ||
                      !props.billingStaffStatus
                        ? //   ||
                          //   progressTermin?.ident_name !== "BILLING_SOFTCOPY"
                          "NumberFormat-text"
                        : "NumberFormat-input"
                    }
                    value={invoiceData?.penalty}
                    displayType={
                      isSubmit ||
                      invoiceData?.state === "REJECTED" ||
                      invoiceData?.state === "APPROVED" ||
                      invoiceData === null ||
                      !props.billingStaffStatus
                        ? //   ||
                          //   progressTermin?.ident_name !== "BILLING_SOFTCOPY"
                          "text"
                        : "input"
                    }
                    isAllowed={({ floatValue }) =>
                      floatValue <=
                      contractData["termin_value"] + totalAddtionalPayment()
                    }
                    className="form-control"
                    thousandSeparator={"."}
                    decimalSeparator={","}
                    allowEmptyFormatting={true}
                    allowLeadingZeros={true}
                    prefix={currencySign(currencyCode)}
                    onValueChange={(e) => {
                      setInvoiceData({
                        ...invoiceData,
                        penalty: e.floatValue,
                      });
                    }}
                  />
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="note" className="col-sm-4 col-form-label">
                  <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.INVOICE_DOCUMENT.LATE_DESC" />
                </label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    className="form-control"
                    id="priceStep1"
                    defaultValue={invoiceData?.task?.remarks}
                    disabled
                  />
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="note" className="col-sm-4 col-form-label">
                  <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.INVOICE_DOCUMENT.FINE_DESC" />
                </label>
                <div className="col-sm-8">
                  <textarea
                    rows="4"
                    cols=""
                    className="form-control"
                    id="note"
                    disabled={
                      isSubmit ||
                      invoiceData?.state === "REJECTED" ||
                      invoiceData?.state === "APPROVED" ||
                      invoiceData === null ||
                      !props.billingStaffStatus
                      //   ||
                      //   progressTermin?.ident_name !== "BILLING_SOFTCOPY"
                    }
                    onChange={(e) => {
                      setInvoiceData({
                        ...invoiceData,
                        penalty_remark: e.target.value,
                      });
                    }}
                    value={invoiceData?.penalty_remark}
                  ></textarea>
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
              invoiceData?.state === "REJECTED" ||
              invoiceData?.state === "APPROVED" ||
              invoiceData === null ||
              !props.billingStaffStatus
              //   ||
              //   progressTermin?.ident_name !== "BILLING_SOFTCOPY"
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
              invoiceData?.state === "REJECTED" ||
              invoiceData?.state === "APPROVED" ||
              invoiceData === null ||
              !props.billingStaffStatus
              //   ||
              //   progressTermin?.ident_name !== "BILLING_SOFTCOPY"
            }
            className="btn btn-danger mx-1"
          >
            <FormattedMessage id="TITLE.REJECT_DOCUMENT" />
          </button>
          <div className="my-5 text-center">
            <h6>
              <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.INVOICE_DOCUMENT.HISTORY" />
            </h6>
          </div>

          <TableOnly
            dataHeader={headerTable}
            loading={loading}
            // err={err}
            hecto={10}
          >
            {historyInvoiceData.map((item, index) => {
              return (
                <TableRow key={index.toString()}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.invoice_no}</TableCell>
                  <TableCell>
                    {item?.from_time
                      ? moment(item?.from_time).format("DD MMMM YYYY")
                      : ""}
                  </TableCell>
                  <TableCell>
                    <a
                      onClick={() => {
                        window.open(
                          DEV_NODE + "/invoice/" + item?.file_name,
                          "_blank"
                        );
                      }}
                      href={"#"}
                      // href={getFileInvoice + item.file_name}
                    >
                      {item.file_name}
                    </a>
                  </TableCell>
                  <TableCell>{item.created_by_name}</TableCell>
                  <TableCell>
                    {moment(new Date(item.created_at)).format(
                      "DD MMMM YYYY hh:mm:ss"
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
export default injectIntl(connect(null, null)(ContractInvoicePage));
