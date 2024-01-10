import { Upload, Tabs } from "antd";
import { DEV_NODE } from "redux/BaseHost";
import { Formik, Form, Field } from "formik";
import React, { useEffect, useState } from "react";
import DistribusiDokument from "./DistribusiDokument";
import UploadButton from "app/components/button/ButtonGlobal/UploadButton";
import { submitContractDustribution } from "app/modules/AddendumContract/service/AddendumContractCrudService";

const DistribusiPage = ({
  data,
  isAdmin,
  isClient,
  isVendor,
  loginStatus,
  contract_id,
}) => {
  const [dataSubmit, setDataSubmit] = useState({
    file_name: data?.add_contract_distribution?.file_name || "",
    link_name: data?.add_contract_distribution?.link_name || "",
    note: data?.add_contract_distribution?.note || "",
  });
  useEffect(() => {
    if (data) {
      setDataSubmit({
        file_name: data?.add_contract_distribution?.file_name || "",
        link_name: data?.add_contract_distribution?.link_name || "",
        note: data?.add_contract_distribution?.note || "",
      });
    }
  }, [data]);
  const [inputValue, setInputValue] = useState("Upload File");
  const [distributionSequence, setDistributionSequence] = React.useState(
    isAdmin ? 1 : 2
  );

  const HeaderSection = () => {
    return (
      <>
        <div
          style={{
            backgroundColor: "white",
            borderRadius: 8,
          }}
        >
          <Tabs
            centered
            size="large"
            tabBarGutter={200}
            defaultActiveKey={distributionSequence}
            items={[
              {
                label: "Verifikasi Admin",
                key: 1,
              },
              {
                label: "Distribusi Dokumen",
                key: 2,
              },
            ]}
            onChange={(e) => setDistributionSequence(e)}
          />
        </div>
      </>
    );
  };

  const submitForm = (values) => {
    console.log(values, "values");
    let data_new = new FormData();
    data_new.append("add_contract_id", contract_id);
    data_new.append("file_name", values.file_name.originFileObj);
    data_new.append("link_name", values.link_name);
    data_new.append("note", values.note);
    submitContractDustribution(data_new);
    alert("Berhasil simpan data!");
    setTimeout(() => {
      window.location.reload(true);
    }, 3000);
  };

  switch (distributionSequence) {
    case 1:
      return (
        <>
          <HeaderSection />
          <Formik
            enableReinitialize={true}
            initialValues={{
              add_contract_id: contract_id,
              file_name: dataSubmit?.file_name,
              link_name: dataSubmit?.link_name,
              note: dataSubmit?.note,
            }}
            onSubmit={(values, { resetForm }) => {
              submitForm(values);
            }}
          >
            {(props) => {
              const {
                values,
                handleChange,
                handleSubmit,
                setFieldValue,
              } = props;
              return (
                <Form onSubmit={handleSubmit}>
                  <div
                    style={{
                      backgroundColor: "white",
                      padding: "0 28px 28px 28px",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 14,
                      }}
                    ></div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 14,
                      }}
                    >
                      <h1
                        style={{
                          fontSize: 16,
                          fontWeight: 600,
                        }}
                      >
                        Distribusi Addendum Perjanjian
                      </h1>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 4,
                        }}
                      >
                        Pilihan Masukan
                        <div>
                          <select
                            style={{
                              padding: "10px 12px",
                              backgroundColor: "#e8f4fb",
                              minWidth: 180,
                              borderRadius: 4,
                            }}
                            onChange={(event) =>
                              setInputValue(event.target.value)
                            }
                          >
                            <option value={"Upload File"}>Upload File</option>
                            <option value={"Link"}>Link</option>
                          </select>
                        </div>
                      </div>
                      {inputValue === "Upload File" && (
                        <div className="full-upload">
                          <div
                            className="upload"
                            style={{
                              padding: 16,
                              display: "flex",
                              borderRadius: 8,
                              flexDirection: "column",
                              border: "1px solid #8C8A8A",
                            }}
                          >
                            {!data?.add_contract_distribution?.file_name ? (
                              <Upload
                                action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                                listType="picture"
                                defaultFileList={[]}
                                maxCount={1}
                                onChange={(info) => {
                                  const fileList = info.fileList.slice(-1);
                                  setFieldValue("file_name", fileList[0]);
                                }}
                              >
                                <UploadButton />
                              </Upload>
                            ) : (
                              <a
                                href={`${DEV_NODE}/distribution/${values?.file_name}`}
                                target="_blank"
                              >
                                {values?.file_name}
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                      {inputValue === "Link" && (
                        <div>
                          <Field
                            className="form-control"
                            name="link_name"
                            rows={3}
                            style={{
                              width: "100%",
                              border: "1px solid #8C8A8A",
                            }}
                            value={values?.link_name}
                            onChange={handleChange}
                          />
                        </div>
                      )}
                      <div>
                        Catatan<span style={{ color: "red" }}>*</span>
                        <Field
                          className="form-control"
                          as="textarea"
                          name="note"
                          rows={3}
                          style={{
                            width: "100%",
                            borderRadius: 4,
                            padding: "12px 10px",
                            border: "1px solid #8C8A8A",
                          }}
                          value={values?.note}
                          onChange={handleChange}
                        />
                      </div>

                      {data?.status_code !== "90" && (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                        >
                          <button
                            type="submit"
                            className="btn btn-primary"
                            style={{
                              maxWidth: 100,
                            }}
                          >
                            Submit
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </>
      );
    case 2:
      return (
        <>
          {isAdmin && <HeaderSection />}
          <DistribusiDokument
            data={data}
            isAdmin={isAdmin}
            isClient={isClient}
            isVendor={isVendor}
            contract_id={contract_id}
            status_code={data?.status_code}
          />
        </>
      );
    default:
      return (
        <>
          <HeaderSection />
          <p>hello wolrd</p>
        </>
      );
  }
};

export default DistribusiPage;
