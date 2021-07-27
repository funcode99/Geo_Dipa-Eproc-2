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
import {
  getRoutingSlip
} from "../../_redux/InvoiceMonitoringCrud";
import useToast from "../../../../components/toast";

// const Transition = React.forwardRef(function Transition(props, ref) {
//     return <Slide direction="up" ref={ref} {...props} />;
// });

function ItemContractRoutingSlip(props) {

  const { intl } = props;
  const contract_id = props.match.params.contract;
  const termin = props.match.params.termin;
  const [Toast, setToast] = useToast();

  const [loading, setLoading] = useState(false);
  const [slipData, setSlipData] = useState({});

  const print = () => {
    var printContents = window.$("#printRoutingSlip").html();
    window.$("#root").css("display", "none");
    window.$("#print-content").addClass("p-5");
    window.$("#print-content").html(printContents);
    window.print();
    window.$("#root").removeAttr("style");
    window.$("#print-content").removeClass("p-5");
    window.$("#print-content").html("");
  };

  const callApiRoutingSlip = () => {
    setLoading(true);
    getRoutingSlip(termin)
      .then((result) => {
        setLoading(false);
        setSlipData(result.data.data);
      })
      .catch((err) => {
        setLoading(false);
        setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 5000);
      });
  }

  useEffect(callApiRoutingSlip, []);

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
            >
              <i className="fas fa-print"></i>
              <FormattedMessage id="TITLE.PRINT" /> Routing Slip
            </button>
          </CardHeaderToolbar>
        </CardHeader>
        <CardBody id="printRoutingSlip">
          <div>
            <div className="row">
              <div className="col-sm-12">
                <div className="d-flex justify-content-center">
                  <div>
                    <img
                      src={toAbsoluteUrl("/media/logos/icon-gde.png")}
                      alt="IconGde"
                    />
                  </div>
                  <div className="text-center ml-5">
                    <h4 className="text-uppercase mt-4">PT Geo Dipa Energi</h4>
                    <h4 className="text-uppercase">Routing Slip</h4>
                  </div>
                </div>
              </div>
            </div>
            <div className="row mt-5">
              <div className="col-sm-12">
                <div className="row">
                  <div className="col-sm-2">
                    <span>Nama Supplier</span>
                  </div>
                  <div className="col-sm-10">
                    <span>{slipData?.vendor?.party?.full_name}</span>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-2">
                    <span>No. Invoice</span>
                  </div>
                  <div className="col-sm-10">
                    <span>{slipData?.invoice_no}</span>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-2">
                    <span>Tanggal Invoice</span>
                  </div>
                  <div className="col-sm-10">
                    <span>
                      {window
                        .moment(new Date(slipData?.invoice_date))
                        .format("DD MMM YYYY")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-5">
              <table
                className="table table-bordered"
                style={{ minHeight: 300 }}
              >
                <thead>
                  <tr>
                    <td className="td-1">No</td>
                    <td className="td-20 text-center">Pejabat Keuangan</td>
                    <td className="td-13 text-center">Tanggal Masuk</td>
                    <td className="td-7 text-center">Jam Masuk</td>
                    <td className="td-13 text-center">Tanggal Keluar</td>
                    <td className="td-7 text-center">Jam Keluar</td>
                    <td className="td-10 text-center">Paraf Penerima</td>
                    <td className="td-29 text-center">Keterangan</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>Merry</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td></td>
                    <td>SA / GR Terbit</td>
                  </tr>
                  {slipData?.support_deliverables_document_softcopy_date_out && <tr>
                    <td>2</td>
                    <td>{slipData?.support_deliverbables_creator?.party?.full_name}</td>
                    <td>-</td>
                    <td>-</td>
                    <td>
                      {slipData?.support_deliverables_document_softcopy_date_out ?
                        window
                          .moment(new Date(slipData?.support_deliverables_document_softcopy_date_out))
                          .format("DD MMM YYYY")
                        : '-'
                      }
                    </td>
                    <td>
                      {slipData?.support_deliverables_document_softcopy_date_out ?
                        window
                          .moment(new Date(slipData?.support_deliverables_document_softcopy_date_out))
                          .format("HH:mm")
                        : '-'
                      }
                    </td>
                    <td></td>
                    <td>Softcopy Dokumen Pendukung</td>
                  </tr>}
                  {slipData?.support_deliverables_document_softcopy_date_out && <tr>
                    <td>3</td>
                    <td>{slipData?.support_deliverbables_creator?.party?.full_name}</td>
                    <td>-</td>
                    <td>-</td>
                    <td>
                      {slipData?.support_deliverables_document_softcopy_date_out ?
                        window
                          .moment(new Date(slipData?.support_deliverables_document_softcopy_date_out))
                          .format("DD MMM YYYY")
                        : '-'
                      }
                    </td>
                    <td>
                      {slipData?.support_deliverables_document_softcopy_date_out ?
                        window
                          .moment(new Date(slipData?.support_deliverables_document_softcopy_date_out))
                          .format("HH:mm")
                        : '-'
                      }
                    </td>
                    <td></td>
                    <td>Softcopy Dokumen Deliverables</td>
                  </tr>}
                  {slipData?.billing_document_softcopy_date_in && <tr>
                    <td>4</td>
                    <td>{slipData?.billing_creator?.party?.full_name}</td>
                    <td>
                      {window
                        .moment(new Date(slipData?.billing_document_softcopy_date_in))
                        .format("DD MMM YYYY")}
                    </td>
                    <td>
                      {window
                        .moment(new Date(slipData?.billing_document_softcopy_date_in))
                        .format("HH:mm")}
                    </td>
                    <td>
                      {slipData?.billing_document_softcopy_date_out ?
                        window
                          .moment(new Date(slipData?.billing_document_softcopy_date_out))
                          .format("DD MMM YYYY")
                        : '-'
                      }
                    </td>
                    <td>
                      {slipData?.billing_document_softcopy_date_out ?
                        window
                          .moment(new Date(slipData?.billing_document_softcopy_date_out))
                          .format("HH:mm")
                        : '-'
                      }
                    </td>
                    <td></td>
                    <td>Softcopy Dokumen Tagihan</td>
                  </tr>}
                  {slipData?.hardcopy_date_in && <tr>
                    <td>5</td>
                    <td>{slipData?.hardcopy_creator?.party?.full_name}</td>
                    <td>
                      {window
                        .moment(new Date(slipData?.hardcopy_date_in))
                        .format("DD MMM YYYY")}
                    </td>
                    <td>
                      {window
                        .moment(new Date(slipData?.hardcopy_date_in))
                        .format("HH:mm")}
                    </td>
                    <td>
                      {slipData?.hardcopy_date_out ?
                        window
                          .moment(new Date(slipData?.hardcopy_date_out))
                          .format("DD MMM YYYY")
                        : '-'
                      }
                    </td>
                    <td>
                      {slipData?.hardcopy_date_out ?
                        window
                          .moment(new Date(slipData?.hardcopy_date_out))
                          .format("HH:mm")
                        : '-'
                      }
                    </td>
                    <td></td>
                    <td>Hardcopy Dokumen</td>
                  </tr>}
                  {slipData?.park_ap_date_in && <tr>
                    <td>6</td>
                    <td>{slipData?.park_ap_creator?.party?.full_name}</td>
                    <td>
                      {window
                        .moment(new Date(slipData?.park_ap_date_in))
                        .format("DD MMM YYYY")}
                    </td>
                    <td>
                      {window
                        .moment(new Date(slipData?.park_ap_date_in))
                        .format("HH:mm")}
                    </td>
                    <td>
                      {slipData?.park_ap_date_out ? window
                        .moment(new Date(slipData?.park_ap_date_out))
                        .format("DD MMM YYYY")
                      : '-'
                      }
                    </td>
                    <td>
                      {slipData?.park_ap_date_out ? window
                        .moment(new Date(slipData?.park_ap_date_out))
                        .format("HH:mm")
                      : '-'
                      }
                    </td>
                    <td></td>
                    <td>Park AP Dokumen</td>
                  </tr>}
                  {slipData?.park_byr_date_in && <tr>
                    <td>7</td>
                    <td>{slipData?.park_byr_creator?.party?.full_name}</td>
                    <td>
                      {window
                        .moment(new Date(slipData?.park_byr_date_in))
                        .format("DD MMM YYYY")}
                    </td>
                    <td>
                      {window
                        .moment(new Date(slipData?.park_byr_date_in))
                        .format("HH:mm")}
                    </td>
                    <td>
                      {slipData?.park_byr_date_out ? window
                        .moment(new Date(slipData?.park_byr_date_out))
                        .format("DD MMM YYYY")
                      : '-'
                      }
                    </td>
                    <td>
                      {slipData?.park_byr_date_out ? window
                        .moment(new Date(slipData?.park_byr_date_out))
                        .format("HH:mm")
                      : '-'
                      }
                    </td>
                    <td></td>
                    <td>Park BYR Dokumen</td>
                  </tr>}
                </tbody>
              </table>
            </div>
            <div className="row border">
              <div
                className="col-sm border-right text-center"
                style={{ backgroundColor: "whitesmoke" }}
              >
                <span style={{ fontSize: 10 }}>Diisi Oleh</span>
                <div>Finance</div>
              </div>
              <div
                className="col-sm border-right text-center"
                style={{ backgroundColor: "whitesmoke" }}
              >
                <span style={{ fontSize: 10 }}>Diisi Oleh</span>
                <div>Budget</div>
              </div>
              <div
                className="col-sm text-center"
                style={{ backgroundColor: "whitesmoke" }}
              >
                <span style={{ fontSize: 10 }}>Diisi Oleh</span>
                <div>Accounting</div>
              </div>
            </div>
            <div className="row border">
              <div className="col-sm border-right text-center">
                <div className="row">
                  <div className="col-sm-6 border-right">
                    <span>Uraian</span>
                  </div>
                  <div className="col-sm-6">
                    <span>Jumlah</span>
                  </div>
                </div>
              </div>
              <div className="col-sm border-right text-center">
                <div className="row">
                  <div className="col-sm-6 border-right">
                    <span>Kode Anggaran</span>
                  </div>
                  <div className="col-sm-6">
                    <span>Jumlah</span>
                  </div>
                </div>
              </div>
              <div className="col-sm text-center">
                <div className="row">
                  <div className="col-sm-6 border-right">
                    <span>Kode Akun</span>
                  </div>
                  <div className="col-sm-6">
                    <span>Jumlah</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="row border">
              <div className="col-sm border-right text-left">
                <div className="row mt-3">
                  <div className="col-sm-6 border-right">
                    <span>1. Tagihan</span>
                  </div>
                  <div className="col-sm-6">
                    <span>171.666.000</span>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-sm-6 border-right">
                    <span className="pl-3">PPN (10%)</span>
                  </div>
                  <div className="col-sm-6">
                    <span>(15.606.000)</span>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-sm-6 border-right">
                    <span>2. Potongan</span>
                  </div>
                  <div className="col-sm-6">
                    {/* <span>171.666.000</span> */}
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-sm-6 border-right">
                    <span className="pl-3">PPh 23 (2%)</span>
                  </div>
                  <div className="col-sm-6">
                    <span>(3.121.200)</span>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-sm-6 border-right">
                    <span className="pl-3">PPh 22 (1.5%)</span>
                  </div>
                  <div className="col-sm-6">
                    <span>-</span>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-sm-6 border-right">
                    <span className="pl-3">Denda</span>
                  </div>
                  <div className="col-sm-6">{/* <span>-</span> */}</div>
                </div>
                <div className="row mt-3">
                  <div className="col-sm-6 border-right">
                    <span className="pl-5">Saldo</span>
                  </div>
                  <div className="col-sm-6">
                    <span>-</span>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-sm-6 border-right">
                    <span>3. Jumlah Dibayar</span>
                  </div>
                  <div className="col-sm-6">
                    <span>152.938.800</span>
                  </div>
                </div>
              </div>
              <div className="col-sm border-right text-left">
                <div className="row">
                  <div className="col-sm-6 border-right">
                    {/* <span>Kode Anggaran</span> */}
                  </div>
                  <div className="col-sm-6">{/* <span>Jumlah</span> */}</div>
                </div>
              </div>
              <div className="col-sm text-left">
                <div className="row">
                  <div className="col-sm-6 border-right">
                    {/* <span>Kode Akun</span> */}
                  </div>
                  <div className="col-sm-6">{/* <span>Jumlah</span> */}</div>
                </div>
              </div>
            </div>
            <div className="row border">
              <div className="col-sm border-right text-center">
                <div className="row">
                  <div className="col-sm-6 border-right">
                    <span>Tanggal Masuk</span>
                  </div>
                  <div className="col-sm-6">
                    <span>Tanggal Keluar</span>
                  </div>
                </div>
              </div>
              <div className="col-sm border-right text-center">
                <div className="row">
                  <div className="col-sm-6 border-right">
                    <span>Tanggal Masuk</span>
                  </div>
                  <div className="col-sm-6">
                    <span>Tanggal Keluar</span>
                  </div>
                </div>
              </div>
              <div className="col-sm text-center">
                <div className="row">
                  <div className="col-sm-6 border-right">
                    <span>Tanggal Masuk</span>
                  </div>
                  <div className="col-sm-6">
                    <span>Tanggal Keluar</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="row border">
              <div className="col-sm border-right text-center">
                <div className="row">
                  <div className="col-sm-6 border-right">
                    <span>20 Mei 2020</span>
                  </div>
                  <div className="col-sm-6">
                    <span>20 Mei 2020</span>
                  </div>
                </div>
              </div>
              <div className="col-sm border-right text-center">
                <div className="row">
                  <div className="col-sm-6 border-right">
                    <span></span>
                  </div>
                  <div className="col-sm-6">
                    <span></span>
                  </div>
                </div>
              </div>
              <div className="col-sm text-center">
                <div className="row">
                  <div className="col-sm-6 border-right">
                    <span></span>
                  </div>
                  <div className="col-sm-6">
                    <span></span>
                  </div>
                </div>
              </div>
            </div>
            <div className="row border">
              <div className="col-sm border-right text-center">
                <span>Tanda Tangan &#38; Nama</span>
              </div>
              <div className="col-sm border-right text-center">
                <span>Tanda Tangan &#38; Nama</span>
              </div>
              <div className="col-sm text-center">
                <span>Tanda Tangan &#38; Nama</span>
              </div>
            </div>
            <div className="row border">
              <div
                className="col-sm border-right d-flex align-items-end"
                style={{ height: 80 }}
              >
                <span className="mx-auto">Merry</span>
              </div>
              <div
                className="col-sm border-right d-flex align-items-end"
                style={{ height: 80 }}
              >
                <span></span>
              </div>
              <div
                className="col-sm border-right d-flex align-items-end"
                style={{ height: 80 }}
              >
                <span></span>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </React.Fragment>
  );
}
export default injectIntl(connect(null, null)(ItemContractRoutingSlip));
