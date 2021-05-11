import React, { useState, useEffect, lazy } from "react";
// import { Link } from "react-router-dom";
import { useSelector, shallowEqual, connect, useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ModalProgressBar } from "../../../_metronic/_partials/controls";
// import { toAbsoluteUrl } from "../../../_metronic/_helpers";
import * as auth from "../Auth";
import { FormattedMessage, injectIntl } from "react-intl";
import { Alert, Tabs, Tab } from "react-bootstrap";



function CreateAccountHome(props) {
  // Fields
  const UserCreatePage = lazy(() =>
    import("./NewAccount")
  );
  const UserUpdatePage = lazy(() =>
  import("./UpdateAccount")
  );
  const { intl } = props;
  const [loading, setloading] = useState(false);
  const [alert, setAlert] = useState({ status: false, message: "", variant: "primary" });
  // const [pic, setPic] = useState("");
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user, shallowEqual);
  useEffect(() => {
    // getContract().then(response => setlistContractVendor(response.data.data.items));
    // if (user.pic) {
    //   setPic(user.pic);
    // }
  }, [user]);
  const initialValues = {
    // pic: user.pic,
    // username: user.party.username,
    username: "",
    email: "",
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
      // alert berhasil dan gagal
      setAlert({ status: true, message: "REQ.CREATE_ACCOUNT.SUCCESS", variant: "primary" });
      setAlert({ status: true, message: "REQ.CREATE_ACCOUNT.FAILED", variant: "danger" });
      // saveUser(values, setStatus, setSubmitting);
    },
    onReset: (values, { resetForm }) => {
      resetForm();
    },
  });
  return (
    <div>
      <Alert variant={alert.variant} show={alert.status} onClick={() => setAlert({ status: false, message: "REQ.CREATE_ACCOUNT.SUCCESS" })} dismissible>
        <FormattedMessage id={alert.message} />
      </Alert>
      {loading && <ModalProgressBar />}


      <Tabs defaultActiveKey="new-account" id="uncontrolled-tab-example">
        <Tab eventKey="new-account" title="New Account">
          <UserCreatePage />
        </Tab>
        <Tab eventKey="update-account" title="Update Account">
          <UserUpdatePage />
        </Tab>
      </Tabs>
    </div>
  );
}

export default injectIntl(connect(null, auth.actions)(CreateAccountHome));
