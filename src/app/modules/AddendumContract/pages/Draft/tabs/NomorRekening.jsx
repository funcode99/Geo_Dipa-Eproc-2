import { Formik, Form } from "formik";
import { connect, useDispatch } from "react-redux";
import React, { useState, useEffect } from "react";
import { ReactSelect } from "percobaan/ReactSelect";
import UpdateButton from "app/components/button/ButtonGlobal/UpdateButton.jsx";
import { actionTypes } from "app/modules/AddendumContract/_redux/addendumContractAction";
import PerubahanKlausulKontrak from "app/modules/AddendumContract/pages/ContractDetail/components/FormAddendum/Components/PerubahanKlausulKontrak";
import NewClause from "../../../pages/ContractDetail/components/FormAddendum/Components/Modal/NewClause";
import { submitAccountNumber } from "app/modules/AddendumContract/service/AddendumContractCrudService";

const NomorRekening = ({
  jsonData,
  contract_id,
  dataNewClause,
  dataNewClauseDrafting,
  accountNumberBankData,
  add_contract_account_number,
}) => {
  const dispatch = useDispatch();
  const openCloseAddClause = React.useRef();
  const showAddClause = () => {
    openCloseAddClause.current.open();
  };
  const [bankIndex, setBankIndex] = useState(0);
  const changeDataBankIndex = (num) => {
    setBankIndex(num);
    setAccountNumber(jsonData?.data_bank[num]);
  };
  const [accountNumber, setAccountNumber] = useState(
    jsonData?.data_bank[bankIndex]
  );
  const submitFormParameterAccountNumber = (values) => {
    let data_new = new FormData();
    data_new.append("add_contract_id", contract_id);
    data_new.append("data_bank", JSON.stringify(values.data_bank));
    data_new.append("bank_statement_file", values.bank_statement_file);
    data_new.append("body_clause_data", JSON.stringify(values.body_data));
    data_new.append(
      "attachment_clause_data",
      JSON.stringify(values.attachment_data)
    );
    submitAccountNumber(data_new, contract_id);
    alert("Berhasil Update Data!");
  };

  useEffect(() => {
    if (add_contract_account_number.attachment_clause_data !== null) {
      dispatch({
        type: actionTypes.SetDraftingClause,
        payload: add_contract_account_number.attachment_clause_data || null,
        fieldType: "refill_attachment_clause_data",
        fromWhere: "account_number",
      });
    }
    if (add_contract_account_number.body_clause_data !== null) {
      dispatch({
        type: actionTypes.SetDraftingClause,
        payload: add_contract_account_number.body_clause_data || null,
        fieldType: "refill_body_clause_data",
        fromWhere: "account_number",
      });
    }
  }, []);
  return (
    <div className="bg-white p-10">
      {/* <NewClause
        fromWhere={"account_number"}
        fieldType={"clause_attachment"}
        openCloseAddClause={openCloseAddClause}
      /> */}
      <Formik
        enableReinitialize={true}
        initialValues={{
          data_bank: accountNumber,
          bank_statement_file: "",
          body_data: dataNewClauseDrafting.account_number.bodyClauseData,
          attachment_data:
            dataNewClauseDrafting.account_number.attachmentClauseData,
        }}
        onSubmit={(values) => {
          submitFormParameterAccountNumber(values);
        }}
      >
        {(props) => {
          const { values, setFieldValue } = props;
          return (
            <Form>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                  border: 1,
                  borderColor: "black",
                  borderStyle: "solid",
                  padding: 28,
                  borderRadius: 14,
                  marginBottom: 40,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    rowGap: 24,
                  }}
                >
                  <div>
                    <h1
                      style={{
                        fontSize: 16,
                        fontWeight: 600,
                        marginBottom: 14,
                      }}
                    >
                      Nomor rekening kontrak awal
                    </h1>

                    {accountNumberBankData &&
                      accountNumberBankData.map((item) => {
                        return (
                          <div
                            style={{
                              // display: 'grid',
                              // gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                              display: "flex",
                              flexWrap: "wrap",
                              gap: 24,
                              fontSize: 14,
                              fontWeight: 500,
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                flex: 1,
                              }}
                            >
                              <span>Nomor rekening</span>
                              <input
                                type="text"
                                style={{
                                  width: "100%",
                                  backgroundColor: "#e8f4fb",
                                  padding: "10px 12px",
                                  borderColor: "black",
                                  border: 1,
                                  borderStyle: "solid",
                                  borderRadius: 4,
                                  fontSize: 14,
                                  fontWeight: 500,
                                  marginTop: 4,
                                }}
                                disabled
                                value={item?.account_number}
                              />
                            </div>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                flex: 1,
                              }}
                            >
                              <span>Nama rekening</span>
                              <input
                                type="text"
                                style={{
                                  width: "100%",
                                  backgroundColor: "#e8f4fb",
                                  padding: "10px 12px",
                                  borderColor: "black",
                                  border: 1,
                                  borderStyle: "solid",
                                  borderRadius: 4,
                                  fontSize: 14,
                                  fontWeight: 500,
                                  marginTop: 4,
                                }}
                                disabled
                                value={item?.account_holder_name}
                              />
                            </div>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                flex: 1,
                              }}
                            >
                              <span>Nama bank</span>
                              <input
                                type="text"
                                style={{
                                  width: "100%",
                                  backgroundColor: "#e8f4fb",
                                  padding: "10px 12px",
                                  borderColor: "black",
                                  border: 1,
                                  borderStyle: "solid",
                                  borderRadius: 4,
                                  fontSize: 14,
                                  fontWeight: 500,
                                  marginTop: 4,
                                }}
                                disabled
                                value={item?.bank?.full_name}
                              />
                            </div>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                flex: 1,
                              }}
                            >
                              <span>Alamat bank</span>
                              <input
                                type="text"
                                style={{
                                  width: "100%",
                                  backgroundColor: "#e8f4fb",
                                  padding: "10px 12px",
                                  borderColor: "black",
                                  border: 1,
                                  borderStyle: "solid",
                                  borderRadius: 4,
                                  fontSize: 14,
                                  fontWeight: 500,
                                  marginTop: 4,
                                }}
                                disabled
                                value={item?.address?.postal_address}
                              />
                            </div>
                          </div>
                        );
                      })}
                  </div>

                  <div>
                    <h1
                      style={{
                        fontSize: 16,
                        fontWeight: 600,
                        marginBottom: 14,
                      }}
                    >
                      A. Addendum nomor rekening
                    </h1>

                    <div
                      style={{
                        // display: 'grid',
                        // gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 24,
                        fontSize: 14,
                        fontWeight: 500,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          flex: 1,
                        }}
                      >
                        <span>Nomor rekening</span>
                        <ReactSelect
                          data={jsonData?.data_bank}
                          func={changeDataBankIndex}
                          labelName={`account_number`}
                        />
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          flex: 1,
                        }}
                      >
                        <span>Nama rekening</span>
                        <input
                          type="text"
                          style={{
                            width: "100%",
                            padding: "10px 12px",
                            borderColor: "black",
                            border: 1,
                            borderStyle: "solid",
                            borderRadius: 4,
                            fontSize: 14,
                            fontWeight: 500,
                            marginTop: 4,
                          }}
                          disabled
                          value={
                            jsonData?.data_bank[bankIndex]?.account_holder_name
                          }
                        />
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          flex: 1,
                        }}
                      >
                        <span>Nama bank</span>
                        <input
                          type="text"
                          style={{
                            width: "100%",
                            padding: "10px 12px",
                            borderColor: "black",
                            border: 1,
                            borderStyle: "solid",
                            borderRadius: 4,
                            fontSize: 14,
                            fontWeight: 500,
                            marginTop: 4,
                          }}
                          disabled
                          value={jsonData?.data_bank[bankIndex]?.bank.full_name}
                        />
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          flex: 1,
                        }}
                      >
                        <span>Alamat bank</span>
                        <input
                          type="text"
                          style={{
                            width: "100%",
                            padding: "10px 12px",
                            borderColor: "black",
                            border: 1,
                            borderStyle: "solid",
                            borderRadius: 4,
                            fontSize: 14,
                            fontWeight: 500,
                            marginTop: 4,
                          }}
                          disabled
                          value={
                            jsonData?.data_bank[bankIndex]?.address
                              ?.postal_address
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* surat pernyataan dari bank */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                      gap: 24,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 14,
                          fontWeight: 500,
                        }}
                      >
                        Surat pernyataan dari bank
                      </span>
                      <div
                        style={{
                          position: "relative",
                          padding: 0,
                          margin: 0,
                        }}
                      >
                        <input
                          type="file"
                          style={{
                            border: 1,
                            borderColor: "black",
                            borderStyle: "solid",
                            borderRadius: 4,
                            padding: 8,
                            width: "100%",
                          }}
                          onChange={(event) => {
                            setFieldValue(
                              "bank_statement_file",
                              event.target.files[0]
                            );
                          }}
                        />
                      </div>
                    </div>
                    <div></div>
                  </div>
                </div>
              </div>

              <PerubahanKlausulKontrak
                subTitle={"B"}
                values={values}
                isDisable={true}
                isDrafting={true}
                title={"Nomor Rekening"}
                fromWhere={"account_number"}
                showAddClause={showAddClause}
              />

              <UpdateButton fromWhere={"account_number"} isDrafting={true} />
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

// export default NomorRekening;
const mapState = (state) => ({
  dataNewClauseDrafting: state.addendumContract.dataNewClauseDrafting,
});

export default connect(mapState, null)(NomorRekening);
