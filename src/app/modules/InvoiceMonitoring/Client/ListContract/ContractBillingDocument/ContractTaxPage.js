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
  getTax,
  syncTaxVendor,
  getFileTax,
  approveTax,
  getAllRejectedTax,
  getAllApprovedTax,
  rejectTax,
  rejectTaxStatus,
  getBillingDocumentId,
  softcopy_save,
  getListTax,
  getTerminProgress,
  getTaxVendor,
  checkBkbExist,
  createBkb,
  getInvoice,
  getContractAuthority,
} from "../../../_redux/InvoiceMonitoringCrud";
import useToast from "../../../../../components/toast";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  rupiah,
  formatCurrency,
  currencySign,
} from "../../../../../libs/currency";
import { Document, Page } from "react-pdf";
import PerfectScrollbar from "react-perfect-scrollbar";
import { DialogTitleFile } from "../ItemContractInvoice";
import moment from "moment";
import Select from "react-select";
import TableOnly from "../../../../../components/tableCustomV1/tableOnly";
import NumberFormat from "react-number-format";
import { DEV_NODE, SOCKET } from "../../../../../../redux/BaseHost";
import { API_EPROC } from "../../../../../../redux/BaseHost";
import { cloneDeep, isEmpty } from "lodash";
import { makeStyles } from "@material-ui/core/styles";
import { getRolesAcceptance } from "../../../../Master/service/MasterCrud";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const groupStyles = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const groupBadgeStyles = {
  backgroundColor: "#EBECF0",
  borderRadius: "2em",
  color: "#172B4D",
  display: "inline-block",
  fontSize: 12,
  fontWeight: "normal",
  lineHeight: "1",
  minWidth: 1,
  padding: "0.16666666666667em 0.5em",
  textAlign: "center",
};

const useStyles = makeStyles((theme) => ({
  MuiDialogActionsPosistion: {
    justifyContent: "space-between",
  },
}));

