import React, { useState, useEffect, useCallback } from "react";
import { connect, useSelector, shallowEqual } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../_metronic/_partials/controls";
import Navs from "../../../../components/navs";
import ContractInvoicePage from "./ContractBillingDocument/ContractInvoicePage";
import ContractSprPage from "./ContractBillingDocument/ContractSprPage";
import ContractReceiptPage from "./ContractBillingDocument/ContractReceiptPage";
import ContractTaxPage from "./ContractBillingDocument/ContractTaxPage";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-perfect-scrollbar/dist/css/styles.css";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
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
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ButtonAction from "../../../../components/buttonAction/ButtonAction";
import RowAccordion from "../../../DeliveryMonitoring/pages/Termin/Documents/components/RowAccordion";
import { formatDate } from "../../../../libs/date";
import {
  getDeliverableInInvoive,
  getListDocSoftCopy,
  rejectDocId,
  softcopy_save,
  sendRejectedDocSoftCopyLast,
  sendApprovedDocSoftCopyLast,
  updateSoftCopyByUser,
  sendAddRejectedDocSoftCopy,
  sendNotifSoftCopySupportDeliverables,
  updateTerminProgressToTax,
  getTerminProgress,
  sendNotifSoftCopyRequest,
  getContractAuthority,
  getSaGr,
} from "../../_redux/InvoiceMonitoringCrud";
import useToast from "../../../../components/toast";
import { useHistory, useParams } from "react-router-dom";
import { DEV_NODE, DEV_RUBY, API_EPROC } from "../../../../../redux/BaseHost";
import TableOnly from "../../../../components/tableCustomV1/tableOnly";
import { SOCKET } from "../../../../../redux/BaseHost";
import {
  getRolesAcceptance,
  getRolesAcceptanceTax,
  getRolesAudit,
} from "../../../Master/service/MasterCrud";
import {
  ServiceAcceptance,
  GoodReceipt,
} from "../../../DeliveryMonitoring/pages/Termin/ServiceAccGR/components";
import * as reducer from "../../_redux/InvoiceMonitoringSlice";
import * as deliveryMonitoring from "../../../DeliveryMonitoring/service/DeliveryMonitoringCrud";
import ModalAddDeliverables from "../../../DeliveryMonitoring/pages/Termin/Documents/components/ModalAddDeliverables";

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

