import React, { useState } from "react";
import { Button, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import TitleComponent from "../components/TitleComponent";

const fileList = [];
const FinalDraftPage = ({ isAdmin }) => {
  console.log(fileList, "fileList");

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
  return (
    <>
      <div
        className="bottom mt-4"
        style={{
          padding: 16,
          display: "flex",
          borderRadius: 8,
          flexDirection: "column",
          border: "1px solid #000000",
        }}
      >
        <div className="div" style={{ borderBottom: "1px solid #000000" }}>
          <TitleComponent title="Final Draft Addendum Kontrak" />
        </div>
        {dataFinalDraft?.map((item, index) => (
          <div className="content" key={index}>
            <div className="title">
              <TitleComponent title={item.title} />
            </div>
            {isAdmin && (
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
            <p>
              Komentar
              <span style={{ color: "red" }}>*</span>
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
            />
          </div>
        ))}
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
      </div>
    </>
  );
};

export default FinalDraftPage;
