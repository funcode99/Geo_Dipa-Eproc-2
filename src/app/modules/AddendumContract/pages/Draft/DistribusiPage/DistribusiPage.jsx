import { Upload, Tabs } from "antd";
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

  const submitData = () => {
    console.log(dataSubmit, "dataSubmit");
    let data_new = new FormData();
    data_new.append("add_contract_id", contract_id);
    data_new.append("file_name", dataSubmit.file_name);
    data_new.append("link_name", dataSubmit.link_name);
    data_new.append("note", dataSubmit.note);
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
                    onChange={(event) => setInputValue(event.target.value)}
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
                          setDataSubmit({
                            ...dataSubmit,
                            file_name: fileList[0],
                          });
                        }}
                      >
                        <UploadButton />
                      </Upload>
                    ) : (
                      <input
                        className="form-control"
                        onChange={(e) =>
                          setDataSubmit({
                            ...dataSubmit,
                            link_name: e.target.value,
                          })
                        }
                        value={dataSubmit?.file_name}
                      />
                    )}
                  </div>
                </div>
              )}
              {inputValue === "Link" && (
                <div>
                  <div
                    style={{
                      padding: "12px 10px",
                      border: "1px solid #8C8A8A",
                      borderRadius: 8,
                    }}
                  >
                    <input
                      className="form-control"
                      onChange={(e) =>
                        setDataSubmit({
                          ...dataSubmit,
                          link_name: e.target.value,
                        })
                      }
                      value={dataSubmit?.link_name}
                    />
                  </div>
                </div>
              )}
              <div>
                Catatan<span style={{ color: "red" }}>*</span>
                <textarea
                  rows="4"
                  className="form-control"
                  onChange={(e) =>
                    setDataSubmit({ ...dataSubmit, note: e.target.value })
                  }
                  value={dataSubmit?.note}
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
                    onClick={submitData}
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
        </>
      );
    case 2:
      return (
        <>
          {isAdmin && <HeaderSection />}
          <DistribusiDokument
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
