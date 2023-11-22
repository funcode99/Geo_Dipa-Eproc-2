import React, { useState } from "react";
import { Paper, makeStyles } from "@material-ui/core";
import { Formik, Form, Field } from "formik";
import { Button } from "react-bootstrap";
import { uploadSuppDoc } from "app/modules/AddendumContract/service/AddendumContractCrudService";
import { supportingDocumentDefault } from "../ParaPihak/fieldData";

const UploadDokumenPendukung = ({ supportDocumentFetch }) => {
  const [supportingDocument, setSupportingDocument] = useState(
    supportDocumentFetch
  );
  const submitData = (values) => {
    let formDataNew = new FormData();
    formDataNew.append("drafter_code", "1");
    formDataNew.append("add_drafter", "Supply Chain Management (SCM) Division");
    values.supportDocumentData.map((item, index) => {
      formDataNew.append(`noDokumen[${index}]`, item.noDokumen);
      formDataNew.append(`tglDokumen[${index}]`, item.tglDokumen);
      formDataNew.append(`fileDokumen[${index}]`, item.fileDokumen);
      formDataNew.append(`perihal[${index}]`, item.perihal);
      formDataNew.append(`idDokumen[${index}]`, `1123456`);
      formDataNew.append(`seq[${index}]`, index);
      formDataNew.append(`tipeDokumen[${index}]`, index);
      formDataNew.append(`namaDokumen[${index}]`, index);
      formDataNew.append(`namaDokumenEng[${index}]`, index);
    });
    uploadSuppDoc(formDataNew, localStorage.getItem("add_contract_id"));
  };
  function resizeTextArea(textarea) {
    const { style } = textarea;

    // The 4 corresponds to the 2 2px borders (top and bottom):
    style.height = style.minHeight = "auto";
    style.minHeight = `${Math.min(
      textarea.scrollHeight + 4,
      parseInt(textarea.style.maxHeight)
    )}px`;
    style.height = `${textarea.scrollHeight + 4}px`;
  }
  const useStyles = makeStyles((theme) => ({
    root: {
      width: "100%",
      marginTop: theme.spacing(1),
      overflowX: "auto",
    },
    table: {
      minWidth: 650,
    },
  }));
  const classes = useStyles();
  return (
    <>
      <Paper className={classes.root}>
        <div
          style={{
            padding: "2rem 2.25rem",
          }}
        >
          <Formik
            enableReinitialize={true}
            initialValues={{
              supportDocumentData: supportingDocument,
              drafterCode: "Supply Chain Management (SCM) Division",
              addDrafter: "",
            }}
            onSubmit={(values) => {
              // console.log("hasil dari formik", values);
              submitData(values);
            }}
          >
            {(props) => {
              const { values, setFieldValue } = props;
              return (
                <Form>
                  <h1
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      color: "#2e1f22",
                    }}
                  >
                    A. Dokumen Pendukung
                  </h1>

                  {supportingDocument &&
                    supportingDocument.map((item, index) => {
                      return (
                        <>
                          <h1
                            style={{
                              fontSize: 14,
                              fontWeight: 500,
                              marginTop: 14,
                            }}
                          >
                            {index + 1} {item.document_name}
                          </h1>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 14,
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                columnGap: 28,
                                flexWrap: "wrap",
                              }}
                            >
                              <div
                                style={{
                                  flex: 1,
                                }}
                              >
                                <p
                                  style={{
                                    marginBottom: 4,
                                  }}
                                >
                                  No Dokumen
                                </p>
                                <Field
                                  type="text"
                                  name={`supportDocumentData[${index}].noDokumen`}
                                  style={{
                                    borderRadius: 4,
                                    padding: 8,
                                    width: "100%",
                                  }}
                                />
                              </div>
                              <div
                                style={{
                                  flex: 1,
                                }}
                              >
                                <p
                                  style={{
                                    marginBottom: 4,
                                  }}
                                >
                                  Tanggal Dokumen
                                </p>
                                <Field
                                  type="date"
                                  name={`supportDocumentData[${index}].tglDokumen`}
                                  style={{
                                    borderRadius: 4,
                                    padding: 8,
                                    width: "100%",
                                  }}
                                />
                              </div>
                              <div
                                style={{
                                  flex: 1,
                                }}
                              >
                                <p
                                  style={{
                                    marginBottom: 4,
                                  }}
                                >
                                  Upload Dokumen
                                </p>
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
                                      `supportDocumentData[${index}].fileDokumen`,
                                      event.currentTarget.files[0]
                                    );
                                  }}
                                />
                              </div>
                            </div>
                            <div>
                              <div>
                                <p
                                  style={{
                                    marginBottom: 4,
                                  }}
                                >
                                  Perihal
                                </p>
                                <Field
                                  as="textarea"
                                  name={`supportDocumentData[${index}].perihal`}
                                  // onChange={(e) => {
                                  //   resizeTextArea(e.target);
                                  // }}
                                  onKeyUp={(e) => {
                                    resizeTextArea(e.target);
                                  }}
                                  style={{
                                    maxHeight: 160,
                                    width: "100%",
                                    padding: 8,
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </>
                      );
                    })}

                  <div className="mt-5">
                    <p
                      className="mb-0"
                      style={{
                        color: "#2e1f22",
                        fontSize: 14,
                        fontWeight: 500,
                      }}
                    >
                      Permintaan Penerbitan Draft Addendum Kepada:
                    </p>
                    <Field
                      as="select"
                      name="drafterCode"
                      style={{
                        padding: "10px 12px",
                        fontSize: 12,
                        backgroundColor: "#e8f4fb",
                        borderRadius: 4,
                      }}
                      value={values.drafterCode}
                    >
                      <option
                      // style={{
                      //   padding: '10px 12px',
                      //   fontSize: 12,
                      //   backgroundColor: '#e8f4fb',
                      //   borderRadius: 4
                      // }}
                      >
                        Supply Chain Management (SCM) Division
                      </option>
                      <option>Corporate Legal & Compliance Division</option>
                      <option>Pengguna (Direksi Pekerjaan)</option>
                    </Field>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: 28,
                      padding: "2rem 2.25rem",
                    }}
                  >
                    <Button
                      className="text-primary btn btn-white border border-primary"
                      style={{
                        minWidth: 100,
                      }}
                    >
                      Save Draft
                    </Button>
                    <Button
                      type="submit"
                      style={{
                        minWidth: 100,
                      }}
                    >
                      Submit
                    </Button>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      </Paper>
    </>
  );
};

export default UploadDokumenPendukung;