const data_ops = [
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

const data_ops_send_email = [
  {
    label: "TITLE.SEND_EMAIL",
    icon: "fas fa-times-circle text-warning",
    type: "send_email",
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

export const DialogTitleFile = withStyles(styles)((props) => {
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

const navLists = [
  {
    id: 0,
    label: "SPP",
  },
  {
    id: 1,
    label: "Invoice",
  },
  {
    id: 2,
    label: "Kwitansi",
  },
  {
    id: 3,
    label: "Faktur Pajak",
  },
];

function ItemContractInvoice(props) {
  const {
    intl,
    progressTermin,
    setProgressTermin,
    dataProgress,
    setDataProgress,
  } = props;
  let tabInvoice = useSelector(
    (state) => state.invoiceMonitoring.tabInvoice,
    shallowEqual
  );
  const [navActive, setNavActive] = useState(tabInvoice.tabInvoice);
  const [dataDeliverables, setDataDeliverables] = useState([]);
  const [hasBarang, setHasBarang] = useState(false);
  const classes = useStyles();
  const { contract, termin } = useParams();
  const [Toast, setToast] = useToast();
  const history = useHistory();
  const [modalAddDeliv, setModalAddDeliv] = useState(false);
  const [loadingAddDeliv, setLoadingAddDeliv] = useState(false);
  const [loading, setLoading] = useState(false);
  const [billingStaffStatus, setBillingStaffStatus] = useState(false);
  const [taxStaffStatus, setTaxStaffStatus] = useState(false);
  const [loadingDeliverables, setLoadingDeliverables] = useState(false);
  const [dialogConfirm, setDialogConfirm] = useState(false);
  const [auditStaff, setAuditStaff] = useState(false);
  const [dataDialogConfirm, setDataDialogConfirm] = useState({
    status: 0,
    title: "",
  });
  const [modalReject, setModalReject] = useState({
    statusDialog: false,
    data: {},
    loading: false,
    statusReq: false,
  });
  const [dataDocSoftCopy, setDataDocSoftCopy] = useState([]);
  const [modalApproved, setModalApproved] = useState({
    statusDialog: false,
    data: {},
    loading: false,
    statusReq: false,
  });
  const [modalUpload, setModalUpload] = useState({
    statusDialog: false,
    data: {},
    loading: false,
    statusReq: false,
  });

  const user_id = useSelector((state) => state.auth.user.data.user_id);
  const dataUser = useSelector((state) => state.auth.user.data);
  let authStatus = useSelector((state) => state.auth.user.data.status);
  const dataBarang = useSelector(
    (state) => state.deliveryMonitoring.dataBarang
  );
  const showAddBtn = Boolean(
    dataUser.monitoring_role?.find(
      (role) =>
        role === "Verification Staff" || role === "Finance & Treasury Staff"
    )
  );
  let monitoring_role = dataUser.monitoring_role
    ? dataUser.monitoring_role
    : [];
  const [uploadFilename, setUploadFilename] = useState(
    intl.formatMessage({
      id: "TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.DEFAULT_FILENAME",
    })
  );

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
  const [content, setContent] = React.useState({
    task_sa: null,
    task_gr: null,
    contract: null,
  });

  const handleActionEmail = (data) => {
    handleSendNotifRequest(data);
  };

  const handleAction = (type, data) => {
    if (type === "rejected") {
      setModalReject({ ...modalReject, statusDialog: true, data: data });
    } else if (type === "approved") {
      setModalApproved({ ...modalApproved, statusDialog: true, data: data });
    } else if (type === "upload") {
      setModalUpload({
        ...modalUpload,
        statusDialog: true,
        data: data,
      });
    }
  };

  const handleActionDeliverable = (type, data) => {
    if (type === "rejected") {
      setModalReject({ ...modalReject, statusDialog: true, data: data });
    } else if (type === "approved") {
      setModalApproved({ ...modalApproved, statusDialog: true, data: data });
    }
  };

  const handleActionDeliverableEmail = (data) => {
    const new_data = {
      document_name: data.document.name,
      ident_name: "DELIVERABLES",
    };
    handleSendNotifRequest(new_data);
  };

  const handleAcceptSoftcopy = () => {
    setLoading(true);
    updateTerminProgressToTax({
      term_id: termin,
      created_by_id: user_id,
      contract_id: contract,
    })
      .then((result) => {
        setProgressTermin(result.data.data.progress_id);
        setDataProgress(result.data.data.data);
        SOCKET.emit("send_notif");
        setLoading(false);
        setDialogConfirm(false);
        setToast(intl.formatMessage({ id: "REQ.UPDATE_SUCCESS" }), 5000);
      })
      .catch((error) => {
        setLoading(false);
        setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 5000);
      });
  };

  const handleSendNotif = () => {
    sendNotifSoftCopySupportDeliverables(termin, { created_by_id: user_id })
      .then((result) => {
        setLoading(false);
        if (result.data.message == "OK") {
          setDialogConfirm(false);
          setToast(intl.formatMessage({ id: "REQ.SOFTCOPY_SUCCESS" }), 5000);
        } else {
          setToast(intl.formatMessage({ id: "REQ.SOFTCOPY_FAILED" }), 5000);
        }
      })
      .catch((error) => {
        setLoading(false);
        setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 5000);
      });
  };

  const handleSendNotifRequest = (row) => {
    sendNotifSoftCopyRequest({
      type:
        row.ident_name === "CONTRACT" || row.ident_name === "PO"
          ? "kewenangan"
          : row.ident_name === "NPWP"
          ? "vendor"
          : "pengguna",
      document_name: row.document_name,
      contract_id: contract,
    })
      .then((result) => {
        setLoading(false);
        setToast(intl.formatMessage({ id: "REQ.SOFTCOPY_SUCCESS" }), 5000);
      })
      .catch((error) => {
        setLoading(false);
        setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 5000);
      });
  };

  const callApi = () => {
    setLoadingDeliverables(true);
    getDeliverableInInvoive(termin)
      .then((result) => {
        setLoadingDeliverables(false);
        setDataDeliverables(result.data.data.task_documents);
        setHasBarang(result.data.data.has_item);
      })
      .catch((error) => {
        setLoadingDeliverables(false);
        setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 5000);
      });
  };

  const callApiContractSoftCopy = () => {
    setLoading(true);
    getListDocSoftCopy(contract, termin, "SOFTCOPY")
      .then((result) => {
        setLoading(false);
        setDataDocSoftCopy(result.data.data);
      })
      .catch((err) => {
        setLoading(false);
        setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 5000);
      });
    // getContractSoftCopy(contract)
    //   .then((result) => {
    //     setLoading(false);
    //     setDataSoftCopy(result.data.data);
    //     if (result.data.data.contract_status === "SPK") {
    //       getContractDistributionSPKData();
    //     } else {
    //       getContractDistributionAgreementData();
    //     }
    //   })
    //   .catch((error) => {
    //     setLoading(false);
    //     setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 5000);
    //   });
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

  const getContractAuthorityData = useCallback(() => {
    getContractAuthority(termin)
      .then((response) => {
        if (response["data"]["data"]) {
          getRolesAcceptance(response["data"]["data"]["authority"]).then(
            (responseRoles) => {
              responseRoles["data"]["data"].map((item, index) => {
                if (
                  monitoring_role.findIndex(
                    (element) => element === item.name
                  ) >= 0
                ) {
                  setBillingStaffStatus(true);
                }
              });
            }
          );
          getRolesAcceptanceTax(response["data"]["data"]["authority"]).then(
            (responseRoles) => {
              responseRoles["data"]["data"].map((item, index) => {
                if (
                  monitoring_role.findIndex(
                    (element) => element === item.name
                  ) >= 0
                ) {
                  setTaxStaffStatus(true);
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

  const BtnLihat = ({ url }) => {
    const handleOpen = React.useCallback(() => {
      window.open(DEV_NODE + "/" + url, "_blank");
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

  const handleApproved = () => {
    setModalApproved({ ...modalApproved, loading: true });
    var data_1 = {
      contract_id: contract,
      term_id: termin,
      softcopy_state: "APPROVED",
      document_id: modalApproved.data.document_id,
      document_no: modalApproved.data.doc_no,
      created_by_id: user_id,
      filename: modalApproved.data.doc_file,
      ident_name: modalApproved.data.ident_name,
    };
    var data_2 = {
      softcopy_approved_by_id: user_id,
      term_id: termin,
      contract_id: contract,
    };
    if (modalApproved.data.softcopy_state === null) {
      softcopy_save(data_1)
        .then((result) => {
          setModalApproved({
            ...modalApproved,
            statusReq: true,
            loading: true,
          });
          getTerminProgress(termin).then((result) => {
            if (result.data.data.data) {
              setDataProgress(result.data.data?.data);
            }
          });
          setTimeout(() => {
            callApiContractSoftCopy();
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
    } else {
      sendApprovedDocSoftCopyLast(
        modalApproved.data.document_monitoring_id,
        data_2
      )
        .then((results) => {
          setModalApproved({
            ...modalApproved,
            statusReq: true,
            loading: true,
          });
          getTerminProgress(termin).then((result) => {
            if (result.data.data.data) {
              setDataProgress(result.data.data?.data);
            }
          });
          setTimeout(() => {
            callApiContractSoftCopy();
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
    }
  };

  const handleApprovedDeliverble = () => {
    setModalApproved({ ...modalApproved, loading: true });
    var data_1 = {
      contract_id: contract,
      term_id: termin,
      softcopy_state: "APPROVED",
      deliverables_id: modalApproved.data.id,
      document_no: modalApproved.data.document.name,
      document_id: modalApproved.data.document_id,
      created_by_id: user_id,
    };
    var data_2 = {
      softcopy_approved_by_id: user_id,
      term_id: termin,
      contract_id: contract,
    };
    if (modalApproved.data.document_monitoring === null) {
      softcopy_save(data_1)
        .then((result) => {
          callApi();
          setModalApproved({
            ...modalApproved,
            statusReq: true,
            loading: true,
          });
          getTerminProgress(termin).then((result) => {
            if (result.data.data.data) {
              setDataProgress(result.data.data?.data);
            }
          });
          setTimeout(() => {
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
    } else {
      sendApprovedDocSoftCopyLast(
        modalApproved.data.document_monitoring.id,
        data_2
      )
        .then((results) => {
          callApi();
          setModalApproved({
            ...modalApproved,
            statusReq: true,
            loading: true,
          });
          getTerminProgress(termin).then((result) => {
            if (result.data.data.data) {
              setDataProgress(result.data.data?.data);
            }
          });
          setTimeout(() => {
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
    }
  };

  const handleRejected = () => {
    setModalReject({ ...modalReject, loading: true });
    var note = document.getElementById("commentRejected").value;
    var data_1 = {
      contract_id: contract,
      term_id: termin,
      softcopy_state: "REJECTED",
      document_id: modalReject.data.document_id,
      document_no: modalReject.data.doc_no,
      created_by_id: user_id,
      filename: modalReject.data.doc_file,
      ident_name: modalReject.data.ident_name,
    };
    var data_2 = {
      document_monitoring_id: "",
      contract_id: contract,
      term_id: termin,
      document_id: modalReject.data.document_id,
      document_no: modalReject.data.doc_no,
      created_at: window.moment(new Date()).format("YYYY-MM-DD"),
      created_by_id: user_id,
      rejected_by_id: user_id,
      rejected_remark: note,
      filename: modalReject.data.doc_file,
    };
    if (modalReject.data.softcopy_state === null) {
      softcopy_save(data_1)
        .then((result) => {
          data_2.document_monitoring_id = result.data.data.id;
          sendRejectedDocSoftCopyLast(data_2)
            .then((results) => {
              setModalReject({
                ...modalReject,
                statusReq: true,
                loading: true,
              });
              setTimeout(() => {
                callApiContractSoftCopy();
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
    } else {
      data_2.document_monitoring_id = modalReject.data.document_monitoring_id;
      sendAddRejectedDocSoftCopy(
        modalReject.data.document_monitoring_id,
        user_id
      )
        .then((results) => {
          sendRejectedDocSoftCopyLast(data_2)
            .then((results) => {
              setModalReject({
                ...modalReject,
                statusReq: true,
                loading: true,
              });
              setTimeout(() => {
                callApiContractSoftCopy();
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
    }
  };

  const handleRejectedDeliverable = () => {
    setModalReject({ ...modalReject, loading: true });
    var note = document.getElementById("commentRejected").value;
    var data_1 = {
      contract_id: contract,
      term_id: termin,
      softcopy_state: "REJECTED",
      document_id: modalReject.data.document_id,
      deliverables_id: modalReject.data.id,
      document_no: modalReject.data.document.name,
      created_by_id: user_id,
    };
    var data_2 = {
      document_monitoring_id: "",
      contract_id: contract,
      term_id: termin,
      deliverables_id: modalReject.data.id,
      document_no: modalReject.data.document.name,
      document_id: modalReject.data.document_id,
      created_at: window.moment(new Date()).format("YYYY-MM-DD"),
      created_by_id: user_id,
      rejected_by_id: user_id,
      rejected_remark: note,
      filename: modalReject.data.url,
    };
    if (modalReject.data.document_monitoring === null) {
      softcopy_save(data_1)
        .then((result) => {
          data_2.document_monitoring_id = result.data.data.id;
          sendRejectedDocSoftCopyLast(data_2)
            .then((results) => {
              rejectDocId(modalReject.data.id, note)
                .then((results) => {
                  callApi();
                  setModalReject({
                    ...modalReject,
                    statusReq: true,
                    loading: true,
                  });
                  setTimeout(() => {
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
                  setToast(
                    intl.formatMessage({ id: "REQ.REQUEST_FAILED" }),
                    5000
                  );
                });
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
    } else {
      data_2.document_monitoring_id = modalReject.data.document_monitoring.id;
      sendAddRejectedDocSoftCopy(
        modalReject.data.document_monitoring.id,
        user_id
      )
        .then((results) => {
          sendRejectedDocSoftCopyLast(data_2)
            .then((results) => {
              rejectDocId(modalReject.data.id, note)
                .then((results) => {
                  callApi();
                  setModalReject({
                    ...modalReject,
                    statusReq: true,
                    loading: true,
                  });
                  setTimeout(() => {
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
                  setToast(
                    intl.formatMessage({ id: "REQ.REQUEST_FAILED" }),
                    5000
                  );
                });
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
    }
  };

  const handleUpload = (e) => {
    e.preventDefault();
    setModalUpload({ ...modalUpload, loading: true });
    var data = new FormData();
    data.append("file", modalUpload.data.newFile);
    data.append("created_by_id", user_id);
    data.append("ident_name", modalUpload.data.ident_name);
    updateSoftCopyByUser(modalUpload.data.document_monitoring_id, data)
      .then((results) => {
        setModalUpload({
          ...modalUpload,
          statusReq: true,
          loading: true,
        });
        setTimeout(() => {
          callApiContractSoftCopy();
          setModalUpload({
            ...modalUpload,
            statusDialog: false,
            data: {},
            loading: false,
          });
          setUploadFilename(
            intl.formatMessage({
              id: "TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.DEFAULT_FILENAME",
            })
          );
        }, 2500);
      })
      .catch((err) => {
        setModalUpload({
          ...modalUpload,
          loading: false,
        });
        setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 5000);
      });
  };

  const getRolesAuditData = useCallback(() => {
    getRolesAudit()
      .then((responseRoles) => {
        responseRoles["data"]["data"].map((item, index) => {
          if (
            monitoring_role.findIndex((element) => element === item.name) >= 0
          ) {
            setAuditStaff(true);
          }
        });
      })
      .catch((error) => {
        setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 5000);
      });
  }, [intl, setToast]);
  let acceptSoftcopyStatus = false;
  let ApproveSoftcopyStatus = false;
  if (dataProgress.length > 0) {
    const indexBillingSoftCopy = dataProgress?.findIndex(
      (row) => row.ident_name == "BILLING_SOFTCOPY"
    );
    const indexTaxSoftCopy = dataProgress?.findIndex(
      (row) => row.ident_name == "TAX"
    );
    const dataBillingSoftCopy = JSON.parse(JSON.stringify(dataProgress));
    acceptSoftcopyStatus =
      dataBillingSoftCopy[indexBillingSoftCopy].status !== "COMPLETE" ||
      dataBillingSoftCopy[indexTaxSoftCopy].status !== "NO STARTED";
    ApproveSoftcopyStatus =
      dataBillingSoftCopy[indexBillingSoftCopy].status === "NO STARTED";
  }

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
  useEffect(callApi, []);
  useEffect(callApiContractSoftCopy, []);
  useEffect(getContractAuthorityData, []);
  useEffect(getRolesAuditData, []);
  useEffect(callApiSaGr, []);

  const handleError = React.useCallback(
    (err) => {
      setToast(err?.message ?? "Error API, please contact developer!");
    },
    [setToast]
  );
  const handleSuccess = React.useCallback(
    (res) => {
      if (res?.data?.status === true) {
        callApi();
        setToast(res?.data?.message);
      }
    },
    [setToast, callApi]
  );

  const onAddDeliverable = (params) => {
    // handle multi create document
    if (Array.isArray(params)) {
      let mappedParams = params?.map((el) => {
        let val = JSON.parse(el.value);
        return { document_id: val.id };
      });
      deliveryMonitoring
        .postCreateDocArr(termin, mappedParams)
        .then(handleSuccess)
        .catch(handleError)
        .finally(() => {
          setLoadingAddDeliv(false);
          setModalAddDeliv(false);
        });
    } else {
      // handle single create document
      let val = JSON.parse(params.value);
      deliveryMonitoring
        .postCreateDoc(termin, {
          document_id: val.id,
          document_custom_name: params.remarks,
        })
        .then(handleSuccess)
        .catch(handleError)
        .finally(() => {
          setLoadingAddDeliv(false);
          setModalAddDeliv(false);
        });
    }
  };

  const print = (id) => {
    // var printContents = window.$(`#${id}`).html();
    // window.$("#root").css("display", "none");
    // window.$("#print-content").addClass("p-5");
    // window.$("#print-content").html(printContents);
    // window.print();
    // window.$("#root").removeAttr("style");
    // window.$("#print-content").removeClass("p-5");
    // window.$("#print-content").html("");
    window
      .open(
        `${window.location.origin}/client/invoice_monitoring/contract/${contract}/${termin}/${id}`,
        "_blank"
      )
      .focus();
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
      <ModalAddDeliverables
        visible={modalAddDeliv}
        onClose={() => setModalAddDeliv(false)}
        onSubmit={(params) => onAddDeliverable(params)}
        loading={loadingAddDeliv}
      />
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
          <span className="font-weight-bold">{dataDialogConfirm.title}</span> ?
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
            onClick={() => {
              if (dataDialogConfirm.status === 0) {
                handleAcceptSoftcopy();
              } else if (dataDialogConfirm.status === 1) {
                handleSendNotif();
              }
            }}
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
              if (modalApproved.data.url) {
                handleApprovedDeliverble();
              } else {
                handleApproved();
              }
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
            if (modalReject.data.url) {
              handleRejectedDeliverable();
            } else {
              handleRejected();
            }
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
      <Dialog
        open={modalUpload.statusDialog}
        TransitionComponent={Transition}
        keepMounted
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        maxWidth="xs"
        fullWidth={true}
      >
        <form onSubmit={handleUpload}>
          <DialogTitle id="alert-dialog-slide-title">
            <FormattedMessage id="TITLE.UPLOAD" />
            <span className="text-danger">
              {" " + (modalUpload.data.document_name || "")}
            </span>
          </DialogTitle>
          <DialogContent>
            <div className="form-group row">
              <label htmlFor="upload" className="col-sm-4 col-form-label">
                <FormattedMessage id="TITLE.UPLOAD" />
              </label>
              <label
                htmlFor="upload"
                className="input-group mb-3 col-sm-8 pointer"
              >
                <div className="input-group-prepend">
                  <span className="input-group-text">
                    <i className="fas fa-file-upload"></i>
                  </span>
                </div>
                <span className={`form-control text-truncate`}>
                  {uploadFilename}
                </span>
              </label>
              <input
                type="file"
                className="d-none"
                id={modalUpload.loading ? "uploads" : "upload"}
                accept="application/pdf, .pdf"
                // onBlur={formik.handleBlur}
                onChange={(e) => {
                  if (
                    e.currentTarget.files.length &&
                    e.currentTarget.files[0].type === "application/pdf"
                  ) {
                    let data_ = Object.assign({}, modalUpload);
                    setUploadFilename(e.currentTarget.files[0].name);
                    data_.data.newFile = e.currentTarget.files[0];
                    setModalUpload({
                      ...modalUpload,
                      data: data_.data,
                    });
                  }
                }}
              />
              <span className="col-sm-8 offset-sm-3 text-center text-danger font-size-xs">
                File wajib diisi dengan extension .PDF
              </span>
            </div>
          </DialogContent>
          <DialogActions>
            <button
              className="btn btn-secondary"
              type="button"
              onClick={() => {
                setModalUpload({
                  ...modalUpload,
                  data: {},
                  statusDialog: false,
                });
                setUploadFilename(
                  intl.formatMessage({
                    id:
                      "TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.DEFAULT_FILENAME",
                  })
                );
              }}
              disabled={modalUpload.loading}
            >
              <span>
                <FormattedMessage id="AUTH.GENERAL.BACK_BUTTON" />
              </span>
            </button>
            <button
              className="btn btn-danger"
              type="submit"
              disabled={
                modalUpload.loading ||
                modalUpload.data.newFile === null ||
                modalUpload.data.newFile === undefined
              }
            >
              {!modalUpload.loading && (
                <span>
                  <FormattedMessage id="TITLE.SEND" />
                </span>
              )}
              {modalUpload.loading &&
                (modalUpload.statusReq && modalUpload.loading ? (
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

      <ExpansionPanel
        defaultExpanded={true}
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
          <div style={{ width: "100%" }}>
            <Card>
              {/* <CardHeader title="">
                <CardHeaderToolbar>
                </CardHeaderToolbar>
              </CardHeader> */}
              <CardBody>
                <Navs
                  navLists={navLists}
                  active={navActive}
                  handleSelect={(selectedKey) => {
                    tabInvoice.tabInvoice = Number(selectedKey);
                    props.set_data_tab_invaoice(tabInvoice);
                    setNavActive(selectedKey);
                  }}
                />

                {Number(navActive) === 0 && (
                  <div className="table-wrapper-scroll-y my-custom-scrollbar my-5 h-100">
                    <ContractSprPage
                      {...props}
                      classes={classes}
                      dialogTitleFile={DialogTitleFile}
                      transition={Transition}
                      billingStaffStatus={billingStaffStatus}
                    />
                  </div>
                )}

                {Number(navActive) === 1 && (
                  <div className="table-wrapper-scroll-y my-custom-scrollbar my-5 h-100">
                    <ContractInvoicePage
                      {...props}
                      classes={classes}
                      dialogTitleFile={DialogTitleFile}
                      transition={Transition}
                      billingStaffStatus={billingStaffStatus}
                    />
                  </div>
                )}

                {Number(navActive) === 2 && (
                  <div className="table-wrapper-scroll-y my-custom-scrollbar my-5 h-100">
                    <ContractReceiptPage
                      {...props}
                      classes={classes}
                      dialogTitleFile={DialogTitleFile}
                      transition={Transition}
                      billingStaffStatus={billingStaffStatus}
                    />
                  </div>
                )}

                {Number(navActive) === 3 && (
                  <div className="table-wrapper-scroll-y my-custom-scrollbar my-5 h-100">
                    <ContractTaxPage
                      {...props}
                      classes={classes}
                      dialogTitleFile={DialogTitleFile}
                      transition={Transition}
                      setTaxStaffStatus={taxStaffStatus}
                    />
                  </div>
                )}
              </CardBody>
            </Card>
          </div>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel
        defaultExpanded={true}
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
          <div style={{ width: "100%" }}>
            <TableOnly
              dataHeader={headerTable}
              loading={loading}
              // err={err}
              hecto={8}
            >
              {dataDocSoftCopy.map((item, index) => {
                return (
                  <TableRow key={index.toString()}>
                    <TableCell>{item.seq}</TableCell>
                    <TableCell>
                      {item.document_name}
                      {item.ident_name === "GOODS" &&
                      content?.task_gr_new &&
                      content?.task_gr_new.length > 0
                        ? `(${
                            content?.task_gr_new.filter(
                              (value) => value.material_document === item.doc_no
                            )[0].type
                          })`
                        : ""}
                    </TableCell>
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
                            print(
                              item.ident_name === "SA"
                                ? item.ident_name
                                : item.doc_no
                            );
                          }}
                        >
                          {item.doc_no}
                        </a>
                      </TableCell>
                    ) : (
                      <TableCell></TableCell>
                    )}
                    <TableCell>
                      {item.softcopy_approved_at
                        ? window
                            .moment(new Date(item.softcopy_approved_at))
                            .format("DD MMM YYYY")
                        : ""}
                    </TableCell>
                    <TableCell>
                      {(item.softcopy_state === "PENDING" ||
                        item.softcopy_state === null) &&
                      item.doc_file
                        ? "WAITING TO APPROVE"
                        : item.softcopy_state === "REJECTED"
                        ? "REJECTED"
                        : item.softcopy_state === "APPROVED"
                        ? "APPROVED"
                        : "WAITING"}
                    </TableCell>
                    <TableCell>
                      {item.softcopy_state === "APPROVED"
                        ? item.approved_by
                        : null}
                    </TableCell>
                    <TableCell>
                      {billingStaffStatus &&
                        (item.softcopy_state === null ||
                          item.softcopy_state === "PENDING") &&
                        item.doc_no &&
                        item.doc_file &&
                        !loading &&
                        !ApproveSoftcopyStatus && (
                          <ButtonAction
                            data={item}
                            handleAction={handleAction}
                            ops={
                              // remove reject button on SA / GR
                              item?.ident_name === "SA" ||
                              item?.ident_name === "GOODS"
                                ? data_ops.filter(
                                    (el) => el.type === "approved"
                                  )
                                : data_ops
                            }
                          />
                        )}
                      {billingStaffStatus &&
                        (!item.doc_no || !item.doc_file) &&
                        !loading &&
                        !ApproveSoftcopyStatus && (
                          <ButtonAction
                            data={item}
                            handleAction={() => handleActionEmail(item)}
                            ops={data_ops_send_email}
                          />
                        )}
                      {!auditStaff &&
                        item.softcopy_state === "REJECTED" &&
                        item.doc_no &&
                        item.seq === 1 &&
                        !ApproveSoftcopyStatus && (
                          <ButtonAction
                            data={Object.assign({}, item)}
                            handleAction={handleAction}
                            ops={data_ops_user}
                          />
                        )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableOnly>
          </div>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel
        defaultExpanded={true}
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
          <div style={{ width: "100%" }}>
            <div className="d-flex justify-content-end align-items-center w-100 mb-5">
              {authStatus === "client" && showAddBtn && (
                <button
                  className="btn btn-outline-success btn-sm"
                  onClick={() => {
                    setModalAddDeliv(!modalAddDeliv);
                  }}
                >
                  <span className="nav-icon">
                    <i className="flaticon2-plus"></i>
                  </span>
                  <span className="nav-text">Deliverables</span>
                </button>
              )}
            </div>
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
                    data={["accordIcon", el.name, "-", "-", "-", "-", "-", ""]}
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
                                  const itemHasBarang = hasBarang;
                                  const isDocStatusApproved =
                                    els?.document_status?.name === "APPROVED";
                                  const isWrDocStatusApproved =
                                    els?.wr_document_status?.name ===
                                    "APPROVED";
                                  const isInvoiceStatePending =
                                    els?.document_monitoring === null ||
                                    els?.document_monitoring?.softcopy_state ===
                                      "PENDING";
                                  return (
                                    <RowAccordion
                                      key={idx}
                                      classBtn={"pl-13"}
                                      data={[
                                        "accordIcon",
                                        els?.document_custom_name ??
                                          els?.document?.name,
                                        formatDate(new Date(els?.due_date)),
                                        <StatusRemarks
                                          status={
                                            itemHasBarang
                                              ? isDocStatusApproved &&
                                                isWrDocStatusApproved
                                                ? isInvoiceStatePending
                                                  ? "WAITING TO APPROVE"
                                                  : els?.document_status?.name
                                                : "PENDING"
                                              : isDocStatusApproved &&
                                                isInvoiceStatePending
                                              ? "WAITING TO APPROVE"
                                              : els?.document_status?.name
                                          }
                                          // status={
                                          //   els?.document_status?.name ===
                                          //     "APPROVED" && els?.wr_document_status?.name ===
                                          //     "APPROVED" &&
                                          //   (els?.document_monitoring === null ||
                                          //     els?.document_monitoring
                                          //       ?.softcopy_state === "PENDING")
                                          //     ? "WAITING TO APPROVE"
                                          //     : els?.document_status?.name
                                          // }
                                          remarks={els?.remarks_status}
                                        />,
                                        els?.percentage &&
                                          els?.percentage + "%",
                                        <BtnLihat url={els?.url} />,
                                        els?.remarks,
                                        els?.url &&
                                        (els.document_monitoring === null ||
                                          (els.document_monitoring
                                            ?.softcopy_state !== "REJECTED" &&
                                            els.document_monitoring
                                              ?.softcopy_state !==
                                              "APPROVED")) &&
                                        els.document_status?.name ===
                                          "APPROVED" &&
                                        !loading &&
                                        billingStaffStatus &&
                                        !ApproveSoftcopyStatus ? (
                                          <ButtonAction
                                            data={els}
                                            handleAction={
                                              handleActionDeliverable
                                            }
                                            ops={data_opsDeliverable}
                                          />
                                        ) : els.document_status?.name !==
                                            "APPROVED" &&
                                          billingStaffStatus &&
                                          !ApproveSoftcopyStatus ? (
                                          <ButtonAction
                                            data={els}
                                            handleAction={() =>
                                              handleActionDeliverableEmail(els)
                                            }
                                            ops={data_ops_send_email}
                                          />
                                        ) : null,
                                      ]}
                                    />
                                  );
                                })
                              }
                            </RowAccordion>
                          ))
                        : item?.documents?.map((el, id) => {
                            const itemHasBarang = hasBarang;
                            const isDocStatusApproved =
                              el?.document_status?.name === "APPROVED";
                            const isWrDocStatusApproved =
                              el?.wr_document_status?.name === "APPROVED";
                            const isInvoiceStatePending =
                              el?.document_monitoring === null ||
                              el?.document_monitoring?.softcopy_state ===
                                "PENDING";
                            const isInvoiceStateReject =
                              el?.document_monitoring === null ||
                              el?.document_monitoring?.softcopy_state ===
                                "REJECTED";

                            const isRejectByInvoice =
                              el?.document_monitoring === null ||
                              el?.document_monitoring?.softcopy_state ===
                                "REJECTED";
                            const isDocHasUploaded =
                              el?.document_monitoring === null;
                            const isApprovalDMisDone = itemHasBarang
                              ? isDocStatusApproved && isWrDocStatusApproved
                              : isDocStatusApproved;
                            // REJECT = pertama kali reject di invoice / belum upload / belum approve DM
                            // PENDING | WAITING = reject invoice / udah upload / belum approve DM
                            // WAITING TO APPROVE = reject | pending invocie / udah upload / udah approve DM
                            // APPROVE = approve di invoice

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
                                      itemHasBarang
                                        ? isDocStatusApproved &&
                                          isWrDocStatusApproved
                                          ? isInvoiceStatePending ||
                                            isInvoiceStateReject
                                            ? "WAITING TO APPROVE"
                                            : el?.document_status?.name
                                          : "PENDING"
                                        : isDocStatusApproved &&
                                          isInvoiceStatePending
                                        ? "WAITING TO APPROVE"
                                        : el?.document_status?.name
                                    }
                                    // status={
                                    //   el?.document_status?.name ===
                                    //     "APPROVED" &&
                                    //   (el?.document_monitoring === null ||
                                    //     el?.document_monitoring
                                    //       ?.softcopy_state === "PENDING")
                                    //     ? "WAITING TO APPROVE"
                                    //     : el?.document_status?.name
                                    // }
                                    remarks={el?.remarks_status}
                                  />,
                                  // el?.percentage && el?.percentage + "%",
                                  "-",
                                  <BtnLihat url={el?.url} />,
                                  el?.remarks,
                                  el?.url &&
                                  (el.document_monitoring === null ||
                                    el.document_monitoring?.softcopy_state !==
                                      "APPROVED") &&
                                  el.document_status?.name === "APPROVED" &&
                                  billingStaffStatus &&
                                  !ApproveSoftcopyStatus ? (
                                    <ButtonAction
                                      data={el}
                                      handleAction={handleActionDeliverable}
                                      ops={data_opsDeliverable}
                                    />
                                  ) : el.document_status?.name !== "APPROVED" &&
                                    billingStaffStatus &&
                                    !ApproveSoftcopyStatus ? (
                                    <ButtonAction
                                      data={el}
                                      handleAction={() =>
                                        handleActionDeliverableEmail(el)
                                      }
                                      ops={data_ops_send_email}
                                    />
                                  ) : null,
                                ]}
                              />
                            );
                          });
                    }}
                  </RowAccordion>
                );
              })}
            </TableOnly>
          </div>
        </ExpansionPanelDetails>
      </ExpansionPanel>

      <div className="text-right">
        <button
          type="button"
          onClick={() => {
            setDialogConfirm(true);
            setDataDialogConfirm({
              ...dataDialogConfirm,
              title: "Accept Softcopy",
              status: 0,
            });
          }}
          // onClick={handleAcceptSoftcopy}
          className="btn btn-sm btn-primary mr-2"
          disabled={loading || acceptSoftcopyStatus || !billingStaffStatus}
        >
          Accept Softcopy
        </button>
        <button
          type="button"
          onClick={() => {
            setDialogConfirm(true);
            setDataDialogConfirm({
              ...dataDialogConfirm,
              title: "Send Notif",
              status: 1,
            });
          }}
          // onClick={handleSendNotif}
          className="btn btn-sm btn-primary m-5"
          disabled={loading || !billingStaffStatus || ApproveSoftcopyStatus}
        >
          Send Notif
        </button>
      </div>
    </React.Fragment>
  );
}
export default injectIntl(connect(null, null)(ItemContractInvoice));
