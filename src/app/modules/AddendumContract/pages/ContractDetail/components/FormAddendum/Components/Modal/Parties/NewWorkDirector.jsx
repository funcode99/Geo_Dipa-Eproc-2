import React from "react";
import DialogGlobal from "app/components/modals/DialogGlobal";
import { Formik } from "formik";
import { ReactSelect } from "percobaan/ReactSelect";

const NewWorkDirector = ({
  openCloseWorkDirector,
  setPlaceman,
  jobDirector,
  jobDirectorIndex,
  changeDataJobDirector,
  jobSupervisor,
  jobSupervisorIndex,
  changeDataJobSupervisor,
  setIsSubmit,
}) => {
  const createWorkDirector = (
    usernameSelectIndex,
    addressSelectIndex,
    name,
    fullname,
    position,
    address,
    phone_number,
    fax
  ) => ({
    usernameSelectIndex,
    addressSelectIndex,
    name,
    fullname,
    position,
    address,
    phone_number,
    fax,
  });

  return (
    <>
      {/* modal tambah direksi pekerjaan */}
      <DialogGlobal
        ref={openCloseWorkDirector}
        isCancel={false}
        onYes={() => {
          setIsSubmit(true);
          setPlaceman((placeman) => {
            return {
              ...placeman,
              workDirector: [
                ...placeman.workDirector,
                createWorkDirector(
                  jobDirectorIndex,
                  jobSupervisorIndex,
                  jobDirector ? jobDirector[jobDirectorIndex]?.username : null,
                  jobDirector ? jobDirector[jobDirectorIndex]?.full_name : null,
                  jobDirector
                    ? jobDirector[jobDirectorIndex]?.position_name
                    : null,
                  jobSupervisor
                    ? jobSupervisor[jobSupervisorIndex]?.address
                    : null,
                  jobSupervisor
                    ? jobSupervisor[jobSupervisorIndex]?.phone
                    : null,
                  jobSupervisor ? jobSupervisor[jobSupervisorIndex]?.fax : null
                ),
              ],
            };
          });
        }}
      >
        <Formik></Formik>
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
            Tambah Direksi Pekerjaan
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
              <span>Username</span>
              <ReactSelect
                data={jobDirector}
                func={changeDataJobDirector}
                labelName={`username`}
              />
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <span>Nama Lengkap</span>
              <input
                style={{
                  padding: 8,
                  borderRadius: 4,
                  border: 1,
                  borderStyle: "solid",
                  borderColor: "#8c8a8a",
                  opacity: 0.8,
                  backgroundColor: "#e8f4fb",
                }}
                value={
                  jobDirector ? jobDirector[jobDirectorIndex]?.full_name : null
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
              <span>Jabatan</span>
              <input
                style={{
                  padding: 8,
                  borderRadius: 4,
                  border: 1,
                  borderStyle: "solid",
                  borderColor: "#8c8a8a",
                  opacity: 0.8,
                  backgroundColor: "#e8f4fb",
                }}
                value={
                  jobDirector
                    ? jobDirector[jobDirectorIndex]?.position_name
                    : null
                }
                disabled
              />
            </div>

            <div>
              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  rowGap: 4,
                }}
              >
                <span>Alamat</span>
                <ReactSelect
                  data={jobSupervisor}
                  func={changeDataJobSupervisor}
                  labelName={"address"}
                />
              </label>
            </div>

            <div>
              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  rowGap: 4,
                }}
              >
                <span>Telp</span>
                <input
                  type="text"
                  style={{
                    padding: 8,
                    borderRadius: 4,
                    border: 1,
                    borderStyle: "solid",
                    borderColor: "#8c8a8a",
                    opacity: 0.8,
                    backgroundColor: "#e8f4fb",
                  }}
                  value={
                    jobSupervisor
                      ? jobSupervisor[jobSupervisorIndex]?.phone
                      : null
                  }
                  disabled
                />
              </label>
            </div>

            <div>
              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  rowGap: 4,
                }}
              >
                <span>FAX</span>
                <input
                  type="text"
                  style={{
                    padding: 8,
                    borderRadius: 4,
                    border: 1,
                    borderStyle: "solid",
                    borderColor: "#8c8a8a",
                    opacity: 0.8,
                    backgroundColor: "#e8f4fb",
                  }}
                  value={
                    jobSupervisor
                      ? jobSupervisor[jobSupervisorIndex]?.fax
                      : null
                  }
                  disabled
                />
              </label>
            </div>
          </div>
        </div>
      </DialogGlobal>
    </>
  );
};

export default NewWorkDirector;
