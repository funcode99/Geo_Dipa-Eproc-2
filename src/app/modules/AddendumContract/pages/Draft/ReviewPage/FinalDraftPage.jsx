import { connect } from "react-redux";
import { Button, Upload } from "antd";
import { DEV_NODE } from "redux/BaseHost";
import { Row, Col } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import { fetch_api_sg } from "redux/globalReducer";
import { UploadOutlined } from "@ant-design/icons";
import TitleComponent from "../components/TitleComponent";
import React, { useState, useEffect, useRef } from "react";
import DialogGlobal from "app/components/modals/DialogGlobal";
import { submitAddContractFinalDraft } from "app/modules/AddendumContract/service/AddendumContractCrudService";

const FinalDraftPage = ({ isAdmin, contract_id, fetch_api_sg }) => {
  const openCloseAddAttachment = React.useRef();
  const showAddAttachment = () => {
    openCloseAddAttachment.current.open();
  };

  const toPush = useRef();
  const setPush = (e) => {
    toPush.current.click();
  };
  const [data, setData] = useState();
  const [dataSubmit, setDataSubmit] = useState({
    add_contract_id: contract_id,
    body_file_name: "",
    body_link: "",
    body_comment: "",
    lampiran_data: [
      {
        lampiran_file_name: "",
        lampiran_comment: "",
      },
    ],
    full_add_contract_file_name: "",
    full_add_contract_link: "",
    full_add_contract_comment: "",
    body_comment: "",
    spk_user_signed_file_name: "",
    spk_user_signed_link: "",
    spk_user_signed_comment: "",
  });

  // api 4.12
  const getAddContractFinalDraft = async () => {
    try {
      await fetch_api_sg({
        key: keys.fetch,
        type: "get",
        url: `/adendum/final-draft/${contract_id}`,
        onSuccess: (res) => {
          setData(res.data[0]);
        },
      });
    } catch (error) {
      console.error("Error fetching user participant review:", error);
    }
  };

  const submitForm = (values) => {
    const comments = [
      values.body_comment,
      ...values.lampiran_data.map((item) => item.lampiran_comment),
      values.full_add_contract_comment,
    ];

    if (comments.some((comment) => comment === null || !comment.trim())) {
      alert("Field Comment Wajib Diisi");
      return;
    }

    let data_new = new FormData();
    data_new.append("add_contract_id", values.add_contract_id);
    data_new.append("body_link", values.body_link);
    data_new.append("body_comment", values.body_comment);
    data_new.append("full_add_contract_link", values.full_add_contract_link);
    data_new.append(
      "full_add_contract_comment",
      values.full_add_contract_comment
    );
    data_new.append("spk_user_signed_link", values.spk_user_signed_link);
    data_new.append("spk_user_signed_comment", values.spk_user_signed_comment);
    if (values.body_full_name) {
      data_new.append("body_full_name", values.body_full_name.originFileObj);
      data_new.append("body_file_name", values.body_full_name.name);
    }
    if (values.full_add_contract_full_name) {
      data_new.append(
        "full_add_contract_full_name",
        values.full_add_contract_full_name.originFileObj
      );
      data_new.append(
        "full_add_contract_file_name",
        values.full_add_contract_full_name.name
      );
    }
    values.lampiran_data.forEach((lampiran, index) => {
      if (lampiran.lampiran_file_name) {
        data_new.append(
          `lampiran_file_name[${index}]`,
          lampiran.lampiran_file_name.originFileObj
        );
        data_new.append(
          `lampiran_comment[${index}]`,
          lampiran.lampiran_comment
        );
      }
    });
    submitAddContractFinalDraft(data_new);
    alert("Berhasil Tambah Data");
    setTimeout(() => {
      window.location.reload(true);
    }, 3000);
  };

  useEffect(() => {
    getAddContractFinalDraft();
  }, []);
  useEffect(() => {
    if (data) {
      setDataSubmit(data);
    }
  }, [data]);

  // function to push array in data submit lampiran_data
  const addModal = () => {
    const newData = {
      lampiran_file_name: "",
      lampiran_comment: "",
    };
    setDataSubmit((prevData) => ({
      ...prevData,
      lampiran_data: [...prevData.lampiran_data, newData],
    }));
    openCloseAddAttachment.current.close();
  };

  const deleteItem = (index) => {
    setDataSubmit((prevData) => {
      const updatedLampiranData = [...prevData.lampiran_data];
      updatedLampiranData.splice(index, 1);
      return {
        ...prevData,
        lampiran_data: updatedLampiranData,
      };
    });
  };

  const originalLampiranCount = dataSubmit.lampiran_data.filter(
    (item) => !!item.lampiran_file_name
  ).length;
  return (
    <>
      <DialogGlobal
        ref={openCloseAddAttachment}
        isCancel={false}
        isSubmit={true}
        onYes={addModal}
        title="Tambah Lampiran"
      >
        <div className="lampiran-baru">
          <div className="lampiran_data-section">
            <>
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
                  defaultFileList={[]}
                  maxCount={1}
                  accept=".docx"
                  beforeUpload={(file) => {
                    const isDocx =
                      file.type ===
                      "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
                    if (!isDocx) {
                      alert("Format file yang dapat diupload hanya .docx!");
                    }
                    return isDocx;
                  }}
                  onChange={(info) => {
                    const fileList = info.fileList.slice(-1);
                    // setFieldValue(
                    //   `lampiran_data[${index}].lampiran_file_name`,
                    //   fileList[0]
                    // );
                  }}
                >
                  <Button icon={<UploadOutlined />}>Pilih File</Button>
                </Upload>
              </div>
              <p style={{ color: "red", marginTop: 2 }}>
                Catatan : Format file yang dapat diupload hanya .docx
              </p>
            </>
            <p className="mt-4">
              Komentar<span style={{ color: "red" }}>*</span>
            </p>
            <textarea
              className="form-control"
              // as="textarea"
              name={`lampiran_data[${2}].lampiran_comment`}
              rows={3}
              style={{
                width: "100%",
                border: "1px solid #000000",
                borderRadius: 4,
                marginTop: -3,
              }}
              // onChange={handleChange}
              disabled={!isAdmin}
            />
          </div>
        </div>
      </DialogGlobal>
      <Formik
        enableReinitialize={true}
        initialValues={{
          add_contract_id: contract_id,
          body_link: dataSubmit?.body_link,
          body_comment: dataSubmit?.body_comment,
          body_file_name: dataSubmit?.body_file_name,
          lampiran_data: dataSubmit?.lampiran_data || [],
          spk_user_signed_link: dataSubmit?.spk_user_signed_link,
          full_add_contract_link: dataSubmit?.full_add_contract_link,
          spk_user_signed_comment: dataSubmit?.spk_user_signed_comment,
          full_add_contract_comment: dataSubmit?.full_add_contract_comment,
          spk_user_signed_file_name: dataSubmit?.spk_user_signed_file_name,
          full_add_contract_file_name: dataSubmit?.full_add_contract_file_name,
        }}
        onSubmit={(values, { resetForm }) => {
          submitForm(values);
        }}
      >
        {(props) => {
          const { values, handleChange, handleSubmit, setFieldValue } = props;
          return (
            <Form onSubmit={handleSubmit}>
              <div className="isi">
                <div className="title">
                  <TitleComponent title="A. Body Addendum Perjanjian" />
                </div>
                {dataSubmit?.body_file_name ? (
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
                      <a
                        href={`${DEV_NODE}/final_draft/${values?.body_file_name}`}
                        target="_blank"
                      >
                        {values?.body_file_name}
                      </a>
                    </div>
                  </div>
                ) : (
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
                        defaultFileList={[]}
                        maxCount={1}
                        accept=".docx"
                        onChange={(info) => {
                          const fileList = info.fileList.slice(-1);
                          setFieldValue("body_full_name", fileList[0]);
                        }}
                        beforeUpload={(file) => {
                          const isDocx =
                            file.type ===
                            "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
                          if (!isDocx) {
                            alert(
                              "Format file yang dapat diupload hanya .docx!"
                            );
                            return false;
                          }
                          setFieldValue("body_full_name", file);
                          return false;
                        }}
                      >
                        <Button icon={<UploadOutlined />} disabled={!isAdmin}>
                          Pilih File
                        </Button>
                      </Upload>
                    </div>
                    <p style={{ color: "red", marginTop: 2 }}>
                      Catatan : Format file yang dapat diupload hanya .docx
                    </p>
                  </div>
                )}
                <div className="comment">
                  <p className="mt-4">
                    Komentar<span style={{ color: "red" }}>*</span>
                  </p>
                  <Field
                    className="form-control"
                    as="textarea"
                    name="body_comment"
                    rows={3}
                    style={{
                      width: "100%",
                      border: "1px solid #000000",
                      borderRadius: 4,
                      marginTop: -3,
                    }}
                    value={values?.body_comment}
                    onChange={handleChange}
                    disabled={!isAdmin}
                  />
                </div>
              </div>
              {/* Handling lampiran_data */}
              {dataSubmit.lampiran_data.map((lampiran, index) => (
                <div key={index}>
                  <div className="title mt-8">
                    <TitleComponent
                      title={`${String.fromCharCode(
                        65 + index + 1
                      )}. Lampiran ${index + 1}`}
                    />
                  </div>
                  <div className="lampiran_data-section">
                    {lampiran?.lampiran_file_name ? (
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
                          <a
                            href={`${DEV_NODE}/final_draft/lampiran/${lampiran?.lampiran_file_name}`}
                            target="_blank"
                          >
                            {lampiran?.lampiran_file_name}
                          </a>
                        </div>
                      </div>
                    ) : (
                      <>
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
                            defaultFileList={[]}
                            maxCount={1}
                            accept=".docx"
                            beforeUpload={(file) => {
                              const isDocx =
                                file.type ===
                                "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
                              if (!isDocx) {
                                alert(
                                  "Format file yang dapat diupload hanya .docx!"
                                );
                              }
                              return isDocx;
                            }}
                            onChange={(info) => {
                              const fileList = info.fileList.slice(-1);
                              setFieldValue(
                                `lampiran_data[${index}].lampiran_file_name`,
                                fileList[0]
                              );
                            }}
                          >
                            <Button
                              icon={<UploadOutlined />}
                              disabled={!isAdmin}
                            >
                              Pilih File
                            </Button>
                          </Upload>
                        </div>
                        <p style={{ color: "red", marginTop: 2 }}>
                          Catatan : Format file yang dapat diupload hanya .docx
                        </p>
                      </>
                    )}
                    <p className="mt-4">
                      Komentar<span style={{ color: "red" }}>*</span>
                    </p>
                    <Field
                      className="form-control"
                      as="textarea"
                      name={`lampiran_data[${index}].lampiran_comment`}
                      rows={3}
                      style={{
                        width: "100%",
                        border: "1px solid #000000",
                        borderRadius: 4,
                        marginTop: -3,
                      }}
                      onChange={handleChange}
                      disabled={!isAdmin}
                    />
                  </div>
                  {index >= originalLampiranCount && (
                    <button
                      type="button"
                      className="btn btn-danger mt-2"
                      onClick={() => deleteItem(index)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              ))}
              {/* Handling full_add_contract */}
              <div className="full_add_contract-section">
                <div className="title mt-8">
                  <TitleComponent
                    title={`${String.fromCharCode(
                      65 + dataSubmit?.lampiran_data?.length + 1
                    )}. Full Addendum Perjanjian`}
                  />
                </div>
                {dataSubmit?.full_add_contract_file_name ? (
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
                      <a
                        href={`${DEV_NODE}/final_draft/full/${values?.full_add_contract_file_name}`}
                        target="_blank"
                      >
                        {values?.full_add_contract_file_name}
                      </a>
                    </div>
                  </div>
                ) : (
                  <>
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
                        defaultFileList={[]}
                        maxCount={1}
                        accept=".pdf"
                        beforeUpload={(file) => {
                          const isPDF = file.type === "application/pdf";
                          if (!isPDF) {
                            alert("Format file yang dapat diupload hanya .pdf");
                          }
                          return isPDF;
                        }}
                        onChange={(info) => {
                          const fileList = info.fileList.slice(-1);
                          setFieldValue(
                            "full_add_contract_full_name",
                            fileList[0]
                          );
                        }}
                      >
                        <Button icon={<UploadOutlined />} disabled={!isAdmin}>
                          Pilih File
                        </Button>
                      </Upload>
                    </div>
                    <p style={{ color: "red", marginTop: 2 }}>
                      Catatan : Format file yang dapat diupload hanya .pdf
                    </p>
                  </>
                )}
                <p className="mt-4">
                  Komentar<span style={{ color: "red" }}>*</span>
                </p>
                <Field
                  className="form-control"
                  as="textarea"
                  name="full_add_contract_comment"
                  rows={3}
                  style={{
                    width: "100%",
                    border: "1px solid #000000",
                    borderRadius: 4,
                    marginTop: -3,
                  }}
                  onChange={handleChange}
                  disabled={!isAdmin}
                />
              </div>
              {isAdmin && !dataSubmit?.body_file_name && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                  }}
                >
                  <button
                    type="button"
                    className="btn btn-primary mt-8"
                    onClick={addModal}
                  >
                    + Tambah Lampiran
                  </button>
                </div>
              )}
              {isAdmin && !dataSubmit?.body_file_name && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <button type="submit" className="btn btn-primary mt-8">
                    Submit
                  </button>
                </div>
              )}
            </Form>
          );
        }}
      </Formik>
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
