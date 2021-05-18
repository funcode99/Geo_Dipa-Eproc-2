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

function ItemContractFormVerification(props) {

    useEffect(() => {
        
    });

    const print = () => {
        var printContents = document.getElementById("printFormVerifikaction").innerHTML;
        document.getElementById("root").style.display = "none";
        document.getElementById("print-content").innerHTML = printContents;
        window.print();
        document.getElementById("root").removeAttribute("style");
        document.getElementById("print-content").innerHTML = "";
    };

    return (
        <React.Fragment>
            <Card>
                <CardHeader title="">
                    <CardHeaderToolbar>
                        <button type="button" onClick={print} className="btn btn-sm btn-primary"><i className="fas fa-print"></i>Cetak From Verifikasi</button>
                    </CardHeaderToolbar>
                </CardHeader>
                <CardBody id="printFormVerifikaction">
                    <div>
                        <div className="row">
                            <div className="col-md-12">
                                <h6 className="text-uppercase text-center">Kelengkapan Invoice</h6>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-4 d-flex align-items-center">
                                <img src={toAbsoluteUrl("/media/logos/logo-eprocurement.png")} style={{width: 300}} alt="IconGde" />
                            </div>
                            <div className="col-md-8">
                                <div className="form-group row mb-1">
                                    <label className="col-sm-4 col-form-label">Nama Vendor</label>
                                    <div className="col-sm-8">
                                    <input type="text" className="form-control" defaultValue="PT. Ecolab International Indonesia" readOnly />
                                    </div>
                                </div>
                                <div className="form-group row mb-1">
                                    <label className="col-sm-4 col-form-label">Pekerjaan</label>
                                    <div className="col-sm-8">
                                    <textarea readOnly className="form-control" defaultValue="Jasa Pengolahan Sistem Air Pendingin Cooling Tower PLTP Patuha Unit 1 Periode April 2020"></textarea>
                                    </div>
                                </div>
                                <div className="form-group row mb-1">
                                    <label className="col-sm-4 col-form-label">Nilai Pekerjaan</label>
                                    <div className="col-sm-8">
                                    <input type="text" className="form-control" defaultValue="171.666.000" readOnly />
                                    </div>
                                </div>
                                <div className="form-group row mb-1">
                                    <label className="col-sm-4 col-form-label">Tanggal Masuk</label>
                                    <div className="col-sm-8">
                                    <input type="text" className="form-control" defaultValue="25 Maret 2020" readOnly />
                                    </div>
                                </div>
                                <div className="form-group row mb-1">
                                    <label className="col-sm-4 col-form-label">Jatuh Tempo Pembayaran</label>
                                    <div className="col-sm-8">
                                    <input type="text" className="form-control" defaultValue="25 Maret 2020 - 30 Maret 2020" readOnly />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-3">
                            <div className="row">
                                <div className="col-md-4">
                                    <h6 className="font-weight-bold">Lampiran Dokumen Pembayaran</h6>
                                </div>
                                <div className="col-md-3">
                                    <h6 className="font-weight-bold">Tanggal Dokumen</h6>
                                </div>
                                <div className="col-md-5">
                                    <h6 className="font-weight-bold">Keterangan</h6>
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-md-4">
                                    <input className="form-check-input" type="checkbox" checked={true} />
                                    <span className="ml-2">Surat Permohonan Pembayaran</span>
                                </div>
                                <div className="col-md-3 border-bottom">
                                    <span>12 Januari 2020</span>
                                </div>
                                <div className="col-md-5 border-bottom">
                                    <span>Test</span>
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-md-4">
                                    <input className="form-check-input" type="checkbox" checked={false} />
                                    <span className="ml-2">Kwitansi Rangkap 4</span>
                                </div>
                                <div className="col-md-3 border-bottom">
                                    <span></span>
                                </div>
                                <div className="col-md-5 border-bottom">
                                    <span></span>
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-md-4">
                                    <input className="form-check-input" type="checkbox" checked={true} />
                                    <span className="ml-2">Invoice Rangkap 4</span>
                                </div>
                                <div className="col-md-3 border-bottom">
                                    <span>12 Januari 2020</span>
                                </div>
                                <div className="col-md-5 border-bottom">
                                    <span>Test</span>
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-md-4">
                                    <input className="form-check-input" type="checkbox" checked={true} />
                                    <span className="ml-2">Faktur Pajak 3 Lembar</span>
                                </div>
                                <div className="col-md-3 border-bottom">
                                    <span>12 Januari 2020</span>
                                </div>
                                <div className="col-md-5 border-bottom">
                                    <span>Test</span>
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-md-4">
                                    <input className="form-check-input" type="checkbox" checked={true} />
                                    <span className="ml-2">Copy NPWP</span>
                                </div>
                                <div className="col-md-3 border-bottom">
                                    <span></span>
                                </div>
                                <div className="col-md-5 border-bottom">
                                    <span></span>
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-md-4">
                                    <input className="form-check-input" type="checkbox" checked={false} />
                                    <span className="ml-2">Purchase Order (PO)</span>
                                </div>
                                <div className="col-md-3 border-bottom">
                                    <span></span>
                                </div>
                                <div className="col-md-5 border-bottom">
                                    <span></span>
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-md-4">
                                    <input className="form-check-input" type="checkbox" checked={false} />
                                    <span className="ml-2">Surat Perjanjian (Kontrak) bermaterai</span>
                                </div>
                                <div className="col-md-3 border-bottom">
                                    <span></span>
                                </div>
                                <div className="col-md-5 border-bottom">
                                    <span></span>
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-md-4">
                                    <input className="form-check-input" type="checkbox" checked={false} />
                                    <span className="ml-2">Berita Acara Pelaksanaan Pekerjaan</span>
                                </div>
                                <div className="col-md-3 border-bottom">
                                    <span></span>
                                </div>
                                <div className="col-md-5 border-bottom">
                                    <span></span>
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-md-4">
                                    <input className="form-check-input" type="checkbox" checked={false} />
                                    <span className="ml-2">Berita Acara Pemeriksaan Mutu</span>
                                </div>
                                <div className="col-md-3 border-bottom">
                                    <span></span>
                                </div>
                                <div className="col-md-5 border-bottom">
                                    <span></span>
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-md-4">
                                    <input className="form-check-input" type="checkbox" checked={false}/>
                                    <span className="ml-2">Berita Acara Serah Terima Pekerjaan</span>
                                </div>
                                <div className="col-md-3 border-bottom">
                                    <span></span>
                                </div>
                                <div className="col-md-5 border-bottom">
                                    <span></span>
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-md-4">
                                    <input className="form-check-input" type="checkbox" checked={false} />
                                    <span className="ml-2"><del>Good Receipt</del></span>
                                    <span>/</span>
                                    <span>Service Acceptance</span>
                                </div>
                                <div className="col-md-3 border-bottom">
                                    <span></span>
                                </div>
                                <div className="col-md-5 border-bottom">
                                    <span></span>
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-md-4">
                                    <input className="form-check-input" type="checkbox" checked={false} />
                                    <span className="ml-2">Surat Garansi Barang</span>
                                </div>
                                <div className="col-md-3 border-bottom">
                                    <span></span>
                                </div>
                                <div className="col-md-5 border-bottom">
                                    <span></span>
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-md-4">
                                    <input className="form-check-input" type="checkbox" checked={false} />
                                    <span className="ml-2">COO/COM</span>
                                </div>
                                <div className="col-md-3 border-bottom">
                                    <span></span>
                                </div>
                                <div className="col-md-5 border-bottom">
                                    <span></span>
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-md-4">
                                    <input className="form-check-input" type="checkbox" checked={true} />
                                    <span className="ml-2">Lainnya</span>
                                </div>
                                <div className="col-md-3 border-bottom">
                                    <span></span>
                                </div>
                                <div className="col-md-5 border-bottom">
                                    <span></span>
                                </div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-md-4 border-bottom">
                                    <span>1. Test</span>
                                </div>
                                <div className="col-md-3 border-bottom">
                                    <span>12 Desember 2020</span>
                                </div>
                                <div className="col-md-5 border-bottom">
                                    <span>Test</span>
                                </div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-md-4 border-bottom">
                                    <span>2.</span>
                                </div>
                                <div className="col-md-3 border-bottom">
                                    <span></span>
                                </div>
                                <div className="col-md-5 border-bottom">
                                    <span></span>
                                </div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-md-4 border-bottom">
                                    <span>3.</span>
                                </div>
                                <div className="col-md-3 border-bottom">
                                    <span></span>
                                </div>
                                <div className="col-md-5 border-bottom">
                                    <span></span>
                                </div>
                            </div>
                        </div>
                        <div className="row mt-4">
                            <div className="col-md-12">
                                <span className="font-italic">*Proses pembayaran dihitung sejak dokumen penagihan diterima dengan lengkap</span>
                            </div>
                        </div>
                        <div className="row mt-5">
                            <div className="col-md-6">
                                <span>Disertakan Oleh</span>
                                <div className="w-50 border-bottom" style={{minHeight: 80 }}>
                                    
                                </div>
                            </div>
                            <div className="col-md-6">
                                <span>DIterima Oleh</span>
                                <div className="w-50 border-bottom" style={{minHeight: 80 }}>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </React.Fragment>
    );
}
export default injectIntl(connect(null, null)(ItemContractFormVerification));