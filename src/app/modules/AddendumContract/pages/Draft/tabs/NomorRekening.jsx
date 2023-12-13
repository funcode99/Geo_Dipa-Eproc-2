import React, { useState } from "react";
import { Formik, Form } from "formik";
import { ReactSelect } from "percobaan/ReactSelect";
import UpdateButton from "app/components/button/ButtonGlobal/UpdateButton.jsx";
import PerubahanKlausulKontrak from "app/modules/AddendumContract/pages/ContractDetail/components/FormAddendum/Components/PerubahanKlausulKontrak";
import { submitAccountNumber } from "app/modules/AddendumContract/service/AddendumContractCrudService";

const NomorRekening = ({
  jsonData,
  dataNewClause,
  contract_id,
  accountNumberBankData,
}) => {
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
    data_new.append("add_contract_id", localStorage.getItem("add_contract_id"));
    data_new.append("data_bank", JSON.stringify(values.data_bank));
    data_new.append("bank_statement_file", values.bank_statement_file);
    data_new.append("body_clause_data", JSON.stringify(values.body_data));
    data_new.append(
      "attachment_clause_data",
      JSON.stringify(values.attachment_data)
    );
    submitAccountNumber(data_new, contract_id);
  };
  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        data_bank: accountNumber,
        // wajib dipasang state
        bank_statement_file: "",
        body_data: dataNewClause.account_number.bodyClauseData,
        attachment_data: dataNewClause.account_number.attachmentClauseData,
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
                      {/* <input
                        style={{
                          width: "100%",
                          padding: "10px 12px 10px 46px",
                          color: "#3699ff",
                          borderColor: "black",
                          border: 1,
                          borderStyle: "solid",
                          borderRadius: 4,
                          fontSize: 14,
                          fontWeight: 500,
                          marginTop: 4,
                        }}
                        type="text"
                        value={`surat_pernyataan_bank_bca.pdf`}
                        disabled
                      />
                      <SVG
                        style={{
                          position: "absolute",
                          top: 0,
                          bottom: 0,
                          left: 12,
                          margin: "auto 0",
                        }}
                        src={toAbsoluteUrl(
                          "/media/svg/icons/All/upload.svg"
                        )}
                      /> */}
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
              title={"Nomor Rekening"}
              fromWhere={"account_number"}
              showAddClause={showAddClause}
              values={values}
              isDrafting={true}
            />

            <UpdateButton fromWhere={"account_number"} isDrafting={true} />
          </Form>
        );
      }}
    </Formik>
  );
};

export default NomorRekening;
