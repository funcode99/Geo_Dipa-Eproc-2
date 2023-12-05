import React, { useState, useRef } from "react";
import { submitPaymentMethod } from "app/modules/AddendumContract/service/AddendumContractCrudService";
import { Formik, Field, FieldArray, Form, ErrorMessage } from "formik";
import UpdateButton from "app/components/button/ButtonGlobal/UpdateButton.jsx";
import PerubahanKlausulKontrak from "app/modules/AddendumContract/pages/ContractDetail/components/FormAddendum/Components/PerubahanKlausulKontrak";

const MetodePembayaran = ({ dataNewClause, contract_id, jsonData }) => {
  const openCloseAddPayment = useRef();
  const showAddPayment = () => {
    openCloseAddPayment.current.open();
  };
  const openCloseAddClause = useRef();
  const showAddClause = () => {
    openCloseAddClause.current.open();
  };
  const earlyStagePayment = {
    payment: JSON.parse(localStorage.getItem("payment_method")),
  };
  const [stagePayment, setStagePayment] = useState({
    payment: jsonData?.payment_method_data,
  });
  const changePaymentMethodField = (index, value, type) => {
    setStagePayment((state) => {
      let newArr = [...state.payment];
      if (type === "Percentage") newArr[index]["percentage"] = value;
      if (type === "Description") newArr[index]["value"] = value;
      return {
        ...state,
        payment: newArr,
      };
    });
  };
  const submitFormParameterPaymentMethod = (values) => {
    if (
      stagePayment?.payment.length < 1 &&
      values.payment_method === "gradually"
    ) {
      alert("Silahkan tambah tahap pembayaran anda");
    }
    submitPaymentMethod(
      {
        add_contract_id: localStorage.getItem("add_contract_id"),
        payment_method_name: values.payment_method,
        payment_method_data:
          values.payment_method === "gradually" ? values.payment_data : null,
        body_clause_data: values.body_data,
        attachment_clause_data: values.attachment_data,
      },
      contract_id
    );
  };
  const [addendumPaymentMethod, setAddendumPaymentMethod] = useState(
    jsonData?.payment_method
  );
  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        payment_method: addendumPaymentMethod,
        payment_data: stagePayment.payment,
        body_data: dataNewClause.payment_method.bodyClauseData,
        attachment_data: dataNewClause.payment_method.attachmentClauseData,
      }}
      onSubmit={(values) => {
        console.log("submit di metode pembayaran", values);
        submitFormParameterPaymentMethod(values);
      }}
    >
      {({ values }) => (
        <Form>
          <div
            style={{
              padding: 28,
              borderRadius: 14,
              border: 1,
              borderStyle: "solid",
              borderColor: "#8c8a8a",
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 40,
              columnGap: 100,
            }}
          >
            {/* Metode Pembayaran Kontrak Awal */}
            <div
              style={{
                flex: 1,
              }}
            >
              <h1
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                }}
              >
                Metode pembayaran kontrak awal
              </h1>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  rowGap: 14,
                  paddingTop: 14,
                }}
              >
                <label
                  style={{
                    display: "flex",
                    gap: 12,
                  }}
                >
                  <input
                    type="radio"
                    name="payment"
                    disabled
                    checked={jsonData?.payment_method === "full"}
                  />
                  Full Pembayaran
                </label>
                <label
                  style={{
                    display: "flex",
                    gap: 12,
                  }}
                >
                  <input
                    type="radio"
                    name="payment"
                    disabled
                    checked={jsonData?.payment_method === "gradually"}
                  />
                  Pembayaran Bertahap
                </label>
              </div>
              {earlyStagePayment &&
                earlyStagePayment?.payment?.map((item) => {
                  return (
                    <>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          columnGap: 10,
                          marginTop: 28,
                          marginBottom: 14,
                        }}
                      >
                        <p
                          style={{
                            paddingTop: 12,
                          }}
                        >
                          Tahap {item.payment}
                        </p>

                        <div
                          style={{
                            flex: 1,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                            }}
                          >
                            <Field
                              style={{
                                flex: 1,
                                padding: "10px 12px",
                                borderRadius: 4,
                              }}
                              type="text"
                              placeholder="Persentase"
                              value={item.percentage}
                              disabled
                            />
                          </div>
                          <div
                            style={{
                              marginTop: 14,
                              marginBottom: 28,
                              display: "flex",
                            }}
                          >
                            <Field
                              as="textarea"
                              style={{
                                flex: 1,
                                padding: "10px 12px",
                                borderRadius: 4,
                              }}
                              placeholder="Deskripsi"
                              value={item.value}
                              disabled
                            />
                            {/* </textarea> */}
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })}
            </div>

            {/* Addendum Metode Pembayaran */}
            <div
              style={{
                flex: 1,
              }}
            >
              <h1
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                }}
              >
                A. Addendum metode pembayaran
              </h1>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  rowGap: 14,
                  paddingTop: 14,
                }}
              >
                <label
                  style={{
                    display: "flex",
                    gap: 12,
                  }}
                >
                  <input
                    type="radio"
                    name="payment_addendum"
                    onClick={() => setAddendumPaymentMethod("full")}
                    checked={addendumPaymentMethod === "full"}
                  />
                  Full Pembayaran
                </label>
                <label
                  style={{
                    display: "flex",
                    gap: 12,
                    margin: 0,
                  }}
                >
                  <input
                    type="radio"
                    name="payment_addendum"
                    onClick={() => setAddendumPaymentMethod("gradually")}
                    checked={addendumPaymentMethod === "gradually"}
                  />
                  Pembayaran Bertahap
                </label>
              </div>
              {addendumPaymentMethod === "gradually" &&
                stagePayment?.payment?.map((item, index) => {
                  return (
                    <>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          columnGap: 10,
                          marginTop: 28,
                          marginBottom: 14,
                        }}
                      >
                        <div>
                          <p
                            style={{
                              paddingTop: 12,
                            }}
                          >
                            {/* Tahap {item.payment} */}
                            Tahap {index + 1}
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              setStagePayment((previous) => {
                                let data = { ...previous };
                                data.payment.splice(index, 1);
                                return data;
                              });
                            }}
                          >
                            Hapus
                          </button>
                        </div>
                        <div
                          style={{
                            flex: 1,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                            }}
                          >
                            <Field
                              style={{
                                flex: 1,
                                padding: "10px 12px",
                                borderRadius: 4,
                              }}
                              type="text"
                              placeholder="Persentase"
                              value={item.percentage}
                              onChange={(e) =>
                                changePaymentMethodField(
                                  index,
                                  e.target.value,
                                  "Percentage"
                                )
                              }
                              disabled={addendumPaymentMethod !== "gradually"}
                            />
                          </div>
                          <div
                            style={{
                              marginTop: 14,
                              marginBottom: 28,
                              display: "flex",
                            }}
                          >
                            <textarea
                              style={{
                                flex: 1,
                                padding: "10px 12px",
                                borderRadius: 4,
                              }}
                              placeholder="Deskripsi"
                              value={item.value}
                              onChange={(e) =>
                                changePaymentMethodField(
                                  index,
                                  e.target.value,
                                  "Description"
                                )
                              }
                              disabled={addendumPaymentMethod !== "gradually"}
                            ></textarea>
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })}
              {addendumPaymentMethod === "gradually" && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: 28,
                  }}
                >
                  <button
                    type="button"
                    className="btn btn-primary mx-1"
                    onClick={showAddPayment}
                  >
                    Tambah
                  </button>
                </div>
              )}
            </div>
          </div>

          <PerubahanKlausulKontrak
            subTitle={"B"}
            title={"Metode Pembayaran"}
            fromWhere={"payment_method"}
            showAddClause={showAddClause}
            values={values}
          />

          <UpdateButton fromWhere={"payment_method"} />
        </Form>
      )}
    </Formik>
  );
};

export default MetodePembayaran;
