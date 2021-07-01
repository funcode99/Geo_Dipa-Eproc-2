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
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ButtonAction from "../../../../components/buttonAction/ButtonAction";
import RowAccordion from "../../../DeliveryMonitoring/pages/Termin/Documents/components/RowAccordion";
import { formatDate } from "../../../../libs/date";
import BtnAksi from "../../../DeliveryMonitoring/pages/Termin/Documents/components/BtnAksi";
import {
  getDeliverableInInvoive,
  getContractSoftCopy,
  getContractDistributionSPK,
  getContractDistributionAgreement,
  getFileEproc,
  getListDocSoftCopy,
  getDetailDocSoftCopy,
  sendApprovedDocSoftCopy,
  sendRejectedDocSoftCopy,
} from "../../_redux/InvoiceMonitoringCrud";
import useToast from "../../../../components/toast";
import { useHistory, useParams } from "react-router-dom";

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
    id: "SPR",
    label: "SPR",
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
  const [dataSoftCopy, setDataSoftCopy] = useState({});
  const classes = useStyles();
  const { contract, termin } = useParams();
  const [Toast, setToast] = useToast();
  const [loading, setLoading] = useState(false);
  const [loadingRequest, setLoadingRequest] = useState(false);
  const [contractFilename, setContractFilename] = useState(false);
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
  const user_id = useSelector((state) => state.auth.user.data.user_id);

  const handleAction = (type, data) => {
    if (type === "rejected") {
      setModalReject({ ...modalReject, statusDialog: true, data: data });
    } else if (type === "approved") {
      setModalApproved({ ...modalApproved, statusDialog: true, data: data });
    }
    console.log("type: ", type, " - ", "data: ", data);
    // history.push(`/client/invoice_monitoring/contract/${contract}/1`);
  };

  const handleActionDeliverable = (type, data) => {
    if (type === "rejected") {
      setModalReject({ ...modalReject, statusDialog: true, data: data });
    }
    console.log("handleActionDeliverable type: ", type, " - ", "data: ", data);
  };

  const callApi = () => {
    setLoading(true);
    getDeliverableInInvoive(termin)
      .then((result) => {
        setLoading(false);
        setDataDeliverables(result.data.data.task_documents);
      })
      .catch((error) => {
        setLoading(false);
        setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 5000);
      });
  };

  const getContractDistributionSPKData = () => {
    setLoading(true);
    getContractDistributionSPK(contract)
      .then((result) => {
        setLoading(false);
        if (result.data !== "DATA NOT FOUND!") {
          setContractFilename(result.data.data.items.data.fileName);
        }
      })
      .catch((error) => {
        setLoading(false);
        setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 5000);
      });
  };

  const getContractDistributionAgreementData = () => {
    setLoading(true);
    getContractDistributionAgreement(contract)
      .then((result) => {
        setLoading(false);
        if (result.data !== "DATA NOT FOUND!") {
          setContractFilename(result.data.data.items.data.fileName);
        }
      })
      .catch((error) => {
        setLoading(false);
        setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 5000);
      });
  };

  const callApiContractSoftCopy = () => {
    setLoading(true);
    getListDocSoftCopy()
      .then((result) => {
        getDetailDocSoftCopy(contract, termin)
          .then((results) => {
            result.data.data.map((item, index) => {
              if (item.seq === 1)
                item.no_document = results.data.data?.contract_no;
              if (item.seq === 2)
                item.no_document = results.data.data?.po_number;
              if (item.seq === 3) item.no_document = results.data.data?.bapp;
              if (item.seq === 4) item.no_document = results.data.data?.bast;
              if (item.seq === 5)
                item.no_document = results.data.data?.npwp_number;
            });
            setDataDocSoftCopy(result.data.data);
            // getDetailDocSoftCopy();
          })
          .catch((err) => {
        setLoading(false);
            setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 5000);
          });
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

  const getFileContract = (e) => {
    e.preventDefault();
    getFileEproc({ filename: contractFilename })
      .then((result) => {
        var a = document.createElement("a");
        a.href = result.data.data.items.respons;
        a.download = contractFilename;
        a.click();
        a.remove();
      })
      .catch((error) => {
        setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 5000);
      });
  };

  useEffect(callApi, []);
  useEffect(callApiContractSoftCopy, []);

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

  const handleApproved = () => {
    setModalApproved({ ...modalApproved, loading: true });
    var data = {
      softcopy_approved_by_id: user_id,
    };
    sendApprovedDocSoftCopy(modalApproved.data.document_id, data)
      .then((result) => {
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
  };

  const handleRejected = (e) => {
    e.preventDefault();
    setModalReject({ ...modalReject, loading: true });
    var note = document.getElementById("commentRejected").value;
    sendRejectedDocSoftCopy(modalReject.data.document_id)
      .then((result) => {
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
        }, 2500);
      })
      .catch((err) => {
        setModalReject({
          ...modalReject,
          loading: true,
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
        <form onSubmit={handleRejected}>
          <DialogTitle id="alert-dialog-slide-title">
            <FormattedMessage id="TITLE.REJECT_DOCUMENT" />
            <span className="text-danger">
              {" " +
                (modalReject.data.document?.name || "") +
                (modalReject.data?.due_date
                  ? " - " +
                    window
                      .moment(new Date(modalReject.data?.due_date))
                      .format("DD MMM YYYY")
                  : "")}
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
          <div
            className="table-wrapper-scroll-y my-custom-scrollbar"
            style={{ width: "100%" }}
          >
            <div className="segment-table">
              <div className="hecto-8">
                <table className="table-bordered overflow-auto">
                  <thead>
                    <tr>
                      <th className="bg-primary text-white align-middle">
                        <FormattedMessage id="TITLE.TABLE_HEADER.NO" />
                      </th>
                      <th className="bg-primary text-white align-middle">
                        <FormattedMessage id="TITLE.DOCUMENT_NAME" />
                      </th>
                      <th className="bg-primary text-white align-middle">
                        <FormattedMessage id="TITLE.NO_DOCUMENT" />
                      </th>
                      <th className="bg-primary text-white align-middle">
                        <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.APPROVED_DATE" />
                      </th>
                      <th className="bg-primary text-white align-middle">
                        <FormattedMessage id="CONTRACT_DETAIL.TABLE_HEAD.ACTION" />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataDocSoftCopy.map((item, index) => {
                      return (
                        <tr key={index.toString()}>
                          <td className="align-middle">{item.seq}</td>
                          <td>{item.document_name}</td>
                          <td>{item.no_document}</td>
                          {/* {contractFilename ? (
                        <td>
                          <a href="#" onClick={getFileContract}>
                            {dataSoftCopy?.contract_number}
                          </a>
                        </td>
                      ) : (
                        <td>
                              {dataSoftCopy?.contract_number} (file tidak
                              tersedia)
                        </td>
                          )} */}
                          <td className="align-middle">Belum Tersedia</td>
                      <td className="align-middle">
                        <ButtonAction
                              data={item}
                          handleAction={handleAction}
                          ops={data_ops}
                        />
                      </td>
                    </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
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
          <div
            className="table-wrapper-scroll-y my-custom-scrollbar"
            style={{ width: "100%" }}
          >
            <div className="segment-table">
              <div className="hecto-17">
                <table className="table-bordered overflow-auto">
                  <thead>
                    <tr>
                      {theadDocuments.map((item) => (
                        <th
                          className="bg-primary text-white align-middle"
                          key={item.id}
                        >
                          {item.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {dataDeliverables?.map((el, id) => {
                      // Jenis Dokumen
                      return (
                        <RowAccordion
                          key={id}
                          dataAll={el}
                          data={["accordIcon", el.name, "-", "-", "-", "-", ""]}
                        >
                          {(item) => {
                            const isPeriodic = item.is_periodic;
                            // Periode Dokumen
                            return isPeriodic
                              ? item?.periodes?.map((el, id) => (
                                  <RowAccordion
                                    key={id}
                                    classBtn={"pl-12"}
                                    dataAll={el}
                                    data={[
                                      "accordIcon",
                                      el?.name,
                                      "-",
                                      "-",
                                      "-",
                                      "-",
                                      "",
                                    ]}
                                  >
                                    {/* Dokumen */}
                                    {(item2) =>
                                      item2?.documents?.map((els, idx) => (
                                        <RowAccordion
                                          key={idx}
                                          classBtn={"pl-17"}
                                          data={[
                                            "accordIcon",
                                            els?.document_custom_name ??
                                              els?.document?.name,
                                            formatDate(new Date(els?.due_date)),
                                            els?.url === null
                                              ? "WAITING TO UPLOAD"
                                              : "AVAILABLE",
                                            <BtnLihat url={els?.url} />,
                                            els?.remarks,
                                            els?.url && (
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
                                    classBtn={"pl-17"}
                                    data={[
                                      "accordIcon",
                                      el?.document_custom_name ??
                                        el?.document?.name,
                                      formatDate(new Date(el?.due_date)),
                                      el?.url === null
                                        ? "WAITING TO UPLOAD"
                                        : "AVAILABLE",
                                      <BtnLihat url={el?.url} />,
                                      el?.remarks,
                                      el?.url && (
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
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {/* end: Table */}
        </ExpansionPanelDetails>
      </ExpansionPanel>

      <Card>
        <CardHeader title="">
          <CardHeaderToolbar>
            <button type="button" className="btn btn-sm btn-primary">
              Send Notif
            </button>
          </CardHeaderToolbar>
        </CardHeader>
        <CardBody>
          <Navs
            navLists={navLists}
            handleSelect={(selectedKey) => setNavActive(selectedKey)}
          />

          {navActive === "SPR" && (
            <div className="table-wrapper-scroll-y my-custom-scrollbar my-5 h-100">
              <ContractSprPage
                {...props}
                classes={classes}
                dialogTitleFile={DialogTitleFile}
                transition={Transition}
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
              />
            </div>
          )}
        </CardBody>
      </Card>
    </React.Fragment>
  );
}
export default injectIntl(connect(null, null)(ItemContractInvoice));
