import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  TableRow,
  TableCell,
} from "@material-ui/core";
import { connect, shallowEqual, useSelector } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import {
  Card,
  CardBody,
  CardFooter,
} from "../../../../../../_metronic/_partials/controls";
import {
  getContractSummary,
  saveInvoice,
  getInvoice,
  updateInvoice,
  getAllRejectedInvoice,
  getFileInvoice,
  getAllApprovedInvoice,
  getTax,
} from "../../../_redux/InvoiceMonitoringCrud";
import useToast from "../../../../../components/toast";
import { useFormik } from "formik";
import * as Yup from "yup";
import { rupiah } from "../../../../../libs/currency";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-perfect-scrollbar/dist/css/styles.css";
import { Document, Page } from "react-pdf";
import PerfectScrollbar from "react-perfect-scrollbar";
import { DialogTitleFile } from "../ItemContractInvoice";
import moment from "moment";
import TableOnly from "../../../../../components/tableCustomV1/tableOnly";
import * as invoice from "../../../_redux/InvoiceMonitoringSlice";
import {
  getInvoicePeriods
} from "../../../../Master/service/MasterCrud";
import { SOCKET } from "../../../../../../redux/BaseHost";

function ContractInvoicePage(props) {
  const [loading, setLoading] = useState(false);
  const [contractData, setContractData] = useState({});
  const [uploadFilename, setUploadFilename] = useState("Pilih File");
  const [invoiceStatus, setInvoiceStatus] = useState(false);
  const [invoiceData, setInvoiceData] = useState({});
  const [invoiceUpdate, setInvoiceUpdate] = useState(false);
  const [invoiceId, setInvoiceId] = useState("");
  const [dialogState, setDialogState] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(null);
  const [historyInvoiceData, setHistoryInvoiceData] = useState([]);
  const [modalHistory, setModalHistory] = useState(false);
  const [modalHistoryData, setModalHistoryData] = useState({});
  const [invoicePeriodsStatus, setInvoicePeriodsStatus] = useState(false);

  const [Toast, setToast] = useToast();

  const user_id = useSelector(
    (state) => state.auth.user.data.user_id,
    shallowEqual
  );
  let dataFormInvoice = useSelector(
    (state) => state.invoiceMonitoring.dataInvoiceVendor,
    shallowEqual
  );
  const contract_id = props.match.params.contract;
  const termin = props.match.params.termin;
  const { intl, classes, supportedFormats, progressTermin } = props;

  const initialValues = {
    draft_no: "",
    invoice_no: "",
    from_time: "",
    purch_order_no: "",
    contract_id: "",
    plant_id: "",
    purch_group_id: "",
    plant_id2: "",
    purch_group_id2: "",
    vendor_id: "",
    contract_value: "",
    currency_id: "",
    invoice_value: "",
    description: "",
    file_name: "",
    created_at: "",
    created_by_id: user_id,
    file: "",
    invoice_term_id: termin,
    tax_bool: false,
    tax_date: new Date(Date.now()),
    tax_date_yesterday: new Date(Date.now() - 86400000),
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

  const InvoiceSchema = Yup.object().shape({
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
    from_time: Yup.date()
      .required(
        intl.formatMessage({
          id: "AUTH.VALIDATION.REQUIRED_FIELD",
        })
      )
      .when("tax_bool", {
        is: true,
        then: Yup.date()
          .min(
            Yup.ref("tax_date_yesterday"),
            intl.formatMessage({
              id:
                "TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.INVOICE_DOCUMENT.DATE_VALIDATION",
            })
          )
          .max(
            Yup.ref("tax_date"),
            intl.formatMessage({
              id:
                "TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.INVOICE_DOCUMENT.DATE_VALIDATION",
            })
          ),
      }),
    invoice_no: Yup.string().required(
      intl.formatMessage({
        id: "AUTH.VALIDATION.REQUIRED_FIELD",
      })
    ),
  });

  const formik = useFormik({
    initialValues,
    validationSchema: InvoiceSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      setInvoiceStatus(true);
      var data = new FormData();
      for (var key in values) {
        data.append(key, values[key]);
      }
      if (invoiceUpdate) {
        updateInvoice(invoiceId, data)
          .then((response) => {
            getInvoice(contract_id, termin).then((responses) => {
              props.set_data_invoice_vendor({});
              setInvoiceData(responses["data"]["data"]);
              formik.setFieldValue(
                "from_time",
                responses["data"]["data"]["from_time"]
                  ? window
                    .moment(new Date(responses["data"]["data"]["from_time"]))
                    .format("YYYY-MM-DD")
                  : ""
              );
              setUploadFilename(responses["data"]["data"]["file_name"]);
              setToast(intl.formatMessage({ id: "REQ.UPDATE_SUCCESS" }), 10000);
              SOCKET.emit('get_all_notification', user_id);
              setLoading(false);
            });
          })
          .catch((error) => {
            setToast(intl.formatMessage({ id: "REQ.UPDATE_FAILED" }), 10000);
            setLoading(false);
            setInvoiceStatus(false);
          });
      } else {
        saveInvoice(data)
          .then((response) => {
            props.set_data_invoice_vendor({});
            setToast(intl.formatMessage({ id: "REQ.UPDATE_SUCCESS" }), 10000);
            setLoading(false);
            setInvoiceData(response["data"]["data"]);
            formik.setFieldValue(
              "from_time",
              response["data"]["data"]["from_time"]
                ? window
                  .moment(new Date(response["data"]["data"]["from_time"]))
                  .format("YYYY-MM-DD")
                : ""
            );
            setUploadFilename(response["data"]["data"]["file_name"]);
            SOCKET.emit('get_all_notification', user_id);
          })
          .catch((error) => {
            setToast(intl.formatMessage({ id: "REQ.UPDATE_FAILED" }), 10000);
            setLoading(false);
            setInvoiceStatus(false);
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
        formik.setFieldValue(
          "purch_order_no",
          response["data"]["data"]["purch_order_no"]
        );
        formik.setFieldValue("contract_id", response["data"]["data"]["id"]);
        formik.setFieldValue("plant_id", response["data"]["data"]["plant_id"]);
        formik.setFieldValue(
          "purch_group_id",
          response["data"]["data"]["purch_group_id"]
        );
        formik.setFieldValue(
          "plant_id2",
          response["data"]["data"]["plant_id2"]
        );
        formik.setFieldValue(
          "purch_group_id2",
          response["data"]["data"]["purch_group_id2"]
        );
        formik.setFieldValue(
          "contract_value",
          response["data"]["data"]["contract_value"]
        );
        formik.setFieldValue(
          "vendor_id",
          response["data"]["data"]["vendor_id"]
        );
        formik.setFieldValue(
          "currency_id",
          response["data"]["data"]["currency_id"]
        );
        formik.setFieldValue(
          "invoice_value",
          response["data"]["data"]["termin_value"]
        );
      })
      .catch((error) => {
        setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 10000);
      });
  }, [contract_id, formik, intl, setToast, user_id]);

  const gethistoryInvoiceData = useCallback(
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

  const getInvoiceData = useCallback(() => {
    getInvoice(contract_id, termin)
      .then((response) => {
        if (!response["data"]["data"]) {
          formik.setFieldValue(
            "invoice_no",
            dataFormInvoice.invoice_no ? dataFormInvoice.invoice_no : ""
          );
          formik.setFieldValue(
            "from_time",
            dataFormInvoice.from_time
              ? window
                .moment(new Date(dataFormInvoice.from_time))
                .format("YYYY-MM-DD")
              : ""
          );
          formik.setFieldValue(
            "description",
            dataFormInvoice.description ? dataFormInvoice.description : ""
          );
          setInvoiceData({
            ...invoiceData,
            invoice_no: dataFormInvoice.invoice_no
              ? dataFormInvoice.invoice_no
              : "",
            from_time: dataFormInvoice.from_time
              ? dataFormInvoice.from_time
              : "",
            description: dataFormInvoice.description
              ? dataFormInvoice.description
              : "",
          });
          setInvoiceStatus(false);
        } else {
          gethistoryInvoiceData(response["data"]["data"]["id"]);
          setInvoiceId(response["data"]["data"]["id"]);
          formik.setFieldValue(
            "draft_no",
            response["data"]["data"]["invoice_draft_no"]
          );
          if (response["data"]["data"]["state"] === "REJECTED") {
            setInvoiceStatus(false);
            setInvoiceUpdate(true);
          } else {
            setInvoiceStatus(true);
            formik.setFieldValue(
              "invoice_no",
              response["data"]["data"]["invoice_no"]
            );
            formik.setFieldValue(
              "invoice_date",
              response["data"]["data"]["invoice_date"]
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
            setInvoiceData(response["data"]["data"]);
            formik.setFieldValue(
              "from_time",
              response["data"]["data"]["from_time"]
                ? window
                  .moment(new Date(response["data"]["data"]["from_time"]))
                  .format("YYYY-MM-DD")
                : ""
            );
          }
        }
      })
      .catch((error) => {
        setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 10000);
      });
  }, [contract_id, termin, gethistoryInvoiceData, formik, intl, setToast]);

  const getTaxData = useCallback(() => {
    getTax(contract_id, termin)
      .then((response) => {
        if (
          response.data.data?.state == "PENDING" ||
          response.data.data?.state == "APPROVED"
        ) {
          formik.setFieldValue(
            "tax_date",
            new Date(response.data.data.tax_date)
          );
          var d = new Date(response.data.data.tax_date);
          d.setDate(d.getDate() - 1);
          formik.setFieldValue("tax_date_yesterday", new Date(d));
          formik.setFieldValue("tax_bool", true);
        }
      })
      .catch((error) => {
        setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 10000);
      });
  }, [contract_id, formik, intl, setToast]);

  const getInvoicePeriodsData = useCallback(() => {
    getInvoicePeriods()
      .then((response) => {
        const day_now = moment(new Date()).format('D')
        if (parseInt(response["data"]["data"][0]["accepted_thru_day"]) >= parseInt(response["data"]["data"][0]["accepted_from_day"])) {
          setInvoicePeriodsStatus(day_now >= parseInt(response["data"]["data"][0]["accepted_from_day"]) && day_now <= parseInt(response["data"]["data"][0]["accepted_thru_day"]))
        } else {
          setInvoicePeriodsStatus(day_now >= parseInt(response["data"]["data"][0]["accepted_from_day"]) || day_now <= parseInt(response["data"]["data"][0]["accepted_thru_day"]))
        }
      })
      .catch((error) => {
        setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 10000);
      });
  }, [intl, setToast]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

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
    formik.setFieldValue("from_time", new Date(e.target.value));
    // var date = new Date(e.target.value)
    // date.setMonth(date.getMonth() + 1)
    // formik.setFieldValue('thru_time', date.toISOString().split('T')[0])
  };

  const handleHistory = (index) => {
    setModalHistoryData(historyInvoiceData[index]);
    setModalHistory(true);
  };

  useEffect(getContractData, []);
  useEffect(getInvoiceData, []);
  useEffect(getTaxData, []);
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
            <div className="row">
              <div className="col-md-6">
                <div className="form-group row">
                  <label
                    htmlFor="numberInvoice"
                    className="col-sm-4 col-form-label"
                  >
                    <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.INVOICE_DOCUMENT.INVOICE_NUMBER" />
                    <span className="text-danger">*</span>
                  </label>
                  <div className="col-sm-8">
                    <input
                      type="text"
                      className="form-control"
                      id="numberInvoice"
                      disabled={
                        (loading ||
                          invoiceStatus ||
                          progressTermin?.ident_name !== "BILLING_SOFTCOPY") ||
                        !invoicePeriodsStatus
                      }
                      defaultValue={
                        invoiceData ? invoiceData["invoice_no"] : null
                      }
                      {...formik.getFieldProps("invoice_no")}
                      onChange={(e) => {
                        dataFormInvoice.invoice_no = e.target.value;
                        props.set_data_invoice_vendor(dataFormInvoice);
                        formik.setFieldValue("invoice_no", e.target.value);
                      }}
                    />
                  </div>
                  {formik.touched.invoice_no && formik.errors.invoice_no ? (
                    <span className="col-sm-8 offset-sm-4 text-left text-danger">
                      {formik.errors.invoice_no}
                    </span>
                  ) : null}
                </div>
                <div className="form-group row">
                  <label
                    htmlFor="dateInvoice"
                    className="col-sm-4 col-form-label"
                  >
                    <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.INVOICE_DOCUMENT.INVOICE_DATE" />
                    <span className="text-danger">*</span>
                  </label>
                  <div className="col-sm-8">
                    <input
                      type="date"
                      className="form-control"
                      id="dateInvoice"
                      disabled={
                        (loading ||
                          invoiceStatus ||
                          progressTermin?.ident_name !== "BILLING_SOFTCOPY") ||
                        !invoicePeriodsStatus
                      }
                      onBlur={formik.handleBlur}
                      {...formik.getFieldProps("from_time")}
                      onChange={(e) => {
                        dataFormInvoice.from_time = window
                          .moment(new Date(e.target.value))
                          .format("YYYY-MM-DD");
                        props.set_data_invoice_vendor(dataFormInvoice);
                        formik.setFieldValue(
                          "from_time",
                          window
                            .moment(new Date(e.target.value))
                            .format("YYYY-MM-DD")
                        );
                      }}
                    />
                  </div>
                  {formik.touched.from_time && formik.errors.from_time ? (
                    <span className="col-sm-8 offset-sm-4 text-left text-danger">
                      {formik.errors.from_time}
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
                        (loading ||
                          invoiceStatus ||
                          progressTermin?.ident_name !== "BILLING_SOFTCOPY") ||
                        !invoicePeriodsStatus
                      }
                      defaultValue={
                        invoiceData ? invoiceData["description"] : null
                      }
                      {...formik.getFieldProps("description")}
                      onChange={(e) => {
                        dataFormInvoice.description = e.target.value;
                        props.set_data_invoice_vendor(dataFormInvoice);
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
                    <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.INVOICE_DOCUMENT.INVOICE_UPLOAD" />
                    <span className="text-danger">*</span>
                  </label>
                  <label
                    htmlFor="upload"
                    className={`input-group mb-3 col-sm-8 ${(invoiceStatus ||
                      progressTermin?.ident_name !== "BILLING_SOFTCOPY") ||
                      !invoicePeriodsStatus ? ""
                      : "pointer"
                      }`}
                  >
                    {!invoiceStatus && (
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <i className="fas fa-file-upload"></i>
                        </span>
                      </div>
                    )}
                    <span
                      className={`form-control text-truncate ${(invoiceStatus ||
                        progressTermin?.ident_name !== "BILLING_SOFTCOPY") ||
                        !invoicePeriodsStatus ? classes.textDisabled
                        : ""
                        }`}
                    >
                      {uploadFilename}
                    </span>
                    {invoiceStatus && (
                      <div className="input-group-append pointer">
                        <span
                          className={`input-group-text ${classes.textHover}`}
                        >
                          <a
                            download={invoiceData?.file_name}
                            href={invoiceData?.file}
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
                      (loading ||
                        invoiceStatus ||
                        progressTermin?.ident_name !== "BILLING_SOFTCOPY") ||
                      !invoicePeriodsStatus
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
                      id="priceTaxInvoice"
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
                (formik.touched && !formik.isValid) ||
                (loading ||
                  invoiceStatus ||
                  progressTermin?.ident_name !== "BILLING_SOFTCOPY") ||
                !invoicePeriodsStatus
              }
            >
              <FormattedMessage id="TITLE.UPLOAD" />
              {loading && (
                <span
                  className="spinner-border spinner-border-sm ml-1"
                  aria-hidden="true"
                ></span>
              )}
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
                    <TableCell>{item.from_time}</TableCell>
                    <TableCell>
                      <a href={getFileInvoice + item.file_name}>
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
        </form>
      </Card>
    </React.Fragment>
  );
}
export default injectIntl(connect(null, invoice.actions)(ContractInvoicePage));
