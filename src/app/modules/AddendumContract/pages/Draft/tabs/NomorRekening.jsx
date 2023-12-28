import { Formik, Form } from "formik";
import { DEV_NODE } from "redux/BaseHost";
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
  isDisable,
  contract_id,
  dataNewClause,
  dataNewClauseDrafting,
  accountNumberBankData,
  is_add_account_number,
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
    jsonData?.data_bank?.length > 0 ? jsonData?.data_bank[bankIndex] : []
  );
  const submitFormParameterAccountNumber = (values) => {
    // console.log(values, "values");
    // let data_new = new FormData();
    // data_new.append("add_contract_id", contract_id);
    // data_new.append("data_bank", JSON.stringify(values.data_bank));
    // data_new.append("bank_statement_file", values.bank_statement_file);
    // data_new.append("body_clause_data", JSON.stringify(values.body_data));
    // data_new.append(
    //   "attachment_clause_data",
    //   JSON.stringify(values.attachment_data)
    // );
    // submitAccountNumber(data_new, contract_id);
    submitAccountNumber(
      {
        add_contract_id: contract_id,
        data_bank: values.data_bank,
        bank_statement_file: values.bank_statement_file,
        body_clause_data: values.body_data,
        attachment_clause_data: values.attachment_data,
      },
      contract_id
    );
    alert("Berhasil Update Data!");
  };

  useEffect(() => {
    if (add_contract_account_number?.attachment_clause_data !== null) {
      dispatch({
        type: actionTypes.SetDraftingClause,
        payload: add_contract_account_number?.attachment_clause_data || [
          {
            attachment_number: "",
            clause_note: "",
          },
        ],
        fieldType: "refill_attachment_clause_data",
        fromWhere: "account_number",
      });
    }
    if (add_contract_account_number?.body_clause_data !== null) {
      dispatch({
        type: actionTypes.SetDraftingClause,
        payload: add_contract_account_number?.body_clause_data || {
          clause_number: "",
          before_clause_note: "",
          after_clause_note: "",
        },
        fieldType: "refill_body_clause_data",
        fromWhere: "account_number",
      });
    }
  }, [add_contract_account_number]);

  return (
    <div className="bg-white p-10">
      <NewClause
        openCloseAddClause={openCloseAddClause}
        fromWhere={"account_number"}
        fieldType={"clause_attachment"}
        isDrafting={true}
      />
      <Formik
        enableReinitialize={true}
        initialValues={{
          data_bank: accountNumber,
          bank_statement_file:
            add_contract_account_number?.data_bank?.bank_statement_file,
          body_data: dataNewClauseDrafting?.account_number?.bodyClauseData,
          attachment_data:
            dataNewClauseDrafting?.account_number?.attachmentClauseData,
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
                              <span>Nama bank pertama</span>
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
                          disabled={isDisable}
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
                            add_contract_account_number?.data_bank
                              ?.account_holder_name
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
                        <span>Nama bank kedua</span>
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
                            add_contract_account_number?.data_bank?.bank
                              .full_name
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
                            add_contract_account_number?.data_bank?.address
                              ?.postal_address
                          }
                        />
                      </div>
                    </div>
                  </div>
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
                          color: "blue",
                          pointer: "cursor",
                        }}
                        onClick={() => {
                          if (
                            add_contract_account_number?.data_bank
                              ?.bank_statement_file
                          ) {
                            window.open(
                              `${DEV_NODE}/add_bank/${add_contract_account_number?.data_bank?.bank_statement_file}`,
                              "_blank"
                            );
                          }
                        }}
                      >
                        Download Surat pernyataan dari bank
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
                          disabled={isDisable}
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
                isDrafting={true}
                isDisable={!isDisable}
                title={"Nomor Rekening"}
                fromWhere={"account_number"}
                showAddClause={showAddClause}
              />

              <UpdateButton
                isDrafting={true}
                isDisable={isDisable}
                fromWhere={"account_number"}
              />
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
