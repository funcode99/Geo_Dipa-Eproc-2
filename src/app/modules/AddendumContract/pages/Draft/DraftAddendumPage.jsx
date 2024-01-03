import SVG from "react-inlinesvg";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import Subheader from "app/components/subheader";
import { Card } from "_metronic/_partials/controls";
import { Col, Row, Container } from "react-bootstrap";
import SubBreadcrumbs from "app/components/SubBreadcrumbs";
import React, { useState, useRef, useEffect } from "react";
import DialogGlobal from "app/components/modals/DialogGlobal";
import Steppers from "app/components/steppersCustom/Steppers";
import { fetch_api_sg, getLoading } from "redux/globalReducer";
import { toAbsoluteUrl } from "_metronic/_helpers/AssetsHelpers";
import {
  DUMMY_STEPPER_CONTRACT,
  STATE_STEPPER,
} from "../Termin/TerminPageNew/STATIC_DATA";

import TemplateKlausul from "./TemplateKlausul";
import ReviewPage from "./ReviewPage/ReviewPage";
import FinalDraftSection from "./FinalDraftSection";
import ApprovalPage from "./ApprovalPage/ApprovalPage";
import FormParameter from "./FormParameter/FormParameter";
import DistribusiPage from "./DistribusiPage/DistribusiPage";

