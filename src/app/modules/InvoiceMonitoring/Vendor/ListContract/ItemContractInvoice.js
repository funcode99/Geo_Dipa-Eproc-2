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
  TableRow,
  TableCell,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ButtonAction from "../../../../components/buttonAction/ButtonAction";
import {
  getFileEproc,
  getListDocSoftCopy,
  updateSoftCopyByUser,
} from "../../_redux/InvoiceMonitoringCrud";
import useToast from "../../../../components/toast";
import { useParams } from "react-router-dom";
import TableOnly from "../../../../components/tableCustomV1/tableOnly";
import { DEV_NODE, DEV_RUBY } from "../../../../../redux/BaseHost";

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
          <div style={{ width: "100%" }}>
            <TableOnly
              dataHeader={headerTable}
              loading={loading}
              // err={err}
              hecto={8}
          >
                    {dataDocSoftCopy.map((item, index) => {
                      return (
                        item.seq === 5 && (
                    <TableRow key={index.toString()}>
                      <TableCell>{1}</TableCell>
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
                              {item.softcopy_state === "REJECTED" &&
                                item.doc_no &&
                                item.seq === 5 && (
                                  <ButtonAction
                                    data={Object.assign({}, item)}
                                    handleAction={handleAction}
                                    ops={data_ops}
                                  />
                                )}
                      </TableCell>
                    </TableRow>
                        )
                      );
                    })}
            </TableOnly>
          </div>
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
