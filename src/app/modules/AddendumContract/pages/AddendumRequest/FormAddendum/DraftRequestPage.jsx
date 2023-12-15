import React, { useState, useRef, useEffect } from "react";
import { Button } from "react-bootstrap";
import { Paper, makeStyles, CircularProgress } from "@material-ui/core";
import { Link } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import { DEV_NODE } from "redux/BaseHost";
import { API_EPROC } from "redux/BaseHost";
import { useLocation, useParams, withRouter } from "react-router-dom";
import { compose } from "redux";
import { useDispatch, connect } from "react-redux";
import { toAbsoluteUrl } from "_metronic/_helpers/AssetsHelpers";
import { actionTypes } from "app/modules/AddendumContract/_redux/addendumContractAction";
import { Col, Row } from "react-bootstrap";
import { fetch_api_sg } from "redux/globalReducer";
import * as addendumContract from "app/modules/AddendumContract/service/AddendumContractCrudService";

import DialogGlobal from "app/components/modals/DialogGlobal";
import TabsAddendum from "./Components/Tabs";
import useToast from "app/components/toast/index";
import Subheader from "app/components/subheader";
import SubBreadcrumbs from "app/components/SubBreadcrumbs";
import UploadDokumenPendukung from "./UploadDokumenPendukung";

import SVG from "react-inlinesvg";
import FormPermohonan from "app/modules/AddendumContract/pages/AddendumRequest/FormAddendum/FormPermohonan";
import FormParameter from "app/modules/AddendumContract/pages/AddendumRequest/FormAddendum/FormParameter";
import Steppers from "app/components/steppersCustom/Steppers";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(1),
    overflowX: "auto",
  },
  table: {
    minWidth: 650,
  },
}));

// const TabLists = [

//   {
//     id: "parties",
//     // label: <FormattedMessage id="CONTRACT_DETAIL.TAB.DETAIL" />,
//     label: "Para Pihak",
//     // icon: <PlayCircleOutlineIcon className="mb-0 mr-2" />,
//     addendum: false
//   },

//   {
//     id: "price_job",
//     // label: <FormattedMessage id="CONTRACT_DETAIL.TAB.DETAIL" />,
//     label: "Harga Pekerjaan",
//     // icon: <FindInPage className="mb-0 mr-2" />,
//     addendum: false
//   },

//   {
//     id: "time_period",
//     // label: <FormattedMessage id="CONTRACT_DETAIL.TAB.PARTIES" />,
//     label: "Jangka Waktu",
//     // icon: <PeopleAlt className="mb-0 mr-2" />,
//     addendum: false
//   },

//   {
//     id: "payment_method",
//     // label: <FormattedMessage id="CONTRACT_DETAIL.TAB.DOK_CONT" />,
//     label: "Metode Pembayaran",
//     // icon: <Assignment className="mb-0 mr-2" />,
//     addendum: false
//   },

//   {
//     id: "fine",
//     // label: <FormattedMessage id="CONTRACT_DETAIL.TAB.PRICE" />,
//     label: "Denda",
//     // icon: <MonetizationOn className="mb-0 mr-2" />,
//     addendum: false
//   },

//   {
//     id: "guarantee",
//     // label: <FormattedMessage id="CONTRACT_DETAIL.TAB.PERIOD" />,
//     label: "Jaminan",
//     // icon: <QueryBuilderSharp className="mb-0 mr-2" />,
//     addendum: false
//   },

//   {
//     id: "jaminan",
//     // label: <FormattedMessage id="CONTRACT_DETAIL.TAB.GUARANTEE" />,
//     label: "Nomor Rekening",
//     // icon: <FeaturedPlayList className="mb-0 mr-2" />,
//     addendum: false
//   },

// ]

