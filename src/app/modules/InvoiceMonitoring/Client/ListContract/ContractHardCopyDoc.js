import React, { useState, useEffect, useCallback } from "react";
import { connect, shallowEqual, useSelector } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import {
  Card,
  CardBody,
  CardFooter,
} from "../../../../../_metronic/_partials/controls";
import {
  createBkb,
  getFileEproc,
  getListDocSoftCopy,
  approveHardCopy,
  rejectHardCopyStatus,
  rejectHardCopyHistory,
  getDeliverableInInvoive,
  getHardcopyBillingDocument,
  getFileSpp,
  getFileInvoice,
  getFileReceipt,
  getFileTax,
  sendNotifHardCopy,
  checkBkbExist,
  getInvoice,
  getContractSummary,
  getTerminProgress,
  getContractAuthority,
  getSaGr,
} from "../../_redux/InvoiceMonitoringCrud";
// import useToast from "../../../../../components/toast";
// import { useFormik } from "formik";
// import * as Yup from "yup";
import { rupiah } from "../../../../libs/currency";
import ButtonAction from "../../../../components/buttonAction/ButtonAction";
import {
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  LinearProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  IconButton,
  TableRow,
  TableCell,
} from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import RowAccordion from "../../../DeliveryMonitoring/pages/Termin/Documents/components/RowAccordion";
import { formatDate } from "../../../../libs/date";
import useToast from "../../../../components/toast";
import TableOnly from "../../../../components/tableCustomV1/tableOnly";
import { DEV_NODE, DEV_RUBY, API_EPROC } from "../../../../../redux/BaseHost";
import { toAbsoluteUrl } from "../../../../../_metronic/_helpers";
import { getRolesAcceptance } from "../../../Master/service/MasterCrud";
import { SOCKET } from "../../../../../redux/BaseHost";
import {
  ServiceAcceptance,
  GoodReceipt,
} from "../../../DeliveryMonitoring/pages/Termin/ServiceAccGR/components";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const data_ops = [
  {
    label: "TITLE.ACCEPT_DOCUMENT",
    icon: "fas fa-check-circle text-success",
    type: "accept",
  },
  {
    label: "TITLE.REJECT_DOCUMENT",
    icon: "fas fa-times-circle text-warning",
    type: "reject",
  },
];

const data_ops_user = [
  {
    label: "TITLE.UPLOAD",
    icon: "fas fa-cloud-upload-alt text-success",
    type: "upload",
  },
];

const data_opsDeliverable = [
  {
    label: "TITLE.ACCEPT_DOCUMENT",
    icon: "fas fa-check-circle text-success",
    type: "approved",
  },
  {
    label: "TITLE.REJECT_DOCUMENT",
    icon: "fas fa-times-circle text-warning",
    type: "rejected",
  },
];

const StatusRemarks = ({ status, remarks }) => {
  const isRejected = status === "REJECTED";
  return (
    <div className="d-flex flex-column flex-grow-1">
      <p className="text-dark-75 font-size-lg mb-1">{status || "-"}</p>
      <span className="text-muted font-weight-bold">
        {isRejected ? remarks : null}
      </span>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  textHover: {
    "&:hover i": {
      color: "#181C32 !important",
    },
  },
  textDisabled: {
    backgroundColor: "#F3F6F9",
  },
  column: {
    flexBasis: "33.33%",
  },
  details: {
    alignItems: "center",
  },
  ExpansionPanelCard: {
    margin: "0 !important",
  },
  ExpansionPanelHeader: {
    "border-bottom": "1px solid #ebedf3",
  },
  ExpansionPanelHeaderSpan: {
    color: "rgba(0, 0, 0, 0.54)",
    fontWeight: 500,
  },
}));

