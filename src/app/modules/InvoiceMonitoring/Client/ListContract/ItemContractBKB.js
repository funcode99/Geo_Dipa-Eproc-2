import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
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

function ItemContractBKB(props) {
  const [styleCustom] = React.useState({
    heightAppvDiv: 145,
    minHeightAppv: 80,
  });
  useEffect(() => {});

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

  return (
    <React.Fragment>
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
                    <span>20 Mei 2020</span>
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
                  PST
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
                      PT. Ecolab International Indonesia
                    </span>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <span>
                      Jl. Pahlawan, Desa Karang Asem Timur, Citeureup, Bogor
                      16810
                    </span>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <span>
                      Jasa Pengolahan Sistem Air Pendingin Cooling Tower PLTP
                      Patuha Unit 1 Periode April 2020
                    </span>
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
                    <span className="font-weight-bold">1234567</span>
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
                    <span className="">Bank Citibank</span>
                  </div>
                  <div className="col border">
                    <span className="">0-105234-015 (Rp)</span>
                  </div>
                  <div className="col border">
                    <span className="">PT. Ecolab International Indonesia</span>
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
                    type="radio"
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
                    type="radio"
                    id="giro"
                    name="pay"
                  />
                </div>
              </div>
              <div className="col-sm-4 form-group">
                <div className="row">
                  <label
                    className="font-weight-bold pointer col-sm-3 px-0"
                    htmlFor="giro"
                  >
                    <FormattedMessage id="TITLE.CEK_NUMBER" />
                  </label>
                  <div className="col-sm-9">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                    />
                  </div>
                </div>
              </div>
              <div className="col-sm-6 form-group">
                <div className="row">
                  <label className="font-weight-bold col-sm-2">
                    <FormattedMessage id="TITLE.GIRO_NUMBER" />
                  </label>
                  <div className="col-sm-10">
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
                  <tr>
                    <td>249714 / 8000005793</td>
                    <td className="text-center">12 Mei 2020</td>
                    <td className="text-justify">
                      Jasa Pengolahan Sistem Air Pendingin Cooling Tower PLTP
                      Patuha Unit 1 Periode April 2020
                    </td>
                    <td>
                      <div className="d-flex justify-content-between">
                        <span>Rp</span>
                        <span>171.666.000</span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="text-right">
                      PPN(10%)
                    </td>
                    <td>
                      <div className="d-flex justify-content-between">
                        <span>Rp</span>
                        <span>(15.606.000)</span>
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
                        <span>Rp</span>
                        <span>(3.121.200)</span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="text-right">
                      PPh22 (1.5%)
                    </td>
                    <td>
                      <div className="d-flex justify-content-between">
                        <span>Rp</span>
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
                        <span>Rp</span>
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
                        <span>Rp</span>
                        <span>152.938.800</span>
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
                  <FormattedMessage id="TITLE.FINANCE" />:
                </span>
              </div>
              <div className="col-sm border text-center">
                <span>
                  <FormattedMessage id="TITLE.ACCOUNTING" />:
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
                          <QRCodeG value="http://192.168.0.168:3000/qrcode" />
                        </div>
                        <div className="d-flex align-items-end">
                          <div>
                            <span style={{ fontSize: 8 }}>
                              <FormattedMessage id="TITLE.NAME" />: Test00000
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
                          <QRCodeG value="http://192.168.0.168:3000/qrcode" />
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
                      <QRCodeG
                        value="http://192.168.0.168:3000/qrcode"
                        size="60"
                      />
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
