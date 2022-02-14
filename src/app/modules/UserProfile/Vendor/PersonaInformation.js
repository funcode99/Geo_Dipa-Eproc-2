import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual, connect } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ModalProgressBar } from "../../../../_metronic/_partials/controls";
import * as auth from "../../Auth";
import { FormattedMessage, injectIntl } from "react-intl";
import { Alert } from "react-bootstrap";

function PersonaInformation(props) {
  const { intl } = props;
  const [loading] = useState(false);
  const [alert, setAlert] = useState({
    status: false,
    message: "",
    variant: "primary",
  });
  const user = useSelector((state) => state.auth.user.data, shallowEqual);
  useEffect(() => {}, [user]);
  // Methods
  // UI Helpers
  const initialValues = {
    full_name: user.full_name,
    company_name: user.vendor_full_name,
  };
  const Schema = Yup.object().shape({
    full_name: Yup.string().required(
      intl.formatMessage({
        id: "AUTH.VALIDATION.REQUIRED_FIELD",
      })
    ),
    company_name: Yup.string().required(
      intl.formatMessage({
        id: "AUTH.VALIDATION.REQUIRED_FIELD",
      })
    ),
  });
  const getInputClasses = (fieldname) => {
    if (formik.touched[fieldname] && formik.errors[fieldname]) {
      return "is-invalid";
    }

    if (formik.touched[fieldname] && !formik.errors[fieldname]) {
      return "is-valid";
    }

    return "";
  };
  const formik = useFormik({
    initialValues,
    validationSchema: Schema,
  });
  return (
    <form className="card card-custom card-stretch">
      <Alert
        variant={alert.variant}
        show={alert.status}
        onClick={() => setAlert({ status: false, message: "REQ.UPDATE" })}
        dismissible
      >
        <FormattedMessage id={alert.message} />
      </Alert>
      {loading && <ModalProgressBar />}

      {/* begin::Header */}
      <div className="card-header py-3">
        <div className="card-title align-items-start flex-column">
          <h3 className="card-label font-weight-bolder text-dark">
            <FormattedMessage id="TITLE.USER_PROFILE.PERSONAL_INFORMATION" />
          </h3>
          <span className="text-muted font-weight-bold font-size-sm mt-1">
            <FormattedMessage id="TITLE.USER_PROFILE.PERSONAL_INFORMATION.SPAN" />
          </span>
        </div>
        <div className="card-toolbar"></div>
      </div>
      {/* end::Header */}
      {/* begin::Form */}
      <div className="form">
        {/* begin::Body */}
        <div className="card-body">
          <div className="row">
            <label className="col-xl-3"></label>
            <div className="col-lg-9 col-xl-6">
              <h5 className="font-weight-bold mb-6">
                <FormattedMessage id="TITLE.USER_PROFILE.PERSONAL_INFORMATION.CUSTOMER_INFO" />
              </h5>
            </div>
          </div>

          <div className="form-group row">
            <label className="col-xl-3 col-lg-3 col-form-label">
              <FormattedMessage id="TITLE.USER_PROFILE.PERSONAL_INFORMATION.INPUT.FULLNAME" />
            </label>
            <div className="col-lg-9 col-xl-9">
              <input
                type="text"
                placeholder={intl.formatMessage({
                  id: "TITLE.USER_PROFILE.PERSONAL_INFORMATION.INPUT.FULLNAME",
                })}
                className={`form-control form-control-lg form-control-solid ${getInputClasses(
                  "full_name"
                )}`}
                name="full_name"
                {...formik.getFieldProps("full_name")}
                disabled={true}
              />
              {formik.touched.full_name && formik.errors.full_name ? (
                <div className="invalid-feedback">
                  {formik.errors.full_name}
                </div>
              ) : null}
            </div>
          </div>
          <div className="form-group row">
            <label className="col-xl-3 col-lg-3 col-form-label">
              <FormattedMessage id="TITLE.USER_PROFILE.PERSONAL_INFORMATION.INPUT.COMPANY_NAME" />
            </label>
            <div className="col-lg-9 col-xl-9">
              <input
                type="text"
                placeholder={intl.formatMessage({
                  id:
                    "TITLE.USER_PROFILE.PERSONAL_INFORMATION.INPUT.COMPANY_NAME",
                })}
                className={`form-control form-control-lg form-control-solid ${getInputClasses(
                  "company_name"
                )}`}
                name="company_name"
                {...formik.getFieldProps("company_name")}
                disabled={true}
              />
              {formik.touched.company_name && formik.errors.company_name ? (
                <div className="invalid-feedback">
                  {formik.errors.company_name}
                </div>
              ) : null}
            </div>
          </div>
        </div>
        {/* end::Body */}
      </div>
      {/* end::Form */}
    </form>
  );
}

export default injectIntl(connect(null, auth.actions)(PersonaInformation));
