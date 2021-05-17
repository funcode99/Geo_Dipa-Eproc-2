import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
import { useSelector, shallowEqual, connect, useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ModalProgressBar } from "../../../_metronic/_partials/controls";
// import { toAbsoluteUrl } from "../../../_metronic/_helpers";
import * as auth from "../Auth";
import { getContract } from "./_redux/createApi";
import { createNewUser } from "./_redux/createApi";
import { FormattedMessage, injectIntl } from "react-intl";
import { Alert, ListGroup } from "react-bootstrap";

function NewAccount(props) {
  // Fields
  // const [Checkboxes, setCheckbox] = useState(listContractVendor);
  const { intl } = props;
  const [loading, setloading] = useState(false);
  const [alert, setAlert] = useState({ status: false, message: "", variant: "primary" });
  // const [pic, setPic] = useState("");
  // const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user, shallowEqual);
  const cat = localStorage.getItem('persist:geo-dipa-energi-persero')
  const user_id = JSON.parse(JSON.parse(cat).user).id
  useEffect(() => {
    // if (user.pic) {
    //   setPic(user.pic);
    // }
  }, [user]);
  const saveUser = (values, setStatus, setSubmitting) => {
    setloading(true);
    const updatedUser = Object.assign(user);
    setTimeout(() => {
      // Do request to your server for user update, we just imitate user update there, For example:
      createNewUser(values)
      .then(({ data: { data } }) => {
        setloading(false);
        setSubmitting(false);
        setAlert({status: true, message: "REQ.UPDATE", variant: "primary"});
        setTimeout(() => {
          setAlert({status: false, message: "REQ.UPDATE", variant: "primary"})
        }, 3000);
        setloading(false);
      })
      .catch((error) => {
        setloading(false);
        setSubmitting(false);
        setStatus(error);
          setAlert({status: true, message: "REQ.FAILED", variant: "danger"});
          setTimeout(() => {
            setAlert({status: false, message: "REQ.FAILED", variant: "danger"})
          }, 3000);
     });
    }, 1000);
  };
  // const updateFieldChanged = index => e => {
  //   let newArr = Object.assign(listContractVendor[index], { check: true })
  //   setCheckbox(newArr); // ??
  // }
  const initialValues = {
    // pic: user.pic,
    // username: user.party.username,
    username: "",
    email: "",
    password: "",
    user_id: user_id
    // lastname: user.lastname,
    // companyName: user.companyName,
    // phone: user.phone,
    // email: user.email,
    // website: user.website,
  };
  const Schema = Yup.object().shape({
    // pic: Yup.string(),
    username: Yup.string()
      .min(3, intl.formatMessage({ id: "AUTH.VALIDATION.FORGOT_MIN_CHARACTER" }))
      .max(50, intl.formatMessage({ id: "AUTH.VALIDATION.FORGOT_MAX_CHARACTER" }))
      .required(
        intl.formatMessage({
          id: "AUTH.VALIDATION.REQUIRED_FIELD",
        })
      ),
    password: Yup.string()
      .min(8, "Minimal 8 karakter")
      .max(32, intl.formatMessage({ id: "AUTH.VALIDATION.FORGOT_MAX_CHARACTER" }))
      .required(
        intl.formatMessage({
          id: "AUTH.VALIDATION.REQUIRED_FIELD",
        })
      ),
    // lastname: Yup.string().required("Last name is required"),
    // companyName: Yup.string(),
    // phone: Yup.string().required("Phone is required"),
    email: Yup.string()
      .email("Wrong email format")
      .required(
        intl.formatMessage({
          id: "AUTH.VALIDATION.REQUIRED_FIELD",
        })
      ),
    // website: Yup.string(),
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
    onSubmit: (values, { setStatus, setSubmitting }) => {
      saveUser(values, setStatus, setSubmitting);
    },
    onReset: (values, { resetForm }) => {
      resetForm();
    },
  });
  return (
    <form
      className="card card-custom card-stretch"
      onSubmit={formik.handleSubmit}
    >
      <Alert variant={alert.variant} show={alert.status} onClick={() => setAlert({ status: false, message: "REQ.CREATE_ACCOUNT.SUCCESS" })} dismissible>
        <FormattedMessage id={alert.message} />
      </Alert>
      {loading && <ModalProgressBar />}

      {/* begin::Header */}
      <div className="card-header py-3">
        <div className="card-title align-items-start flex-column">
          <h3 className="card-label font-weight-bolder text-dark">
            <FormattedMessage id="TITLE.CREATE_ACCOUNT.NEW_ACCOUNT" />
          </h3>
          <span className="text-muted font-weight-bold font-size-sm mt-1">
            <FormattedMessage id="TITLE.CREATE_ACCOUNT.NEW_ACCOUNT.SPAN" />
          </span>
        </div>
        <div className="card-toolbar">
          <button
            type="submit"
            className="btn btn-success mr-2"
            disabled={
              formik.isSubmitting || (formik.touched && !formik.isValid)
            }
          >
            <FormattedMessage id="AUTH.GENERAL.SUBMIT_BUTTON" />
            {formik.isSubmitting}
          </button>
        </div>
      </div>
      {/* end::Header */}
      {/* begin::Form */}
      <div className="form">
        {/* begin::Body */}
        <div className="card-body">
          <div className="row">
            <label className="col-xl-3"></label>
            <div className="col-lg-9 col-xl-6">
              <h5 className="font-weight-bold mb-6"><FormattedMessage id="TITLE.CREATE_ACCOUNT.NEW_ACCOUNT.USER_INFO" /></h5>
            </div>
          </div>
          <div className="form-group row">
            <label className="col-xl-3 col-lg-3 col-form-label">
              <FormattedMessage id="TITLE.CREATE_ACCOUNT.NEW_ACCOUNT.USERNAME" />
              <span className="text-danger">*</span>
            </label>
            <div className="col-lg-9 col-xl-6">
              <input
                type="text"
                placeholder={
                  intl.formatMessage({
                    id: "TITLE.CREATE_ACCOUNT.NEW_ACCOUNT.USERNAME",
                  })
                }
                className={`form-control form-control-lg form-control-solid ${getInputClasses(
                  "username"
                )}`}
                name="username"
                {...formik.getFieldProps("username")}
              />
              {formik.touched.username && formik.errors.username ? (
                <div className="invalid-feedback">
                  {formik.errors.username}
                </div>
              ) : null}
            </div>
          </div>
          <div className="form-group row">
            <label className="col-xl-3 col-lg-3 col-form-label">
              Password
              <span className="text-danger">*</span>
            </label>
            <div className="col-lg-9 col-xl-6">
              <input
                type="password"
                placeholder="Password"
                className={`form-control form-control-lg form-control-solid ${getInputClasses(
                  "password"
                )}`}
                name="password"
                {...formik.getFieldProps("password")}
              />
              {formik.touched.password && formik.errors.password ? (
                <div className="invalid-feedback">
                  {formik.errors.password}
                </div>
              ) : null}
            </div>
          </div>
          <div className="form-group row">
            <label className="col-xl-3 col-lg-3 col-form-label">
              <FormattedMessage id="TITLE.USER_PROFILE.PERSONAL_INFORMATION.INPUT.EMAIL_ADDRESS" />
              <span className="text-danger">*</span>
            </label>
            <div className="col-lg-9 col-xl-6">
              <div className="input-group input-group-lg input-group-solid">
                <div className="input-group-prepend">
                  <span className="input-group-text">
                    <i className="fa fa-at"></i>
                  </span>
                </div>
                <input
                  type="email"
                  placeholder={
                    intl.formatMessage({
                      id: "TITLE.USER_PROFILE.PERSONAL_INFORMATION.INPUT.EMAIL_ADDRESS",
                    })
                  }
                  className={`form-control form-control-lg form-control-solid ${getInputClasses(
                    "email"
                  )}`}
                  name="email"
                  {...formik.getFieldProps("email")}
                />
              </div>
              {formik.touched.email && formik.errors.email ? (
                <div className="invalid-feedback display-block">
                  {formik.errors.email}
                </div>
              ) : null}
            </div>
          </div>
          <div className="form-group row">
            <div className="col-lg-12 col-xl-12">
              <div className="input-group input-group-lg input-group-solid"></div>
            </div>
          </div>
        </div>
        {/* end::Body */}
      </div>
      <div className="card-header py-3">
        <div className="card-title align-items-start flex-column">
        </div>
        <div className="card-toolbar">
          <button
            type="submit"
            className="btn btn-success mr-2"
            disabled={
              formik.isSubmitting || (formik.touched && !formik.isValid)
            }
          >
            <FormattedMessage id="AUTH.GENERAL.SUBMIT_BUTTON" />
            {formik.isSubmitting}
          </button>
        </div>
      </div>
      {/* end::Form */}
    </form>
  );
}

export default injectIntl(connect(null, auth.actions)(NewAccount));
