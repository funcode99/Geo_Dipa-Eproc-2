import React, { useState, useEffect, useCallback } from "react";
import { connect, shallowEqual, useSelector } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import {
  Card,
  CardBody,
  //   CardFooter,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../_metronic/_partials/controls";
import { toAbsoluteUrl } from "../../../../../_metronic/_helpers";
import { QRCodeG } from "../../../../components/qrCodeGenerate/QRCodeGenerate";
import {
  getBkb,
  tax_manager_approve_bkb,
  finance_manager_approve_bkb,
  finance_director_approve_bkb,
  submitParkAP,
  approveParkAP,
  submitParkBYR,
  approveParkBYR,
  getTerminProgress,
  rejectParkAP,
  updateParkAP,
  rejectParkBYR,
  updateParkBYR
} from "../../_redux/InvoiceMonitoringCrud";
import useToast from "../../../../components/toast";
import { rupiah } from "../../../../libs/currency";
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
} from "@material-ui/core";
import { getRolesBKB } from "../../../Master/service/MasterCrud";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function ItemContractBKB(props) {
  const [styleCustom] = React.useState({
    heightAppvDiv: 145,
    minHeightAppv: 80,
  });

  const { intl, setProgressTermin, setDataProgress } = props;
  const termin = props.match.params.termin;
  const [Toast, setToast] = useToast();
  const main_authority = "Pusat"
  const unit_authority = "Unit"

  const [bkbData, setBkbData] = useState(null);
  const [mainRolesBKBData, setMainRolesBKBData] = useState(null);
  const [parkApInput, setParkApInput] = useState('');
  const [parkByrInput, setParkByrInput] = useState('');

  const data_login = useSelector((state) => state.auth.user.data, shallowEqual);
  const monitoring_role = data_login.monitoring_role
    ? data_login.monitoring_role
    : [];
  const [monitoringTax] = useState(
    monitoring_role.findIndex(
      (element) => element === "Treasury Assistant Manager"
    ) >= 0
  );
  const [monitoringFinance] = useState(
    monitoring_role.findIndex((element) => element === "Finance Manager") >= 0
  );
  const [monitoringFinanceDirec] = useState(
    monitoring_role.findIndex((element) => element === "Direktur Keuangan") >= 0
  );
  const [approveBkbStaff] = useState(
    monitoring_role.findIndex((element) => element === "Accounting & Budgeting Staff") >= 0
  );
  const [modalApproved, setModalApproved] = useState({
    statusDialog: false,
    data: {},
    loading: false,
    statusReq: false,
  });
  const [modalRejected, setModalRejected] = useState({
    statusDialog: false,
    data: {},
    loading: false,
    statusReq: false,
  });
  const [modalSubmit, setModalSubmit] = useState({
    statusDialog: false,
    data: {},
    loading: false,
    statusReq: false,
  });

  const handleChangeParkAp = (e) => {
    setParkApInput(e.target.value)
  };
  const handleChangeParkByr = (e) => {
    setParkByrInput(e.target.value)
  };

  const getBkbData = useCallback(() => {
    getBkb(termin)
      .then((response) => {
        if (response["data"]["data"]) {
          setBkbData(response["data"]["data"]);
          setParkApInput(response["data"]["data"]["doc_park_ap_no"]);
          setParkByrInput(response["data"]["data"]["doc_park_byr_no"]);
        }
      })
      .catch((error) => {
        setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 10000);
      });
  }, [termin, intl, setToast]);

  const getRolesBKBData = useCallback(() => {
    getRolesBKB(main_authority)
      .then((response) => {
        setMainRolesBKBData(response["data"]["data"]);
      })
      .catch((error) => {
        setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 10000);
      });
  }, [termin, intl, setToast]);

  useEffect(getBkbData, []);
  useEffect(getRolesBKBData, []);

  const print = () => {
    var printContents = window.$("#printBkb").html();
    window.$("#root").css("display", "none");
    window.$("#print-content").addClass("p-5");
    window.$("#print-content").html(printContents);
    window.print();
    window.$("#root").removeAttr("style");
    window.$("#print-content").removeClass("p-5");
    window.$("#print-content").html("");
  };

  const handleApproved = () => {
    setModalApproved({ ...modalApproved, loading: true });
    if (modalApproved.data === "monitoringTax") {
      tax_manager_approve_bkb(bkbData.id, data_login.user_id, termin, bkbData.desc)
        .then((result) => {
          setModalApproved({
            ...modalApproved,
            statusReq: true,
            loading: true,
          });
          setTimeout(() => {
            getBkbData();
            setModalApproved({
              ...modalApproved,
              statusDialog: false,
              loading: false,
            });
          }, 2500);
        })
        .catch((err) => {
          setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 5000);
        });
    } else if (modalApproved.data === "monitoringFinance") {
      finance_manager_approve_bkb(bkbData.id, data_login.user_id, termin, bkbData.desc)
        .then((result) => {
          setModalApproved({
            ...modalApproved,
            statusReq: true,
            loading: true,
          });
          setTimeout(() => {
            getBkbData();
            setModalApproved({
              ...modalApproved,
              statusDialog: false,
              loading: false,
            });
          }, 2500);
        })
        .catch((err) => {
          setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 5000);
        });
    } else if (modalApproved.data === "monitoringFinanceDirec") {
      finance_director_approve_bkb(bkbData.id, data_login.user_id, termin, bkbData.desc)
        .then((result) => {
          setModalApproved({
            ...modalApproved,
            statusReq: true,
            loading: true,
          });
          setTimeout(() => {
            getBkbData();
            setModalApproved({
              ...modalApproved,
              statusDialog: false,
              loading: false,
            });
          }, 2500);
        })
        .catch((err) => {
          setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 5000);
        });
    } else if (modalApproved.data === "submitDataParkAp") {
      const data = {
        id: bkbData.id,
        doc_park_ap_no: parkApInput,
        doc_park_ap_submit_id: data_login.user_id
      }
      submitParkAP(data)
        .then((result) => {
          setModalApproved({
            ...modalApproved,
            statusReq: true,
            loading: true,
          });
          setTimeout(() => {
            getBkbData();
            setModalApproved({
              ...modalApproved,
              statusDialog: false,
              loading: false,
            });
          }, 2500);
        })
        .catch((err) => {
          setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 5000);
        });
    } else if (modalApproved.data === "updateDataParkAp") {
      const data = {
        id: bkbData.id,
        desc: bkbData.desc,
        doc_park_ap_no: parkApInput,
        doc_park_ap_update_id: data_login.user_id
      }
      updateParkAP(data)
        .then((result) => {
          setModalApproved({
            ...modalApproved,
            statusReq: true,
            loading: true,
          });
          setTimeout(() => {
            getBkbData();
            setModalApproved({
              ...modalApproved,
              statusDialog: false,
              loading: false,
            });
          }, 2500);
        })
        .catch((err) => {
          setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 5000);
        });
    } else if (modalApproved.data === "monitoringApproveParkAP") {
      const data = {
        id: bkbData.id,
        doc_park_ap_approved_id: data_login.user_id,
        desc: bkbData.desc,
        term_id: termin
      }
      approveParkAP(data)
        .then((result) => {
          setModalApproved({
            ...modalApproved,
            statusReq: true,
            loading: true,
          });
          getTerminProgress(termin)
            .then((result) => {
              setProgressTermin(result.data.data?.progress_type);
              setDataProgress(result.data.data?.data);
            })
          setTimeout(() => {
            getBkbData();
            setModalApproved({
              ...modalApproved,
              statusDialog: false,
              loading: false,
            });
          }, 2500);
        })
        .catch((err) => {
          setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 5000);
        });
    } else if (modalApproved.data === "submitDataParkByr") {
      const data = {
        id: bkbData.id,
        doc_park_byr_no: parkByrInput,
        doc_park_byr_submit_id: data_login.user_id,
        desc: bkbData.desc
      }
      submitParkBYR(data)
        .then((result) => {
          setModalApproved({
            ...modalApproved,
            statusReq: true,
            loading: true,
          });
          setTimeout(() => {
            getBkbData();
            setModalApproved({
              ...modalApproved,
              statusDialog: false,
              loading: false,
            });
          }, 2500);
        })
        .catch((err) => {
          setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 5000);
        });
    } else if (modalApproved.data === "updateDataParkByr") {
      const data = {
        id: bkbData.id,
        desc: bkbData.desc,
        doc_park_byr_no: parkByrInput,
        doc_park_byr_update_id: data_login.user_id
      }
      updateParkBYR(data)
        .then((result) => {
          setModalApproved({
            ...modalApproved,
            statusReq: true,
            loading: true,
          });
          setTimeout(() => {
            getBkbData();
            setModalApproved({
              ...modalApproved,
              statusDialog: false,
              loading: false,
            });
          }, 2500);
        })
        .catch((err) => {
          setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 5000);
        });
    } else if (modalApproved.data === "monitoringApproveParkBYR") {
      const data = {
        id: bkbData.id,
        doc_park_byr_approved_id: data_login.user_id,
        desc: bkbData.desc,
        term_id: termin
      }
      approveParkBYR(data)
        .then((result) => {
          setModalApproved({
            ...modalApproved,
            statusReq: true,
            loading: true,
          });
          getTerminProgress(termin)
            .then((result) => {
              setProgressTermin(result.data.data?.progress_type);
              setDataProgress(result.data.data?.data);
            })
          setTimeout(() => {
            getBkbData();
            setModalApproved({
              ...modalApproved,
              statusDialog: false,
              loading: false,
            });
          }, 2500);
        })
        .catch((err) => {
          setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 5000);
        });
    }
  };

  const handleRejected = () => {
    setModalRejected({ ...modalRejected, loading: true });
    var note = document.getElementById("commentRejected").value;
    if (modalRejected.data === "rejectParkAP") {
      const data = {
        id: bkbData.id,
        doc_park_ap_rejected_id: data_login.user_id,
        desc: bkbData.desc,
        rejected_remark: note,
        doc_park_ap_no: bkbData.doc_park_ap_no,
        bkb_number: bkbData.bkb_number,
        doc_park_ap_submit_id: bkbData.doc_park_ap_updated_id ? bkbData.doc_park_ap_updated_id : bkbData.doc_park_ap_submit_id,
        doc_park_ap_submit_at: bkbData.doc_park_ap_updated_at ? bkbData.doc_park_ap_updated_at : bkbData.doc_park_ap_submit_at
      }
      rejectParkAP(data)
        .then((result) => {
          setModalRejected({
            ...modalRejected,
            statusReq: true,
            loading: true,
          });
          setTimeout(() => {
            getBkbData();
            setModalRejected({
              ...modalRejected,
              statusDialog: false,
              loading: false,
            });
          }, 2500);
        })
        .catch((err) => {
          setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 5000);
        });
    } else if (modalRejected.data === "rejectParkBYR") {
      const data = {
        id: bkbData.id,
        doc_park_byr_rejected_id: data_login.user_id,
        desc: bkbData.desc,
        rejected_remark: note,
        doc_park_byr_no: bkbData.doc_park_byr_no,
        bkb_number: bkbData.bkb_number,
        doc_park_byr_submit_id: bkbData.doc_park_byr_updated_id ? bkbData.doc_park_byr_updated_id : bkbData.doc_park_byr_submit_id,
        doc_park_byr_submit_at: bkbData.doc_park_byr_updated_at ? bkbData.doc_park_byr_updated_at : bkbData.doc_park_byr_submit_at
      }
      rejectParkBYR(data)
        .then((result) => {
          setModalRejected({
            ...modalRejected,
            statusReq: true,
            loading: true,
          });
          setTimeout(() => {
            getBkbData();
            setModalRejected({
              ...modalRejected,
              statusDialog: false,
              loading: false,
            });
          }, 2500);
        })
        .catch((err) => {
          setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 5000);
        });
    }
  };

  return (
    <React.Fragment>
      <Toast />
      <Dialog
        open={modalRejected.statusDialog}
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
              {" " + (modalRejected.data.document_name || "")}
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
              disabled={modalRejected.loading}
            ></textarea>
          </DialogContent>
          <DialogActions>
            <button
              className="btn btn-secondary"
              type="button"
              onClick={() =>
                setModalRejected({
                  ...modalRejected,
                  statusDialog: false,
                })
              }
              disabled={modalRejected.loading}
            >
              <span>
                <FormattedMessage id="AUTH.GENERAL.BACK_BUTTON" />
              </span>
            </button>
            <button
              className="btn btn-danger"
              type="submit"
              disabled={modalRejected.loading}
            >
              {!modalRejected.loading && (
                <span>
                  <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.SPP_DOCUMENT.REJECTED.REJECT_SUBMIT" />
                </span>
              )}
              {modalRejected.loading &&
                (modalRejected.statusReq && modalRejected.loading ? (
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
        open={modalSubmit.statusDialog}
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
          }}
        >
          <DialogTitle id="alert-dialog-slide-title">
            <FormattedMessage id="TITLE.REJECT_DOCUMENT" />
            <span className="text-danger">
              {" " + (modalSubmit.data.document_name || "")}
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
              disabled={modalSubmit.loading}
            ></textarea>
          </DialogContent>
          <DialogActions>
            <button
              className="btn btn-secondary"
              type="button"
              onClick={() =>
                setModalSubmit({
                  ...modalSubmit,
                  statusDialog: false,
                })
              }
              disabled={modalSubmit.loading}
            >
              <span>
                <FormattedMessage id="AUTH.GENERAL.BACK_BUTTON" />
              </span>
            </button>
            <button
              className="btn btn-danger"
              type="submit"
              disabled={modalSubmit.loading}
            >
              {!modalSubmit.loading && (
                <span>
                  <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.SPP_DOCUMENT.REJECTED.REJECT_SUBMIT" />
                </span>
              )}
              {modalSubmit.loading &&
                (modalSubmit.statusReq && modalSubmit.loading ? (
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
      <Card>
        <CardHeader title="">
          <CardHeaderToolbar>
            <button
              type="button"
              onClick={print}
              className="btn btn-sm btn-primary"
            >
              <i className="fas fa-print"></i>
              <FormattedMessage id="TITLE.PRINT" /> BKB
            </button>
          </CardHeaderToolbar>
        </CardHeader>
        <CardBody id="printBkb">
          <div>
            <div className="row">
              <div className="col-sm-8">
                <img
                  src={toAbsoluteUrl("/media/logos/logo-eprocurement.png")}
                  style={{ width: 150 }}
                  alt="IconGde"
                />
              </div>
              <div className="col-sm-4">
                <div className="row">
                  <div className="col-sm-6 border d-flex justify-content-between">
                    <span>No</span>
                    <span>:</span>
                  </div>
                  <div className="col-sm-6 border text-center font-weight-bold">
                    <span>{bkbData?.bkb_number}</span>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-6 border d-flex justify-content-between">
                    <span>
                      <FormattedMessage id="TITLE.DATE" />
                    </span>
                    <span>:</span>
                  </div>
                  <div className="col-sm-6 border text-center font-weight-bold">
                    <span>
                      {bkbData
                        ? window
                          .moment(new Date(bkbData?.from_time))
                          .format("DD MMMM YYYY")
                        : "-"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-2 border text-center">
                <h2 className="mb-0" style={{ marginTop: 5 }}>
                  BKB
                </h2>
              </div>
              <div className="col-sm-8 border text-center">
                <div>
                  <span className="font-weight-bold">PT GEO DIPA ENERGI</span>
                </div>
                <div>
                  <span className="font-weight-bold">
                    <FormattedMessage id="TITLE.PROOF_OF_PAYMENT" />
                  </span>
                </div>
              </div>
              <div className="col-sm-2 border text-center">
                <h2 className="mb-0" style={{ marginTop: 5 }}>
                  {bkbData ? bkbData?.purch_group_name?.substring(0, 3) : "-"}
                </h2>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-sm-2 border">
                <div className="row">
                  <div className="col d-flex justify-content-between">
                    <span className="font-weight-bold">
                      <FormattedMessage id="TITLE.PAID_TO" />
                    </span>
                    <span>:</span>
                  </div>
                </div>
                <div className="row">
                  <div className="col d-flex justify-content-between">
                    <span className="font-weight-bold">
                      <FormattedMessage id="TITLE.ADDRESS" />
                    </span>
                    <span>:</span>
                  </div>
                </div>
                <div className="row">
                  <div className="col d-flex justify-content-between">
                    <span className="font-weight-bold">
                      <FormattedMessage id="TITLE.FOR" />
                    </span>
                    <span>:</span>
                  </div>
                </div>
              </div>
              <div className="col-sm-10 border">
                <div className="row">
                  <div className="col">
                    <span className="font-weight-bold">
                      {bkbData ? bkbData?.vendor_name : "-"}
                    </span>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <span>{bkbData ? bkbData?.vendor_address : "-"}</span>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <span>{bkbData ? bkbData?.contract_name : "-"}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-2">
                <div className="row border">
                  <div className="col d-flex justify-content-between">
                    <span className="font-weight-bold">
                      <FormattedMessage id="TITLE.SUPPLIER_CODE" />
                    </span>
                    <span>:</span>
                  </div>
                </div>
              </div>
              <div className="col-sm-2">
                <div className="row border">
                  <div className="col">
                    <span className="font-weight-bold">
                      {bkbData ? bkbData?.vendor_code : "-"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-sm-8 border">
                <div className="row">
                  <div className="col border-right">
                    <span className="font-weight-bold">
                      <FormattedMessage id="TITLE.BANK_NAME" />
                    </span>
                  </div>
                  <div className="col border-right">
                    <span className="font-weight-bold">
                      <FormattedMessage id="TITLE.ACCOUNT_NUMBER" />
                    </span>
                  </div>
                  <div className="col">
                    <span className="font-weight-bold">
                      <FormattedMessage id="TITLE.REFERENCE" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-4" style={{ paddingTop: 10 }}>
                <span className="font-weight-bold">
                  <FormattedMessage id="TITLE.PAYMENT_METHOD" />
                </span>
              </div>
              <div className="col-sm-8">
                <div className="row">
                  <div className="col border">
                    <span className="">
                      {bkbData ? bkbData?.bank_name : "-"}
                    </span>
                  </div>
                  <div className="col border">
                    <span className="">
                      {bkbData ? bkbData?.bank_account_no : "-"}
                    </span>
                  </div>
                  <div className="col border">
                    <span className="">
                      {bkbData ? bkbData?.bank_account_name : "-"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-sm-2 d-flex justify-content-between">
                <span className="font-weight-bold">
                  <FormattedMessage id="TITLE.TRANSFER" />
                </span>
                <div className="form-check">
                  <input
                    className="form-check-input pointer"
                    type="checkbox"
                    id="transfer"
                    name="pay"
                  />
                </div>
              </div>
              <div className="col-sm-5 px-0">
                <label className="font-weight-bold pointer" htmlFor="transfer">
                  <FormattedMessage id="TITLE.TRANSFER.INSTRUCTION" />
                </label>
              </div>
              <div className="col-sm-5 form-group">
                <div className="row">
                  <div className="col">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-sm-2 d-flex justify-content-between">
                <span className="font-weight-bold">
                  <FormattedMessage id="TITLE.CEK_OR_GIRO" />
                </span>
                <div className="form-check">
                  <input
                    className="form-check-input pointer"
                    type="checkbox"
                    id="giro"
                    name="pay"
                  />
                </div>
              </div>
              <div className="col-sm-10 form-group">
                <div className="row">
                  <label
                    className="font-weight-bold pointer col-sm-1 px-0"
                    htmlFor="giro"
                  >
                    <FormattedMessage id="TITLE.NO" />
                  </label>
                  <div className="col-sm-11">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-3">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <td className="td-15 text-center">
                      <FormattedMessage id="TITLE.NO_INVOICE_PO" />
                    </td>
                    <td className="td-15 text-center">
                      <FormattedMessage id="TITLE.INVOICE_DATE" />
                    </td>
                    <td className="td-50 text-center">
                      <FormattedMessage id="TITLE.INFORMATION" />
                    </td>
                    <td className="td-20 text-center">
                      <FormattedMessage id="TITLE.TOTAL_INVOICE" />
                    </td>
                  </tr>
                </thead>
                <tbody>
                  {bkbData?.items?.map((row, key) => {
                    // Jenis Dokumen
                    return (
                      <tr key={key}>
                        <td className="text-center">
                          {bkbData?.invoice_no} / {bkbData?.purch_order_no}
                        </td>
                        <td className="text-center">
                          {window
                            .moment(new Date(bkbData?.invoice_date))
                            .format("DD MMMM YYYY")}
                        </td>
                        <td className="text-justify">{row.desc}</td>
                        <td>
                          <div className="d-flex justify-content-between">
                            <span>{bkbData?.symbol}</span>
                            <span>{rupiah(row.price).slice(3)}</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  <tr>
                    <td colSpan="3" className="text-right">
                      <FormattedMessage id="TITLE.LESS" />:
                    </td>
                    <td></td>
                  </tr>
                  {bkbData?.tax_selected?.map((row, key) => {
                    const data = JSON.parse(row.value)
                    return (
                      <tr key={key}>
                        <td colSpan="3" className="text-right">
                          {data.description} - {data.value}%
                        </td>
                        <td>
                          <div className="d-flex justify-content-between">
                            <span>{bkbData?.symbol}</span>
                            <span>
                              {rupiah(data.tax_value).slice(3)}
                            </span>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                  <tr>
                    <td colSpan="3" className="text-right">
                      <FormattedMessage id="TITLE.FINE_OR_OTHER" />
                    </td>
                    <td>
                      <div className="d-flex justify-content-between">
                        <span>{bkbData?.symbol}</span>
                        <span>{bkbData
                          ? rupiah(bkbData?.penalty).slice(3)
                          : "0"}</span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="text-right font-weight-bold">
                      <FormattedMessage id="TITLE.NET_TO_PAID" />
                    </td>
                    <td>
                      <div className="d-flex justify-content-between">
                        <span>{bkbData?.symbol}</span>
                        <span>
                          {bkbData
                            ? rupiah(bkbData?.total_amount).slice(3)
                            : "-"}
                        </span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="row">
              <div className="col-sm border text-center">
                <span>
                  <FormattedMessage id="TITLE.ARCHIVED_BY" />:
                </span>
              </div>
              <div className="col-sm border text-center">
                <span>
                  <FormattedMessage id="TITLE.ACCOUNTING" />:
                </span>
              </div>
              <div className="col-sm border text-center">
                <span>
                  <FormattedMessage id="TITLE.FINANCE" />:
                </span>
              </div>
            </div>
            <div className="row">
              <div
                className="col-sm border"
                style={{ height: 110 }}
              >
                <div
                  className="text-center"
                  style={{
                    height: styleCustom.minHeightAppv,
                    paddingTop: 10,
                    paddingBottom: 10,
                  }}
                >
                  {bkbData &&
                    <QRCodeG
                      value={`${window.location.origin}/qrcode?term_id=${termin}&role_id=${bkbData?.verif_staff_role_id}&type=ARCHIVED_BKB`}
                    />
                  }
                  <div className="d-flex align-items-end">
                    <span className="mx-auto">
                      {bkbData?.archived_name}
                    </span>
                  </div>
                </div>
              </div>
              <div
                className="col-sm border"
                style={{ height: 110 }}
              >
                <div
                  className="text-center"
                  style={{
                    height: styleCustom.minHeightAppv,
                    paddingTop: 10,
                    paddingBottom: 10,
                  }}
                >
                  {approveBkbStaff &&
                    bkbData?.doc_park_ap_approved_id == null &&
                    bkbData?.doc_park_ap_no &&
                    bkbData?.doc_park_ap_state === 'PENDING' && (
                      <button
                        type="button"
                        className="btn btn-danger btn-sm mx-2"
                        style={{ fontSize: 10, marginTop: 20 }}
                        onClick={() => {
                          setModalRejected({
                            ...modalRejected,
                            statusDialog: true,
                            data: "rejectParkAP",
                          });
                        }}
                      >
                        <i
                          className="fas fa-times-circle"
                          style={{ fontSize: 8 }}
                        ></i>
                        <FormattedMessage id="TITLE.REJECT" />
                      </button>
                    )}
                  {approveBkbStaff &&
                    bkbData?.doc_park_ap_approved_id == null &&
                    bkbData?.doc_park_ap_no &&
                    bkbData?.doc_park_ap_state === 'PENDING' && (
                      <button
                        type="button"
                        className="btn btn-primary btn-sm mx-2"
                        style={{ fontSize: 10, marginTop: 20 }}
                        onClick={() => {
                          setModalApproved({
                            ...modalApproved,
                            statusDialog: true,
                            data: "monitoringApproveParkAP",
                          });
                        }}
                      >
                        <i
                          className="fas fa-check-circle"
                          style={{ fontSize: 8 }}
                        ></i>
                        <FormattedMessage id="TITLE.APPROVE" />
                      </button>
                    )}
                  {bkbData?.doc_park_ap_approved_id && (
                    <QRCodeG
                      value={`${window.location.origin}/qrcode?term_id=${termin}&role_id=${bkbData?.accounting_budgeting_role_id}&type=APPROVED_PARK_AP`}
                    />
                  )}
                  <div className="d-flex align-items-end">
                    <span className="mx-auto">
                      {bkbData?.park_ap_approve_name}
                    </span>
                  </div>
                </div>
              </div>
              <div
                className="col-sm border text-center"
                style={{ height: 110 }}
              >
                <div
                  className="text-center"
                  style={{
                    height: styleCustom.minHeightAppv,
                    paddingTop: 10,
                    paddingBottom: 10,
                  }}
                >
                  {approveBkbStaff &&
                    bkbData?.doc_park_byr_approved_id == null &&
                    bkbData?.doc_park_byr_no &&
                    bkbData?.doc_park_byr_state === 'PENDING' && (
                      <button
                        type="button"
                        className="btn btn-danger btn-sm mx-2"
                        style={{ fontSize: 10, marginTop: 20 }}
                        onClick={() => {
                          setModalRejected({
                            ...modalRejected,
                            statusDialog: true,
                            data: "rejectParkBYR",
                          });
                        }}
                      >
                        <i
                          className="fas fa-times-circle"
                          style={{ fontSize: 8 }}
                        ></i>
                        <FormattedMessage id="TITLE.REJECT" />
                      </button>
                    )}
                  {approveBkbStaff &&
                    bkbData?.doc_park_byr_approved_id == null &&
                    bkbData?.doc_park_byr_no &&
                    bkbData?.doc_park_byr_state === 'PENDING' && (
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        style={{ fontSize: 10, marginTop: 20 }}
                        onClick={() => {
                          setModalApproved({
                            ...modalApproved,
                            statusDialog: true,
                            data: "monitoringApproveParkBYR",
                          });
                        }}
                      >
                        <i
                          className="fas fa-check-circle"
                          style={{ fontSize: 8 }}
                        ></i>
                        <FormattedMessage id="TITLE.APPROVE" />
                      </button>
                    )}
                  {bkbData?.doc_park_byr_approved_id && (
                    <QRCodeG
                      value={`${window.location.origin}/qrcode?term_id=${termin}&role_id=${bkbData?.accounting_budgeting_role_id}&type=APPROVED_PARK_BYR`}
                    />
                  )}
                  <div className="d-flex align-items-end">
                    <span className="mx-auto">
                      {bkbData?.park_byr_approve_name}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="row mt-3" style={{ minHeight: 300 }}>
              <div className="col-sm-7 border">
                <div className="row border-bottom">
                  <div className="col-sm-12 row">
                    <span className="col-sm-4">
                      <FormattedMessage id="TITLE.NO_VENDOR" />
                    </span>
                    <span className="col-sm-8">: {bkbData?.vendor_sap_no}</span>
                  </div>
                </div>
                {(((bkbData?.doc_park_ap_state === 'PENDING' ||
                  bkbData?.doc_park_ap_state === 'APPROVED') &&
                  bkbData?.doc_park_ap_no) ||
                  !bkbData ) &&
                  <div className="row border-bottom">
                    <div className="col-sm-12 row">
                      <span className="col-sm-4">
                        <FormattedMessage id="TITLE.NO_DOCUMENT" /> Park AP
                      </span>
                      <span className="col-sm-8">: {bkbData?.doc_park_ap_no}</span>
                    </div>
                  </div>
                }
                {(!bkbData?.doc_park_ap_no ||
                  bkbData?.doc_park_ap_state === 'REJECTED') &&
                  bkbData &&
                  <div className="row border-bottom">
                    <div className="col-sm-12">
                      <div className="form-group row mb-0">
                        <label
                          htmlFor="parkApInput"
                          className="col-sm-4 col-form-label col-form-label-sm"
                        >
                          <FormattedMessage id="TITLE.NO_DOCUMENT" /> Park AP
                        </label>
                        <div className="col-sm-8 pr-0">
                          <div className="input-group input-group-sm">
                            <input
                              type="text"
                              className="form-control"
                              aria-label="Small"
                              aria-describedby="inputGroup-sizing-sm"
                              required
                              id="parkApInput"
                              disabled={modalApproved.loading}
                              onChange={handleChangeParkAp}
                              value={parkApInput}
                            />
                            <div className="input-group-prepend">
                              <button
                                type="button"
                                className="input-group-text btn btn-sm btn-primary"
                                id="inputGroup-sizing-sm"
                                onClick={() => {
                                  setModalApproved({
                                    ...modalApproved,
                                    statusDialog: true,
                                    data: bkbData?.doc_park_ap_no ? "updateDataParkAp" : "submitDataParkAp",
                                  });
                                }}
                                disabled={
                                  modalApproved.loading ||
                                  !parkApInput
                                }
                              >
                                {bkbData?.doc_park_ap_no ? "Update" : "Simpan"}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                }
                {((bkbData?.doc_park_byr_no &&
                  (bkbData?.doc_park_byr_state === 'PENDING' ||
                    bkbData?.doc_park_byr_state === 'APPROVED')) ||
                  bkbData?.doc_park_ap_state === null ||
                  !bkbData) &&
                  <div className="row border-bottom">
                    <div className="col-sm-12 row">
                      <span className="col-sm-4">
                        <FormattedMessage id="TITLE.NO_DOCUMENT" /> Park BYR
                      </span>
                      <span className="col-sm-8">: {bkbData?.doc_park_byr_no}</span>
                    </div>
                  </div>
                }
                {!bkbData?.doc_park_byr_no ||
                  bkbData?.doc_park_byr_state === 'REJECTED' &&
                  bkbData &&
                  <div className="row border-bottom">
                    <div className="col-sm-12">
                      <div className="form-group row mb-0">
                        <label
                          htmlFor="colFormLabelSm-1"
                          className="col-sm-4 col-form-label col-form-label-sm"
                        >
                          <FormattedMessage id="TITLE.NO_DOCUMENT" /> Park BYR
                        </label>
                        <div className="col-sm-8 pr-0">
                          <div className="input-group input-group-sm">
                            <input
                              type="text"
                              className="form-control"
                              aria-label="Small"
                              aria-describedby="inputGroup-sizing-sm"
                              id="colFormLabelSm-1"
                              disabled={
                                !bkbData?.doc_park_ap_approved_id
                              }
                              onChange={handleChangeParkByr}
                              value={parkByrInput}
                            />
                            <div className="input-group-prepend">
                              <button
                                type="button"
                                className="input-group-text btn btn-sm btn-primary"
                                id="inputGroup-sizing-sm"
                                disabled={
                                  modalApproved.loading ||
                                  !bkbData?.doc_park_ap_approved_id ||
                                  !parkByrInput
                                }
                                onClick={() => {
                                  setModalApproved({
                                    ...modalApproved,
                                    statusDialog: true,
                                    data: bkbData?.doc_park_byr_no ? "updateDataParkByr" : "submitDataParkByr",
                                  });
                                }}
                              >
                                {bkbData?.doc_park_byr_no ? "Update" : "Simpan"}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                }
              </div>
              <div className="col-sm-5 border">
                <div className="row border-bottom">
                  <div className="col-sm text-center">
                    <span>
                      <FormattedMessage id="TITLE.INFORMATION_OR_NOTE" />
                    </span>
                  </div>
                </div>
                <div className="row p-3">
                  {bkbData?.desc?.split(';').map((row, key) => {
                    return (
                      <span key={key}>{row}<br /></span>
                    )
                  })
                  }
                </div>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-sm-7">
                <div className="row">
                  <div className="col-sm-4 border">
                    <div className="row border">
                      <div className="col-sm text-center">
                        <span>
                          <FormattedMessage id="TITLE.CEK_OR_GIRO_RECEIVER" />
                        </span>
                      </div>
                    </div>
                    <div
                      className="row d-flex align-items-end"
                      style={{ minHeight: 137 }}
                    >
                      <div>
                        <span style={{ fontSize: 8 }}>
                          <FormattedMessage id="TITLE.NAME" />: -
                        </span>
                        <br />
                        <span style={{ fontSize: 8 }}>
                          <FormattedMessage id="TITLE.DATE" />:
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="col-sm-8 border">
                    <div className="row border">
                      <div className="col-sm text-center">
                        <span>
                          <FormattedMessage id="TITLE.APPROVED_BY" />
                        </span>
                      </div>
                    </div>
                    <div className="row">
                      {mainRolesBKBData?.map((row, key) => {
                        if (parseFloat(bkbData?.sub_total) >= row?.bkb_min_value && parseFloat(bkbData?.sub_total) <= row?.bkb_max_value) {
                          return (
                            <div className="col-sm border text-center px-0">
                              <span key={key} style={{ fontSize: 10 }}>{row?.name}</span>
                            </div>
                          )
                        }
                      }
                      )}
                    </div>
                    <div className="row">
                      {mainRolesBKBData?.map((row, key) => {
                        if (parseFloat(bkbData?.sub_total) >= row?.bkb_min_value && parseFloat(bkbData?.sub_total) <= row?.bkb_max_value) {
                          return (
                            <div
                              className="col-sm border-right"
                              style={{ height: styleCustom.heightAppvDiv }}
                            >
                              <div
                                className="text-center"
                                style={{
                                  height: 100,
                                  paddingTop: 5,
                                  paddingBottom: 5,
                                }}
                              >
                                {monitoringFinanceDirec &&
                                  bkbData?.finance_director_approved_id === null &&
                                  bkbData?.finance_man_approved_id === null &&
                                  bkbData?.tax_man_approved_id === null &&
                                  row?.ident_name === "DIREKTUR_KEUANGAN" &&
                                  bkbData?.doc_park_byr_approved_id && (
                                    <button
                                      type="button"
                                      className="btn btn-primary btn-sm"
                                      style={{ fontSize: 10, marginTop: 20 }}
                                      onClick={() => {
                                        setModalApproved({
                                          ...modalApproved,
                                          statusDialog: true,
                                          data: "monitoringFinanceDirec",
                                        });
                                      }}
                                    >
                                      <i
                                        className="fas fa-check-circle"
                                        style={{ fontSize: 8 }}
                                      ></i>
                                      <FormattedMessage id="TITLE.APPROVE" />
                                    </button>
                                  )}
                                {monitoringFinance &&
                                  bkbData?.finance_director_approved_id === null &&
                                  bkbData?.finance_man_approved_id === null &&
                                  bkbData?.tax_man_approved_id === null &&
                                  row?.ident_name === "FINANCE_MANAGER" &&
                                  bkbData?.doc_park_byr_approved_id && (
                                    <button
                                      type="button"
                                      className="btn btn-primary btn-sm"
                                      style={{ fontSize: 10, marginTop: 20 }}
                                      onClick={() => {
                                        setModalApproved({
                                          ...modalApproved,
                                          statusDialog: true,
                                          data: "monitoringFinance",
                                        });
                                      }}
                                    >
                                      <i
                                        className="fas fa-check-circle"
                                        style={{ fontSize: 8 }}
                                      ></i>
                                      <FormattedMessage id="TITLE.APPROVE" />
                                    </button>
                                  )}
                                {monitoringTax &&
                                  bkbData?.finance_director_approved_id === null &&
                                  bkbData?.finance_man_approved_id === null &&
                                  bkbData?.tax_man_approved_id === null &&
                                  row?.ident_name === "TREASURY_ASSISTANT_MANAGER" &&
                                  bkbData?.doc_park_byr_approved_id && (
                                    <button
                                      type="button"
                                      className="btn btn-primary btn-sm"
                                      style={{ fontSize: 10, marginTop: 20 }}
                                      onClick={() => {
                                        setModalApproved({
                                          ...modalApproved,
                                          statusDialog: true,
                                          data: "monitoringTax",
                                        });
                                      }}
                                    >
                                      <i
                                        className="fas fa-check-circle"
                                        style={{ fontSize: 8 }}
                                      ></i>
                                      <FormattedMessage id="TITLE.APPROVE" />
                                    </button>
                                  )}
                                {bkbData?.finance_director_approved_id &&
                                  row?.ident_name === "DIREKTUR_KEUANGAN" && (
                                    <QRCodeG
                                      value={`${window.location.origin}/qrcode?term_id=${termin}&role_id=${bkbData?.finance_director_role_id}&type=APPROVED_BKB`}
                                      size="90"
                                    />
                                  )}
                                {bkbData?.finance_man_approved_id &&
                                  row?.ident_name === "FINANCE_MANAGER" && (
                                    <QRCodeG
                                      value={`${window.location.origin}/qrcode?term_id=${termin}&role_id=${bkbData?.finance_man_role_id}&type=APPROVED_BKB`}
                                      size="90"
                                    />
                                  )}
                                {bkbData?.tax_man_approved_id &&
                                  row?.ident_name === "TREASURY_ASSISTANT_MANAGER" && (
                                    <QRCodeG
                                      value={`${window.location.origin}/qrcode?term_id=${termin}&role_id=${bkbData?.tax_man_role_id}&type=APPROVED_BKB`}
                                      size="90"
                                    />
                                  )}
                              </div>
                              <div
                                className="text-center"
                              >
                                <div>
                                  <span style={{ fontSize: 10 }}>
                                    <FormattedMessage id="TITLE.NAME" />:
                                    {bkbData?.finance_director_approved_id &&
                                      row?.ident_name === "DIREKTUR_KEUANGAN" && (
                                        <span>{bkbData?.finance_director_name}</span>
                                      )}
                                    {bkbData?.finance_man_approved_id &&
                                      row?.ident_name === "FINANCE_MANAGER" && (
                                        <span>{bkbData?.finance_man_name}</span>
                                      )}
                                    {bkbData?.tax_man_approved_id &&
                                      row?.ident_name === "TREASURY_ASSISTANT_MANAGER" && (
                                        <span>{bkbData?.tax_man_name}</span>
                                      )}
                                  </span>
                                  <br />
                                  <span style={{ fontSize: 10 }}>
                                    <FormattedMessage id="TITLE.DATE" />:
                                    {bkbData?.finance_director_approved_at &&
                                      row?.ident_name === "DIREKTUR_KEUANGAN"
                                      ? window
                                        .moment(
                                          new Date(
                                            bkbData?.finance_director_approved_at
                                          )
                                        )
                                        .format("DD/MM/YYYY")
                                      : ""}
                                    {bkbData?.finance_man_approved_at &&
                                      row?.ident_name === "FINANCE_MANAGER"
                                      ? window
                                        .moment(
                                          new Date(bkbData?.finance_man_approved_at)
                                        )
                                        .format("DD/MM/YYYY")
                                      : ""}
                                    {bkbData?.tax_man_approved_at &&
                                      row?.ident_name === "TREASURY_ASSISTANT_MANAGER"
                                      ? window
                                        .moment(
                                          new Date(bkbData?.tax_man_approved_at)
                                        )
                                        .format("DD/MM/YYYY")
                                      : ""}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )
                        }
                      }
                      )}

                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-5 border">
                <div className="text-center">
                  <span>
                    <FormattedMessage id="TITLE.APPROVED_CEK_OR_GIRO" />
                  </span>
                </div>
                <div className="row border-top">
                  <div className="col-sm border text-center px-0">
                    <span style={{ fontSize: 10 }}>Dirut</span>
                  </div>
                  <div className="col-sm border text-center px-0">
                    <span style={{ fontSize: 10 }}>Dirkeu</span>
                  </div>
                  <div className="col-sm border text-center px-0">
                    <span style={{ fontSize: 10 }}>Dir</span>
                  </div>
                  <div className="col-sm border text-center px-0">
                    <span style={{ fontSize: 10 }}>Fin Mgr</span>
                  </div>
                </div>
                <div className="row">
                  <div
                    className="col-sm border-right"
                    style={{ height: styleCustom.heightAppvDiv }}
                  >
                    <div
                      className="text-center"
                      style={{
                        height: styleCustom.minHeightAppv,
                        paddingTop: 5,
                        paddingBottom: 5,
                      }}
                    >
                      {/* <QRCodeG
                        value="http://192.168.0.168:3000/qrcode"
                        size="60"
                      /> */}
                    </div>
                    <div className="d-flex align-items-end">
                      <div>
                        <span style={{ fontSize: 8 }}>
                          <FormattedMessage id="TITLE.NAME" />: Test1234
                        </span>
                        <br />
                        <span style={{ fontSize: 8 }}>
                          <FormattedMessage id="TITLE.DATE" />: 24/04/2021
                        </span>
                      </div>
                    </div>
                  </div>
                  <div
                    className="col-sm border-right"
                    style={{ height: styleCustom.heightAppvDiv }}
                  >
                    <div
                      className="text-center"
                      style={{
                        height: styleCustom.minHeightAppv,
                        paddingTop: 5,
                        paddingBottom: 5,
                      }}
                    >
                      {/* <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            style={{ fontSize: 10, marginTop: 20 }}
                          >
                            <i
                              className="fas fa-check-circle"
                              style={{ fontSize: 10 }}
                            ></i>
                            Setuju
                          </button> */}
                    </div>
                    <div className="d-flex align-items-end">
                      <div>
                        <span style={{ fontSize: 8 }}>
                          <FormattedMessage id="TITLE.NAME" />: -
                        </span>
                        <br />
                        <span style={{ fontSize: 8 }}>
                          <FormattedMessage id="TITLE.DATE" />:
                        </span>
                      </div>
                    </div>
                  </div>
                  <div
                    className="col-sm border-right"
                    style={{ height: styleCustom.heightAppvDiv }}
                  >
                    <div
                      className="text-center"
                      style={{
                        height: styleCustom.minHeightAppv,
                        paddingTop: 5,
                        paddingBottom: 5,
                      }}
                    >
                      {/* <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        style={{ fontSize: 10, marginTop: 20 }}
                      >
                        <i
                          className="fas fa-check-circle"
                          style={{ fontSize: 8 }}
                        ></i>
                        <FormattedMessage id="TITLE.APPROVE" />
                      </button> */}
                    </div>
                    <div className="d-flex align-items-end">
                      <div>
                        <span style={{ fontSize: 8 }}>
                          <FormattedMessage id="TITLE.NAME" />: -
                        </span>
                        <br />
                        <span style={{ fontSize: 8 }}>
                          <FormattedMessage id="TITLE.DATE" />:
                        </span>
                      </div>
                    </div>
                  </div>
                  <div
                    className="col-sm"
                    style={{ height: styleCustom.heightAppvDiv }}
                  >
                    <div
                      className="text-center"
                      style={{
                        height: styleCustom.minHeightAppv,
                        paddingTop: 5,
                        paddingBottom: 5,
                      }}
                    >
                      {/* <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            style={{ fontSize: 10, marginTop: 20 }}
                          >
                            <i
                              className="fas fa-check-circle"
                              style={{ fontSize: 10 }}
                            ></i>
                            Setuju
                          </button> */}
                    </div>
                    <div className="d-flex align-items-end">
                      <div>
                        <span style={{ fontSize: 8 }}>
                          <FormattedMessage id="TITLE.NAME" />: -
                        </span>
                        <br />
                        <span style={{ fontSize: 8 }}>
                          <FormattedMessage id="TITLE.DATE" />:
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </React.Fragment>
  );
}
export default injectIntl(connect(null, null)(ItemContractBKB));
