import React from "react";

const ApprovalPage = ({ isAdmin }) => {
  switch (isAdmin) {
    case false:
      return (
        <div
          style={{
            backgroundColor: "white",
            padding: 28,
            display: "flex",
            flexDirection: "column",
            gap: 28,
          }}
        >
          <div>
            <span>Ketentuan persetujuan:</span>
            <ol
              style={{
                margin: 0,
                padding: 0,
              }}
            >
              <li>A</li>
              <li>B</li>
              <li>C</li>
            </ol>
          </div>

          <div
            style={{
              border: 1,
              borderStyle: "solid",
              borderColor: "black",
              borderRadius: 4,
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
                Unduh Kontrak ini, di TTD sebagai persetujuan vendor dan unggah
                kembali dalam bentuk pdf
              </span>
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
              <button
                onClick={showDownloadVendor}
                className="btn btn-primary"
                style={{
                  maxWidth: 270,
                }}
              >
                Unduh Addendum Kontrak
              </button>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 14,
              border: 1,
              borderStyle: "solid",
              borderColor: "black",
              borderRadius: 4,
              padding: 28,
            }}
          >
            <p
              style={{
                padding: 0,
                margin: 0,
                color: "black",
                fontSize: 16,
                fontWeight: 600,
              }}
            >
              Persetujuan Vendor
            </p>
            <div>
              Catatan Vendor
              <textarea
                rows="4"
                className="form-control"
                value={"sudah oke"}
              ></textarea>
            </div>
            <button
              onClick={showDownloadUser}
              className="btn btn-primary"
              style={{
                maxWidth: 270,
              }}
            >
              Setuju
            </button>
          </div>
        </div>
      );
    case true:
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
            <div>
              <h1
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                }}
              >
                Persetujuan Vendor
              </h1>
              <div
                style={{
                  border: 1,
                  borderRadius: 4,
                  borderStyle: "solid",
                  borderColor: "black",
                  padding: "24px 28px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                }}
              >
                <div
                  style={{
                    padding: "12px 10px",
                    backgroundColor: "#e8f4fb",
                    color: "#3699ff",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                    }}
                  >
                    Addendum disetujui vendor
                  </p>
                </div>
                <div>
                  <p
                    style={{
                      margin: 0,
                    }}
                  >
                    Catatan Vendor
                  </p>
                  <textarea>Sudah Oke</textarea>
                </div>
              </div>
            </div>
            <div>
              <h1
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                }}
              >
                Persetujuan User
              </h1>
              <div
                style={{
                  border: 1,
                  borderRadius: 4,
                  borderStyle: "solid",
                  borderColor: "black",
                  padding: "24px 28px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                }}
              >
                <div
                  style={{
                    padding: "12px 10px",
                    backgroundColor: "#e8f4fb",
                    color: "#3699ff",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                    }}
                  >
                    Addendum disetujui user
                  </p>
                </div>
                <div>
                  <p
                    style={{
                      margin: 0,
                    }}
                  >
                    Catatan Vendor
                  </p>
                  <textarea>Sudah Oke</textarea>
                </div>
              </div>
            </div>
          </div>
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

export default ApprovalPage;
