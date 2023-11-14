import React from "react";
import DialogGlobal from "app/components/modals/DialogGlobal";
import { Formik, Field, Form } from "formik";

const NewSecondWorkDirector = ({
  openCloseSecondWorkDirector,
  setPlaceman,
}) => {
  const createNewPlaceman = (
    party_2_job_director_position,
    party_2_job_director_address,
    party_2_job_director_telp,
    party_2_job_director_fax
  ) => ({
    party_2_job_director_position,
    party_2_job_director_address,
    party_2_job_director_telp,
    party_2_job_director_fax,
  });
  return (
    <>
      {/* modal tambah direksi pekerjaan pihak kedua */}
      <DialogGlobal
        ref={openCloseSecondWorkDirector}
        isCancel={false}
        isSubmit={false}
        yesButton={false}
        noButton={false}
      >
        <Formik
          initialValues={{
            party_2_job_director_position: "",
            party_2_job_director_address: "",
            party_2_job_director_telp: "",
            party_2_job_director_fax: "",
          }}
          onSubmit={(values) => {
            setPlaceman((placeman) => {
              return {
                ...placeman,
                secondWorkDirector: [
                  ...placeman.secondWorkDirector,
                  createNewPlaceman(
                    values?.party_2_job_director_position,
                    values?.party_2_job_director_address,
                    values?.party_2_job_director_telp,
                    values?.party_2_job_director_fax
                  ),
                ],
              };
            });
            openCloseSecondWorkDirector.current.close();
          }}
        >
          {() => (
            <>
              <Form>
                <div
                  style={{
                    padding: "0 17%",
                  }}
                >
                  <h1
                    style={{
                      marginBottom: 40,
                      fontSize: 16,
                      fontWeight: 600,
                      textAlign: "center",
                    }}
                  >
                    Tambah Direksi Pekerjaan Pihak Kedua
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
                        flexDirection: "column",
                        gap: 10,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                        }}
                      >
                        Jabatan
                      </span>
                      <Field
                        type="text"
                        name="party_2_job_director_position"
                        style={{
                          padding: 8,
                          borderRadius: 4,
                          border: 1,
                          borderStyle: "solid",
                          borderColor: "#8c8a8a",
                          opacity: 0.8,
                        }}
                      />
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                        }}
                      >
                        Alamat
                      </span>
                      <Field
                        type="text"
                        name="party_2_job_director_address"
                        style={{
                          padding: 8,
                          borderRadius: 4,
                          border: 1,
                          borderStyle: "solid",
                          borderColor: "#8c8a8a",
                          opacity: 0.8,
                        }}
                      />
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                        }}
                      >
                        Telp
                      </span>
                      <Field
                        type="text"
                        name="party_2_job_director_telp"
                        style={{
                          padding: 8,
                          borderRadius: 4,
                          border: 1,
                          borderStyle: "solid",
                          borderColor: "#8c8a8a",
                          opacity: 0.8,
                        }}
                      />
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                        }}
                      >
                        Fax
                      </span>
                      <Field
                        type="text"
                        name="party_2_job_director_fax"
                        style={{
                          padding: 8,
                          borderRadius: 4,
                          border: 1,
                          borderStyle: "solid",
                          borderColor: "#8c8a8a",
                          opacity: 0.8,
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: 52,
                    padding: "0 7%",
                  }}
                >
                  <button type="submit" className="btn btn-primary">
                    Save
                  </button>
                </div>
              </Form>
            </>
          )}
        </Formik>
      </DialogGlobal>
    </>
  );
};

export default NewSecondWorkDirector;
