import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
import { useSelector, shallowEqual, connect, useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ModalProgressBar } from "../../../_metronic/_partials/controls";
// import { toAbsoluteUrl } from "../../../_metronic/_helpers";
import * as auth from "../Auth";
import { getContract, getAllUser } from "./_redux/createApi";
import { FormattedMessage, injectIntl } from "react-intl";
import { Alert, ListGroup, Modal, Button } from "react-bootstrap";

function UpdateAccount(props) {
  // Fields
  const [listContractVendor, setlistContractVendor] = useState([]);
  const [listUser, setlistUser] = useState([]);
  const [userSelected, setUserSelected] = useState({username: "", email: "as@gmail.com"});
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const { intl } = props;
  const [loading, setloading] = useState(false);
  const [alert, setAlert] = useState({ status: false, message: "", variant: "primary" });
  // const [pic, setPic] = useState("");
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user, shallowEqual);
  useEffect(() => {
    getContract().then(response => setlistContractVendor(response.data.data.items));
    getAllUser().then(response => setlistUser(response.data.data.items));
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
            <div className="col-lg-9 col-xl-8">
              <div className="input-group input-group-lg input-group-solid">
                <input
                  type="text"
                  readOnly
                  placeholder={
                    intl.formatMessage({
                      id: "TITLE.CREATE_ACCOUNT.NEW_ACCOUNT.USERNAME",
                    })
                  }
                  className={`form-control form-control-lg form-control-solid`}
                  name="username"
                  value={userSelected.username}
                />
                <div className="input-group-append">
                  <Button variant="secondary" onClick={() => setOpen(true)}>
                    Choose PM
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="form-group row">
            <label className="col-xl-3 col-lg-3 col-form-label">
              {/* <FormattedMessage id="TITLE.USER_PROFILE.PERSONAL_INFORMATION.INPUT.EMAIL_ADDRESS" /> */}
              Contract
              {/* <span className="text-danger">*</span> */}
            </label>
            <div className="col-lg-8 col-xl-8">
              <ListGroup variant="flush" className="overflow-auto max-340px">
                {listContractVendor.map((row, index) => (
                  <ListGroup.Item key={`${index}`}>
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" value="" id={`default-${index}`}></input>
                      <label className="form-check-label w-100" htmlFor={`default-${index}`}>
                        {index + 1}. {row.contract_name ? row.contract_name : 'kosong'} - {row.contract_no ? row.contract_no : 'kosong'} - {row.purch_order_no ? row.purch_order_no : 'kosong'} - {row.contract_status ? row.contract_status : 'kosong'}
                      </label>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
            <div className="col-lg-1 col-xl-1">
              <Button variant="success" className="float-right" onClick={() => setOpen2(true)}>
                Tambah
              </Button>
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
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={open} onHide={() => setOpen(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Modal heading
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Centered Modal</h4>
          <ListGroup variant="flush" className="overflow-auto max-340px">
            {listUser.map((row, index) => (
              <ListGroup.Item action onClick={() => setUserSelected({username: row.user.username})} key={`${index}`}>
                {index + 1}. {row.user.username} - {row.full_name}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setOpen(false)}>Close</Button>
          <Button onClick={() => setOpen(false)}>Submit</Button>
        </Modal.Footer>
      </Modal>
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={open2} onHide={() => setOpen2(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Modal heading
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Centered Modal</h4>
          <ListGroup variant="flush" className="overflow-auto max-340px">
            {listContractVendor.map((row, index) => (
              <ListGroup.Item key={`${index}`}>
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" value="" id={`default-cont-${index}`}></input>
                  <label className="form-check-label w-100" htmlFor={`default-cont-${index}`}>
                    {index + 1}. {row.contract_name ? row.contract_name : 'kosong'} - {row.contract_no ? row.contract_no : 'kosong'} - {row.purch_order_no ? row.purch_order_no : 'kosong'} - {row.contract_status ? row.contract_status : 'kosong'}
                  </label>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setOpen2(false)}>Close</Button>
          <Button onClick={() => setOpen2(false)}>Submit</Button>
        </Modal.Footer>
      </Modal>
    </form>
  );
}

export default injectIntl(connect(null, auth.actions)(UpdateAccount));
