import React from "react";
import DialogGlobal from "app/components/modals/DialogGlobal";
import { Formik, Field, Form } from "formik";

const NewSecondWorkSupervisor = ({
  openCloseSecondWorkSupervisor,
  setPlaceman,
}) => {
  const createNewPlaceman = (
    party_2_job_supervisor_position,
    party_2_job_supervisor_address,
    party_2_job_supervisor_telp,
    party_2_job_supervisor_fax
  ) => ({
    party_2_job_supervisor_position,
    party_2_job_supervisor_address,
    party_2_job_supervisor_telp,
    party_2_job_supervisor_fax,
  });
  return (
    <>
      {/* modal tambah pengawas pekerjaan pihak kedua */}
      <DialogGlobal
        ref={openCloseSecondWorkSupervisor}
        isCancel={false}
        isSubmit={false}
        yesButton={false}
        noButton={false}
      >
        <Formik
          initialValues={{
            party_2_job_supervisor_position: "",
            party_2_job_supervisor_address: "",
            party_2_job_supervisor_telp: "",
            party_2_job_supervisor_fax: "",
          }}
          onSubmit={(values) => {
            setPlaceman((placeman) => {
              return {
                ...placeman,
                secondWorkSupervisor: [
                  ...placeman.secondWorkSupervisor,
                  createNewPlaceman(
                    values?.party_2_job_supervisor_position,
                    values?.party_2_job_supervisor_address,
                    values?.party_2_job_supervisor_telp,
                    values?.party_2_job_supervisor_fax
                  ),
                ],
              };
            });
            openCloseSecondWorkSupervisor.current.close();
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
                    Tambah Pengawas Pekerjaan Pihak Kedua
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
                        name="party_2_job_supervisor_position"
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
                        name="party_2_job_supervisor_address"
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
                        name="party_2_job_supervisor_telp"
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
                        name="party_2_job_supervisor_fax"
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

export default NewSecondWorkSupervisor;
