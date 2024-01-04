import { connect } from "react-redux";
import { Button, Upload } from "antd";
import React, { useState, useEffect } from "react";
import { fetch_api_sg } from "redux/globalReducer";
import { UploadOutlined } from "@ant-design/icons";
import TitleComponent from "../components/TitleComponent";

const fileList = [];
const FinalDraftPage = ({ isAdmin, contract_id, fetch_api_sg }) => {
  const [data, setData] = useState();

  const dataFinalDraft = [
    {
      title: "A. Body Addendum Perjanjian",
    },
    {
      title: "B. Lampiran 1",
    },
    {
      title: "C. Lampiran 2",
    },
    {
      title: "D. Lampiran 3",
    },
    {
      title: "E. Full Addendum Perjanjian",
    },
  ];

  // api 4.12
  const getAddContractFinalDraft = async () => {
    try {
      await fetch_api_sg({
        key: keys.fetch,
        type: "get",
        url: `/adendum/final-draft/${contract_id}`,
        onSuccess: (res) => {
          setData(res.data);
        },
      });
    } catch (error) {
      console.error("Error fetching user participant review:", error);
    }
  };

  useEffect(() => {
    getAddContractFinalDraft();
  }, []);
  return (
    <>
      <div
        style={{
          padding: 16,
          display: "flex",
          borderRadius: 8,
          flexDirection: "column",
          border: "1px solid #000000",
        }}
      >
        <div className="mb-4" style={{ borderBottom: "1px solid #000000" }}>
          <TitleComponent title="Final Draft Addendum Kontrak" />
        </div>
        {data?.map((item, index) => (
          <div className="isi" key={index}>
            <div className="title">
              <TitleComponent title="A. Body Addendum Perjanjian" />
            </div>
            {!item?.body_file_name && isAdmin && (
              <div className="full-upload">
                <div
                  className="upload"
                  style={{
                    padding: 16,
                    display: "flex",
                    borderRadius: 8,
                    flexDirection: "column",
                    border: "1px solid #000000",
                  }}
                >
                  <Upload
                    action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                    listType="picture"
                    defaultFileList={[...fileList]}
                  >
                    <Button icon={<UploadOutlined />}>Pilih File</Button>
                  </Upload>
                </div>
                <p style={{ color: "red", marginTop: 2 }}>
                  Catatan : Format file yang dapat diupload hanya .docx
                </p>
              </div>
            )}
            {item?.body_file_name && (
              <div className="view-link">
                <div
                  style={{
                    padding: 16,
                    display: "flex",
                    borderRadius: 8,
                    flexDirection: "column",
                    border: "1px solid #000000",
                  }}
                >
                  <a href={item?.body_link} target="_blank">
                    {item?.body_file_name}
                  </a>
                </div>
              </div>
            )}
            <p className="mt-4">
              Komentar<span style={{ color: "red" }}>*</span>
            </p>
            <textarea
              type="text"
              rows={3}
              style={{
                width: "100%",
                border: "1px solid #000000",
                borderRadius: 4,
                marginTop: -3,
              }}
              value={item?.body_comment}
            />
            {item?.lampiran_data?.map((lampiran, i) => (
              <div className="content" key={i}>
                <div className="title">
                  <TitleComponent title={dataFinalDraft[i + 1].title} />
                </div>
                {!lampiran?.lampiran_file_name && isAdmin && (
                  <div className="full-upload">
                    <div
                      className="upload"
                      style={{
                        padding: 16,
                        display: "flex",
                        borderRadius: 8,
                        flexDirection: "column",
                        border: "1px solid #000000",
                      }}
                    >
                      <Upload
                        action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                        listType="picture"
                        defaultFileList={[...fileList]}
                      >
                        <Button icon={<UploadOutlined />}>Pilih File</Button>
                      </Upload>
                    </div>
                    <p style={{ color: "red", marginTop: 2 }}>
                      Catatan : Format file yang dapat diupload hanya .docx
                    </p>
                  </div>
                )}
                {lampiran?.lampiran_file_name && (
                  <div className="view-link">
                    <div
                      style={{
                        padding: 16,
                        display: "flex",
                        borderRadius: 8,
                        flexDirection: "column",
                        border: "1px solid #000000",
                      }}
                    >
                      <a href={lampiran?.lampiran_file_name} target="_blank">
                        {lampiran?.lampiran_file_name}
                      </a>
                    </div>
                  </div>
                )}
                <p className="mt-4">
                  Komentar<span style={{ color: "red" }}>*</span>
                </p>
                <textarea
                  type="text"
                  rows={3}
                  style={{
                    width: "100%",
                    border: "1px solid #000000",
                    borderRadius: 4,
                    marginTop: -3,
                  }}
                  value={lampiran?.lampiran_comment}
                />
              </div>
            ))}
            {item?.full_add_contract_file_name && (
              <div className="content" key={index}>
                <div className="title">
                  <TitleComponent title="E. Full Addendum Perjanjian" />
                </div>
                {!item?.full_add_contract_file_name && isAdmin && (
                  <div className="full-upload">
                    <div
                      className="upload"
                      style={{
                        padding: 16,
                        display: "flex",
                        borderRadius: 8,
                        flexDirection: "column",
                        border: "1px solid #000000",
                      }}
                    >
                      <Upload
                        action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                        listType="picture"
                        defaultFileList={[...fileList]}
                      >
                        <Button icon={<UploadOutlined />}>Pilih File</Button>
                      </Upload>
                    </div>
                    <p style={{ color: "red", marginTop: 2 }}>
                      Catatan : Format file yang dapat diupload hanya .docx
                    </p>
                  </div>
                )}
                {item?.full_add_contract_file_name && (
                  <div className="view-link">
                    <div
                      style={{
                        padding: 16,
                        display: "flex",
                        borderRadius: 8,
                        flexDirection: "column",
                        border: "1px solid #000000",
                      }}
                    >
                      <a href={item?.full_add_contract_link} target="_blank">
                        {item?.full_add_contract_file_name}
                      </a>
                    </div>
                  </div>
                )}
                <p className="mt-4">
                  Komentar<span style={{ color: "red" }}>*</span>
                </p>
                <textarea
                  type="text"
                  rows={3}
                  style={{
                    width: "100%",
                    border: "1px solid #000000",
                    borderRadius: 4,
                    marginTop: -3,
                  }}
                  value={item?.full_add_contract_comment}
                />
              </div>
            )}
          </div>
        ))}
        {isAdmin && (
          <div
            className="mb-4"
            style={{
              display: "flex",
              justifyContent: "flex-start",
            }}
          >
            <button type="button" className="btn btn-primary">
              + Tambah Lampiran
            </button>
          </div>
        )}
        {isAdmin && (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <button type="button" className="btn btn-primary">
              Submit
            </button>
          </div>
        )}
      </div>
    </>
  );
};
const keys = {
  getAddendumDetail: "get-addendum-contract-by-id ",
};

const mapDispatch = {
  fetch_api_sg,
};

export default connect(null, mapDispatch)(FinalDraftPage);
