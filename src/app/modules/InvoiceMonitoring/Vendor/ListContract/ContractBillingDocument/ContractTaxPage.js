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
  TableRow,
  TableCell,
} from "@material-ui/core";
import {
  getContractSummary,
  saveTax,
  updateTax,
  getTax,
  getAllApprovedTax,
  getAllRejectedTax,
  getFileTax,
  getInvoice,
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
import NumberFormat from "react-number-format";

function ContractTaxPage(props) {
  const [loading, setLoading] = useState(false);
  const [contractData, setContractData] = useState({});
  const [uploadFilename, setUploadFilename] = useState("Pilih File");
  const [taxStatus, setTaxStatus] = useState(false);
  const [taxData, setTaxData] = useState({});
  const [taxUpdate, setTaxUpdate] = useState(false);
  const [taxId, setTaxId] = useState("");
  const [dialogState, setDialogState] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(null);
  const [historyTaxData, setHistoryTaxData] = useState([]);
  const [modalHistory, setModalHistory] = useState(false);
  const [modalHistoryData, setModalHistoryData] = useState({});

  const [Toast, setToast] = useToast();

  const user_id = useSelector(
    (state) => state.auth.user.data.user_id,
    shallowEqual
  );
  const contract_id = props.match.params.contract;
  const termin = props.match.params.termin;
  const { intl, classes, supportedFormats, progressTermin } = props;

  const initialValues = {
    draft_no: "",
    tax_no: "",
    tax_date: "",
    contract_id: "",
    vendor_id: "",
    term: termin,
    npwp: "",
    payment_value: "",
    file_name: "",
    description: "",
    created_at: "",
    created_by_id: user_id,
    file: "",
    invoice_bool: false,
    invoice_date: new Date(Date.now()),
  };

  const headerTable = [
    {
      title: intl.formatMessage({
        id: "TITLE.TABLE_HEADER.NO",
      }),
    },
    {
      title: intl.formatMessage({
        id: "TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.TAX_DOCUMENT.TAX_NUMBER",
      }),
    },
    {
      title: intl.formatMessage({
        id: "TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.TAX_DOCUMENT.TAX_DATE",
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

  const TaxSchema = Yup.object().shape({
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
    tax_date: Yup.date()
      .required(
        intl.formatMessage({
          id: "AUTH.VALIDATION.REQUIRED_FIELD",
        })
      )
      .when("invoice_bool", {
        is: true,
        then: Yup.date()
          .min(
            Yup.ref("invoice_date"),
            intl.formatMessage({
              id:
                "TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.TAX_DOCUMENT.DATE_VALIDATION",
            })
          )
          .max(
            Yup.ref("invoice_date"),
            intl.formatMessage({
              id:
                "TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.TAX_DOCUMENT.DATE_VALIDATION",
            })
          ),
      }),
    tax_no: Yup.string().required(
      intl.formatMessage({
        id: "AUTH.VALIDATION.REQUIRED_FIELD",
      })
    ),
    npwp: Yup.string().required(
      intl.formatMessage({
        id: "AUTH.VALIDATION.REQUIRED_FIELD",
      })
    ),
  });

  const formik = useFormik({
    initialValues,
    validationSchema: TaxSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      setTaxStatus(true);
      var data = new FormData();
      for (var key in values) {
        data.append(key, values[key]);
      }
      if (taxUpdate) {
        updateTax(taxId, data)
          .then((response) => {
            getTax(contract_id, termin).then((responses) => {
              setTaxData(responses["data"]["data"]);
              setUploadFilename(responses["data"]["data"]["file_name"]);
              setToast(intl.formatMessage({ id: "REQ.UPDATE_SUCCESS" }), 10000);
              setLoading(false);
            });
          })
          .catch((error) => {
            setToast(intl.formatMessage({ id: "REQ.UPDATE_FAILED" }), 10000);
            setLoading(false);
            setTaxStatus(false);
          });
      } else {
        saveTax(data)
          .then((response) => {
            setToast(intl.formatMessage({ id: "REQ.UPDATE_SUCCESS" }), 10000);
            setLoading(false);
            setTaxData(response["data"]["data"]);
            setUploadFilename(response["data"]["data"]["file_name"]);
          })
          .catch((error) => {
            setToast(intl.formatMessage({ id: "REQ.UPDATE_FAILED" }), 10000);
            setLoading(false);
            setTaxStatus(false);
          });
      }
    },
  });

  const getHistoryTaxData = useCallback(
    (invoice_id) => {
      getAllRejectedTax(invoice_id)
        .then((responseReject) => {
          getAllApprovedTax(invoice_id)
            .then((responseApprove) => {
              setHistoryTaxData([
                ...responseReject["data"]["data"],
                ...responseApprove["data"]["data"],
              ]);
            })
            .catch((error) => {
              setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 10000);
            });
          // setHistoryTaxData(response['data']['data'])
        })
        .catch((error) => {
          setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 10000);
        });
    },
    [intl, setToast]
  );

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
  }, [contract_id, termin, formik, intl, setToast, user_id]);

  const getTaxData = useCallback(() => {
    getTax(contract_id, termin)
      .then((response) => {
        if (!response["data"]["data"]) {
          setTaxStatus(false);
        } else {
          getHistoryTaxData(response["data"]["data"]["id"]);
          setTaxId(response["data"]["data"]["id"]);
          formik.setFieldValue(
            "draft_no",
            response["data"]["data"]["tax_draft_no"]
          );
          if (response["data"]["data"]["state"] === "REJECTED") {
            setTaxStatus(false);
            setTaxUpdate(true);
          } else {
            setTaxStatus(true);
            formik.setFieldValue("tax_no", response["data"]["data"]["tax_no"]);
            formik.setFieldValue(
              "tax_date",
              response["data"]["data"]["tax_date"]
            );
            formik.setFieldValue("npwp", response["data"]["data"]["npwp"]);
            formik.setFieldValue(
              "description",
              response["data"]["data"]["description"]
            );
            formik.setFieldValue(
              "file_name",
              response["data"]["data"]["file_name"]
            );
            setUploadFilename(response["data"]["data"]["file_name"]);
            setTaxData(response["data"]["data"]);
          }
        }
      })
      .catch((error) => {
        setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 10000);
      });
  }, [contract_id, termin, getHistoryTaxData, formik, intl, setToast]);

  const getInvoiceData = useCallback(() => {
    getInvoice(contract_id, termin)
      .then((response) => {
        if (
          response.data.data?.state == "PENDING" ||
          response.data.data?.state == "APPROVED"
        ) {
          formik.setFieldValue(
            "invoice_date",
            new Date(response.data.data.from_time)
          );
          formik.setFieldValue("invoice_bool", true);
        }
      })
      .catch((error) => {
        setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 10000);
      });
  }, [contract_id, termin, formik, intl, setToast]);

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
    formik.setFieldValue("tax_date", new Date(e.target.value));
  };

  const handleHistory = (index) => {
    setModalHistoryData(historyTaxData[index]);
    setModalHistory(true);
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  useEffect(getContractData, []);
  useEffect(getTaxData, []);
  useEffect(getInvoiceData, []);

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
                file={taxData?.file}
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
          <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.TAX_DOCUMENT.DETAIL_HISTORY" />
        </DialogTitle>
        <PerfectScrollbar>
          <DialogContent>
            <div className="form-group row mb-0">
              <label className="col-sm-3 col-form-label">
                <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.TAX_DOCUMENT.TAX_NUMBER" />
              </label>
              <div className="col-sm-9">
                <span className="form-control-plaintext">
                  : {modalHistoryData["tax_no"]}
                </span>
              </div>
            </div>
            <div className="form-group row mb-0">
              <label className="col-sm-3 col-form-label">
                <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.TAX_DOCUMENT.TAX_DATE" />
              </label>
              <div className="col-sm-9">
                <span className="form-control-plaintext">
                  :{" "}
                  {moment(new Date(modalHistoryData["tax_date"])).format(
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
                    htmlFor="numberTax"
                    className="col-sm-4 col-form-label"
                  >
                    <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.TAX_DOCUMENT.TAX_NUMBER" />
                  </label>
                  <div className="col-sm-8">
                    <input
                      type="text"
                      className="form-control"
                      id="numberTax"
                      disabled={loading || taxStatus}
                      {...formik.getFieldProps("tax_no")}
                    />
                  </div>
                  {formik.touched.tax_no && formik.errors.tax_no ? (
                    <span className="col-sm-8 offset-sm-4 text-left text-danger">
                      {formik.errors.tax_no}
                    </span>
                  ) : null}
                </div>
                <div className="form-group row">
                  <label htmlFor="dateTax" className="col-sm-4 col-form-label">
                    <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.TAX_DOCUMENT.TAX_DATE" />
                  </label>
                  <div className="col-sm-8">
                    <input
                      type="date"
                      className="form-control"
                      id="dateTax"
                      disabled={loading || taxStatus}
                      onBlur={formik.handleBlur}
                      defaultValue={taxData ? taxData["tax_date"] : null}
                      onChange={(e) => handleDate(e)}
                    />
                  </div>
                  {formik.touched.dateTax && formik.errors.tax_date ? (
                    <span className="col-sm-8 offset-sm-4 text-left text-danger">
                      {formik.errors.tax_date}
                    </span>
                  ) : null}
                </div>
                <div className="form-group row">
                  <label htmlFor="npwpTax" className="col-sm-4 col-form-label">
                    <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.TAX_DOCUMENT.TAX_NPWP" />
                  </label>
                  <div className="col-sm-8">
                    <NumberFormat
                      id={
                        loading || taxStatus
                          ? "NumberFormat-text"
                          : "NumberFormat-input"
                      }
                      value={taxData?.npwp}
                      displayType={loading || taxStatus ? "text" : "input"}
                      className="form-control"
                      format="##.###.###.#-###.###"
                      mask="_"
                      allowEmptyFormatting={true}
                      allowLeadingZeros={true}
                      onValueChange={(e) => {
                        console.log(e);
                        formik.setFieldValue("npwp", e.floatValue);
                      }}
                    />
                  </div>
                  {formik.touched.npwp && formik.errors.npwp ? (
                    <span className="col-sm-8 offset-sm-4 text-left text-danger">
                      {formik.errors.npwp}
                    </span>
                  ) : null}
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
                      disabled={loading || taxStatus}
                      {...formik.getFieldProps("description")}
                    ></textarea>
                  </div>
                  {formik.touched.tax_date && formik.errors.tax_date ? (
                    <span className="col-sm-8 offset-sm-4 text-left text-danger">
                      {formik.errors.tax_date}
                    </span>
                  ) : null}
                </div>
                <div className="form-group row">
                  <label htmlFor="upload" className="col-sm-4 col-form-label">
                    <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.TAX_DOCUMENT.TAX_UPLOAD" />
                  </label>
                  <label
                    htmlFor="upload"
                    className={`input-group mb-3 col-sm-8 ${
                      !taxStatus ? "pointer" : ""
                    }`}
                  >
                    {!taxStatus && (
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <i className="fas fa-file-upload"></i>
                        </span>
                      </div>
                    )}
                    <span
                      className={`form-control text-truncate ${
                        taxStatus ? classes.textDisabled : ""
                      }`}
                    >
                      {uploadFilename}
                    </span>
                    {taxStatus && (
                      <div className="input-group-append pointer">
                        <span
                          className={`input-group-text ${classes.textHover}`}
                        >
                          <a download={taxData?.file_name} href={taxData?.file}>
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
                    disabled={loading || taxStatus}
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
                  <label htmlFor="priceTax" className="col-sm-5 col-form-label">
                    <FormattedMessage
                      id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.TERMIN_VALUE_PPN"
                      values={{ termin: contractData["termin_name"] }}
                    />
                  </label>
                  <div className="col-sm-7">
                    <input
                      type="text"
                      className="form-control"
                      id="priceTax"
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
                loading ||
                taxStatus ||
                progressTermin?.ident_name !== "BILLING_SOFTCOPY"
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
                <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.TAX_DOCUMENT.HISTORY" />
              </h6>
            </div>

            <TableOnly
              dataHeader={headerTable}
              loading={loading}
              // err={err}
              hecto={10}
            >
              {historyTaxData.map((item, index) => {
                return (
                  <TableRow key={index.toString()}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.tax_no}</TableCell>
                    <TableCell>{item.tax_date}</TableCell>
                    <TableCell>
                      <a href={getFileTax + item.file_name}>{item.file_name}</a>
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
export default injectIntl(connect(null, null)(ContractTaxPage));
