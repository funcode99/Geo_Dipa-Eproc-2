import React, {
  // useState,
  useEffect,
} from "react";
import { connect } from "react-redux";
import {
  // FormattedMessage,
  injectIntl,
} from "react-intl";
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

function ItemContractBKB(props) {
  useEffect(() => {});

  const print = () => {
    var printContents = document.getElementById("printBkb").innerHTML;
    document.getElementById("root").style.display = "none";
    document.getElementById("print-content").classList.add("p-5");
    document.getElementById("print-content").innerHTML = printContents;
    window.print();
    document.getElementById("root").removeAttribute("style");
    document.getElementById("print-content").classList.remove("p-5");
    document.getElementById("print-content").innerHTML = "";
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
              <i className="fas fa-print"></i>Cetak BKB
            </button>
          </CardHeaderToolbar>
        </CardHeader>
        <CardBody id="printBkb">
          <div>
            <div className="row">
              <div className="col-md-8">
                <img
                  src={toAbsoluteUrl("/media/logos/logo-eprocurement.png")}
                  style={{ width: 150 }}
                  alt="IconGde"
                />
              </div>
              <div className="col-md-4">
                <div className="row">
                  <div className="col-md-6 border d-flex justify-content-between">
                    <span>No</span>
                    <span>:</span>
                  </div>
                  <div className="col-md-6 border text-center font-weight-bold">
                    <span>863</span>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 border d-flex justify-content-between">
                    <span>Tanggal</span>
                    <span>:</span>
                  </div>
                  <div className="col-md-6 border text-center font-weight-bold">
                    <span>20 Mei 2020</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-2 border text-center">
                <h2 className="mb-0" style={{ marginTop: 5 }}>
                  BKB
                </h2>
              </div>
              <div className="col-md-8 border text-center">
                <div>
                  <span className="font-weight-bold">PT GEO DIPA ENERGI</span>
                </div>
                <div>
                  <span className="font-weight-bold">
                    BUKTI PEMBAYARAN BANK
                  </span>
                </div>
              </div>
              <div className="col-md-2 border text-center">
                <h2 className="mb-0" style={{ marginTop: 5 }}>
                  PST
                </h2>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-md-2 border">
                <div className="row">
                  <div className="col d-flex justify-content-between">
                    <span className="font-weight-bold">Dibayar Kepada</span>
                    <span>:</span>
                  </div>
                </div>
                <div className="row">
                  <div className="col d-flex justify-content-between">
                    <span className="font-weight-bold">Alamat</span>
                    <span>:</span>
                  </div>
                </div>
                <div className="row">
                  <div className="col d-flex justify-content-between">
                    <span className="font-weight-bold">Untuk</span>
                    <span>:</span>
                  </div>
                </div>
              </div>
              <div className="col-md-10 border">
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
              <div className="col-md-2">
                <div className="row border">
                  <div className="col d-flex justify-content-between">
                    <span className="font-weight-bold">Kode Supplier</span>
                    <span>:</span>
                  </div>
                </div>
              </div>
              <div className="col-md-2">
                <div className="row border">
                  <div className="col">
                    <span className="font-weight-bold">1234567</span>
                  </div>
                </div>
              </div>
              <div className="col-md-8 border">
                <div className="row">
                  <div className="col border-right">
                    <span className="font-weight-bold">Nama Bank</span>
                  </div>
                  <div className="col border-right">
                    <span className="font-weight-bold">Nomor Rekening</span>
                  </div>
                  <div className="col">
                    <span className="font-weight-bold">Refernsi</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-4" style={{ paddingTop: 10 }}>
                <span className="font-weight-bold">
                  Cara Pembayaran (Pilih metode dibawah ini)
                </span>
              </div>
              <div className="col-md-8">
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
              <div className="col-md-2 d-flex justify-content-between">
                <span className="font-weight-bold">Transfer</span>
                <div className="form-check">
                  <input
                    className="form-check-input pointer"
                    type="radio"
                    id="transfer"
                    name="pay"
                  />
                </div>
              </div>
              <div className="col-md-5 px-0">
                <label className="font-weight-bold pointer" htmlFor="transfer">
                  Instruksi Pemindahan Bukuan/Transfer Bank Nomor Surat
                </label>
              </div>
              <div className="col-md-5 form-group">
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
              <div className="col-md-2 d-flex justify-content-between">
                <span className="font-weight-bold">Cek/Giro</span>
                <div className="form-check">
                  <input
                    className="form-check-input pointer"
                    type="radio"
                    id="giro"
                    name="pay"
                  />
                </div>
              </div>
              <div className="col-md-4 form-group">
                <div className="row">
                  <label
                    className="font-weight-bold pointer col-sm-3 px-0"
                    htmlFor="giro"
                  >
                    No Cek
                  </label>
                  <div className="col-sm-9">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-6 form-group">
                <div className="row">
                  <label className="font-weight-bold col-sm-2">No Giro</label>
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
                    <td className="td-15 text-center">No. Invoice / PO</td>
                    <td className="td-15 text-center">Tanggal Invoice</td>
                    <td className="td-50 text-center">Keterangan</td>
                    <td className="td-20 text-center">Jumlah Invoice</td>
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
                      Kurang:
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
                      Denda / Lainnya
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
                      Jumlah bersih yang harus dibayar
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
              <div className="col-md border text-center">
                <span>Diarsipkan Oleh:</span>
              </div>
              <div className="col-md border text-center">
                <span>Finance:</span>
              </div>
              <div className="col-md border text-center">
                <span>Accounting:</span>
              </div>
            </div>
            <div className="row">
              <div
                className="col-md border d-flex align-items-end"
                style={{ height: 80 }}
              >
                <span className="mx-auto">Merry</span>
              </div>
              <div
                className="col-md border text-center"
                style={{ height: 80 }}
              ></div>
              <div
                className="col-md border text-center"
                style={{ height: 80 }}
              ></div>
            </div>
            <div className="row mt-3" style={{ minHeight: 300 }}>
              <div className="col-md-7 border">
                <div className="row border-bottom">
                  <div className="col-md-5 d-flex justify-content-between">
                    <span>No. Vendor</span>
                    <span>:</span>
                  </div>
                </div>
                <div className="row border-bottom">
                  <div className="col-md-5 d-flex justify-content-between">
                    <span>No. Dokumen Park AP</span>
                    <span>:</span>
                  </div>
                </div>
                <div className="row border-bottom">
                  <div className="col-md-5 d-flex justify-content-between">
                    <span>No. Dokumen Park BYR</span>
                    <span>:</span>
                  </div>
                </div>
              </div>
              <div className="col-md-5 border">
                <div className="row border-bottom">
                  <div className="col-md text-center">
                    <span>Keterangan / Catatan</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-md-7">
                <div className="row">
                  <div className="col-md-4 border">
                    <div className="row border">
                      <div className="col-md text-center">
                        <span>Penerima Cek/Giro</span>
                      </div>
                    </div>
                    <div
                      className="row d-flex align-items-end"
                      style={{ minHeight: 130 }}
                    >
                      <div>
                        <span style={{ fontSize: 8 }}>Nama: -</span>
                        <br />
                        <span style={{ fontSize: 8 }}>Tanggal:</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-8 border">
                    <div className="row border">
                      <div className="col-md text-center">
                        <span>Telah disetujui oleh</span>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md border text-center px-0">
                        <span style={{ fontSize: 10 }}>Tax &amp; Ass Man</span>
                      </div>
                      <div className="col-md border text-center px-0">
                        <span style={{ fontSize: 10 }}>Finance Manager</span>
                      </div>
                      <div className="col-md border text-center px-0">
                        <span style={{ fontSize: 10 }}>Direktur Keuangan</span>
                      </div>
                    </div>
                    <div className="row">
                      <div
                        className="col-md border-right"
                        style={{ minHeight: 83 }}
                      >
                        <div className="text-center" style={{ height: 71 }}>
                          <img
                            src={toAbsoluteUrl("/media/frame.png")}
                            alt="Qr"
                            style={{ width: 70 }}
                          />
                        </div>
                        <div className="d-flex align-items-end">
                          <div>
                            <span style={{ fontSize: 8 }}>Nama: Test00000</span>
                            <br />
                            <span style={{ fontSize: 8 }}>
                              Tanggal: 24-Mei-2021
                            </span>
                          </div>
                        </div>
                      </div>
                      <div
                        className="col-md border-right"
                        style={{ minHeight: 83 }}
                      >
                        <div className="text-center" style={{ height: 71 }}>
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
                            <span style={{ fontSize: 8 }}>Nama: -</span>
                            <br />
                            <span style={{ fontSize: 8 }}>Tanggal:</span>
                          </div>
                        </div>
                      </div>
                      <div
                        className="col-md border-right"
                        style={{ minHeight: 83 }}
                      >
                        <div className="text-center" style={{ height: 71 }}>
                          <img
                            src={toAbsoluteUrl("/media/approved.png")}
                            alt="IMG"
                            style={{ width: 80, marginTop: 10 }}
                          />
                        </div>
                        <div className="d-flex align-items-end">
                          <div>
                            <span style={{ fontSize: 8 }}>Nama: Test1234</span>
                            <br />
                            <span style={{ fontSize: 8 }}>
                              Tanggal: 24-Mei-2021
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-5 border">
                <div className="text-center">
                  <span>Penanda-tanganan Cek / Giro</span>
                </div>
                <div className="row border-top">
                  <div className="col-md border text-center px-0">
                    <span style={{ fontSize: 10 }}>Dirut</span>
                  </div>
                  <div className="col-md border text-center px-0">
                    <span style={{ fontSize: 10 }}>Dirkeu</span>
                  </div>
                  <div className="col-md border text-center px-0">
                    <span style={{ fontSize: 10 }}>Dir</span>
                  </div>
                  <div className="col-md border text-center px-0">
                    <span style={{ fontSize: 10 }}>Fin Mgr</span>
                  </div>
                </div>
                <div className="row">
                  <div
                    className="col-md border-right d-flex align-items-end"
                    style={{ minHeight: 111 }}
                  ></div>
                  <div
                    className="col-md border-right d-flex align-items-end"
                    style={{ minHeight: 111 }}
                  ></div>
                  <div
                    className="col-md border-right d-flex align-items-end"
                    style={{ minHeight: 111 }}
                  ></div>
                  <div
                    className="col-md d-flex align-items-end"
                    style={{ minHeight: 111 }}
                  ></div>
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
