import React, { useState, useEffect } from "react";
import DialogGlobal from "app/components/modals/DialogGlobal";
import { ReactSelect } from "percobaan/ReactSelect";
import { Formik, Field, Form } from "formik";

const NewWorkSupervisor = ({
  openCloseWorkSupervisor,
  setPlaceman,
  jobSupervisor,
  jobSupervisorIndex,
  changeDataJobSupervisor,
  setIsSubmit,
}) => {
  let [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    setCurrentIndex(jobSupervisorIndex);
  }, [jobSupervisorIndex]);

  const createWorkSupervisor = (
    position,
    address,
    phone,
    fax,
    currentIndex
  ) => ({
    position,
    address,
    phone,
    fax,
    currentIndex,
  });

  return (
    <>
      {/* modal tambah supervisor pekerjaan */}
      <DialogGlobal
        ref={openCloseWorkSupervisor}
        isCancel={false}
        isSubmit={false}
        yesButton={false}
        noButton={false}
      >
        <Formik
          initialValues={{
            position: "",
          }}
          onSubmit={(values) => {
            setIsSubmit(true);
            setPlaceman((placeman) => {
              return {
                ...placeman,
                workSupervisor: [
                  ...placeman.workSupervisor,
                  createWorkSupervisor(
                    values?.position,
                    jobSupervisor[currentIndex]?.address,
                    jobSupervisor[currentIndex]?.phone,
                    jobSupervisor[currentIndex]?.fax,
                    jobSupervisorIndex
                  ),
                ],
              };
            });
            openCloseWorkSupervisor.current.close();
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
                    Tambah Pengawas Pekerjaan
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
                      <span>Jabatan</span>
                      <Field
                        type="text"
                        name="position"
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
                      <span>Alamat</span>
                      <ReactSelect
                        data={jobSupervisor}
                        func={changeDataJobSupervisor}
                        labelName={"address"}
                      />
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                      }}
                    >
                      <span>Telp</span>
                      <input
                        style={{
                          padding: 8,
                          borderRadius: 4,
                          border: 1,
                          borderStyle: "solid",
                          borderColor: "#8c8a8a",
                          opacity: 0.8,
                        }}
                        value={
                          jobSupervisor
                            ? jobSupervisor[jobSupervisorIndex]?.phone
                            : null
                        }
                        disabled
                      />
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                      }}
                    >
                      <span>Fax</span>
                      <input
                        style={{
                          padding: 8,
                          borderRadius: 4,
                          border: 1,
                          borderStyle: "solid",
                          borderColor: "#8c8a8a",
                          opacity: 0.8,
                        }}
                        value={
                          jobSupervisor
                            ? jobSupervisor[jobSupervisorIndex]?.fax
                            : null
                        }
                        disabled
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

export default NewWorkSupervisor;
