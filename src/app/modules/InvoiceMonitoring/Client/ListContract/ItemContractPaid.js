import React, { useState, useEffect, useCallback } from "react";
import { connect, useSelector, shallowEqual } from "react-redux";
import { rupiah } from "../../../../libs/currency";
import { FormattedMessage, injectIntl } from "react-intl";
import {
  Card,
  CardBody,
  CardFooter,
} from "../../../../../_metronic/_partials/controls";
import {
  getTerminPaid, createTerminPaid
} from "../../_redux/InvoiceMonitoringCrud";
import useToast from "../../../../components/toast";
import { useParams } from "react-router-dom";

function ItemContractPaid(props) {
  const { intl } = props

  const dataUser = useSelector((state) => state.auth.user.data);
  let monitoring_role = dataUser.monitoring_role
    ? dataUser.monitoring_role
    : [];
  const [contractData, setContractData] = useState({});
  const [loading, setLoading] = useState(false);
  const [uploadFilename, setUploadFilename] = useState(
    intl.formatMessage({
      id: "TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.DEFAULT_FILENAME",
    })
  );
  const [data, setData] = useState({});

  const [Toast, setToast] = useToast();
  const user_id = useSelector(
    (state) => state.auth.user.data.user_id,
    shallowEqual
  );
  const contract_id = props.match.params.contract;
  const termin = props.match.params.termin;

  const handleUpload = (e) => {
    if (e.currentTarget.files.length) {
      setUploadFilename(e.currentTarget.files[0].name);
    } else {
      setUploadFilename(
        intl.formatMessage({
          id: "TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.DEFAULT_FILENAME",
        })
      );
    }
    setData({
      ...data,
      file: e.currentTarget.files[0]
    })
  };

  const handleSubmit = () => {
    var data_new = new FormData();
    for (var key in data) {
      data_new.append(key, data[key]);
    }
    createTerminPaid(data_new)
      .then((response) => {
        setToast(intl.formatMessage({ id: "REQ.UPDATE_SUCCESS" }), 10000);
        setLoading(false);
      })
      .catch((error) => {
        setToast(intl.formatMessage({ id: "REQ.UPDATE_FAILED" }), 10000);
        setLoading(false);
      });
  };

  const getContractData = useCallback(() => {
    getTerminPaid(termin)
      .then((response) => {
        setContractData(response.data.data);
      })
      .catch((error) => {
        setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 5000);
      });
  }, [
    contract_id,
    intl,
    setToast,
  ]);

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
                  htmlFor="priceContract"
                  className="col-sm-4 col-form-label"
                >
                  {/* <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.CONTRACT_AMMOUNT" /> */}
                  Nomor BKB
                </label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    className="form-control"
                    id="priceContract"
                    defaultValue={contractData?.bkb_number}
                    disabled
                  />
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="priceStep1" className="col-sm-4 col-form-label">
                  <FormattedMessage id="TITLE.TERMIN" />
                </label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    className="form-control"
                    id="priceStep1"
                    defaultValue={props.terminName}
                    disabled
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
                    value={rupiah(contractData?.total_amount || 0)}
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
                    value={rupiah(contractData?.termin_value || 0)}
                    disabled
                  />
                </div>
              </div>
              <div className="form-group row">
                <label
                  htmlFor="priceContract"
                  className="col-sm-4 col-form-label"
                >
                  {/* <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.CONTRACT_AMMOUNT" /> */}
                  Harga Bersih Termin
                </label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    className="form-control"
                    id="priceContract"
                    value={rupiah(contractData?.termin_net_value || 0)}
                    disabled
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group row">
                <label
                  htmlFor="priceContract"
                  className="col-sm-4 col-form-label"
                >
                  {/* <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.CONTRACT_AMMOUNT" /> */}
                  Denda Termin
                </label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    className="form-control"
                    id="priceContract"
                    value={rupiah(contractData?.penalty || 0)}
                    disabled
                  />
                </div>
              </div>
              <div className="form-group row">
                <label
                  htmlFor="priceContract"
                  className="col-sm-4 col-form-label"
                >
                  {/* <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.CONTRACT_AMMOUNT" /> */}
                  Pajak Termin
                </label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    className="form-control"
                    id="priceContract"
                    value={rupiah(contractData?.tax_value || 0)}
                    disabled
                  />
                </div>
              </div>
              <div className="form-group row">
                <label
                  htmlFor="dateInvoice"
                  className="col-sm-4 col-form-label"
                >
                  {/* <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.INVOICE_DOCUMENT.INVOICE_DATE" /> */}
                  Tanggal Bukti Bayar
                  <span className="text-danger">*</span>
                </label>
                <div className="col-sm-8">
                  <input
                    type="date"
                    className="form-control"
                    id="dateInvoice"
                    value={data?.paid_date}
                  />
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="upload" className="col-sm-4 col-form-label">
                  {/* <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.INVOICE_DOCUMENT.INVOICE_UPLOAD" /> */}
                  Upload Bukti Bayar
                </label>
                <label
                  htmlFor="upload"
                  className={`input-group mb-3 col-sm-8`}
                >
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <i className="fas fa-file-upload"></i>
                    </span>
                  </div>
                  <span
                    className={`form-control text-truncate`}
                  >
                    {uploadFilename}
                  </span>
                </label>
                {/* {formik.touched.file && formik.errors.file ? (
                  <span className="col-sm-8 offset-sm-4 text-left text-danger">
                    {formik.errors.file}
                  </span>
                ) : null} */}
                <input
                  type="file"
                  className="d-none"
                  id="upload"
                  onChange={(e) => handleUpload(e)}
                />
              </div>
            </div>
          </div>
        </CardBody>
        <CardFooter className="text-right">
          <button
            type="button"
            className="btn btn-primary mx-1"
          onClick={handleSubmit}
          // disabled={loading || !terminAuthorizationStaff}
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
    </React.Fragment>
  );
}
export default injectIntl(connect(null, null)(ItemContractPaid));
