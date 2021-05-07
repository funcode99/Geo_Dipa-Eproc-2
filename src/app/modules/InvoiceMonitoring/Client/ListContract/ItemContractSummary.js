import React, { 
    useState, 
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
  CardFooter
} from "../../../../../_metronic/_partials/controls";
import { Table, 
    // Form, 
    // Col, 
    // Row, 
    // Pagination 
} from "react-bootstrap";
import Select2 from 'react-select2-wrapper';
import 'react-select2-wrapper/css/select2.css';

function ItemContractSummary(props) {
    const [data] = useState(
        [
            {name: "BAPP", status: 'Approved', approvedBy: 'Dian', date: '30 Jan 2021', nameDoc: 'BAPP.pdf'},
            {name: "User Manual", status: 'Approved', approvedBy: 'Dian', date: '30 Jan 2021', nameDoc: 'BAPP.pdf'},
            {name: "Timesheet", status: 'Waiting', approvedBy: null, date: null, nameDoc: null},
            {name: "Invoice", status: 'Waiting', approvedBy: null, date: null, nameDoc: null},
            {name: "Faktur Pajak", status: 'Waiting', approvedBy: null, date: null, nameDoc: null},
            {name: "Surat Permohonan Pajak", status: 'Waiting', approvedBy: null, date: null, nameDoc: null},
            {name: "Kuitansi", status: 'Waiting', approvedBy: null, date: null, nameDoc: null}
        ]
    );

    useEffect(() => {
        window.$('#kt_daterangepicker_1').daterangepicker({
            buttonClasses: ' btn',
            applyClass: 'btn-primary',
            cancelClass: 'btn-secondary',
            opens: 'right',
            locale: {
                format: 'DD MMM YYYY'
            },
            startDate: new Date(),
            endDate: new Date()
           });
        window.$('#kt_select2_3').select2({
            placeholder: "Pilih PIC",
        })
    });
    return (
        <React.Fragment>
            <Card>
                <CardBody>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group row">
                                <label htmlFor="numberContract" className="col-sm-4 col-form-label">Number Contract</label>
                                <div className="col-sm-8">
                                <input type="text" className="form-control" id="numberContract" defaultValue="10000014264" disabled />
                                </div>
                            </div>
                            
                            <div className="form-group row">
                                <label className="col-form-label col-sm-4">Jangka Waktu</label>
                                <div className="col-sm-8">
                                <input type='text' className="form-control" id="kt_daterangepicker_1" disabled placeholder="Pilih Tanggal" />
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
                                <label htmlFor="authorizedOffice" className="col-sm-4 col-form-label">Pejabat Berwenang</label>
                                <div className="col-sm-8">
                                <input type="text" className="form-control" id="authorizedOffice" defaultValue="Dirum" disabled />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="jobDirectors" className="col-sm-4 col-form-label">Direksi Pekerjaan</label>
                                <div className="col-sm-8">
                                <input type="text" className="form-control" id="jobDirectors" defaultValue="Dian - Manager General Affairs" disabled />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="progress" className="col-sm-4 col-form-label">Progress Pekerjaan</label>
                                <div className="col-sm-8">
                                <input type="text" className="form-control" id="progress" defaultValue="100%" disabled />
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group row">
                                <label htmlFor="first" className="col-sm-4 col-form-label">Pihak Pertama</label>
                                <div className="col-sm-8">
                                <textarea rows="4" cols="" className="form-control" id="first" disabled ></textarea>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="second" className="col-sm-4 col-form-label">Pihak Kedua</label>
                                <div className="col-sm-8">
                                <textarea rows="4" cols="" className="form-control" id="second" disabled ></textarea>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="pic" className="col-sm-4 col-form-label">Email PIC</label>
                                <div className="input-group col-sm-8">
                                    <Select2
                                    multiple
                                    defaultValue={[1, 2]}
                                    data={[
                                        { text: 'jeffryar@gmail.com', id: 1 },
                                        { text: 'azhariar@gmail.com', id: 2 },
                                        { text: 'udin@gmail.com', id: 3 },
                                        { text: 'adin@gmail.com', id: 4 },
                                    ]}
                                    options={{
                                        placeholder: 'search by tags',
                                    }}
                                    className="form-control"
                                    />
                                    <div className="input-group-prepend">
                                        <span className="input-group-text pointer"><i className="fas fa-pencil-alt"></i></span>
                                    </div>
                                </div>
                                <div className="col-sm-8">
                                </div>
                            </div>
                        </div>
                    </div>
                </CardBody>
                <CardFooter className="text-right">
                    <button type="button" className="btn btn-primary mx-1">Simpan</button>
                </CardFooter>
            </Card>
            <Card className="mt-5">
                <CardBody>
                    <div className="my-5 text-center">
                        <h6>Dokumen Tagihan (Didapat dari Delivery Monitoring yang Mandatori)</h6>
                    </div>
                    <div className="table-wrapper-scroll-y my-custom-scrollbar">
                        <div className="segment-table">
                            <div className="hecto-10">
                                <Table className="table-bordered overflow-auto">
                                    <thead>
                                        <tr>
                                            <th className="bg-primary text-white align-middle">No</th>
                                            <th className="bg-primary text-white align-middle">Dokumen</th>
                                            <th className="bg-primary text-white align-middle">Status</th>
                                            <th className="bg-primary text-white align-middle">Approve by</th>
                                            <th className="bg-primary text-white align-middle">Tanggal Upload</th>
                                            <th className="bg-primary text-white align-middle">Dokumen</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            data.map((item, index) => {
                                                return(
                                                    <tr key={index.toString()}>
                                                        <td className="align-middle text-center">{index + 1}</td>
                                                        <td>
                                                            {item.name}
                                                        </td>
                                                        <td>
                                                            {item.status}
                                                        </td>
                                                        <td className="align-middle text-center">{item.approvedBy}</td>
                                                        <td className="align-middle">
                                                        {item.date}
                                                        </td>
                                                        <td className="align-middle">{item.nameDoc}</td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </React.Fragment>
    );
}
export default injectIntl(connect(null, null)(ItemContractSummary));