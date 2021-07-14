import React, { useState, useEffect } from "react";
import { connect, useSelector } from "react-redux";
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
  getFileEproc,
  getListDocSoftCopy,
  rejectDocId,
  softcopy_save,
  sendRejectedDocSoftCopyLast,
  sendApprovedDocSoftCopyLast,
  updateSoftCopyByUser,
  sendAddRejectedDocSoftCopy,
  sendNotifSoftCopySupportDeliverables,
} from "../../_redux/InvoiceMonitoringCrud";
import useToast from "../../../../components/toast";
import { useParams } from "react-router-dom";
import { DEV_NODE, DEV_RUBY } from "../../../../../redux/BaseHost";
import TableOnly from "../../../../components/tableCustomV1/tableOnly";

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
    id: "SPP",
    label: "SPP",
  },
  {
    id: "Invoice",
    label: "Invoice",
  },
  {
    id: "Kwitansi",
    label: "Kwitansi",
  },
  {
    id: "Faktur",
    label: "Faktur Pajak",
  },
];

function ItemContractInvoice(props) {
  const { intl } = props;
  const [navActive, setNavActive] = useState(navLists[0].id);
  const [dataDeliverables, setDataDeliverables] = useState([]);
  const classes = useStyles();
  const { contract, termin } = useParams();
  const [Toast, setToast] = useToast();
  const [loading, setLoading] = useState(false);
  const [loadingDeliverables, setLoadingDeliverables] = useState(false);
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
  let verificationStafStatus = false;
  let monitoring_role = dataUser.monitoring_role
    ? dataUser.monitoring_role
    : [];
  verificationStafStatus =
    monitoring_role.findIndex((element) => element === "Verification Staff") >=
    0;
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

  const handleSendNotif = (type, data) => {
    sendNotifSoftCopySupportDeliverables(termin)
      .then((result) => {
        setLoading(false);
        if (result.data.message == "OK") {
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

  const callApi = () => {
    setLoadingDeliverables(true);
    getDeliverableInInvoive(termin)
      .then((result) => {
        setLoadingDeliverables(false);
        setDataDeliverables(result.data.data.task_documents);
      })
      .catch((error) => {
        setLoadingDeliverables(false);
        setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 5000);
      });
  };

  const callApiContractSoftCopy = () => {
    setLoading(true);
    getListDocSoftCopy(contract, termin)
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
      getFileEproc({ filename: name })
        .then((result) => {
          var a = document.createElement("a");
          a.href = result.data.data.items.respons;
          a.download = name;
          a.click();
          a.remove();
        })
        .catch((error) => {
          setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 5000);
        });
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
    }
  };

  useEffect(callApi, []);
  useEffect(callApiContractSoftCopy, []);

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
    };
    var data_2 = {
      softcopy_approved_by_id: user_id,
    };
    if (modalApproved.data.softcopy_state === null) {
      softcopy_save(data_1)
        .then((result) => {
          setModalApproved({
            ...modalApproved,
            statusReq: true,
            loading: true,
          });
          setTimeout(() => {
            callApiContractSoftCopy();
            setModalApproved({
              ...modalApproved,
              statusDialog: false,
              loading: false,
            });
          }, 2500);
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
          setTimeout(() => {
            callApiContractSoftCopy();
            setModalApproved({
              ...modalApproved,
              statusDialog: false,
              loading: false,
            });
          }, 2500);
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
      created_by_id: user_id,
    };
    var data_2 = {
      softcopy_approved_by_id: user_id,
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
          setTimeout(() => {
            setModalApproved({
              ...modalApproved,
              statusDialog: false,
              loading: false,
            });
          }, 2500);
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
          setTimeout(() => {
            setModalApproved({
              ...modalApproved,
              statusDialog: false,
              loading: false,
            });
          }, 2500);
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

  return (
    <React.Fragment>
      <Toast />
      {loading && <LinearProgress color="secondary" className="rounded" />}
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
                    <TableCell>{item.document_name}</TableCell>
                    {item.doc_no ? (
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
                      {dataUser?.is_finance &&
                        (item.softcopy_state === null ||
                          item.softcopy_state === "PENDING") &&
                        item.doc_no &&
                        item.doc_file && (
                          <ButtonAction
                            data={item}
                            handleAction={handleAction}
                            ops={data_ops}
                          />
                        )}
                      {!dataUser?.is_finance &&
                        item.softcopy_state === "REJECTED" &&
                        item.doc_no &&
                        item.seq === 1 && (
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
                                item2?.documents?.map((els, idx) => (
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
                                          els?.document_status?.name ===
                                            "APPROVED" &&
                                          (els?.document_monitoring === null ||
                                            els?.document_monitoring ===
                                              "PENDING")
                                            ? "WAITING TO APPROVE"
                                            : els?.document_status?.name
                                        }
                                        remarks={els?.remarks_status}
                                      />,
                                      els?.percentage && els?.percentage + "%",
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
                                          "APPROVED" && (
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
                                ))
                              }
                            </RowAccordion>
                          ))
                        : item?.documents?.map((el, id) => (
                            <RowAccordion
                              //  Dokumen
                              key={id}
                              classBtn={"pl-13"}
                              data={[
                                "accordIcon",
                                el?.document_custom_name ?? el?.document?.name,
                                formatDate(new Date(el?.due_date)),
                                <StatusRemarks
                                  status={
                                    el?.document_status?.name === "APPROVED" &&
                                    (el?.document_monitoring === null ||
                                      el?.document_monitoring === "PENDING")
                                      ? "WAITING TO APPROVE"
                                      : el?.document_status?.name
                                  }
                                  remarks={el?.remarks_status}
                                />,
                                el?.percentage && el?.percentage + "%",
                                <BtnLihat url={el?.url} />,
                                el?.remarks,
                                el?.url &&
                                  (el.document_monitoring === null ||
                                    (el.document_monitoring?.softcopy_state !==
                                      "REJECTED" &&
                                      el.document_monitoring?.softcopy_state !==
                                        "APPROVED")) &&
                                  el.document_status?.name === "APPROVED" && (
                                    <ButtonAction
                                      data={el}
                                      handleAction={handleActionDeliverable}
                                      ops={data_opsDeliverable}
                                    />
                                  ),
                              ]}
                            />
                          ));
                    }}
                  </RowAccordion>
                );
              })}
            </TableOnly>
          </div>
        </ExpansionPanelDetails>
      </ExpansionPanel>

      <Card>
        <CardHeader title="">
          <CardHeaderToolbar>
            <button
              type="button"
              onClick={handleSendNotif}
              className="btn btn-sm btn-primary"
            >
              Send Notif
            </button>
          </CardHeaderToolbar>
        </CardHeader>
        <CardBody>
          <Navs
            navLists={navLists}
            handleSelect={(selectedKey) => setNavActive(selectedKey)}
          />

          {navActive === "SPP" && (
            <div className="table-wrapper-scroll-y my-custom-scrollbar my-5 h-100">
              <ContractSprPage
                {...props}
                classes={classes}
                dialogTitleFile={DialogTitleFile}
                transition={Transition}
                verificationStafStatus={!verificationStafStatus}
              />
            </div>
          )}

          {navActive === "Invoice" && (
            <div className="table-wrapper-scroll-y my-custom-scrollbar my-5 h-100">
              <ContractInvoicePage
                {...props}
                classes={classes}
                dialogTitleFile={DialogTitleFile}
                transition={Transition}
                verificationStafStatus={!verificationStafStatus}
              />
            </div>
          )}

          {navActive === "Kwitansi" && (
            <div className="table-wrapper-scroll-y my-custom-scrollbar my-5 h-100">
              <ContractReceiptPage
                {...props}
                classes={classes}
                dialogTitleFile={DialogTitleFile}
                transition={Transition}
                verificationStafStatus={!verificationStafStatus}
              />
            </div>
          )}

          {navActive === "Faktur" && (
            <div className="table-wrapper-scroll-y my-custom-scrollbar my-5 h-100">
              <ContractTaxPage
                {...props}
                classes={classes}
                dialogTitleFile={DialogTitleFile}
                transition={Transition}
                verificationStafStatus={!verificationStafStatus}
              />
            </div>
          )}
        </CardBody>
      </Card>
    </React.Fragment>
  );
}
export default injectIntl(connect(null, null)(ItemContractInvoice));
