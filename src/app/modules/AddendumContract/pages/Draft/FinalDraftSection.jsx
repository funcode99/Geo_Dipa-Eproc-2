import SVG from "react-inlinesvg";
import React, { useState } from "react";
import { API_EPROC, DEV_NODE } from "redux/BaseHost";
import { toAbsoluteUrl } from "_metronic/_helpers/AssetsHelpers";

const FinalDraftSection = ({ finalDraftData }) => {
  const [finalDraftSelectValue, setFinalDraftSelectValue] = useState("Kontrak");

  const HeaderSection = () => {
    return (
      <>
        <h1
          style={{
            fontSize: 12,
            fontWeight: 400,
          }}
        >
          Silahkan download file final draft dibawah ini:
        </h1>
        <select
          style={{
            borderRadius: 4,
            padding: "10px 12px",
            width: 310,
            backgroundColor: "#e8f4fb",
          }}
          onChange={(e) => setFinalDraftSelectValue(e.target.value)}
        >
          <option value="Kontrak">Final Draft Kontrak</option>
          {finalDraftData?.add_contracts?.length > 0 && (
            <option value="Addendum">Final Draft Addendum 1</option>
          )}
          {finalDraftData?.add_contracts?.length > 1 && (
            <option value="Addendum_2">Final Draft Addendum 2</option>
          )}
        </select>
      </>
    );
  };

  switch (finalDraftSelectValue) {
    case "Kontrak":
      return (
        <div
          style={{
            backgroundColor: "white",
            padding: 28,
            marginTop: 24,
            marginBottom: 24,
            borderRadius: 5,
          }}
        >
          <HeaderSection />
          <div
            style={{
              minHeight: 100,
              marginTop: 10,
              marginBottom: 10,
              fontSize: 12,
              fontWeight: 400,
              color: "#3699ff",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 6,
              }}
            >
              <SVG
                src={toAbsoluteUrl("/media/svg/icons/All/file-final-draft.svg")}
              />
              <a
                style={{
                  marginBottom: "1rem",
                }}
                onClick={() =>
                  window.open(
                    `${API_EPROC}/${finalDraftData?.form_review?.spk_name}`,
                    "_blank"
                  )
                }
              >
                {finalDraftData?.form_review?.spk_name}
              </a>
            </div>
            {Object.keys(finalDraftData?.form_review || {}).map((key) => {
              if (
                key.startsWith("lampiran_") &&
                key.endsWith("_name") &&
                finalDraftData?.form_review[key] !== ""
              ) {
                const index = parseInt(
                  key.replace("lampiran_", "").replace("_name", ""),
                  10
                );
                return (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      gap: 6,
                    }}
                  >
                    <SVG
                      src={toAbsoluteUrl(
                        "/media/svg/icons/All/file-final-draft.svg"
                      )}
                    />
                    <a
                      style={{
                        marginBottom: "1rem",
                      }}
                      onClick={() =>
                        window.open(
                          `${API_EPROC}/${finalDraftData?.form_review[key]}`,
                          "_blank"
                        )
                      }
                    >
                      {finalDraftData?.form_review[key]}
                    </a>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
      );

    case "Addendum":
      return (
        <div
          style={{
            backgroundColor: "white",
            padding: 28,
            marginTop: 24,
            marginBottom: 24,
            borderRadius: 5,
          }}
        >
          <HeaderSection />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 14,
            }}
          >
            <p>Perihal: {finalDraftData?.add_contracts[0]?.perihal}</p>
            <div
              style={{
                display: "flex",
                gap: 6,
              }}
            >
              <SVG
                src={toAbsoluteUrl("/media/svg/icons/All/file-final-draft.svg")}
              />
              <a
                style={{
                  fontSize: 12,
                  fontWeight: 400,
                  color: "#3699ff",
                  marginBottom: "1rem",
                }}
                onClick={() =>
                  window.open(
                    `${DEV_NODE}/final_draft/${finalDraftData?.add_contracts[0]?.final_draft[0]?.body_file_name}`,
                    "_blank"
                  )
                }
              >
                {
                  finalDraftData?.add_contracts[0]?.final_draft[0]
                    ?.body_file_name
                }
              </a>
            </div>
            {finalDraftData?.add_contracts[0]?.final_draft[0]?.lampiran_data?.map(
              (item) => {
                return (
                  <div
                    style={{
                      display: "flex",
                      gap: 6,
                    }}
                  >
                    <SVG
                      src={toAbsoluteUrl(
                        "/media/svg/icons/All/file-final-draft.svg"
                      )}
                    />
                    <a
                      style={{
                        fontSize: 12,
                        fontWeight: 400,
                        color: "#3699ff",
                        marginBottom: "1rem",
                      }}
                      onClick={() =>
                        window.open(
                          `${DEV_NODE}/final_draft/lampiran/${item?.lampiran_file_name}`,
                          "_blank"
                        )
                      }
                    >
                      {item?.lampiran_file_name}
                    </a>
                  </div>
                );
              }
            )}
          </div>
        </div>
      );

    case "Addendum_2":
      return (
        <div
          style={{
            backgroundColor: "white",
            padding: 28,
            marginTop: 24,
            marginBottom: 24,
            borderRadius: 5,
          }}
        >
          <HeaderSection />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 14,
            }}
          >
            <p>Perihal: {finalDraftData?.add_contracts[1]?.perihal}</p>
            <div
              style={{
                display: "flex",
                gap: 6,
              }}
            >
              <SVG
                src={toAbsoluteUrl("/media/svg/icons/All/file-final-draft.svg")}
              />
              <a
                style={{
                  fontSize: 12,
                  fontWeight: 400,
                  color: "#3699ff",
                  marginBottom: "1rem",
                }}
                onClick={() =>
                  window.open(
                    `${DEV_NODE}/final_draft/${finalDraftData?.add_contracts[1]?.final_draft[0]?.body_file_name}`,
                    "_blank"
                  )
                }
              >
                {
                  finalDraftData?.add_contracts[1]?.final_draft[0]
                    ?.body_file_name
                }
              </a>
            </div>
            {finalDraftData?.add_contracts[1]?.final_draft[0]?.lampiran_data?.map(
              (item) => {
                return (
                  <div
                    style={{
                      display: "flex",
                      gap: 6,
                    }}
                  >
                    <SVG
                      src={toAbsoluteUrl(
                        "/media/svg/icons/All/file-final-draft.svg"
                      )}
                    />
                    <a
                      style={{
                        fontSize: 12,
                        fontWeight: 400,
                        color: "#3699ff",
                        marginBottom: "1rem",
                      }}
                      onClick={() =>
                        window.open(
                          `${DEV_NODE}/final_draft/lampiran/${item?.lampiran_file_name}`,
                          "_blank"
                        )
                      }
                    >
                      {item?.lampiran_file_name}
                    </a>
                  </div>
                );
              }
            )}
          </div>
        </div>
      );
    default:
      return (
        <>
          <p>hello wolrd</p>
        </>
      );
  }
};

export default FinalDraftSection;
