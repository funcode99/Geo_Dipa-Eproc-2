import React, { useState, useEffect, useCallback } from "react";
import { connect } from "react-redux";
import { rupiah } from "../../../../libs/currency";
import {
  // FormattedMessage,
  injectIntl,
} from "react-intl";
import {
  Card,
  CardBody
} from "../../../../../_metronic/_partials/controls";
import {
  Table
} from "react-bootstrap";
import Select2 from "react-select2-wrapper";
import "react-select2-wrapper/css/select2.css";
import {
  getPicContract,
  getPicVendor,
  getContractSummary
} from "../../_redux/InvoiceMonitoringCrud";
import useToast from "../../../../components/toast";

function ItemContractSummary(props) {
  const { intl } = props;
  const [data] = useState([
    {
      name: "BAPP",
      status: "Approved",
      approvedBy: "Dian",
      date: "30 Jan 2021",
      nameDoc: "BAPP.pdf",
    },
    {
      name: "User Manual",
      status: "Approved",
      approvedBy: "Dian",
      date: "30 Jan 2021",
      nameDoc: "BAPP.pdf",
    },
    {
      name: "Timesheet",
      status: "Waiting",
      approvedBy: null,
      date: null,
      nameDoc: null,
    },
    {
      name: "Invoice",
      status: "Waiting",
      approvedBy: null,
      date: null,
      nameDoc: null,
    },
    {
      name: "Faktur Pajak",
      status: "Waiting",
      approvedBy: null,
      date: null,
      nameDoc: null,
    },
    {
      name: "Surat Permohonan Pajak",
      status: "Waiting",
      approvedBy: null,
      date: null,
      nameDoc: null,
    },
    {
      name: "Kuitansi",
      status: "Waiting",
      approvedBy: null,
      date: null,
      nameDoc: null,
    },
  ]);

  const [picContractData, setPicContractData] = useState([]);
  const [picVendorData, setPicVendorData] = useState([]);
  const [contractData, setContractData] = useState({});

  const [Toast, setToast] = useToast();
  const contract_id = props.match.params.contract;

  const getPicContractData = useCallback((vendor_id) => {
      getPicContract({ id: contract_id, vendor_id: vendor_id })
        .then((response) => {
          setPicContractData(response.data.data);
        })
        .catch((error) => {
          if (
            error.response?.status !== 400 &&
            error.response?.data.message !== "TokenExpiredError"
          )
            setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 10000);
        });
  }, [contract_id, intl, setToast]);

  const getPicVendorData = useCallback((vendor_id) => {
      getPicVendor(vendor_id)
        .then((response) => {
          setPicVendorData(response.data.data);
        })
        .catch((error) => {
          if (
            error.response?.status !== 400 &&
            error.response?.data.message !== "TokenExpiredError"
          )
            setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 10000);
        });
  }, [intl, setToast]);

  const getContractData = useCallback(() => {
    getContractSummary(contract_id)
      .then((response) => {
        response["data"]["data"]["contract_value"] = rupiah(
          response["data"]["data"]["contract_value"]
        );
        response["data"]["data"]["direksi"] = response["data"]["data"][
          "party_1_contract_signature_name"
        ].concat(" - ", response["data"]["data"]["party_1_director_position"]);
        response["data"]["data"]["full_name"] = response["data"]["data"][
          "data"
        ]["legal_org_type_sub"]["name"].concat(
          ". ",
          response["data"]["data"]["data"]["full_name"]
        );
        response["data"]["data"]["full_address_party_2"] = `${response["data"]["data"]["data"]["address"]["postal_address"]
            ? response["data"]["data"]["data"]["address"]["postal_address"]
            : null
          } ${response["data"]["data"]["data"]["address"]["sub_district"]
            ? response["data"]["data"]["data"]["address"]["sub_district"][
                "name"
              ]
            : null
          } ${response["data"]["data"]["data"]["address"]["district"]
            ? response["data"]["data"]["data"]["address"]["district"]["name"]
            : null
          } ${response["data"]["data"]["data"]["address"]["province"]
            ? response["data"]["data"]["data"]["address"]["province"]["name"]
            : null
          } ${response["data"]["data"]["data"]["address"]["postal_code"]
            ? response["data"]["data"]["data"]["address"]["postal_code"]
            : null
        }`;
        response["data"]["data"]["full_data_party_2"] = `${response["data"]["data"]["full_name"]
          } \n\n${response["data"]["data"]["full_address_party_2"]} \n${response["data"]["data"]["data"]["phone_number"]["number"]
          } ${response["data"]["data"]["data"]["phone_number"]["ext"]
            ? "\next: ".concat(
                response["data"]["data"]["data"]["phone_number"]["ext"]
              )
            : ""
        }`;
        response["data"]["data"][
          "full_data_party_1"
        ] = `PT. GEO DIPA ENERGI \n\n${response["data"]["data"]["name"]} \n${response["data"]["data"]["address"]}`;
        setContractData(response.data.data);
        setTimePIcker(
          response.data.data.from_time,
          response.data.data.thru_time
        );
        getPicContractData(response.data.data.vendor_id)
        getPicVendorData(response.data.data.vendor_id)
      })
      .catch((error) => {
        if (
          error.response?.status !== 400 &&
          error.response?.data.message !== "TokenExpiredError"
        )
          setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 10000);
      });
  }, [contract_id, intl, setToast, getPicContractData, getPicVendorData]);

  const setTimePIcker = (from_time, thru_time) => {
    window.$("#kt_daterangepicker_1").daterangepicker({
      buttonClasses: " btn",
      applyClass: "btn-primary",
      cancelClass: "btn-secondary",
      opens: "right",
      locale: {
        format: "DD MMM YYYY",
      },
      startDate: new Date(from_time),
      endDate: new Date(thru_time),
    });
  };

  useEffect(getContractData, []);

  return (
    <React.Fragment>
      <Toast />
      <Card>
        <CardBody>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group row">
                <label
                  htmlFor="numberContract"
                  className="col-sm-4 col-form-label"
                >
                  Number Contract
                </label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    className="form-control"
                    id="numberContract"
                    defaultValue={contractData["contract_no"]}
                    disabled
                  />
                </div>
              </div>

              <div className="form-group row">
                <label className="col-form-label col-sm-4">Jangka Waktu</label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    className="form-control"
                    id="kt_daterangepicker_1"
                    disabled
                    placeholder="Pilih Tanggal"
                  />
                </div>
              </div>
              <div className="form-group row">
                <label
                  htmlFor="priceContract"
                  className="col-sm-4 col-form-label"
                >
                  Harga Pekerjaan
                </label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    className="form-control"
                    id="priceContract"
                    defaultValue={contractData["contract_value"]}
                    disabled
                  />
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="poNumber" className="col-sm-4 col-form-label">
                  Nomor PO
                </label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    className="form-control"
                    id="poNumber"
                    defaultValue={contractData["purch_order_no"]}
                    disabled
                  />
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="priceStep1" className="col-sm-4 col-form-label">
                  Harga Pekerjaan Tahap 1
                </label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    className="form-control"
                    id="priceStep1"
                    defaultValue="Rp. 1.000.000"
                    disabled
                  />
                </div>
              </div>
              <div className="form-group row">
                <label
                  htmlFor="authorizedOffice"
                  className="col-sm-4 col-form-label"
                >
                  Pejabat Berwenang
                </label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    className="form-control"
                    id="authorizedOffice"
                    defaultValue={
                      contractData
                        ? contractData["party_1_position_of_autorize"]
                        : null
                    }
                    disabled
                  />
                </div>
              </div>
              <div className="form-group row">
                <label
                  htmlFor="jobDirectors"
                  className="col-sm-4 col-form-label"
                >
                  Direksi Pekerjaan
                </label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    className="form-control"
                    id="jobDirectors"
                    defaultValue={contractData ? contractData["direksi"] : null}
                    disabled
                  />
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="progress" className="col-sm-4 col-form-label">
                  Progress Pekerjaan
                </label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    className="form-control"
                    id="progress"
                    defaultValue="100%"
                    disabled
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group row">
                <label htmlFor="first" className="col-sm-4 col-form-label">
                  Pihak Pertama
                </label>
                <div className="col-sm-8">
                  <textarea
                    rows="4"
                    cols=""
                    className="form-control"
                    id="first"
                    disabled
                    defaultValue={
                      contractData ? contractData["full_data_party_1"] : null
                    }
                  ></textarea>
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="first" className="col-sm-4 col-form-label">
                  Authorization Invoice
                </label>
                <div className="col-sm-8">
                  <select className="custom-select custom-select-sm">
                    <option selected hidden>
                      Pilih
                    </option>
                    <option className="1">Pusat</option>
                    <option className="2">Unit</option>
                  </select>
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="second" className="col-sm-4 col-form-label">
                  Pihak Kedua
                </label>
                <div className="col-sm-8">
                  <textarea
                    rows="4"
                    cols=""
                    className="form-control"
                    id="second"
                    disabled
                    defaultValue={
                      contractData ? contractData["full_data_party_2"] : null
                    }
                  ></textarea>
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="pic" className="col-sm-4 col-form-label">
                  Email PIC
                </label>
                <div className="input-group col-sm-8">
                  <Select2
                    disabled={true}
                    multiple
                    defaultValue={picContractData}
                    data={picVendorData}
                    options={{
                      placeholder: "search by tags",
                    }}
                    className="form-control"
                  />
                </div>
                <div className="col-sm-8"></div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
      <Card className="mt-5">
        <CardBody>
          <div className="my-5 text-center">
            <h6>Dokumen Tagihan</h6>
          </div>
          {/* begin: Table */}
          <div className="table-wrapper-scroll-y my-custom-scrollbar">
            <div className="segment-table">
              <div className="hecto-10">
                <table className="table-bordered overflow-auto">
                  <thead>
                    <tr>
                      <th className="bg-primary text-white align-middle">No</th>
                      <th className="bg-primary text-white align-middle">
                        Dokumen
                      </th>
                      <th className="bg-primary text-white align-middle">
                        Status
                      </th>
                      <th className="bg-primary text-white align-middle">
                        Approve by
                      </th>
                      <th className="bg-primary text-white align-middle">
                        Tanggal Upload
                      </th>
                      <th className="bg-primary text-white align-middle">
                        Dokumen
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, index) => {
                      return (
                        <tr key={index.toString()}>
                          <td className="align-middle text-center">
                            {index + 1}
                          </td>
                          <td>{item.name}</td>
                          <td>{item.status}</td>
                          <td className="align-middle text-center">
                            {item.approvedBy}
                          </td>
                          <td className="align-middle">{item.date}</td>
                          <td className="align-middle">{item.nameDoc}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {/* end: Table */}
        </CardBody>
      </Card>
    </React.Fragment>
  );
}
export default injectIntl(connect(null, null)(ItemContractSummary));
