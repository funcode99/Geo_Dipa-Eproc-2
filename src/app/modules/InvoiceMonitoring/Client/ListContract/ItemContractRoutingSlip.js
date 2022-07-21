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
import { getRoutingSlip } from "../../_redux/InvoiceMonitoringCrud";
import useToast from "../../../../components/toast";
import { rupiah } from "../../../../libs/currency";
import {
  dateNullable,
  dateToHourNullable,
  getDuration,
} from "../../../../service/helper/dateHelper";

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
  };

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
                  <div className="col-sm-3">
                    <span>Nama Supplier</span>
                  </div>
                  <div className="col-sm-9">
                    <span>{slipData?.[`vendor.party.full_name`]}</span>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-3">
                    <span>No. Invoice</span>
                  </div>
                  <div className="col-sm-9">
                    <span>{slipData?.invoice_no}</span>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-3">
                    <span>Tanggal Invoice</span>
                  </div>
                  <div className="col-sm-9">
                    <span>
                      {slipData?.invoice_date
                        ? window
                            .moment(new Date(slipData?.invoice_date))
                            .format("DD MMM YYYY")
                        : ""}
                    </span>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-3">
                    <span>Jangka Waktu Pembayaran</span>
                  </div>
                  <div className="col-sm-9">
                    <span>{getDuration(slipData?.selisih_paid_to_tax)}</span>
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
                    <td className="td-16 text-center">Dokument Status</td>
                    <td className="td-18 text-center">User/Pejabat Keuangan</td>
                    <td className="td-11 text-center">Tanggal Masuk</td>
                    <td className="td-6 text-center">Jam Masuk</td>
                    <td className="td-11 text-center">Tanggal Keluar</td>
                    <td className="td-6 text-center">Jam Keluar</td>
                    {/*<td className="td-10 text-center">Durasi</td>*/}
                    <td className="td-21 text-center">Keterangan</td>
                  </tr>
                </thead>
                <tbody>
                  {slipData?.final_output?.map((el, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>{el?.document_status}</td>
                      <td>{el?.pejabat_keuangan}</td>
                      <td className="text-center">
                        {dateNullable(el?.tanggal_masuk)}
                      </td>
                      <td className="text-center">
                        {dateToHourNullable(el?.tanggal_masuk)}
                      </td>
                      <td className="text-center">
                        {dateNullable(el?.tanggal_keluar)}
                      </td>
                      <td className="text-center">
                        {dateToHourNullable(el?.tanggal_keluar)}
                      </td>
                      <td>{el?.keterangan}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* <div className="row border">
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
                    <span>{rupiah(slipData?.bkb?.sub_total).slice(3)}</span>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-sm-6 border-right">
                    <span>2. Potongan</span>
                  </div>
                  <div className="col-sm-6">
                    <span>171.666.000</span>
                  </div>
                </div>
                {slipData?.tax?.tax_selected?.map((item, index) => {
                  const data = JSON.parse(item?.value)
                  return (
                    <div className="row mt-3" key={index}>
                      <div className="col-sm-6 border-right">
                        <span className="pl-3">{data.description} - {data.value}%</span>
                      </div>
                      <div className="col-sm-6">
                        <span>({rupiah(data.tax_value).slice(3)})</span>
                      </div>
                    </div>
                  )
                })}
                <div className="row mt-3">
                  <div className="col-sm-6 border-right">
                    <span className="pl-3">Denda</span>
                  </div>
                  <div className="col-sm-6">({rupiah(slipData?.invoice?.penalty).slice(3)})</div>
                </div>
                <div className="row mt-3">
                  <div className="col-sm-6 border-right">
                    <span>3. Jumlah Dibayar</span>
                  </div>
                  <div className="col-sm-6">
                    <span>{rupiah(slipData?.bkb?.total_amount).slice(3)}</span>
                  </div>
                </div>
              </div>
              <div className="col-sm border-right text-left">
                <div className="row">
                  <div className="col-sm-6 border-right">
                    <span>Kode Anggaran</span>
                  </div>
                  <div className="col-sm-6"><span>Jumlah</span></div>
                </div>
              </div>
              <div className="col-sm text-left">
                <div className="row">
                  <div className="col-sm-6 border-right">
                    <span>Kode Akun</span>
                  </div>
                  <div className="col-sm-6"><span>Jumlah</span></div>
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
            </div> */}
          </div>
        </CardBody>
      </Card>
    </React.Fragment>
  );
}
export default injectIntl(connect(null, null)(ItemContractRoutingSlip));
