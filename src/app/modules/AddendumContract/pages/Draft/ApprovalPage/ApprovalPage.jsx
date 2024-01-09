import { connect } from "react-redux";
import { DEV_NODE } from "redux/BaseHost";
import React, { useEffect, useState } from "react";
import { fetch_api_sg } from "redux/globalReducer";
import DialogGlobal from "app/components/modals/DialogGlobal";
import { toAbsoluteUrl } from "_metronic/_helpers/AssetsHelpers";
import {
  submitUpdateContractApprovedVendor,
  submitUpdateContractApprovedUser,
} from "app/modules/AddendumContract/service/AddendumContractCrudService";

const ApprovalPage = ({
  isAdmin,
  isClient,
  isVendor,
  fetch_api_sg,
  contract_id,
}) => {
  const [data, setData] = useState([
    {
      approved_vendor: {
        is_vendor_approved: false,
        note: "",
      },
    },
    {
      approved_user: {
        is_user_approved: false,
        note: "",
      },
    },
  ]);
  const [dataNew, setDataNew] = useState();
  const [noteData, setNoteData] = useState({
    note_vendor: "",
    note_user: "",
  });

  useEffect(() => {
    setNoteData({
      ...noteData,
      note_vendor: data?.[0]?.approved_vendor?.note,
      note_user: data?.[1]?.approved_user?.note,
    });
  }, [data]);
  const openCloseDownloadVendor = React.useRef();
  const showDownloadVendor = () => {
    openCloseDownloadVendor.current.open();
  };

  // api 4.12
  const getAddContractFinalDraft = async () => {
    try {
      await fetch_api_sg({
        key: keys.fetch,
        type: "get",
        url: `/adendum/final-draft/${contract_id}`,
        onSuccess: (res) => {
          setDataNew(res.data[0]);
        },
      });
    } catch (error) {
      console.error("Error fetching user participant review:", error);
    }
  };

  // api 5.3
  const getApprovalById = async () => {
    try {
      await fetch_api_sg({
        key: keys.fetch,
        type: "get",
        url: `/adendum/approval/${contract_id}`,
        onSuccess: (res) => {
          const newData = res.data.map((item) => [
            { approved_vendor: { ...item.approved_vendor } },
            { approved_user: { ...item.approved_user } },
          ]);
          const flattenedData = [].concat(...newData);
          if (flattenedData.length > 0) {
            setData(flattenedData);
          }
        },
      });
    } catch (error) {
      console.error("Error fetching user participant review:", error);
    }
  };

  useEffect(() => {
    getApprovalById();
    getAddContractFinalDraft();
  }, []);

  // api 5.1
  const submitApprovalVendor = async () => {
    submitUpdateContractApprovedVendor(
      {
        note: noteData?.note_vendor,
      },
      data?.[0]?.approved_vendor?.id
    );
    alert("Berhasil Update Data");
    setTimeout(() => {
      window.location.reload(true);
    }, 3000);
  };
  // api 5.2
  const submitApprovalUser = async () => {
    submitUpdateContractApprovedUser(
      {
        note: noteData?.note_user,
      },
      data?.[1]?.approved_user?.id
    );
    alert("Berhasil Update Data");
    setTimeout(() => {
      window.location.reload(true);
    }, 3000);
  };

  const HeaderSection = () => {
    return (
      <>
        <DialogGlobal
          ref={openCloseDownloadVendor}
          isCancel={false}
          isSubmit={false}
          maxWidth={"xs"}
        >
          <div className="d-flex justify-content-center">
            <img src={toAbsoluteUrl("/media/svg/icons/All/Vector.png")} />
          </div>

          <p className="text-center mt-3" style={{ fontWeight: 600 }}>
            Unduh hasil approval vendor telah berhasil
          </p>
        </DialogGlobal>
      </>
    );
  };
  const renderApprovalSection = () => {
    switch (true) {
      case isAdmin:
        return (
          <>
            {data &&
              data.map((item, index) => (
                <div key={index}>
                  <h1
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                    }}
                  >
                    Persetujuan {index === 0 ? "Vendor" : "User"}
                  </h1>
                  <div
                    style={{
                      gap: 14,
                      display: "flex",
                      borderRadius: 8,
                      border: "1px solid black",
                      padding: "24px 28px",
                      flexDirection: "column",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        borderRadius: 8,
                        padding: "12px 10px",
                        alignItems: "center",
                        backgroundColor: "#e8f4fb",
                        border: "1px solid #000000",
                        color: item?.approved_vendor?.is_vendor_approved
                          ? "#3699ff"
                          : "red",
                      }}
                    >
                      <p
                        style={{
                          margin: 0,
                        }}
                      >
                        Addendum{" "}
                        {`${
                          item?.approved_vendor?.is_vendor_approved
                            ? "disetujui"
                            : "belum disetujui"
                        }`}{" "}
                        {index === 0 ? "vendor" : "user"}
                      </p>
                    </div>
                    <div className="catatan">
                      <h6>Catatan {index === 0 ? "Vendor" : "User"}</h6>
                      {item && (
                        <textarea
                          rows={3}
                          name={`catatan`}
                          disabled={isAdmin}
                          className="form-control"
                          value={
                            item[
                              index === 0 ? "approved_vendor" : "approved_user"
                            ]?.note
                          }
                          style={{
                            width: "100%",
                            borderRadius: 8,
                            color: "#3699ff",
                            border: "1px solid #000000",
                            backgroundColor: "#e8f4fb",
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </>
        );

      case isVendor:
        return (
          <div className="vendor">
            <p>Ketentuan persetujuan:</p>
            <div className="ketentuan-persetujuan">
              <ol
                style={{
                  padding: 10,
                }}
              >
                <li>A</li>
                <li>B</li>
                <li>C</li>
              </ol>
            </div>
            <div
              style={{
                border: "1px solid black",
                borderRadius: 8,
                padding: 28,
              }}
            >
              <h1
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                }}
              >
                Form Unduh Addendum Kontrak
              </h1>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                }}
              >
                Catatan Admin:
                <span
                  style={{
                    color: "#dc0526",
                    fontSize: 12,
                    fontWeight: 400,
                  }}
                >
                  {dataNew?.full_add_contract_comment}
                </span>
                <div
                  style={{
                    borderRadius: 8,
                    padding: "12px 10px",
                    border: "1px solid black",
                  }}
                >
                  <a
                    href={`${DEV_NODE}/final_draft/full/${dataNew?.full_add_contract_file_name}`}
                    target="_blank"
                  >
                    {dataNew?.full_add_contract_file_name}
                  </a>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                  }}
                >
                  <button
                    onClick={() => {
                      // showDownloadVendor();
                      window.open(
                        `${DEV_NODE}/final_draft/full/${dataNew?.full_add_contract_file_name}`,
                        "_blank"
                      );
                    }}
                    className="btn btn-primary"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="17"
                      viewBox="0 0 16 17"
                      fill="none"
                    >
                      <path
                        d="M11.9225 4.67033C11.765 4.51366 11.5492 4.43449 11.3333 4.43449C11.1175 4.43449 10.9017 4.51366 10.7442 4.67033L8.83333 6.58116V1.00033C8.83333 0.779312 8.74554 0.56735 8.58926 0.41107C8.43297 0.25479 8.22101 0.166992 8 0.166992C7.77899 0.166992 7.56702 0.25479 7.41074 0.41107C7.25446 0.56735 7.16667 0.779312 7.16667 1.00033V6.58116L5.25583 4.67033C5.17862 4.59267 5.08682 4.53105 4.98571 4.489C4.8846 4.44694 4.77617 4.4253 4.66667 4.4253C4.55716 4.4253 4.44873 4.44694 4.34762 4.489C4.24651 4.53105 4.15471 4.59267 4.0775 4.67033C3.92127 4.8266 3.83351 5.03852 3.83351 5.25949C3.83351 5.48046 3.92127 5.69239 4.0775 5.84866L8 9.75033L11.9242 5.84699C12.0797 5.69057 12.1668 5.47888 12.1665 5.25831C12.1662 5.03775 12.0784 4.82631 11.9225 4.67033ZM15.4892 11.8337C15.4928 11.7447 15.4818 11.6557 15.4567 11.5703L13.79 6.57033C13.735 6.40432 13.629 6.25988 13.4872 6.15755C13.3454 6.05522 13.1749 6.00021 13 6.00033H12.8175C12.7392 6.15699 12.6425 6.30699 12.5117 6.43783L11.2767 7.66699H12.4L13.7892 11.8337H2.21167L3.60083 7.66699H4.72417L3.48833 6.43783C3.36309 6.30975 3.25976 6.16194 3.1825 6.00033H3C2.82511 6.00021 2.65464 6.05522 2.51281 6.15755C2.37098 6.25988 2.26503 6.40432 2.21 6.57033L0.543333 11.5703C0.518218 11.6557 0.50724 11.7447 0.510833 11.8337C0.5 11.8337 0.5 16.0003 0.5 16.0003C0.5 16.2213 0.587797 16.4333 0.744078 16.5896C0.900358 16.7459 1.11232 16.8337 1.33333 16.8337H14.6667C14.8877 16.8337 15.0996 16.7459 15.2559 16.5896C15.4122 16.4333 15.5 16.2213 15.5 16.0003C15.5 16.0003 15.5 11.8337 15.4892 11.8337Z"
                        fill="white"
                      />
                    </svg>{" "}
                    Unduh Addendum Kontrak
                  </button>
                </div>
              </div>
            </div>
            <div className="update-catatan mt-8">
              <div
                style={{
                  padding: 28,
                  display: "flex",
                  borderRadius: 8,
                  border: "1px solid black",
                  padding: "24px 28px",
                  flexDirection: "column",
                }}
              >
                <h1
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                  }}
                >
                  Persetujuan Vendor
                </h1>
                <div className="catatan">
                  <h6>Catatan Vendor</h6>
                  <textarea
                    rows={3}
                    name={`catatan`}
                    disabled={isAdmin}
                    className="form-control"
                    style={{
                      width: "100%",
                      borderRadius: 8,
                      border: "1px solid #000000",
                      backgroundColor: "#ffffff",
                    }}
                    onChange={(e) =>
                      setNoteData({ ...noteData, note_vendor: e.target.value })
                    }
                    value={noteData?.note_vendor}
                  />
                </div>
                {/* {!noteData?.note_vendor && ( */}
                {!data?.[0]?.approved_vendor?.note && (
                  <>
                    <p style={{ color: "red" }}>
                      *Mohon klik tombol setuju untuk menyelesaikan persetujuan
                    </p>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-start",
                      }}
                    >
                      <button
                        type="submit"
                        className="btn btn-primary"
                        onClick={submitApprovalVendor}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          class="bi bi-check-lg"
                          viewBox="0 0 16 16"
                        >
                          <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z" />
                        </svg>{" "}
                        Setuju
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        );

      case isClient:
        return (
          <div className="client">
            <div
              style={{
                gap: 14,
                display: "flex",
                borderRadius: 8,
                border: "1px solid black",
                padding: "24px 28px",
                flexDirection: "column",
              }}
            >
              <h1
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                }}
              >
                Persetujuan User
              </h1>
              <div className="catatan">
                <h6>Catatan User</h6>
                <textarea
                  rows={3}
                  name={`catatan`}
                  disabled={isAdmin}
                  className="form-control"
                  style={{
                    width: "100%",
                    borderRadius: 8,
                    border: "1px solid #000000",
                    backgroundColor: "#ffffff",
                  }}
                  onChange={(e) =>
                    setNoteData({ ...noteData, note_user: e.target.value })
                  }
                  value={noteData?.note_user}
                />
              </div>
              {!data?.[1]?.approved_user?.note && (
                <>
                  <p style={{ color: "red" }}>
                    *Mohon klik tombol setuju untuk menyelesaikan persetujuan
                  </p>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                    }}
                  >
                    <button
                      type="submit"
                      className="btn btn-primary"
                      onClick={submitApprovalUser}
                      disabled={!data?.[0]?.approved_vendor?.is_vendor_approved}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="bi bi-check-lg"
                        viewBox="0 0 16 16"
                      >
                        <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z" />
                      </svg>{" "}
                      Setuju
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <div
        style={{
          backgroundColor: "white",
          padding: 28,
          display: "flex",
          flexDirection: "column",
          gap: 28,
        }}
      >
        {HeaderSection()}
        {renderApprovalSection()}
      </div>
    </>
  );
};
const keys = {
  getAddendumDetail: "get-addendum-contract-by-id ",
};

const mapDispatch = {
  fetch_api_sg,
};

export default connect(null, mapDispatch)(ApprovalPage);
