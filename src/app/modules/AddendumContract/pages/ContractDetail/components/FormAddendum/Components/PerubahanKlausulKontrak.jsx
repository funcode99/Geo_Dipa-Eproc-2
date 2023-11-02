import React from "react";
import { Field, FieldArray } from "formik";

const PerubahanKlausulKontrak = ({
  setBodyClauseData,
  setInitialAttachmentClauseData,
  showAddClause,
  values,
  title,
  subTitle,
}) => {
  return (
    <>
      {/* Klausul Perubahan */}
      <div
        className="clause-change-wrapper"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 14,
          border: 1,
          borderColor: "black",
          borderStyle: "solid",
          padding: 28,
          borderRadius: 14,
          // marginTop: 40
        }}
      >
        <div>
          <span
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: "#2e1f22",
            }}
          >
            {subTitle}. Perubahan Klausul Kontrak {title}
          </span>
        </div>

        <h1
          style={{
            fontWeight: 600,
            fontSize: 16,
            margin: 0,
          }}
        >
          {subTitle}.1 Body Kontrak
        </h1>

        <FieldArray name="body_data">
          {() => (
            <>
              <>
                {/* Nomor Pasal */}
                <div>
                  <Field
                    type="text"
                    name={`body_data.clause_number`}
                    onChange={(e) =>
                      setBodyClauseData((state) => ({
                        ...state,
                        clause_number: e.target.value,
                      }))
                    }
                    placeholder="Masukkan Nomor Pasal"
                    style={{
                      padding: 8,
                      borderRadius: 4,
                      minWidth: 400,
                    }}
                  />
                </div>

                {/* Pasal */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 14,
                    // marginTop: 28
                  }}
                >
                  {/* pasal sebelum addendum */}
                  <div>
                    <p
                      style={{
                        fontWeight: 500,
                        marginBottom: 14,
                      }}
                    >
                      Pasal Sebelum Addendum
                    </p>
                    <Field
                      className="form-control"
                      as="textarea"
                      name={`body_data.before_clause_note`}
                      onChange={(e) =>
                        setBodyClauseData((state) => ({
                          ...state,
                          before_clause_note: e.target.value,
                        }))
                      }
                      placeholder="Masukkan Nomor Pasal"
                      style={{
                        padding: 8,
                        borderRadius: 4,
                        minWidth: 400,
                      }}
                      rows="4"
                    />
                  </div>

                  {/* pasal setelah addendum */}
                  <div>
                    <p
                      style={{
                        fontWeight: 500,
                        marginBottom: 14,
                      }}
                    >
                      Pasal Setelah Addendum
                    </p>
                    <Field
                      className="form-control"
                      as="textarea"
                      name={`body_data.after_clause_note`}
                      onChange={(e) =>
                        setBodyClauseData((state) => ({
                          ...state,
                          after_clause_note: e.target.value,
                        }))
                      }
                      placeholder="Masukkan Nomor Pasal"
                      style={{
                        padding: 8,
                        borderRadius: 4,
                        minWidth: 400,
                      }}
                      rows="4"
                    />
                  </div>
                </div>
              </>

              {/* Lampiran */}
              <h1
                style={{
                  fontWeight: 600,
                  fontSize: 16,
                  margin: 0,
                }}
              >
                {subTitle}.2 Lampiran
              </h1>
            </>
          )}
        </FieldArray>

        <>
          <div>
            <Field
              name={`initial_attachment_data.attachment_number`}
              onChange={(e) =>
                setInitialAttachmentClauseData((state) => ({
                  ...state,
                  attachment_number: e.target.value,
                }))
              }
              type="text"
              placeholder="Masukkan Angka Lampiran"
              style={{
                padding: 8,
                borderRadius: 4,
                minWidth: 400,
              }}
            />
          </div>

          <div>
            <Field
              className="form-control"
              as="textarea"
              name={`initial_attachment_data.clause_note`}
              onChange={(e) =>
                setInitialAttachmentClauseData((state) => ({
                  ...state,
                  clause_note: e.target.value,
                }))
              }
              placeholder="Masukkan Nomor Pasal"
              style={{
                padding: 8,
                borderRadius: 4,
                minWidth: 400,
              }}
              rows="4"
            />
          </div>
        </>

        <FieldArray name="body_attachment">
          {({ push }) => (
            <>
              {values.attachment_data.map((a, index) => (
                <>
                  <div>
                    <Field
                      name={`attachment_data.${index}.attachment_number`}
                      type="text"
                      placeholder="Masukkan Angka Lampiran"
                      style={{
                        padding: 8,
                        borderRadius: 4,
                        minWidth: 400,
                      }}
                    />
                  </div>

                  <div>
                    <Field
                      className="form-control"
                      as="textarea"
                      name={`attachment_data.${index}.clause_note`}
                      placeholder="Masukkan Nomor Pasal"
                      style={{
                        padding: 8,
                        borderRadius: 4,
                        minWidth: 400,
                      }}
                      rows="4"
                    />
                  </div>
                </>
              ))}
            </>
          )}
        </FieldArray>

        {/* Tambah klausul lampiran */}
        <div>
          <button
            type="button"
            className="btn btn-primary text-white add-new-clause"
            style={{
              marginTop: 14,
            }}
            onClick={showAddClause}
          >
            Tambah Klausul Lampiran
          </button>
        </div>
      </div>
    </>
  );
};

export default PerubahanKlausulKontrak;
