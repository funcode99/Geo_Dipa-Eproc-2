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
  approveBkb,
  submitParkAP,
  approveParkAP,
  submitParkBYR,
  approveParkBYR,
  getTerminProgress,
  rejectParkAP,
  updateParkAP,
  rejectParkBYR,
  updateParkBYR,
  rejectBkb,
  approveGiro
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
  FormControlLabel,
  Checkbox
} from "@material-ui/core";
import { getRolesBKB, getRolesAccounting, getRolesSignedGiro } from "../../../Master/service/MasterCrud";

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
  const [mainRolesSignedGiroData, setMainRolesSignedGiroData] = useState(null);
  const [parkApInput, setParkApInput] = useState('');
  const [parkByrInput, setParkByrInput] = useState('');
  const [parkApstaff, setParkApStaff] = useState('');
  const [countGiroSigned, setCountGiroSigned] = useState(0);
  const [giroSignedData, setGiroSignedData] = useState([]);

  const data_login = useSelector((state) => state.auth.user.data, shallowEqual);
  const monitoring_role = data_login.monitoring_role
    ? data_login.monitoring_role
    : [];
  const [monitoringTax] = useState(
    monitoring_role.find((element) => element === "Treasury Assistant Manager")
  );
  const [monitoringFinance] = useState(
    monitoring_role.find((element) => element === "Finance Manager")
  );
  const [monitoringFinanceDirec] = useState(
    monitoring_role.find((element) => element === "Direktur Keuangan")
  );
  const [approveBkbStaff] = useState(
    monitoring_role.findIndex((element) => element === "General Ledger Staff") >= 0
  );
  const [approveParkAPStaff, setApproveParkAPStaff] = useState(false);

  const [submitParkByrStaff] = useState(
    monitoring_role.findIndex((element) => element === "Treasury Staff") >= 0
  );

  const [approveParkByrStaff] = useState(
    monitoring_role.findIndex((element) => element === "Treasury Staff") >= 0
  );

  const [signedGiroDirut] = useState(
    monitoring_role.find((element) => element === "Direktur Utama")
  );

  const [signedGiroDir] = useState(
    monitoring_role.find((element) => element === "Direktur")
  );

  const [signedGiroDirkeu] = useState(
    monitoring_role.find((element) => element === "Direktur Keuangan")
  );

  const [signedGiroFinMan] = useState(
    monitoring_role.find((element) => element === "Finance Manager")
  );

  const [modalApproved, setModalApproved] = useState({
    statusDialog: false,
    data: {},
    loading: false,
    statusReq: false,
    role_id: ""
  });
  const [modalRejected, setModalRejected] = useState({
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
          getRolesAccounting(main_authority)
            .then(responseRoles => {
              let sub_total = response.data.data.sub_total
              responseRoles.data.data.map((row, key) => {
                if (parseFloat(sub_total) >= row.min_value && parseFloat(sub_total) <= row.max_value) {
                  setApproveParkAPStaff(monitoring_role.findIndex((element) => element === row.name) >= 0)
                }
              })
            })
            .catch(() => {
              setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 10000);
            })
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

  const getRolesSignedGiroData = useCallback(() => {
    getRolesSignedGiro(main_authority)
      .then((response) => {
        setMainRolesSignedGiroData(response["data"]["data"]);
      })
      .catch((error) => {
        setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 10000);
      });
  }, [termin, intl, setToast]);

  useEffect(getBkbData, []);
  useEffect(getRolesBKBData, []);
  useEffect(getRolesSignedGiroData, []);

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
    if (modalApproved.data === "approveBKB") {
      const data = {
        id: bkbData.id,
        approved_bkb_id: data_login.user_id,
        term_id: termin,
        desc: bkbData.desc,
        approved_bkb_role_id: modalApproved.role_id
      }
      approveBkb(data)
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
        desc: bkbData.desc,
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
        term_id: termin,
        giro_signed_data: giroSignedData
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
    } else if (modalApproved.data === "approveSignedGiro") {
      const giro_signed_data = Object.assign([], bkbData?.giro_signed_data);
      const index = giro_signed_data.findIndex((element) => element.id === modalApproved.role_id)
      giro_signed_data[index].role_id = modalApproved.role_id
      giro_signed_data[index].approved_id = data_login.user_id
      const data = {
        id: bkbData.id,
        index: index,
        giro_signed_data: giro_signed_data,
        user_id: data_login.user_id,
        desc: bkbData.desc
      }
      approveGiro(data)
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
        doc_park_ap_submit_at: bkbData.doc_park_ap_updated_at ? bkbData.doc_park_ap_updated_at : bkbData.doc_park_ap_submit_at,
        term_id: termin
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
        doc_park_byr_submit_at: bkbData.doc_park_byr_updated_at ? bkbData.doc_park_byr_updated_at : bkbData.doc_park_byr_submit_at,
        term_id: termin
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
    } else if (modalRejected.data === "rejectBKB") {
      var note = document.getElementById("commentRejected").value;
      const data = {
        id: bkbData.id,
        desc: bkbData.desc,
        user_id: data_login.user_id,
        rejected_remark: note
      }
      rejectBkb(data)
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

  const handleCheckbox = (e, row) => {
    if (e.target.checked) {
      setGiroSignedData([...giroSignedData, { id: e.target.value, name: row.name }]);
      setCountGiroSigned(countGiroSigned + 1)
    } else {
      setGiroSignedData(
        giroSignedData.filter(function (row) {
          return row.id !== e.target.value;
        })
      );
      setCountGiroSigned(countGiroSigned - 1)
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
        open={modalApproved.statusDialog}
        TransitionComponent={Transition}
        keepMounted
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        maxWidth={modalApproved.data === "monitoringApproveParkBYR" ? "sm" : "xs"}
        fullWidth={true}
      >
        <DialogTitle>
          <FormattedMessage id="TITLE.CONFIRMATION" />
        </DialogTitle>
        <DialogContent>
          {modalApproved.data === "monitoringApproveParkBYR" && <FormattedMessage id="TITLE.CHOOSE_BKB_GIRO_SIGNED" />}
          {modalApproved.data === "monitoringApproveParkBYR" &&
            <div className="row">
              {/* mainRolesSignedGiroData */}
              <div className="my-3">
                {mainRolesSignedGiroData?.map((row, key) => {
                  return (
                    <FormControlLabel
                      className="col-sm-3 mx-0 mb-1"
                      key={key}
                      control={
                        <Checkbox
                          value={row.id}
                          color="secondary"
                          onChange={e => handleCheckbox(e, row)}
                          className="py-1"
                        />
                      }
                      label={row.name}
                    />
                  )
                })}
              </div>
            </div>
          }
          <FormattedMessage id="TITLE.NOTIF_ACTION_CHANGES" />
        </DialogContent>
        <DialogActions>
          <button
            className="btn btn-primary"
            type="button"
            disabled={
              modalApproved.loading ||
              (modalApproved.data === "monitoringApproveParkBYR" && countGiroSigned < 2)
            }
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
                  <FormattedMessage id="TITLE.TRANSFER_LETTER" />
                </span>
              </div>
              <div className="col-sm-10 form-group">
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
              </div>
              <div className="col-sm-10 form-group">
                <div className="row">
                  <div className="col-sm-12">
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
                style={{ height: 125 }}
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
                  <div className="d-flex align-items-end">
                    <span className="mx-auto">
                      {bkbData?.archived_at
                        ? window
                          .moment(
                            new Date(
                              bkbData?.archived_at
                            )
                          )
                          .format("DD/MM/YYYY")
                        : ""}
                    </span>
                  </div>
                </div>
              </div>
              <div
                className="col-sm border"
                style={{ height: 125 }}
              >
                <div
                  className="text-center"
                  style={{
                    height: styleCustom.minHeightAppv,
                    paddingTop: 10,
                    paddingBottom: 10,
                  }}
                >
                  {approveParkAPStaff &&
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
                  {approveParkAPStaff &&
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
                  <div className="d-flex align-items-end">
                    <span className="mx-auto">
                      {bkbData?.doc_park_ap_approved_at
                        ? window
                          .moment(
                            new Date(
                              bkbData?.doc_park_ap_approved_at
                            )
                          )
                          .format("DD/MM/YYYY")
                        : ""}
                    </span>
                  </div>
                </div>
              </div>
              <div
                className="col-sm border text-center"
                style={{ height: 125 }}
              >
                <div
                  className="text-center"
                  style={{
                    height: styleCustom.minHeightAppv,
                    paddingTop: 10,
                    paddingBottom: 10,
                  }}
                >
                  {approveParkByrStaff &&
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
                  {approveParkByrStaff &&
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
                  <div className="d-flex align-items-end">
                    <span className="mx-auto">
                      {bkbData?.doc_park_byr_approved_at
                        ? window
                          .moment(
                            new Date(
                              bkbData?.doc_park_byr_approved_at
                            )
                          )
                          .format("DD/MM/YYYY")
                        : ""}
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
                  !approveBkbStaff ||
                  !bkbData) &&
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
                  approveBkbStaff &&
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
                  bkbData?.doc_park_ap_state === 'PENDING' ||
                  bkbData?.doc_park_ap_state === 'REJECTED' ||
                  !submitParkByrStaff ||
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
                {((!bkbData?.doc_park_byr_no &&
                  bkbData?.doc_park_ap_state === 'APPROVED') ||
                  bkbData?.doc_park_byr_state === 'REJECTED' &&
                  bkbData) &&
                  submitParkByrStaff &&
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
                  {/* <div className="col-sm-4 border">
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
                  </div> */}

                  <div className="col-sm-12 border">
                    <div className="row border">
                      <div className="col-sm text-center">
                        <span>
                          <FormattedMessage id="TITLE.APPROVED_BY" />
                        </span>
                      </div>
                    </div>
                    <div className="row">
                      {mainRolesBKBData?.map((row, key) => {
                        if (parseFloat(bkbData?.sub_total) >= row?.min_value && parseFloat(bkbData?.sub_total) <= row?.max_value) {
                          return (
                            <div className="col-sm border text-center px-0" key={key}>
                              <span style={{ fontSize: 10 }}>{row?.name}</span>
                            </div>
                          )
                        }
                      }
                      )}
                    </div>
                    <div className="row">
                      {mainRolesBKBData?.map((row, key) => {
                        if (parseFloat(bkbData?.sub_total) >= row?.min_value && parseFloat(bkbData?.sub_total) <= row?.max_value) {
                          return (
                            <div
                              className="col-sm border-right"
                              style={{ height: styleCustom.heightAppvDiv }}
                              key={key}
                            >
                              <div
                                className="text-center"
                                style={{
                                  height: 100,
                                  paddingTop: 5,
                                  paddingBottom: 5,
                                }}
                              >
                                {((monitoringFinanceDirec === row.name) ||
                                  (monitoringFinance === row.name) ||
                                  (monitoringTax === row.name)
                                ) &&
                                  bkbData?.approved_bkb_id === null &&
                                  bkbData?.doc_park_byr_approved_id && (
                                    <button
                                      type="button"
                                      className="btn btn-primary btn-sm"
                                      style={{ fontSize: 10, marginTop: 20 }}
                                      onClick={() => {
                                        setModalApproved({
                                          ...modalApproved,
                                          statusDialog: true,
                                          data: "approveBKB",
                                          role_id: row.id
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
                                {((monitoringFinanceDirec === row.name) ||
                                  (monitoringFinance === row.name) ||
                                  (monitoringTax === row.name)
                                ) &&
                                  bkbData?.approved_bkb_id === null &&
                                  bkbData?.doc_park_byr_approved_id && (
                                    <button
                                      type="button"
                                      className="btn btn-danger btn-sm mx-2"
                                      style={{ fontSize: 10, marginTop: 20 }}
                                      onClick={() => {
                                        setModalRejected({
                                          ...modalRejected,
                                          statusDialog: true,
                                          data: "rejectBKB",
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
                                {bkbData?.approved_bkb_id &&
                                  bkbData?.approved_bkb_role_id === row.id && (
                                    <QRCodeG
                                      value={`${window.location.origin}/qrcode?term_id=${termin}&role_id=${bkbData?.approved_bkb_role_id}&type=APPROVED_BKB`}
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
                                    {bkbData?.approved_bkb_id &&
                                      bkbData?.approved_bkb_role_id === row.id && (
                                        <span>{bkbData?.approve_bkb_name}</span>
                                      )}
                                  </span>
                                  <br />
                                  <span style={{ fontSize: 10 }}>
                                    <FormattedMessage id="TITLE.DATE" />:
                                    {bkbData?.approved_bkb_at &&
                                      bkbData?.approved_bkb_role_id === row.id
                                      ? window
                                        .moment(
                                          new Date(
                                            bkbData?.approved_bkb_at
                                          )
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
                  {bkbData?.giro_signed_data?.map((row, key) => {
                    return (
                      <div className="col-sm border text-center px-0" key={key}>
                        <span style={{ fontSize: 10 }}>{row.name}</span>
                      </div>
                    )
                  })}
                </div>
                <div className="row">
                  {bkbData?.giro_signed_data?.map((row, key) => {
                    return (
                      <div
                        className="col-sm border-right"
                        style={{ height: styleCustom.heightAppvDiv }}
                        key={key}
                      >
                        <div
                          className="text-center"
                          style={{
                            height: styleCustom.minHeightAppv,
                            paddingTop: 5,
                            paddingBottom: 5,
                          }}
                        >
                          {monitoring_role?.includes(row.name) &&
                            !row.approved_id && (
                              <button
                                type="button"
                                className="btn btn-primary btn-sm mx-2"
                                style={{ fontSize: 10, marginTop: 20 }}
                                onClick={() => {
                                  setModalApproved({
                                    ...modalApproved,
                                    statusDialog: true,
                                    data: "approveSignedGiro",
                                    role_id: row.id
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
                          {row.approved_id &&
                            <QRCodeG
                              value={`${window.location.origin}/qrcode?term_id=${termin}&role_id=${row.id}&type=SIGNED_GIRO`}
                              size="60"
                            />
                          }
                        </div>
                        <div className="d-flex align-items-end">
                          <div>
                            <span style={{ fontSize: 8 }}>
                              <FormattedMessage id="TITLE.NAME" />:
                              {row.approved_name}
                            </span>
                            <br />
                            <span style={{ fontSize: 8 }}>
                              <FormattedMessage id="TITLE.DATE" />:
                              {row.approved_at
                                ? window
                                  .moment(new Date(row.approved_at))
                                  .format("DD MMMM YYYY")
                                : "-"}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
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
