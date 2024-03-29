import { Formik, Field, Form } from "formik";
import { connect, useDispatch } from "react-redux";
import React, { useState, useRef, useEffect } from "react";
import DialogGlobal from "app/components/modals/DialogGlobal";
import CurrencyInput from "react-currency-input-field";
import UpdateButton from "app/components/button/ButtonGlobal/UpdateButton.jsx";
import { actionTypes } from "app/modules/AddendumContract/_redux/addendumContractAction";
import { submitPaymentMethod } from "app/modules/AddendumContract/service/AddendumContractCrudService";
import PerubahanKlausulKontrak from "app/modules/AddendumContract/pages/ContractDetail/components/FormAddendum/Components/PerubahanKlausulKontrak";
import NewClause from "../../ContractDetail/components/FormAddendum/Components/Modal/NewClause";

const MetodePembayaran = ({
  jsonData,
  isDisable,
  dataContractById,
  contract_id,
  paymentMethodCurrent,
  dataNewClauseDrafting,
  add_contract_payment_method,
}) => {
  const dispatch = useDispatch();
  const [percentage, setPercentage] = useState(0);
  const [description, setDescription] = useState("");
  const openCloseAddPayment = useRef();
  const showAddPayment = () => {
    openCloseAddPayment.current.open();
  };
  const openCloseAddClause = useRef();
  const showAddClause = () => {
    openCloseAddClause.current.open();
  };
  const earlyStagePayment = dataContractById?.payment_method_data;
  const [stagePayment, setStagePayment] = useState({
    payment: paymentMethodCurrent?.payment_method_data,
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
      return false;
    }
    submitPaymentMethod(
      {
        add_contract_id: contract_id,
        payment_method_name: values.payment_method,
        payment_method_data:
          values.payment_method == "full" ? [] : values.payment_data,
        // payment_method_data:
        //   values.payment_method === "gradually" ? values.payment_data : null,
        body_clause_data: values.body_data,
        attachment_clause_data: values.attachment_data,
      },
      contract_id
    );
    alert("Berhasil Update Data!");
  };
  const [addendumPaymentMethod, setAddendumPaymentMethod] = useState(
    paymentMethodCurrent?.payment_method_name
  );

  useEffect(() => {
    if (add_contract_payment_method?.attachment_clause_data !== null) {
      dispatch({
        type: actionTypes.SetDraftingClause,
        payload: add_contract_payment_method?.attachment_clause_data || [
          {
            attachment_number: "",
            clause_note: "",
          },
        ],
        fieldType: "refill_attachment_clause_data",
        fromWhere: "payment_method",
      });
    }
    if (add_contract_payment_method?.body_clause_data !== null) {
      dispatch({
        type: actionTypes.SetDraftingClause,
        payload: add_contract_payment_method?.body_clause_data || {
          clause_number: "",
          before_clause_note: "",
          after_clause_note: "",
        },
        fieldType: "refill_body_clause_data",
        fromWhere: "payment_method",
      });
    }
  }, []);

  const createNewPaymentStage = (description, percentage_value, payment) => ({
    description,
    percentage_value,
    payment,
  });
  return (
    <div className="bg-white p-10">
      <DialogGlobal
        ref={openCloseAddPayment}
        isCancel={false}
        isSubmit={false}
        yesButton={false}
        noButton={false}
      >
        <Formik
          enableReinitialize
          initialValues={{
            percentage: percentage,
            description: description,
          }}
          onSubmit={(values) => {
            setStagePayment((data) => {
              return {
                ...data,
                payment: [
                  ...data.payment,
                  createNewPaymentStage(
                    values.description,
                    values.percentage,
                    data?.payment?.length + 1
                  ),
                ],
              };
            });
            setDescription("");
            openCloseAddPayment.current.close();
          }}
        >
          {(values) => {
            return (
              <Form>
                <div
                  style={{
                    padding: "0 17%",
                  }}
                >
                  <h1
                    style={{
                      marginBottom: 40,
                      fontSize: 16,
                      fontWeight: 600,
                      textAlign: "center",
                    }}
                  >
                    Tambah pembayaran bertahap
                  </h1>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 14,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                      }}
                    >
                      <span>Persentase</span>
                      <Field
                        name="percentage"
                        style={{
                          padding: 8,
                          borderRadius: 4,
                          border: 1,
                          borderStyle: "solid",
                          borderColor: "#8c8a8a",
                          opacity: 0.8,
                        }}
                        defaultValue={0}
                        decimalsLimit={0}
                        maxLength={3}
                        decimalSeparator=","
                        groupSeparator="."
                        component={CurrencyInput}
                        onValueChange={(value) => {
                          setPercentage(value);
                        }}
                      />
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                      }}
                    >
                      <span>Deskripsi</span>
                      <Field
                        style={{
                          padding: 8,
                          borderRadius: 4,
                          border: 1,
                          borderStyle: "solid",
                          borderColor: "#8c8a8a",
                          opacity: 0.8,
                        }}
                        name="description"
                        onChange={(e) => {
                          setDescription(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: 52,
                    padding: "0 7%",
                  }}
                >
                  <button type="submit" className="btn btn-primary">
                    Save
                  </button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </DialogGlobal>
      <NewClause
        openCloseAddClause={openCloseAddClause}
        fromWhere={"payment_method"}
        fieldType={"clause_attachment"}
        isDrafting={true}
      />
      <Formik
        enableReinitialize={true}
        initialValues={{
          payment_method: addendumPaymentMethod,
          payment_data:
            addendumPaymentMethod == "full" ? [] : stagePayment?.payment,
          body_data: dataNewClauseDrafting?.payment_method?.bodyClauseData,
          attachment_data:
            dataNewClauseDrafting?.payment_method?.attachmentClauseData,
        }}
        onSubmit={(values) => {
          submitFormParameterPaymentMethod(values);
        }}
      >
        {(props) => {
          const { values } = props;
          return (
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
                    earlyStagePayment?.map((item) => {
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
                                  // value={item.payment}
                                  value=""
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
                        disabled={isDisable}
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
                        disabled={isDisable}
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
                                disabled={isDisable}
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
                                  disabled={
                                    addendumPaymentMethod !== "gradually" ||
                                    isDisable
                                  }
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
                                  disabled={
                                    addendumPaymentMethod !== "gradually" ||
                                    isDisable
                                  }
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
                        disabled={isDisable}
                      >
                        + Tambah
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <PerubahanKlausulKontrak
                subTitle={"B"}
                values={values}
                isDrafting={true}
                isDisable={!isDisable}
                title={"Metode Pembayaran"}
                fromWhere={"payment_method"}
                showAddClause={showAddClause}
              />

              <UpdateButton
                fromWhere={"payment_method"}
                isDrafting={true}
                isDisable={isDisable}
              />
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

// export default MetodePembayaran;
const mapState = (state) => ({
  dataNewClauseDrafting: state.addendumContract.dataNewClauseDrafting,
});

export default connect(mapState, null)(MetodePembayaran);
