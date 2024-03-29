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
  saveSpp,
  getSpp,
  updateSpp,
  getAllRejectedSpp,
  getAllApprovedSpp,
  getFileSpp,
  getFileBank,
  getInvoiceProgress,
  getMismatchNotCompleted,
} from "../../../_redux/InvoiceMonitoringCrud";
import useToast from "../../../../../components/toast";
import { useFormik } from "formik";
import * as Yup from "yup";
import { rupiah, formatCurrency } from "../../../../../libs/currency";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-perfect-scrollbar/dist/css/styles.css";
import { Document, Page } from "react-pdf";
import PerfectScrollbar from "react-perfect-scrollbar";
import { DialogTitleFile } from "../ItemContractInvoice";
import moment from "moment";
import TableOnly from "../../../../../components/tableCustomV1/tableOnly";
import * as invoice from "../../../_redux/InvoiceMonitoringSlice";
import { getInvoicePeriods } from "../../../../Master/service/MasterCrud";
import { DEV_NODE, SOCKET } from "../../../../../../redux/BaseHost";

function ContractSprPage(props) {
  const { intl, classes, supportedFormats, progressTermin } = props;

  const [loading, setLoading] = useState(false);
  const [loadingSpp, setLoadingSpp] = useState(false);
  const [contractData, setContractData] = useState({});
  const [sppData, setSppData] = useState({});
  const [uploadFilename, setUploadFilename] = useState(
    intl.formatMessage({
      id: "TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.DEFAULT_FILENAME",
    })
  );
  const [uploadFilenameBank, setUploadFilenameBank] = useState(
    intl.formatMessage({
      id: "TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.DEFAULT_FILENAME",
    })
  );
  const [bankReference, setBankReference] = useState(true);
  const [sppStatus, setSppStatus] = useState(false);
  const [sppUpdate, setSppUpdate] = useState(false);
  const [sppId, setSppId] = useState("");
  const [dialogState, setDialogState] = useState(false);
  const [dialogStateBank, setDialogStateBank] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(null);
  const [pageNumberBank, setPageNumberBank] = useState(1);
  const [numPagesBank, setNumPagesBank] = useState(null);
  const [historySppData, setHistorySppData] = useState([]);
  const [modalHistory, setModalHistory] = useState(false);
  const [modalHistoryData, setModalHistoryData] = useState({});
  const [currencyCode, setCurrencyCode] = useState(null);
  const [invoicePeriodsStatus, setInvoicePeriodsStatus] = useState(false);
  const [isOnMismatch, setIsOnMismatch] = useState(false);

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
  // disini cek data form spr vendor
  let dataFormSprVendor = useSelector(
    (state) => state.invoiceMonitoring.dataSprVendor,
    shallowEqual
  );
  // const vendor_id = useSelector((state) => state.auth.user.data.vendor_id, shallowEqual);
  const contract_id = props.match.params.contract;
  const termin = props.match.params.termin;

  const initialValues = {
    spr_no: "",
    draft_no: "",
    spr_date: "",
    contract_id: contract_id,
    vendor_id: "",
    term: termin,
    payment_value: "",
    bank_refference: true,
    bank_name: "",
    bank_address: "",
    bank_account_no: "",
    bank_account_name: "",
    file_name: "",
    new_bank_file: "",
    description: "",
    created_at: "",
    created_by_id: user_id,
    file: "",
    file_bank: "",
  };

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
    bank_refference: Yup.boolean(),
    file_bank: Yup.mixed().when("bank_refference", {
      is: false,
      then: Yup.mixed()
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
    }),
    description: Yup.string().required(
      intl.formatMessage({
        id: "AUTH.VALIDATION.REQUIRED_FIELD",
      })
    ),
    spr_date: Yup.string().required(
      intl.formatMessage({
        id: "AUTH.VALIDATION.REQUIRED_FIELD",
      })
    ),
    spr_no: Yup.string().required(
      intl.formatMessage({
        id: "AUTH.VALIDATION.REQUIRED_FIELD",
      })
    ),
    bank_name: Yup.string().required(
      intl.formatMessage({
        id: "AUTH.VALIDATION.REQUIRED_FIELD",
      })
    ),
    bank_address: Yup.string().required(
      intl.formatMessage({
        id: "AUTH.VALIDATION.REQUIRED_FIELD",
      })
    ),
    bank_account_no: Yup.string().required(
      intl.formatMessage({
        id: "AUTH.VALIDATION.REQUIRED_FIELD",
      })
    ),
    bank_account_name: Yup.string().required(
      intl.formatMessage({
        id: "AUTH.VALIDATION.REQUIRED_FIELD",
      })
    ),
  });

  const formik = useFormik({
    initialValues,
    validationSchema: InvoiceSchema,
    // ini fungsi buat submit nya
    onSubmit: async (values) => {
      // gak kepake
      // { setStatus, setSubmitting }
      setLoading(true);
      setSppStatus(true);
      var data = new FormData();
      for (var key in values) {
        data.append(key, values[key]);
      }
      if (sppUpdate) {
        updateSpp(sppId, data)
          .then((response) => {
            getSpp(contract_id, termin).then((responses) => {
              props.set_data_spr_vendor({});
              setSppData(responses["data"]["data"]);
              setUploadFilename(responses["data"]["data"]["file_name"]);
              setUploadFilenameBank(responses["data"]["data"]["new_bank_file"]);
              setToast(intl.formatMessage({ id: "REQ.UPDATE_SUCCESS" }), 10000);
              SOCKET.emit("send_notif");
              setLoading(false);
            });
          })
          .catch((error) => {
            setToast(intl.formatMessage({ id: "REQ.UPDATE_FAILED" }), 10000);
            setLoading(false);
            setSppStatus(false);
          });
      } else {
        saveSpp(data)
          .then((response) => {
            props.set_data_spr_vendor({});
            setToast(intl.formatMessage({ id: "REQ.UPDATE_SUCCESS" }), 10000);
            setLoading(false);
            setSppData(response["data"]["data"]);
            setUploadFilename(response["data"]["data"]["file_name"]);
            setUploadFilenameBank(response["data"]["data"]["new_bank_file"]);
            SOCKET.emit("send_notif");
          })
          .catch((error) => {
            setToast(intl.formatMessage({ id: "REQ.UPDATE_FAILED" }), 10000);
            setLoading(false);
            setSppStatus(false);
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
          "vendor_id",
          response["data"]["data"]["vendor_id"]
        );
        formik.setFieldValue(
          "bank_name",
          response["data"]["data"]["data_bank"][0]["bank"]["full_name"]
        );
        formik.setFieldValue(
          "bank_address",
          response["data"]["data"]["data_bank"][0]["address"]["postal_address"]
        );
        formik.setFieldValue(
          "bank_account_no",
          response["data"]["data"]["data_bank"][0]["account_number"]
        );
        formik.setFieldValue(
          "bank_account_name",
          response["data"]["data"]["data_bank"][0]["account_holder_name"]
        );
        formik.setFieldValue(
          "payment_value",
          response["data"]["data"]["termin_value"]
        );
        if (response?.data?.data?.currency_code)
          setCurrencyCode(response?.data?.data?.currency_code);
      })
      .catch((error) => {
        setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 10000);
      });
  }, [contract_id, formik, intl, setToast, user_id]);

  const getSppData = useCallback(() => {
    setLoadingSpp(true);
    getSpp(contract_id, termin)
      .then((response) => {
        if (!response["data"]["data"]) {
          formik.setFieldValue(
            "spr_no",
            dataFormSprVendor.spr_no ? dataFormSprVendor.spr_no : ""
          );
          formik.setFieldValue(
            "spr_date",
            dataFormSprVendor.spr_date
              ? window
                  .moment(new Date(dataFormSprVendor.spr_date))
                  .format("YYYY-MM-DD")
              : ""
          );
          formik.setFieldValue(
            "description",
            dataFormSprVendor.description ? dataFormSprVendor.description : ""
          );
          setSppData({
            ...sppData,
            spr_no: dataFormSprVendor.spr_no ? dataFormSprVendor.spr_no : "",
            spr_date: dataFormSprVendor.spr_date
              ? dataFormSprVendor.spr_date
              : "",
            description: dataFormSprVendor.description
              ? dataFormSprVendor.description
              : "",
          });
          setSppStatus(false);
        } else {
          getHistorySppData(response["data"]["data"]["id"]);
          setSppId(response["data"]["data"]["id"]);

          formik.setFieldValue(
            "draft_no",
            response["data"]["data"]["spr_draft_no"]
          );

          if (response["data"]["data"]["state"] === "REJECTED") {
            setSppStatus(false);
            setSppUpdate(true);
          } else {
            setSppStatus(true);
            setBankReference(response["data"]["data"]["bank_refference"]);
            formik.setFieldValue("spr_no", response["data"]["data"]["spr_no"]);
            formik.setFieldValue(
              "spr_date",
              response["data"]["data"]["spr_date"]
                ? window
                    .moment(new Date(response["data"]["data"]["spr_date"]))
                    .format("DD MMMM YYYY")
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
            formik.setFieldValue(
              "bank_refference",
              response["data"]["data"]["bank_refference"]
            );
            formik.setFieldValue(
              "bank_name",
              response["data"]["data"]["bank_name"]
            );
            formik.setFieldValue(
              "bank_address",
              response["data"]["data"]["bank_address"]
            );
            formik.setFieldValue(
              "bank_account_no",
              response["data"]["data"]["bank_account_no"]
            );
            formik.setFieldValue(
              "bank_account_name",
              response["data"]["data"]["bank_account_name"]
            );
            formik.setFieldValue(
              "new_bank_file",
              response["data"]["data"]["new_bank_file"]
            );
            setUploadFilename(response["data"]["data"]["file_name"]);
            setUploadFilenameBank(response["data"]["data"]["new_bank_file"]);
            setSppData(response["data"]["data"]);
          }
        }
        setLoadingSpp(false);
      })
      .catch((error) => {
        setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 10000);
        setLoadingSpp(false);
      });
  }, [contract_id, termin, formik, intl, setToast, user_id, setLoadingSpp]);

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
    [intl, setToast, getAllRejectedSpp, getAllApprovedSpp]
  );

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const onDocumentLoadSuccessBank = ({ numPages }) => {
    setNumPagesBank(numPages);
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

  const handleUploadBank = (e) => {
    if (e.currentTarget.files.length) {
      setUploadFilenameBank(e?.currentTarget?.files[0]?.name);
    } else {
      setUploadFilenameBank(
        intl.formatMessage({
          id: "TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.DEFAULT_FILENAME",
        })
      );
    }
    formik.setTouched({ ...formik.touched, file_bank: true });
    formik.setFieldValue("new_bank_file", e.currentTarget.files[0]?.name);
    formik.setFieldValue("file_bank", e.currentTarget.files[0]);
  };

  const handleDate = (e) => {
    formik.setFieldValue("spr_date", e.target.value);
  };

  const handleRadio = (e) => {
    formik.setTouched({}, false);
    // getSppData();
    // setUploadFilename(
    //   intl.formatMessage({
    //     id: "TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.DEFAULT_FILENAME",
    //   })
    // );
    if (e.target.value === "true") {
      setBankReference(true);
      formik.setFieldValue("bank_refference", true);
      formik.setFieldValue(
        "bank_account_no",
        contractData["data_bank"][0]["account_number"]
      );
      formik.setFieldValue(
        "bank_account_name",
        contractData["data_bank"][0]["account_holder_name"]
      );
      formik.setFieldValue(
        "bank_name",
        contractData["data_bank"][0]["bank"]["full_name"]
      );
      formik.setFieldValue(
        "bank_address",
        contractData["data_bank"][0]["address"]["postal_address"]
      );
    } else {
      setBankReference(false);
      formik.setFieldValue("bank_refference", false);
      formik.setFieldValue("bank_account_no", "");
      formik.setFieldValue("bank_account_name", "");
      formik.setFieldValue("bank_name", "");
      formik.setFieldValue("bank_address", "");
    }
  };

  const handleChangeBank = (e) => {
    formik.setFieldValue(
      "bank_account_no",
      contractData["data_bank"][e.target.value]["account_number"]
    );
    formik.setFieldValue(
      "bank_account_name",
      contractData["data_bank"][e.target.value]["account_holder_name"]
    );
    formik.setFieldValue(
      "bank_name",
      contractData["data_bank"][e.target.value]["bank"]["full_name"]
    );
    formik.setFieldValue(
      "bank_address",
      contractData["data_bank"][e.target.value]["address"]["postal_address"]
    );
  };

  const handleHistory = (index) => {
    setModalHistoryData(historySppData[index]);
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

  const getMismatchNotCompletedData = useCallback(() => {
    getMismatchNotCompleted(contract_id, termin)
      .then((response) => {
        const identName = "SPP";
        const data = response?.data?.data;

        if (data && data.length > 0) {
          const target = data.filter(
            (item) => item.mismatch_data[0].value.ident_name === identName
          );
          setIsOnMismatch(target.length > 0);
        }
      })
      .catch((error) => {
        setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 10000);
      });
  }, [contract_id, termin, intl, setToast]);
  useEffect(getMismatchNotCompletedData, []);
  useEffect(getContractData, []);
  useEffect(getSppData, []);
  useEffect(getInvoicePeriodsData, []);

  return (
    <React.Fragment>
      <Toast />
      ini apa toh
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
                        className={`fas fa-chevron-left ${
                          pageNumberBank === 1 ? "" : "text-secondary"
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
                        className={`fas fa-chevron-right ${
                          pageNumberBank === numPagesBank
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
          <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.SPP_DOCUMENT.DETAIL_HISTORY" />
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
                  <label className="col-sm-12 col-form-label">
                    <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.SPP_DOCUMENT.BANK_ADDRESS" />
                  </label>
                  <div className="col-sm-12">
                    <textarea
                      disabled
                      className="form-control"
                      defaultValue={modalHistoryData["bank_address"]}
                    ></textarea>
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
        <form noValidate autoComplete="off" onSubmit={formik.handleSubmit}>
          <CardBody>
            {loadingSpp && (
              <span>
                <i className="fas fa-spinner fa-pulse text-dark mr-1"></i>
                <FormattedMessage id="TITLE.TABLE.WAITING_DATA" />
              </span>
            )}

            <div className="row">
              <div className="col-md-6">
                <div className="form-group row">
                  <label
                    htmlFor="numberSpp"
                    className="col-sm-4 col-form-label"
                  >
                    <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.SPP_DOCUMENT.SPP_NUMBER" />
                    <span className="text-danger">*</span>
                  </label>
                  <div className="col-sm-8">
                    <input
                      type="text"
                      className="form-control"
                      id="numberSpp"
                      disabled={
                        loading ||
                        sppStatus ||
                        (!invoicePeriodsStatus && !isOnMismatch && !sppUpdate)
                      }
                      {...formik.getFieldProps("spr_no")}
                      // keren sih ini, disimpan ke localStorage lewat redux persist
                      onChange={(e) => {
                        dataFormSprVendor.spr_no = e.target.value;
                        props.set_data_spr_vendor(dataFormSprVendor);
                        formik.setFieldValue("spr_no", e.target.value);
                      }}
                    />
                  </div>
                  {formik.touched.spr_no && formik.errors.spr_no ? (
                    <span className="col-sm-8 offset-sm-4 text-left text-danger">
                      {formik.errors.spr_no}
                    </span>
                  ) : null}
                </div>
                <div className="form-group row">
                  <label htmlFor="dateSpp" className="col-sm-4 col-form-label">
                    <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.SPP_DOCUMENT.SPP_DATE" />
                    <span className="text-danger">*</span>
                  </label>
                  <div className="col-sm-8">
                    <input
                      type={
                        loading ||
                        sppStatus ||
                        (!invoicePeriodsStatus && !isOnMismatch && !sppUpdate)
                          ? "text"
                          : "date"
                      }
                      className="form-control"
                      id="dateSpp"
                      disabled={
                        loading ||
                        sppStatus ||
                        (!invoicePeriodsStatus && !isOnMismatch && !sppUpdate)
                      }
                      {...formik.getFieldProps("spr_date")}
                      onChange={(e) => {
                        dataFormSprVendor.spr_date = window
                          .moment(new Date(e.target.value))
                          .format("YYYY-MM-DD");
                        props.set_data_spr_vendor(dataFormSprVendor);
                        formik.setFieldValue(
                          "spr_date",
                          window
                            .moment(new Date(e.target.value))
                            .format("YYYY-MM-DD")
                        );
                      }}
                    />
                  </div>
                  {formik.touched.spr_date && formik.errors.spr_date ? (
                    <span className="col-sm-8 offset-sm-4 text-left text-danger">
                      {formik.errors.spr_date}
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
                        sppStatus ||
                        (!invoicePeriodsStatus && !isOnMismatch && !sppUpdate)
                      }
                      {...formik.getFieldProps("description")}
                      onChange={(e) => {
                        dataFormSprVendor.description = e.target.value;
                        props.set_data_spr_vendor(dataFormSprVendor);
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
                    <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.SPP_DOCUMENT.SPP_UPLOAD" />
                    <span className="text-danger">*</span>
                  </label>
                  <label
                    htmlFor="upload"
                    className={`input-group mb-3 col-sm-8 ${
                      sppStatus ||
                      (!invoicePeriodsStatus && !isOnMismatch && !sppUpdate)
                        ? ""
                        : "pointer"
                    }`}
                  >
                    {!sppStatus && (
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <i className="fas fa-file-upload"></i>
                        </span>
                      </div>
                    )}
                    <span
                      className={`form-control text-truncate ${
                        sppStatus ||
                        (!invoicePeriodsStatus && !isOnMismatch && !sppUpdate)
                          ? classes.textDisabled
                          : ""
                      }`}
                    >
                      {uploadFilename}
                    </span>
                    {sppStatus && (
                      <div className="input-group-append pointer">
                        {/* download icon */}
                        <span
                          className={`input-group-text ${classes.textHover}`}
                        >
                          <a
                            onClick={() => {
                              window.open(
                                DEV_NODE + "/spp/" + sppData?.file_name,
                                "_blank"
                              );
                            }}
                            href={"#"}
                          >
                            <i className="fas fa-download"></i>
                          </a>
                        </span>
                        {/* eye icon */}
                        <span
                          className={`input-group-text ${classes.textHover}`}
                          onClick={() => setDialogState(true)}
                        >
                          <i className="fas fa-eye"></i>
                        </span>
                      </div>
                    )}
                  </label>
                  <input
                    type="file"
                    className="d-none"
                    id="upload"
                    disabled={
                      loading ||
                      sppStatus ||
                      (!invoicePeriodsStatus && !isOnMismatch && !sppUpdate)
                    }
                    onBlur={formik.handleBlur}
                    onChange={(e) => handleUpload(e)}
                  />
                  {formik.touched.file && formik.errors.file ? (
                    <span className="col-sm-8 offset-sm-4 text-left text-danger">
                      {formik.errors.file}
                    </span>
                  ) : null}
                </div>
                <div className="form-group row">
                  <label
                    htmlFor="accountNumberSpp"
                    className="col-sm-4 col-form-label"
                  >
                    <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.SPP_DOCUMENT.BANK_REFFERENCE" />
                    <span className="text-danger">*</span>
                  </label>
                  <div className="col-sm-8 col-form-label">
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="RadioOptions"
                        value={true}
                        disabled={
                          loading ||
                          sppStatus ||
                          (!invoicePeriodsStatus && !isOnMismatch && !sppUpdate)
                        }
                        onChange={handleRadio}
                        checked={bankReference}
                        id="TRUE"
                      />
                      <label className="form-check-label" htmlFor="TRUE">
                        <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.SPP_DOCUMENT.BANK_REFFERENCE_TRUE" />
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="RadioOptions"
                        value={false}
                        disabled={
                          loading ||
                          sppStatus ||
                          (!invoicePeriodsStatus && !isOnMismatch && !sppUpdate)
                        }
                        onChange={handleRadio}
                        checked={!bankReference}
                        id="FALSE"
                      />
                      <label className="form-check-label" htmlFor="FALSE">
                        <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.SPP_DOCUMENT.BANK_REFFERENCE_FALSE" />
                      </label>
                    </div>
                  </div>
                </div>
                {/* account number */}
                {bankReference && (
                  <div className="form-group row">
                    <label
                      htmlFor="accountNumberSpp"
                      className="col-sm-4 col-form-label"
                    >
                      bank reference = true
                      <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.SPP_DOCUMENT.ACCOUNT_NUMBER" />
                      <span className="text-danger">*</span>
                    </label>
                    <div className="col-sm-8">
                      <select
                        onChange={handleChangeBank}
                        disabled={
                          loading ||
                          sppStatus ||
                          (!invoicePeriodsStatus && !isOnMismatch && !sppUpdate)
                        }
                        className="custom-select custom-select-sm"
                        value={sppData.bank_account_no}
                      >
                        {contractData["data_bank"]?.map((item, index) => {
                          return (
                            <option key={index} value={index}>
                              {item.account_number} - {item.account_holder_name}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                )}
                {/* account number */}
                {!bankReference && (
                  <div className="form-group row">
                    <label
                      htmlFor="accountNumberSpp"
                      className="col-sm-4 col-form-label"
                    >
                      bank reference = false
                      <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.SPP_DOCUMENT.ACCOUNT_NUMBER" />
                      <span className="text-danger">*</span>
                    </label>
                    <div className="col-sm-8">
                      <input
                        type="text"
                        className="form-control"
                        id="accountNumberSpp"
                        disabled={
                          loading ||
                          sppStatus ||
                          (!invoicePeriodsStatus && !isOnMismatch && !sppUpdate)
                        }
                        {...formik.getFieldProps("bank_account_no")}
                      />
                    </div>
                    {formik.touched.bank_account_no &&
                    formik.errors.bank_account_no ? (
                      <span className="col-sm-8 offset-sm-4 text-left text-danger">
                        {formik.errors.bank_account_no}
                      </span>
                    ) : null}
                  </div>
                )}
                <div className="form-group row">
                  <label
                    htmlFor="accountNameSpp"
                    className="col-sm-4 col-form-label"
                  >
                    <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.SPP_DOCUMENT.ACCOUNT_NAME" />
                    <span className="text-danger">*</span>
                  </label>
                  <div className="col-sm-8">
                    <input
                      type="text"
                      className="form-control"
                      id="accountNameSpp"
                      disabled={
                        loading ||
                        bankReference ||
                        sppStatus ||
                        (!invoicePeriodsStatus && !isOnMismatch && !sppUpdate)
                      }
                      defaultValue={sppData.bank_account_name}
                      {...formik.getFieldProps("bank_account_name")}
                    />
                  </div>
                  {formik.touched.bank_account_name &&
                  formik.errors.bank_account_name ? (
                    <span className="col-sm-8 offset-sm-4 text-left text-danger">
                      {formik.errors.bank_account_name}
                    </span>
                  ) : null}
                </div>
                <div className="form-group row">
                  <label
                    htmlFor="bankNameSpp"
                    className="col-sm-4 col-form-label"
                  >
                    <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.SPP_DOCUMENT.BANK_NAME" />
                    <span className="text-danger">*</span>
                  </label>
                  <div className="col-sm-8">
                    <input
                      type="text"
                      className="form-control"
                      id="bankNameSpp"
                      disabled={
                        loading ||
                        bankReference ||
                        sppStatus ||
                        (!invoicePeriodsStatus && !isOnMismatch && !sppUpdate)
                      }
                      {...formik.getFieldProps("bank_name")}
                    />
                  </div>
                  {formik.touched.bank_name && formik.errors.bank_name ? (
                    <span className="col-sm-8 offset-sm-4 text-left text-danger">
                      {formik.errors.bank_name}
                    </span>
                  ) : null}
                </div>
                <div className="form-group row">
                  <label
                    htmlFor="bankAddressSpp"
                    className="col-sm-4 col-form-label"
                  >
                    <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.SPP_DOCUMENT.BANK_ADDRESS" />
                    <span className="text-danger">*</span>
                  </label>
                  <div className="col-sm-8">
                    <textarea
                      rows="4"
                      className="form-control"
                      id="bankAddressSpp"
                      disabled={
                        loading ||
                        bankReference ||
                        sppStatus ||
                        (!invoicePeriodsStatus && !isOnMismatch && !sppUpdate)
                      }
                      {...formik.getFieldProps("bank_address")}
                    ></textarea>
                  </div>
                  {formik.touched.bank_address && formik.errors.bank_address ? (
                    <span className="col-sm-8 offset-sm-4 text-left text-danger">
                      {formik.errors.bank_address}
                    </span>
                  ) : null}
                </div>
                {/* upload bank change letter */}
                {!bankReference && (
                  <div className="form-group row">
                    <label
                      htmlFor="upload_bank"
                      className="col-sm-4 col-form-label"
                    >
                      <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.SPP_DOCUMENT.BANK_UPLOAD" />
                      <span className="text-danger">*</span>
                    </label>
                    <label
                      htmlFor="upload_bank"
                      className={`input-group mb-3 col-sm-8 ${
                        sppStatus ||
                        (!invoicePeriodsStatus && !isOnMismatch && !sppUpdate)
                          ? ""
                          : "pointer"
                      }`}
                    >
                      {!sppStatus && (
                        <div className="input-group-prepend">
                          <span className="input-group-text">
                            <i className="fas fa-file-upload"></i>
                          </span>
                        </div>
                      )}
                      <span
                        className={`form-control text-truncate h-100 ${
                          sppStatus ||
                          (!invoicePeriodsStatus && !isOnMismatch && !sppUpdate)
                            ? classes.textDisabled
                            : ""
                        }`}
                      >
                        {uploadFilenameBank}
                      </span>
                      {sppStatus && (
                        <div className="input-group-append pointer">
                          <span
                            className={`input-group-text ${classes.textHover}`}
                          >
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
                      )}
                    </label>
                    {formik.touched.file_bank && formik.errors.file_bank ? (
                      <span className="col-sm-8 offset-sm-4 text-left text-danger">
                        {formik.errors.file_bank}
                      </span>
                    ) : null}
                    <input
                      type="file"
                      className="d-none"
                      id="upload_bank"
                      disabled={
                        loading ||
                        sppStatus ||
                        (!invoicePeriodsStatus && !isOnMismatch && !sppUpdate)
                      }
                      onChange={(e) => handleUploadBank(e)}
                    />
                  </div>
                )}
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
                      defaultValue={formatCurrency(
                        currencyCode,
                        contractData?.contract_value
                      )}
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
                      defaultValue={formatCurrency(
                        currencyCode,
                        contractData?.termin_value
                      )}
                      disabled
                    />
                  </div>
                </div>

                {/* <div className="form-group row">
                  <label
                    htmlFor="priceTaxSpp"
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
                      id="priceTaxSpp"
                      defaultValue={formatCurrency(currencyCode, contractData?.termin_value * 1.1)}
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
                sppStatus ||
                (!invoicePeriodsStatus && !isOnMismatch && !sppUpdate)
              }
            >
              {/* benar */}
              {/* disini save nya */}
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
                    <TableCell>
                      {item.spr_date
                        ? moment(item.spr_date).format("DD MMMM YYYY")
                        : ""}
                    </TableCell>
                    <TableCell>
                      <a href={getFileSpp + item.file_name}>{item.file_name}</a>
                    </TableCell>
                    <TableCell>{item.created_by_name}</TableCell>
                    <TableCell>
                      {moment(new Date(item.created_at)).format(
                        "DD MMMM YYYY HH:mm:ss"
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
export default injectIntl(connect(null, invoice.actions)(ContractSprPage));
