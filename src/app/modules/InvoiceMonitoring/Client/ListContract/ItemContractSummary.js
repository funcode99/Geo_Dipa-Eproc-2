import React, { useState, useEffect, useCallback } from "react";
import { connect, useSelector, shallowEqual } from "react-redux";
import { rupiah } from "../../../../libs/currency";
import { FormattedMessage, injectIntl } from "react-intl";
import {
  Card,
  CardBody,
  CardFooter,
} from "../../../../../_metronic/_partials/controls";
import TableOnly from "../../../../components/tableCustomV1/tableOnly";
import {
  getPicContract,
  getPicVendor,
  getContractSummary,
  getContractAuthority,
  createContractAuthority,
  updateContractAuthority,
} from "../../_redux/InvoiceMonitoringCrud";
import useToast from "../../../../components/toast";
import StyledSelect from "../../../../components/select-multiple";
import { TableRow, TableCell } from "@material-ui/core";

function ItemContractSummary(props) {
  const { intl, getData } = props;
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

  const headerTable = [
    {
      title: intl.formatMessage({
        id: "TITLE.TABLE_HEADER.NO",
      }),
    },
    {
      title: intl.formatMessage({
        id: "TITLE.DOCUMENT_NAME",
      }),
    },
    {
      title: intl.formatMessage({
        id: "TITLE.STATUS",
      }),
    },
    {
      title: intl.formatMessage({
        id: "TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.APPROVED_BY",
      }),
    },
    {
      title: intl.formatMessage({ id: "TITLE.UPLOAD_DATE" }),
    },
    {
      title: intl.formatMessage({
        id: "TITLE.DOCUMENT_NAME",
      }),
    },
  ];

  const [picContractData, setPicContractData] = useState([]);
  const [picVendorData, setPicVendorData] = useState([]);
  const [contractData, setContractData] = useState({});
  const [loading, setLoading] = useState(false);
  const [contractAuthority, setContractAuthority] = useState(0);
  const [contractAuthorityExist, setContractAuthorityExist] = useState(false);
  const [count, setCount] = useState(0);

  const [Toast, setToast] = useToast();
  const user_id = useSelector(
    (state) => state.auth.user.data.user_id,
    shallowEqual
  );
  const contract_id = props.match.params.contract;
  const termin = props.match.params.termin;
  const monitoring_type = "INVOICE";

  const getPicContractData = useCallback(
    (vendor_id) => {
      getPicContract({
        id: contract_id,
        vendor_id: vendor_id,
        monitoring_type: monitoring_type,
      })
        .then((response) => {
          setPicContractData(response.data.data);
        })
        .catch((error) => {
          setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 5000);
        });
    },
    [contract_id, intl, setToast]
  );

  const getPicVendorData = useCallback(
    (vendor_id) => {
      getPicVendor(vendor_id)
        .then((response) => {
          setPicVendorData(response.data.data);
        })
        .catch((error) => {
          setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 5000);
        });
    },
    [intl, setToast]
  );

  const getContractData = useCallback(() => {
    getContractSummary(contract_id, termin)
      .then((response) => {
        response["data"]["data"]["contract_value"] = rupiah(
          response["data"]["data"]["contract_value"]
        );
        response["data"]["data"]["termin_value"] = rupiah(
          response["data"]["data"]["termin_value"]
        );
        response["data"]["data"]["authorize"] = response["data"]["data"][
          "party_1_contract_signature_name"
        ].concat(
          " - ",
          response["data"]["data"]["party_1_position_of_autorize"]
        );
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
        getPicContractData(response.data.data.vendor_id);
        getPicVendorData(response.data.data.vendor_id);
        getData(response.data.data);
      })
      .catch((error) => {
        setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 5000);
      });
  }, [
    contract_id,
    intl,
    setToast,
    getPicContractData,
    getPicVendorData,
    getData,
  ]);

  const getContractAuthorityData = useCallback(() => {
    getContractAuthority(termin)
      .then((response) => {
        if (response["data"]["data"]) {
          setContractAuthority(response["data"]["data"]["authority"]);
          setContractAuthorityExist(true);
        }
      })
      .catch((error) => {
        setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 5000);
      });
  }, [termin, intl, setToast]);

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

  const handleSelect = (e) => {
    setContractAuthority(e.target.value);
  };

  const handleSubmit = () => {
    setLoading(true);
    const data = {
      contract_id: contract_id,
      authority: contractAuthority,
      created_by_id: user_id,
      updated_by_id: user_id,
      term_id: termin,
    };
    if (contractAuthorityExist) {
      updateContractAuthority(data)
        .then((response) => {
          setToast(intl.formatMessage({ id: "REQ.UPDATE_SUCCESS" }), 5000);
          setLoading(false);
        })
        .catch((error) => {
          setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 5000);
          setLoading(false);
        });
    } else {
      createContractAuthority(data)
        .then((response) => {
          setToast(intl.formatMessage({ id: "REQ.UPDATE_SUCCESS" }), 5000);
          setLoading(false);
          setContractAuthorityExist(true);
        })
        .catch((error) => {
          setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 5000);
          setLoading(false);
        });
    }
  };

  useEffect(getContractData, []);
  useEffect(getContractAuthorityData, []);

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
                  <FormattedMessage id="CONTRACT_DETAIL.LABEL.CONTRACT_NUMBER" />
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
                <label className="col-form-label col-sm-4">
                  <FormattedMessage id="CONTRACT_DETAIL.TAB.PERIOD" />
                </label>
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
                  <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.CONTRACT_AMMOUNT" />
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
                  <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.PO_NUMBER" />
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
                  <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.TERMIN_AMMOUNT" />
                </label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    className="form-control"
                    id="priceStep1"
                    defaultValue={contractData["termin_value"]}
                    disabled
                  />
                </div>
              </div>
              <div className="form-group row">
                <label
                  htmlFor="authorizedOffice"
                  className="col-sm-4 col-form-label"
                >
                  <FormattedMessage id="TITLE.AUTHOR_OFFICIAL" />
                </label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    className="form-control"
                    id="authorizedOffice"
                    defaultValue={
                      contractData ? contractData["authorize"] : null
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
                  <FormattedMessage id="TITLE.DIRECTOR_OF_WD" />
                </label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    className="form-control"
                    id="jobDirectors"
                    defaultValue={
                      contractData
                        ? contractData["party_1_director_position"]
                        : null
                    }
                    disabled
                  />
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="progress" className="col-sm-4 col-form-label">
                  <FormattedMessage id="CONTRACT_DETAIL.TABLE_HEAD.PROJECT_PROGRESS" />
                </label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    className="form-control"
                    id="progress"
                    defaultValue={
                      contractData ? contractData["termin_progress"] : null
                    }
                    disabled
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group row">
                <label htmlFor="first" className="col-sm-4 col-form-label">
                  <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.FIRST_PARTY" />
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
                  <FormattedMessage id="TITLE.AUTHOR_INVOICE" />
                </label>
                <div className="col-sm-8">
                  <select
                    className="custom-select custom-select-sm"
                    value={contractAuthority}
                    onChange={handleSelect}
                  >
                    <option value="0" hidden>
                      SELECT
                    </option>
                    <option value="Pusat">Pusat</option>
                    <option value="Unit">Unit</option>
                  </select>
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="second" className="col-sm-4 col-form-label">
                  <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.SECOND_PARTY" />
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
                  <FormattedMessage id="TITLE.SELECT_PIC" />
                </label>
                <div className="input-group col-sm-8">
                  <StyledSelect
                    isDisabled={true}
                    options={picVendorData}
                    value={picContractData}
                  ></StyledSelect>
                </div>
                <div className="col-sm-8"></div>
              </div>
            </div>
          </div>
        </CardBody>
        <CardFooter className="text-right">
          <button
            type="button"
            className="btn btn-primary mx-1"
            onClick={handleSubmit}
            disabled={loading}
          >
            Simpan
            {loading && (
              <span
                className="spinner-border spinner-border-sm ml-1"
                aria-hidden="true"
              ></span>
            )}
          </button>
        </CardFooter>
      </Card>
      <Card className="mt-5">
        <CardBody>
          <div className="my-5 text-center">
            <h6>
              <FormattedMessage id="TITLE.BILLING_DOCUMENT" />
            </h6>
          </div>

          <TableOnly
            dataHeader={headerTable}
            loading={loading}
            // err={err}
            hecto={10}
          >
            {data.map((item, index) => {
              return (
                <TableRow key={index.toString()}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.status}</TableCell>
                  <TableCell>{item.approvedBy}</TableCell>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>{item.nameDoc}</TableCell>
                </TableRow>
              );
            })}
          </TableOnly>
        </CardBody>
      </Card>
    </React.Fragment>
  );
}
export default injectIntl(connect(null, null)(ItemContractSummary));
