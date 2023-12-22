import React, { useState, useEffect } from "react";
import { Paper, makeStyles } from "@material-ui/core";
import { Formik, Form, Field } from "formik";
import { Button } from "react-bootstrap";
import { uploadSuppDoc } from "app/modules/AddendumContract/service/AddendumContractCrudService";
import { compose } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

const UploadDokumenPendukung = ({
  supportDocumentFetch,
  initialData,
  isAddJobPrice,
  conclusion,
}) => {
  supportDocumentFetch.map((item) => {
    if (
      item.document_name ===
        "Surat Penawaran Harga dan Rincian Harga Pekerjaan dari Vendor" ||
      item.document_name === "Berita Acara Kesepakatan Addendum" ||
      (item.document_name === "Justifikasi " &&
        conclusion ===
          "Harga pekerjaan setelah addendum diatas 10% dari harga pekerjaan awal (Nilai kontrak di bawah Rp 5M)") ||
      (item.document_name === "Kajian Hukum dari Fungsi Legal" &&
        conclusion ===
          "Harga pekerjaan setelah addendum diatas 10% dari harga pekerjaan awal (Nilai kontrak di bawah Rp 5M)") ||
      (item.document_name ===
        "Kajian Risk Management dari Fungsi Risk Management" &&
        conclusion ===
          "Harga pekerjaan setelah addendum diatas 10% dari harga pekerjaan awal (Nilai kontrak di bawah Rp 5M)") ||
      (item.document_name === "Hasil Keputusan Rapat Direksi" &&
        conclusion ===
          "Harga pekerjaan setelah addendum diatas 10% dari harga pekerjaan awal (Nilai kontrak di atas Rp 5M)") ||
      item.document_name === "Memo/Surat Permohonan Addendum"
    ) {
      item.required = true;
    } else {
      item.required = false;
    }
  });
  const [supportingDocument, setSupportingDocument] = useState({
    data: "",
  });
  // disini SLICE TIDAK MENGHAPUS ARRAY YANG SUDAH ADA
  let kondisiA = supportDocumentFetch.slice(0, 4);
  let pelengkapA = supportDocumentFetch.slice(8);
  let pelengkapB = supportDocumentFetch.slice(4, 7);
  let lengkapA = [...kondisiA, ...pelengkapA];
  let lengkapB = [...lengkapA, ...pelengkapB];

  useEffect(() => {
    if (supportDocumentFetch.length > initialData.length) {
      let additionalDocument = supportDocumentFetch.slice(
        9,
        supportDocumentFetch.length + 1
      );
      setSupportingDocument((previous) => {
        return {
          data: [...previous, additionalDocument],
        };
      });
    }
  }, [supportDocumentFetch]);

  useEffect(() => {
    if (
      conclusion ===
      "Harga pekerjaan setelah addendum dibawah 10% dari harga pekerjaan awal (Nilai Kontrak di bawah Rp 5M)"
    ) {
      setSupportingDocument(() => {
        return {
          data: lengkapA,
        };
      });
    } else if (
      conclusion ===
      "Harga pekerjaan setelah addendum diatas 10% dari harga pekerjaan awal (Nilai Kontrak di bawah Rp 5M)"
    ) {
      setSupportingDocument(() => {
        return {
          data: lengkapB,
        };
      });
    } else if (
      conclusion ===
        "Harga pekerjaan setelah addendum diatas 10% dari harga pekerjaan awal (Nilai kontrak di atas Rp 5M" ||
      conclusion ===
        "Harga pekerjaan setelah addendum dibawah 10% dari harga pekerjaan awal (Nilai kontrak di atas Rp 5M)"
    ) {
      setSupportingDocument(() => {
        return {
          data: supportDocumentFetch,
        };
      });
    } else {
      setSupportingDocument(() => {
        return {
          data: lengkapA,
        };
      });
    }
  }, []);

  const submitData = (values) => {
    console.log("isi values saat submit upload", values);

    let formDataNew = new FormData();
    if (
      values.drafterSelectValue === "Supply Chain Management (SCM) Division"
    ) {
      formDataNew.append("drafter_code", 1);
      formDataNew.append("add_drafter", values.drafterSelectValue);
    } else if (
      values.drafterSelectValue === "Corporate Legal & Compliance Division"
    ) {
      formDataNew.append("drafter_code", 2);
      formDataNew.append("add_drafter", values.drafterSelectValue);
    } else if (values.drafterSelectValue === "Pengguna (Direksi Pekerjaan)") {
      formDataNew.append("drafter_code", 3);
      formDataNew.append("add_drafter", values.drafterSelectValue);
    } else {
      formDataNew.append("drafter_code", 1);
      formDataNew.append(
        "add_drafter",
        "Supply Chain Management (SCM) Division"
      );
    }
    if (
      supportingDocument?.data?.some(
        (item) =>
          item.required === true &&
          (typeof item.noDokumen === "undefined" ||
            typeof item.tglDokumen === "undefined" ||
            typeof item.fileDokumenKirim === "undefined" ||
            typeof item.perihal === "undefined")
      )
    ) {
      alert("Silahkan isi form mandatory yang masih kosong");
    } else {
      let initValue = 0;
      const a = supportingDocument?.data?.map((item, index) => {
        if (
          typeof item.noDokumen === "undefined" ||
          typeof item.tglDokumen === "undefined" ||
          typeof item.fileDokumenKirim === "undefined" ||
          typeof item.perihal === "undefined"
        ) {
          console.log("kosong");
        } else {
          formDataNew.append(`noDokumen[${initValue}]`, item.noDokumen);
          formDataNew.append(`tglDokumen[${initValue}]`, item.tglDokumen);
          formDataNew.append(
            `fileDokumen[${initValue}]`,
            item.fileDokumenKirim
          );
          formDataNew.append(`perihal[${initValue}]`, item.perihal);
          formDataNew.append(
            `idDokumen[${initValue}]`,
            typeof item.id === "0" ? null : item.id
          );
          formDataNew.append(`seq[${initValue}]`, item.seq);
          formDataNew.append(
            `tipeDokumen[${initValue}]`,
            typeof item.document_type === "undefined"
              ? null
              : item.document_type
          );
          formDataNew.append(`namaDokumen[${initValue}]`, item.document_name);
          formDataNew.append(
            `namaDokumenEng[${initValue}]`,
            typeof item.document_name_eng === "undefined"
              ? null
              : item.document_name_eng
          );
          initValue += 1;
        }
      });
    }
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
  const setNewDocumentValue = (index, event, name) => {
    setSupportingDocument((previous) => {
      let newState = [...previous.data];
      newState[index][name] = event;
      return {
        data: newState,
      };
    });
  };
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
              supportDocumentData: supportingDocument?.data,
              drafterSelectValue: "",
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

                  {supportingDocument?.data &&
                    supportingDocument?.data?.map((item, index) => {
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
                              {item.additional !== true ? (
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
                                  name={`supportDocumentData.data[${index}].document_name`}
                                  value={
                                    supportingDocument.data[index].document_name
                                  }
                                  onChange={(e) => {
                                    setNewDocumentValue(
                                      index,
                                      e.target.value,
                                      "document_name"
                                    );
                                  }}
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
                                    const newState = { ...previous };
                                    newState.data.splice(index, 1);
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
                                  value={
                                    supportingDocument.data[index].noDokumen
                                  }
                                  onChange={(e) => {
                                    setNewDocumentValue(
                                      index,
                                      e.target.value,
                                      "noDokumen"
                                    );
                                  }}
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
                                  value={
                                    supportingDocument.data[index].tglDokumen
                                  }
                                  onChange={(e) => {
                                    setNewDocumentValue(
                                      index,
                                      e.target.value,
                                      "tglDokumen"
                                    );
                                  }}
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
                                  value={
                                    supportingDocument.data[index].fileDokumen
                                  }
                                  onChange={(event) => {
                                    setFieldValue(
                                      `supportDocumentData[${index}].fileDokumen`,
                                      event.currentTarget.files[0]
                                    );
                                    setNewDocumentValue(
                                      index,
                                      event.currentTarget.files[0],
                                      "fileDokumenKirim"
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
                                  value={supportingDocument.data[index].perihal}
                                  onChange={(e) => {
                                    setNewDocumentValue(
                                      index,
                                      e.target.value,
                                      "perihal"
                                    );
                                  }}
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
                          return {
                            data: [
                              ...previous.data,
                              {
                                idDokumen: "0",
                                document_name: "",
                                noDokumen: "",
                                tglDokumen: "",
                                fileDokumenKirim: "",
                                seq: supportDocumentFetch.length + 1,
                                additional: true,
                              },
                            ],
                          };
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
                      name="drafterSelectValue"
                      style={{
                        padding: "10px 12px",
                        fontSize: 12,
                        backgroundColor: "#e8f4fb",
                        borderRadius: 4,
                      }}
                      value={values.drafterSelectValue}
                    >
                      <option
                        value={
                          // drafterCode:
                          "Supply Chain Management (SCM) Division"
                          // ,
                          // addDrafter: 1,
                        }
                      >
                        Supply Chain Management (SCM) Division
                      </option>
                      <option
                        value={
                          // {
                          // drafterCode:
                          "Corporate Legal & Compliance Division"
                          // addDrafter: 2,
                          // }
                        }
                      >
                        Corporate Legal & Compliance Division
                      </option>
                      <option
                        value={
                          // {
                          // drafterCode:
                          "Pengguna (Direksi Pekerjaan)"
                          // ,
                          // addDrafter: 3,
                          // }
                        }
                      >
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

// export default UploadDokumenPendukung;

const mapState = ({ addendumContract }) => ({
  // ini isi local storage nya ternyata ah elah goblok bat sih gue wkwkwkwwkwk
  isAddJobPrice: addendumContract.isAddJobPrice,
  conclusion: addendumContract.conclusion,
});

export default compose(
  withRouter,
  connect(mapState, null)
)(UploadDokumenPendukung);
