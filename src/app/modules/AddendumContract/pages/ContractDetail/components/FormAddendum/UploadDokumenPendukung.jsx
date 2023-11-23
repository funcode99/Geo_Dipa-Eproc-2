import React, { useState, useEffect } from "react";
import { Paper, makeStyles } from "@material-ui/core";
import { Formik, Form, Field } from "formik";
import { Button } from "react-bootstrap";
import { uploadSuppDoc } from "app/modules/AddendumContract/service/AddendumContractCrudService";

const UploadDokumenPendukung = ({ supportDocumentFetch, initialData }) => {
  // AARRGHGH PASS BY REFERENCE
  supportDocumentFetch.map((item) => {
    if (item.seq === 1 || item.seq === 2 || item.seq === 4 || item.seq === 8) {
      item.required = false;
    } else {
      item.required = true;
    }
  });
  const [supportingDocument, setSupportingDocument] = useState();
  // disini SLICE TIDAK MENGHAPUS ARRAY YANG SUDAH ADA
  let kondisiA = supportDocumentFetch.slice(0, 4);
  let pelengkapA = supportDocumentFetch.slice(8);
  let pelengkapB = supportDocumentFetch.slice(4, 7);
  let lengkapA = [...kondisiA, ...pelengkapA];
  let lengkapB = [...lengkapA, ...pelengkapB];
  let conclusion = localStorage.getItem("conclusion");

  useEffect(() => {
    if (supportDocumentFetch.length > initialData.length) {
      let additionalDocument = supportDocumentFetch.slice(
        9,
        supportDocumentFetch.length + 1
      );
      setSupportingDocument((previous) => {
        return [...previous, additionalDocument];
      });
    }
  }, [supportDocumentFetch]);

  useEffect(() => {
    if (
      conclusion ===
      "Harga pekerjaan setelah addendum dibawah 10% dari harga pekerjaan awal (Nilai Kontrak di bawah Rp 5M)"
    ) {
      setSupportingDocument(lengkapA);
    } else if (
      conclusion ===
      "Harga pekerjaan setelah addendum diatas 10% dari harga pekerjaan awal (Nilai Kontrak di bawah Rp 5M)"
    ) {
      setSupportingDocument(lengkapB);
    } else {
      setSupportingDocument(supportDocumentFetch);
    }
  }, []);

  const submitData = (values) => {
    let formDataNew = new FormData();
    formDataNew.append("drafter_code", values.drafterCode[1]);
    formDataNew.append("add_drafter", values.drafterCode[0]);
    values.supportDocumentData.some(
      (item) =>
        item.required === true &&
        (typeof item.noDokumen === "undefined" ||
          typeof item.tglDokumen === "undefined" ||
          typeof item.fileDokumen === "undefined" ||
          typeof item.perihal === "undefined")
    )
      ? alert("Silahkan isi form mandatory yang masih kosong")
      : values.supportDocumentData.map((item, index) => {
          if (
            typeof item.noDokumen === "undefined" ||
            typeof item.tglDokumen === "undefined" ||
            typeof item.fileDokumen === "undefined" ||
            typeof item.perihal === "undefined"
          ) {
            return;
          } else {
            formDataNew.append(`noDokumen[${index}]`, item.noDokumen);
            formDataNew.append(`tglDokumen[${index}]`, item.tglDokumen);
            formDataNew.append(`fileDokumen[${index}]`, item.fileDokumen);
            formDataNew.append(`perihal[${index}]`, item.perihal);
            formDataNew.append(
              `idDokumen[${index}]`,
              typeof item.id === "0" ? null : item.id
            );
            formDataNew.append(`seq[${index}]`, item.seq);
            formDataNew.append(
              `tipeDokumen[${index}]`,
              typeof item.document_type === "undefined"
                ? null
                : item.document_type
            );
            formDataNew.append(`namaDokumen[${index}]`, item.document_name);
            formDataNew.append(
              `namaDokumenEng[${index}]`,
              typeof item.document_name_eng === "undefined"
                ? null
                : item.document_name_eng
            );
          }
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
              drafterCode: ["Supply Chain Management (SCM) Division", 1],
            }}
            onSubmit={(values) => {
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
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              marginTop: 14,
                            }}
                          >
                            <div
                              style={{
                                fontSize: 14,
                                fontWeight: 500,
                                height: 25.06,
                                display: "flex",
                              }}
                            >
                              {index + 1}.
                              {item.document_name !== "" ? (
                                <p>
                                  {item.document_name}{" "}
                                  {item.required ? (
                                    <span style={{ color: "#dc0526" }}>*</span>
                                  ) : (
                                    ""
                                  )}
                                </p>
                              ) : (
                                <Field
                                  type="text"
                                  name={`supportDocumentData[${index}].document_name`}
                                />
                              )}
                            </div>
                            {item.document_name === "" && (
                              <button
                                style={{
                                  height: 25.06,
                                }}
                                onClick={() => {
                                  setSupportingDocument((previous) => {
                                    const newState = [...previous];
                                    newState.splice(index, 1);
                                    return newState;
                                  });
                                }}
                              >
                                Hapus
                              </button>
                            )}
                          </div>
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
                    <Button
                      className="mb-7"
                      onClick={() =>
                        setSupportingDocument((previous) => {
                          return [
                            ...previous,
                            {
                              idDokumen: "0",
                              document_name: "",
                              noDokumen: "",
                              tglDokumen: "",
                              fileDokumen: "",
                              seq: supportDocumentFetch.length + 1,
                            },
                          ];
                        })
                      }
                    >
                      + Tambah Dokumen
                    </Button>
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
                        value={["Supply Chain Management (SCM) Division", 1]}
                      >
                        Supply Chain Management (SCM) Division
                      </option>
                      <option
                        value={["Corporate Legal & Compliance Division", 2]}
                      >
                        Corporate Legal & Compliance Division
                      </option>
                      <option value={["Pengguna (Direksi Pekerjaan)", 2]}>
                        Pengguna (Direksi Pekerjaan)
                      </option>
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
