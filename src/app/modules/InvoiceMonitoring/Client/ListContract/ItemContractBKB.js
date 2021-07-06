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
  tax_manager_approve_bkb,
  finance_manager_approve_bkb,
  finance_director_approve_bkb,
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
} from "@material-ui/core";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function ItemContractBKB(props) {
  const [styleCustom] = React.useState({
    heightAppvDiv: 145,
    minHeightAppv: 80,
  });

  const { intl } = props;
  const termin = props.match.params.termin;
  const [Toast, setToast] = useToast();

  const [bkbData, setBkbData] = useState(null);

  const data_login = useSelector((state) => state.auth.user.data, shallowEqual);
  const monitoring_role = data_login.monitoring_role
    ? data_login.monitoring_role
    : [];
  const [monitoringTax] = useState(
    monitoring_role.findIndex(
      (element) => element === "Treasury Assistant Manager"
    ) >= 0
  );
  const [monitoringFinance] = useState(
    monitoring_role.findIndex((element) => element === "Finance Manager") >= 0
  );
  const [monitoringFinanceDirec] = useState(
    monitoring_role.findIndex((element) => element === "Direktur Keuangan") >= 0
  );
  const [modalApproved, setModalApproved] = useState({
    statusDialog: false,
    data: {},
    loading: false,
    statusReq: false,
  });

  const getBkbData = useCallback(() => {
    getBkb(termin)
      .then((response) => {
        if (response["data"]["data"]) {
          response["data"]["data"]["vendor_address"] = `${
            response["data"]["data"]["vendor_data"]["address"]["postal_address"]
              ? response["data"]["data"]["vendor_data"]["address"][
                  "postal_address"
                ]
              : null
          } ${
            response["data"]["data"]["vendor_data"]["address"]["sub_district"]
              ? response["data"]["data"]["vendor_data"]["address"][
                  "sub_district"
                ]["name"]
              : null
          } ${
            response["data"]["data"]["vendor_data"]["address"]["district"]
              ? response["data"]["data"]["vendor_data"]["address"]["district"][
                  "name"
                ]
              : null
          } ${
            response["data"]["data"]["vendor_data"]["address"]["province"]
              ? response["data"]["data"]["vendor_data"]["address"]["province"][
                  "name"
                ]
              : null
          } ${
            response["data"]["data"]["vendor_data"]["address"]["postal_code"]
              ? response["data"]["data"]["vendor_data"]["address"][
                  "postal_code"
                ]
              : null
          }`;
          setBkbData(response["data"]["data"]);
        }
      })
      .catch((error) => {
        setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 10000);
      });
  }, [termin, intl, setToast]);

  useEffect(getBkbData, []);

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
    if (modalApproved.data === "monitoringTax") {
      tax_manager_approve_bkb(bkbData.id, data_login.user_id)
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
    } else if (modalApproved.data === "monitoringFinance") {
      finance_manager_approve_bkb(bkbData.id, data_login.user_id)
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
    } else if (modalApproved.data === "monitoringFinanceDirec") {
      finance_director_approve_bkb(bkbData.id, data_login.user_id)
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
    }
  };

  return (
    <React.Fragment>
      <Toast />
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
                    <span>863</span>
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
                            .moment(new Date(bkbData?.created_at))
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
                  <FormattedMessage id="TITLE.TRANSFER" />
                </span>
                <div className="form-check">
                  <input
                    className="form-check-input pointer"
                    type="checkbox"
                    id="transfer"
                    name="pay"
                  />
                </div>
              </div>
              <div className="col-sm-5 px-0">
                <label className="font-weight-bold pointer" htmlFor="transfer">
                  <FormattedMessage id="TITLE.TRANSFER.INSTRUCTION" />
                </label>
              </div>
              <div className="col-sm-5 form-group">
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
                <div className="form-check">
                  <input
                    className="form-check-input pointer"
                    type="checkbox"
                    id="giro"
                    name="pay"
                  />
                </div>
              </div>
              <div className="col-sm-10 form-group">
                <div className="row">
                  <label
                    className="font-weight-bold pointer col-sm-1 px-0"
                    htmlFor="giro"
                  >
                    <FormattedMessage id="TITLE.NO" />
                  </label>
                  <div className="col-sm-11">
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
                      PPN(10%)
                    </td>
                    <td>
                      <div className="d-flex justify-content-between">
                        <span>{bkbData?.symbol}</span>
                        <span>
                          {bkbData ? rupiah(bkbData?.tax_ppn_10).slice(3) : "-"}
                        </span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="text-right">
                      <FormattedMessage id="TITLE.LESS" />:
                    </td>
                    <td></td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="text-right">
                      PPh23 (2%)
                    </td>
                    <td>
                      <div className="d-flex justify-content-between">
                        <span>{bkbData?.symbol}</span>
                        <span>-</span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="text-right">
                      PPh22 (1.5%)
                    </td>
                    <td>
                      <div className="d-flex justify-content-between">
                        <span>{bkbData?.symbol}</span>
                        <span>-</span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="text-right">
                      <FormattedMessage id="TITLE.FINE_OR_OTHER" />
                    </td>
                    <td>
                      <div className="d-flex justify-content-between">
                        <span>{bkbData?.symbol}</span>
                        <span>-</span>
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
                className="col-sm border d-flex align-items-end"
                style={{ height: 80 }}
              >
                <span className="mx-auto">Merry</span>
              </div>
              <div
                className="col-sm border text-center"
                style={{ height: 80 }}
              ></div>
              <div
                className="col-sm border text-center"
                style={{ height: 80 }}
              ></div>
            </div>
            <div className="row mt-3" style={{ minHeight: 300 }}>
              <div className="col-sm-7 border">
                <div className="row border-bottom">
                  <div className="col-sm-5 d-flex justify-content-between">
                    <span>
                      <FormattedMessage id="TITLE.NO_VENDOR" />
                    </span>
                    <span>:</span>
                  </div>
                </div>
                <div className="row border-bottom">
                  <div className="col-sm-5 d-flex justify-content-between">
                    <span>
                      <FormattedMessage id="TITLE.NO_DOCUMENT" /> Park AP
                    </span>
                    <span>:</span>
                  </div>
                </div>
                <div className="row border-bottom">
                  <div className="col-sm-5 d-flex justify-content-between">
                    <span>
                      <FormattedMessage id="TITLE.NO_DOCUMENT" /> Park BYR
                    </span>
                    <span>:</span>
                  </div>
                </div>
              </div>
              <div className="col-sm-5 border">
                <div className="row border-bottom">
                  <div className="col-sm text-center">
                    <span>
                      <FormattedMessage id="TITLE.INFORMATION_OR_NOTE" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-sm-7">
                <div className="row">
                  <div className="col-sm-4 border">
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
                  </div>
                  <div className="col-sm-8 border">
                    <div className="row border">
                      <div className="col-sm text-center">
                        <span>
                          <FormattedMessage id="TITLE.APPROVED_BY" />
                        </span>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm border text-center px-0">
                        <span style={{ fontSize: 10 }}>Tax &amp; Ass Man</span>
                      </div>
                      <div className="col-sm border text-center px-0">
                        <span style={{ fontSize: 10 }}>Finance Manager</span>
                      </div>
                      <div className="col-sm border text-center px-0">
                        <span style={{ fontSize: 10 }}>Direktur Keuangan</span>
                      </div>
                    </div>
                    <div className="row">
                      <div
                        className="col-sm border-right"
                        style={{ height: styleCustom.heightAppvDiv }}
                      >
                        <div
                          className="text-center"
                          style={{
                            height: styleCustom.minHeightAppv,
                            paddingTop: 5,
                            paddingBottom: 5,
                          }}
                        >
                          {monitoringTax &&
                            bkbData?.tax_man_approved_id === null && (
                              <button
                                type="button"
                                className="btn btn-primary btn-sm"
                                style={{ fontSize: 10, marginTop: 20 }}
                                onClick={() => {
                                  setModalApproved({
                                    ...modalApproved,
                                    statusDialog: true,
                                    data: "monitoringTax",
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
                          {bkbData?.tax_man_approved_id && (
                            <QRCodeG
                              value={`${window.location.origin}/qrcode?term_id=${termin}&role_id=${bkbData?.tax_man_role_id}`}
                            />
                          )}
                        </div>
                        <div className="d-flex align-items-end">
                          <div>
                            <span style={{ fontSize: 8 }}>
                              <FormattedMessage id="TITLE.NAME" />:
                              {bkbData?.tax_man_name}
                            </span>
                            <br />
                            <span style={{ fontSize: 8 }}>
                              <FormattedMessage id="TITLE.DATE" />:
                              {bkbData?.tax_man_approved_at
                                ? window
                                    .moment(
                                      new Date(bkbData?.tax_man_approved_at)
                                    )
                                    .format("DD/MM/YYYY")
                                : ""}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div
                        className="col-sm border-right"
                        style={{ height: styleCustom.heightAppvDiv }}
                      >
                        <div
                          className="text-center"
                          style={{
                            height: styleCustom.minHeightAppv,
                            paddingTop: 5,
                            paddingBottom: 5,
                          }}
                        >
                          {monitoringFinance &&
                            bkbData?.finance_man_approved_id === null && (
                              <button
                                type="button"
                                className="btn btn-primary btn-sm"
                                style={{ fontSize: 10, marginTop: 20 }}
                                onClick={() => {
                                  setModalApproved({
                                    ...modalApproved,
                                    statusDialog: true,
                                    data: "monitoringFinance",
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
                          {bkbData?.finance_man_approved_id && (
                            <QRCodeG
                              value={`${window.location.origin}/qrcode?term_id=${termin}&role_id=${bkbData?.finance_man_role_id}`}
                            />
                          )}
                        </div>
                        <div className="d-flex align-items-end">
                          <div>
                            <span style={{ fontSize: 8 }}>
                              <FormattedMessage id="TITLE.NAME" />:
                              {bkbData?.finance_man_name}
                            </span>
                            <br />
                            <span style={{ fontSize: 8 }}>
                              <FormattedMessage id="TITLE.DATE" />:
                              {bkbData?.finance_man_approved_at
                                ? window
                                    .moment(
                                      new Date(bkbData?.finance_man_approved_at)
                                    )
                                    .format("DD/MM/YYYY")
                                : ""}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div
                        className="col-sm border-right"
                        style={{ height: styleCustom.heightAppvDiv }}
                      >
                        <div
                          className="text-center"
                          style={{
                            height: styleCustom.minHeightAppv,
                            paddingTop: 5,
                            paddingBottom: 5,
                          }}
                        >
                          {monitoringFinanceDirec &&
                            bkbData?.finance_director_approved_id === null && (
                              <button
                                type="button"
                                className="btn btn-primary btn-sm"
                                style={{ fontSize: 10, marginTop: 20 }}
                                onClick={() => {
                                  setModalApproved({
                                    ...modalApproved,
                                    statusDialog: true,
                                    data: "monitoringFinanceDirec",
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
                          {bkbData?.finance_director_approved_id && (
                            <QRCodeG
                              value={`${window.location.origin}/qrcode?term_id=${termin}&role_id=${bkbData?.finance_director_role_id}`}
                            />
                          )}
                        </div>
                        <div className="d-flex align-items-end">
                          <div>
                            <span style={{ fontSize: 8 }}>
                              <FormattedMessage id="TITLE.NAME" />:
                              {bkbData?.finance_director_name}
                            </span>
                            <br />
                            <span style={{ fontSize: 8 }}>
                              <FormattedMessage id="TITLE.DATE" />:
                              {bkbData?.finance_director_approved_at
                                ? window
                                    .moment(
                                      new Date(
                                        bkbData?.finance_director_approved_at
                                      )
                                    )
                                    .format("DD/MM/YYYY")
                                : ""}
                            </span>
                          </div>
                        </div>
                      </div>
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
                  <div className="col-sm border text-center px-0">
                    <span style={{ fontSize: 10 }}>Dirut</span>
                  </div>
                  <div className="col-sm border text-center px-0">
                    <span style={{ fontSize: 10 }}>Dirkeu</span>
                  </div>
                  <div className="col-sm border text-center px-0">
                    <span style={{ fontSize: 10 }}>Dir</span>
                  </div>
                  <div className="col-sm border text-center px-0">
                    <span style={{ fontSize: 10 }}>Fin Mgr</span>
                  </div>
                </div>
                <div className="row">
                  <div
                    className="col-sm border-right"
                    style={{ height: styleCustom.heightAppvDiv }}
                  >
                    <div
                      className="text-center"
                      style={{
                        height: styleCustom.minHeightAppv,
                        paddingTop: 5,
                        paddingBottom: 5,
                      }}
                    >
                      {/* <QRCodeG
                        value="http://192.168.0.168:3000/qrcode"
                        size="60"
                      /> */}
                    </div>
                    <div className="d-flex align-items-end">
                      <div>
                        <span style={{ fontSize: 8 }}>
                          <FormattedMessage id="TITLE.NAME" />: Test1234
                        </span>
                        <br />
                        <span style={{ fontSize: 8 }}>
                          <FormattedMessage id="TITLE.DATE" />: 24/04/2021
                        </span>
                      </div>
                    </div>
                  </div>
                  <div
                    className="col-sm border-right"
                    style={{ height: styleCustom.heightAppvDiv }}
                  >
                    <div
                      className="text-center"
                      style={{
                        height: styleCustom.minHeightAppv,
                        paddingTop: 5,
                        paddingBottom: 5,
                      }}
                    >
                      {/* <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            style={{ fontSize: 10, marginTop: 20 }}
                          >
                            <i
                              className="fas fa-check-circle"
                              style={{ fontSize: 10 }}
                            ></i>
                            Setuju
                          </button> */}
                    </div>
                    <div className="d-flex align-items-end">
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
                  </div>
                  <div
                    className="col-sm border-right"
                    style={{ height: styleCustom.heightAppvDiv }}
                  >
                    <div
                      className="text-center"
                      style={{
                        height: styleCustom.minHeightAppv,
                        paddingTop: 5,
                        paddingBottom: 5,
                      }}
                    >
                      {/* <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        style={{ fontSize: 10, marginTop: 20 }}
                      >
                        <i
                          className="fas fa-check-circle"
                          style={{ fontSize: 8 }}
                        ></i>
                        <FormattedMessage id="TITLE.APPROVE" />
                      </button> */}
                    </div>
                    <div className="d-flex align-items-end">
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
                  </div>
                  <div
                    className="col-sm"
                    style={{ height: styleCustom.heightAppvDiv }}
                  >
                    <div
                      className="text-center"
                      style={{
                        height: styleCustom.minHeightAppv,
                        paddingTop: 5,
                        paddingBottom: 5,
                      }}
                    >
                      {/* <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            style={{ fontSize: 10, marginTop: 20 }}
                          >
                            <i
                              className="fas fa-check-circle"
                              style={{ fontSize: 10 }}
                            ></i>
                            Setuju
                          </button> */}
                    </div>
                    <div className="d-flex align-items-end">
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
                  </div>
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
