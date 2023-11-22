import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import Tabs from "app/components/tabs";
import DialogGlobal from "app/components/modals/DialogGlobal";
import { Col, Row } from "react-bootstrap";
import FormParameter from "app/modules/AddendumContract/pages/ContractDetail/components/FormAddendum/FormParameter";
import { Card, CardBody } from "_metronic/_partials/controls";
import Steppers from "app/components/steppersCustom/Steppers";
import { STEPPER_ADDENDUM_CONTRACT } from "app/modules/AddendumContract/pages/Termin/TerminPageNew/STATIC_DATA";
import Subheader from "app/components/subheader";
import SubBreadcrumbs from "app/components/SubBreadcrumbs";
import { toAbsoluteUrl } from "_metronic/_helpers/AssetsHelpers";
import SVG from "react-inlinesvg";
import ButtonAction from "app/components/buttonAction/ButtonAction";
import { Formik, Field, FieldArray } from "formik";
// import { Button } from "react-bootstrap"
import { Grid, Button } from "@material-ui/core";
import UploadInput from "app/components/input/UploadInput";
import SelectDateInput from "app/components/input/SelectDateInput";
import TextAreaInput from "app/components/input/TextAreaInput";
import RenderInput from "app/components/input/RenderInput";
import { connect } from "react-redux";
import Summary from "./Summary";
import { fetch_api_sg, getLoading } from "redux/globalReducer";
import { FormattedMessage } from "react-intl";

// bentrok antara button mui & bootstrap

