import React, { useState, useEffect } from "react";
import { connect, useSelector } from "react-redux";
import { injectIntl, FormattedMessage } from "react-intl";
import { Card, CardBody } from "../../../../../_metronic/_partials/controls";
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
import {
  getDeliverableInInvoive,
  getContractSoftCopy,
  getContractDistributionSPK,
  getContractDistributionAgreement,
  getFileEproc,
  getListDocSoftCopy,
  getDetailDocSoftCopy,
  sendApprovedDocSoftCopy,
  softcopy_save,
  sendRejectedDocSoftCopyLast,
  sendApprovedDocSoftCopyLast,
  updateSoftCopyByUser,
  getFileRuby,
} from "../../_redux/InvoiceMonitoringCrud";
import useToast from "../../../../components/toast";
import { useParams } from "react-router-dom";

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
}));

const data_ops = [
  {
    label: "TITLE.UPLOAD",
    icon: "fas fa-cloud-upload-alt text-success",
    type: "upload",
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

const supportedFormats = [
  "application/pdf",
  "application/x-pdf",
  "application/x-bzpdf",
  "application/x-gzpdf",
];

function ItemContractInvoice(props) {
  const { intl } = props;
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

  const [navActive, setNavActive] = useState(navLists[0].id);
  const classes = useStyles();
  const [modalUpload, setModalUpload] = useState({
    statusDialog: false,
    data: {},
    loading: false,
    statusReq: false,
  });
  const [uploadFilename, setUploadFilename] = useState(
    intl.formatMessage({
      id: "TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.DEFAULT_FILENAME",
    })
  );
  const [loading, setLoading] = useState(false);
  const [dataDocSoftCopy, setDataDocSoftCopy] = useState([]);
  const [Toast, setToast] = useToast();
  const { contract, termin } = useParams();
  const user_id = useSelector((state) => state.auth.user.data.user_id);

  const handleAction = (type, data) => {
    if (type === "upload") {
      setModalUpload({
        ...modalUpload,
        statusDialog: true,
        data: data,
      });
    }
    console.log("handleAction type: ", type, " - ", "data: ", data);
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
      getFileRuby(name);
    } else if (status === "monitoring") {
    }
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

  useEffect(callApiContractSoftCopy, []);

  return (
    <React.Fragment>
      <Toast />
      {loading && <LinearProgress color="secondary" className="rounded" />}
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
              <input
                type="file"
                className="form-control text-truncate mb-3 col-sm-8"
                id={modalUpload.loading ? "uploads" : "upload"}
                name={modalUpload.loading ? "uploads" : "upload"}
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
                        item.seq === 5 && (
                          <tr key={index.toString()}>
                            <td className="align-middle">{1}</td>
                            <td>{item.document_name}</td>
                            {item.doc_no ? (
                              item.doc_file ? (
                                <td>
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
                                </td>
                              ) : (
                                <td>{item.doc_no} (file tidak tersedia)</td>
                              )
                            ) : (
                              <td></td>
                            )}
                            <td className="align-middle">
                              {item.softcopy_approved_at
                                ? window
                                    .moment(new Date(item.softcopy_approved_at))
                                    .format("DD MMM YYYY")
                                : ""}
                            </td>
                            <td className="align-middle">
                              {item.softcopy_state === "REJECTED" &&
                                item.doc_no &&
                                item.seq === 5 && (
                                  <ButtonAction
                                    data={Object.assign({}, item)}
                                    handleAction={handleAction}
                                    ops={data_ops}
                                  />
                                )}
                            </td>
                          </tr>
                        )
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
                supportedFormats={supportedFormats}
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
                supportedFormats={supportedFormats}
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
                supportedFormats={supportedFormats}
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
                supportedFormats={supportedFormats}
              />
            </div>
          )}
        </CardBody>
      </Card>
    </React.Fragment>
  );
}
export default injectIntl(connect(null, null)(ItemContractInvoice));
