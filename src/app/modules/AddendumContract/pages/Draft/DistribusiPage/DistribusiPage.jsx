import Tabs from "app/components/tabs";
import React, { useState } from "react";
import { Button } from "@material-ui/core";
import { ReactSelect } from "percobaan/ReactSelect";
import UploadInput from "app/components/input/UploadInput";
import DialogGlobal from "app/components/modals/DialogGlobal";
import { toAbsoluteUrl } from "_metronic/_helpers/AssetsHelpers";
import ButtonAction from "app/components/buttonAction/ButtonAction";
import { submitAddContractUserReviewer } from "app/modules/AddendumContract/service/AddendumContractCrudService";

const TableListsVendor = [
  {
    name: "Samudera Raya Engineering",
    position: "Awaludin",
    email: "ptsamuderaraya@gmail.com",
  },
];

const TableListsUser = [
  {
    name: "User 1",
    position: "Logistic Supervisor",
    email: "user.1@geodipa.co.id",
  },
  {
    name: "User 2",
    position: "Procurement Staff",
    email: "user.2@geodipa.co.id",
  },
  {
    name: "User 3",
    position: "Procurement Superintendent",
    email: "user.3@geodipa.co.id",
  },
];

const distributionTabLists = [
  {
    id: "admin_verification",
    label: "Verifikasi Admin",
  },
  {
    id: "document_distribution",
    label: "Distribusi Dokumen",
  },
];

