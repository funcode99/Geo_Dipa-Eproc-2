import React, { 
    // useState, 
    // useEffect 
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
  CardFooter
} from "../../../../../_metronic/_partials/controls";


function ItemContractInvoice(props) {
    return (
        <React.Fragment>
            <Card>
                <CardBody>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group row">
                                <label htmlFor="numberInvoice" className="col-sm-4 col-form-label">Number Invoice</label>
                                <div className="col-sm-8">
                                <input type="text" readOnly className="form-control" id="numberInvoice" defaultValue="10000014264" />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="dateInvoice" className="col-sm-4 col-form-label">Tanggal Invoice</label>
                                <div className="col-sm-8">
                                <input type="date" readOnly className="form-control" id="dateInvoice" />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="priceContract" className="col-sm-4 col-form-label">Harga Pekerjaan</label>
                                <div className="col-sm-8">
                                <input type="text" className="form-control" id="priceContract" defaultValue="Rp. 1.000.000" disabled />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="poNumber" className="col-sm-4 col-form-label">Nomor PO</label>
                                <div className="col-sm-8">
                                <input type="text" className="form-control" id="poNumber" defaultValue="PO 123" disabled />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="priceStep1" className="col-sm-4 col-form-label">Harga Pekerjaan Tahap 1</label>
                                <div className="col-sm-8">
                                <input type="text" className="form-control" id="priceStep1" defaultValue="Rp. 1.000.000" disabled />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="note" className="col-sm-4 col-form-label">Keterangan</label>
                                <div className="col-sm-8">
                                <textarea rows="4" cols="" readOnly className="form-control" id="note"></textarea>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="upload" className="col-sm-4 col-form-label">Upload Invoice</label>
                                <label htmlFor="upload" className="input-group mb-3 col-sm-8 pointer">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text"><i className="fas fa-file-upload"></i></span>
                                    </div>
                                    <span className="form-control">Pilih File</span>
                                </label>
                                <input type="file" className="d-none" id="upload" />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group row">
                                <label htmlFor="first" className="col-sm-4 col-form-label">Pihak Pertama</label>
                                <div className="col-sm-8">
                                <textarea rows="4" cols="" readOnly className="form-control" id="first"></textarea>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="second" className="col-sm-4 col-form-label">Pihak Kedua</label>
                                <div className="col-sm-8">
                                <textarea rows="4" cols="" readOnly className="form-control" id="second"></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardBody>
                <CardFooter className="text-right">
                    <button type="button" className="btn btn-primary mx-1">Terima</button>
                    <button type="button" className="btn btn-danger mx-1">Tolak</button>
                </CardFooter>
            </Card>
        </React.Fragment>
    )
}
export default injectIntl(connect(null, null)(ItemContractInvoice));