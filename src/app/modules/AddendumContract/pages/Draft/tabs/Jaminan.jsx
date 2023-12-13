import { DEV_NODE } from "redux/BaseHost";
import { Formik, Field, Form } from "formik";
import React, { useState, useEffect } from "react";
import UpdateButton from "app/components/button/ButtonGlobal/UpdateButton.jsx";
import { submitGuarantee } from "app/modules/AddendumContract/service/AddendumContractCrudService";
import PerubahanKlausulKontrak from "app/modules/AddendumContract/pages/ContractDetail/components/FormAddendum/Components/PerubahanKlausulKontrak";

const Jaminan = ({
  dataNewClause,
  jsonData,
  contract_id,
  add_contract_guarantee,
}) => {
  const openCloseAddClause = React.useRef();
  const showAddClause = () => {
    openCloseAddClause.current.open();
  };
  const [inputDataGuarantee, setInputDataGuarantee] = useState({
    down_payment_guarantee: add_contract_guarantee?.down_payment_guarantee,
    down_payment_guarantee_evidence_file_name:
      add_contract_guarantee?.down_payment_guarantee_evidence_file_name,
    down_payment_guarantee_start_date:
      add_contract_guarantee?.down_payment_guarantee_start_date,
    down_payment_guarantee_end_date:
      add_contract_guarantee?.down_payment_guarantee_end_date,
    implementation_guarantee: add_contract_guarantee?.implementation_guarantee,
    implementation_guarantee_evidence_file_name:
      add_contract_guarantee?.implementation_guarantee_evidence_file_name,
    implementation_guarantee_start_date:
      add_contract_guarantee?.implementation_guarantee_start_date,
    implementation_guarantee_end_date:
      add_contract_guarantee?.implementation_guarantee_end_date,
    maintenance_guarantee: add_contract_guarantee?.maintenance_guarantee,
    maintenance_guarantee_evidence_file_name:
      add_contract_guarantee?.maintenance_guarantee_evidence_file_name,
    maintenance_guarantee_start_date:
      add_contract_guarantee?.maintenance_guarantee_start_date,
    maintenance_guarantee_end_date:
      add_contract_guarantee?.maintenance_guarantee_end_date,
    body_clause_data: "",
    attachment_clause_data: "",
  });

  const [data, setData] = useState({});
  useEffect(() => {
    let mapResult = jsonData?.contract_guarantees?.map((item) => {
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

  const addendumJaminan = [
    {
      judul: "Jaminan Uang Muka",
      nama_radio: "down_payment_guarantee",
      nominal: inputDataGuarantee?.down_payment_guarantee,
      tanggal_mulai: inputDataGuarantee?.down_payment_guarantee_start_date,
      tanggal_selesai: inputDataGuarantee?.down_payment_guarantee_end_date,
      bukti: inputDataGuarantee?.down_payment_guarantee_evidence_file_name,
    },
    {
      judul: "Jaminan Pelaksanaan",
      nama_radio: "implementation_guarantee",
      nominal: inputDataGuarantee?.implementation_guarantee,
      tanggal_mulai: inputDataGuarantee?.implementation_guarantee_start_date,
      tanggal_selesai: inputDataGuarantee?.implementation_guarantee_end_date,
      bukti: inputDataGuarantee?.implementation_guarantee_evidence_file_name,
    },
    {
      judul: "Jaminan Pemeliharaan",
      nama_radio: "maintenance_guarantee",
      nominal: inputDataGuarantee?.maintenance_guarantee,
      tanggal_mulai: inputDataGuarantee?.maintenance_guarantee_start_date,
      tanggal_selesai: inputDataGuarantee?.maintenance_guarantee_end_date,
      bukti: inputDataGuarantee?.maintenance_guarantee_evidence_file_name,
    },
  ];

  const submitFormParameterGuarantee = async (values) => {
    try {
      await submitGuarantee(
        {
          add_contract_id: contract_id,
          down_payment_guarantee: values.down_payment_guarantee,
          down_payment_guarantee_evidence_file_name:
            values.down_payment_guarantee_evidence_file_name,
          down_payment_guarantee_start_date:
            values.down_payment_guarantee_start_date,
          down_payment_guarantee_end_date:
            values.down_payment_guarantee_end_date,
          implementation_guarantee: values.implementation_guarantee,
          implementation_guarantee_evidence_file_name:
            values.implementation_guarantee_evidence_file_name,
          implementation_guarantee_start_date:
            values.implementation_guarantee_start_date,
          implementation_guarantee_end_date:
            values.implementation_guarantee_end_date,
          maintenance_guarantee: values.maintenance_guarantee,
          maintenance_guarantee_evidence_file_name:
            values.maintenance_guarantee_evidence_file_name,
          maintenance_guarantee_start_date:
            values.maintenance_guarantee_start_date,
          maintenance_guarantee_end_date: values.maintenance_guarantee_end_date,
          body_clause_data: values.body_data,
          attachment_clause_data: values.attachment_data,
        },
        contract_id
      );
      alert("Berhasil Update Data");
      window.location.reload();
    } catch (error) {
      console.error("Submission error:", error);

      if (error.response) {
        console.error("Server response data:", error.response.data);
      }
    }
  };

  return (
    <div className="bg-white p-10">
      <Formik
        enableReinitialize={true}
        initialValues={{
          down_payment_guarantee: inputDataGuarantee.down_payment_guarantee,
          down_payment_guarantee_evidence_file_name:
            inputDataGuarantee.down_payment_guarantee_evidence_file_name,
          down_payment_guarantee_start_date:
            inputDataGuarantee.down_payment_guarantee_start_date,
          down_payment_guarantee_end_date:
            inputDataGuarantee.down_payment_guarantee_end_date,
          implementation_guarantee: inputDataGuarantee.implementation_guarantee,
          implementation_guarantee_evidence_file_name:
            inputDataGuarantee.implementation_guarantee_evidence_file_name,
          implementation_guarantee_start_date:
            inputDataGuarantee.implementation_guarantee_start_date,
          implementation_guarantee_end_date:
            inputDataGuarantee.implementation_guarantee_end_date,
          maintenance_guarantee: inputDataGuarantee.maintenance_guarantee,
          maintenance_guarantee_evidence_file_name:
            inputDataGuarantee.maintenance_guarantee_evidence_file_name,
          maintenance_guarantee_start_date:
            inputDataGuarantee.maintenance_guarantee_start_date,
          maintenance_guarantee_end_date:
            inputDataGuarantee.maintenance_guarantee_end_date,
          body_data: inputDataGuarantee.body_clause_data,
          attachment_data: inputDataGuarantee.attachment_clause_data,
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
                  guaranteeBeforeAddendum?.map((data, index) => (
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
                                        `${DEV_NODE}/${data.filename}`,
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
                {addendumJaminan?.map((item, index) => (
                  <>
                    <div className="container" index={index}>
                      <div className="d-flex">
                        <p className="mr-2 font-medium">{item.judul}</p>
                      </div>
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
                            name={item.nama_radio}
                            onChange={(e) => {
                              setInputDataGuarantee({
                                ...inputDataGuarantee,
                                [item.nama_radio]: e.target.value,
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
                            name={item.nama_radio}
                            onChange={(e) => {
                              setInputDataGuarantee({
                                ...inputDataGuarantee,
                                [item.nama_radio]: e.target.value,
                              });
                            }}
                          />
                          <span>Tidak</span>
                        </label>
                      </div>
                      <div className="d-flex mt-6">
                        <div className="tanggal-mulai mr-8">
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
                                border: "1px solid black",
                                display: "flex",
                                flexDirection: "row-reverse",
                                columnGap: 10,
                              }}
                              value={
                                inputDataGuarantee[
                                  item.nama_radio + "_start_date"
                                ] || ""
                              }
                              onChange={(e) => {
                                setInputDataGuarantee({
                                  ...inputDataGuarantee,
                                  [`${item.nama_radio}_start_date`]: e.target
                                    .value,
                                });
                              }}
                            />
                          </label>
                        </div>
                        <div className="tanggal-selesai mr-8">
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
                                border: "1px solid black",
                                display: "flex",
                                flexDirection: "row-reverse",
                                columnGap: 10,
                              }}
                              value={
                                inputDataGuarantee[
                                  item.nama_radio + "_end_date"
                                ] || ""
                              }
                              onChange={(e) => {
                                setInputDataGuarantee({
                                  ...inputDataGuarantee,
                                  [`${item.nama_radio}_end_date`]: e.target
                                    .value,
                                });
                              }}
                            />
                          </label>
                        </div>
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
                isDrafting={true}
                values={values}
                isDisable={true}
              />

              <UpdateButton fromWhere={"guarantee"} isDrafting={true} />
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default Jaminan;