const DistribusiPage = ({ isAdmin, loginStatus, contract_id }) => {
  const [dataSubmit, setDataSubmit] = useState();
  const [inputValue, setInputValue] = useState("Upload File");
  const [distributionSequence, setDistributionSequence] = React.useState(0);
  const [distributionTabActive, setDistributionTabActive] = React.useState(0);

  const openCloseDownloadUser = React.useRef();
  const showDownloadUser = () => {
    openCloseDownloadUser.current.open();
  };
  const openCloseAddVendor = React.useRef();
  const showAddVendor = () => {
    openCloseAddVendor.current.open();
  };
  const openCloseAddReviewer = React.useRef();
  const showAddReviewer = () => {
    openCloseAddReviewer.current.open();
  };

  const handleChangeDistributionTab = (event, newTabActive) => {
    setDistributionTabActive(newTabActive);
    setDistributionSequence(newTabActive);
  };

  const HeaderSection = () => {
    return (
      <>
        <DialogGlobal
          ref={openCloseAddReviewer}
          isCancel={false}
          isSubmit={false}
          yesButton={false}
          noButton={false}
          maxWidth={"sm"}
        >
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
              Tambah Reviewer User
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
                <span>Name</span>
                {/* <ReactSelect
                  data={listUserParticipantReview}
                  func={changeDataUserParticipantReview}
                  labelName={`full_name`}
                /> */}
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
                  }}
                  onChange={(e) =>
                    setDataSubmit({
                      ...dataSubmit,
                      position_name: e.target.value,
                    })
                  }
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
            <button
              type="button"
              className="btn btn-primary mx-1"
              onClick={submitData}
            >
              Save
            </button>
          </div>
        </DialogGlobal>
        <DialogGlobal
          ref={openCloseAddVendor}
          isCancel={false}
          isSubmit={false}
          yesButton={false}
          noButton={false}
          maxWidth={"sm"}
        >
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
              Tambah Reviewer Vendor
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
                <span>Nama</span>
                <input
                  style={{
                    padding: 8,
                    borderRadius: 4,
                    border: 1,
                    borderStyle: "solid",
                    borderColor: "#8c8a8a",
                    opacity: 0.8,
                  }}
                  value={"SAMUDERA RAYA ENGINEERING"}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <span>PIC</span>
                <input
                  style={{
                    padding: 8,
                    borderRadius: 4,
                    border: 1,
                    borderStyle: "solid",
                    borderColor: "#8c8a8a",
                    opacity: 0.8,
                  }}
                  value={"Awaludin"}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <span>Email</span>
                <input
                  style={{
                    padding: 8,
                    borderRadius: 4,
                    border: 1,
                    borderStyle: "solid",
                    borderColor: "#8c8a8a",
                    opacity: 0.8,
                  }}
                  value={"ptsamuderarayae@gmail.com"}
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
            <Button>Save</Button>
          </div>
        </DialogGlobal>
        <DialogGlobal
          ref={openCloseDownloadUser}
          isCancel={false}
          isSubmit={false}
          maxWidth={"xs"}
        >
          <div className="d-flex justify-content-center">
            <img src={toAbsoluteUrl("/media/svg/icons/All/Vector.png")} />
          </div>

          <p className="text-center mt-3" style={{ fontWeight: 600 }}>
            Unduh hasil approval user telah berhasil
          </p>
        </DialogGlobal>
        <div
          style={{
            backgroundColor: "white",
          }}
        >
          <Tabs
            tabActive={distributionTabActive}
            handleChange={handleChangeDistributionTab}
            tabLists={distributionTabLists}
            variant="scrollable"
            grid={true}
            arrayLength={2}
          />
        </div>
      </>
    );
  };

  const actionButton = (
    <ButtonAction
      style={{
        backgroundColor: "#e8f4fb",
      }}
      hoverLabel="More"
      data={"1"}
      ops={[
        {
          label: "Batalkan",
        },
      ]}
    />
  );

  const submitData = () => {
    submitAddContractUserReviewer({
      add_contract_id: contract_id,
      user_id: dataSubmit.user_id,
      position_name: dataSubmit.position_name,
    });
    alert("Berhasil tambah data!");
    openCloseAddReviewer.current.close();
    window.location.reload(true);
  };

  switch (distributionSequence) {
    case 0:
      return (
        <>
          <HeaderSection />
          <div
            style={{
              backgroundColor: "white",
              padding: 28,
              display: "flex",
              flexDirection: "column",
              gap: 28,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            ></div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              <h1
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                }}
              >
                Distribusi Addendum Perjanjian
              </h1>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                }}
              >
                Pilihan Masukan
                <div>
                  <select
                    style={{
                      padding: "10px 12px",
                      backgroundColor: "#e8f4fb",
                      minWidth: 180,
                      borderRadius: 4,
                    }}
                    onChange={(event) => setInputValue(event.target.value)}
                  >
                    <option value={"Upload File"}>Upload File</option>
                    <option value={"Link"}>Link</option>
                  </select>
                </div>
              </div>
              {inputValue === "Upload File" && (
                <div>
                  <UploadInput />
                </div>
              )}
              {inputValue === "Link" && (
                <div>
                  <div
                    style={{
                      padding: "12px 10px",
                      border: "1px solid black",
                    }}
                  >
                    <span
                      style={{
                        color: "#3699ff",
                        fontSize: 14,
                        fontWeight: 500,
                      }}
                    >
                      001.KTR-DNG1.PBJ-GDE-I-2022.FULL-CONTRACT.Admin_Zulfiqur_Rahman.08-08-2022
                      1437.DRAFT_FINAL_ADD_PDF.pdf
                    </span>
                  </div>
                </div>
              )}
              <div>
                *Catatan
                <textarea
                  rows="4"
                  className="form-control"
                  value={"sudah oke"}
                ></textarea>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  onClick={showDownloadUser}
                  className="btn btn-primary"
                  style={{
                    maxWidth: 100,
                  }}
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </>
      );
    case 1:
      return (
        <>
          <HeaderSection />
          {isAdmin && (
            <div
              style={{
                padding: 28,
                backgroundColor: "white",
              }}
            >
              <div
                style={{
                  border: 1,
                  borderColor: "black",
                  borderStyle: "solid",
                  padding: "14px 28px",
                  backgroundColor: "white",
                  borderRadius: 14,
                }}
              >
                <h1
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                  }}
                >
                  Daftar Distribusi Final Addendum
                </h1>

                <br
                  style={{
                    border: 1,
                    borderColor: "black",
                    borderStyle: "solid",
                  }}
                />
                <h1
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                  }}
                >
                  Admin Kontrak
                </h1>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                    gap: 28,
                    margin: "14px 0px 28px 0px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 4,
                    }}
                  >
                    <span>Nama</span>
                    <input
                      type="text"
                      value={"Zulfiqur Rahman"}
                      style={{
                        borderRadius: 4,
                        padding: 8,
                        backgroundColor: "#e8f4fb",
                      }}
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 4,
                    }}
                  >
                    <span>Jabatan</span>
                    <input
                      type="text"
                      value={"Purchasing Staff"}
                      style={{
                        borderRadius: 4,
                        padding: 8,
                        backgroundColor: "#e8f4fb",
                      }}
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 4,
                    }}
                  >
                    <span>Email</span>
                    <input
                      type="text"
                      value={"zulfiqur.r@geodipa.co.id"}
                      style={{
                        borderRadius: 4,
                        padding: 8,
                        backgroundColor: "#e8f4fb",
                      }}
                    />
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 28,
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 14,
                      }}
                    >
                      <h1
                        style={{
                          fontSize: 16,
                          fontWeight: 600,
                        }}
                      >
                        User
                      </h1>
                      <Button
                        className="btn btn-primary"
                        variant="contained"
                        size="medium"
                        onClick={showAddReviewer}
                      >
                        <div>
                          <span>Tambah User</span>
                        </div>
                      </Button>
                    </div>

                    <table>
                      <tr>
                        <th>No</th>
                        <th>Nama</th>
                        <th>Jabatan</th>
                        <th>Email</th>
                        <th>Aksi</th>
                      </tr>

                      {TableListsUser &&
                        TableListsUser.map((item, index) => {
                          return (
                            <>
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.name}</td>
                                <td>{item.position}</td>
                                <td>{item.email}</td>
                                <td>{actionButton}</td>
                              </tr>
                            </>
                          );
                        })}
                    </table>
                  </div>

                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 14,
                      }}
                    >
                      <h1
                        style={{
                          fontSize: 16,
                          fontWeight: 600,
                        }}
                      >
                        Vendor
                      </h1>
                      <Button
                        className="btn btn-primary"
                        variant="contained"
                        size="medium"
                        onClick={showAddVendor}
                      >
                        <div>
                          <span>Tambah Vendor</span>
                        </div>
                      </Button>
                    </div>

                    <table>
                      <tr>
                        <th>No</th>
                        <th>Nama</th>
                        <th>Jabatan</th>
                        <th>Email</th>
                        <th>Aksi</th>
                      </tr>

                      {TableListsVendor &&
                        TableListsVendor.map((item, index) => {
                          return (
                            <>
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.name}</td>
                                <td>{item.position}</td>
                                <td>{item.email}</td>
                                <td>{actionButton}</td>
                              </tr>
                            </>
                          );
                        })}
                    </table>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: 40,
                  }}
                >
                  <Button variant="contained" color="secondary">
                    Submit
                  </Button>
                </div>
              </div>
            </div>
          )}

          {!isAdmin && loginStatus !== "vendor" && (
            <div
              style={{
                padding: 28,
                backgroundColor: "white",
              }}
            >
              <div
                style={{
                  border: 1,
                  borderColor: "black",
                  borderStyle: "solid",
                  padding: "14px 28px",
                  backgroundColor: "white",
                  borderRadius: 14,
                }}
              >
                <h1
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                  }}
                >
                  Distribusi Final Addendum
                </h1>

                <br
                  style={{
                    border: 1,
                    borderColor: "black",
                    borderStyle: "solid",
                  }}
                />
                <h1
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                  }}
                >
                  Admin Kontrak
                </h1>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                    gap: 28,
                    margin: "14px 0px 28px 0px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 4,
                    }}
                  >
                    <span>Nama</span>
                    <input
                      type="text"
                      value={"Zulfiqur Rahman"}
                      style={{
                        borderRadius: 4,
                        padding: 8,
                        backgroundColor: "#e8f4fb",
                      }}
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 4,
                    }}
                  >
                    <span>Jabatan</span>
                    <input
                      type="text"
                      value={"Purchasing Staff"}
                      style={{
                        borderRadius: 4,
                        padding: 8,
                        backgroundColor: "#e8f4fb",
                      }}
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 4,
                    }}
                  >
                    <span>Email</span>
                    <input
                      type="text"
                      value={"zulfiqur.r@geodipa.co.id"}
                      style={{
                        borderRadius: 4,
                        padding: 8,
                        backgroundColor: "#e8f4fb",
                      }}
                    />
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 28,
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 14,
                      }}
                    >
                      <h1
                        style={{
                          fontSize: 16,
                          fontWeight: 600,
                        }}
                      >
                        User
                      </h1>
                    </div>

                    <table>
                      <tr>
                        <th>No</th>
                        <th>Nama</th>
                        <th>Jabatan</th>
                        <th>Email</th>
                      </tr>

                      {TableListsUser &&
                        TableListsUser.map((item, index) => {
                          return (
                            <>
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.name}</td>
                                <td>{item.position}</td>
                                <td>{item.email}</td>
                              </tr>
                            </>
                          );
                        })}
                    </table>
                  </div>

                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 14,
                      }}
                    >
                      <h1
                        style={{
                          fontSize: 16,
                          fontWeight: 600,
                        }}
                      >
                        Vendor
                      </h1>
                    </div>

                    <table>
                      <tr>
                        <th>No</th>
                        <th>Nama</th>
                        <th>Jabatan</th>
                        <th>Email</th>
                      </tr>

                      {TableListsVendor &&
                        TableListsVendor.map((item, index) => {
                          return (
                            <>
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.name}</td>
                                <td>{item.position}</td>
                                <td>{item.email}</td>
                              </tr>
                            </>
                          );
                        })}
                    </table>
                  </div>

                  <div
                    style={{
                      backgroundColor: "#e8f4fb",
                      padding: "12px 10px",
                      color: "#dc0526",
                      borderRadius: 4,
                    }}
                  >
                    Final Addendum belum di distribusi
                  </div>
                </div>
              </div>
            </div>
          )}

          {loginStatus === "vendor" && (
            <>
              <div
                style={{
                  padding: 28,
                  backgroundColor: "white",
                }}
              >
                <div
                  style={{
                    border: 1,
                    borderColor: "black",
                    borderStyle: "solid",
                    padding: "14px 28px",
                    backgroundColor: "white",
                    borderRadius: 14,
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 14,
                      }}
                    >
                      <h1
                        style={{
                          fontSize: 16,
                          fontWeight: 600,
                        }}
                      >
                        Vendor
                      </h1>
                    </div>

                    <table>
                      <tr>
                        <th>No</th>
                        <th>Nama</th>
                        <th>Jabatan</th>
                        <th>Email</th>
                        <th>Aksi</th>
                      </tr>

                      {TableListsVendor &&
                        TableListsVendor.map((item, index) => {
                          return (
                            <>
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.name}</td>
                                <td>{item.position}</td>
                                <td>{item.email}</td>
                                <td>{actionButton}</td>
                              </tr>
                            </>
                          );
                        })}
                    </table>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      );
    default:
      return (
        <>
          <p>hello wolrd</p>
        </>
      );
  }
};

export default DistribusiPage;
