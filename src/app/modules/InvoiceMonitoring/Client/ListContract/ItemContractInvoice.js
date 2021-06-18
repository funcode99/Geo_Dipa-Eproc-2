import React, { useState } from "react";
import { Slide, IconButton } from "@material-ui/core";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
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
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ButtonAction from "../../../../components/buttonAction/ButtonAction";
import RowAccordion from "../../../DeliveryMonitoring/pages/Termin/Documents/components/RowAccordion";
import { formatDate } from "../../../../libs/date";
import BtnAksi from "../../../DeliveryMonitoring/pages/Termin/Documents/components/BtnAksi";

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
}));

const data_ops = [
  {
    label: "CONTRACT_DETAIL.TABLE_ACTION.DETAIL",
    icon: "fas fa-search text-primary",
    type: "open",
  },
];

const theadDocuments = [
  { id: "action", label: "" },
  { id: "doc-name", label: "Document Name" },
  { id: "due-date", label: "Due Date" },
  { id: "dokumen-progress", label: "Document Progress" },
  { id: "deliv-dokumen", label: "Deliverable Document" },
  { id: "remarks", label: "Remarks" },
  { id: "aksi", label: "Action" },
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

const dataTemp = [
  {
    id: "8733b2b0-de33-4a83-a907-ebeb0e701c31",
    name: "Dokumen Sertifikat Pelaksana Pekerjaan",
    is_periodic: false,
    createdAt: "2021-06-17T16:05:13.292Z",
    updatedAt: "2021-06-17T16:05:13.292Z",
    documents: [
      {
        url: null,
        id: "e5df93f0-fff2-4b48-ab63-587807c5dfc8",
        task_id: "2c192520-10a3-4bb5-956f-fa56cac0690d",
        document_id: "30053134-361b-4316-a655-1088a2deb957",
        due_date: "2021-06-17",
        document_custom_name: null,
        is_submited: null,
        document_status_id: "fab6cae1-dfb5-4e56-a849-1443b9fb405a",
        invoice_document_status_id: "fab6cae1-dfb5-4e56-a849-1443b9fb405a",
        progress: null,
        remarks: null,
        createdAt: "2021-06-17T18:15:56.920Z",
        updatedAt: "2021-06-17T18:15:56.920Z",
        document: {
          id: "30053134-361b-4316-a655-1088a2deb957",
          name: "Sertifikat Kepersertaan BPJS",
          document_type_id: "8733b2b0-de33-4a83-a907-ebeb0e701c31",
          periode_id: null,
          is_custom: null,
          createdAt: "2021-06-17T16:05:13.429Z",
          updatedAt: "2021-06-17T16:05:13.429Z",
        },
        document_status: {
          id: "fab6cae1-dfb5-4e56-a849-1443b9fb405a",
          name: "WAITING",
          code: "waiting",
          createdAt: "2021-06-17T16:05:13.295Z",
          updatedAt: "2021-06-17T16:05:13.295Z",
        },
      },
    ],
  },
  {
    id: "90627407-6aee-461f-b084-b0b97d44ad56",
    name: "Laporan Pekerjaan",
    is_periodic: true,
    createdAt: "2021-06-17T16:05:13.292Z",
    updatedAt: "2021-06-17T16:05:13.292Z",
    periodes: [
      {
        id: "f204baea-5e14-4ae8-abe7-b482b8a08da2",
        name: "MINGGUAN",
        value: 7,
        createdAt: "2021-06-17T16:05:13.280Z",
        updatedAt: "2021-06-17T16:05:13.280Z",
        documents: [
          {
            url: null,
            id: "1ddfd5f2-0982-4878-b683-6ca9ddb5fd69",
            task_id: "2c192520-10a3-4bb5-956f-fa56cac0690d",
            document_id: "eb6eab4b-7baa-4bb8-a2b1-2059e594ed33",
            due_date: "2021-05-24",
            document_custom_name: null,
            is_submited: null,
            document_status_id: "fab6cae1-dfb5-4e56-a849-1443b9fb405a",
            invoice_document_status_id: "fab6cae1-dfb5-4e56-a849-1443b9fb405a",
            progress: null,
            remarks: null,
            createdAt: "2021-06-17T16:10:39.385Z",
            updatedAt: "2021-06-17T16:10:39.385Z",
            document: {
              id: "eb6eab4b-7baa-4bb8-a2b1-2059e594ed33",
              name: "Weekly Report",
              document_type_id: "90627407-6aee-461f-b084-b0b97d44ad56",
              periode_id: "f204baea-5e14-4ae8-abe7-b482b8a08da2",
              is_custom: null,
              createdAt: "2021-06-17T16:05:13.429Z",
              updatedAt: "2021-06-17T16:05:13.429Z",
            },
            document_status: {
              id: "fab6cae1-dfb5-4e56-a849-1443b9fb405a",
              name: "WAITING",
              code: "waiting",
              createdAt: "2021-06-17T16:05:13.295Z",
              updatedAt: "2021-06-17T16:05:13.295Z",
            },
          },
          {
            url: null,
            id: "7672211a-bf42-4383-89db-fa0df4d2a875",
            task_id: "2c192520-10a3-4bb5-956f-fa56cac0690d",
            document_id: "eb6eab4b-7baa-4bb8-a2b1-2059e594ed33",
            due_date: "2021-05-31",
            document_custom_name: null,
            is_submited: null,
            document_status_id: "fab6cae1-dfb5-4e56-a849-1443b9fb405a",
            invoice_document_status_id: "fab6cae1-dfb5-4e56-a849-1443b9fb405a",
            progress: null,
            remarks: null,
            createdAt: "2021-06-17T16:10:39.389Z",
            updatedAt: "2021-06-17T16:10:39.389Z",
            document: {
              id: "eb6eab4b-7baa-4bb8-a2b1-2059e594ed33",
              name: "Weekly Report",
              document_type_id: "90627407-6aee-461f-b084-b0b97d44ad56",
              periode_id: "f204baea-5e14-4ae8-abe7-b482b8a08da2",
              is_custom: null,
              createdAt: "2021-06-17T16:05:13.429Z",
              updatedAt: "2021-06-17T16:05:13.429Z",
            },
            document_status: {
              id: "fab6cae1-dfb5-4e56-a849-1443b9fb405a",
              name: "WAITING",
              code: "waiting",
              createdAt: "2021-06-17T16:05:13.295Z",
              updatedAt: "2021-06-17T16:05:13.295Z",
            },
          },
          {
            url: null,
            id: "fcbfdb86-7644-45b6-b29a-020c9f424ad7",
            task_id: "2c192520-10a3-4bb5-956f-fa56cac0690d",
            document_id: "eb6eab4b-7baa-4bb8-a2b1-2059e594ed33",
            due_date: "2021-06-07",
            document_custom_name: null,
            is_submited: null,
            document_status_id: "fab6cae1-dfb5-4e56-a849-1443b9fb405a",
            invoice_document_status_id: "fab6cae1-dfb5-4e56-a849-1443b9fb405a",
            progress: null,
            remarks: null,
            createdAt: "2021-06-17T16:10:39.392Z",
            updatedAt: "2021-06-17T16:10:39.392Z",
            document: {
              id: "eb6eab4b-7baa-4bb8-a2b1-2059e594ed33",
              name: "Weekly Report",
              document_type_id: "90627407-6aee-461f-b084-b0b97d44ad56",
              periode_id: "f204baea-5e14-4ae8-abe7-b482b8a08da2",
              is_custom: null,
              createdAt: "2021-06-17T16:05:13.429Z",
              updatedAt: "2021-06-17T16:05:13.429Z",
            },
            document_status: {
              id: "fab6cae1-dfb5-4e56-a849-1443b9fb405a",
              name: "WAITING",
              code: "waiting",
              createdAt: "2021-06-17T16:05:13.295Z",
              updatedAt: "2021-06-17T16:05:13.295Z",
            },
          },
        ],
      },
    ],
  },
];

function ItemContractInvoice(props) {
  const [navActive, setNavActive] = useState(navLists[0].id);
  const classes = useStyles();

  const handleAction = (type, data) => {
    console.log("type: ", type, " - ", "data: ", data);
    // history.push(`/client/invoice_monitoring/contract/${contract}/1`);
  };

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
      <ExpansionPanel
        defaultExpanded={false}
        className={classes.ExpansionPanelCard}
      >
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          className={classes.ExpansionPanelHeader}
        >
          <div className={classes.column}>
            <h6>Dokumen Pendukung</h6>
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
            <h6>Deliverables Document</h6>
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
                    {dataTemp?.map((el, id) => {
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
              <ContractReceiptPage {...props} />
            </div>
          )}

          {navActive === "Faktur" && (
            <div className="table-wrapper-scroll-y my-custom-scrollbar my-5 h-100">
              <ContractTaxPage {...props} />
            </div>
          )}
        </CardBody>
      </Card>
    </React.Fragment>
  );
}
export default injectIntl(connect(null, null)(ItemContractInvoice));
