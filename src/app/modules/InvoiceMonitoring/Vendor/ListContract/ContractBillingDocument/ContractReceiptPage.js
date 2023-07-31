import React, { useState, useEffect, useCallback } from "react";
import { connect, shallowEqual, useSelector } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
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
  saveReceipt,
  updateReceipt,
  getReceipt,
  getAllApprovedReceipt,
  getAllRejectedReceipt,
  getFileReceipt,
} from "../../../_redux/InvoiceMonitoringCrud";
import useToast from "../../../../../components/toast";
import { useFormik } from "formik";
import * as Yup from "yup";
import { rupiah } from "../../../../../libs/currency";
import { Document, Page } from "react-pdf";
import PerfectScrollbar from "react-perfect-scrollbar";
import { DialogTitleFile } from "../ItemContractInvoice";
import moment from "moment";
import TableOnly from "../../../../../components/tableCustomV1/tableOnly";
import * as invoice from "../../../_redux/InvoiceMonitoringSlice";
import { getInvoicePeriods } from "../../../../Master/service/MasterCrud";
import { DEV_NODE, SOCKET } from "../../../../../../redux/BaseHost";

function ContractReceiptPage(props) {
  const [loading, setLoading] = useState(false);
  const [loadingRcpt, setLoadingRcpt] = useState(false);
  const [contractData, setContractData] = useState({});
  const [uploadFilename, setUploadFilename] = useState("Pilih File");
  const [receiptStatus, setReceiptStatus] = useState(false);
  const [receiptData, setReceiptData] = useState({});
  const [receiptUpdate, setReceiptUpdate] = useState(false);
  const [receiptId, setReceiptId] = useState("");
  const [dialogState, setDialogState] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(null);
  const [historyReceiptData, setHistoryReceiptData] = useState([]);
  const [modalHistory, setModalHistory] = useState(false);
  const [modalHistoryData, setModalHistoryData] = useState({});
  const [invoicePeriodsStatus, setInvoicePeriodsStatus] = useState(false);

  const [Toast, setToast] = useToast();

  const user_id = useSelector(
    (state) => state.auth.user.data.user_id,
    shallowEqual
  );
  let dataFormReceiptVendor = useSelector(
    (state) => state.invoiceMonitoring.dataReceiptVendor,
    shallowEqual
  );
  const contract_id = props.match.params.contract;
  const termin = props.match.params.termin;
  const { intl, classes, supportedFormats, progressTermin } = props;

  const initialValues = {
    draft_no: "",
    receipt_no: "",
    receipt_date: "",
    contract_id: "",
    vendor_id: "",
    term_id: termin,
    payment_value: "",
    file_name: "",
    description: "",
    state: "",
    created_at: "",
    created_by_id: user_id,
    file: "",
  };

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

  const ReceiptSchema = Yup.object().shape({
    file: Yup.mixed()
      .required(
        intl.formatMessage({
          id: "AUTH.VALIDATION.REQUIRED_FIELD",
        })
      )
      .test(
        "fileType",
        intl.formatMessage({
          id: "TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.FILE_TYPE_PDF",
        }),
        (value) => supportedFormats.includes(value?.type)
      ),
    description: Yup.string().required(
      intl.formatMessage({
        id: "AUTH.VALIDATION.REQUIRED_FIELD",
      })
    ),
    receipt_date: Yup.string().required(
      intl.formatMessage({
        id: "AUTH.VALIDATION.REQUIRED_FIELD",
      })
    ),
    receipt_no: Yup.string().required(
      intl.formatMessage({
        id: "AUTH.VALIDATION.REQUIRED_FIELD",
      })
    ),
  });

  const getHistoryReceiptData = useCallback(
    (invoice_id) => {
      getAllRejectedReceipt(invoice_id)
        .then((responseReject) => {
          getAllApprovedReceipt(invoice_id)
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

  const getReceiptData = useCallback(() => {
    setLoadingRcpt(true);
    getReceipt(contract_id, termin)
      .then((response) => {
        if (!response["data"]["data"]) {
          formik.setFieldValue(
            "receipt_no",
            dataFormReceiptVendor.receipt_no
              ? dataFormReceiptVendor.receipt_no
              : ""
          );
          formik.setFieldValue(
            "receipt_date",
            dataFormReceiptVendor.receipt_date
              ? window
                  .moment(new Date(dataFormReceiptVendor.receipt_date))
                  .format("YYYY-MM-DD")
              : ""
          );
          formik.setFieldValue(
            "description",
            dataFormReceiptVendor.description
              ? dataFormReceiptVendor.description
              : ""
          );
          setReceiptData({
            ...receiptData,
            receipt_no: dataFormReceiptVendor.receipt_no
              ? dataFormReceiptVendor.receipt_no
              : "",
            receipt_date: dataFormReceiptVendor.receipt_date
              ? dataFormReceiptVendor.receipt_date
              : "",
            description: dataFormReceiptVendor.description
              ? dataFormReceiptVendor.description
              : "",
          });
          setReceiptStatus(false);
        } else {
          getHistoryReceiptData(response["data"]["data"]["id"]);
          setReceiptId(response["data"]["data"]["id"]);
          formik.setFieldValue(
            "draft_no",
            response["data"]["data"]["receipt_draft_no"]
          );
          if (response["data"]["data"]["state"] === "REJECTED") {
            setReceiptStatus(false);
            setReceiptUpdate(true);
          } else {
            setReceiptStatus(true);
            formik.setFieldValue(
              "receipt_no",
              response["data"]["data"]["receipt_no"]
            );
            formik.setFieldValue(
              "receipt_date",
              response["data"]["data"]["receipt_date"]
                ? window
                    .moment(new Date(response["data"]["data"]["receipt_date"]))
                    .format("YYYY-MM-DD")
                : ""
            );
            formik.setFieldValue(
              "description",
              response["data"]["data"]["description"]
            );
            formik.setFieldValue(
              "file_name",
              response["data"]["data"]["file_name"]
            );
            setUploadFilename(response["data"]["data"]["file_name"]);
            setReceiptData(response["data"]["data"]);
          }
        }
        setLoadingRcpt(false);
      })
      .catch((error) => {
        setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 10000);
        setLoadingRcpt(false);
      });
  }, [contract_id, termin, getHistoryReceiptData, formik, intl, setToast]);

  const formik = useFormik({
    initialValues,
    validationSchema: ReceiptSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      setReceiptStatus(true);
      var data = new FormData();
      for (var key in values) {
        data.append(key, values[key]);
      }
      if (receiptUpdate) {
        updateReceipt(receiptId, data)
          .then((response) => {
            getReceipt(contract_id, termin).then((responses) => {
              props.set_data_receipt_vendor({});
              setReceiptData(responses["data"]["data"]);
              setUploadFilename(responses["data"]["data"]["file_name"]);
              setToast(intl.formatMessage({ id: "REQ.UPDATE_SUCCESS" }), 10000);
              SOCKET.emit("send_notif");
              setLoading(false);
            });
          })
          .catch((error) => {
            setToast(intl.formatMessage({ id: "REQ.UPDATE_FAILED" }), 10000);
            setLoading(false);
            setReceiptStatus(false);
          });
      } else {
        saveReceipt(data)
          .then((response) => {
            props.set_data_receipt_vendor({});
            setToast(intl.formatMessage({ id: "REQ.UPDATE_SUCCESS" }), 10000);
            setLoading(false);
            setReceiptData(response["data"]["data"]);
            setUploadFilename(response["data"]["data"]["file_name"]);
            SOCKET.emit("send_notif");
          })
          .catch((error) => {
            setToast(intl.formatMessage({ id: "REQ.UPDATE_FAILED" }), 10000);
            setLoading(false);
            setReceiptStatus(false);
          });
      }
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
        formik.setFieldValue("contract_id", response["data"]["data"]["id"]);
        formik.setFieldValue(
          "vendor_id",
          response["data"]["data"]["vendor_id"]
        );
        formik.setFieldValue(
          "payment_value",
          response["data"]["data"]["termin_value"]
        );
      })
      .catch((error) => {
        setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 10000);
      });
  }, [contract_id, formik, intl, setToast, user_id]);

  const handleUpload = (e) => {
    if (e.currentTarget.files.length) {
      setUploadFilename(e.currentTarget.files[0].name);
    } else {
      setUploadFilename(
        intl.formatMessage({
          id: "TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.DEFAULT_FILENAME",
        })
      );
    }
    formik.setTouched({ ...formik.touched, file: true });
    formik.setFieldValue("file_name", e.currentTarget.files[0]?.name);
    formik.setFieldValue("file", e.currentTarget.files[0]);
  };

  const handleDate = (e) => {
    formik.setFieldValue("receipt_date", e.target.value);
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handleHistory = (index) => {
    setModalHistoryData(historyReceiptData[index]);
    setModalHistory(true);
  };

  const getInvoicePeriodsData = useCallback(() => {
    getInvoicePeriods()
      .then((response) => {
        const day_now = moment(new Date()).format("D");
        if (
          parseInt(response["data"]["data"][0]["accepted_thru_day"]) >=
          parseInt(response["data"]["data"][0]["accepted_from_day"])
        ) {
          setInvoicePeriodsStatus(
            day_now >=
              parseInt(response["data"]["data"][0]["accepted_from_day"]) &&
              day_now <=
                parseInt(response["data"]["data"][0]["accepted_thru_day"])
          );
        } else {
          setInvoicePeriodsStatus(
            day_now >=
              parseInt(response["data"]["data"][0]["accepted_from_day"]) ||
              day_now <=
                parseInt(response["data"]["data"][0]["accepted_thru_day"])
          );
        }
      })
      .catch((error) => {
        setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 10000);
      });
  }, [intl, setToast]);

  useEffect(getContractData, []);
  useEffect(getReceiptData, []);
  useEffect(getInvoicePeriodsData, []);

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
      <Card>
        <form noValidate autoComplete="off" onSubmit={formik.handleSubmit}>
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
                    htmlFor="numberReceipt"
                    className="col-sm-4 col-form-label"
                  >
                    <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.RECEIPT_DOCUMENT.RECEIPT_NUMBER" />
                    <span className="text-danger">*</span>
                  </label>
                  <div className="col-sm-8">
                    <input
                      type="text"
                      className="form-control"
                      id="numberReceipt"
                      disabled={
                        loading ||
                        receiptStatus ||
                        (!invoicePeriodsStatus && !historyReceiptData)
                      }
                      {...formik.getFieldProps("receipt_no")}
                      onChange={(e) => {
                        dataFormReceiptVendor.receipt_no = e.target.value;
                        props.set_data_receipt_vendor(dataFormReceiptVendor);
                        formik.setFieldValue("receipt_no", e.target.value);
                      }}
                    />
                  </div>
                  {formik.touched.receipt_no && formik.errors.receipt_no ? (
                    <span className="col-sm-8 offset-sm-4 text-left text-danger">
                      {formik.errors.receipt_no}
                    </span>
                  ) : null}
                </div>
                <div className="form-group row">
                  <label
                    htmlFor="dateReceipt"
                    className="col-sm-4 col-form-label"
                  >
                    <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.RECEIPT_DOCUMENT.RECEIPT_DATE" />
                    <span className="text-danger">*</span>
                  </label>
                  <div className="col-sm-8">
                    <input
                      type="date"
                      className="form-control"
                      id="dateReceipt"
                      disabled={
                        loading ||
                        receiptStatus ||
                        (!invoicePeriodsStatus && !historyReceiptData)
                      }
                      {...formik.getFieldProps("receipt_date")}
                      onChange={(e) => {
                        dataFormReceiptVendor.receipt_date = window
                          .moment(new Date(e.target.value))
                          .format("YYYY-MM-DD");
                        props.set_data_receipt_vendor(dataFormReceiptVendor);
                        formik.setFieldValue(
                          "receipt_date",
                          window
                            .moment(new Date(e.target.value))
                            .format("YYYY-MM-DD")
                        );
                      }}
                    />
                  </div>
                  {formik.touched.receipt_date && formik.errors.receipt_date ? (
                    <span className="col-sm-8 offset-sm-4 text-left text-danger">
                      {formik.errors.receipt_date}
                    </span>
                  ) : null}
                </div>
                <div className="form-group row">
                  <label htmlFor="note" className="col-sm-4 col-form-label">
                    <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.DESCRIPTION" />
                    <span className="text-danger">*</span>
                  </label>
                  <div className="col-sm-8">
                    <textarea
                      rows="4"
                      cols=""
                      className="form-control"
                      id="note"
                      disabled={
                        loading ||
                        receiptStatus ||
                        (!invoicePeriodsStatus && !historyReceiptData)
                      }
                      {...formik.getFieldProps("description")}
                      onChange={(e) => {
                        dataFormReceiptVendor.description = e.target.value;
                        props.set_data_receipt_vendor(dataFormReceiptVendor);
                        formik.setFieldValue("description", e.target.value);
                      }}
                    ></textarea>
                  </div>
                  {formik.touched.description && formik.errors.description ? (
                    <span className="col-sm-8 offset-sm-4 text-left text-danger">
                      {formik.errors.description}
                    </span>
                  ) : null}
                </div>
                <div className="form-group row">
                  <label htmlFor="upload" className="col-sm-4 col-form-label">
                    <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.RECEIPT_DOCUMENT.RECEIPT_UPLOAD" />
                    <span className="text-danger">*</span>
                  </label>
                  <label
                    htmlFor="upload"
                    className={`input-group mb-3 col-sm-8 ${
                      receiptStatus ||
                      (!invoicePeriodsStatus
                        ? ""
                        : "pointer" && !historyReceiptData)
                    }`}
                  >
                    {!receiptStatus && (
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <i className="fas fa-file-upload"></i>
                        </span>
                      </div>
                    )}
                    <span
                      className={`form-control text-truncate ${
                        receiptStatus ||
                        (!invoicePeriodsStatus
                          ? classes.textDisabled
                          : "" && !historyReceiptData)
                      }`}
                    >
                      {uploadFilename}
                    </span>
                    {receiptStatus && (
                      <div className="input-group-append pointer">
                        <span
                          className={`input-group-text ${classes.textHover}`}
                        >
                          <a
                            // download={receiptData?.file_name}
                            // href={receiptData?.file}
                            onClick={() => {
                              window.open(
                                DEV_NODE + "/receipt/" + receiptData?.file_name,
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
                    )}
                  </label>
                  {formik.touched.file && formik.errors.file ? (
                    <span className="col-sm-8 offset-sm-4 text-left text-danger">
                      {formik.errors.file}
                    </span>
                  ) : null}
                  <input
                    type="file"
                    className="d-none"
                    id="upload"
                    disabled={
                      loading ||
                      receiptStatus ||
                      (!invoicePeriodsStatus && !historyReceiptData)
                    }
                    onChange={(e) => handleUpload(e)}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group row">
                  <label
                    htmlFor="priceContract"
                    className="col-sm-5 col-form-label"
                  >
                    <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.CONTRACT_AMMOUNT" />
                  </label>
                  <div className="col-sm-7">
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
                  <label htmlFor="poNumber" className="col-sm-5 col-form-label">
                    <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.PO_NUMBER" />
                  </label>
                  <div className="col-sm-7">
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
                  <label
                    htmlFor="priceStep1"
                    className="col-sm-5 col-form-label"
                  >
                    <FormattedMessage
                      id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.TERMIN_VALUE"
                      values={{ termin: contractData["termin_name"] }}
                    />
                  </label>
                  <div className="col-sm-7">
                    <input
                      type="text"
                      className="form-control"
                      id="priceStep1"
                      defaultValue={contractData["termin_value_new"]}
                      disabled
                    />
                  </div>
                </div>
                {/* <div className="form-group row">
                  <label
                    htmlFor="priceTaxInvoice"
                    className="col-sm-5 col-form-label"
                  >
                    <FormattedMessage
                      id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.TERMIN_VALUE_PPN"
                      values={{ termin: contractData["termin_name"] }}
                    />
                  </label>
                  <div className="col-sm-7">
                    <input
                      type="text"
                      className="form-control"
                      id="priceTaxReceipt"
                      defaultValue={contractData["termin_value_ppn_new"]}
                      disabled
                    />
                  </div>
                </div> */}
              </div>
            </div>
          </CardBody>
          <CardFooter className="text-right">
            <button
              type="submit"
              className="btn btn-primary mx-1"
              disabled={
                loading ||
                (formik.touched && !formik.isValid) ||
                receiptStatus ||
                (!invoicePeriodsStatus && !historyReceiptData)
              }
            >
              <FormattedMessage id="TITLE.SAVE" />
              {loading && (
                <span
                  className="spinner-border spinner-border-sm ml-1"
                  aria-hidden="true"
                ></span>
              )}
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
                      <a href={getFileReceipt + item.file_name}>
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
        </form>
      </Card>
    </React.Fragment>
  );
}
export default injectIntl(connect(null, invoice.actions)(ContractReceiptPage));