export const DraftRequestPage = ({
  dataContractById,
  authStatus,
  fetch_api_sg,
}) => {
  const openCloseAddDocument = React.useRef();
  const showAddDocument = () => {
    openCloseAddDocument.current.open();
  };

  const keys = {
    fetch: "get-data-contracts-header",
  };

  // gak ada isi nya
  // console.log('isi data contract by id di delivery monitoring', dataContractById)
  const classes = useStyles();
  const location = useLocation();
  const { contract_id, addendum_id, tab: forceTabActive } = useParams();
  const [Toast, setToast] = useToast();
  const dispatch = useDispatch();
  const [dataArr, setDataArr] = useState();
  const [jsonData, setJsonData] = useState();
  const [jobDirector, setJobDirector] = useState();
  const [jobSupervisor, setJobSupervisor] = useState();
  const [jobSupervisor2, setJobSupervisor2] = useState();
  const [authorizedOfficial, setauthorizedOfficial] = useState();
  const [secondAuthorizedOfficial, setSecondAuthorizedOfficial] = useState();
  const [PICData, setPICData] = useState();
  const [accountNumberBankData, setAccountNumberBankData] = useState();
  const [tabActive, setTabActive] = React.useState(0);
  const [sequence, setSequence] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [firstTime, setfirstTime] = React.useState(0);
  const [tempProps, setTempProps] = React.useState({
    task_id: "",
    tab: 0,
  });
  const [old, setOld] = React.useState({
    needRefresh: false,
    path: "",
  });
  const [TabLists, setTabLists] = React.useState([
    {
      id: "parties",
      // label: <FormattedMessage id="CONTRACT_DETAIL.TAB.DETAIL" />,
      label: "Para Pihak",
      // icon: <PlayCircleOutlineIcon className="mb-0 mr-2" />,
      addendum: false,
    },

    {
      id: "job_price",
      // label: <FormattedMessage id="CONTRACT_DETAIL.TAB.DETAIL" />,
      label: "Harga Pekerjaan",
      // icon: <FindInPage className="mb-0 mr-2" />,
      addendum: false,
    },

    {
      id: "time_period",
      // label: <FormattedMessage id="CONTRACT_DETAIL.TAB.PARTIES" />,
      label: "Jangka Waktu",
      // icon: <PeopleAlt className="mb-0 mr-2" />,
      addendum: false,
    },

    {
      id: "payment_method",
      // label: <FormattedMessage id="CONTRACT_DETAIL.TAB.DOK_CONT" />,
      label: "Metode Pembayaran",
      // icon: <Assignment className="mb-0 mr-2" />,
      addendum: false,
    },

    {
      id: "fine",
      // label: <FormattedMessage id="CONTRACT_DETAIL.TAB.PRICE" />,
      label: "Denda",
      // icon: <MonetizationOn className="mb-0 mr-2" />,
      addendum: false,
    },

    {
      id: "guarantee",
      // label: <FormattedMessage id="CONTRACT_DETAIL.TAB.PERIOD" />,
      label: "Jaminan",
      // icon: <QueryBuilderSharp className="mb-0 mr-2" />,
      addendum: false,
    },

    {
      id: "account_number",
      // label: <FormattedMessage id="CONTRACT_DETAIL.TAB.GUARANTEE" />,
      label: "Nomor Rekening",
      // icon: <FeaturedPlayList className="mb-0 mr-2" />,
      addendum: false,
    },

    {
      id: "others",
      label: "Lainnya",
      addendum: false,
      // label: <FormattedMessage id="CONTRACT_DETAIL.TAB.GUARANTEE" />,
      // icon: <FeaturedPlayList className="mb-0 mr-2" />,
    },
  ]);
  const [checkedInitialValues, setCheckedInitialValues] = useState([]);
  useEffect(() => {
    console.log("checked initial values", checkedInitialValues);
  }, [checkedInitialValues]);
  const [timePeriodData, setTimePeriodData] = useState();
  const [initialData, setInitialData] = useState();

  const addCheckedField = (data, type) => {
    if (type === "jasa") {
      data.map((services) => {
        services.item_services.map((service) => {
          service.checked = false;
        });
      });
    }
    if (type === "barang") {
      data.map((item) => {
        item.checked = false;
      });
    }
  };

  const toPush = useRef();

  const setPush = (e) => {
    toPush.current.click();
  };

  const setInitialSubmitItems = () => {
    const initialSubmitItems = {
      task_items: [],
      task_services: [],
    };
    dispatch({
      type: actionTypes.SetSubmitItemsByContractId,
      payload: initialSubmitItems,
    });
  };

  // get data contract detail from api
  const getContractById = async (contract_id) => {
    try {
      // loading buat throttling
      setLoading(true);

      // masukin response api nya ke objek yang nama properti nya data
      const {
        data: { data },
      } = await addendumContract.getAddendumContractById(contract_id);

      addCheckedField(data?.services, "jasa");
      addCheckedField(data?.items, "barang");

      dispatch({
        type: actionTypes.SetContractById,
        payload: data,
      });
    } catch (error) {
      if (
        error.response?.status !== 400 &&
        error.response?.data.message !== "TokenExpiredError"
      ) {
        if (
          error.response?.status !== 400 &&
          error.response?.data.message !== "TokenExpiredError"
        ) {
          setToast("Error API, please contact developer!");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    // kalo dipanggil bisa
    getContractById(contract_id);
    getDataContractHeader();
    getDataContractHeaderAfter();
    getauthorizedOfficial();
    getJobDirector();
    getJobSupervisor();
    setInitialSubmitItems();
    getFinalDraftData();
    getAddContractDocument();
    const refresh = () => {
      let isRefresh = localStorage.getItem("isRefresh");
      if (isRefresh === "false") {
        localStorage.setItem("isRefresh", true);
        window.location.reload();
      }
    };
    refresh();
    // eslint-disable-next-line
  }, []);

  // sengaja dikasih event biar yang diambil value nya
  function handleChangeTab(event, newTabActive) {
    // isi nya urutan angka array sesuai dengan yang di klik
    console.log("isi newTabActive", newTabActive);
    setTabActive(newTabActive);
  }

  const [finalDraftData, setFinalDraftData] = useState();
  const [tabDisableLists, setTabDisableLists] = useState();

  const getFinalDraftData = async () => {
    fetch_api_sg({
      key: keys.fetch,
      type: "get",
      // url: `/adendum/contract-final-draft/${contract_id}/show`,
      url: `/adendum/contract-final-draft/d086f59c-838a-440f-a262-d8f21f8fc4e1/show`,
      onSuccess: (res) => {
        console.log("isi respon 2.23", res.data);
        setFinalDraftData(res.data);
      },
    });
  };

  const getDataContractHeader = async () => {
    fetch_api_sg({
      key: keys.fetch,
      type: "get",
      url: `/adendum/contract-released/${contract_id}/show`,
      onSuccess: (res) => {
        console.log("apakah menarik data", res?.data);
        setJsonData(res?.data);
        localStorage.setItem(
          "payment_method",
          JSON.stringify(res?.data?.payment_method_data)
        );
        setDataArr({
          id: res.data.id,
          contract_no: res?.data?.contract_no,
          agreement_number: res?.data?.contract_no,
          procurement_title: res?.data?.contract_name,
          po_number: res?.data?.purch_order_no,
          po_note: res?.data?.purch_order.name,
          agreement_format: res?.data?.contract_format?.name,
          agreement_type: res?.data?.contract_type?.name,
          procurement_authority: res?.data?.authority?.facility?.name,
          procurement_authority_group:
            res?.data?.authority_group?.party?.full_name,
          user: res?.data?.user?.facility.name,
          user_group: res?.data?.user_group?.party?.full_name,
          provider: res?.data?.vendor?.party?.full_name,

          initial_contract_value: res?.data?.contract_value,
          latest_contract_value: res?.data?.after_addendum_job_price,
          // salah, pake punya orang, harus nya null
          // doc_number: res.data.add_contracts[0].add_doc_number,
          doc_number: null,
          currency: res.data?.currency?.code,
          // increase_job_price: res.data.increase_job_price,
          // decrease_job_price: res.data.decrease_job_price,
          // addendum_percentage: res.data.addendum_percentage,
          // conclusion: res.data.conclusion,
        });
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
            contract_period_range_month: res?.data?.contract_period_range_month,
            work_implement_period_day: res?.data?.work_implement_period_day,
            work_implement_period_month: res?.data?.work_implement_period_month,
            guarantee_period_day: res?.data?.guarantee_period_day,
            guarantee_period_month: res?.data?.guarantee_period_month,
            maintenance_period_day: res?.data?.maintenance_period_day,
            maintenance_period_month: res?.data?.maintenance_period_month,
          })
        );
        let timePeriodData = JSON.parse(localStorage.getItem("time_period"));
        setTimePeriodData(timePeriodData);
        getSecondAuthorizedOfficial(res?.data?.vendor_id);
      },
    });
  };

  const getDataContractHeaderAfter = async () => {
    fetch_api_sg({
      key: keys.fetch,
      type: "get",
      url: `/adendum/add-contracts/${addendum_id}`,
      onSuccess: (res) => {
        console.log("apakah menarik data", res?.data);
        setTabDisableLists(res?.data);
        setStepper(res?.data?.steppers);
      },
    });
  };

  // if (res?.data?.is_add_parties === true) {
  //   setCheckedInitialValues([...checkedInitialValues, "parties"]);
  // }

  const getauthorizedOfficial = async () => {
    fetch_api_sg({
      key: keys.fetch,
      type: "get",
      url: `/adendum/job-directors`,
      onSuccess: (res) => {
        console.log("apakah menarik data direksi", res.data);
        setauthorizedOfficial(res.data);
      },
    });
  };

  const getSecondAuthorizedOfficial = async (id) => {
    fetch_api_sg({
      key: keys.fetch,
      type: "get",
      url: `/adendum/refference/get-vendor/${id}`,
      onSuccess: (res) => {
        console.log("apakah menarik data direksi", res.data);
        setSecondAuthorizedOfficial(res.data.officer_data);
        setPICData(res.data.pic_data);
        setAccountNumberBankData(res.data.bank_data);
      },
    });
  };

  const getJobDirector = async () => {
    fetch_api_sg({
      key: keys.fetch,
      type: "get",
      url: `/adendum/direksi-pekerjaan`,
      onSuccess: (res) => {
        console.log("apakah menarik data direksi", res.data);
        setJobDirector(res.data);
      },
    });
  };

  const getJobSupervisor = async () => {
    fetch_api_sg({
      key: keys.fetch,
      type: "get",
      url: `/adendum/refference/get-all-plants`,
      onSuccess: (res) => {
        // hasil respon akan SELALU PASS BY REFERENCE
        setJobSupervisor(res.data);
        localStorage.setItem("job_supervisor", JSON.stringify(res.data));
        setJobSupervisor2(JSON.parse(localStorage.getItem("job_supervisor")));
      },
    });
  };

  React.useEffect(() => {
    if (
      tempProps.contract_id != contract_id ||
      tempProps.tab != forceTabActive
    ) {
      setfirstTime(0);
      setInitialSubmitItems();
    }
    if (firstTime === 1) return;
    if (!!forceTabActive && firstTime === 0) {
      handleChangeTab(null, forceTabActive - 1);
      if (!!dataContractById) {
        setfirstTime(1);
        setTempProps({
          contract_id,
          tab: forceTabActive,
        });
      }
    }
  }, [dataContractById, contract_id, forceTabActive]);

  React.useEffect(() => {
    if (location.pathname !== old.path) {
      setOld({
        needRefresh: true,
        path: location.pathname,
      });
      setTimeout(() => {
        setOld((e) => ({
          ...e,
          needRefresh: false,
        }));
      }, 500);
    }
  }, [location]);

  const checkLength = (lengthValue) => {
    if (lengthValue > 0) {
      setSequence(1);
    }
  };

  const assignTabLists = (values) => {
    console.log("isi values", values);
    console.log("isi tablists", TabLists);

    TabLists.map((Tabitem) => {
      Tabitem.addendum = false;
    });

    TabLists.map((Tabitem) => {
      values.map((item) => {
        if (item === Tabitem.id) {
          Tabitem.addendum = true;
        }
      });
    });

    setCheckedInitialValues(values);
  };

  const [supportDocumentFetch, setSupportDocumentFetch] = useState();
  useEffect(() => {
    console.log("data sekarang", supportDocumentFetch);
  }, [supportDocumentFetch]);

  const getAddContractDocument = async () => {
    fetch_api_sg({
      key: keys.fetch,
      type: "get",
      url: `/adendum/add-contract-document`,
      onSuccess: (res) => {
        setSupportDocumentFetch(res.data);
        setInitialData(res.data);
      },
    });
  };

  const [finalDraftSelectValue, setFinalDraftSelectValue] = useState("Kontrak");
  const [stepper, setStepper] = useState();

  return (
    <React.Fragment>
      <Toast />

      {loading ? (
        <div className="d-flex justify-content-center m-5 border-danger">
          <CircularProgress />
        </div>
      ) : null}

      {/* tambah upload dokumen pendukung */}
      <DialogGlobal
        ref={openCloseAddDocument}
        isCancel={false}
        isSubmit={false}
      >
        <Formik
          initialValues={{
            namaDokumen: "",
            noDokumen: "",
            tglDokumen: "",
            fileDokumen: "",
            perihal: "",
          }}
          onSubmit={(values) => {
            setSupportDocumentFetch((previous) => {
              return [
                ...previous,
                {
                  idDokumen: "0",
                  document_name: values.namaDokumen,
                  noDokumen: values.noDokumen,
                  tglDokumen: values.tglDokumen,
                  fileDokumen: values.fileDokumen,
                  seq: supportDocumentFetch.length + 1,
                },
              ];
            });
            openCloseAddDocument.current.close();
          }}
        >
          {(props) => {
            const { setFieldValue } = props;
            return (
              <Form>
                <div>
                  <Row>
                    <Col md={4}>
                      Nama Dokumen
                      <Field type="text" name={`namaDokumen`} />
                    </Col>
                  </Row>
                  <Row>
                    <Col md={4}>
                      No Dokumen
                      <Field type="text" name={`noDokumen`} />
                    </Col>
                    <Col md={3}>
                      Tanggal Dokumen
                      <Field type="date" name={`tglDokumen`} />
                    </Col>
                    <Col md={5}>
                      Upload Dokumen
                      <input
                        type="file"
                        style={{
                          border: 1,
                          borderColor: "black",
                          borderStyle: "solid",
                          borderRadius: 4,
                          padding: 8,
                          width: "100%",
                        }}
                        onChange={(event) => {
                          setFieldValue(
                            `fileDokumen`,
                            event.currentTarget.files[0]
                          );
                        }}
                      />
                    </Col>
                  </Row>
                  <Row className={"mb-9 mt-3 mx-2"}>
                    Perihal
                    <Field
                      as="textarea"
                      name={`perihal`}
                      // onKeyUp={(e) => {
                      //   resizeTextArea(e.target);
                      // }}
                      style={{
                        maxHeight: 160,
                        width: "100%",
                        padding: 8,
                      }}
                    />
                  </Row>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 28,
                    padding: "2rem 2.25rem",
                  }}
                >
                  <Button
                    type="submit"
                    style={{
                      minWidth: 100,
                    }}
                  >
                    Submit
                  </Button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </DialogGlobal>

      <Subheader
        text={
          dataArr
            ? `Formulir Permohonan Addendum ${
                dataArr?.contract_no?.substring(4, 7) === "SPK"
                  ? "SPK"
                  : "Perjanjian"
              }  No : 
            ${dataArr?.agreement_number}
          `
            : null
        }
      />

      <SubBreadcrumbs
        items={[
          {
            label: `Addendum Contract`,
            to: `/${authStatus}/addendum-contract/list-contract-po`,
          },
          {
            label: "List of Contract & SPK",
            to: `/${authStatus}/addendum-contract/list-contract-po`,
          },
          {
            label: `${dataArr ? dataArr?.agreement_number : "x"}`,
            to: "/",
          },
        ]}
      />

      <Steppers steps={stepper} />

      {jsonData?.form_review ? (
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
            onChange={(e) => setFinalDraftSelectValue(e.target.value)}
          >
            <option value="Kontrak">Final Draft Kontrak</option>
            <option value="Addendum">Final Draft Addendum</option>
          </select>

          {finalDraftSelectValue === "Kontrak" && (
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
                      `${API_EPROC}/${jsonData?.form_review?.spk_name}`,
                      "_blank"
                    )
                  }
                >
                  {jsonData?.form_review?.spk_name}
                </a>
              </div>

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
                {/* <p>Lampiran 1.doc</p> */}
                <a
                  style={{
                    marginBottom: "1rem",
                  }}
                  onClick={() =>
                    window.open(
                      `${API_EPROC}/${jsonData?.form_review?.lampiran_1_name}`,
                      "_blank"
                    )
                  }
                >
                  {jsonData?.form_review?.lampiran_1_name}
                </a>
              </div>

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
                    marginBottom: "1rem",
                  }}
                  onClick={() =>
                    window.open(
                      `${API_EPROC}/${jsonData?.form_review?.lampiran_2_name}`,
                      "_blank"
                    )
                  }
                >
                  {jsonData?.form_review?.lampiran_2_name}
                </a>
              </div>
            </div>
          )}

          {finalDraftSelectValue === "Addendum" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                // rowGap: 14,
                marginTop: 14,
              }}
            >
              <p>Perihal: {finalDraftData.add_contracts[0].perihal}</p>
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
                      `${DEV_NODE}/final_draft/${finalDraftData.add_contracts[0].final_draft[0].body_file_name}`,
                      "_blank"
                    )
                  }
                >
                  {
                    finalDraftData.add_contracts[0].final_draft[0]
                      .body_file_name
                  }
                </a>
              </div>
              {finalDraftData.add_contracts[0].final_draft[0].lampiran_data.map(
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
                            `${DEV_NODE}/final_draft/lampiran/${item.lampiran_file_name}`,
                            "_blank"
                          )
                        }
                      >
                        {item.lampiran_file_name}
                      </a>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="d-flex justify-content-center m-5 border-danger">
          <CircularProgress />
        </div>
      )}

      <Link to={"/client/addendum-contract/draft/" + contract_id}>
        <button
          style={{
            color: "white",
            fontSize: 14,
            fontWeight: "400",
            padding: "8px 14px",
            borderRadius: "8px",
            backgroundColor: "#8c8a8a",
            outline: "none",
            border: "none",
            marginBottom: 28,
          }}
        >
          Lihat Detail Addendum
        </button>
      </Link>

      <div
        style={{
          height: 60,
          fontSize: 14,
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
        }}
      >
        <div
          className="d-flex align-items-center justify-content-center"
          style={{
            backgroundColor: sequence === 0 ? "#3699ff" : "white",
            flexGrow: 1,
            borderTopLeftRadius: 14,
            cursor: "pointer",
          }}
          onClick={() => setSequence(0)}
        >
          <h1
            style={{ fontSize: 14, color: sequence === 0 ? "white" : "black" }}
          >
            Form Permohonan
          </h1>
        </div>

        <div
          className="d-flex align-items-center justify-content-center"
          style={{
            backgroundColor: sequence === 1 ? "#3699ff" : "white",

            flexGrow: 1,
            cursor: "pointer",
          }}
          onClick={() => setSequence(1)}
        >
          <h1
            style={{
              fontSize: 14,
              color: sequence === 1 ? "white" : "black",
            }}
          >
            Form Parameter
          </h1>
        </div>

        <div
          className="d-flex align-items-center justify-content-center"
          style={{
            backgroundColor: sequence === 2 ? "#3699ff" : "white",
            flexGrow: 1,
            borderTopRightRadius: 14,
            cursor: "pointer",
          }}
          onClick={() => setSequence(2)}
        >
          <h1
            style={{
              fontSize: 14,
              color: sequence === 2 ? "white" : "black",
            }}
          >
            Upload Dokumen Pendukung
          </h1>
        </div>
      </div>

      {sequence === 0 && (
        <Paper className={classes.root}>
          <FormPermohonan
            contractId={contract_id}
            headerData={dataArr}
            checkedLength={checkLength}
            assignTabLists={assignTabLists}
            checkedValues={checkedInitialValues}
          />
        </Paper>
      )}

      {sequence === 1 && (
        <Paper className={classes.root}>
          <TabsAddendum
            tabActive={tabActive}
            handleChange={handleChangeTab}
            tabLists={TabLists}
            variant="scrollable"
          />

          <FormParameter
            currentActiveTab={tabActive}
            headerData={dataArr}
            jsonData={jsonData}
            jobDirector={jobDirector}
            jobSupervisor={jobSupervisor}
            jobSupervisor2={jobSupervisor2}
            timePeriodData={timePeriodData}
            authorizedOfficial={authorizedOfficial}
            secondAuthorizedOfficial={secondAuthorizedOfficial}
            PICData={PICData}
            accountNumberBankData={accountNumberBankData}
            tabDisableLists={tabDisableLists}
          />

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
                tabActive > 0 ? setTabActive(tabActive - 1) : setSequence(0)
              }
            >
              {`<< Back`}
            </button>
            <Button
              style={{
                minWidth: 100,
              }}
              onClick={() =>
                tabActive < TabLists.length - 1
                  ? setTabActive(tabActive + 1)
                  : setTabActive(tabActive)
              }
            >
              {`Next >>`}
            </Button>
          </div>
        </Paper>
      )}

      {sequence === 2 && (
        <UploadDokumenPendukung
          supportDocumentFetch={supportDocumentFetch}
          openCloseAddDocument={openCloseAddDocument}
          showAddDocument={showAddDocument}
          initialData={initialData}
          // conclusion={localStorage.getItem("conclusion")}
          // isAddJobPrice={localStorage.getItem("isAddJobPrice")}
        />
      )}
    </React.Fragment>
  );
};

// ngirim data
const mapState = ({ auth, addendumContract }) => ({
  authStatus: auth.user.data.status,
  dataContractById: addendumContract.dataContractById,
});

// ngirim fungsi
const mapDispatch = {
  fetch_api_sg,
};

// apa itu withRouter?
export default compose(
  withRouter,
  connect(mapState, mapDispatch)
)(DraftRequestPage);
