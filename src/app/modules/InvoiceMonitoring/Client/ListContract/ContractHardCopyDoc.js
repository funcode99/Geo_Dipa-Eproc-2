import React, { useState, useEffect, useCallback } from "react";
import { connect, shallowEqual, useSelector } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import {
  Card,
  CardBody,
  CardFooter,
} from "../../../../../_metronic/_partials/controls";
import { getInvoice, createBkb, getFileEproc, getListDocSoftCopy, approveHardCopy } from "../../_redux/InvoiceMonitoringCrud";
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
  TableRow,
  TableCell,
} from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import RowAccordion from "../../../DeliveryMonitoring/pages/Termin/Documents/components/RowAccordion";
import { formatDate } from "../../../../libs/date";
import useToast from "../../../../components/toast";
import TableOnly from "../../../../components/tableCustomV1/tableOnly";
import { DEV_NODE, DEV_RUBY } from "../../../../../redux/BaseHost";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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
  const [Toast, setToast] = useToast();
  const [dataReject, setDataReject] = useState({});
  const [invoiceData, setInvoiceData] = useState({});
  const [invoiceBkbExist, setInvoiceBkbExist] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataDocSoftCopy, setDataDocSoftCopy] = useState([]);

  const contract_id = props.match.params.contract;
  const termin = props.match.params.termin;
  const dataUser = useSelector((state) => state.auth.user.data);
  const user_id = useSelector(
    (state) => state.auth.user.data.user_id,
    shallowEqual
  );

  const [modalReject, setModalReject] = useState({
    statusDialog: false,
    data: {},
    loading: false,
    statusReq: false,
  });
  const [modalApproved, setModalApproved] = useState({
    statusDialog: false,
    data: {},
    loading: false,
    statusReq: false,
  });
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

  const [dataDeliverables, setDataDeliverables] = useState([]);


  const handleAction = (type, data) => {
    if (type === "rejected") {
      setModalReject({ ...modalReject, statusDialog: true, data: data });
    } else if (type === "accept") {
      setModalApproved({ ...modalApproved, statusDialog: true, data: data });
    }
    console.log("handleAction type: ", type, " - ", "data: ", data);
  };

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

  const getInvoiceData = useCallback(() => {
    getInvoice(contract_id, termin)
      .then((response) => {
        setInvoiceData(response["data"]["data"]);
      })
      .catch((error) => {
        setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 10000);
      });
  }, [contract_id, termin, intl, setToast]);

  const callApiContractSoftCopy = () => {
    setLoading(true);
    getListDocSoftCopy(contract_id, termin)
      .then((result) => {
        setLoading(false);
        setDataDocSoftCopy(result.data.data);
      })
      .catch((err) => {
        setLoading(false);
        setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 5000);
      });
  }

  const handleSubmit = () => {
    setLoading(true);
    const data = {
      contract_id: contract_id,
      term_id: termin,
      vendor_id: invoiceData.vendor_id,
      sub_total: invoiceData.invoice_value,
      created_by_id: user_id,
      updated_by_id: user_id,
    };
    if (invoiceBkbExist) {
      // updateContractAuthority(data)
      //   .then((response) => {
      //     setToast(intl.formatMessage({ id: "REQ.UPDATE_SUCCESS" }), 10000);
      //     setLoading(false);
      //   })
      //   .catch((error) => {
      //     setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 10000);
      //     setLoading(false);
      //   });
    } else {
      createBkb(data)
        .then((response) => {
          setToast(intl.formatMessage({ id: "REQ.UPDATE_SUCCESS" }), 10000);
          setLoading(false);
          setInvoiceBkbExist(true);
        })
        .catch((error) => {
          setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 10000);
          setLoading(false);
        });
    }
  };

  const getFileContract = (name, status, ident_name) => {
    console.log(name, status);
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

  const handleApproved = () => {
    setModalApproved({ ...modalApproved, loading: true });
    var data = {
      hardcopy_approved_by_id: user_id,
    };
    approveHardCopy(
      modalApproved.data.document_monitoring_id,
      data
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
  };

  const handleRejected = () => {
    setModalReject({ ...modalReject, loading: true });
    var note = document.getElementById("commentRejected").value;
    var data_1 = {
      contract_id: contract_id,
      term_id: termin,
      created_by_id: user_id,
    };
    var data_2 = {
      document_monitoring_id: "",
      contract_id: contract_id,
      term_id: termin,
      document_id: modalReject.data.document_id,
      document_no: modalReject.data.doc_no,
      created_at: window.moment(new Date()).format("YYYY-MM-DD"),
      created_by_id: user_id,
      rejected_by_id: user_id,
      rejected_remark: note,
      filename: modalReject.data.doc_file,
    };
  };

  useEffect(getInvoiceData, []);
  useEffect(callApiContractSoftCopy, []);

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
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleRejected();
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
                          {item.hardcopy_approved_at
                            ? window
                              .moment(new Date(item.hardcopy_approved_at))
                              .format("DD MMM YYYY")
                            : ""}
                        </TableCell>
                        <TableCell>
                          {(item.hardcopy_state === "PENDING" ||
                            item.hardcopy_state === null) &&
                            item.doc_file
                            ? "WAITING TO APPROVE"
                            : item.hardcopy_state === "REJECTED"
                              ? "REJECTED"
                              : item.hardcopy_state === "APPROVED"
                                ? "APPROVED"
                                : "WAITING"}
                        </TableCell>
                        <TableCell>
                          {item.hardcopy_state === "APPROVED"
                            ? item.hardcopy_approved_by
                            : null}
                        </TableCell>
                        <TableCell>
                          {dataUser?.is_finance &&
                            (item.hardcopy_state === null ||
                              item.hardcopy_state === "PENDING") &&
                            item.doc_no &&
                            item.doc_file && (
                              <ButtonAction
                                data={item}
                                handleAction={handleAction}
                                ops={data_ops}
                              />
                            )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableOnly>
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
          <button
            type="button"
            className="btn btn-sm btn-primary mx-1"
            onClick={handleSubmit}
          >
            Send Notif
          </button>
          <button type="button" className="btn btn-sm btn-primary mx-1">
            Print Kelengkapan Dokumen
          </button>
        </CardFooter>
      </Card>
    </React.Fragment>
  );
}
export default injectIntl(connect(null, null)(ContractHardCopyDoc));