function ContractTaxPage(props) {
  const [loading, setLoading] = useState(false);
  const [loadingTax, setLoadingTax] = useState(false);
  const [loadingSync, setLoadingSync] = useState(false);
  const [contractData, setContractData] = useState({});
  const [taxData, setTaxData] = useState(null);
  const [dialogState, setDialogState] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(null);
  const [modalReject, setModalReject] = useState(false);
  const [modalApprove, setModalApprove] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [historyTaxData, setHistoryTaxData] = useState([]);
  const [modalHistory, setModalHistory] = useState(false);
  const [modalHistoryData, setModalHistoryData] = useState({});
  const [invoiceBillingId, setInvoiceBillingId] = useState("");
  const [listTax, setListTax] = useState([]);
  const [optionSelected, setOptionSelected] = useState({});
  const [optionSelectedPpn, setOptionSelectedPpn] = useState(null);
  const [listTaxPpn, setListTaxPpn] = useState([]);
  const [listTaxPph, setListTaxPph] = useState([]);
  const [saveTaxPph, setSaveTaxPph] = useState({});
  const [modalTaXPph, setModalTaXPph] = useState(false);
  const [addtionalPayment, setAddtionalPayment] = useState([]);
  const [setstatus, setSetstatus] = useState(true);
  const [invoiceBkbExist, setInvoiceBkbExist] = useState(false);
  const [invoiceData, setInvoiceData] = useState({});
  const [contractAuthority, setContractAuthority] = useState("");
  const [approveHardCopyRole, setApproveHardCopyRole] = useState(false);
  const [modalAddtionalPayment, setModalAddtionalPayment] = useState(false);
  const [postingDate, setPostingDate] = useState("");
  const [currencyCode, setCurrencyCode] = useState(null);
  const classes_ = useStyles();

  const [Toast, setToast] = useToast();

  const user_id = useSelector(
    (state) => state.auth.user.data.user_id,
    shallowEqual
  );
  const data_login = useSelector((state) => state.auth.user.data, shallowEqual);
  const monitoring_role = data_login.monitoring_role
    ? data_login.monitoring_role
    : [];
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
  const invoiceName = "TAX";
  const initialValuesTaxPph = { optionSelectedPph: [] };

  const TaxSchema = Yup.object().shape({
    rejected_remark: Yup.string().required(
      intl.formatMessage({
        id: "AUTH.VALIDATION.REQUIRED_FIELD",
      })
    ),
  });

  const TaxSchemaPph = Yup.object().shape({
    optionSelectedPph: Yup.array().of(
      Yup.object({
        checked: Yup.boolean(),
        wi_tax_base: Yup.string().when("checked", {
          is: true,
          then: Yup.string().required(
            intl.formatMessage({
              id: "AUTH.VALIDATION.REQUIRED_FIELD",
            })
          ),
        }),
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

  const formik = useFormik({
    initialValues,
    validationSchema: TaxSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      var data = Object.assign({}, taxData);
      delete data.file;
      delete data.file_bank;
      data.rejected_by_id = user_id;
      data.rejected_remark = values.rejected_remark;
      rejectTax(data)
        .then((response) => {
          rejectTaxStatus(taxData.id)
            .then((responses) => {
              setToast(intl.formatMessage({ id: "REQ.UPDATE_SUCCESS" }), 10000);
              setLoading(false);
              setModalReject(false);
              setIsSubmit(true);
              getHistoryTaxData(taxData.id);
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

  const formikPph = useFormik({
    initialValues: initialValuesTaxPph,
    validationSchema: TaxSchemaPph,
    // enableReinitialize: true,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setSaveTaxPph(cloneDeep(values));
      setModalTaXPph(false);
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

  // const getListTaxs = () => {
  //   getListTax(contract_id, termin)
  //     .then((response) => {
  //       setListTax(response.data.data);
  //     })
  //     .catch((error) => {
  //       setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 10000);
  //     });
  // };

  const getListTaxs = () => {
    getTaxVendor(contract_id, termin)
      .then((response) => {
        if (
          response.data.data.vat_data &&
          response.data.data.withholding_data
        ) {
          var dataPpn = [];
          var dataPph = [];
          response.data.data.vat_data.forEach((element) => {
            dataPpn.push({
              value: element.mwskz,
              label: `${element?.mwskz} - ${element?.text1}`,
            });
          });
          response.data.data.withholding_data.forEach((element) => {
            dataPph.push({
              id: element.id,
              witht: element.witht,
              wt_withcd: element.wt_withcd,
              text40: element.text40,
              // wi_tax_base: (element.qsatz *(contractData["termin_value"] + totalAddtionalPayment())) / 100,
              wi_tax_base:
                contractData["termin_value"] + totalAddtionalPayment(),
              qsatz: element.qsatz,
              checked: false,
            });
          });
          dataPpn = dataPpn.sort((a, b) =>
            a.value > b.value ? 1 : b.value > a.value ? -1 : 0
          );
          dataPph = dataPph.sort((a, b) =>
            a.value > b.value ? 1 : b.value > a.value ? -1 : 0
          );
          var optionSelectedPph_ = { optionSelectedPph: cloneDeep(dataPph) };
          formikPph.setValues(optionSelectedPph_);
          setListTaxPpn(dataPpn);
          setListTaxPph(dataPph);
          getTaxData();
        }
      })
      .catch((error) => {
        setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 10000);
      });
  };

  const getTaxData = useCallback(() => {
    setLoadingTax(true);
    getTax(contract_id, termin)
      .then((response) => {
        if (response.data.data !== null) {
          if (response.data.data.tax_selected)
            setSaveTaxPph({
              optionSelectedPph: cloneDeep(response.data.data.tax_selected),
            });
          if (response.data.data.tax_vat)
            setOptionSelectedPpn(cloneDeep(response.data.data.tax_vat));
          if (response.data.data.tax_selected) {
            var optionSelectedPph_ = {
              optionSelectedPph: cloneDeep(response.data.data.tax_selected),
            };
            formikPph.setValues(optionSelectedPph_);
          }
          // setOptionSelected(response.data.data.tax_selected);
          setTaxData(response.data.data);
          if (response.data.data) {
            getHistoryTaxData(response["data"]["data"]["id"]);
          }
          if (setstatus) {
            setSetstatus(false);
            setAddtionalPayment(
              response.data?.data?.invoice_additional_value_data
                ? response.data?.data?.invoice_additional_value_data
                : []
            );
          }
        }
        if (response?.data?.data?.currency?.code)
          setCurrencyCode(response?.data?.data?.currency?.code);
        setLoadingTax(false);
      })
      .catch((error) => {
        setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 10000);
        setLoadingTax(false);
      });
  }, [contract_id, formik, intl, setToast, listTaxPpn]);

  const getHistoryTaxData = useCallback(
    (tax_id) => {
      getAllRejectedTax(tax_id)
        .then((responseReject) => {
          getAllApprovedTax(tax_id)
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

  const handleHistory = (index) => {
    setModalHistoryData(historyTaxData[index]);
    setModalHistory(true);
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const approveTaxData = () => {
    setLoading(true);
    var data_1 = {
      contract_id: contract_id,
      term_id: termin,
      softcopy_state: "APPROVED",
      document_id: invoiceBillingId,
      document_no: taxData?.tax_no,
      created_by_id: user_id,
      filename: taxData?.file_name,
    };
    const data_2 = {
      contract_id: contract_id, //v
      term_id: termin, //v
      vendor_id: invoiceData.vendor_id,
      sub_total: invoiceData.invoice_value,
      created_by_id: user_id,
      updated_by_id: user_id,
      authority: contractAuthority,
      posting_date: postingDate,
    };

    if (isEmpty(postingDate)) {
      setToast("Posting date is required.", 10000);
      setLoading(false);
      setModalApprove(false);
      return;
    }

    approveTax(taxData.id, {
      approved_by_id: user_id,
      contract_id: contract_id,
      term_id: termin,
      tax_selected:
        saveTaxPph && saveTaxPph.optionSelectedPph
          ? saveTaxPph.optionSelectedPph
          : listTaxPph,
      tax_vat: optionSelectedPpn,
      progress_data: dataProgress,
    })
      .then((response) => {
        setToast(intl.formatMessage({ id: "REQ.UPDATE_SUCCESS" }), 10000);
        setLoading(false);
        setModalApprove(false);
        setIsSubmit(true);
        getHistoryTaxData(taxData.id);
        softcopy_save(data_1);
        getTerminProgress(termin).then((result) => {
          if (result.data.data.data) {
            setProgressTermin(result.data.data?.progress_type);
            setDataProgress(result.data.data?.data);
          }
        });
        if (invoiceBkbExist) {
          setToast(intl.formatMessage({ id: "REQ.SOFTCOPY_SUCCESS" }), 10000);
        } else {
          createBkb(data_2)
            .then((response) => {
              setInvoiceBkbExist(true);
              setToast(
                intl.formatMessage({ id: "REQ.HARDCOPY_SUCCESS" }),
                10000
              );
              getTerminProgress(termin).then((result) => {
                setDataProgress(result.data.data?.data);
              });
              getTaxData();
            })
            .catch((error) => {
              if (error.response?.data && error.response?.data.message) {
                setToast(error.response?.data.message, 10000);
              } else {
                setToast(
                  intl.formatMessage({ id: "REQ.REQUEST_FAILED" }),
                  10000
                );
              }
            });
        }
        SOCKET.emit("send_notif");
      })
      .catch((error) => {
        setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 10000);
        setLoading(false);
      });
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

  const checkBkb = () => {
    checkBkbExist(termin)
      .then((result) => {
        setInvoiceBkbExist(result.data.data.isExist);
      })
      .catch((error) => {
        setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 5000);
      });
  };

  const getInvoiceData = useCallback(() => {
    getInvoice(contract_id, termin)
      .then((response) => {
        setInvoiceData(response.data.data);
      })
      .catch((error) => {
        setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 10000);
      });
  }, [contract_id, setInvoiceData, intl, setToast]);

  const getContractAuthorityData = useCallback(() => {
    getContractAuthority(termin)
      .then((response) => {
        if (response["data"]["data"]) {
          setContractAuthority(response["data"]["data"]["authority"]);
          getRolesAcceptance(response["data"]["data"]["authority"]).then(
            (responseRoles) => {
              responseRoles["data"]["data"].map((item, index) => {
                if (
                  monitoring_role.findIndex(
                    (element) => element === item.name
                  ) >= 0
                ) {
                  setApproveHardCopyRole(true);
                }
              });
            }
          );
        }
      })
      .catch((error) => {
        setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 5000);
      });
  }, [termin, intl, setToast]);

  const syncTaxVendorData = useCallback(() => {
    setLoadingSync(true);
    syncTaxVendor()
      .then((response) => {
        setLoadingSync(false);
        setToast(response["data"]["message"], 5000);
      })
      .catch((error) => {
        setLoadingSync(false);
        setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 5000);
      });
  }, [intl, setToast]);

  useEffect(getContractData, []);
  useEffect(getListTaxs, [contractData, addtionalPayment]);
  useEffect(getTaxData, []);
  useEffect(getBillingDocumentIdData, []);
  useEffect(checkBkb, []);
  useEffect(getInvoiceData, []);
  useEffect(getContractAuthorityData, []);
  useEffect(
    function handleInitialPostDate() {
      if (!isEmpty(taxData?.posting_date))
        setPostingDate(taxData?.posting_date);
    },
    [taxData?.posting_date]
  );

  const formatGroupLabel = (data) => (
    <div style={groupStyles}>
      <span>{data.label}</span>
      <span style={groupBadgeStyles}>{data.options.length}</span>
    </div>
  );

  const handleChecked = (index) => {
    const temp = formikPph.values.optionSelectedPph;
    temp[index].checked = !temp[index].checked;
    formikPph.setFieldValue("optionSelectedPph", temp);
  };

  const handleSourceText = (e, index) => {
    const temp = formikPph.values.optionSelectedPph;
    if (temp[index]) temp[index].wi_tax_base = e ? e : "";
    formikPph.setFieldValue("optionSelectedPph", temp);
  };

  const totalAddtionalPayment = () => {
    if (addtionalPayment && addtionalPayment.length === 0) return 0;
    var total = 0;
    addtionalPayment.forEach((element) => {
      total += element.value;
    });
    return total;
  };

  const handlePostingDateSelected = (e) => {
    const newDate = moment(new Date(e.target.value)).format("YYYY-MM-DD");
    setPostingDate(newDate);
  };

  const isApprovedDisabled = invoiceBkbExist && taxData?.state === "APPROVED";

  return (
    <React.Fragment>
      <Toast />
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
                      disabled={true}
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
                          required={true}
                          disabled={true}
                        />
                      </td>
                      <td>
                        <NumberFormat
                          id={"NumberFormat-text"}
                          value={item.value}
                          displayType={"text"}
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
                      <td>
                        <button
                          type="button"
                          className="btn btn-sm btn-danger"
                          disabled={true}
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
                }}
                type="button"
              >
                <FormattedMessage id="AUTH.GENERAL.BACK_BUTTON" />
              </button>
            </div>
          </DialogActions>
        </form>
      </Dialog>
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
          <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.TAX_DOCUMENT.APPROVED.APPROVE_TITLE" />
        </DialogTitle>
        <DialogContent>
          <div>
            <FormattedMessage id="TITLE.TAX_ATTACHMENT" />
            <ul>
              {!window.jQuery.isEmptyObject(optionSelectedPpn) && (
                <li>
                  <span>PPN</span>
                  <ol>
                    <li>
                      <span className="text-danger">
                        {optionSelectedPpn.label}
                      </span>
                    </li>
                  </ol>
                </li>
              )}
              {saveTaxPph &&
                saveTaxPph.optionSelectedPph &&
                saveTaxPph.optionSelectedPph.length > 0 && (
                  <li>
                    <span>PPH</span>
                    <ol>
                      {saveTaxPph &&
                        saveTaxPph.optionSelectedPph.map((item, index) => {
                          return (
                            <li
                              key={index.toString()}
                              className={!item.checked ? "d-none" : ""}
                            >
                              <span className="text-danger">{item.text40}</span>
                            </li>
                          );
                        })}
                    </ol>
                  </li>
                )}
            </ul>
          </div>
          <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.TAX_DOCUMENT.APPROVED.APPROVE_BODY" />
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
            onClick={approveTaxData}
          >
            <span>
              <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.TAX_DOCUMENT.APPROVED.APPROVE_SUBMIT" />
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
            <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.TAX_DOCUMENT.REJECTED.REJECT_TITLE" />
          </DialogTitle>
          <DialogContent>
            <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.TAX_DOCUMENT.REJECTED.REJECT_BODY" />
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
                <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.TAX_DOCUMENT.REJECTED.REJECT_SUBMIT" />
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
        open={modalTaXPph}
        TransitionComponent={Transition}
        keepMounted
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        maxWidth="md"
        fullWidth={true}
      >
        <form noValidate autoComplete="off" onSubmit={formikPph.handleSubmit}>
          <DialogTitle id="alert-dialog-slide-title">
            <FormattedMessage id="TITLE.CHOOSE_PPH_TAX" />
          </DialogTitle>
          <DialogContent>
            <table>
              <thead>
                <tr>
                  <th style={{ width: "10%" }}>
                    <FormattedMessage id="TITLE.CHECK" />
                  </th>
                  <th style={{ width: "40%" }}>
                    <FormattedMessage id="TITLE.DESCRIPTION" />
                  </th>
                  <th style={{ width: "25%" }}>
                    <FormattedMessage id="TITLE.TOTAL_AMOUNT" />
                  </th>
                  <th style={{ width: "25%" }}>
                    <FormattedMessage id="TITLE.VALUE" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {listTaxPph.map((item, index) => {
                  return (
                    <tr key={index.toString()}>
                      <td>
                        {formikPph.values.optionSelectedPph[index] &&
                        formikPph.values.optionSelectedPph[index].checked ? (
                          <i
                            className="far fa-check-square font-size-h1 text-primary cursor-pointer"
                            onClick={() => {
                              if (
                                !(
                                  (
                                    isSubmit ||
                                    taxData?.state === "REJECTED" ||
                                    isApprovedDisabled ||
                                    taxData === null ||
                                    !props.setTaxStaffStatus
                                  )
                                  //  ||
                                  // progressTermin?.ident_name !== "TAX"
                                )
                              )
                                handleChecked(index);
                            }}
                          ></i>
                        ) : (
                          <i
                            className="far fa-square font-size-h1 text-primary cursor-pointer"
                            onClick={() => {
                              if (
                                !(
                                  (
                                    isSubmit ||
                                    taxData?.state === "REJECTED" ||
                                    isApprovedDisabled ||
                                    taxData === null ||
                                    !props.setTaxStaffStatus
                                  )
                                  //  ||
                                  // progressTermin?.ident_name !== "TAX"
                                )
                              )
                                handleChecked(index);
                            }}
                          ></i>
                        )}
                      </td>
                      <td>
                        <span
                          className="cursor-pointer"
                          onClick={() => {
                            if (
                              !(
                                (
                                  isSubmit ||
                                  taxData?.state === "REJECTED" ||
                                  isApprovedDisabled ||
                                  taxData === null ||
                                  !props.setTaxStaffStatus
                                )
                                //  ||
                                // progressTermin?.ident_name !== "TAX"
                              )
                            )
                              handleChecked(index);
                          }}
                        >
                          {item.text40}
                        </span>
                      </td>
                      <td>
                        <NumberFormat
                          id={
                            !(
                              (
                                isSubmit ||
                                taxData?.state === "REJECTED" ||
                                isApprovedDisabled ||
                                taxData === null ||
                                !props.setTaxStaffStatus
                              )
                              // ||
                              // progressTermin?.ident_name !== "TAX"
                            )
                              ? formikPph.values.optionSelectedPph[index] &&
                                formikPph.values.optionSelectedPph[index]
                                  .checked
                                ? "NumberFormat-input"
                                : "NumberFormat-text"
                              : "NumberFormat-text"
                          }
                          value={
                            formikPph.values.optionSelectedPph[index]
                              ?.wi_tax_base
                          }
                          displayType={
                            !(
                              (
                                isSubmit ||
                                taxData?.state === "REJECTED" ||
                                isApprovedDisabled ||
                                taxData === null ||
                                !props.setTaxStaffStatus
                              )
                              // ||
                              // progressTermin?.ident_name !== "TAX"
                            )
                              ? formikPph.values.optionSelectedPph[index] &&
                                formikPph.values.optionSelectedPph[index]
                                  .checked
                                ? "input"
                                : "text"
                              : "text"
                          }
                          className="form-control"
                          thousandSeparator={"."}
                          decimalSeparator={","}
                          allowEmptyFormatting={true}
                          allowLeadingZeros={true}
                          prefix={currencySign(currencyCode)}
                          onValueChange={(e) => {
                            handleSourceText(e.floatValue, index);
                          }}
                          onClick={(e) => {
                            if (
                              !(
                                (
                                  isSubmit ||
                                  taxData?.state === "REJECTED" ||
                                  isApprovedDisabled ||
                                  taxData === null ||
                                  !props.setTaxStaffStatus
                                )
                                // ||
                                // progressTermin?.ident_name !== "TAX"
                              )
                            ) {
                              if (
                                formikPph.values.optionSelectedPph[index] &&
                                formikPph.values.optionSelectedPph[index]
                                  .checked
                              ) {
                                e.target.focus();
                                e.target.select();
                              }
                            }
                          }}
                        />
                        {formikPph.errors.optionSelectedPph &&
                          formikPph.errors.optionSelectedPph[index] && (
                            <div className="text-left">
                              <small className="text-danger">
                                {
                                  formikPph.errors.optionSelectedPph[index]
                                    .wi_tax_base
                                }
                              </small>
                            </div>
                          )}
                      </td>
                      <td>
                        <NumberFormat
                          id={"NumberFormat-text"}
                          value={
                            formikPph.values.optionSelectedPph[index]
                              ?.wi_tax_base *
                            (parseFloat(
                              formikPph.values.optionSelectedPph[index]?.qsatz
                            ) /
                              100)
                          }
                          displayType={"text"}
                          className="form-control"
                          thousandSeparator={"."}
                          decimalSeparator={","}
                          allowEmptyFormatting={true}
                          allowLeadingZeros={true}
                          prefix={currencySign(currencyCode)}
                          disabled
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </DialogContent>
          <DialogActions>
            <button
              className="btn btn-secondary"
              onClick={() => {
                setModalTaXPph(false);
                formikPph.resetForm();
                var item =
                  saveTaxPph.optionSelectedPph &&
                  saveTaxPph.optionSelectedPph.length > 0
                    ? cloneDeep(saveTaxPph.optionSelectedPph)
                    : cloneDeep(listTaxPph);
                formikPph.setValues({
                  optionSelectedPph: cloneDeep(item),
                });
              }}
              disabled={loading}
              type="button"
            >
              <FormattedMessage id="AUTH.GENERAL.BACK_BUTTON" />
            </button>
            <button
              className="btn btn-primary"
              disabled={
                loading ||
                !formikPph.isValid ||
                !formikPph.dirty ||
                isSubmit ||
                taxData?.state === "REJECTED" ||
                isApprovedDisabled ||
                taxData === null ||
                !props.setTaxStaffStatus
                // ||
                // progressTermin?.ident_name !== "TAX"
              }
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
                    "DD MMMM YYYY hh:mm:ss"
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
      <Card>
        <CardBody>
          {loadingTax && (
            <span>
              <i className="fas fa-spinner fa-pulse text-dark mr-1"></i>
              <FormattedMessage id="TITLE.TABLE.WAITING_DATA" />
            </span>
          )}
          <div className="row">
            <div className="col-md-6">
              <div className="form-group row">
                <label htmlFor="numberTax" className="col-sm-4 col-form-label">
                  <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.TAX_DOCUMENT.TAX_NUMBER" />
                </label>
                <div className="col-sm-8">
                  <NumberFormat
                    id={"NumberFormat-text"}
                    value={taxData?.tax_no}
                    displayType={"text"}
                    className="form-control"
                    format="###.###-##.########"
                    mask="_"
                    allowEmptyFormatting={true}
                    allowLeadingZeros={true}
                  />
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="dateTax" className="col-sm-4 col-form-label">
                  <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.TAX_DOCUMENT.TAX_DATE" />
                </label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    className="form-control"
                    id="dateTax"
                    disabled
                    defaultValue={
                      taxData?.tax_date
                        ? moment(taxData?.tax_date).format("DD MMMM YYYY")
                        : ""
                    }
                  />
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="npwpTax" className="col-sm-4 col-form-label">
                  <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.TAX_DOCUMENT.TAX_NPWP" />
                </label>
                <div className="col-sm-8">
                  <NumberFormat
                    id={"NumberFormat-text"}
                    value={taxData?.npwp}
                    displayType={"text"}
                    className="form-control"
                    format="##.###.###.#-###.###"
                    mask="_"
                    allowEmptyFormatting={true}
                    allowLeadingZeros={true}
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
                    defaultValue={taxData?.description}
                  ></textarea>
                </div>
              </div>
              <div className="form-group row">
                <label className="col-sm-4 col-form-label">
                  <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.TAX_DOCUMENT.TAX_UPLOAD" />
                </label>
                <label className="input-group mb-3 col-sm-8">
                  <span
                    className={`form-control text-truncate ${classes.textDisabled}`}
                  >
                    {taxData ? taxData?.file_name : "Pilih File"}
                  </span>
                  <div className="input-group-append pointer">
                    <span className={`input-group-text ${classes.textHover}`}>
                      <a
                        onClick={() => {
                          window.open(
                            DEV_NODE + "/tax/" + taxData?.file_name,
                            "_blank"
                          );
                        }}
                        href={"#"}
                        // download={taxData?.file_name} href={taxData?.file}
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
              {/* <div className="form-group row">
                <label className="col-sm-4 col-form-label">
                  <FormattedMessage id="TITLE.BUSINESS_ENTITY" />
                </label>
                <label className="input-group mb-3 col-sm-8">
                  <span
                    className={`form-control text-truncate ${classes.textDisabled}`}
                  >
                    {taxData && taxData?.data
                      ? taxData?.data.doc_file.file_name
                      : "Pilih File"}
                  </span>
                  <div className="input-group-append pointer">
                    <span className={`input-group-text ${classes.textHover}`}>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (taxData && taxData?.data)
                            window.open(
                              API_EPROC + "/" + taxData?.data.doc_file.url,
                              "_blank"
                            );
                        }}
                      >
                        <i className="fas fa-download"></i>
                      </a>
                    </span>
                  </div>
                </label>
              </div> */}
              <div className="form-group row">
                <label
                  htmlFor="postingDate"
                  className="col-sm-4 col-form-label"
                >
                  <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.TAX_DOCUMENT.POSTING_DATE" />
                </label>
                <div className="col-sm-8">
                  <input
                    type="date"
                    className="form-control"
                    id="postingDate"
                    onChange={handlePostingDateSelected}
                    // disabled
                    defaultValue={taxData?.posting_date}
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
                      taxData?.created_at
                        ? moment(taxData?.created_at).format(
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
                <label htmlFor="priceTax" className="col-sm-4 col-form-label">
                  <FormattedMessage id="TITLE.TAX" />
                  {" PPN"}
                </label>
                <div className="col-sm-8">
                  <Select
                    value={optionSelectedPpn}
                    onChange={(e) => {
                      setOptionSelectedPpn(e);
                    }}
                    isDisabled={
                      isSubmit ||
                      taxData?.state === "REJECTED" ||
                      isApprovedDisabled ||
                      taxData === null ||
                      !props.setTaxStaffStatus
                      // ||
                      // progressTermin?.ident_name !== "TAX"
                    }
                    options={listTaxPpn}
                    formatGroupLabel={formatGroupLabel}
                  />
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="priceTax" className="col-sm-4 col-form-label">
                  <FormattedMessage id="TITLE.TAX" />
                  {" PPH"}
                </label>
                <div className="col-sm-8">
                  <button
                    type="button"
                    className="btn btn-primary w-100"
                    onClick={() => {
                      setModalTaXPph(true);
                    }}
                  >
                    <FormattedMessage id="TITLE.CHOOSE_PPH_TAX" />
                  </button>
                </div>
              </div>
              <div className="form-group row justify-content-end mt-4">
                <div className="col-sm-8">
                  <button
                    type="button"
                    className="btn btn-primary w-100"
                    onClick={syncTaxVendorData}
                    disabled={loadingSync}
                  >
                    <i
                      className={`fas fa-sync ${loadingSync ? "fa-spin" : ""}`}
                    ></i>
                    <FormattedMessage id="TITLE.SYNC_TAX" />
                  </button>
                </div>
              </div>

              {/* app/modules/DeliveryMonitoring/pages/Termin/Documents/component/ModalAddDeliverables.js */}
              {/* {listTax.map((item, index) => {
                return (
                  <div className="form-group row" key={index.toString()}>
                    <label
                      htmlFor="priceTax"
                      className="col-sm-4 col-form-label"
                    >
                      <FormattedMessage id="TITLE.TAX" />{" "}
                      {item.type_tax + "-" + item.group_tax}
                    </label>
                    <div className="col-sm-8">
                      <Select
                        isMulti
                        value={
                          optionSelected && optionSelected[item.id]
                            ? optionSelected[item.id].master_tax_items
                            : null
                        }
                        onChange={(e) => {
                          var data = Object.assign(
                            {},
                            optionSelected ? optionSelected : {}
                          );
                          if (!data[item.id])
                            data[item.id] = Object.assign({}, item);
                          data[item.id].master_tax_items = [];
                          if (e !== null) {
                            if (e.length > 0) {
                              data[item.id].master_tax_items = e;
                            } else {
                              delete data[item.id];
                            }
                          } else {
                            delete data[item.id];
                          }
                          setOptionSelected(data);
                        }}
                        isDisabled={
                          isSubmit ||
                          taxData?.state === "REJECTED" ||
                          isApprovedDisabled ||
                          taxData === null ||
                          !props.setTaxStaffStatus
                        }
                        // options={listTax.map((el) => ({
                        //   label: el.type_tax + " - " + el.group_tax,
                        //   options: el?.master_tax_items.map((el2) => ({
                        //     value: JSON.stringify(el2),
                        //     // value: el2?.id,
                        //     label: `${el2?.description} - ${
                        //       el2?.value
                        //     }% - ${rupiah(el2.tax_value)}`,
                        //   })),
                        // }))}
                        options={item.master_tax_items.map((el2) => ({
                          value: JSON.stringify(el2),
                          label: `${el2?.description} - ${
                            el2?.value
                          }% - ${rupiah(el2.tax_value)}`,
                        }))}
                        formatGroupLabel={formatGroupLabel}
                      />
                    </div>
                  </div>
                );
              })} */}
            </div>
          </div>
        </CardBody>
        <CardFooter className="text-right">
          {!invoiceBkbExist && taxData?.state === "APPROVED" ? (
            <button
              type="button"
              onClick={() => setModalApprove(true)}
              className="btn btn-primary mx-1"
            >
              Create BKB
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setModalApprove(true)}
                disabled={
                  isSubmit ||
                  taxData?.state === "REJECTED" ||
                  isApprovedDisabled ||
                  taxData === null ||
                  !props.setTaxStaffStatus ||
                  // progressTermin?.ident_name !== "TAX" ||
                  window.$.isEmptyObject(optionSelectedPpn)
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
                  taxData?.state === "REJECTED" ||
                  isApprovedDisabled ||
                  taxData === null ||
                  !props.setTaxStaffStatus
                  // ||
                  // progressTermin?.ident_name !== "TAX"
                }
                className="btn btn-danger mx-1"
              >
                <FormattedMessage id="TITLE.REJECT_DOCUMENT" />
              </button>
            </>
          )}
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
                  <TableCell>
                    {item?.tax_date
                      ? moment(item?.tax_date).format("DD MMMM YYYY")
                      : ""}
                  </TableCell>
                  <TableCell>
                    <a
                      onClick={() => {
                        window.open(
                          DEV_NODE + "/tax/" + item?.file_name,
                          "_blank"
                        );
                      }}
                      href={"#"}
                      // href={getFileTax + item.file_name}
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
export default injectIntl(connect(null, null)(ContractTaxPage));
