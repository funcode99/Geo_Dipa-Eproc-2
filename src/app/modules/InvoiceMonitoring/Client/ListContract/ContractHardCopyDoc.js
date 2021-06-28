import React, { useState, useEffect, useCallback } from "react";
import { connect, shallowEqual, useSelector } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import {
  Card,
  CardBody,
  CardFooter,
} from "../../../../../_metronic/_partials/controls";
// import {
//   getContractSummary,
//   saveInvoice,
//   getInvoice,
// } from "../../../_redux/InvoiceMonitoringCrud";
// import useToast from "../../../../../components/toast";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import { rupiah } from "../../../../../libs/currency";
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
} from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import RowAccordion from "../../../DeliveryMonitoring/pages/Termin/Documents/components/RowAccordion";
import { formatDate } from "../../../../libs/date";

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
  const { intl } = props;
  const classes = useStyles();
  const [modalReject, setModalReject] = useState(false);
  const [dataReject, setDataReject] = useState({});
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
  const [dataDeliverables, setDataDeliverables] = useState([]);

  function handleAction(type, data) {
    if (type === "reject") {
      setDataReject(data);
      setModalReject(true);
    }
    console.log("type", type);
    console.log("data", data);
  }

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

  const handleActionDeliverable = (type, data) => {
    if (type === "rejected") {
      setDataReject(data);
      setModalReject(true);
    }
    console.log("handleActionDeliverable type: ", type, " - ", "data: ", data);
  };

  return (
    <React.Fragment>
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
                            No
                          </th>
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
                          <td>-</td>
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
                          <td></td>
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
                          <td></td>
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
                              data={[
                                "accordIcon",
                                el.name,
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
                                                formatDate(
                                                  new Date(els?.due_date)
                                                ),
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
                                              handleAction={
                                                handleActionDeliverable
                                              }
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
                          <th className="bg-primary text-white align-middle td-40">
                            nama Dokumen
                          </th>
                          <th className="bg-primary text-white align-middle td-25">
                            tanggal dokumen
                          </th>
                          <th className="bg-primary text-white align-middle td-25">
                            lihat dokumen
                          </th>
                          <th className="bg-primary text-white align-middle td-10">
                            aksi
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>SPP</td>
                          <td>-</td>
                          <td className="align-middle text-center">-</td>
                          <td className="align-middle">
                            <ButtonAction
                              data={"1"}
                              handleAction={handleAction}
                              ops={data_ops}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>Invoice</td>
                          <td>-</td>
                          <td className="align-middle text-center">-</td>
                          <td className="align-middle">
                            <ButtonAction
                              data={"1"}
                              handleAction={handleAction}
                              ops={data_ops}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>Kwitansi</td>
                          <td>-</td>
                          <td className="align-middle text-center">-</td>
                          <td className="align-middle">
                            <ButtonAction
                              data={"1"}
                              handleAction={handleAction}
                              ops={data_ops}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>Faktur pajak</td>
                          <td>-</td>
                          <td className="align-middle text-center">-</td>
                          <td className="align-middle">
                            <ButtonAction
                              data={"1"}
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
        </CardBody>
        <CardFooter>
          <button type="button" className="btn btn-sm btn-primary">
            Send Notiv
          </button>
        </CardFooter>
      </Card>
    </React.Fragment>
  );
}
export default injectIntl(connect(null, null)(ContractHardCopyDoc));
