import React, { 
    // useState, 
    useEffect 
} from 'react';
import {
    connect 
} from "react-redux";
import { 
    // FormattedMessage, 
    injectIntl 
} from "react-intl";
import {
  Card,
  CardBody,
//   CardFooter,
  CardHeader,
  CardHeaderToolbar
} from "../../../../../_metronic/_partials/controls";
import { 
    // Table, 
    // Form, 
    // Col, 
    // Row, 
    // Pagination 
} from "react-bootstrap";
import {
    // Dialog,
    // DialogActions,
    // DialogContent,
    // DialogTitle,
    // Slide
} from '@material-ui/core';
import {toAbsoluteUrl} from "../../../../../_metronic/_helpers";

// const Transition = React.forwardRef(function Transition(props, ref) {
//     return <Slide direction="up" ref={ref} {...props} />;
// });

function ItemContractRoutingSlip(props) {

    useEffect(() => {
        
    });

    const print = () => {
        var printContents = document.getElementById("printRoutingSlip").innerHTML;
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
                    <button type="button" onClick={print} className="btn btn-sm btn-primary"><i className="fas fa-print"></i>Cetak Routing Slip</button>
                    </CardHeaderToolbar>
                </CardHeader>
                <CardBody id="printRoutingSlip">
                <div>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="d-flex justify-content-center">
                                <div>
                                    <img src={toAbsoluteUrl("/media/logos/icon-gde.png")} alt="IconGde" />
                                </div>
                                <div className="text-center ml-5">
                                    <h4 className="text-uppercase mt-4">PT Geo Dipa Energi</h4>
                                    <h4 className="text-uppercase">Routing Slip</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row mt-5">
                        <div className="col-md-12">
                            <div className="row">
                                <div className="col-md-2">
                                    <span>Nama Supplier</span>
                                </div>
                                <div className="col-md-10">
                                    <span>PT. Ecolab International Indonesia</span>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-2">
                                    <span>No. Invoice</span>
                                </div>
                                <div className="col-md-10">
                                    <span>249714 / 8000005793</span>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-2">
                                    <span>Tanggal Invoice</span>
                                </div>
                                <div className="col-md-10">
                                    <span>12 Maret 2021</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-5">
                        <table className="table table-bordered" style={{minHeight: 300}}>
                            <thead>
                                <tr>
                                    <td className="td-1">No</td>
                                    <td className="td-18 text-center">Pejabat Keuangan</td>
                                    <td className="td-18 text-center">Tanggal Masuk</td>
                                    <td className="td-10 text-center">Jam Masuk</td>
                                    <td className="td-23 text-center">Paraf Penerima</td>
                                    <td className="td-30 text-center">Keterangan</td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>Merry</td>
                                    <td>20 Maret 2020</td>
                                    <td>13.30</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="row border">
                        <div className="col-md border-right text-center" style={{backgroundColor: 'whitesmoke'}}>
                            <span style={{fontSize: 10}}>Diisi Oleh</span>
                            <div>Finance</div>
                        </div>
                        <div className="col-md border-right text-center" style={{backgroundColor: 'whitesmoke'}}>
                            <span style={{fontSize: 10}}>Diisi Oleh</span>
                            <div>Budget</div>
                        </div>
                        <div className="col-md text-center" style={{backgroundColor: 'whitesmoke'}}>
                            <span style={{fontSize: 10}}>Diisi Oleh</span>
                            <div>Accounting</div>
                        </div>
                    </div>
                    <div className="row border">
                        <div className="col-md border-right text-center">
                            <div className="row">
                                <div className="col-md-6 border-right">
                                    <span>Uraian</span>
                                </div>
                                <div className="col-md-6">
                                    <span>Jumlah</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-md border-right text-center">
                            <div className="row">
                                <div className="col-md-6 border-right">
                                    <span>Kode Anggaran</span>
                                </div>
                                <div className="col-md-6">
                                    <span>Jumlah</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-md text-center">
                            <div className="row">
                                <div className="col-md-6 border-right">
                                    <span>Kode Akun</span>
                                </div>
                                <div className="col-md-6">
                                    <span>Jumlah</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row border">
                        <div className="col-md border-right text-left">
                            <div className="row mt-3">
                                <div className="col-md-6 border-right">
                                    <span>1. Tagihan</span>
                                </div>
                                <div className="col-md-6">
                                    <span>171.666.000</span>
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-md-6 border-right">
                                    <span className="pl-3">PPN (10%)</span>
                                </div>
                                <div className="col-md-6">
                                    <span>(15.606.000)</span>
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-md-6 border-right">
                                    <span>2. Potongan</span>
                                </div>
                                <div className="col-md-6">
                                    {/* <span>171.666.000</span> */}
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-md-6 border-right">
                                    <span className="pl-3">PPh 23 (2%)</span>
                                </div>
                                <div className="col-md-6">
                                    <span>(3.121.200)</span>
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-md-6 border-right">
                                    <span className="pl-3">PPh 22 (1.5%)</span>
                                </div>
                                <div className="col-md-6">
                                    <span>-</span>
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-md-6 border-right">
                                    <span className="pl-3">Denda</span>
                                </div>
                                <div className="col-md-6">
                                    {/* <span>-</span> */}
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-md-6 border-right">
                                    <span className="pl-5">Saldo</span>
                                </div>
                                <div className="col-md-6">
                                    <span>-</span>
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-md-6 border-right">
                                    <span>3. Jumlah Dibayar</span>
                                </div>
                                <div className="col-md-6">
                                    <span>152.938.800</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-md border-right text-left">
                            <div className="row">
                                <div className="col-md-6 border-right">
                                    {/* <span>Kode Anggaran</span> */}
                                </div>
                                <div className="col-md-6">
                                    {/* <span>Jumlah</span> */}
                                </div>
                            </div>
                        </div>
                        <div className="col-md text-left">
                            <div className="row">
                                <div className="col-md-6 border-right">
                                    {/* <span>Kode Akun</span> */}
                                </div>
                                <div className="col-md-6">
                                    {/* <span>Jumlah</span> */}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row border">
                        <div className="col-md border-right text-center">
                            <div className="row">
                                <div className="col-md-6 border-right">
                                    <span>Tanggal Masuk</span>
                                </div>
                                <div className="col-md-6">
                                    <span>Tanggal Keluar</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-md border-right text-center">
                            <div className="row">
                                <div className="col-md-6 border-right">
                                    <span>Tanggal Masuk</span>
                                </div>
                                <div className="col-md-6">
                                    <span>Tanggal Keluar</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-md text-center">
                            <div className="row">
                                <div className="col-md-6 border-right">
                                    <span>Tanggal Masuk</span>
                                </div>
                                <div className="col-md-6">
                                    <span>Tanggal Keluar</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row border">
                        <div className="col-md border-right text-center">
                            <div className="row">
                                <div className="col-md-6 border-right">
                                    <span>20 Mei 2020</span>
                                </div>
                                <div className="col-md-6">
                                    <span>20 Mei 2020</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-md border-right text-center">
                            <div className="row">
                                <div className="col-md-6 border-right">
                                    <span></span>
                                </div>
                                <div className="col-md-6">
                                    <span></span>
                                </div>
                            </div>
                        </div>
                        <div className="col-md text-center">
                            <div className="row">
                                <div className="col-md-6 border-right">
                                    <span></span>
                                </div>
                                <div className="col-md-6">
                                    <span></span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row border">
                        <div className="col-md border-right text-center">
                            <span>Tanda Tangan &#38; Nama</span>
                        </div>
                        <div className="col-md border-right text-center">
                            <span>Tanda Tangan &#38; Nama</span>
                        </div>
                        <div className="col-md text-center">
                            <span>Tanda Tangan &#38; Nama</span>
                        </div>
                    </div>
                    <div className="row border">
                        <div className="col-md border-right d-flex align-items-end" style={{height: 80}}>
                            <span className="mx-auto">Merry</span>
                        </div>
                        <div className="col-md border-right d-flex align-items-end" style={{height: 80}}>
                            <span></span>
                        </div>
                        <div className="col-md border-right d-flex align-items-end" style={{height: 80}}>
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