function ContractHardCopyDoc(props) {
  const {
    intl,
    progressTermin,
    setProgressTermin,
    setDataProgress,
    dataProgress,
  } = props;
  const classes = useStyles();
  const [Toast, setToast] = useToast();
  const [dataReject, setDataReject] = useState({});
  const [invoiceData, setInvoiceData] = useState({});
  const [invoiceBkbExist, setInvoiceBkbExist] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingDeliverables, setLoadingDeliverables] = useState(false);
  const [dataDocHardCopy, setDataDocHardCopy] = useState([]);
  const [dataBillingHardCopy, setDataBillingHardCopy] = useState([]);
  const [billingHardCopy, setBillingHardCopy] = useState(true);
  const [deliverableHardCopy, setDeliverableHardCopy] = useState(true);
  const [contractHardCopy, setContractHardCopy] = useState(true);
  const [dialogConfirm, setDialogConfirm] = useState(false);
  const [contractAuthority, setContractAuthority] = useState("");

  const contract_id = props.match.params.contract;
  const termin = props.match.params.termin;
  const dataUser = useSelector((state) => state.auth.user.data);

  const indexHardCopy = dataProgress?.findIndex(
    (row) => row.ident_name == "HARDCOPY"
  );
  const statusHardCopy = dataProgress[indexHardCopy]?.status === "ON PROGRESS";
  const statusHardCopyNoStarted =
    dataProgress[indexHardCopy]?.status === "NO STARTED";

  const user_id = useSelector(
    (state) => state.auth.user.data.user_id,
    shallowEqual
  );

  const data_login = useSelector((state) => state.auth.user.data, shallowEqual);
  const monitoring_role = data_login.monitoring_role
    ? data_login.monitoring_role
    : [];

  const [approveHardCopyRole, setApproveHardCopyRole] = useState(false);

  const [modalReject, setModalReject] = useState({
    statusDialog: false,
    data: {},
    loading: false,
    statusReq: false,
  });
  const [modalApproved, setModalApproved] = useState({
    statusDialog: false,
    data: {},
    loading: false,
    statusReq: false,
  });
  const [theadDocuments] = useState([
    { id: "action", label: "" },
    {
      id: "doc-name",
      label: intl.formatMessage({
        id: "TITLE.DOCUMENT_NAME",
      }),
    },
    {
      id: "due-date",
      label: intl.formatMessage({
        id: "CONTRACT_DETAIL.TABLE_HEAD.DUE_DATE",
      }),
    },
    {
      id: "dokumen-progress",
      label: intl.formatMessage({
        id: "CONTRACT_DETAIL.TABLE_HEAD.PROJECT_PROGRESS",
      }),
    },
    {
      id: "deliv-dokumen",
      label: intl.formatMessage({
        id: "CONTRACT_DETAIL.TABLE_HEAD.DELIVERABLES_DOCUMENT",
      }),
    },
    {
      id: "remarks",
      label: intl.formatMessage({
        id: "TITLE.REMARKS",
      }),
    },
    {
      id: "aksi",
      label: intl.formatMessage({
        id: "MENU.ACTIONS",
      }),
    },
  ]);

  const headerTable = [
    {
      title: intl.formatMessage({
        id: "TITLE.TABLE_HEADER.NO",
      }),
    },
    {
      title: intl.formatMessage({
        id: "TITLE.DOCUMENT_NAME",
      }),
    },
    {
      title: intl.formatMessage({
        id: "TITLE.NO_DOCUMENT",
      }),
    },
    {
      title: intl.formatMessage({
        id: "TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.APPROVED_DATE",
      }),
    },
    {
      title: intl.formatMessage({ id: "TITLE.STATUS" }),
    },
    {
      title: intl.formatMessage({
        id: "TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.APPROVED_BY",
      }),
    },
    {
      title: intl.formatMessage({
        id: "CONTRACT_DETAIL.TABLE_HEAD.ACTION",
      }),
    },
  ];
  const headerTableDeliverables = [
    { title: "" },
    {
      title: intl.formatMessage({
        id: "TITLE.DOCUMENT_NAME",
      }),
    },
    {
      title: intl.formatMessage({
        id: "CONTRACT_DETAIL.TABLE_HEAD.DUE_DATE",
      }),
    },
    {
      title: intl.formatMessage({
        id: "TITLE.STATUS",
      }),
    },
    {
      title: intl.formatMessage({
        id: "TITLE.PERCENTAGE",
      }),
    },
    {
      title: intl.formatMessage({
        id: "CONTRACT_DETAIL.TABLE_HEAD.DELIVERABLES_DOCUMENT",
      }),
    },
    {
      title: intl.formatMessage({
        id: "TITLE.REMARKS",
      }),
    },
    {
      title: intl.formatMessage({
        id: "MENU.ACTIONS",
      }),
    },
  ];

  const [dataDeliverables, setDataDeliverables] = useState([]);
  const [contractData, setContractData] = useState({});
  const [content, setContent] = React.useState({
    task_sa: null,
    task_gr: null,
    contract: null,
  });

  const BtnLihat = ({ url }) => {
    const handleOpen = React.useCallback(() => {
      window.open(url, "_blank");
    }, [url]);
    return (
      <div className={"d-flex flex-row align-items-center"}>
        {/* <Typography>{url}</Typography> */}
        {url && (
          <button
            className="btn btn-sm btn-primary"
            onClick={handleOpen}
            href="#text-buttons"
          >
            <i className="fas fa-cloud-download-alt mx-2"></i>Lihat Dokumen
          </button>
        )}
      </div>
    );
  };

  const handleAction = (type, data) => {
    if (type === "reject") {
      setModalReject({ ...modalReject, statusDialog: true, data: data });
    } else if (type === "accept") {
      setModalApproved({ ...modalApproved, statusDialog: true, data: data });
    }
    console.log("handleAction type: ", type, " - ", "data: ", data);
  };

  const handleActionDeliverable = (type, data) => {
    if (type === "rejected") {
      setModalReject({ ...modalReject, statusDialog: true, data: data });
    } else if (type === "approved") {
      setModalApproved({ ...modalApproved, statusDialog: true, data: data });
    }
    console.log("handleActionDeliverable type: ", type, " - ", "data: ", data);
  };

  const checkBkb = () => {
    checkBkbExist(termin)
      .then((result) => {
        setInvoiceBkbExist(result.data.data.isExist);
      })
      .catch((error) => {
        setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 5000);
      });
  };

  const callApi = () => {
    setLoadingDeliverables(true);
    getDeliverableInInvoive(termin)
      .then((result) => {
        setLoadingDeliverables(false);
        setDataDeliverables(result.data.data.task_documents);
        setDeliverableHardCopy(false);
      })
      .catch((error) => {
        setLoadingDeliverables(false);
        setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 5000);
      });

    getContractSummary(contract_id, termin)
      .then((result) => {
        setContractData(result.data.data);
      })
      .catch((error) => {
        setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 5000);
      });
  };

  const callApiContractSoftCopy = () => {
    setLoading(true);
    getListDocSoftCopy(contract_id, termin, "HARDCOPY")
      .then((result) => {
        setLoading(false);
        setDataDocHardCopy(result.data.data);
        setContractHardCopy(false);
      })
      .catch((err) => {
        setLoading(false);
        setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 5000);
      });
  };

  const callApiBillingHardCopy = () => {
    setLoading(true);
    getHardcopyBillingDocument(termin)
      .then((result) => {
        setLoading(false);
        setDataBillingHardCopy(result.data.data);
        setBillingHardCopy(false);
      })
      .catch((err) => {
        setLoading(false);
        setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 5000);
      });
  };

  const handleSubmit = () => {
    setLoading(true);
    const data = {
      contract_id: contract_id,
      term_id: termin,
      vendor_id: invoiceData.vendor_id,
      sub_total: invoiceData.invoice_value,
      created_by_id: user_id,
      updated_by_id: user_id,
      authority: contractAuthority,
    };
    sendNotifHardCopy({
      contract_id: contract_id,
      term_id: termin,
      user_id: user_id,
    })
      .then((response) => {
        setLoading(false);
        if (invoiceBkbExist) {
          setDialogConfirm(false);
          setToast(intl.formatMessage({ id: "REQ.SOFTCOPY_SUCCESS" }), 10000);
        } else {
          createBkb(data)
            .then((response) => {
              setInvoiceBkbExist(true);
              setDialogConfirm(false);
              setToast(
                intl.formatMessage({ id: "REQ.HARDCOPY_SUCCESS" }),
                10000
              );
              getTerminProgress(termin).then((result) => {
                setDataProgress(result.data.data?.data);
              });
            })
            .catch((error) => {
              setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 10000);
            });
        }
        SOCKET.emit("send_notif");
      })
      .catch((error) => {
        setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 10000);
        setLoading(false);
      });
  };

  const getFileContract = (name, status, ident_name) => {
    if (status === "eproc") {
      // getFileEproc({ filename: name })
      //   .then((result) => {
      //     var a = document.createElement("a");
      //     a.href = result.data.data.items.respons;
      //     a.download = name;
      //     a.click();
      //     a.remove();
      //   })
      //   .catch((error) => {
      //     setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 5000);
      //   });
      window.open(API_EPROC + "/" + name, "_blank");
    } else if (status === "ruby") {
      window.open(DEV_RUBY + name, "_blank");
    } else if (status === "monitoring") {
      window.open(
        DEV_NODE +
        `/invoice/get_file_softcopy?filename=${name}&ident_name=${ident_name}`,
        "_blank"
      );
    } else if (status === "delivery") {
      window.open(DEV_NODE + "/" + name, "_blank");
    } else if (status === "link") {
      window.open(name.includes("http") ? name : `http://${name}`, "_blank");
    }
  };

  const handleApproved = () => {
    setModalApproved({ ...modalApproved, loading: true });
    var data = {
      hardcopy_approved_by_id: user_id,
      term_id: termin,
      contract_id: contract_id,
    };
    const document_monitoring_id = modalApproved.data.document_monitoring
      ? modalApproved.data.document_monitoring.id
      : modalApproved.data.document_monitoring_id;
    approveHardCopy(document_monitoring_id, data)
      .then((results) => {
        setModalApproved({
          ...modalApproved,
          statusReq: true,
          loading: true,
        });
        setTimeout(() => {
          if (modalApproved.data.document_monitoring) {
            callApi();
          } else {
            callApiContractSoftCopy();
            callApiBillingHardCopy();
          }
          getTerminProgress(termin).then((result) => {
            setDataProgress(result.data.data?.data);
          });
          setModalApproved({
            ...modalApproved,
            statusDialog: false,
            loading: false,
          });
        }, 2500);
        SOCKET.emit("send_notif");
      })
      .catch((err) => {
        setModalApproved({
          ...modalApproved,
          loading: true,
        });
        setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 5000);
      });
  };

  const handleRejected = () => {
    setModalReject({ ...modalReject, loading: true });
    var note = document.getElementById("commentRejected").value;
    var data = {
      document_monitoring_id: modalReject.data.document_monitoring
        ? modalReject.data.document_monitoring.id
        : modalReject.data.document_monitoring_id,
      contract_id: contract_id,
      term_id: termin,
      document_id: modalReject.data.document_monitoring
        ? modalReject.data.document_monitoring.document_id
        : modalReject.data.document_id,
      deliverables_id: modalReject.data.document_monitoring
        ? modalReject.data.document_monitoring.deliverables_id
        : modalReject.data.deliverables_id,
      document_no: modalReject.data.document_monitoring
        ? modalReject.data.document_monitoring.document_no
        : modalReject.data.document_no,
      created_at: modalReject.data.document_monitoring
        ? modalReject.data.document_monitoring.created_at
        : modalReject.data.created_at,
      created_by_id: modalReject.data.document_monitoring
        ? modalReject.data.document_monitoring.created_by_id
        : modalReject.data.created_by_id,
      rejected_by_id: user_id,
      rejected_remark: note,
    };
    rejectHardCopyStatus(data.document_monitoring_id, {})
      .then((result) => {
        rejectHardCopyHistory(data)
          .then((results) => {
            setModalReject({
              ...modalReject,
              statusReq: true,
              loading: true,
            });
            setTimeout(() => {
              if (modalReject.data.document_monitoring) {
                callApi();
              } else {
                callApiContractSoftCopy();
                callApiBillingHardCopy();
              }
              setModalReject({
                ...modalReject,
                statusDialog: false,
                loading: false,
              });
              document.getElementById("commentRejected").value = "";
            }, 2500);
            SOCKET.emit("send_notif");
          })
          .catch((err) => {
            setModalReject({
              ...modalReject,
              loading: false,
            });
            setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 5000);
          });
      })
      .catch((err) => {
        setModalReject({
          ...modalReject,
          loading: false,
        });
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

  useEffect(callApi, []);
  useEffect(callApiContractSoftCopy, []);
  useEffect(callApiBillingHardCopy, []);
  useEffect(checkBkb, []);
  useEffect(getInvoiceData, []);
  useEffect(getContractAuthorityData, []);

  const print = () => {
    var printContents = window.$("#printPerlengkapan").html();
    window.$("#printPerlengkapan").removeClass("px-5");
    window.$("#printPerlengkapan").removeClass("mx-5");
    window.$("#printPerlengkapan").removeClass("d-none");
    window.$("#root").css("display", "none");
    window.$("#print-content").addClass("p-5");
    window.$("#print-content").html(printContents);
    window.print();
    window.$("#root").removeAttr("style");
    window.$("#printPerlengkapan").addClass("px-5");
    window.$("#printPerlengkapan").addClass("mx-5");
    window.$("#printPerlengkapan").addClass("d-none");
    window.$("#print-content").removeClass("p-5");
    window.$("#print-content").html("");
  };

  const callApiSaGr = () => {
    getSaGr(termin)
      .then((result) => {
        setContent((prev) => ({
          ...prev,
          ...result.data.data,
        }));
      })
      .catch((err) => {
        setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 5000);
      });
  };
  useEffect(callApiSaGr, []);

  const printSaGr = (ident_name) => {
    var printContents = window.$(`#${ident_name}`).html();
    window.$("#root").css("display", "none");
    window.$("#print-content").addClass("p-5");
    window.$("#print-content").html(printContents);
    window.print();
    window.$("#root").removeAttr("style");
    window.$("#print-content").removeClass("p-5");
    window.$("#print-content").html("");
  };

  return (
    <React.Fragment>
      <div id="GOODS" className="d-none">
        <GoodReceipt data={content} loading={false} />
      </div>
      <div id="SA" className="d-none">
        <ServiceAcceptance data={content} loading={false} />
      </div>
      <Toast />
      {loading && <LinearProgress color="secondary" className="rounded" />}
      <Dialog
        open={dialogConfirm}
        TransitionComponent={Transition}
        keepMounted
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        maxWidth="xs"
        fullWidth={true}
        style={{ zIndex: "1301" }}
      >
        <DialogTitle id="alert-dialog-slide-title">
          <FormattedMessage id="TITLE.CONFIRMATION" />{" "}
        </DialogTitle>
        <DialogContent>
          Apakah Anda yakin ingin melakukan{" "}
          <span className="font-weight-bold">Send Notif</span> ?
        </DialogContent>
        <DialogActions>
          <button
            className="btn btn-secondary"
            onClick={() => {
              setDialogConfirm(false);
            }}
            disabled={loading}
          >
            Kembali
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="btn btn-sm btn-primary mr-2"
            disabled={loading}
          >
            Ya
          </button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={modalApproved.statusDialog}
        TransitionComponent={Transition}
        keepMounted
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        maxWidth="xs"
        fullWidth={true}
      >
        <DialogTitle>
          <FormattedMessage id="TITLE.CONFIRMATION" />
        </DialogTitle>
        <DialogContent>
          <FormattedMessage id="TITLE.NOTIF_ACTION_CHANGES" />
        </DialogContent>
        <DialogActions>
          <button
            className="btn btn-primary"
            type="button"
            disabled={modalApproved.loading}
            onClick={() => {
              handleApproved();
            }}
          >
            {!modalApproved.loading && (
              <span>
                <FormattedMessage id="TITLE.SAVE" />
              </span>
            )}
            {modalApproved.loading &&
              (modalApproved.statusReq && modalApproved.loading ? (
                <div>
                  <span>
                    <FormattedMessage id="TITLE.UPDATE_DATA_SUCCESS" />
                  </span>
                  <span className="ml-2 fas fa-check"></span>
                </div>
              ) : (
                <div>
                  <span>
                    <FormattedMessage id="TITLE.WAITING" />
                  </span>
                  <span className="ml-2 mr-4 spinner spinner-white"></span>
                </div>
              ))}
          </button>
          <button
            className="btn btn-danger"
            type="button"
            onClick={() => {
              setModalApproved({ ...modalApproved, statusDialog: false });
            }}
            disabled={modalApproved.loading}
          >
            <FormattedMessage id="TITLE.CANCEL" />
          </button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={modalReject.statusDialog}
        TransitionComponent={Transition}
        keepMounted
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        maxWidth="xs"
        fullWidth={true}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleRejected();
          }}
        >
          <DialogTitle id="alert-dialog-slide-title">
            <FormattedMessage id="TITLE.REJECT_DOCUMENT" />
            <span className="text-danger">
              {" " + (modalReject.data.document_name || "")}
            </span>
          </DialogTitle>
          <DialogContent>
            <p>
              <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.SPP_DOCUMENT.REJECTED.REJECT_BODY" />
            </p>
            <textarea
              rows="2"
              cols=""
              className="form-control"
              id="commentRejected"
              placeholder={intl.formatMessage({
                id:
                  "TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.SPP_DOCUMENT.REJECTED.REJECT_BODY",
              })}
              required
              disabled={modalReject.loading}
            ></textarea>
          </DialogContent>
          <DialogActions>
            <button
              className="btn btn-secondary"
              type="button"
              onClick={() =>
                setModalReject({
                  ...modalReject,
                  statusDialog: false,
                })
              }
              disabled={modalReject.loading}
            >
              <span>
                <FormattedMessage id="AUTH.GENERAL.BACK_BUTTON" />
              </span>
            </button>
            <button
              className="btn btn-danger"
              type="submit"
              disabled={modalReject.loading}
            >
              {!modalReject.loading && (
                <span>
                  <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.SPP_DOCUMENT.REJECTED.REJECT_SUBMIT" />
                </span>
              )}
              {modalReject.loading &&
                (modalReject.statusReq && modalReject.loading ? (
                  <div>
                    <span>
                      <FormattedMessage id="TITLE.UPDATE_DATA_SUCCESS" />
                    </span>
                    <span className="ml-2 fas fa-check"></span>
                  </div>
                ) : (
                  <div>
                    <span>
                      <FormattedMessage id="TITLE.WAITING" />
                    </span>
                    <span className="ml-2 mr-4 spinner spinner-white"></span>
                  </div>
                ))}
            </button>
          </DialogActions>
        </form>
      </Dialog>
      <Card>
        <CardBody>
          <ExpansionPanel
            defaultExpanded={false}
            className={classes.ExpansionPanelCard}
          >
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              className={classes.ExpansionPanelHeader}
            >
              <div className={classes.column}>
                <span className={classes.ExpansionPanelHeaderSpan}>
                  <FormattedMessage id="TITLE.DOCUMENT_BILLING" />
                </span>
              </div>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails className={classes.details}>
              {/* begin: Table */}
              <div style={{ width: "100%" }}>
                <TableOnly
                  dataHeader={headerTable}
                  loading={loading}
                  // err={err}
                  hecto={8}
                >
                  {dataBillingHardCopy.map((item, index) => {
                    return (
                      <TableRow key={index.toString()}>
                        <TableCell>{item.seq}</TableCell>
                        <TableCell>{item.document_name}</TableCell>
                        {item.doc_no ? (
                          item.doc_file ? (
                            <TableCell>
                              <a
                                href={
                                  item.doc_status == "INVOICE"
                                    ? getFileInvoice + item.doc_file
                                    : item.doc_status == "SPP"
                                      ? getFileSpp + item.doc_file
                                      : item.doc_status == "RECEIPT"
                                        ? getFileReceipt + item.doc_file
                                        : getFileTax + item.doc_file
                                }
                              >
                                {item.doc_no}
                              </a>
                            </TableCell>
                          ) : (
                            <TableCell>
                              {item.doc_no} (file tidak tersedia)
                            </TableCell>
                          )
                        ) : (
                          <TableCell></TableCell>
                        )}
                        <TableCell>
                          {item.hardcopy_approved_at
                            ? window
                              .moment(new Date(item.hardcopy_approved_at))
                              .format("DD MMM YYYY")
                            : ""}
                        </TableCell>
                        <TableCell>
                          <StatusRemarks
                            status={
                              item.softcopy_state === null
                                ? "WAITING SOFTCOPY APPROVED"
                                : item.hardcopy_state === null
                                  ? "WAITING TO APPROVE"
                                  : item.hardcopy_state === "REJECTED"
                                    ? "REJECTED"
                                    : "APPROVED"
                            }
                            remarks={
                              item.hardcopy_state === "REJECTED"
                                ? item?.hardcopy_rejected_remark
                                : ""
                            }
                          />
                        </TableCell>
                        <TableCell>
                          {item.hardcopy_state === "APPROVED"
                            ? item.hardcopy_approved_by
                            : null}
                        </TableCell>
                        <TableCell>
                          {(item.hardcopy_state === null ||
                            item.hardcopy_state === "REJECTED") &&
                            item.softcopy_state !== null &&
                            statusHardCopy &&
                            approveHardCopyRole && (
                              <ButtonAction
                                data={item}
                                handleAction={handleAction}
                                ops={data_ops}
                              />
                            )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableOnly>
              </div>
              {/* end: Table */}
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel
            defaultExpanded={false}
            className={classes.ExpansionPanelCard}
          >
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              className={classes.ExpansionPanelHeader}
            >
              <div className={classes.column}>
                <span className={classes.ExpansionPanelHeaderSpan}>
                  <FormattedMessage id="TITLE.DOCUMENT_CONTRACT" />
                </span>
              </div>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails className={classes.details}>
              {/* begin: Table */}
              <div style={{ width: "100%" }}>
                <TableOnly
                  dataHeader={headerTable}
                  loading={loading}
                  // err={err}
                  hecto={8}
                >
                  {dataDocHardCopy.map((item, index) => {
                    return (
                      <TableRow key={index.toString()}>
                        <TableCell>{item.seq}</TableCell>
                        <TableCell>{item.document_name}</TableCell>
                        {item.doc_no &&
                        item.ident_name !== "GOODS" &&
                        item.ident_name !== "SA" ? (
                          item.doc_file ? (
                            <TableCell>
                              <a
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  getFileContract(
                                    item.doc_file,
                                    item.doc_status,
                                    item.ident_name
                                  );
                                }}
                              >
                                {item.doc_no}
                              </a>
                            </TableCell>
                          ) : (
                            <TableCell>
                              {item.doc_no} (file tidak tersedia)
                            </TableCell>
                          )
                        ) : item.ident_name === "GOODS" ||
                          item.ident_name === "SA" ? (
                          <TableCell>
                            <a
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                print(item.ident_name);
                              }}
                            >
                              {item.ident_name === "GOODS"
                                ? content?.task_gr_new &&
                                  content?.task_gr_new.length > 0 &&
                                  content?.task_gr_new[0].material_document
                                : content?.task_sa_new &&
                                  content?.task_sa_new.material_document}
                            </a>
                          </TableCell>
                        ) : (
                          <TableCell></TableCell>
                        )}
                        <TableCell>
                          {item.hardcopy_approved_at
                            ? window
                              .moment(new Date(item.hardcopy_approved_at))
                              .format("DD MMM YYYY")
                            : ""}
                        </TableCell>
                        <TableCell>
                          <StatusRemarks
                            status={
                              item.softcopy_state === null
                                ? "WAITING SOFTCOPY APPROVED"
                                : item.hardcopy_state === null
                                  ? "WAITING TO APPROVE"
                                  : item.hardcopy_state === "REJECTED"
                                    ? "REJECTED"
                                    : "APPROVED"
                            }
                            remarks={
                              item.hardcopy_state === "REJECTED"
                                ? item?.hardcopy_rejected_remark
                                : ""
                            }
                          />
                        </TableCell>
                        <TableCell>
                          {item.hardcopy_state === "APPROVED"
                            ? item.hardcopy_approved_by
                            : null}
                        </TableCell>
                        <TableCell>
                          {(item.hardcopy_state === null ||
                            item.hardcopy_state === "REJECTED") &&
                            item.softcopy_state !== null &&
                            statusHardCopy &&
                            approveHardCopyRole && (
                              <ButtonAction
                                data={item}
                                handleAction={handleAction}
                                ops={data_ops}
                              />
                            )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableOnly>
              </div>
              {/* end: Table */}
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel
            defaultExpanded={false}
            className={classes.ExpansionPanelCard}
          >
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              className={classes.ExpansionPanelHeader}
            >
              <div className={classes.column}>
                <span className={classes.ExpansionPanelHeaderSpan}>
                  <FormattedMessage id="CONTRACT_DETAIL.TABLE_HEAD.DELIVERABLES_DOCUMENT" />
                </span>
              </div>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails className={classes.details}>
              {/* begin: Table */}
              <div style={{ width: "100%" }}>
                <TableOnly
                  dataHeader={headerTableDeliverables}
                  loading={loadingDeliverables}
                  // err={err}
                  hecto={17}
                >
                  {dataDeliverables?.map((el, id) => {
                    // Jenis Dokumen
                    return (
                      <RowAccordion
                        key={id}
                        dataAll={el}
                        data={[
                          "accordIcon",
                          el.name,
                          "-",
                          "-",
                          "-",
                          "-",
                          "-",
                          "",
                        ]}
                      >
                        {(item) => {
                          const isPeriodic = item.is_periodic;
                          // Periode Dokumen
                          return isPeriodic
                            ? item?.periodes?.map((el, id) => (
                              <RowAccordion
                                key={id}
                                classBtn={"pl-8"}
                                dataAll={el}
                                data={[
                                  "accordIcon",
                                  el?.name,
                                  "-",
                                  "-",
                                  "-",
                                  "-",
                                  "-",
                                  "-",
                                ]}
                              >
                                {/* Dokumen */}
                                {(item2) =>
                                  item2?.documents?.map((els, idx) => {
                                    if (
                                      els?.document_monitoring
                                        ?.softcopy_state === "APPROVED"
                                    ) {
                                      return (
                                        <RowAccordion
                                          key={idx}
                                          classBtn={"pl-13"}
                                          data={[
                                            "accordIcon",
                                            els?.document_custom_name ??
                                            els?.document?.name,
                                            formatDate(
                                              new Date(els?.due_date)
                                            ),
                                            <StatusRemarks
                                              status={
                                                els?.document_monitoring
                                                  .hardcopy_state !== null
                                                  ? els?.document_monitoring
                                                    .hardcopy_state
                                                  : "WAITING TO APPROVED"
                                              }
                                              remarks={
                                                els?.document_monitoring
                                                  ?.hardcopy_history[0]
                                                  ?.rejected_re
                                              }
                                            />,
                                            els?.percentage &&
                                            els?.percentage + "%",
                                            <BtnLihat url={els?.url} />,
                                            els.document_monitoring
                                              ?.hardcopy_state === "APPROVED"
                                              ? "-"
                                              : els?.document_monitoring
                                                .hardcopy_history[0]
                                                ?.rejected_re,
                                            els?.url &&
                                            (els.document_monitoring
                                              ?.hardcopy_state === null ||
                                              els.document_monitoring
                                                ?.hardcopy_state ===
                                              "REJECTED") &&
                                            statusHardCopy &&
                                            approveHardCopyRole && (
                                              <ButtonAction
                                                data={els}
                                                handleAction={
                                                  handleActionDeliverable
                                                }
                                                ops={data_opsDeliverable}
                                              />
                                            ),
                                          ]}
                                        />
                                      );
                                    }
                                  })
                                }
                              </RowAccordion>
                            ))
                            : item?.documents?.map((el, id) => {
                              if (
                                el?.document_monitoring?.softcopy_state ===
                                "APPROVED"
                              ) {
                                return (
                                  <RowAccordion
                                    //  Dokumen
                                    key={id}
                                    classBtn={"pl-13"}
                                    data={[
                                      "accordIcon",
                                      el?.document_custom_name ??
                                      el?.document?.name,
                                      formatDate(new Date(el?.due_date)),
                                      <StatusRemarks
                                        status={
                                          el?.document_monitoring
                                            .hardcopy_state !== null
                                            ? el?.document_monitoring
                                              .hardcopy_state
                                            : "WAITING TO APPROVED"
                                        }
                                        remarks={
                                          el?.document_monitoring
                                            ?.hardcopy_history[0]?.rejected_re
                                        }
                                      />,
                                      // el?.percentage && el?.percentage + "%",
                                      "-",
                                      <BtnLihat url={el?.url} />,
                                      el?.remarks,
                                      el?.url &&
                                      (el.document_monitoring
                                        ?.hardcopy_state === null ||
                                        el.document_monitoring
                                          ?.hardcopy_state ===
                                        "REJECTED") &&
                                      statusHardCopy &&
                                      approveHardCopyRole && (
                                        <ButtonAction
                                          data={el}
                                          handleAction={
                                            handleActionDeliverable
                                          }
                                          ops={data_opsDeliverable}
                                        />
                                      ),
                                    ]}
                                  />
                                );
                              }
                            });
                        }}
                      </RowAccordion>
                    );
                  })}
                </TableOnly>
              </div>
              {/* end: Table */}
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </CardBody>
        <CardFooter>
          <button
            type="button"
            className="btn btn-sm btn-primary mx-1"
            onClick={() => {
              setDialogConfirm(true);
            }}
            disabled={
              loading || statusHardCopyNoStarted || !approveHardCopyRole
            }
          >
            Send Notif
          </button>
          {/* <button
            type="button"
            className="btn btn-sm btn-primary mx-1"
            onClick={print}
            disabled={
              loading ||
              billingHardCopy ||
              deliverableHardCopy ||
              contractHardCopy
            }
          >
            {billingHardCopy || deliverableHardCopy || contractHardCopy ? (
              <i className="fas fa-spinner fa-pulse px-1"></i>
            ) : null}
            Print Kelengkapan Dokumen
          </button> */}
        </CardFooter>
      </Card>
      <div className="px-5 mx-5 d-none" id="printPerlengkapan">
        <div>
          <div className="row">
            <div className="col-sm-12">
              <h6 className="text-uppercase text-center">
                <FormattedMessage id="TITLE.PAYMENT_RECEIPT" />
              </h6>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-4 d-flex align-items-center">
              <img
                src={toAbsoluteUrl("/media/logos/logo-eprocurement.png")}
                style={{ width: 300 }}
                alt="IconGde"
              />
            </div>
            <div className="col-sm-8">
              <div className="form-group row mb-1">
                <label className="col-sm-4 col-form-label">
                  <FormattedMessage id="TITLE.USER_MANAGEMENT.PIC_ROLES.VENDOR_NAME" />
                </label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    className="form-control"
                    defaultValue={contractData?.full_name}
                    readOnly
                  />
                </div>
              </div>
              <div className="form-group row mb-1">
                <label className="col-sm-4 col-form-label">
                  <FormattedMessage id="CONTRACT_DETAIL.TABLE_HEAD.SCOPE_OF_WORK" />
                </label>
                <div className="col-sm-8">
                  <textarea
                    readOnly
                    className="form-control"
                    defaultValue={contractData?.termin_name}
                  ></textarea>
                </div>
              </div>
              <div className="form-group row mb-1">
                <label className="col-sm-4 col-form-label">
                  <FormattedMessage id="CONTRACT_DETAIL.TAB.PRICE" />
                </label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    className="form-control"
                    value={rupiah(contractData?.termin_value)}
                    onChange={(e) => {}}
                    readOnly
                  />
                </div>
              </div>
              <div className="form-group row mb-1">
                <label className="col-sm-4 col-form-label">Tanggal Masuk</label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    className="form-control"
                    defaultValue="25 Maret 2020"
                    readOnly
                  />
                </div>
              </div>
              <div className="form-group row mb-1">
                <label className="col-sm-4 col-form-label">
                  Jatuh Tempo Pembayaran
                </label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    className="form-control"
                    defaultValue="25 Maret 2020 - 30 Maret 2020"
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-3">
            <div className="row">
              <div className="col-sm-4">
                <h6 className="font-weight-bold">
                  <FormattedMessage id="TITLE.ATTACHMENT_DOC" />
                </h6>
              </div>
              <div className="col-sm-3">
                <h6 className="font-weight-bold">
                  <FormattedMessage id="LABEL.DOCUMENT_DATE" />
                </h6>
              </div>
              <div className="col-sm-5">
                <h6 className="font-weight-bold">
                  <FormattedMessage id="TITLE.INFORMATION" />
                </h6>
              </div>
            </div>
            {dataDocHardCopy.map((item, index) => {
              return (
                <div className="row mt-3" key={index.toString()}>
                  <div className="col-sm-4">
                    <label
                      className={
                        item.hardcopy_state === "APPROVED"
                          ? "checkboxs-true"
                          : item.hardcopy_state === "REJECTED"
                            ? "checkboxs-false"
                            : "checkboxs"
                      }
                    >
                      <input
                        type="checkbox"
                        checked={true}
                        onChange={(e) => {}}
                      />
                      <span></span>
                    </label>
                    <span className="ml-2">{item.document_name}</span>
                  </div>
                  <div className="col-sm-3 border-bottom">
                    <span>
                      {item.hardcopy_approved_at
                        ? window
                          .moment(new Date(item.hardcopy_approved_at))
                          .format("DD MMM YYYY")
                        : null}
                    </span>
                  </div>
                  <div className="col-sm-5 border-bottom">
                    <span>
                      {item.hardcopy_state === "REJECTED"
                        ? item.hardcopy_rejected_remark
                        : null}
                    </span>
                  </div>
                </div>
              );
            })}
            {dataDeliverables?.map((item, index) => {
              const isPeriodic = item.is_periodic;
              return isPeriodic
                ? item?.periodes?.map((els, idx) => {
                  return (
                    <div key={idx.toString()}>
                      <div className="row mt-3">
                        <div className="col-sm-4">
                          <label className="checkboxs-minus">
                            <input
                              type="checkbox"
                              checked={true}
                                onChange={(e) => {}}
                            />
                            <span></span>
                          </label>
                          <span className="ml-2">
                            {item.name + " - " + els.name}
                          </span>
                        </div>
                        <div className="col-sm-3 border-bottom">
                          <span></span>
                        </div>
                        <div className="col-sm-5 border-bottom">
                          <span></span>
                        </div>
                      </div>
                      {els.documents.map((el, id) => {
                        if (
                          el?.document_monitoring?.softcopy_state ===
                          "APPROVED"
                        ) {
                          return (
                            <div className="row mt-2" key={id.toString()}>
                              <div className="col-sm-4">
                                <label
                                  className={
                                    el?.document_monitoring
                                      ?.hardcopy_state === "APPROVED"
                                      ? "checkboxs-true"
                                      : el?.document_monitoring
                                        ?.hardcopy_state === "REJECTED"
                                        ? "checkboxs-false"
                                        : "checkboxs"
                                  }
                                >
                                  <input
                                    type="checkbox"
                                    checked={true}
                                      onChange={(e) => {}}
                                  />
                                  <span></span>
                                </label>
                                <span>
                                  {el.document.name +
                                    " - " +
                                    window
                                      .moment(new Date(el.due_date))
                                      .format("DD MMM YYYY")}
                                </span>
                              </div>
                              <div className="col-sm-3 border-bottom">
                                <span>
                                  {el?.document_monitoring
                                    ?.hardcopy_approved_at
                                    ? window
                                      .moment(
                                        new Date(
                                          el?.document_monitoring?.hardcopy_approved_at
                                        )
                                      )
                                      .format("DD MMM YYYY")
                                    : null}
                                </span>
                              </div>
                              <div className="col-sm-5 border-bottom">
                                <span>
                                  {el?.document_monitoring?.hardcopy_state ===
                                    "REJECTED"
                                    ? el?.document_monitoring
                                      ?.hardcopy_history.length > 0 &&
                                    el?.document_monitoring
                                      ?.hardcopy_history[
                                      el?.document_monitoring
                                        ?.hardcopy_history.length - 1
                                    ].rejected_re
                                    : null}
                                </span>
                              </div>
                            </div>
                          );
                        }
                      })}
                    </div>
                  );
                })
                : item?.documents?.map((el, id) => {
                  if (
                    el?.document_monitoring?.softcopy_state === "APPROVED"
                  ) {
                    return (
                      <div className="row mt-3" key={id.toString()}>
                        <div className="col-sm-4">
                          <label
                            className={
                              el.document_monitoring.hardcopy_state ===
                                "APPROVED"
                                ? "checkboxs-true"
                                : el.document_monitoring.hardcopy_state ===
                                  "REJECTED"
                                  ? "checkboxs-false"
                                  : "checkboxs"
                            }
                          >
                            <input
                              type="checkbox"
                              checked={true}
                                onChange={(e) => {}}
                            />
                            <span></span>
                          </label>
                          <span className="ml-2">{el.document.name}</span>
                        </div>
                        <div className="col-sm-3 border-bottom">
                          <span>
                            {el?.document_monitoring?.hardcopy_approved_at
                              ? window
                                .moment(
                                  new Date(
                                    el?.document_monitoring?.hardcopy_approved_at
                                  )
                                )
                                .format("DD MMM YYYY")
                              : null}
                          </span>
                        </div>
                        <div className="col-sm-5 border-bottom">
                          <span>
                            {el?.document_monitoring?.hardcopy_state ===
                              "REJECTED"
                              ? el?.document_monitoring?.hardcopy_history
                                .length > 0 &&
                              el?.document_monitoring?.hardcopy_history[
                                el?.document_monitoring?.hardcopy_history
                                  .length - 1
                              ].rejected_re
                              : null}
                          </span>
                        </div>
                      </div>
                    );
                  }
                });
            })}
            {dataBillingHardCopy.map((item, index) => {
              return (
                <div className="row mt-3" key={index.toString()}>
                  <div className="col-sm-4">
                    <label
                      className={
                        item.hardcopy_state === "APPROVED"
                          ? "checkboxs-true"
                          : item.hardcopy_state === "REJECTED"
                            ? "checkboxs-false"
                            : "checkboxs"
                      }
                    >
                      <input
                        type="checkbox"
                        checked={true}
                        onChange={(e) => {}}
                      />
                      <span></span>
                    </label>
                    <span className="ml-2">{item.document_name}</span>
                  </div>
                  <div className="col-sm-3 border-bottom">
                    <span>
                      {item.hardcopy_approved_at
                        ? window
                          .moment(new Date(item.hardcopy_approved_at))
                          .format("DD MMM YYYY")
                        : null}
                    </span>
                  </div>
                  <div className="col-sm-5 border-bottom">
                    <span>
                      {item.hardcopy_state === "REJECTED"
                        ? item.hardcopy_rejected_remark
                        : null}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="row mt-4">
            <div className="col-sm-12">
              <span className="font-italic">
                *Proses pembayaran dihitung sejak dokumen penagihan diterima
                dengan lengkap
              </span>
            </div>
          </div>
          <div className="row mt-5">
            <div className="col-sm-6">
              <span>Disertakan Oleh</span>
              <div
                className="w-50 border-bottom"
                style={{ minHeight: 80 }}
              ></div>
            </div>
            <div className="col-sm-6">
              <span>DIterima Oleh</span>
              <div
                className="w-50 border-bottom"
                style={{ minHeight: 80 }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
export default injectIntl(connect(null, null)(ContractHardCopyDoc));
