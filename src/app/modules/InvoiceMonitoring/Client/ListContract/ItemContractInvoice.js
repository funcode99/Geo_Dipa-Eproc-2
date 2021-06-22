import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
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
import RowAccordion from "../../../DeliveryMonitoring/pages/Termin/Documents/components/RowAccordion";
import { formatDate } from "../../../../libs/date";
import BtnAksi from "../../../DeliveryMonitoring/pages/Termin/Documents/components/BtnAksi";
import { getDeliverableInInvoive, getContractSoftCopy, getContractDistributionSPK, getContractDistributionAgreement, getFileEproc } from "../../_redux/InvoiceMonitoringCrud";
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
    icon: "fas fa-check text-primary",
    type: "approved",
  },
  {
    label: "TITLE.REJECT_DOCUMENT",
    icon: "fas fa-times-circle text-danger",
    type: "rejected",
  },
];

const data_opsDeliverable = [
  {
    label: "TITLE.ACCEPT_DOCUMENT",
    icon: "fas fa-check text-primary",
    type: "approved",
  },
  {
    label: "TITLE.REJECT_DOCUMENT",
    icon: "fas fa-times-circle text-danger",
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
  const [modalReject, setModalReject] = useState(false);
  const [dataReject, setDataReject] = useState({});

  const handleAction = (type, data) => {
    if (type === "rejected") {
      setDataReject(data);
      setModalReject(true);
    }
    console.log("type: ", type, " - ", "data: ", data);
    // history.push(`/client/invoice_monitoring/contract/${contract}/1`);
  };

  const handleActionDeliverable = (type, data) => {
    if (type === "rejected") {
      setDataReject(data);
      setModalReject(true);
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
        if (result.data !== 'DATA NOT FOUND!') {
          setContractFilename(result.data.data.items.data.fileName)
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
        if (result.data !== 'DATA NOT FOUND!') {
          setContractFilename(result.data.data.items.data.fileName)
        }
      })
      .catch((error) => {
        setLoading(false);
        setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 5000);
      });
  };

  const callApiContractSoftCopy = () => {
    setLoading(true);
    getContractSoftCopy(contract)
      .then((result) => {
        setLoading(false);
        setDataSoftCopy(result.data.data);
        if (result.data.data.contract_status === "SPK") {
          getContractDistributionSPKData()
        } else {
          getContractDistributionAgreementData()
        }
      })
      .catch((error) => {
        setLoading(false);
        setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 5000);
      });
  };

  const getFileContract = (e) => {
    e.preventDefault();
    getFileEproc({ filename: contractFilename })
      .then((result) => {
        var a = document.createElement("a");
        a.href = result.data.data.items.respons;
        a.download = contractFilename;
        a.click();
        a.remove()
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

  return (
    <React.Fragment>
      <Toast />
      {loading && <LinearProgress color="secondary" className="rounded" />}
      <Dialog
        open={modalReject}
        TransitionComponent={Transition}
        keepMounted
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        maxWidth="xs"
        fullWidth={true}
      >
        <form noValidate autoComplete="off">
          <DialogTitle id="alert-dialog-slide-title">
            <FormattedMessage id="TITLE.REJECT_DOCUMENT" />
            <span className="text-danger">
              {" " +
                (dataReject.document?.name || "") +
                (dataReject?.due_date
                  ? " - " +
                    window
                      .moment(new Date(dataReject?.due_date))
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
              placeholder={intl.formatMessage({
                id:
                  "TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.SPP_DOCUMENT.REJECTED.REJECT_BODY",
              })}
              disabled={loadingRequest}
              // {...formik.getFieldProps("rejected_remark")}
            ></textarea>
            {/* {formik.touched.rejected_remark && formik.errors.rejected_remark ? (
              <span className="text-center text-danger">
                {formik.errors.rejected_remark}
              </span>
            ) : null} */}
          </DialogContent>
          <DialogActions>
            <button
              className="btn btn-secondary"
              type="button"
              onClick={() => setModalReject(false)}
              disabled={loadingRequest}
            >
              <span>
                <FormattedMessage id="AUTH.GENERAL.BACK_BUTTON" />
              </span>
            </button>
            <button
              className="btn btn-danger"
              type="submit"
              // disabled={
              //   loadingRequest ||
              //   (formik.touched && !formik.isValid) ||
              //   !formik.dirty
              // }
            >
              <span>
                <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.SPP_DOCUMENT.REJECTED.REJECT_SUBMIT" />
              </span>
              {loadingRequest && (
                <span
                  className="spinner-border spinner-border-sm ml-1"
                  aria-hidden="true"
                ></span>
              )}
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
              Dokumen Pendukung
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
                      <th className="bg-primary text-white align-middle">No</th>
                      <th className="bg-primary text-white align-middle">
                        Dokumen
                      </th>
                      <th className="bg-primary text-white align-middle">
                        Nomor
                      </th>
                      <th className="bg-primary text-white align-middle">
                        Tanggal Approved
                      </th>
                      <th className="bg-primary text-white align-middle">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="align-middle">1</td>
                      <td>
                        <FormattedMessage id="TITLE.USER_PROFILE.PERSONAL_INFORMATION.INPUT.CONTRACT" />
                      </td>
                      {contractFilename
                        ? <td><a href="#" onClick={getFileContract}>{dataSoftCopy?.contract_number}</a></td>
                        : <td>{dataSoftCopy?.contract_number} (file tidak tersedia)</td>
                      }
                      <td className="align-middle"></td>
                      <td className="align-middle">
                        <ButtonAction
                          data={{ document: { name: "Contract" } }}
                          handleAction={handleAction}
                          ops={data_ops}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="align-middle">2</td>
                      <td>Purch Order</td>
                      <td>{dataSoftCopy?.po_number}</td>
                      <td className="align-middle"></td>
                      <td className="align-middle">
                        <ButtonAction
                          data={{ document: { name: "Purch Order" } }}
                          handleAction={handleAction}
                          ops={data_ops}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="align-middle">3</td>
                      <td>
                        <FormattedMessage id="CONTRACT_DETAIL.TAB.OFFICIAL_REPORT" />
                      </td>
                      <td></td>
                      <td className="align-middle"></td>
                      <td className="align-middle">
                        <ButtonAction
                          data={{ document: { name: "BAPP" } }}
                          handleAction={handleAction}
                          ops={data_ops}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="align-middle">4</td>
                      <td>
                        <FormattedMessage id="CONTRACT_DETAIL.TAB.BAST" />
                      </td>
                      <td></td>
                      <td className="align-middle"></td>
                      <td className="align-middle">
                        <ButtonAction
                          data={{ document: { name: "BAST" } }}
                          handleAction={handleAction}
                          ops={data_ops}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="align-middle">5</td>
                      <td>
                        <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.TAX_DOCUMENT.TAX_NPWP" />
                      </td>
                      <td>{dataSoftCopy?.npwp_number}</td>
                      <td className="align-middle"></td>
                      <td className="align-middle">
                        <ButtonAction
                          data={{ document: { name: "NPWP" } }}
                          handleAction={handleAction}
                          ops={data_ops}
                        />
                      </td>
                    </tr>
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
