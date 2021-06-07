import React, { useState, useEffect, useRef, useCallback } from "react";
import { connect, shallowEqual, useSelector } from "react-redux";
import { rupiah } from "../../../../libs/currency";
import {
  // FormattedMessage,
  injectIntl,
} from "react-intl";
import {
  Card,
  CardBody,
  CardFooter,
} from "../../../../../_metronic/_partials/controls";
import {
  Table
} from "react-bootstrap";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
} from "@material-ui/core";
import Select2 from "react-select2-wrapper";
import "react-select2-wrapper/css/select2.css";
import {
  getPicContract,
  getPicVendor,
  checkEmail,
  updateEmail,
  requestUser,
  deleteUser,
  assignUser,
  getContractSummary,
  checkRole,
} from "../../_redux/InvoiceMonitoringCrud";
import useToast from "../../../../components/toast";
import { useFormik } from "formik";
import * as Yup from "yup";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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

  const [openModalEmail, setopenModalEmail] = useState(false);
  const [openModalDeletePIC, setOpenModalDeletePIC] = useState(false);
  const [picContractData, setPicContractData] = useState([]);
  const [picVendorData, setPicVendorData] = useState([]);
  const [editEmail, setEditEmail] = useState(false);
  const [emailAvailability, setEmailAvailability] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tempPic, setTempPic] = useState([]);
  const [contractData, setContractData] = useState({});
  const [role, setRole] = useState({});

  const [Toast, setToast] = useToast();
  const updateEmailRef = useRef(null);

  const user_id = useSelector(
    (state) => state.auth.user.data.user_id,
    shallowEqual
  );
  const vendor_id = useSelector(
    (state) => state.auth.user.data.vendor_id,
    shallowEqual
  );
  const contract_id = props.match.params.contract;

  const getPicContractData = useCallback(() => {
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
  }, [vendor_id, contract_id, intl, setToast]);

  const getPicVendorData = useCallback(() => {
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
  }, [vendor_id, intl, setToast]);

  const getRole = useCallback(() => {
    checkRole(user_id)
      .then((response) => {
        setRole(response.data.data);
      })
      .catch((error) => {
        if (
          error.response?.status !== 400 &&
          error.response?.data.message !== "TokenExpiredError"
        )
          setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 10000);
      });
  }, [user_id, intl, setToast]);

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
        getPicContractData()
        getPicVendorData()
        getRole()
      })
      .catch((error) => {
        if (
          error.response?.status !== 400 &&
          error.response?.data.message !== "TokenExpiredError"
        )
          setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 10000);
      });
  }, [getPicContractData, getPicVendorData, getRole, contract_id, intl, setToast]);

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

  const picUnselect = (e) => {
    var value = e.params.data.id;
    var temp = JSON.parse(JSON.stringify(picContractData));
    var index = temp.indexOf(value);
    temp.splice(index, 1);
    setPicContractData(temp);
  };

  const picSelect = (e) => {
    var value = e.params.data.id;
    var temp = [...picContractData, value];
    setPicContractData(temp);
  };

  const initialValuesUpdate = {
    email: "",
    id: "",
  };

  const initialValues = {
    email: "",
    user_id: user_id,
    vendor_id: vendor_id,
    monitoring_type: "INVOICE",
  };

  Yup.addMethod(Yup.string, "checkAvailabilityEmail", function (errorMessage) {
    return this.test(`test-card-length`, errorMessage, function (value) {
      const { path, createError } = this;
      return emailAvailability || createError({ path, message: errorMessage });
    });
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

  const UpdateSchema = Yup.object().shape({
    email: Yup.string()
      .required(
        intl.formatMessage({
          id: "AUTH.VALIDATION.REQUIRED_FIELD",
        })
      )
      .email(
        intl.formatMessage({
          id: "AUTH.VALIDATION.INVALID_EMAILS",
        })
      )
      .min(
        8,
        intl.formatMessage(
          {
            id: "AUTH.VALIDATION.MIN_LENGTH_FIELD",
          },
          { length: 8 }
        )
      )
      .max(
        50,
        intl.formatMessage(
          {
            id: "AUTH.VALIDATION.MAX_LENGTH_FIELD",
          },
          { length: 50 }
        )
      )
      .checkAvailabilityEmail(
        intl.formatMessage({
          id: "REQ.EMAIL_NOT_AVAILABLE",
        })
      ),
  });

  const NewSchema = Yup.object().shape({
    email: Yup.string()
      .required(
        intl.formatMessage({
          id: "AUTH.VALIDATION.REQUIRED_FIELD",
        })
      )
      .email(
        intl.formatMessage({
          id: "AUTH.VALIDATION.INVALID_EMAILS",
        })
      )
      .min(
        8,
        intl.formatMessage(
          {
            id: "AUTH.VALIDATION.MIN_LENGTH_FIELD",
          },
          { length: 8 }
        )
      )
      .max(
        50,
        intl.formatMessage(
          {
            id: "AUTH.VALIDATION.MAX_LENGTH_FIELD",
          },
          { length: 50 }
        )
      )
      .checkAvailabilityEmail(
        intl.formatMessage({
          id: "REQ.EMAIL_NOT_AVAILABLE",
        })
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

  const handleUpdate = (index) => {
    setEditEmail(true);
    formikUpdate.setValues({
      email: picVendorData[index].text,
      id: picVendorData[index].id,
      user_id: user_id,
      vendor_id: vendor_id,
      monitoring_type: "INVOICE",
    });
    updateEmailRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const submitUpdateEmail = () => {
    setLoading(true);
    updateEmail(formikUpdate.values)
      .then((response) => {
        if (response.data.message === "Data Not Found") {
          setToast(intl.formatMessage({ id: "REQ.NOT_FOUND" }), 10000);
        } else {
          setToast(
            intl.formatMessage({ id: "REQ.UPDATE_EMAIL_SUCCESS" }),
            10000
          );
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
          setToast(intl.formatMessage({ id: "REQ.UPDATE_FAILED" }), 10000);
        setLoading(false);
      });
  };

  const submitNewEmail = () => {
    setLoading(true);
    requestUser(formikNew.values)
      .then((response) => {
        formikNew.setValues({ email: "" });
        setToast(
          intl.formatMessage({ id: "REQ.REQUEST_ACCOUNT_SUCCESS" }),
          10000
        );
        getPicVendorData();
        setEmailAvailability(false);
        setLoading(false);
      })
      .catch((error) => {
        if (
          error.response?.status !== 400 &&
          error.response?.data.message !== "TokenExpiredError"
        )
          setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 10000);
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
        setToast(
          intl.formatMessage({ id: "REQ.DELETE_ACCOUNT_SUCCESS" }),
          10000
        );
        getPicVendorData();
        setLoading(false);
        setEditEmail(false);
      })
      .catch((error) => {
        if (
          error.response?.status !== 400 &&
          error.response?.data.message !== "TokenExpiredError"
        )
          setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 10000);
        setLoading(false);
        setOpenModalDeletePIC(false);
      });
  };

  const assignPic = () => {
    setLoading(true);
    var data = {
      contract_id: contract_id,
      data: picContractData,
      monitoring_type: "INVOICE",
      user_id: user_id,
    };
    assignUser(data)
      .then((response) => {
        setToast(
          intl.formatMessage({ id: "REQ.ASSIGN_ACCOUNT_SUCCESS" }),
          10000
        );
        setLoading(false);
      })
      .catch((error) => {
        if (
          error.response?.status !== 400 &&
          error.response?.data.message !== "TokenExpiredError"
        )
          setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 10000);
        setLoading(false);
      });
  };

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
            onClick={() => deletePic(tempPic.id)}
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
                        <span className="col-md">{item.text}</span>
                        <div className="col-md text-right-md">
                          <span>
                            Status:{" "}
                            <span
                              className={`font-weight-bold ${item.actives === "true"
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
                    disabled={!role.main_vendor}
                    multiple
                    defaultValue={picContractData}
                    data={picVendorData}
                    onUnselect={picUnselect}
                    onSelect={picSelect}
                    options={{
                      placeholder: "search by tags",
                    }}
                    className="form-control"
                  />
                  {role.main_vendor && (
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
                  )}
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
        </CardFooter>
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
                <Table className="table-bordered overflow-auto">
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
                </Table>
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