const DraftAddendumPage = ({
  rolesEproc,
  loginStatus,
  purch_group,
  fetch_api_sg,
  dataNewClause,
  dataNewClauseDrafting,
}) => {
  const { draft_id } = useParams();
  const [data, setData] = useState({});
  const [PICData, setPICData] = useState();
  const [jsonData, setJsonData] = useState();
  const [contract, setContract] = useState({});
  const [jobDirector, setJobDirector] = useState();
  const [sequence, setSequence] = React.useState(0);
  const [jobSupervisor, setJobSupervisor] = useState();
  const [finalDraftData, setFinalDraftData] = useState();
  const [jobSupervisor2, setJobSupervisor2] = useState();
  const [dataContractById, setDataContractById] = useState({});
  const [authorizedOfficial, setauthorizedOfficial] = useState();
  const [accountNumberBankData, setAccountNumberBankData] = useState();
  const [secondAuthorizedOfficial, setSecondAuthorizedOfficial] = useState();

  const getClientStatus = (val) => {
    const filteredData = rolesEproc?.filter(
      ({ ident_name }) => ident_name === val
    );
    return !!filteredData?.length > 0;
  };

  const isAdmin =
    getClientStatus("SUPERADMIN") ||
    getClientStatus("ADMIN_CONTRACT") ||
    getClientStatus("ADMIN_CONTRACT_UNIT") ||
    purch_group === data?.admin_purch_group_id;
  const isVendor = getClientStatus("VENDOR");
  const isClient = loginStatus === "client";

  const getAddendum = async () => {
    try {
      await fetch_api_sg({
        key: keys.getAddendumDetail,
        type: "get",
        url: `/adendum/add-contracts/${draft_id}`,
        onSuccess: (res) => {
          setContract(res?.data?.contract);
          setData(res?.data);
          getContractById(res.data.contract_id);
        },
      });
    } catch (error) {
      console.error("Error fetching addendum:", error);
    }
  };

  // api 1.2
  const getContractById = async (id) => {
    try {
      await fetch_api_sg({
        key: keys.getAddendumDetail,
        type: "get",
        url: `/adendum/contract-released/${id}/show`,
        onSuccess: (res) => {
          setDataContractById(res?.data);
          getSecondAuthorizedOfficial(res.data.vendor_id);
        },
      });
    } catch (error) {
      console.error("Error fetching contract by ID:", error);
    }
  };

  const toPush = useRef();
  const setPush = (e) => {
    toPush.current.click();
  };

  const openCloseAddAttachment = React.useRef();
  const showAddAttachment = () => {
    openCloseAddAttachment.current.open();
  };

  const openCloseAddChecklistAddendum = React.useRef();

  // get api 2.23
  const getFinalDraftData = async (contract_id) => {
    fetch_api_sg({
      key: keys.fetch,
      type: "get",
      url: `/adendum/contract-final-draft/${contract_id}/show`,
      onSuccess: (res) => {
        setFinalDraftData(res.data);
      },
    });
  };

  const getDataContractHeader = async () => {
    try {
      await fetch_api_sg({
        key: keys.fetch,
        type: "get",
        url: `/adendum/add-contracts/${draft_id}`,
        onSuccess: (res) => {
          getFinalDraftData(res?.data?.contract_id);
          setJsonData(res?.data);
          localStorage.setItem(
            "payment_method",
            JSON.stringify(res?.data?.payment_method_data)
          );
          localStorage.setItem(
            "fine",
            JSON.stringify(res?.data?.penalty_fine_data)
          );
          localStorage.setItem(
            "time_period",
            JSON.stringify({
              from_time: res?.data?.from_time,
              thru_time: res?.data?.thru_time,
              worked_start_date: res?.data?.worked_start_date,
              worked_end_date: res?.data?.worked_end_date,
              guarantee_start_date: res?.data?.guarantee_start_date,
              guarantee_end_date: res?.data?.guarantee_end_date,
              maintenance_start_date: res?.data?.maintenance_start_date,
              maintenance_end_date: res?.data?.maintenance_end_date,
              contract_period_type: res?.data?.contract_period_type,
              work_period_type: res?.data?.work_period_type,
              contract_period_range_day: res?.data?.contract_period_range_day,
              contract_period_range_month:
                res?.data?.contract_period_range_month,
              work_implement_period_day: res?.data?.work_implement_period_day,
              work_implement_period_month:
                res?.data?.work_implement_period_month,
              guarantee_period_day: res?.data?.guarantee_period_day,
              guarantee_period_month: res?.data?.guarantee_period_month,
              maintenance_period_day: res?.data?.maintenance_period_day,
              maintenance_period_month: res?.data?.maintenance_period_month,
            })
          );
        },
      });
    } catch (error) {
      console.error("Error fetching data contract header:", error);
    }
  };

  const getauthorizedOfficial = async () => {
    try {
      await fetch_api_sg({
        key: keys.fetch,
        type: "get",
        url: `/adendum/job-directors`,
        onSuccess: (res) => {
          setauthorizedOfficial(res.data);
        },
      });
    } catch (error) {
      console.error("Error fetching authorized officials:", error);
    }
  };

  // api 2.17
  const getSecondAuthorizedOfficial = async (id) => {
    fetch_api_sg({
      key: keys.fetch,
      type: "get",
      url: `/adendum/refference/get-vendor/${id}`,
      onSuccess: (res) => {
        setSecondAuthorizedOfficial(res.data.officer_data);
        setPICData(res.data.pic_data);
        setAccountNumberBankData(res.data.bank_data);
      },
    });
  };

  const getJobDirector = async () => {
    try {
      await fetch_api_sg({
        key: keys.fetch,
        type: "get",
        url: `/adendum/direksi-pekerjaan`,
        onSuccess: (res) => {
          setJobDirector(res.data);
        },
      });
    } catch (error) {
      console.error("Error fetching job directors:", error);
    }
  };

  const getJobSupervisor = async () => {
    try {
      await fetch_api_sg({
        key: keys.fetch,
        type: "get",
        url: `/adendum/refference/get-all-plants`,
        onSuccess: (res) => {
          setJobSupervisor(res.data);
          localStorage.setItem("job_supervisor", JSON.stringify(res.data));
          setJobSupervisor2(JSON.parse(localStorage.getItem("job_supervisor")));
        },
      });
    } catch (error) {
      console.error("Error fetching job supervisors:", error);
    }
  };

  if (!Array.isArray(authorizedOfficial)) {
    console.error("Data is not an array.");
  } else {
    const indexToMove = authorizedOfficial.findIndex(
      (item) =>
        item.authorized_official_username ===
        jsonData?.add_contract_party?.party_1_autorized_username
    );

    if (indexToMove !== -1) {
      const itemToMove = authorizedOfficial[indexToMove];
      authorizedOfficial.splice(indexToMove, 1);
      authorizedOfficial.unshift(itemToMove);
    }
  }
  if (!Array.isArray(secondAuthorizedOfficial)) {
    console.error("Data is not an array.");
  } else {
    const indexToMove = secondAuthorizedOfficial.findIndex(
      (item) =>
        item.authorized_official_username ===
        jsonData?.add_contract_party?.party_2_autorized_username
    );

    if (indexToMove !== -1) {
      const itemToMove = secondAuthorizedOfficial[indexToMove];
      secondAuthorizedOfficial.splice(indexToMove, 1);
      secondAuthorizedOfficial.unshift(itemToMove);
    }
  }
  if (!Array.isArray(jobDirector)) {
    console.error("Data is not an array.");
  } else {
    const indexToMove = jobDirector.findIndex(
      (item) =>
        item.username ===
        jsonData?.add_contract_party?.party_1_job_director[0]
          .party_1_job_director_username
    );

    if (indexToMove !== -1) {
      const itemToMove = jobDirector[indexToMove];
      jobDirector.splice(indexToMove, 1);
      jobDirector.unshift(itemToMove);
    }
  }
  if (!Array.isArray(jobSupervisor)) {
    console.error("Data is not an array.");
  } else {
    const indexToMove = jobSupervisor.findIndex(
      (item) =>
        item.facility_name ===
        jsonData?.add_contract_party?.party_1_job_director[0]?.facility_name
    );

    if (indexToMove !== -1) {
      const itemToMove = jobSupervisor[indexToMove];
      jobSupervisor.splice(indexToMove, 1);
      jobSupervisor.unshift(itemToMove);
    }
  }
  if (!Array.isArray(jobSupervisor2)) {
    console.error("Data is not an array.");
  } else {
    const indexToMove = jobSupervisor2.findIndex(
      (item) =>
        item.address ===
        jsonData?.add_contract_party?.party_1_job_supervisor[0]
          ?.party_1_job_supervisor_address
    );

    if (indexToMove !== -1) {
      const itemToMove = jobSupervisor2[indexToMove];
      jobSupervisor2.splice(indexToMove, 1);
      jobSupervisor2.unshift(itemToMove);
    }
  }

  useEffect(() => {
    getAddendum();
    // para pihak
    getJobDirector();
    getJobSupervisor();
    getauthorizedOfficial();
    getDataContractHeader();
  }, []);
  return (
    <>
      <DialogGlobal
        ref={openCloseAddChecklistAddendum}
        isCancel={false}
        isSubmit={false}
        maxWidth={"md"}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 40,
          }}
        >
          <p
            style={{
              fontSize: 16,
              fontWeight: 600,
            }}
          >
            Checklist Addendum Kontrak
          </p>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 28,
          }}
        >
          <div
            style={{
              display: "flex",
            }}
          >
            <div className="col-sm-3">1. No Kontrak</div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                textAlign: "center",
              }}
            >
              <div>{data?.add_doc_number}</div>
              <div>Tanggal</div>
              <div>14 Jan 2021</div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
            }}
          >
            <div className="col-sm-3">2. Jenis Kontrak</div>

            <label
              style={{
                display: "flex",
                gap: 8,
              }}
            >
              <input type="checkbox" />
              <span>Kontrak Unit Price</span>
            </label>
          </div>

          <div
            style={{
              display: "flex",
            }}
          >
            <div className="col-sm-3">3. Nama Pekerjaan</div>

            <span>Pengadaan Material Gasket Spiral Wound & Rupture Disk</span>
          </div>

          <div
            style={{
              display: "flex",
            }}
          >
            <div className="col-sm-3">4. Penyedia</div>

            <span>PT. PANCA ENERGI MAKMUR</span>
          </div>

          <div
            style={{
              display: "flex",
            }}
          >
            <div className="col-sm-3">5. Pejabat Berwenang</div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              }}
            >
              <label
                style={{
                  display: "flex",
                  gap: 8,
                }}
              >
                <input type="checkbox" />
                Lien Kardani
              </label>
              <span>General Manager Unit Patuha</span>
            </div>
          </div>
          <div
            style={{
              display: "flex",
            }}
          >
            <div className="col-sm-3">6. Direksi Pekerjaan:</div>

            <label
              style={{
                display: "flex",
                gap: 8,
              }}
            >
              <input type="checkbox" />
              HSSE Manager
            </label>
          </div>

          <div
            style={{
              display: "flex",
            }}
          >
            <div className="col-sm-3">7. Harga Pekerjaan (inc PPN):</div>

            <i>IDR Rp 8.164.200.000,00</i>
          </div>
          <div
            style={{
              display: "flex",
            }}
          >
            <div className="col-sm-3">8. Cara Pembayaran:</div>

            <label
              style={{
                display: "flex",
                gap: 8,
              }}
            >
              <input type="checkbox" />
              100%
            </label>
          </div>
          <div
            style={{
              display: "flex",
            }}
          >
            <div className="col-sm-3">9. Jangka Waktu:</div>

            <div>
              <label
                style={{
                  display: "flex",
                  gap: 8,
                }}
              >
                <input type="checkbox" />
                Pelaksanaan Pekerjaan 29 Agustus 2023 - 27 Oktober 2023
              </label>
              <label
                style={{
                  display: "flex",

                  gap: 8,
                }}
              >
                <input type="checkbox" />
                Garansi (Barang/Jasa) 28 Oktober 2023 - 27 Oktober 2024
              </label>
            </div>
          </div>
          <div
            style={{
              display: "flex",
            }}
          >
            <div className="col-sm-3">10. Denda:</div>

            <div>
              <label
                style={{
                  display: "flex",
                  gap: 8,
                }}
              >
                <input type="checkbox" />
                Pelaksanaan Pekerjaan 29 Agustus 2023 - 27 Oktober 2023
              </label>
              <label
                style={{
                  display: "flex",

                  gap: 8,
                }}
              >
                <input type="checkbox" />
                Garansi (Barang/Jasa) 28 Oktober 2023 - 27 Oktober 2024
              </label>
            </div>
          </div>
          <div className="col-sm-3">11. Jaminan:</div>
          <div
            style={{
              padding: "0 12.5px",
            }}
          >
            12. Addendum
          </div>
          <div
            style={{
              padding: "0 12.5px",
            }}
          >
            <div
              style={{
                marginBottom: "14px",
              }}
            >
              A. Perihal
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                columnGap: 8,
              }}
            >
              <label
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                }}
              >
                <input
                  type="checkbox"
                  name="checked"
                  value="parties"
                  style={{
                    height: 20,
                    width: 20,
                  }}
                />
                Data Para Pihak
              </label>
              <label
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                }}
              >
                <input
                  type="checkbox"
                  name="checked"
                  value="payment_method"
                  style={{
                    height: 20,
                    width: 20,
                  }}
                />
                Metode Pembayaran
              </label>
              <label
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                }}
              >
                <input
                  type="checkbox"
                  name="checked"
                  value="fine"
                  style={{
                    height: 20,
                    width: 20,
                  }}
                />
                Denda
              </label>
              <label
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                }}
              >
                <input
                  type="checkbox"
                  name="checked"
                  value="account_number"
                  style={{
                    height: 20,
                    width: 20,
                  }}
                />
                Nomor Rekening
              </label>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                columnGap: 8,
              }}
            >
              <label
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                }}
              >
                <input
                  type="checkbox"
                  name="checked"
                  value="job_price"
                  style={{
                    height: 20,
                    width: 20,
                  }}
                />
                Harga Pekerjaan
              </label>
              <label
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                }}
              >
                <input
                  type="checkbox"
                  name="checked"
                  value="time_period"
                  style={{
                    height: 20,
                    width: 20,
                  }}
                />
                Jangka Waktu
              </label>
              <label
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                }}
              >
                <input
                  type="checkbox"
                  name="checked"
                  value="guarantee"
                  style={{
                    height: 20,
                    width: 20,
                  }}
                />
                Jaminan
              </label>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <div className="col-sm-5">B. Nilai Addendum (exc PPN)</div>
            <input
              className="col-sm-7"
              style={{
                padding: "10px 12px",
                fontSize: "14px",
                fontWeight: 500,
                color: "#403f3f",
                borderRadius: 4,
              }}
              value={"Rp 121.100.000,00"}
            />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <div className="col-sm-5">
              C. Nilai Perjanjian Setelah Addendum (exc PPN)
            </div>
            <input
              className="col-sm-7"
              type="text"
              style={{
                padding: "10px 12px",
                fontSize: "14px",
                fontWeight: 500,
                color: "#403f3f",
                borderRadius: 4,
              }}
              value={"Rp 7.300.900.000,00"}
            />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <div className="col-sm-5">D. Kesimpulan</div>
            <input
              className="col-sm-7"
              type="text"
              style={{
                padding: "10px 12px",
                fontSize: "14px",
                fontWeight: 500,
                color: "#403f3f",
                borderRadius: 4,
              }}
              value={
                "Harga pekerjaan setelah addendum dibawah 10% dari harga pekerjaan awal"
              }
            />
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <div className="col-sm-5"></div>
            <div
              style={{
                display: "flex",
                gap: 20,
              }}
            >
              <label
                style={{
                  display: "flex",
                  gap: 8,
                }}
              >
                <input type="checkbox" />
                Justifikasi
              </label>
              <label
                style={{
                  display: "flex",
                  gap: 8,
                }}
              >
                <input type="checkbox" />
                Justifikasi & Radir
              </label>
            </div>
          </div>
        </div>
      </DialogGlobal>

      <DialogGlobal
        ref={openCloseAddAttachment}
        isCancel={false}
        isSubmit={true}
        onYes={setPush}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <Row>
            <Col md={6}>
              Nama Lampiran
              <input
                value={"Lampiran 3"}
                style={{
                  padding: 8,
                  fontSize: 12,
                  fontWeight: 500,
                  width: "100%",
                }}
              />
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              Pilih File
              <div
                style={{
                  padding: 8,
                  border: 1,
                  borderStyle: "solid",
                  borderColor: "#8c8a8a",
                  opacity: 0.8,
                  borderRadius: 4,
                }}
              >
                <a
                  style={{
                    color: "#3699ff",
                    fontSize: 12,
                    fontWeight: 400,
                  }}
                >
                  001.KTR-DNG1.PBJ-GDE-I-2022.Lamp-2.Perjanjian.Admin_Zulfiqur_Rahman.07-08-2022
                  1437.V0_ADD.docx
                </a>
              </div>
            </Col>
          </Row>

          <Row>
            <Col>
              Komentar*
              <div>
                <textarea
                  name="comment"
                  value={
                    "Terlampir draft addendum kontrak, mohon user untuk direview"
                  }
                  rows="4"
                  className="form-control"
                ></textarea>
              </div>
            </Col>
          </Row>
        </div>
      </DialogGlobal>

      <Subheader text={`No Dokumen Addendum : ${data?.add_doc_number}`} />

      <SubBreadcrumbs
        items={[
          {
            label: `Addendum Contract`,
          },
          {
            label: "List of Addendum",
            to: `/client/addendum-contract/list-of-addendum`,
          },
          {
            label: `${data?.add_doc_number} - ${data?.contract?.contract_name}`,
          },
        ]}
      />

      <div className="mb-4">
        <Steppers
          steps={
            data?.steppers
              ? DUMMY_STEPPER_CONTRACT
              : data?.steppers?.map((el) => ({
                  label: el.label,
                  status: STATE_STEPPER[el.state],
                }))
          }
        />
      </div>

      <Card>
        <form
          style={{
            padding: 28,
          }}
        >
          <Container>
            <Row>
              {!isVendor && (
                <Col>
                  <div
                    className="d-flex flex-column align-items-center"
                    style={{
                      backgroundColor: "white",
                      flexGrow: 1,
                      borderTopLeftRadius: 14,
                      cursor: "pointer",
                      gap: 4,
                    }}
                    onClick={() => setSequence(0)}
                  >
                    {sequence === 0 ? (
                      <SVG
                        src={toAbsoluteUrl(
                          "/media/svg/icons/All/form-parameter.svg"
                        )}
                      />
                    ) : (
                      <SVG
                        src={toAbsoluteUrl(
                          "/media/svg/icons/All/form-parameter-black.svg"
                        )}
                      />
                    )}
                    <h1
                      style={{
                        fontSize: 14,
                        color: sequence === 0 ? "#3699ff" : "#8c8a8a",
                      }}
                    >
                      Form Parameter
                    </h1>
                  </div>
                </Col>
              )}

              {isAdmin && (
                <Col>
                  <div
                    className="d-flex flex-column align-items-center"
                    style={{
                      backgroundColor: "white",
                      flexGrow: 1,
                      cursor: "pointer",
                      borderTopRightRadius: 14,
                      gap: 4,
                    }}
                    onClick={() => setSequence(1)}
                  >
                    {sequence === 1 ? (
                      <SVG
                        src={toAbsoluteUrl(
                          "/media/svg/icons/All/clause-template.svg"
                        )}
                      />
                    ) : (
                      <SVG
                        src={toAbsoluteUrl(
                          "/media/svg/icons/All/clause-template-black.svg"
                        )}
                      />
                    )}
                    <h1
                      style={{
                        fontSize: 14,
                        color: sequence === 1 ? "#3699ff" : "#8c8a8a",
                      }}
                    >
                      Template Klausul
                    </h1>
                  </div>
                </Col>
              )}

              <Col>
                <div
                  className="d-flex flex-column align-items-center"
                  style={{
                    backgroundColor: "white",
                    flexGrow: 1,
                    cursor: "pointer",
                    borderTopRightRadius: 14,
                    gap: 4,
                  }}
                  onClick={() => setSequence(2)}
                >
                  {sequence === 2 ? (
                    <SVG
                      src={toAbsoluteUrl("/media/svg/icons/All/review.svg")}
                    />
                  ) : (
                    <SVG
                      src={toAbsoluteUrl(
                        "/media/svg/icons/All/review-black.svg"
                      )}
                    />
                  )}
                  <h1
                    style={{
                      fontSize: 14,
                      color: sequence === 2 ? "#3699ff" : "#8c8a8a",
                    }}
                  >
                    Review
                  </h1>
                </div>
              </Col>

              <Col>
                <div
                  className="d-flex flex-column align-items-center"
                  style={{
                    backgroundColor: "white",
                    flexGrow: 1,
                    cursor: "pointer",
                    borderTopRightRadius: 14,
                    gap: 4,
                  }}
                  onClick={() => setSequence(3)}
                >
                  {sequence === 3 ? (
                    <SVG
                      src={toAbsoluteUrl("/media/svg/icons/All/approval.svg")}
                    />
                  ) : (
                    <SVG
                      src={toAbsoluteUrl(
                        "/media/svg/icons/All/approval-black.svg"
                      )}
                    />
                  )}
                  <h1
                    style={{
                      fontSize: 14,
                      color: sequence === 3 ? "#3699ff" : "#8c8a8a",
                    }}
                  >
                    Approval
                  </h1>
                </div>
              </Col>

              <Col>
                <div
                  className="d-flex flex-column align-items-center"
                  style={{
                    backgroundColor: "white",
                    flexGrow: 1,
                    cursor: "pointer",
                    borderTopRightRadius: 14,
                    gap: 4,
                  }}
                  onClick={() => setSequence(4)}
                >
                  {sequence === 4 ? (
                    <SVG
                      src={toAbsoluteUrl("/media/svg/icons/All/distribusi.svg")}
                    />
                  ) : (
                    <SVG
                      src={toAbsoluteUrl(
                        "/media/svg/icons/All/distribusi-black.svg"
                      )}
                    />
                  )}
                  <h1
                    style={{
                      fontSize: 14,
                      color: sequence === 4 ? "#3699ff" : "#8c8a8a",
                    }}
                  >
                    Distribusi
                  </h1>
                </div>
              </Col>
            </Row>
          </Container>

          <div
            style={{
              display: "flex",
              columnGap: 40,
              flexWrap: "wrap",
              marginBottom: "1rem",
            }}
          >
            <div className="col-md-4">
              <div className="form-group row">
                <label
                  htmlFor="agreement_number"
                  className="col-form-label"
                  style={{ fontWeight: 500, fontSize: 14 }}
                >
                  Nomor Perjanjian
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="agreement_number"
                  style={{ backgroundColor: "#c7d2d8" }}
                  disabled
                  value={contract?.contract_no}
                />
              </div>
              <div className="form-group row">
                <label
                  htmlFor="po_number"
                  className="col-form-label"
                  style={{ fontWeight: 500, fontSize: 14 }}
                >
                  Nomor PO
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="po_number"
                  style={{ backgroundColor: "#c7d2d8" }}
                  disabled
                  value={contract?.purch_order?.po_sap}
                />
              </div>
              <div className="form-group row">
                <label
                  htmlFor="agreement_format"
                  className="col-form-label"
                  style={{ fontWeight: 500, fontSize: 14 }}
                >
                  Format Perjanjian
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="agreement_format"
                  style={{ backgroundColor: "#c7d2d8" }}
                  disabled
                  onChange={(e) => {}}
                  value={contract?.contract_format?.name}
                />
              </div>
              <div className="form-group row">
                <label
                  htmlFor="procurement_authority"
                  className="col-form-label"
                  style={{ fontWeight: 500, fontSize: 14 }}
                >
                  Kewenangan Pengadaan
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="procurement_authority"
                  style={{ backgroundColor: "#c7d2d8" }}
                  disabled
                  onChange={(e) => {}}
                  value={contract?.authority?.facility?.name}
                />
              </div>
              <div className="form-group row">
                <label
                  htmlFor="user"
                  className="col-form-label"
                  style={{ fontWeight: 500, fontSize: 14 }}
                >
                  Pengguna
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="user"
                  style={{ backgroundColor: "#c7d2d8" }}
                  disabled
                  onChange={(e) => {}}
                  value={contract?.user?.facility?.name}
                />
              </div>
              <div className="form-group row">
                <label
                  htmlFor="provider"
                  className="col-form-label"
                  style={{ fontWeight: 500, fontSize: 14 }}
                >
                  Penyedia
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="provider"
                  style={{ backgroundColor: "#c7d2d8" }}
                  disabled
                  onChange={(e) => {}}
                  value={contract?.vendor?.party?.full_name}
                />
              </div>
            </div>

            <div className="col-md-7">
              <div className="form-group row">
                <label
                  htmlFor="procurement_title"
                  className="col-form-label"
                  style={{ fontWeight: 500, fontSize: 14 }}
                >
                  Judul Pengadaan
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="procurement_title"
                  style={{ backgroundColor: "#c7d2d8" }}
                  disabled
                  onChange={(e) => {}}
                  value={contract?.contract_name}
                />
              </div>
              <div className="form-group row">
                <label
                  htmlFor="po_number"
                  className="col-form-label"
                  style={{ fontWeight: 500, fontSize: 14 }}
                >
                  Keterangan PO
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="po_number"
                  style={{ backgroundColor: "#c7d2d8" }}
                  disabled
                  onChange={(e) => {}}
                  value={contract?.purch_order?.name}
                />
              </div>
              <div className="form-group row">
                <label
                  htmlFor="agreement_type"
                  className="col-form-label"
                  style={{ fontWeight: 500, fontSize: 14 }}
                >
                  Jenis Perjanjian
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="agreement_type"
                  style={{ backgroundColor: "#c7d2d8" }}
                  disabled
                  value={data?.doc_type}
                />
              </div>
              <div className="form-group row">
                <label
                  htmlFor="po_number"
                  className="col-form-label"
                  style={{ fontWeight: 500, fontSize: 14 }}
                >
                  Grup Kewenangan Pengadaan
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="po_number"
                  style={{ backgroundColor: "#c7d2d8" }}
                  disabled
                  onChange={(e) => {}}
                  value={contract?.authority_group?.party?.full_name}
                />
              </div>
              <div className="form-group row">
                <label
                  htmlFor="user_group"
                  className="col-form-label"
                  style={{ fontWeight: 500, fontSize: 14 }}
                >
                  Grup Pengguna
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="user_group"
                  style={{ backgroundColor: "#c7d2d8" }}
                  disabled
                  onChange={(e) => {}}
                  value={contract?.user_group?.party?.full_name}
                />
              </div>
            </div>
          </div>
        </form>
      </Card>

      <FinalDraftSection finalDraftData={finalDraftData} />

      {sequence === 0 && (
        <>
          <FormParameter
            data={data}
            isAdmin={isAdmin}
            PICData={PICData}
            contract_id={draft_id}
            jobDirector={jobDirector}
            dataNewClause={dataNewClause}
            jobSupervisor={jobSupervisor}
            jobSupervisor2={jobSupervisor2}
            dataContractById={dataContractById}
            authorizedOfficial={authorizedOfficial}
            dataNewClauseDrafting={dataNewClauseDrafting}
            accountNumberBankData={accountNumberBankData}
            secondAuthorizedOfficial={secondAuthorizedOfficial}
          />
        </>
      )}

      {sequence === 1 && <TemplateKlausul />}

      {sequence === 2 && (
        <ReviewPage
          isAdmin={isAdmin}
          isVendor={isVendor}
          isClient={isClient}
          contract_id={draft_id}
        />
      )}

      {sequence === 3 && (
        <>
          <ApprovalPage isAdmin={isAdmin} loginStatus={loginStatus} />
        </>
      )}

      {sequence === 4 && (
        <>
          <DistribusiPage isAdmin={isAdmin} loginStatus={loginStatus} />
        </>
      )}
    </>
  );
};

const keys = {
  getAddendumDetail: "get-addendum-contract-by-id ",
};
const mapState = (state) => ({
  loadings: {
    getAddendumDetail: getLoading(state, keys.getAddendumDetail),
  },
  loginStatus: state.auth.user.data.status,
  rolesEproc: state.auth.user.data.roles_eproc,
  purch_group: state.auth.user.data.purch_group,
  dataNewClause: state.addendumContract.dataNewClause,
  dataNewClauseDrafting: state.addendumContract.dataNewClauseDrafting,
});

const mapDispatch = {
  fetch_api_sg,
};
export default connect(mapState, mapDispatch)(DraftAddendumPage);
