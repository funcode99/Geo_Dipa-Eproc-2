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
import // Table,
// Form,
// Col,
// Row,
// Pagination
"react-bootstrap";
import // Dialog,
// DialogActions,
// DialogContent,
// DialogTitle,
// Slide
"@material-ui/core";
import { toAbsoluteUrl } from "../../../../../_metronic/_helpers";
import useToast from "../../../../components/toast";
import { rupiah } from "../../../../libs/currency";
import {
  getListDocSoftCopy,
  getDeliverableInInvoive,
  getHardcopyBillingDocument,
  getContractSummary,
} from "../../_redux/InvoiceMonitoringCrud";
import { formatDate, toNewDate } from "../../../../libs/date";

// const Transition = React.forwardRef(function Transition(props, ref) {
//     return <Slide direction="up" ref={ref} {...props} />;
// });

function ItemContractFormVerification(props) {
  const { intl } = props;
  const [contractData, setContractData] = useState({});
  const [dataDocHardCopy, setDataDocHardCopy] = useState([]);
  const [dataBillingHardCopy, setDataBillingHardCopy] = useState([]);
  const [dataDeliverables, setDataDeliverables] = useState([]);
  const [billingHardCopy, setBillingHardCopy] = useState(true);
  const [deliverableHardCopy, setDeliverableHardCopy] = useState(true);
  const [contractHardCopy, setContractHardCopy] = useState(true);
  const [Toast, setToast] = useToast();

  const contract_id = props.match.params.contract;
  const termin = props.match.params.termin;
  const dataUser = useSelector((state) => state.auth.user.data);

  const callApi = () => {
    getDeliverableInInvoive(termin)
      .then((result) => {
        setDataDeliverables(result.data.data.task_documents);
        setDeliverableHardCopy(false);
      })
      .catch((error) => {
        setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 5000);
      });

    getContractSummary(contract_id, termin)
      .then((result) => {
        setContractData(result.data.data);
      })
      .catch((error) => {
        setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 5000);
      });
  };

  const callApiContractSoftCopy = () => {
    getListDocSoftCopy(contract_id, termin, "HARDCOPY")
      .then((result) => {
        setDataDocHardCopy(result.data.data);
        setContractHardCopy(false);
      })
      .catch((err) => {
        setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 5000);
      });
  };

  const callApiBillingHardCopy = () => {
    getHardcopyBillingDocument(termin)
      .then((result) => {
        setDataBillingHardCopy(result.data.data);
        setBillingHardCopy(false);
      })
      .catch((err) => {
        setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 5000);
      });
  };

  useEffect(callApi, []);
  useEffect(callApiContractSoftCopy, []);
  useEffect(callApiBillingHardCopy, []);

  const print = () => {
    var printContents = window.$("#printFormVerifikaction").html();
    window.$("#root").css("display", "none");
    window.$("#print-content").addClass("p-5");
    window.$("#print-content").html(printContents);
    window.print();
    window.$("#root").removeAttr("style");
    window.$("#print-content").removeClass("p-5");
    window.$("#print-content").html("");
  };

  console.log("contractData", contractData);

  return (
    <React.Fragment>
      <Toast />
      <Card>
        <CardHeader title="">
          <CardHeaderToolbar>
            <button
              type="button"
              onClick={print}
              className="btn btn-sm btn-primary"
              disabled={
                billingHardCopy || deliverableHardCopy || contractHardCopy
              }
            >
              {billingHardCopy || deliverableHardCopy || contractHardCopy ? (
                <i className="fas fa-spinner fa-pulse px-1"></i>
              ) : (
                <i className="fas fa-print"></i>
              )}
              <FormattedMessage id="TITLE.PRINT" /> form verifikasi
            </button>
          </CardHeaderToolbar>
        </CardHeader>
        <CardBody id="printFormVerifikaction">
          <div>
            <div className="row">
              <div className="col-sm-12">
                <h6 className="text-uppercase text-center">
                  <FormattedMessage id="TITLE.PAYMENT_RECEIPT" />
                </h6>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-4 d-flex align-items-center">
                <img
                  src={toAbsoluteUrl("/media/logos/logo-eprocurement.png")}
                  style={{ width: 300 }}
                  alt="IconGde"
                />
              </div>
              <div className="col-sm-8">
                <div className="form-group row mb-1">
                  <label className="col-sm-4 col-form-label">
                    <FormattedMessage id="TITLE.USER_MANAGEMENT.PIC_ROLES.VENDOR_NAME" />
                  </label>
                  <div className="col-sm-8">
                    <input
                      type="text"
                      className="form-control"
                      defaultValue={contractData?.full_name}
                      readOnly
                    />
                  </div>
                </div>
                <div className="form-group row mb-1">
                  <label className="col-sm-4 col-form-label">
                    <FormattedMessage id="CONTRACT_DETAIL.TABLE_HEAD.SCOPE_OF_WORK" />
                  </label>
                  <div className="col-sm-8">
                    <textarea
                      readOnly
                      className="form-control"
                      defaultValue={contractData?.termin_name}
                    ></textarea>
                  </div>
                </div>
                <div className="form-group row mb-1">
                  <label className="col-sm-4 col-form-label">
                    <FormattedMessage id="CONTRACT_DETAIL.TAB.PRICE" />
                  </label>
                  <div className="col-sm-8">
                    <input
                      type="text"
                      className="form-control"
                      value={rupiah(contractData?.termin_value)}
                      onChange={(e) => {}}
                      readOnly
                    />
                  </div>
                </div>
                <div className="form-group row mb-1">
                  <label className="col-sm-4 col-form-label">
                    <FormattedMessage id="TITLE.VERIFICATION_SOFTCOPY_DATE" />
                  </label>
                  <div className="col-sm-8">
                    <input
                      type="text"
                      className="form-control"
                      defaultValue={
                        contractData?.sofcopy_date
                          ? window
                              .moment(new Date(contractData?.sofcopy_date))
                              .format("DD/MM/YYYY")
                          : ""
                      }
                      readOnly
                    />
                  </div>
                </div>
                <div className="form-group row mb-1">
                  <label className="col-sm-4 col-form-label">
                    <FormattedMessage id="TITLE.VERIFICATION_AND_TAX_DATE" />
                  </label>
                  <div className="col-sm-8">
                    <input
                      type="text"
                      className="form-control"
                      defaultValue={
                        contractData?.approved_at_tax
                          ? window
                              .moment(new Date(contractData?.approved_at_tax))
                              .format("DD/MM/YYYY")
                          : ""
                      }
                      readOnly
                    />
                  </div>
                </div>
                <div className="form-group row mb-1">
                  <label className="col-sm-4 col-form-label">
                    <FormattedMessage id="TITLE.VERIFICATION_HARDCOPY_DATE" />
                  </label>
                  <div className="col-sm-8">
                    <input
                      type="text"
                      className="form-control"
                      defaultValue={
                        contractData?.hardcopy_date_out
                          ? window
                              .moment(new Date(contractData?.hardcopy_date_out))
                              .format("DD/MM/YYYY")
                          : ""
                      }
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-3">
              <div className="row">
                <div className="col-sm-4">
                  <h6 className="font-weight-bold">
                    <FormattedMessage id="TITLE.ATTACHMENT_DOC" />
                  </h6>
                </div>
                <div className="col-sm-3">
                  <h6 className="font-weight-bold">
                    <FormattedMessage id="LABEL.DOCUMENT_DATE" />
                  </h6>
                </div>
                <div className="col-sm-5">
                  <h6 className="font-weight-bold">
                    <FormattedMessage id="TITLE.INFORMATION" />
                  </h6>
                </div>
              </div>
              {dataBillingHardCopy.map((item, index) => {
                return (
                  <div className="row mt-3" key={index.toString()}>
                    <div className="col-sm-4">
                      <label
                        className={
                          item.hardcopy_state === "APPROVED"
                            ? "checkboxs-true"
                            : item.hardcopy_state === "REJECTED"
                            ? "checkboxs-false"
                            : "checkboxs"
                        }
                      >
                        <input
                          type="checkbox"
                          checked={true}
                          onChange={(e) => {}}
                        />
                        <span></span>
                      </label>
                      <span className="ml-2">{item.document_name}</span>
                    </div>
                    <div className="col-sm-3 border-bottom">
                      <span>
                        {item.hardcopy_approved_at
                          ? window
                              .moment(new Date(item.hardcopy_approved_at))
                              .format("DD MMM YYYY")
                          : null}
                      </span>
                    </div>
                    <div className="col-sm-5 border-bottom">
                      <span>
                        {item.hardcopy_state === "REJECTED"
                          ? item.hardcopy_rejected_remark
                          : null}
                      </span>
                    </div>
                  </div>
                );
              })}
              {dataDocHardCopy.map((item, index) => {
                return (
                  <div className="row mt-3" key={index.toString()}>
                    <div className="col-sm-4">
                      <label
                        className={
                          item.hardcopy_state === "APPROVED"
                            ? "checkboxs-true"
                            : item.hardcopy_state === "REJECTED"
                            ? "checkboxs-false"
                            : "checkboxs"
                        }
                      >
                        <input
                          type="checkbox"
                          checked={true}
                          onChange={(e) => {}}
                        />
                        <span></span>
                      </label>
                      <span className="ml-2">{item.document_name}</span>
                    </div>
                    <div className="col-sm-3 border-bottom">
                      <span>
                        {item.hardcopy_approved_at
                          ? window
                              .moment(new Date(item.hardcopy_approved_at))
                              .format("DD MMM YYYY")
                          : null}
                      </span>
                    </div>
                    <div className="col-sm-5 border-bottom">
                      <span>
                        {item.hardcopy_state === "REJECTED"
                          ? item.hardcopy_rejected_remark
                          : null}
                      </span>
                    </div>
                  </div>
                );
              })}
              {dataDeliverables?.map((item, index) => {
                const isPeriodic = item.is_periodic;
                return isPeriodic
                  ? item?.periodes?.map((els, idx) => {
                      return (
                        <div key={idx.toString()}>
                          <div className="row mt-3">
                            <div className="col-sm-4">
                              <label className="checkboxs-minus">
                                <input
                                  type="checkbox"
                                  checked={true}
                                  onChange={(e) => {}}
                                />
                                <span></span>
                              </label>
                              <span className="ml-2">
                                {item.name + " - " + els.name}
                              </span>
                            </div>
                            <div className="col-sm-3 border-bottom">
                              <span></span>
                            </div>
                            <div className="col-sm-5 border-bottom">
                              <span></span>
                            </div>
                          </div>
                          {els.documents.map((el, id) => {
                            if (
                              el?.document_monitoring?.softcopy_state ===
                              "APPROVED"
                            ) {
                              return (
                                <div className="row mt-2" key={id.toString()}>
                                  <div className="col-sm-4">
                                    <label
                                      className={
                                        el?.document_monitoring
                                          ?.hardcopy_state === "APPROVED"
                                          ? "checkboxs-true"
                                          : el?.document_monitoring
                                              ?.hardcopy_state === "REJECTED"
                                          ? "checkboxs-false"
                                          : "checkboxs"
                                      }
                                    >
                                      <input
                                        type="checkbox"
                                        checked={true}
                                        onChange={(e) => {}}
                                      />
                                      <span></span>
                                    </label>
                                    <span>
                                      {el.document.name +
                                        " - " +
                                        window
                                          .moment(new Date(el.due_date))
                                          .format("DD MMM YYYY")}
                                    </span>
                                  </div>
                                  <div className="col-sm-3 border-bottom">
                                    <span>
                                      {el?.document_monitoring
                                        ?.hardcopy_approved_at
                                        ? window
                                            .moment(
                                              new Date(
                                                el?.document_monitoring?.hardcopy_approved_at
                                              )
                                            )
                                            .format("DD MMM YYYY")
                                        : null}
                                    </span>
                                  </div>
                                  <div className="col-sm-5 border-bottom">
                                    <span>
                                      {el?.document_monitoring
                                        ?.hardcopy_state === "REJECTED"
                                        ? el?.document_monitoring
                                            ?.hardcopy_history.length > 0 &&
                                          el?.document_monitoring
                                            ?.hardcopy_history[
                                            el?.document_monitoring
                                              ?.hardcopy_history.length - 1
                                          ].rejected_re
                                        : null}
                                    </span>
                                  </div>
                                </div>
                              );
                            }
                          })}
                        </div>
                      );
                    })
                  : item?.documents?.map((el, id) => {
                      if (
                        el?.document_monitoring?.softcopy_state === "APPROVED"
                      ) {
                        return (
                          <div className="row mt-3" key={id.toString()}>
                            <div className="col-sm-4">
                              <label
                                className={
                                  el.document_monitoring.hardcopy_state ===
                                  "APPROVED"
                                    ? "checkboxs-true"
                                    : el.document_monitoring.hardcopy_state ===
                                      "REJECTED"
                                    ? "checkboxs-false"
                                    : "checkboxs"
                                }
                              >
                                <input
                                  type="checkbox"
                                  checked={true}
                                  onChange={(e) => {}}
                                />
                                <span></span>
                              </label>
                              <span className="ml-2">{`${item?.name} : ${el.document.name}`}</span>
                            </div>
                            <div className="col-sm-3 border-bottom">
                              <span>
                                {el?.document_monitoring?.hardcopy_approved_at
                                  ? window
                                      .moment(
                                        new Date(
                                          el?.document_monitoring?.hardcopy_approved_at
                                        )
                                      )
                                      .format("DD MMM YYYY")
                                  : null}
                              </span>
                            </div>
                            <div className="col-sm-5 border-bottom">
                              <span>
                                {el?.document_monitoring?.hardcopy_state ===
                                "REJECTED"
                                  ? el?.document_monitoring?.hardcopy_history
                                      .length > 0 &&
                                    el?.document_monitoring?.hardcopy_history[
                                      el?.document_monitoring?.hardcopy_history
                                        .length - 1
                                    ].rejected_re
                                  : null}
                              </span>
                            </div>
                          </div>
                        );
                      }
                    });
              })}
            </div>
            <div className="row mt-4">
              <div className="col-sm-12">
                <span className="font-italic">
                  *Proses pembayaran dihitung sejak dokumen penagihan diterima
                  dengan lengkap
                </span>
              </div>
            </div>
            <div className="row mt-5">
              <div className="col-sm-6">
                <span>Disertakan Oleh</span>
                <div
                  className="w-50 border-bottom"
                  style={{ minHeight: 80 }}
                ></div>
              </div>
              <div className="col-sm-6">
                <span>DIterima Oleh</span>
                <div
                  className="w-50 border-bottom"
                  style={{ minHeight: 80 }}
                ></div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </React.Fragment>
  );
}
export default injectIntl(connect(null, null)(ItemContractFormVerification));
