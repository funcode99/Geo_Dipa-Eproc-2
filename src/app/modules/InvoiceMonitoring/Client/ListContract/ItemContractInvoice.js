import React, { useState, useEffect } from "react";
import { Slide, IconButton } from "@material-ui/core";
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
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ButtonAction from "../../../../components/buttonAction/ButtonAction";
import RowAccordion from "../../../DeliveryMonitoring/pages/Termin/Documents/components/RowAccordion";
import { formatDate } from "../../../../libs/date";
import BtnAksi from "../../../DeliveryMonitoring/pages/Termin/Documents/components/BtnAksi";
import { getDeliverableInInvoive } from "../../_redux/InvoiceMonitoringCrud";
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
    label: "CONTRACT_DETAIL.TABLE_ACTION.DETAIL",
    icon: "fas fa-search text-primary",
    type: "open",
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
  const classes = useStyles();
  const { termin } = useParams();
  const [Toast, setToast] = useToast();
  const [loading, setLoading] = useState(false);
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

  const handleAction = (type, data) => {
    console.log("type: ", type, " - ", "data: ", data);
    // history.push(`/client/invoice_monitoring/contract/${contract}/1`);
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

  useEffect(callApi, []);

  const BtnLihat = ({ url }) => {
    const handleOpen = React.useCallback(() => {
      window.open(url, "_blank");
    }, [url]);
    return (
      <div className={"d-flex flex-row align-items-center"}>
        {/* <Typography>{url}</Typography> */}
        {url && (
          <button onClick={handleOpen} href="#text-buttons">
            Lihat Dokumen
          </button>
        )}
      </div>
    );
  };

  return (
    <React.Fragment>
      <Toast />
      {loading && <LinearProgress color="secondary" className="rounded" />}
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
                      <td className="align-middle text-center">1</td>
                      <td>----</td>
                      <td>----</td>
                      <td className="align-middle text-center">----</td>
                      <td className="align-middle">
                        <ButtonAction
                          data={[]}
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
                                            <BtnAksi
                                              item={els}
                                              handleAction={handleAction}
                                              isPeriodic={isPeriodic}
                                            />,
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
                                      <BtnAksi
                                        item={el}
                                        handleAction={handleAction}
                                      />,
                                      //   "aksi",
                                    ]}
                                  />
                                ));
                          }}
                        </RowAccordion>
                      );
                    })}
                    {/* <tr>
                      <td className="align-middle text-center">1</td>
                      <td>----</td>
                      <td>----</td>
                      <td className="align-middle text-center">----</td>
                      <td className="align-middle">
                        <ButtonAction
                          data={[]}
                          handleAction={handleAction}
                          ops={data_ops}
                        />
                      </td>
                    </tr> */}
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
              <ContractReceiptPage {...props}
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
