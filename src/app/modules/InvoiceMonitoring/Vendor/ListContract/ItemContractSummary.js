import React, { useState, useEffect, useRef, useCallback } from "react";
import { connect, shallowEqual, useSelector } from "react-redux";
import { rupiah, formatCurrency } from "../../../../libs/currency";
import { FormattedMessage, injectIntl } from "react-intl";
import {
  Card,
  CardBody,
  CardFooter,
} from "../../../../../_metronic/_partials/controls";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
} from "@material-ui/core";
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
} from "app/modules/InvoiceMonitoring/_redux/InvoiceMonitoringCrud";
import useToast from "../../../../components/toast";
import { useFormik } from "formik";
import * as Yup from "yup";
import StyledSelect from "../../../../components/select-multiple";
import { TableRow, TableCell } from "@material-ui/core";
import TableOnly from "../../../../components/tableCustomV1/tableOnly";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function ItemContractSummary(props) {
  const { intl, getData } = props;
  // const [data] = useState([
  //   {
  //     name: "BAPP",
  //     status: "Approved",
  //     approvedBy: "Dian",
  //     date: "30 Jan 2021",
  //     nameDoc: "BAPP.pdf",
  //   },
  //   {
  //     name: "User Manual",
  //     status: "Approved",
  //     approvedBy: "Dian",
  //     date: "30 Jan 2021",
  //     nameDoc: "BAPP.pdf",
  //   },
  //   {
  //     name: "Timesheet",
  //     status: "Waiting",
  //     approvedBy: null,
  //     date: null,
  //     nameDoc: null,
  //   },
  //   {
  //     name: "Invoice",
  //     status: "Waiting",
  //     approvedBy: null,
  //     date: null,
  //     nameDoc: null,
  //   },
  //   {
  //     name: "Faktur Pajak",
  //     status: "Waiting",
  //     approvedBy: null,
  //     date: null,
  //     nameDoc: null,
  //   },
  //   {
  //     name: "Surat Permohonan Pajak",
  //     status: "Waiting",
  //     approvedBy: null,
  //     date: null,
  //     nameDoc: null,
  //   },
  //   {
  //     name: "Kuitansi",
  //     status: "Waiting",
  //     approvedBy: null,
  //     date: null,
  //     nameDoc: null,
  //   },
  // ]);

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
  const [currencyCode, setCurrencyCode] = useState(null);

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
  const termin = props.match.params.termin;
  const monitoring_type = "INVOICE";

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
    getContractSummary(contract_id, termin)
      .then((response) => {

        // response["data"]["data"]["contract_value"] = rupiah(
        //   response["data"]["data"]["contract_value"]
        // );
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
        response["data"]["data"]["full_address_party_2"] = `${
          response["data"]["data"]["data"]["address"]["postal_address"]
            ? response["data"]["data"]["data"]["address"]["postal_address"]
            : null
        } ${
          response["data"]["data"]["data"]["address"]["sub_district"]
            ? response["data"]["data"]["data"]["address"]["sub_district"][
                "name"
              ]
            : null
        } ${
          response["data"]["data"]["data"]["address"]["district"]
            ? response["data"]["data"]["data"]["address"]["district"]["name"]
            : null
        } ${
          response["data"]["data"]["data"]["address"]["province"]
            ? response["data"]["data"]["data"]["address"]["province"]["name"]
            : null
        } ${
          response["data"]["data"]["data"]["address"]["postal_code"]
            ? response["data"]["data"]["data"]["address"]["postal_code"]
            : null
        }`;
        response["data"]["data"]["full_data_party_2"] = `${
          response["data"]["data"]["full_name"]
        } \n\n${response["data"]["data"]["full_address_party_2"]} \n${
          response["data"]["data"]["data"]["phone_number"]["number"]
        } ${
          response["data"]["data"]["data"]["phone_number"]["ext"]
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
        getPicContractData();
        getPicVendorData();
        getRole();
        getData(response.data.data);
        if(response?.data?.data?.currency_code) setCurrencyCode(response?.data?.data?.currency_code);
      })
      .catch((error) => {
        setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 10000);
      });
  }, [
    getPicContractData,
    getPicVendorData,
    getRole,
    contract_id,
    intl,
    setToast,
    getData,
  ]);

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

  const handlePic = (e) => {
    setPicContractData(e);
  };

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

  // fungsi submit nya disini
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

  useEffect(getContractData, []);

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
        
        <DialogTitle id="alert-dialog-slide-title">
          <FormattedMessage id="TITLE.SUMMARY.PIC.MODAL_DELETE.TITLE" />
        </DialogTitle>

        <DialogContent>
          <FormattedMessage id="TITLE.SUMMARY.PIC.MODAL_DELETE.BODY" />
          <span className="text-danger"> {tempPic.label}</span> ?
        </DialogContent>

        <DialogActions>
          <button
            className="btn btn-secondary"
            onClick={() => {
              setOpenModalDeletePIC(false);
            }}
            disabled={loading}
          >
            <FormattedMessage id="AUTH.GENERAL.BACK_BUTTON" />
          </button>
          <button
            className="btn btn-danger"
            disabled={loading}
            onClick={() => deletePic(tempPic.value)}
          >
            <FormattedMessage id="TITLE.SUMMARY.PIC.MODAL_DELETE.SUBMIT" />
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
          <FormattedMessage id="TITLE.SUMMARY.PIC.MODAL_EDIT.TITLE" />
          {editEmail ? (
            <FormattedMessage id="TITLE.SUMMARY.PIC.MODAL_EDIT.BREADCRUMB.UPDATE" />
          ) : (
            <FormattedMessage id="TITLE.SUMMARY.PIC.MODAL_EDIT.BREADCRUMB.NEW" />
          )}
        </DialogTitle>

        <DialogContent>
          <div ref={updateEmailRef}>
            {!editEmail && (
              <div className="form-group row">
                <label className="col-sm-2 col-form-label">
                  <FormattedMessage id="TITLE.EMAIL" />
                </label>
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
                      <FormattedMessage id="TITLE.SAVE" />
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
                      <FormattedMessage id="TITLE.CANCEL" />
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
                      <FormattedMessage id="TITLE.SUMMARY.PIC.MODAL_EDIT.BREADCRUMB.UPDATE" />
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
              <FormattedMessage id="TITLE.SUMMARY.PIC.MODAL_EDIT.BODY" />
              <ul className="list-group">
                {picVendorData.map((item, index) => {
                  return (
                    <li className="list-group-item" key={index.toString()}>
                      <div className="row">
                        <span className="col-md">{item.label}</span>
                        <div className="col-md text-right-md">
                          <span>
                            <FormattedMessage id="TITLE.SUMMARY.PIC.MODAL_EDIT.STATUS" />
                            <span
                              className={`font-weight-bold ${
                                item.actives === "true"
                                  ? "text-primary"
                                  : "text-danger"
                              }`}
                            >
                              {item.actives === "true" ? (
                                <FormattedMessage id="TITLE.SUMMARY.PIC.MODAL_EDIT.VERIFICATION_TRUE" />
                              ) : (
                                <FormattedMessage id="TITLE.SUMMARY.PIC.MODAL_EDIT.VERIFICATION_FALSE" />
                              )}
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
            className="btn btn-secondary"
            onClick={() => {
              setopenModalEmail(false);
            }}
          >
            <FormattedMessage id="AUTH.GENERAL.BACK_BUTTON" />
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
                <label
                  htmlFor="numberContract"
                  className="col-sm-4 col-form-label"
                >
                  <FormattedMessage id="CONTRACT_DETAIL.LABEL.PROCUREMENT_TITLE" />
                </label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    className="form-control"
                    id="numberContract"
                    defaultValue={contractData["contract_name"]}
                    disabled
                  />
                </div>
              </div>

              <div className="form-group row">
                <label
                  htmlFor="numberContract"
                  className="col-sm-4 col-form-label"
                >
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
                    defaultValue={formatCurrency(currencyCode, contractData?.contract_value)}
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
                <label htmlFor="priceStep1" className="col-sm-4 col-form-label">
                  <FormattedMessage
                    id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.TERMIN_VALUE"
                    values={{ termin: contractData["termin_name"] }}
                  />
                </label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    className="form-control"
                    id="priceStep1"
                    defaultValue={
                      contractData ? formatCurrency(currencyCode, contractData["termin_value"]) : null
                    }
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
                  coeg
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
                  {/* <StyledSelect
                    isDisabled={!role.main_vendor}
                    options={picVendorData}
                    value={picContractData}
                    onChange={handlePic}
                  ></StyledSelect> */}
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
            disabled={loading || picContractData.length === 0}
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

      {/* <Card className="mt-5">
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
      </Card> */}

    </React.Fragment>
  );
}
export default injectIntl(connect(null, null)(ItemContractSummary));