const DraftAddendumPage = ({
  loadings,
  fetch_api_sg,
  loginStatus,
  rolesEproc,
}) => {
  const [inputValue, setInputValue] = useState("Upload File");
  const [tabActive, setTabActive] = React.useState(0);
  const [reviewProcessTabActive, setReviewProcessTabActive] = React.useState(0);
  const [distributionTabActive, setDistributionTabActive] = React.useState(0);
  const [sequence, setSequence] = React.useState(0);
  const [reviewSequence, setReviewSequence] = React.useState(0);
  const [distributionSequence, setDistributionSequence] = React.useState(0);
  const [data, setData] = useState({});
  const [contract, setContract] = useState({});
  const { draft_id } = useParams();

  const getClientStatus = () => {
    const client_role = "ADMIN_CONTRACT";
    const filteredData = rolesEproc?.filter(
      ({ ident_name }) => ident_name === client_role
    );
    return !!filteredData?.length > 0;
  };

  const getAddendum = async () => {
    fetch_api_sg({
      key: keys.getAddendumDetail,
      type: "get",
      url: `/adendum/add-contracts/${draft_id}`,
      onSuccess: (res) => {
        setContract(res?.data?.contract);
        setData(res?.data);
      },
    });
  };


  useEffect(() => {
    getAddendum();
  }, []);

  let isAdmin = getClientStatus();

  const TabLists = [
    {
      id: "summary",
      // label: <FormattedMessage id="CONTRACT_DETAIL.TAB.DETAIL" />,
      label: "Summary",
      // icon: <PlayCircleOutlineIcon className="mb-0 mr-2" />,
      addendum: true,
    },
    {
      id: "kick-off",
      // label: <FormattedMessage id="CONTRACT_DETAIL.TAB.DETAIL" />,
      label: "Para Pihak",
      // icon: <PlayCircleOutlineIcon className="mb-0 mr-2" />,
      addendum: true,
    },

    {
      id: "detail",
      // label: <FormattedMessage id="CONTRACT_DETAIL.TAB.DETAIL" />,
      label: "Harga Pekerjaan",
      // icon: <FindInPage className="mb-0 mr-2" />,
    },

    {
      id: "para-pihak",
      // label: <FormattedMessage id="CONTRACT_DETAIL.TAB.PARTIES" />,
      label: "Jangka Waktu",
      // icon: <PeopleAlt className="mb-0 mr-2" />,
    },

    {
      id: "dokumen-kontrak",
      // label: <FormattedMessage id="CONTRACT_DETAIL.TAB.DOK_CONT" />,
      label: "Metode Pembayaran",
      // icon: <Assignment className="mb-0 mr-2" />,
    },

    {
      id: "harga-pekerjaan",
      // label: <FormattedMessage id="CONTRACT_DETAIL.TAB.PRICE" />,
      label: "Denda",
      // icon: <MonetizationOn className="mb-0 mr-2" />,
    },

    {
      id: "jangka-waktu",
      // label: <FormattedMessage id="CONTRACT_DETAIL.TAB.PERIOD" />,
      label: "Jaminan",
      // icon: <QueryBuilderSharp className="mb-0 mr-2" />,
      addendum: true,
    },

    {
      id: "jaminan",
      // label: <FormattedMessage id="CONTRACT_DETAIL.TAB.GUARANTEE" />,
      label: "Nomor Rekening",
      // icon: <FeaturedPlayList className="mb-0 mr-2" />,
      addendum: true,
    },

    // {
    //   id: "denda",
    //   label: <FormattedMessage id="CONTRACT_DETAIL.TAB.FINE" />,
    //   icon: <Error className="mb-0 mr-2" />,
    // },
    //   {
    //     id: "para-pihak2",
    //     label: <FormattedMessage id="CONTRACT_DETAIL.TAB.PARTIES" />,
    //     icon: <PeopleAlt className="mb-0 mr-2" />,
    //   },
    // {
    //   id: "bast",
    //   label: <FormattedMessage id="CONTRACT_DETAIL.TAB.BAST" />,
    //   icon: <Description className="mb-0 mr-2" />,
    // },
  ];

  const reviewProcessTabLists = [
    {
      id: "form_review",
      label: "Form Review Addendum",
    },
    {
      id: "draft_review",
      label: "Draft Review Addendum",
    },
    {
      id: "review_user",
      label: "Hasil Review User",
    },
    {
      id: "review_vendor",
      label: "Hasil Review Vendor",
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

  const TableListsVendor = [
    {
      name: "Samudera Raya Engineering",
      position: "Awaludin",
      email: "ptsamuderaraya@gmail.com",
    },
  ];

  const dataGroup = [
    {
      documentname: "Kontrak Perjanjian",
      documentfileupload:
        "https://geodipa-my.sharepoint.com/:w:/g/personal/contract_admin_geodipa_Kontrak-Perjanjian_id/EVLWq8U2WxVLgVmHO--FqR0BiX_FbrptwluwNlitelZ0eg?e=5mhN9Q",
    },
    {
      documentname: "Lampiran 1",
      documentfileupload:
        "https://geodipa-my.sharepoint.com/:w:/g/personal/contract_admin_geodipa_Lamp-1_id/EVLWq8U2WxVLgVmHO--FqR0BiX_FbrptwluwNlitelZ0eg?e=5mhN9Q",
    },
    {
      documentname: "Lampiran 2",
      documentfileupload:
        "https://geodipa-my.sharepoint.com/:w:/g/personal/contract_admin_geodipa_Lamp-2_id/EVLWq8U2WxVLgVmHO--FqR0BiX_FbrptwluwNlitelZ0eg?e=5mhN9Q",
    },
  ];

  let [linksGroup, setLinksGroup] = useState(dataGroup);

  const toPush = useRef();
  const setPush = (e) => {
    toPush.current.click();
  };

  const openCloseAddReviewer = React.useRef();
  const showAddReviewer = () => {
    openCloseAddReviewer.current.open();
  };

  const openCloseAddVendor = React.useRef();
  const showAddVendor = () => {
    openCloseAddVendor.current.open();
  };

  const openCloseAddAttachment = React.useRef();
  const showAddAttachment = () => {
    openCloseAddAttachment.current.open();
  };

  const openCloseAddChecklistAddendum = React.useRef();
  const showAddChecklistAddendum = () => {
    openCloseAddChecklistAddendum.current.open();
  };

  const openCloseDownloadUser = React.useRef();
  const showDownloadUser = () => {
    openCloseDownloadUser.current.open();
  };

  const openCloseDownloadVendor = React.useRef();
  const showDownloadVendor = () => {
    openCloseDownloadVendor.current.open();
  };

  // sengaja dikasih event biar yang diambil value nya
  function handleChangeTab(event, newTabActive) {
    setTabActive(newTabActive);
  }

  function handleChangeReviewProcessTab(event, newTabActive) {
    setReviewProcessTabActive(newTabActive);
  }

  function handleChangeDistributionTab(event, newTabActive) {
    setDistributionTabActive(newTabActive);
    setDistributionSequence(newTabActive);
  }

  //   const getContractById = async (contract_id) => {
  //     try {

  //       // loading buat throttling
  //       setLoading(true);

  //       // masukin response api nya ke objek yang nama properti nya data
  //       const {
  //         data: { data },
  //       } = await addendumContract.getContractById(contract_id);

  //       addCheckedField(data?.services, "jasa");
  //       addCheckedField(data?.items, "barang");

  //       dispatch({
  //         type: actionTypes.SetContractById,
  //         payload: data,
  //       })

  //     } catch (error) {
  //       if (
  //         error.response?.status !== 400 &&
  //         error.response?.data.message !== "TokenExpiredError"
  //       ) {
  //         if (
  //           error.response?.status !== 400 &&
  //           error.response?.data.message !== "TokenExpiredError"
  //         ) {
  //           setToast("Error API, please contact developer!");
  //         }
  //       }
  //     } finally {
  //       setLoading(false);
  //     }
  //   }

  //   React.useEffect(() => {
  //     // kalo dipanggil bisa
  //     getContractById(contract_id)
  //     setInitialSubmitItems();
  //     // eslint-disable-next-line
  //   }, []);

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

  const userReviewData = [
    {
      agreement_name: "Kontrak Perjanjian",
      agreement_file_name:
        "001.KTR-DNG1.PBJ-GDE-I-2022.Body-Perjanjian.Admin_Zulfiqur_Rahman.07-08-2022 1437.V0_ADD.docx",
      userComment: [
        {
          name: "Kurniawan Tri Widhianto",
          position: "Logistic Supervisor",
          reviewStatus: "Setuju",
          date: "08-08-2022 13:51",
          comment: "Oke. Sudah Review",
          file: "",
        },
        {
          name: "Rustianah",
          position: "Procurement Staff",
          reviewStatus: "Revisi",
          date: "08-08-2022 13:55",
          comment: "Ada revisi dibagian ini",
          file:
            "001.KTR-DNG1.PBJ-GDE-I-2022.Body-Perjanjian.Admin_Zulfiqur_Rahman.07-08-2022 1437.V0_ADD.docx",
        },
        {
          name: "Weni Kusumaningrum",
          position: "Procurement Superintendent",
          reviewStatus: "Setuju",
          date: "08-08-2022 13:58",
          comment: "Oke. sudah review",
          file: "",
        },
      ],
    },
    {
      agreement_name: "Lampiran 1",
      agreement_file_name:
        "001.KTR-DNG1.PBJ-GDE-I-2022.Lamp-1.Admin_Zulfiqur_Rahman.07-08-2022 1437.V0_ADD.docx",
      userComment: [
        {
          name: "Kurniawan Tri Widhianto",
          position: "Logistic Supervisor",
          reviewStatus: "Setuju",
          date: "08-08-2022 13:51",
          comment: "Oke. Sudah Review",
          file: "",
        },
        {
          name: "Rustianah",
          position: "Procurement Staff",
          reviewStatus: "Revisi",
          date: "08-08-2022 13:55",
          comment: "Ada revisi dibagian ini",
          file:
            "001.KTR-DNG1.PBJ-GDE-I-2022.Body-Perjanjian.Admin_Zulfiqur_Rahman.07-08-2022 1437.V0_ADD.docx",
        },
        {
          name: "Rustianah",
          position: "Procurement Staff",
          reviewStatus: "Revisi",
          date: "08-08-2022 13:55",
          comment: "Ada revisi dibagian ini",
          file: "",
        },
      ],
    },
  ];

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
              <div>015.PJ/PST.100-GDE/I/2023</div>
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

          {/* 6.direksi pekerjaan */}
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

          {/* 8.cara pembayaran */}
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

          {/* 9.jangka waktu */}
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

          {/* 10. Denda */}
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

          {/* 11. Jaminan */}
          <div className="col-sm-3">11. Jaminan:</div>

          {/* 12.Addendum */}
          <div
            style={{
              padding: "0 12.5px",
            }}
          >
            12. Addendum
          </div>

          {/* A.Perihal */}
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

          {/* B.Nilai Addendum */}
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

          {/* C.Nilai Perjanjian Setelah Addendum (exc PPN) */}
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

          {/* D.Kesimpulan */}
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

      {/* Tambah Reviewer */}
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
              <input
                style={{
                  padding: 8,
                  borderRadius: 4,
                  border: 1,
                  borderStyle: "solid",
                  borderColor: "#8c8a8a",
                  opacity: 0.8,
                }}
                value={"User 4"}
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
                }}
                value={"Procurement Staff"}
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
                value={"user.4@geodipa.co.id"}
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

      {/* Tambah Vendor */}
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

      {/* unduh approval user */}
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

      {/* unduh approval vendor */}
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

      <Subheader
        text={`No Dokumen Addendum : ADD-01/015.PJ/PST.100-GDE/I/2023`}
      />

      <SubBreadcrumbs
        items={[
          {
            label: `Addendum Contract`,
          },
          {
            label: "List of Addendum",
            // to: `/${authStatus}/addendum-contract/list-of-addendum`,
            to: `/client/addendum-contract/list-of-addendum`,
          },
          {
            label:
              "015.PJ/PST.100-GDE/I/2023 - Pengadaan Material Gasket Spiral Wound & Rupture Disk",
          },
        ]}
      />

      <Steppers steps={STEPPER_ADDENDUM_CONTRACT} />

      <br />

      <Card>
        <form
          style={{
            padding: 28,
          }}
        >
          {/* form parameter & template klausul */}
          <div
            style={{
              height: 74,
              fontSize: 14,
              display: "grid",
              gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
            }}
          >
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
              <SVG
                src={toAbsoluteUrl("/media/svg/icons/All/form-parameter.svg")}
              />
              <h1
                style={{
                  fontSize: 14,
                  color: sequence === 0 ? "#3699ff" : "#8c8a8a",
                }}
              >
                Form Parameter
              </h1>
            </div>

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
              <SVG
                src={toAbsoluteUrl("/media/svg/icons/All/clause-template.svg")}
              />
              <h1
                style={{
                  fontSize: 14,
                  color: sequence === 1 ? "#3699ff" : "#8c8a8a",
                }}
              >
                Template Klausul
              </h1>
            </div>

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
              <SVG src={toAbsoluteUrl("/media/svg/icons/All/review.svg")} />
              <h1
                style={{
                  fontSize: 14,
                  color: sequence === 2 ? "#3699ff" : "#8c8a8a",
                }}
              >
                Review
              </h1>
            </div>

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
              <SVG src={toAbsoluteUrl("/media/svg/icons/All/approval.svg")} />
              <h1
                style={{
                  fontSize: 14,
                  color: sequence === 3 ? "#3699ff" : "#8c8a8a",
                }}
              >
                Approval
              </h1>
            </div>

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
              <SVG src={toAbsoluteUrl("/media/svg/icons/All/distribusi.svg")} />
              <h1
                style={{
                  fontSize: 14,
                  color: sequence === 4 ? "#3699ff" : "#8c8a8a",
                }}
              >
                Distribusi
              </h1>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              columnGap: 40,
              flexWrap: "wrap",
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

      {/* silahkan download file */}

      {sequence < 2 && (
        <div
          style={{
            backgroundColor: "white",
            padding: 28,
            marginTop: 24,
            marginBottom: 24,
            borderRadius: 5,
          }}
        >
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
          >
            <option>Final Draft Kontrak</option>
            <option>Final Draft Addendum</option>
          </select>

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
              <p>Body Kontrak Perjanjian.doc</p>
            </div>

            <div
              style={{
                display: "flex",
                gap: 6,
              }}
            >
              <SVG
                src={toAbsoluteUrl("/media/svg/icons/All/file-final-draft.svg")}
              />
              <p>Lampiran 1.doc</p>
            </div>

            <div
              style={{
                display: "flex",
                gap: 6,
              }}
            >
              <SVG
                src={toAbsoluteUrl("/media/svg/icons/All/file-final-draft.svg")}
              />
              <p>Lampiran 2.doc</p>
            </div>
          </div>
        </div>
      )}

      {sequence === 0 && (
        <>
          <div
            style={{
              backgroundColor: "white",
              borderTopLeftRadius: 14,
              borderTopRightRadius: 14,
            }}
          >
            <Tabs
              tabActive={tabActive}
              handleChange={handleChangeTab}
              tabLists={TabLists}
              variant="scrollable"
            />
          </div>
          {/* <FormParameter currentActiveTab={tabActive} /> */}
          {!loadings.getAddendumDetail ? (
            <Summary data={data} />
          ) : (
            <FormattedMessage id="TITLE.TABLE.WAITING_DATA" />
          )}
        </>
      )}

      {sequence === 1 && (
        <>
          <div
            style={{
              backgroundColor: "white",
              borderRadius: 4,
              minHeight: 100,
              display: "flex",
              flexDirection: "column",
              gap: 28,
              padding: 28,
            }}
          >
            Template Word Body Kontrak
            <div
              style={{
                border: 1,
                borderStyle: "solid",
                borderColor: "#8C8A8A",
                borderRadius: 4,
                padding: "12px 10px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                overflow: "hidden",
                textOverflow: "clip",
              }}
            >
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#3699ff",
                }}
              >
                https://geodipa-my.sharepoint.com/:w:/g/personalcontract_admin_geodipa_Kontrak-Perjanjian_idEVLWq8U2WxVLgVmHO--FqR0BiX_FbrptwluwNlitelZ0eg?e=5mhN9Q
              </p>
            </div>
            Template Word Lampiran 1
            <div
              style={{
                border: 1,
                borderStyle: "solid",
                borderColor: "#8C8A8A",
                borderRadius: 4,
                padding: "12px 10px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#3699ff",
                  textOverflow: "clip",
                }}
              >
                https://geodipa-my.sharepoint.com/:w:/g/personal/contract_admin_geodipa_Lamp-1_id/EVLWq8U2WxVLgVmHO--FqR0BiX_FbrptwluwNlitelZ0eg?e=5mhN9Q
              </p>
            </div>
            Template Word Lampiran 2
            <div
              style={{
                border: 1,
                borderStyle: "solid",
                borderColor: "#8C8A8A",
                borderRadius: 4,
                padding: "12px 10px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#3699ff",
                  textOverflow: "clip",
                }}
              >
                https://geodipa-my.sharepoint.com/:w:/g/personal/contract_admin_geodipa_Lamp-2_id/EVLWq8U2WxVLgVmHO--FqR0BiX_FbrptwluwNlitelZ0eg?e=5mhN9Q
              </p>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              padding: 28,
            }}
          >
            <button className="btn btn-primary">Submit</button>
          </div>
        </>
      )}

      {sequence === 2 && (
        <>
          <div
            style={{
              height: 74,
              fontSize: 14,
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            }}
          >
            <div
              className="d-flex align-items-center justify-content-center"
              style={{
                backgroundColor: reviewSequence === 0 ? "#3699ff" : "white",
                color: reviewSequence === 0 ? "white" : "black",
                flexGrow: 1,
                borderTopLeftRadius: 14,
                cursor: "pointer",
              }}
              onClick={() => setReviewSequence(0)}
            >
              <h1
                style={{
                  fontSize: 14,
                }}
              >
                Reviewer
              </h1>
            </div>

            <div
              className="d-flex align-items-center justify-content-center"
              style={{
                backgroundColor: reviewSequence === 1 ? "#3699ff" : "white",
                color: reviewSequence === 1 ? "white" : "black",
                flexGrow: 1,
                cursor: "pointer",
              }}
              onClick={() => setReviewSequence(1)}
            >
              <h1
                style={{
                  fontSize: 14,
                }}
              >
                Proses Review
              </h1>
            </div>

            <div
              className="d-flex align-items-center justify-content-center"
              style={{
                backgroundColor: reviewSequence === 2 ? "#3699ff" : "white",
                color: reviewSequence === 2 ? "white" : "black",
                flexGrow: 1,
                borderTopRightRadius: 14,
                cursor: "pointer",
              }}
              onClick={() => setReviewSequence(2)}
            >
              <h1
                style={{
                  fontSize: 14,
                }}
              >
                Final Draft
              </h1>
            </div>
          </div>

          {reviewSequence === 0 && (
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
                  Reviewer Addendum
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
                    justifyContent: "space-between",
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
                    // className="btn btn-outline-danger"
                    //   variant="outlined"
                    size="medium"
                    onClick={showAddReviewer}
                  >
                    <div>
                      <span>Reviewer User</span>
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

          {reviewSequence === 1 && (
            <>
              {/* <Tabs
                            tabActive={reviewProcessTabActive}
                            handleChange={handleChangeReviewProcessTab}
                            tabLists={reviewProcessTabLists}
                            variant="scrollable"
                            grid={true}
                            arrayLength={4}
                        /> */}

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
                    borderRadius: 14,
                    padding: "14px 28px",
                    backgroundColor: "white",
                  }}
                >
                  {/* <h1
                                                               style={{
                                                                   fontSize: 16,
                                                                   fontWeight: 600
                                                               }}
                                                           >
                                                               Form Review Addendum Kontrak
                                </h1> */}

                  {/* <br
                                    style={{
                                                                   border: 1,
                                                                   borderColor: 'black',
                                                                   borderStyle: 'solid'
                                    }}
                                /> */}

                  <Formik
                    initialValues={{
                      links: linksGroup,
                    }}
                    onSubmit={async (values, actions) => {
                      alert(JSON.stringify(values, null, 2));
                    }}
                  >
                    {({ values }) => (
                      <>
                        <FieldArray name="links">
                          {({ push, remove }) => (
                            <Grid
                              container
                              spacing={2}
                              sx={{ marginTop: 2, paddingX: 2 }}
                            >
                              {values.links.map((_, index) => (
                                <>
                                  <Grid item md={10}>
                                    <p
                                      style={{
                                        fontWeight: 500,
                                        fontSize: 14,
                                        marginBottom: 0,
                                      }}
                                    >
                                      {_.documentname}
                                    </p>
                                    <p
                                      style={{
                                        margin: "14px 0",
                                      }}
                                    >
                                      Silahkan klik link dibawah ini untuk
                                      melakukan review :
                                    </p>
                                    <div
                                      className="col-sm-12"
                                      style={{
                                        color:
                                          _.documentfileupload === ""
                                            ? "black"
                                            : "#3699ff",
                                        padding: "10px 14px",
                                        borderRadius: 4,
                                        backgroundColor: "#e8f4fb",
                                        border: 1,
                                        borderStyle: "solid",
                                        borderColor: "#8c8a8a",
                                        opacity: 0.8,
                                        fontSize: 10,
                                        fontWeight: 400,
                                      }}
                                    >
                                      <a href="">
                                        {_.documentfileupload === ""
                                          ? "tidak ada file"
                                          : _.documentfileupload}
                                      </a>
                                    </div>
                                  </Grid>
                                  {index > 2 && (
                                    <Grid
                                      item
                                      md={2}
                                      alignItems="center"
                                      justifyContent="center"
                                    >
                                      <p
                                        style={{
                                          fontWeight: 500,
                                          fontSize: 14,
                                          marginBottom: 14,
                                        }}
                                      ></p>
                                      <Button
                                        variant="outlined"
                                        onClick={() => remove(index)}
                                      >
                                        Delete
                                      </Button>
                                    </Grid>
                                  )}
                                  {/* <Grid item md={12}>
                                                                       <h1
                                                                           style={{
                                                                               fontWeight: 500,
                                                                               fontSize: 14
                                                                           }}
                                                                       >Komentar<span style={{
                                                                           fontWeight: 500,
                                                                           fontSize: 14,
                                                                           color: '#dc0526'
                                                                       }}>*</span>
                                                                       </h1>
                                                                   <Field 
                                                                       name={`links.${index}.about`} 
                                                                       component={TextAreaInput}
                                                                       value={`${_.about}`}
                                                                   />
                                                                   </Grid> */}
                                </>
                              ))}

                              <Grid item xs={12}>
                                {/* <Button
                                                                   variant="outlined"
                                                                   
                                                                   onClick={() => push()}
                                                               >
                                                                   Add Link
                                                               </Button> */}

                                <button
                                  className="d-none"
                                  ref={toPush}
                                  onClick={() => push(linksGroup)}
                                >
                                  Klik Disini
                                </button>
                              </Grid>
                            </Grid>
                          )}
                        </FieldArray>
                      </>
                    )}
                  </Formik>

                  {/* <div
                                                               style={{
                                                                   display: 'flex',
                                                                   flexDirection: 'column',
                                                                   gap: 4,
                                                                   marginBottom: 87
                                                               }}
                                                           >
                                                               <h1
                                                                   style={{
                                                                       fontSize: 14,
                                                                       fontWeight: 500
                                                                   }}
                                                               >Version</h1>
                                                               <input 
                                                                   className="col-sm-6"
                                                                   value={"Versi 0"}
                                                                   style={{
                                                                       backgroundColor: '#e8f4fb',
                                                                       padding: 8,
                                                                       borderRadius: 4,
                                                                       border: 1,
                                                                       borderStyle: 'solid',
                                                                       borderColor: '#8c8a8a',
                                                                       opacity: .8
                                                                   }}
                                                               />
                                </div> */}

                  {/* <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                        gap : 20
                                    }}
                                >
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={showAddChecklistAddendum}
                                    >
                                        Checklist Addendum Kontrak
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                    >
                                        Submit
                                    </Button>
                                </div> */}
                </div>

                {/* {reviewProcessTabActive === 0 &&
                            } */}

                {reviewProcessTabActive === 1 && (
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
                      Form Review Addendum Kontrak
                    </h1>

                    <br
                      style={{
                        border: 1,
                        borderColor: "black",
                        borderStyle: "solid",
                      }}
                    />

                    <Formik
                      initialValues={{
                        links: linksGroup,
                      }}
                      onSubmit={async (values, actions) => {
                        alert(JSON.stringify(values, null, 2));
                      }}
                    >
                      {({ values }) => (
                        <>
                          <FieldArray name="links">
                            {({ push, remove }) => (
                              <Grid
                                container
                                spacing={2}
                                sx={{ marginTop: 2, paddingX: 2 }}
                              >
                                {values.links.map((_, index) => (
                                  <>
                                    <Grid item md={10}>
                                      <p
                                        style={{
                                          fontWeight: 500,
                                          fontSize: 14,
                                          marginBottom: 0,
                                        }}
                                      >
                                        {_.documentname}
                                      </p>
                                      <UploadInput
                                        value={_.documentfileupload}
                                        onChange={(e) =>
                                          setLinksGroup({
                                            ...linksGroup,
                                            documentfileupload: {
                                              path: e.path,
                                            },
                                          })
                                        }
                                      />
                                    </Grid>
                                    {index > 2 && (
                                      <Grid
                                        item
                                        md={2}
                                        alignItems="center"
                                        justifyContent="center"
                                      >
                                        <p
                                          style={{
                                            fontWeight: 500,
                                            fontSize: 14,
                                            marginBottom: 14,
                                          }}
                                        ></p>
                                        <Button
                                          variant="outlined"
                                          onClick={() => remove(index)}
                                        >
                                          Delete
                                        </Button>
                                      </Grid>
                                    )}
                                    <Grid item md={12}>
                                      <h1
                                        style={{
                                          fontWeight: 500,
                                          fontSize: 14,
                                        }}
                                      >
                                        Komentar
                                        <span
                                          style={{
                                            fontWeight: 500,
                                            fontSize: 14,
                                            color: "#dc0526",
                                          }}
                                        >
                                          *
                                        </span>
                                      </h1>
                                      <Field
                                        name={`links.${index}.about`}
                                        component={TextAreaInput}
                                        value={`${_.about}`}
                                      />
                                    </Grid>
                                  </>
                                ))}

                                <Grid item xs={12}>
                                  {/* <Button
                                            variant="outlined"
                                            
                                            onClick={() => push()}
                                        >
                                            Add Link
                                        </Button> */}

                                  <button
                                    className="d-none"
                                    ref={toPush}
                                    onClick={() => push(linksGroup)}
                                  >
                                    Klik Disini
                                  </button>
                                </Grid>
                              </Grid>
                            )}
                          </FieldArray>
                        </>
                      )}
                    </Formik>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 4,
                        marginBottom: 87,
                      }}
                    >
                      <h1
                        style={{
                          fontSize: 14,
                          fontWeight: 500,
                        }}
                      >
                        Version
                      </h1>
                      <input
                        className="col-sm-6"
                        value={"Versi 0"}
                        style={{
                          backgroundColor: "#e8f4fb",
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
                )}

                {reviewProcessTabActive === 2 && (
                  <>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 24,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 14,
                        }}
                      >
                        <select
                          style={{
                            padding: "10px 12px",
                            backgroundColor: "#e8f4fb",
                            borderRadius: 4,
                            border: 1,
                            borderStyle: "solid",
                            borderColor: "#8c8a8a",
                            opacity: 0.8,
                          }}
                        >
                          <option>Versi 0</option>
                        </select>
                        <h1
                          style={{
                            fontSize: 10,
                            fontWeight: 400,
                            color: "#403f3f",
                          }}
                        >
                          diupload 07-08-2022
                        </h1>
                      </div>

                      {userReviewData &&
                        userReviewData.map((item, index) => (
                          <>
                            <div
                              style={{
                                border: 1,
                                borderColor: "black",
                                borderStyle: "solid",
                                padding: "14px 28px",
                                backgroundColor: "white",
                                borderRadius: 14,
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
                                {item.agreement_name}
                              </h1>

                              <h1
                                style={{
                                  fontSize: 12,
                                  fontWeight: 500,
                                  color: "#2e1f22",
                                }}
                              >
                                Terlampir draft addendum kontrak, mohon user
                                untuk direview
                              </h1>

                              <input
                                className="col-sm-12"
                                style={{
                                  backgroundColor: "#e8f4fb",
                                  padding: "10px 14px",
                                  color: "#3699ff",
                                  borderRadius: 4,
                                  border: 1,
                                  borderStyle: "solid",
                                  borderColor: "#8c8a8a",
                                  opacity: 0.8,
                                }}
                                value={item.agreement_file_name}
                              />

                              <h1
                                style={{
                                  fontSize: 12,
                                  fontWeight: 500,
                                }}
                              >
                                Komentar User
                              </h1>

                              <div
                                style={{
                                  maxHeight: 160,
                                  overflowY: "scroll",
                                  padding: "24px 31px 24px 0px",
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: 14,
                                }}
                              >
                                {item.userComment &&
                                  item.userComment.map((itm, idx) => (
                                    <>
                                      <div
                                        style={{
                                          display: "flex",
                                          flexDirection: "column",
                                          gap: 10,
                                        }}
                                      >
                                        <div
                                          style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: 4,
                                          }}
                                        >
                                          <div>
                                            {itm.name}({itm.position})
                                          </div>
                                          <div
                                            style={{
                                              color:
                                                itm.reviewStatus === "Setuju"
                                                  ? "#14b571"
                                                  : "#dc0526",
                                            }}
                                          >
                                            Direview ({itm.reviewStatus}) :{" "}
                                            {itm.date}
                                          </div>
                                          <div>
                                            <input
                                              className="col-sm-6"
                                              style={{
                                                padding: 10,
                                                borderRadius: 4,
                                                border: 1,
                                                borderStyle: "solid",
                                                borderColor: "#8c8a8a",
                                                opacity: 0.8,
                                                fontSize: 10,
                                                fontWeight: 400,
                                              }}
                                              value={itm.comment}
                                            />
                                          </div>
                                        </div>

                                        <div
                                          className="col-sm-12"
                                          style={{
                                            color:
                                              itm.file === ""
                                                ? "black"
                                                : "#3699ff",
                                            padding: "10px 14px",
                                            borderRadius: 4,
                                            backgroundColor: "#e8f4fb",
                                            border: 1,
                                            borderStyle: "solid",
                                            borderColor: "#8c8a8a",
                                            opacity: 0.8,
                                            fontSize: 10,
                                            fontWeight: 400,
                                          }}
                                        >
                                          <a href="">
                                            {itm.file === ""
                                              ? "tidak ada file"
                                              : itm.file}
                                          </a>
                                        </div>
                                      </div>
                                    </>
                                  ))}
                              </div>
                            </div>
                          </>
                        ))}
                    </div>
                  </>
                )}

                {reviewProcessTabActive === 3 && (
                  <>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 24,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 14,
                        }}
                      >
                        <select
                          style={{
                            padding: "10px 12px",
                            backgroundColor: "#e8f4fb",
                            borderRadius: 4,
                            border: 1,
                            borderStyle: "solid",
                            borderColor: "#8c8a8a",
                            opacity: 0.8,
                          }}
                        >
                          <option>Versi 0</option>
                        </select>
                        <h1
                          style={{
                            fontSize: 10,
                            fontWeight: 400,
                            color: "#403f3f",
                          }}
                        >
                          diupload 07-08-2022
                        </h1>
                      </div>

                      {userReviewData &&
                        userReviewData.map((item, index) => (
                          <>
                            <div
                              style={{
                                border: 1,
                                borderColor: "black",
                                borderStyle: "solid",
                                padding: "14px 28px",
                                backgroundColor: "white",
                                borderRadius: 14,
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
                                {item.agreement_name}
                              </h1>

                              <h1
                                style={{
                                  fontSize: 12,
                                  fontWeight: 500,
                                  color: "#2e1f22",
                                }}
                              >
                                Terlampir draft addendum kontrak, mohon user
                                untuk direview
                              </h1>

                              <input
                                className="col-sm-12"
                                style={{
                                  backgroundColor: "#e8f4fb",
                                  padding: "10px 14px",
                                  color: "#3699ff",
                                  borderRadius: 4,
                                  border: 1,
                                  borderStyle: "solid",
                                  borderColor: "#8c8a8a",
                                  opacity: 0.8,
                                }}
                                value={item.agreement_file_name}
                              />

                              <h1
                                style={{
                                  fontSize: 12,
                                  fontWeight: 500,
                                }}
                              >
                                Komentar User
                              </h1>

                              <div
                                style={{
                                  maxHeight: 160,
                                  overflowY: "scroll",
                                  padding: "24px 31px 24px 0px",
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: 14,
                                }}
                              >
                                {item.userComment &&
                                  item.userComment.map((itm, idx) => (
                                    <>
                                      <div
                                        style={{
                                          display: "flex",
                                          flexDirection: "column",
                                          gap: 10,
                                        }}
                                      >
                                        <div
                                          style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: 4,
                                          }}
                                        >
                                          <div>
                                            {itm.name}({itm.position})
                                          </div>
                                          <div
                                            style={{
                                              color:
                                                itm.reviewStatus === "Setuju"
                                                  ? "#14b571"
                                                  : "#dc0526",
                                            }}
                                          >
                                            Direview ({itm.reviewStatus}) :{" "}
                                            {itm.date}
                                          </div>
                                          <div>
                                            <input
                                              className="col-sm-6"
                                              style={{
                                                padding: 10,
                                                borderRadius: 4,
                                                border: 1,
                                                borderStyle: "solid",
                                                borderColor: "#8c8a8a",
                                                opacity: 0.8,
                                                fontSize: 10,
                                                fontWeight: 400,
                                              }}
                                              value={itm.comment}
                                            />
                                          </div>
                                        </div>

                                        <div
                                          className="col-sm-12"
                                          style={{
                                            color:
                                              itm.file === ""
                                                ? "black"
                                                : "#3699ff",
                                            padding: "10px 14px",
                                            borderRadius: 4,
                                            backgroundColor: "#e8f4fb",
                                            border: 1,
                                            borderStyle: "solid",
                                            borderColor: "#8c8a8a",
                                            opacity: 0.8,
                                            fontSize: 10,
                                            fontWeight: 400,
                                          }}
                                        >
                                          <a href="">
                                            {itm.file === ""
                                              ? "tidak ada file"
                                              : itm.file}
                                          </a>
                                        </div>
                                      </div>
                                    </>
                                  ))}
                              </div>
                            </div>
                          </>
                        ))}
                    </div>
                  </>
                )}
              </div>
            </>
          )}

          {reviewSequence === 2 && (
            <div
              style={{
                border: 1,
                borderColor: "black",
                borderStyle: "solid",
                borderRadius: 14,
                padding: "14px 28px",
                backgroundColor: "white",
              }}
            >
              <h1
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                }}
              >
                Final Draft Addendum Kontrak
              </h1>

              <br
                style={{
                  border: 1,
                  borderColor: "black",
                  borderStyle: "solid",
                }}
              />

              <Formik
                initialValues={{
                  links: linksGroup,
                }}
                onSubmit={async (values, actions) => {
                  alert(JSON.stringify(values, null, 2));
                }}
              >
                {({ values }) => (
                  <>
                    <FieldArray name="links">
                      {({ push, remove }) => (
                        <>
                          <Grid
                            container
                            spacing={2}
                            sx={{ marginTop: 2, paddingX: 2 }}
                          >
                            {values.links.map((_, index) => (
                              <>
                                <Grid item md={10}>
                                  <p
                                    style={{
                                      fontWeight: 500,
                                      fontSize: 14,
                                      marginBottom: 0,
                                    }}
                                  >
                                    {_.documentname}
                                  </p>{" "}
                                  <div
                                    className="col-sm-12"
                                    style={{
                                      color:
                                        _.documentfileupload === ""
                                          ? "black"
                                          : "#3699ff",
                                      padding: "10px 14px",
                                      borderRadius: 4,
                                      backgroundColor: "#e8f4fb",
                                      border: 1,
                                      borderStyle: "solid",
                                      borderColor: "#8c8a8a",
                                      opacity: 0.8,
                                      fontSize: 10,
                                      fontWeight: 400,
                                    }}
                                  >
                                    <a href="">
                                      {_.documentfileupload === ""
                                        ? "tidak ada file"
                                        : _.documentfileupload}
                                    </a>
                                  </div>
                                </Grid>
                                {index > 3 && (
                                  <Grid
                                    item
                                    md={2}
                                    alignItems="center"
                                    justifyContent="center"
                                  >
                                    <p
                                      style={{
                                        fontWeight: 500,
                                        fontSize: 14,
                                        marginBottom: 14,
                                      }}
                                    ></p>

                                    <Button
                                      variant="outlined"
                                      onClick={() => remove(index)}
                                    >
                                      Delete
                                    </Button>
                                  </Grid>
                                )}
                                <Grid item md={12}>
                                  <h1
                                    style={{
                                      fontWeight: 500,
                                      fontSize: 14,
                                    }}
                                  >
                                    Komentar
                                    <span
                                      style={{
                                        fontWeight: 500,
                                        fontSize: 14,
                                        color: "#dc0526",
                                      }}
                                    >
                                      *
                                    </span>
                                  </h1>
                                  <Field
                                    name={`links.${index}.about`}
                                    component={TextAreaInput}
                                    value={`${_.about}`}
                                  />
                                </Grid>
                              </>
                            ))}
                          </Grid>

                          <Grid item xs={12}>
                            <Button
                              variant="contained"
                              color="secondary"
                              // onClick={() => push()}
                              onClick={showAddAttachment}
                            >
                              {" "}
                              Tambah Lampiran{" "}
                            </Button>

                            <button
                              className="d-none"
                              ref={toPush}
                              onClick={() => push(linksGroup)}
                            >
                              Klik Disini
                            </button>
                          </Grid>
                        </>
                      )}
                    </FieldArray>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                      }}
                    >
                      <Button variant="contained" color="secondary">
                        Submit
                      </Button>
                    </div>
                  </>
                )}
              </Formik>
            </div>
          )}
        </>
      )}

      {sequence === 3 && (
        // <div
        //             style={{
        //                 backgroundColor: 'white',
        //                 padding: 28,
        //                 display: 'flex',
        //                 flexDirection: 'column',
        //                 gap: 28
        //             }}
        //         >
        //             <div
        //                 style={{
        //                     display: 'flex',
        //                     flexDirection: 'column',
        //                     gap: 14
        //                 }}
        //             >
        //                 Approval Vendor
        //                 <div
        //                     style={{
        //                         padding: '12px 10px',
        //                         border: '1px solid black'
        //                     }}
        //                 >
        //                     <span
        //                         style={{
        //                             color: '#3699ff',
        //                             fontSize: 14,
        //                             fontWeight: 500
        //                         }}
        //                     >
        //                         001.KTR-DNG1.PBJ-GDE-I-2022.FULL-CONTRACT.Admin_Zulfiqur_Rahman.08-08-2022 1437.DRAFT_FINAL_ADD_PDF.pdf
        //                     </span>
        //                 </div>
        //                 <div>
        //                         Catatan Vendor
        //                         <textarea
        //                             rows="4"
        //                             className="form-control"
        //                         ></textarea>
        //                 </div>
        //                 <button
        //                     onClick={showDownloadVendor}
        //                     className="btn btn-primary"
        //                     style={{
        //                         maxWidth: 270
        //                     }}
        //                 >
        //                     Unduh Hasil Approval Vendor
        //                 </button>
        //             </div>
        //             <div
        //                                             style={{
        //                                                 display: 'flex',
        //                                                 flexDirection: 'column',
        //                                                 gap: 14
        //                                             }}
        //             >
        //                 Approval User
        //                 <div
        //                     style={{
        //                         padding: '12px 10px',
        //                         border: '1px solid black'
        //                     }}
        //                 >
        //                     <span
        //                         style={{
        //                             color: '#3699ff',
        //                             fontSize: 14,
        //                             fontWeight: 500
        //                         }}
        //                     >
        //                         001.KTR-DNG1.PBJ-GDE-I-2022.FULL-CONTRACT.Admin_Zulfiqur_Rahman.08-08-2022 1437.DRAFT_FINAL_ADD_PDF.pdf
        //                     </span>
        //                 </div>
        //                 <div>
        //                     Catatan User
        //                     <textarea
        //                         rows="4"
        //                         className="form-control"
        //                         value={"sudah oke"}
        //                     ></textarea>
        //                 </div>
        //                 <button
        //                     onClick={showDownloadUser}
        //                     className="btn btn-primary"
        //                     style={{
        //                         maxWidth: 270
        //                     }}
        //                 >
        //                     Unduh Hasil Approval User
        //                 </button>
        //             </div>
        // </div>

        <>
          {!isAdmin && (
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
                    Unduh Kontrak ini, di TTD sebagai persetujuan vendor dan
                    unggah kembali dalam bentuk pdf
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
                  {/* <div>
                                            Catatan Vendor
                                            <textarea
                                                rows="4"
                                                className="form-control"
                                            ></textarea>
                                    </div> */}
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
                {/* <div
                                    style={{
                                        border: '1px solid black'
                                    }}
                                >
                                    <UploadInput />
                                </div> */}
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
          )}

          {isAdmin && (
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
          )}
        </>
      )}

      {sequence === 4 && (
        <>
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

          {distributionSequence === 0 && (
            <div
              style={{
                backgroundColor: "white",
                padding: 28,
                display: "flex",
                flexDirection: "column",
                gap: 28,
              }}
            >
              {/* gak kepake */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                }}
              >
                {/* Hasil Persetujuan Vendor dan User */}
                {/* <h1
                                        style={{
                                            fontSize: 16,
                                            fontWeight: 600
                                        }}
                                    >
                                        Distribusi Addendum Kontrak
                                    </h1> */}
                {/* <div>
                                        Catatan User
                                        <textarea
                                            rows="4"
                                            className="form-control"
                                            value={"sudah oke"}
                                        ></textarea>
                                    </div> */}
                {/* <button
                                        onClick={showDownloadUser}
                                        className="btn btn-primary"
                                        style={{
                                            maxWidth: 270
                                        }}
                                    >
                                        Unduh Persetujuan
                                    </button> */}
              </div>

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
          )}

          {distributionSequence === 1 && isAdmin && (
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

                {/* admin kontrak */}
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

                {/* user */}
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

                {/* vendor */}
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

          {distributionSequence === 1 && !isAdmin && loginStatus !== "vendor" && (
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

                {/* admin kontrak */}
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

                {/* user */}
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

          {distributionSequence === 1 && loginStatus === "vendor" && (
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
      )}

      {sequence === 0 && (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 28,
            padding: "2rem 2.25rem",
          }}
        >
          <button
            className="btn btn-outline-primary"
            style={{
              minWidth: 100,
            }}
            onClick={() =>
              tabActive > 0
                ? setTabActive(tabActive - 1)
                : setTabActive(tabActive)
            }
          >
            {`<< Back`}
          </button>
          {/* disable pasal sebelum addnm */}
          <button
            className="btn btn-primary"
            style={{
              minWidth: 100,
            }}
            onClick={() =>
              setTabActive(
                tabActive < TabLists.length - 1 ? tabActive + 1 : tabActive
              )
            }
          >
            Next
          </button>
        </div>
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
});

const mapDispatch = {
  fetch_api_sg,
};

export default connect(mapState, mapDispatch)(DraftAddendumPage);
