import React, { useState, useEffect } from "react";
import { DEV_NODE } from "redux/BaseHost";
import { Formik, Field, Form } from "formik";
import { submitGuarantee } from "app/modules/AddendumContract/service/AddendumContractCrudService";
import UpdateButton from "app/components/button/ButtonGlobal/UpdateButton.jsx";
import PerubahanKlausulKontrak from "app/modules/AddendumContract/pages/ContractDetail/components/FormAddendum/Components/PerubahanKlausulKontrak";

const Jaminan = ({ dataNewClause, jsonData, contract_id }) => {
  const openCloseAddClause = React.useRef();
  const showAddClause = () => {
    openCloseAddClause.current.open();
  };
  const [inputDataGuarantee, setInputDataGuarantee] = useState({
    dp_guarantee: "0",
    dp_guarantee_start_date: "",
    dp_guarantee_end_date: "",
    dp_guarantee_evidence_file: "",
    implementation_guarantee: "0",
    implementation_guarantee_start_date: "",
    implementation_guarantee_end_date: "",
    implementation_guarantee_evidence_file: "",
    maintenance_guarantee: "0",
    maintenance_guarantee_start_date: "",
    maintenance_guarantee_end_date: "",
    maintenance_guarantee_evidence_file: "",
  });
  const [data, setData] = useState({});
  useEffect(() => {
    let mapResult = jsonData?.contract_guarantees.map((item) => {
      if (item.name === "implementation_guarantee") {
        setData((previous) => {
          return {
            ...previous,
            implementation_guarantee_evidence: item.file,
          };
        });
      }
    });
  }, [guaranteeBeforeAddendum]);
  const guaranteeBeforeAddendum = [
    {
      title: "Jaminan Uang Muka",
      startDate: "",
      endDate: "",
      filename: ``,
      radio: `${jsonData?.down_payment_guarantee}`,
      nameTitle: "dp_guarantee",
      nameStart: "dp_guarantee_start_date",
      nameEnd: "dp_guarantee_end_date",
      nameEvidence: "dp_guarantee_evidence_file",
    },
    {
      title: "Jaminan Pelaksanaan",
      startDate: "",
      endDate: "",
      filename: data?.implementation_guarantee_evidence,
      radio: `${jsonData?.implementation_guarantee}`,
      nameTitle: "implementation_guarantee",
      nameStart: "implementation_guarantee_start_date",
      nameEnd: "implementation_guarantee_end_date",
      nameEvidence: "implementation_guarantee_evidence_file",
    },
    {
      title: "Jaminan Pemeliharaan",
      startDate: "",
      endDate: "",
      filename: ``,
      radio: `${jsonData?.maintenance_guarantee}`,
      nameTitle: "maintenance_guarantee",
      nameStart: "maintenance_guarantee_start_date",
      nameEnd: "maintenance_guarantee_end_date",
      nameEvidence: "maintenance_guarantee_evidence_file",
    },
  ];
  const submitFormParameterGuarantee = (values) => {
    submitGuarantee(
      {
        add_contract_id: localStorage.getItem("add_contract_id"),
        down_payment_guarantee: values.dp_guarantee,
        down_payment_guarantee_start_date: values.dp_guarantee_start_date,
        down_payment_guarantee_end_date: values.dp_guarantee_end_date,
        down_payment_guarantee_evidence_file_name:
          values.dp_guarantee_evidence_file,
        implementation_guarantee: values.implementation_guarantee,
        implementation_guarantee_start_date:
          values.implementation_guarantee_start_date,
        implementation_guarantee_end_date:
          values.implementation_guarantee_end_date,
        implementation_guarantee_evidence_file_name:
          values.implementation_guarantee_evidence_file,
        maintenance_guarantee: values.maintenance_guarantee,
        maintenance_guarantee_start_date:
          values.maintenance_guarantee_start_date,
        maintenance_guarantee_end_date: values.maintenance_guarantee_end_date,
        maintenance_guarantee_evidence_file_name:
          values.maintenance_guarantee_evidence_file,
        body_clause_data: values.body_data,
        attachment_clause_data: values.attachment_data,
      },
      contract_id
    );
  };
  return (
    <div className="bg-white p-10">
      <Formik
        enableReinitialize={true}
        initialValues={{
          dp_guarantee: inputDataGuarantee.dp_guarantee,
          dp_guarantee_start_date: inputDataGuarantee.dp_guarantee_start_date,
          dp_guarantee_end_date: inputDataGuarantee.dp_guarantee_end_date,
          dp_guarantee_evidence_file:
            inputDataGuarantee.dp_guarantee_evidence_file,
          implementation_guarantee: inputDataGuarantee.implementation_guarantee,
          implementation_guarantee_start_date:
            inputDataGuarantee.implementation_guarantee_start_date,
          implementation_guarantee_end_date:
            inputDataGuarantee.implementation_guarantee_end_date,
          implementation_guarantee_evidence_file:
            inputDataGuarantee.implementation_guarantee_evidence_file,
          maintenance_guarantee: inputDataGuarantee.maintenance_guarantee,
          maintenance_guarantee_start_date:
            inputDataGuarantee.maintenance_guarantee_start_date,
          maintenance_guarantee_end_date:
            inputDataGuarantee.maintenance_guarantee_end_date,
          maintenance_guarantee_evidence_file:
            inputDataGuarantee.maintenance_guarantee_evidence_file,
          body_data: dataNewClause.guarantee.bodyClauseData,
          attachment_data: dataNewClause.guarantee.attachmentClauseData,
        }}
        onSubmit={(values) => {
          submitFormParameterGuarantee(values);
        }}
      >
        {(props) => {
          const { values } = props;
          return (
            <Form>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  rowGap: 28,
                  border: 1,
                  borderStyle: "solid",
                  borderColor: "black",
                  borderRadius: 14,
                  padding: 28,
                  marginBottom: 40,
                }}
              >
                {/* jaminan kontrak awal */}
                <div>
                  <span
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                    }}
                  >
                    Jaminan Kontrak Awal
                  </span>
                </div>

                {/* jaminan uang muka */}
                {guaranteeBeforeAddendum &&
                  guaranteeBeforeAddendum.map((data, index) => (
                    <>
                      <div>
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 30,
                            alignItems: "center",
                          }}
                        >
                          {/* jaminan uang muka */}
                          <p
                            style={{
                              width: 150,
                              margin: 0,
                            }}
                          >
                            {data.title}
                          </p>

                          {/* ya / tidak */}
                          {data.radio}
                          <div
                            style={{
                              display: "flex",
                              gap: 14,
                              alignItems: "center",
                            }}
                          >
                            <label
                              style={{
                                margin: 0,
                                display: "flex",
                                flexWrap: "wrap",
                                alignItems: "center",
                                columnGap: 8,
                              }}
                            >
                              <input
                                type="radio"
                                name={`${index}_down_payment_guarantee`}
                                checked={data.radio == "1"}
                              />
                              <span>Ya</span>
                            </label>

                            <label
                              style={{
                                margin: 0,
                                display: "flex",
                                flexWrap: "wrap",
                                alignItems: "center",
                                columnGap: 8,
                              }}
                            >
                              <input
                                type="radio"
                                name={`${index}_down_payment_guarantee`}
                                checked={data.radio == "0"}
                              />
                              <span>Tidak</span>
                            </label>
                          </div>
                        </div>

                        {/* tanggal mulai, selesai, evidence */}
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 20,
                            marginTop: 15,
                          }}
                        >
                          {/* tanggal mulai */}
                          <div className="col-sm-3">
                            <label
                              style={{
                                margin: 0,
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <span>Tanggal Mulai</span>
                              <input
                                type="date"
                                style={{
                                  borderRadius: 4,
                                  padding: "10px 12px",
                                  border: "none",
                                  display: "flex",
                                  flexDirection: "row-reverse",
                                  columnGap: 10,
                                }}
                                value={data.startDate}
                                disabled
                              />
                            </label>
                          </div>

                          {/* tanggal selesai */}
                          <div className="col-sm-3">
                            <label
                              style={{
                                margin: 0,
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <span>Tanggal Selesai</span>
                              <input
                                type="date"
                                style={{
                                  borderRadius: 4,
                                  padding: "10px 12px",
                                  border: "none",
                                  display: "flex",
                                  flexDirection: "row-reverse",
                                  columnGap: 10,
                                }}
                                value={data.endDate}
                                disabled
                              />
                            </label>
                          </div>

                          {/* evidence */}
                          <div
                            className="col-md-5"
                            style={{
                              padding: 0,
                            }}
                          >
                            <label
                              style={{
                                margin: 0,
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <span>Evidence</span>
                              <div>
                                <label
                                  htmlFor="upload"
                                  className={`input-group mb-3 col-sm-12 pointer`}
                                  style={{
                                    padding: 0,
                                  }}
                                >
                                  <span
                                    className={`form-control text-truncate`}
                                    style={{
                                      backgroundColor: "#e8f4fb",
                                    }}
                                    onClick={() =>
                                      window.open(
                                        `${DEV_NODE}/guarantee/${data.filename}`,
                                        "_blank"
                                      )
                                    }
                                  >
                                    {data.filename}
                                  </span>
                                  <div className="input-group-prepend">
                                    <span
                                      className="input-group-text"
                                      style={{
                                        backgroundColor: "#e8f4fb",
                                      }}
                                    >
                                      <i className="fas fa-file-upload"></i>
                                    </span>
                                  </div>
                                </label>
                                <input
                                  type="file"
                                  className="d-none"
                                  id="upload"
                                  style={{
                                    backgroundColor: "#E8F4FB",
                                  }}
                                  disabled
                                />
                              </div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </>
                  ))}

                {/* Addendum jaminan */}
                <div>
                  <span
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                    }}
                  >
                    A. Addendum Jaminan
                  </span>
                </div>

                {guaranteeBeforeAddendum &&
                  guaranteeBeforeAddendum.map((data, index) => (
                    <>
                      <div>
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 30,
                            alignItems: "center",
                          }}
                        >
                          {/* jaminan uang muka */}
                          <p
                            style={{
                              width: 150,
                              margin: 0,
                            }}
                          >
                            {data.title}
                          </p>

                          {/* ya / tidak */}
                          <div
                            style={{
                              display: "flex",
                              gap: 14,
                              alignItems: "center",
                            }}
                          >
                            <label
                              style={{
                                margin: 0,
                                display: "flex",
                                flexWrap: "wrap",
                                alignItems: "center",
                                columnGap: 8,
                              }}
                            >
                              <Field
                                type="radio"
                                value="1"
                                name={data.nameTitle}
                                onChange={(e) => {
                                  setInputDataGuarantee((state) => {
                                    console.log(
                                      "masuk update guarantee",
                                      data.nameTitle
                                    );
                                    let fieldName = data.nameTitle;
                                    let a = { ...state };
                                    a[fieldName] = e.target.value;
                                    return a;
                                  });
                                }}
                              />
                              <span>Ya</span>
                            </label>

                            <label
                              style={{
                                margin: 0,
                                display: "flex",
                                flexWrap: "wrap",
                                alignItems: "center",
                                columnGap: 8,
                              }}
                            >
                              <Field
                                type="radio"
                                value="0"
                                name={data.nameTitle}
                                onChange={(e) => {
                                  setInputDataGuarantee((state) => {
                                    console.log("masuk update guarantee");
                                    let fieldName = data.nameTitle;
                                    let a = { ...state };
                                    a[fieldName] = e.target.value;
                                    return a;
                                  });
                                }}
                              />
                              <span>Tidak</span>
                            </label>
                          </div>
                        </div>

                        {/* tanggal mulai, selesai, evidence */}
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 20,
                            marginTop: 15,
                          }}
                        >
                          {/* tanggal mulai */}
                          <div className="col-sm-3">
                            <label
                              style={{
                                margin: 0,
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <span>Tanggal Mulai</span>
                              <Field
                                type="date"
                                style={{
                                  borderRadius: 4,
                                  padding: "10px 12px",
                                  border: "none",
                                  display: "flex",
                                  flexDirection: "row-reverse",
                                  columnGap: 10,
                                }}
                                disabled={
                                  inputDataGuarantee[data.nameTitle] === "0"
                                    ? true
                                    : false
                                }
                                name={data.nameStart}
                                onChange={(e) => {
                                  setInputDataGuarantee((state) => {
                                    console.log(
                                      "masuk update guarantee",
                                      data.nameTitle
                                    );
                                    let fieldName = data.nameStart;
                                    let a = { ...state };
                                    a[fieldName] = e.target.value;
                                    return a;
                                  });
                                }}
                              />
                            </label>
                          </div>

                          {/* tanggal selesai */}
                          <div className="col-sm-3">
                            <label
                              style={{
                                margin: 0,
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <span>Tanggal Selesai</span>
                              <Field
                                type="date"
                                style={{
                                  borderRadius: 4,
                                  padding: "10px 12px",
                                  border: "none",
                                  display: "flex",
                                  flexDirection: "row-reverse",
                                  columnGap: 10,
                                }}
                                name={data.nameEnd}
                                // disabled={data.nameTitle}
                                disabled={
                                  inputDataGuarantee[data.nameTitle] === "0"
                                    ? true
                                    : false
                                }
                                onChange={(e) => {
                                  setInputDataGuarantee((state) => {
                                    console.log("masuk update guarantee");
                                    let fieldName = data.nameEnd;
                                    let a = { ...state };
                                    a[fieldName] = e.target.value;
                                    return a;
                                  });
                                }}
                              />
                            </label>
                          </div>

                          {/* evidence */}
                          {/* <div
                            className="col-md-5"
                            style={{
                              padding: 0,
                            }}
                          >
                            <label
                              style={{
                                margin: 0,
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <span>Evidence</span>
                              <div>
                                <label
                                  htmlFor="upload"
                                  className={`input-group mb-3 col-sm-12 pointer`}
                                  style={{
                                    padding: 0,
                                  }}
                                >
                                  <span
                                    className={`form-control text-truncate`}
                                    style={{
                                      backgroundColor: "#e8f4fb",
                                    }}
                                  >
                                    {data.filename}
                                  </span>
                                  <div className="input-group-prepend">
                                    <span
                                      className="input-group-text"
                                      style={{
                                        backgroundColor: "#e8f4fb",
                                      }}
                                    >
                                      <i className="fas fa-file-upload"></i>
                                    </span>
                                  </div>
                                </label>
                                <input
                                  type="file"
                                  className="d-none"
                                  name={data.nameEvidence}
                                  // value={data.filename}
                                  filename={data.filename}
                                  id="upload"
                                  style={{
                                    backgroundColor: "#E8F4FB",
                                  }}
                                />
                              </div>
                            </label>
                          </div> */}
                          {/* <input
                            type="file"
                            style={{
                              border: 1,
                              borderColor: "black",
                              borderStyle: "solid",
                              borderRadius: 4,
                              padding: 8,
                              width: "100%",
                            }}
                            // DILARANG KERAS PAKAI NAME!
                            name={data.nameEvidence}
                            onChange={(event) => {
                              const formData = new FormData();
                              formData.append(
                                event.target.value,
                                event.target.files[0]
                              );
                              setInputDataGuarantee((state) => {
                                console.log("state sekarang", state);
                                let fieldName = data.nameEvidence;
                                let a = { ...state };
                                // a[fieldName] = event.target.files[0];
                                // console.log(
                                //   "isi file",
                                //   event.target.files[0]
                                // );
                                a[fieldName] = formData;
                                return a;
                              });
                            }}
                          /> */}
                        </div>
                      </div>
                    </>
                  ))}
              </div>

              <PerubahanKlausulKontrak
                subTitle={"B"}
                title={"Jaminan"}
                fromWhere={"guarantee"}
                showAddClause={showAddClause}
                values={values}
              />

              <UpdateButton fromWhere={"guarantee"} />
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default Jaminan;
