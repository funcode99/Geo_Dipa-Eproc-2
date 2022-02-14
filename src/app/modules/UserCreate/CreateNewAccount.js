import { MODAL } from "../../../service/modalSession/ModalService";
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import * as auth from "../Auth/_redux/authRedux";
import { checkUsername, createNewUser } from "./_redux/createApi";

function CreateNewAccount(props) {

    const initialValues = {
        username: "",
        password: "",
        user_id: props.data.user_id,
        vendor_id: props.data.vendor_id,
        email: props.data.email,
        fullname: "",
        contract_id: props.data.contract_id,
        vendor_full_name: props.data.vendor_full_name
    }

    Yup.addMethod(Yup.string, "checkAvailability", function (errorMessage) {
        return this.test(`test-card-length`, errorMessage, function (value) {
            const { path, createError } = this;
            return (
                (usernameAvailability) || createError({ path, message: errorMessage })
            );
        });
    });
    Yup.addMethod(Yup.string, "confirmPassword", function (errorMessage) {
        return this.test(`test-card-length`, errorMessage, function (value) {
            const { path, createError } = this;
            return (
                (formik.values.password === formik.values.conf_password) || createError({ path, message: errorMessage })
            );
        });
    });

    const [usernameAvailability, setUsernameAvailability] = useState(false);
    const [showPassword, setShowPassword] = useState(false)
    const [showConfPassword, setConfShowPassword] = useState(false);
    const { intl } = props;
    const [loading, setloading] = useState(false);
    const modal_title_success = intl.formatMessage({ id: "TITLE.MODAL_CREATE.LABEL.TITLE_SUCCESS" })
    const modal_body_success = intl.formatMessage({ id: "TITLE.MODAL_CREATE.LABEL.BODY_SUCCESS" })
    const modal_button_success = intl.formatMessage({ id: "TITLE.MODAL_CREATE.LABEL.BUTTON_SUCCESS" })
    const modal_title_failed = intl.formatMessage({ id: "TITLE.MODAL_CREATE.LABEL.TITLE_FAILED" })
    const modal_body_failed = intl.formatMessage({ id: "TITLE.MODAL_CREATE.LABEL.BODY_FAILED" })
    const modal_button_failed = intl.formatMessage({ id: "TITLE.MODAL_CREATE.LABEL.BUTTON_FAILED" })
    const CreateSchema = Yup.object().shape({
        username: Yup.string()
            .min(3, intl.formatMessage({
                id: "AUTH.VALIDATION.MIN_LENGTH_FIELD",
            }, { length: 3 }))
            .max(50, intl.formatMessage({
                id: "AUTH.VALIDATION.MAX_LENGTH_FIELD",
            }, { length: 50 }))
            .required(
                intl.formatMessage({
                    id: "AUTH.VALIDATION.REQUIRED_FIELD",
                }))
            .matches(
                /^((?!admin).)*$/,
                intl.formatMessage({
                    id: "TITLE.CREATE_ACCOUNT.VALIDATION.USERNAME_NOT_AVAILABLE",
                })
            )
            .matches(
                /^[a-zA-Z0-9-_.]{3,50}$/,
                intl.formatMessage({
                    id: "TITLE.CREATE_ACCOUNT.VALIDATION.USERNAME_NOT_INCLUDE_SYMBOLS",
                })
            )
            .checkAvailability(
                intl.formatMessage({
                    id: "TITLE.CREATE_ACCOUNT.VALIDATION.USERNAME_NOT_AVAILABLE",
                }))
        ,
        password: Yup.string()
            .min(8, intl.formatMessage({
                id: "AUTH.VALIDATION.MIN_LENGTH_FIELD",
            }, { length: 8 }))
            .max(32, intl.formatMessage({
                id: "AUTH.VALIDATION.MAX_LENGTH_FIELD",
            }, { length: 32 }))
            .required(
                intl.formatMessage({
                    id: "AUTH.VALIDATION.REQUIRED_FIELD",
                })
            )
            .matches(
                /(?=.*[A-Z])(?=.*\d)/,
                intl.formatMessage({
                    id: "TITLE.CREATE_ACCOUNT.VALIDATION.PASSWORD_CAPITAL",
                })
            ),
        full_name: Yup.string()
            .min(4, intl.formatMessage({
                id: "AUTH.VALIDATION.MIN_LENGTH_FIELD",
            }, { length: 4 }))
            .max(50, intl.formatMessage({
                id: "AUTH.VALIDATION.MAX_LENGTH_FIELD",
            }, { length: 50 }))
            .required(
                intl.formatMessage({
                    id: "AUTH.VALIDATION.REQUIRED_FIELD",
                })
            ),
        conf_password: Yup.string()
            .required(
                intl.formatMessage({
                    id: "AUTH.VALIDATION.REQUIRED_FIELD",
                })
            )
            .confirmPassword(
                intl.formatMessage({
                    id: "TITLE.CREATE_ACCOUNT.VALIDATION.CONF_PASSWORD",
                })),
    });

    const check_username = () => {
        if (formik.values.username.length > 3) {
            checkUsername(formik.values.username)
                .then(({ data: { data } }) => {
                    setUsernameAvailability(data.check)
                })
                .catch((error) => {
                });
        }
    }

    const getInputClasses = (fieldname) => {
        if (formik.touched[fieldname] && formik.errors[fieldname]) {
            return "is-invalid";
        }

        if (formik.touched[fieldname] && !formik.errors[fieldname]) {
            return "is-valid";
        }

        return "";
    };

    const createUser = (values, setStatus, setSubmitting) => {
        values.email = props.data.email
        values.user_id = props.data.user_id
        values.vendor_id = props.data.vendor_id
        values.contract_id = props.data.contract_id
        values.users_pic_id = props.data.users_pic_id
        values.monitoring_type = props.data.monitoring_type
        setloading(true);
        setTimeout(() => {
            // Do request to your server for user update, we just imitate user update there, For example:
            createNewUser(values)
                .then(({ data: { data } }) => {
                    setloading(false)
                    setSubmitting(false)
                    MODAL.showCreate(modal_title_success, modal_body_success, modal_button_success, true)
                })
                .catch((error) => {
                    setloading(false);
                    setSubmitting(false);
                    MODAL.showCreate(modal_title_failed, modal_body_failed, modal_button_failed, false)
                });
        }, 1000);
    };

    const formik = useFormik({
        initialValues,
        validationSchema: CreateSchema,
        onSubmit: (values, { setStatus, setSubmitting }) => {
            createUser(values, setStatus, setSubmitting)
        },
        onReset: (values, { resetForm }) => {
            resetForm();
        },
    });

    return (
        <div className="d-flex flex-row my-auto">
            <div className="flex-row-fluid ml-lg-2"></div>
            <div className="flex-row-fluid ml-lg-8">
                <form
                    className="card card-custom card-stretch"
                    onSubmit={formik.handleSubmit}
                >
                    <div className="form">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-lg-3 col-xl-3"></div>
                                <div className="col-lg-6 col-xl-6">
                                    <h2 className="font-weight-bold mb-12 mt-3 text-center"><FormattedMessage id="TITLE.CREATE_ACCOUNT" /></h2>
                                </div>
                                <div className="col-lg-3 col-xl-3"></div>
                            </div>
                            <div className="form-group row">
                                <label className="col-xl-3 col-lg-3 col-form-label">
                                    <FormattedMessage id="TITLE.CREATE_ACCOUNT.LABEL.VENDOR" />
                                    <span className="text-danger"></span>
                                </label>
                                <div className="col-lg-9 col-xl-9">
                                    <div className="input-group input-group-lg input-group-solid">
                                        <input
                                            type="text"
                                            className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                "vendor_name"
                                            )}`}
                                            name="vendor_name"
                                            readOnly
                                            defaultValue={initialValues.vendor_full_name}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-xl-3 col-lg-3 col-form-label">
                                    <FormattedMessage id="TITLE.CREATE_ACCOUNT.LABEL.USERNAME" />
                                    <span className="text-danger">*</span>
                                </label>
                                <div className="col-lg-9 col-xl-9">
                                    <div className="input-group input-group-lg input-group-solid">
                                        <input
                                            type="text"
                                            placeholder={intl.formatMessage({
                                                id: "TITLE.CREATE_ACCOUNT.PLACEHOLDER.USERNAME",
                                            })}
                                            className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                "username"
                                            )}`}
                                            name="username"
                                            readOnly={loading}
                                            onKeyUp={check_username}
                                            {...formik.getFieldProps("username")}
                                        />
                                    </div>
                                    {formik.touched.username && formik.errors.username ? (
                                        <div className="invalid-feedback display-block">
                                            {formik.errors.username}
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-xl-3 col-lg-3 col-form-label">
                                    <FormattedMessage id="TITLE.CREATE_ACCOUNT.LABEL.FULLNAME" />
                                    <span className="text-danger">*</span>
                                </label>
                                <div className="col-lg-9 col-xl-9">
                                    <input
                                        type="text"
                                        placeholder={
                                            intl.formatMessage({
                                                id: "TITLE.CREATE_ACCOUNT.PLACEHOLDER.FULLNAME",
                                            })
                                        }
                                        className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                            "full_name"
                                        )}`}
                                        name="full_name"
                                        readOnly={loading}
                                        {...formik.getFieldProps("full_name")}
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
                                    <FormattedMessage id="TITLE.CREATE_ACCOUNT.LABEL.PASSWORD" />
                                    <span className="text-danger">*</span>
                                </label>
                                <div className="col-lg-9 col-xl-9">
                                    <div className="input-group input-group-lg input-group-solid">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder={intl.formatMessage({
                                                id: "TITLE.CREATE_ACCOUNT.PLACEHOLDER.PASSWORD",
                                            })}
                                            className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                "password"
                                            )}`}
                                            name="password"
                                            readOnly={loading}
                                            {...formik.getFieldProps("password")}
                                        />
                                        <div onClick={() => setShowPassword(!showPassword)} className="input-group-append">
                                            <button className="form-control form-control-lg"><i className={`fa fa-eye ${showPassword ? "text-dark" : null}`}></i></button>
                                        </div>
                                    </div>
                                    {formik.touched.password && formik.errors.password ? (
                                        <div className="invalid-feedback display-block">
                                            {formik.errors.password}
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-xl-3 col-lg-3 col-form-label">
                                    <FormattedMessage id="TITLE.CREATE_ACCOUNT.LABEL.CONFIRM_PASSWORD" />
                                    <span className="text-danger">*</span>
                                </label>
                                <div className="col-lg-9 col-xl-9">
                                    <div className="input-group input-group-lg input-group-solid">
                                        <input
                                            type={showConfPassword ? "text" : "password"}
                                            placeholder={intl.formatMessage({
                                                id: "TITLE.CREATE_ACCOUNT.PLACEHOLDER.CONFIRM_PASSWORD",
                                            })}
                                            className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                "conf_password"
                                            )}`}
                                            readOnly={loading}
                                            {...formik.getFieldProps("conf_password")}
                                        />
                                        <div onClick={() => setConfShowPassword(!showConfPassword)} className="input-group-append">
                                            <button className="form-control form-control-lg"><i className={`fa fa-eye ${showConfPassword ? "text-dark" : null}`}></i></button>
                                        </div>
                                    </div>
                                    {formik.touched.conf_password && formik.errors.conf_password ? (
                                        <div className="invalid-feedback display-block">
                                            {formik.errors.conf_password}
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card-footer py-3">
                        <div className="card-toolbar float-right">
                            <button
                                type="submit"
                                className="btn btn-success"
                                disabled={
                                    formik.isSubmitting || (formik.touched && !formik.isValid)
                                }
                            >
                                <FormattedMessage id="TITLE.CREATE_ACCOUNT.REGISTER" />
                                {loading && <span className="spinner-border spinner-border-sm ml-1" aria-hidden="true"></span>}
                                {formik.isSubmitting}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            <div className="flex-row-fluid ml-lg-2"></div>
        </div>
    );
}

export default injectIntl(connect(null, auth.actions)(CreateNewAccount));
