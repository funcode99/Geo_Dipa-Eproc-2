import React, { useState, useEffect, useCallback, useRef } from "react";
import { Form, Row, Col, Container } from "react-bootstrap";
import { FormattedMessage } from "react-intl";
import { rupiah } from "../../../../../../libs/currency";
import { useSelector, shallowEqual, connect } from "react-redux";
import StyledSelect from "../../../../../../components/select-multiple";
import {
  getPicContract,
  getPicVendor,
  assignUser,
  checkEmail,
  updateEmail,
  requestUser,
  deleteUser,
} from "../../../../../InvoiceMonitoring/_redux/InvoiceMonitoringCrud";
import useToast from "../../../../../../components/toast";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
} from "@material-ui/core";
import * as Yup from "yup";
import { useFormik } from "formik";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const FormDetail = (props) => {
  // const dataLama = useSelector((state) => state.deliveryMonitoring.dataContractById);
  // const user_id = useSelector(
  //   (state) => state.auth.user.data.user_id,
  //   shallowEqual
  //   );
  const {user_id, dataLama} = props
    const dataContractById = React.useMemo(() => ({...dataLama}) , [dataLama])

  console.log(`dataContractById`, dataContractById)

  const contract_id = props.contractId;
  const monitoring_type = "DELIVERY";
  const vendor_id = dataContractById?.vendor?.id;

  const [Toast, setToast] = useToast();
  const [picVendorData, setPicVendorData] = useState([]);
  const [picContractData, setPicContractData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
  const [emailAvailability, setEmailAvailability] = useState(false);
  const [openModalEmail, setopenModalEmail] = useState(false);
  const [openModalDeletePIC, setOpenModalDeletePIC] = useState(false);
  const [tempPic, setTempPic] = useState([]);


  const updateEmailRef = useRef(null);

  const initialValuesUpdate = {
    email: "",
    id: "",
  };

  const initialValues = {
    email: "",
    user_id: user_id,
    vendor_id: vendor_id,
    monitoring_type: monitoring_type,
  };

  Yup.addMethod(Yup.string, "checkAvailabilityEmail", function(errorMessage) {
    return this.test(`test-card-length`, errorMessage, function(value) {
      const { path, createError } = this;
      return emailAvailability || createError({ path, message: errorMessage });
    });
  });

  const UpdateSchema = Yup.object().shape({
    email: Yup.string()
      .required(<FormattedMessage id="AUTH.VALIDATION.REQUIRED_FIELD" />)
      .email(<FormattedMessage id="AUTH.VALIDATION.INVALID_EMAILS" />)
      .min(
        8,
        <FormattedMessage
          id="AUTH.VALIDATION.MIN_LENGTH_FIELD"
          values={{ length: 8 }}
        />
      )
      .max(
        50,
        <FormattedMessage
          id="AUTH.VALIDATION.MIN_LENGTH_FIELD"
          values={{ length: 50 }}
        />
      )
      .checkAvailabilityEmail(
        <FormattedMessage id="REQ.EMAIL_NOT_AVAILABLE" />
      ),
  });

  const NewSchema = Yup.object().shape({
    email: Yup.string()
      .required(<FormattedMessage id="AUTH.VALIDATION.REQUIRED_FIELD" />)
      .email(<FormattedMessage id="AUTH.VALIDATION.INVALID_EMAILS" />)
      .min(
        8,
        <FormattedMessage
          id="AUTH.VALIDATION.MIN_LENGTH_FIELD"
          values={{ length: 8 }}
        />
      )
      .max(
        50,
        <FormattedMessage
          id="AUTH.VALIDATION.MIN_LENGTH_FIELD"
          values={{ length: 50 }}
        />
      )
      .checkAvailabilityEmail(
        <FormattedMessage id="REQ.EMAIL_NOT_AVAILABLE" />
      ),
  });

  const formikUpdate = useFormik({
    initialValues: initialValuesUpdate,
    validationSchema: UpdateSchema,
  });

  const formikNew = useFormik({
    initialValues,
    validationSchema: NewSchema,
  });

  const check_email = () => {
    if (formikUpdate.values.email.length > 3) {
      checkEmail(formikUpdate.values.email)
        .then(({ data: { data } }) => {
          setEmailAvailability(data.check);
        })
        .catch((error) => {
          setEmailAvailability(false);
        });
    } else if (formikNew.values.email.length > 3) {
      checkEmail(formikNew.values.email)
        .then(({ data: { data } }) => {
          setEmailAvailability(data.check);
        })
        .catch((error) => {
          setEmailAvailability(false);
        });
    }
  };

  const getPicContractData = useCallback(() => {
    getPicContract({
      id: contract_id,
      vendor_id: vendor_id,
      monitoring_type: monitoring_type,
    })
      .then((response) => {
        setPicContractData(response.data.data);
      })
      .catch((error) => {
        // setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 10000);
      });
  }, [contract_id, setToast]);

  const getPicVendorData = useCallback(() => {
    getPicVendor(vendor_id)
      .then((response) => {
        setPicVendorData(response.data.data);
      })
      .catch((error) => {});
  }, [setToast]);

  const assignPic = () => {
    setLoading(true);
    var data = {
      contract_id: contract_id,
      data: picContractData,
      monitoring_type: monitoring_type,
      user_id: user_id,
    };
    assignUser(data)
      .then((response) => {
        setToast(<FormattedMessage id="REQ.ASSIGN_ACCOUNT_SUCCESS" />);
        setLoading(false);
      })
      .catch((error) => {
        if (
          error.response?.status !== 400 &&
          error.response?.data.message !== "TokenExpiredError"
        )
          setToast(<FormattedMessage id="REQ.REQUEST_FAILED" />, 10000);
        setLoading(false);
      });
  };

  const handleUpdate = (index) => {
    setEditEmail(true);
    formikUpdate.setValues({
      email: picVendorData[index].label,
      id: picVendorData[index].value,
      user_id: user_id,
      vendor_id: vendor_id,
      monitoring_type: monitoring_type,
    });
    updateEmailRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const submitUpdateEmail = () => {
    setLoading(true);
    updateEmail(formikUpdate.values)
      .then((response) => {
        if (response.data.message === "Data Not Found") {
          setToast(<FormattedMessage id="REQ.NOT_FOUND" />, 10000);
        } else {
          setToast(<FormattedMessage id="REQ.UPDATE_EMAIL_SUCCESS" />, 10000);
          getPicVendorData();
          setEditEmail(false);
          setEmailAvailability(false);
        }
        setLoading(false);
      })
      .catch((error) => {
        if (
          error.response?.status !== 400 &&
          error.response?.data.message !== "TokenExpiredError"
        )
          setToast(<FormattedMessage id="REQ.UPDATE_FAILED" />, 10000);
        setLoading(false);
      });
  };

  const submitNewEmail = () => {
    setLoading(true);
    requestUser(formikNew.values)
      .then((response) => {
        formikNew.setValues({ email: "" });
        setToast(<FormattedMessage id="REQ.REQUEST_ACCOUNT_SUCCESS" />, 10000);
        getPicVendorData();
        setEmailAvailability(false);
        setLoading(false);
      })
      .catch((error) => {
        if (
          error.response?.status !== 400 &&
          error.response?.data.message !== "TokenExpiredError"
        )
          setToast(<FormattedMessage id="REQ.REQUEST_FAILED" />, 10000);
        setLoading(false);
      });
  };

  const openDeletePIC = (index) => {
    setOpenModalDeletePIC(true);
    setTempPic(picVendorData[index]);
  };

  const deletePic = (id) => {
    setLoading(true);
    deleteUser({ users_pic_id: id })
      .then((response) => {
        setOpenModalDeletePIC(false);
        setToast(<FormattedMessage id="REQ.DELETE_ACCOUNT_SUCCESS" />, 10000);
        getPicVendorData();
        setLoading(false);
        setEditEmail(false);
      })
      .catch((error) => {
        if (
          error.response?.status !== 400 &&
          error.response?.data.message !== "TokenExpiredError"
        )
          setToast(<FormattedMessage id="REQ.REQUEST_FAILED" />, 10000);
        setLoading(false);
        setOpenModalDeletePIC(false);
      });
  };

  const handlePic = (e) => {
    setPicContractData(e);
  };

  useEffect(getPicContractData, []);
  useEffect(getPicVendorData, []);

  return (
    <React.Fragment>
      <Toast />
      <Dialog
        open={openModalDeletePIC}
        TransitionComponent={Transition}
        keepMounted
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        maxWidth="xs"
        fullWidth={true}
        style={{ zIndex: "1301" }}
      >
        <DialogTitle id="alert-dialog-slide-title">Batalkan PIC</DialogTitle>
        <DialogContent>
          Apakah anda akan membatalkan PIC dengan Email{" "}
          <span className="text-danger">{tempPic.text}</span> ?
        </DialogContent>
        <DialogActions>
          <button
            className="btn btn-secondary"
            onClick={() => {
              setOpenModalDeletePIC(false);
            }}
            disabled={loading}
          >
            Kembali
          </button>
          <button
            className="btn btn-danger"
            disabled={loading}
            onClick={() => deletePic(tempPic.value)}
          >
            Batalkan
            {loading && (
              <span
                className="spinner-border spinner-border-sm ml-1"
                aria-hidden="true"
              ></span>
            )}
          </button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openModalEmail}
        TransitionComponent={Transition}
        keepMounted
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        maxWidth="sm"
        fullWidth={true}
      >
        <DialogTitle id="alert-dialog-slide-title">
          Daftar Email PIC / {editEmail ? "Ubah" : "Tambah"}
        </DialogTitle>
        <DialogContent>
          <div ref={updateEmailRef}>
            {!editEmail && (
              <div className="form-group row">
                <label className="col-sm-2 col-form-label">Email</label>
                <div className="input-group col-sm-10">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email"
                    onKeyUp={check_email}
                    {...formikNew.getFieldProps("email")}
                  />
                  <div className="input-group-append">
                    <button
                      type="button"
                      className="btn btn-primary rounded-right"
                      disabled={
                        loading ||
                        !emailAvailability ||
                        (formikNew.touched.email && formikNew.errors.email)
                      }
                      onClick={submitNewEmail}
                    >
                      Simpan
                      {loading && (
                        <span
                          className="spinner-border spinner-border-sm ml-1"
                          aria-hidden="true"
                        ></span>
                      )}
                    </button>
                  </div>
                  {formikNew.touched.email && formikNew.errors.email ? (
                    <div className="invalid-feedback display-block">
                      {formikNew.errors.email}
                    </div>
                  ) : null}
                </div>
              </div>
            )}
            {editEmail && (
              <div className="form-group row">
                <label className="col-sm-2 col-form-label">Email</label>
                <div className="input-group col-sm-10">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email"
                    onKeyUp={check_email}
                    {...formikUpdate.getFieldProps("email")}
                    disabled={loading}
                  />
                  <div className="input-group-append">
                    {/* <span className="input-group-text bg-danger text-white pointer" onClick={() => setEditEmail(false)}> */}
                    <button
                      type="button"
                      className="btn btn-danger rounded-0"
                      onClick={() => {
                        setEditEmail(false);
                        formikUpdate.setValues({ email: "" });
                      }}
                      disabled={loading}
                    >
                      Batal
                    </button>
                    {/* </span> */}
                  </div>
                  <div className="input-group-append ml-0">
                    <button
                      type="button"
                      className="btn btn-primary rounded-right"
                      onClick={submitUpdateEmail}
                      disabled={
                        loading ||
                        !emailAvailability ||
                        (formikUpdate.touched.email &&
                          formikUpdate.errors.email)
                      }
                    >
                      Ubah
                      {loading && (
                        <span
                          className="spinner-border spinner-border-sm ml-1"
                          aria-hidden="true"
                        ></span>
                      )}
                    </button>
                  </div>
                  {(formikUpdate.touched.email && formikUpdate.errors.email) ||
                  !emailAvailability ? (
                    <div className="invalid-feedback display-block">
                      {formikUpdate.errors.email}
                    </div>
                  ) : null}
                </div>
              </div>
            )}
            <div className="form-group">
              <label>Register:</label>
              <ul className="list-group">
                {picVendorData.map((item, index) => {
                  return (
                    <li className="list-group-item" key={index.toString()}>
                      <div className="row">
                        <span className="col-md">{item.label}</span>
                        <div className="col-md text-right-md">
                          <span>
                            Status:{" "}
                            <span
                              className={`font-weight-bold ${
                                item.actives === "true"
                                  ? "text-primary"
                                  : "text-danger"
                              }`}
                            >
                              {item.actives === "true"
                                ? "Terverifikasi"
                                : "Belum Verifikasi"}
                            </span>
                          </span>
                          {item.actives === "false" && (
                            <span>
                              <button
                                className="btn p-0 ml-2"
                                type="button"
                                onClick={() => handleUpdate(index)}
                                disabled={loading}
                              >
                                <i className="fas fa-edit text-success pointer"></i>
                              </button>
                              <button
                                className="btn p-0 ml-2"
                                type="button"
                                onClick={() => openDeletePIC(index)}
                                disabled={loading}
                              >
                                <i className="far fa-trash-alt text-danger pointer"></i>
                              </button>
                            </span>
                          )}
                          {/* <span className="ml-2"><i className="fas fa-edit text-success pointer"></i></span> */}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setopenModalEmail(false);
            }}
          >
            OK
          </button>
        </DialogActions>
      </Dialog>
      <Form className="my-3">
        <Container>
          <Row>
            <Col>
              <Form.Group as={Row}>
                <Form.Label column md="4">
                  <FormattedMessage id="CONTRACT_DETAIL.LABEL.CONTRACT_NUMBER" />
                </Form.Label>
                <Col sm="8">
                  <Form.Control
                    required
                    type="text"
                    placeholder="Nomor Kontrak"
                    defaultValue={dataContractById?.contract_no}
                    disabled
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Form.Label column md="4">
                  <FormattedMessage id="CONTRACT_DETAIL.LABEL.PROCUREMENT_TITLE" />
                </Form.Label>
                <Col md="8">
                  <Form.Control
                    required
                    type="text"
                    placeholder="Judul Pengadaan"
                    defaultValue={dataContractById?.contract_name}
                    disabled
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} controlId="validationCustom01">
                <Form.Label column sm="4">
                  <FormattedMessage id="CONTRACT_DETAIL.LABEL.AUTHORITY_GROUP" />
                </Form.Label>
                <Col md="8">
                  <Form.Control
                    required
                    type="text"
                    placeholder="Kewenangan"
                    defaultValue={dataContractById?.authority_group?.alias_name}
                    disabled
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} controlId="validationCustom02">
                <Form.Label column md="4">
                  <FormattedMessage id="CONTRACT_DETAIL.LABEL.USER_GROUP" />
                </Form.Label>
                <Col md="8">
                  <Form.Control
                    required
                    type="text"
                    placeholder="User"
                    defaultValue={dataContractById?.user_group?.alias_name}
                    disabled
                  />
                </Col>
              </Form.Group>
            </Col>

            <Col>
              <Form.Group as={Row}>
                <Form.Label column md="4">
                  <FormattedMessage id="CONTRACT_DETAIL.LABEL.PO_NUMBER" />
                </Form.Label>
                <Col sm="8">
                  <Form.Control
                    required
                    type="text"
                    placeholder="Nomor PO"
                    defaultValue={dataContractById?.purch_order_no}
                    disabled
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Form.Label column md="4">
                  <FormattedMessage id="CONTRACT_DETAIL.LABEL.PO_NAME" />
                </Form.Label>
                <Col md="8">
                  <Form.Control
                    required
                    type="text"
                    placeholder="Header Text PO"
                    defaultValue={dataContractById?.purch_order?.name}
                    disabled
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Form.Label column sm="4">
                  <FormattedMessage id="CONTRACT_DETAIL.LABEL.PRICE" />
                </Form.Label>
                <Col md="8">
                  <Form.Control
                    required
                    type="text"
                    placeholder="Harga Pekerjaan"
                    defaultValue={rupiah(
                      parseInt(dataContractById?.total_amount)
                    )}
                    disabled
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Form.Label column md="4">
                  <FormattedMessage id="CONTRACT_DETAIL.LABEL.VENDOR" />
                </Form.Label>
                <Col md="8">
                  <Form.Control
                    required
                    type="text"
                    placeholder="Penyedia"
                    defaultValue={dataContractById?.vendor?.party?.full_name}
                    disabled
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Form.Label column md="4">
                  PIC
                </Form.Label>
                <Col md="8" className="input-group">
                  <StyledSelect
                    options={picVendorData}
                    value={picContractData}
                    onChange={handlePic}
                  ></StyledSelect>
                  <div className="input-group-prepend">
                    <span
                      className="input-group-text pointer"
                      onClick={() => {
                        setopenModalEmail(true);
                      }}
                    >
                      <i className="fas fa-pencil-alt"></i>
                    </span>
                  </div>
                </Col>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col></Col>
            <Col>
              <button
                type="button"
                className="btn btn-primary mx-1 float-right"
                onClick={assignPic}
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
            </Col>
          </Row>
        </Container>
      </Form>
    </React.Fragment>
  );
};

const mapState = ({auth,deliveryMonitoring}) => ({
  user_id: auth.user.data.user_id,
  dataLama: deliveryMonitoring.dataContractById
})

export default React.memo(connect(mapState)(FormDetail), () => true);
// export default FormDetail
