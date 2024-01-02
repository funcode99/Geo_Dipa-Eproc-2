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
import TabsAddendum from "app/modules/AddendumContract/pages/AddendumRequest/FormAddendum/Components/Tabs";
// import { alphabet } from "./alphabet";

import Subheader from "app/components/subheader";
import DialogGlobal from "app/components/modals/DialogGlobal";
import useToast from "app/components/toast/index";
import SubBreadcrumbs from "app/components/SubBreadcrumbs";

import SVG from "react-inlinesvg";
import FormParameterView from "app/modules/AddendumContract/pages/AddendumRequest/FormAddendum/FormParameterView";
import Steppers from "app/components/steppersCustom/Steppers";
import {
  approveAddendumContract,
  rejectAddendumContract,
} from "app/modules/AddendumContract/service/AddendumContractCrudService";

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

const UserApprovalAddendumPage = ({
  authStatus,
  fetch_api_sg,
  dataContractById,
}) => {
  // const openCloseAddDocument = React.useRef();
  // const showAddDocument = () => {
  //   openCloseAddDocument.current.open();
  // };

  const alphabet = [
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ];

  const addendumPrefix = [
    "No Kontrak",
    "Jenis Kontrak",
    "Judul Pengadaan",
    "Penyedia",
    "Tanggal Permohonan Addendum",
  ];

  const addendumSuffix = [
    "Dokumen Pendukung",
    "Detail Addendum",
    "Permintaan Penerbitan Draft Addendum Kepada",
    "Catatan Addendum (Opsional)",
  ];

  const [addendumAdditional, setAddendumAdditional] = useState([]);
  const [addendumCombine, setAddendumCombine] = useState([]);
  useEffect(() => {
    setAddendumCombine([...addendumAdditional]);
  }, [addendumAdditional]);

  const keys = {
    fetch: "get-data-contracts-approval",
  };

  const approvalStepper0 = [
    {
      label: "Approval Direksi Pekerjaan",
      status: "wait",
    },
    {
      label: "Approval Pejabat Berwenang",
      status: "wait",
    },
  ];

  const approvalStepper1 = [
    {
      label: "Approval Direksi Pekerjaan",
      status: "on",
    },
    {
      label: "Approval Pejabat Berwenang",
      status: "wait",
    },
  ];

  const approvalStepper2 = [
    {
      label: "Approval Direksi Pekerjaan",
      status: "done",
    },
    {
      label: "Approval Pejabat Berwenang",
      status: "on",
    },
  ];

  const approvalStepper3 = [
    {
      label: "Approval Direksi Pekerjaan",
      status: "done",
    },
    {
      label: "Approval Pejabat Berwenang",
      status: "done",
    },
  ];

  // gak ada isi nya
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
  const [selectedTabLists, setSelectedTabLists] = useState();
  const [tempProps, setTempProps] = React.useState({
    task_id: "",
    tab: 0,
  });
  const [old, setOld] = React.useState({
    needRefresh: false,
    path: "",
  });
  const [TabLists, setTabLists] = React.useState([
    // {
    //   id: "parties",
    //   // label: <FormattedMessage id="CONTRACT_DETAIL.TAB.DETAIL" />,
    //   label: "Para Pihak",
    //   // icon: <PlayCircleOutlineIcon className="mb-0 mr-2" />,
    //   addendum: false,
    // },
    // {
    //   id: "job_price",
    //   // label: <FormattedMessage id="CONTRACT_DETAIL.TAB.DETAIL" />,
    //   label: "Harga Pekerjaan",
    //   // icon: <FindInPage className="mb-0 mr-2" />,
    //   addendum: false,
    // },
    // {
    //   id: "time_period",
    //   // label: <FormattedMessage id="CONTRACT_DETAIL.TAB.PARTIES" />,
    //   label: "Jangka Waktu",
    //   // icon: <PeopleAlt className="mb-0 mr-2" />,
    //   addendum: false,
    // },
    // {
    //   id: "payment_method",
    //   // label: <FormattedMessage id="CONTRACT_DETAIL.TAB.DOK_CONT" />,
    //   label: "Metode Pembayaran",
    //   // icon: <Assignment className="mb-0 mr-2" />,
    //   addendum: false,
    // },
    // {
    //   id: "fine",
    //   // label: <FormattedMessage id="CONTRACT_DETAIL.TAB.PRICE" />,
    //   label: "Denda",
    //   // icon: <MonetizationOn className="mb-0 mr-2" />,
    //   addendum: false,
    // },
    // {
    //   id: "guarantee",
    //   // label: <FormattedMessage id="CONTRACT_DETAIL.TAB.PERIOD" />,
    //   label: "Jaminan",
    //   // icon: <QueryBuilderSharp className="mb-0 mr-2" />,
    //   addendum: false,
    // },
    // {
    //   id: "account_number",
    //   // label: <FormattedMessage id="CONTRACT_DETAIL.TAB.GUARANTEE" />,
    //   label: "Nomor Rekening",
    //   // icon: <FeaturedPlayList className="mb-0 mr-2" />,
    //   addendum: false,
    // },
    // {
    //   id: "others",
    //   label: "Lainnya",
    //   addendum: false,
    //   // label: <FormattedMessage id="CONTRACT_DETAIL.TAB.GUARANTEE" />,
    //   // icon: <FeaturedPlayList className="mb-0 mr-2" />,
    // },
  ]);
  const [checkedInitialValues, setCheckedInitialValues] = useState([]);
  const [timePeriodData, setTimePeriodData] = useState();
  const [initialData, setInitialData] = useState();

  const submitApproval = (type) => {
    if (type === "Reject") {
      rejectAddendumContract(addendum_id);
    } else {
      approveAddendumContract(addendum_id);
    }
  };

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
    // const refresh = () => {
    //   let isRefresh = localStorage.getItem("isRefresh");
    //   if (isRefresh === "false") {
    //     localStorage.setItem("isRefresh", true);
    //     window.location.reload();
    //   }
    // };
    // refresh();
  }, []);

  // sengaja dikasih event biar yang diambil value nya
  function handleChangeTab(event, newTabActive) {
    // isi nya urutan angka array sesuai dengan yang di klik
    setTabActive(newTabActive);
    setSelectedTabLists(TabLists[newTabActive]?.label);
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
        setJsonData(res?.data);
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

          payment_method_data: res?.data?.payment_method,
          penalty_fine_data: res?.data?.penalty_fine_data,
          time_period_data: {
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
          },
        });
        // pakai ini biar gak pass by reference, tapi pass by value
        localStorage.setItem(
          "payment_method",
          JSON.stringify(res?.data?.payment_method_data)
        );
        localStorage.setItem(
          "fine",
          JSON.stringify(res?.data?.penalty_fine_data)
        );
        // start of local storage jangka waktu
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
        localStorage.removeItem("time_period");
        setTimePeriodData(timePeriodData);
        // end of local storage jangka waktu
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
        setTabDisableLists(res?.data);
        if (res?.data?.status_code === "15") {
          setStepper(approvalStepper1);
        } else if (res?.data?.status_code === "30") {
          setStepper(approvalStepper2);
        } else if (res?.data?.status_code === "35") {
          setStepper(approvalStepper3);
        } else {
          setStepper(approvalStepper0);
        }
        if (res?.data?.is_add_parties) {
          setAddendumAdditional((current) => [...current, "Para Pihak"]);
          setTabLists((current) => [
            ...current,
            {
              id: "parties",
              label: "Para Pihak",
              addendum: true,
            },
          ]);
        }
        if (res?.data?.is_add_job_price) {
          setAddendumAdditional((current) => [...current, "Harga Pekerjaan"]);
          setTabLists((current) => [
            ...current,
            {
              id: "job_price",
              label: "Harga Pekerjaan",
              addendum: true,
            },
          ]);
        }
        if (res?.data?.is_add_time_period) {
          setAddendumAdditional((current) => [...current, "Jangka Waktu"]);
          setTabLists((current) => [
            ...current,
            {
              id: "time_period",
              label: "Jangka Waktu",
              addendum: true,
            },
          ]);
        }
        if (res?.data?.is_add_payment_method) {
          setAddendumAdditional((current) => [...current, "Metode Pembayaran"]);
          setTabLists((current) => [
            ...current,
            {
              id: "payment_method",
              label: "Metode Pembayaran",
              addendum: true,
            },
          ]);
        }
        if (res?.data?.is_add_fine === true) {
          setAddendumAdditional((current) => [...current, "Denda"]);
          setTabLists((current) => [
            ...current,
            {
              id: "fine",
              label: "Denda",
              addendum: true,
            },
          ]);
        }
        if (res?.data?.is_add_guarantee) {
          setAddendumAdditional((current) => [...current, "Jaminan"]);
          setTabLists((current) => [
            ...current,
            {
              id: "guarantee",
              label: "Jaminan",
              addendum: true,
            },
          ]);
        }
        if (res?.data?.is_add_account_number === true) {
          setAddendumAdditional((current) => [...current, "Nomor Rekening"]);
          setTabLists((current) => [
            ...current,
            {
              id: "account_number",
              label: "Nomor Rekening",
              addendum: true,
            },
          ]);
        }
      },
    });
  };

  const getauthorizedOfficial = async () => {
    fetch_api_sg({
      key: keys.fetch,
      type: "get",
      url: `/adendum/job-directors`,
      onSuccess: (res) => {
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

  const [stepper, setStepper] = useState();
  const [initialValues, setInitialValues] = useState(0);
  if (typeof TabLists[0]?.label !== "undefined" && initialValues === 0) {
    setSelectedTabLists(TabLists[0].label);
    setInitialValues(1);
  }

  return (
    <>
      <h1>
        Formulir Permohonan Addendum Perjanjian:{" "}
        {tabDisableLists?.add_request_number}
      </h1>

      <SubBreadcrumbs
        items={[
          {
            label: `Addendum Contract`,
            to: `/${authStatus}/addendum-contract/list-contract-po`,
          },
          {
            label: "List of Addendum Request",
            to: `/${authStatus}/addendum-contract/list-addendum-request`,
          },
          {
            label: `${dataArr ? dataArr?.agreement_number : "x"}`,
            to: "/",
          },
        ]}
      />
      <Steppers steps={stepper} />

      <Paper>
        <div
          style={{
            padding: "2rem 2.25rem",
          }}
        >
          <h1
            style={{
              fontWeight: 700,
              fontSize: 24,
              marginTop: 52,
            }}
          >
            Form Persetujuan Addendum
          </h1>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              rowGap: 14,
              marginTop: 33,
            }}
          >
            {/* No Kontrak */}
            <div
              style={{
                display: "flex",
              }}
            >
              <div
                style={{
                  minWidth: 350,
                }}
              >
                <h3
                  style={{
                    fontWeight: 500,
                    fontSize: 14,
                  }}
                >
                  A. No Kontrak
                </h3>
              </div>
              <div>: {tabDisableLists?.contract?.contract_no}</div>
            </div>
            <div
              style={{
                display: "flex",
              }}
            >
              <div
                style={{
                  minWidth: 350,
                }}
              >
                <h3
                  style={{
                    fontWeight: 500,
                    fontSize: 14,
                  }}
                >
                  B. Jenis Kontrak
                </h3>
              </div>
              <div>: {tabDisableLists?.contract?.contract_type?.name}</div>
            </div>
            <div
              style={{
                display: "flex",
              }}
            >
              <div
                style={{
                  minWidth: 350,
                }}
              >
                <h3
                  style={{
                    fontWeight: 500,
                    fontSize: 14,
                  }}
                >
                  C. Judul Pengadaan
                </h3>
              </div>
              <div>: {tabDisableLists?.contract?.contract_name}</div>
            </div>
            <div
              style={{
                display: "flex",
              }}
            >
              <div
                style={{
                  minWidth: 350,
                }}
              >
                <h3
                  style={{
                    fontWeight: 500,
                    fontSize: 14,
                  }}
                >
                  D. Penyedia
                </h3>
              </div>
              <div>: {tabDisableLists?.contract?.vendor?.party?.full_name}</div>
            </div>
            <div
              style={{
                display: "flex",
              }}
            >
              <div
                style={{
                  minWidth: 350,
                }}
              >
                <h3
                  style={{
                    fontWeight: 500,
                    fontSize: 14,
                  }}
                >
                  E. Tanggal Permohonan Addendum
                </h3>
              </div>
              <div>: {tabDisableLists?.add_request_date}</div>
            </div>
          </div>

          {addendumCombine.map((item, index) => {
            return (
              <>
                {/* Bagian addendum */}
                <div
                  style={{
                    marginTop: 14,
                  }}
                >
                  <h3
                    style={{
                      fontWeight: 500,
                      fontSize: 14,
                    }}
                  >
                    {alphabet[index]}. {item}
                  </h3>
                  <div
                    style={{
                      display: "flex",
                    }}
                  >
                    {item === "Para Pihak" && (
                      <table>
                        <tr>
                          <th>Sebelum Addendum</th>
                          <th>Setelah Addendum</th>
                          <th>Keterangan</th>
                        </tr>
                        <tr>
                          <td>Herdian</td>
                          <td>Herdian</td>
                          <td>Pejabat Berwenang</td>
                        </tr>
                      </table>
                    )}
                    {item === "Harga Pekerjaan" && (
                      <table>
                        <tr>
                          <th>Sebelum Addendum</th>
                          <th>Setelah Addendum</th>
                          <th>Keterangan</th>
                        </tr>
                        <tr>
                          <td>{dataArr?.initial_contract_value}</td>
                          <td>Rp 9.500.000.000,00</td>
                          <td></td>
                        </tr>
                      </table>
                    )}
                    {item === "Jangka Waktu" && (
                      <table>
                        <tr>
                          <th>Sebelum Addendum</th>
                          <th>Setelah Addendum</th>
                          <th>Keterangan</th>
                        </tr>
                        <tr>
                          <td>
                            {dataArr?.time_period_data?.from_time || "x"} -{" "}
                            {dataArr?.time_period_data?.thru_time || "x"}
                          </td>
                          <td>
                            {tabDisableLists?.add_contract_time_period
                              ?.from_time || "x"}{" "}
                            -{" "}
                            {tabDisableLists?.add_contract_time_period
                              ?.thru_time || "x"}
                          </td>
                          <td>Jangka Waktu Perjanjian</td>
                        </tr>
                        <tr>
                          <td>
                            {dataArr?.time_period_data?.worked_start_date ||
                              "x"}{" "}
                            -{" "}
                            {dataArr?.time_period_data?.worked_end_date || "x"}
                          </td>
                          <td>
                            {tabDisableLists?.add_contract_time_period
                              ?.worked_start_date || "x"}{" "}
                            -{" "}
                            {tabDisableLists?.add_contract_time_period
                              ?.worked_end_date || "x"}
                          </td>
                          <td>Jangka Waktu Pelaksanaan Pekerjaan</td>
                        </tr>
                        <tr>
                          <td>
                            {dataArr?.time_period_data?.guarantee_start_date ||
                              "x"}{" "}
                            -{" "}
                            {dataArr?.time_period_data?.guarantee_end_date ||
                              "x"}
                          </td>
                          <td>
                            {tabDisableLists?.add_contract_time_period
                              ?.guarantee_start_date || "x"}{" "}
                            -{" "}
                            {tabDisableLists?.add_contract_time_period
                              ?.guarantee_end_date || "x"}
                          </td>
                          <td>Jangka Waktu Masa Garansi</td>
                        </tr>
                        <tr>
                          <td>
                            {dataArr?.time_period_data
                              ?.maintenance_start_date || "x"}{" "}
                            -{" "}
                            {dataArr?.time_period_data?.maintenance_end_date ||
                              "x"}
                          </td>
                          <td>
                            {tabDisableLists?.add_contract_time_period
                              ?.maintenance_start_date || "x"}{" "}
                            -{" "}
                            {tabDisableLists?.add_contract_time_period
                              ?.maintenance_end_date || "x"}
                          </td>
                          <td>Jangka Waktu Masa Pemeliharaan</td>
                        </tr>
                      </table>
                    )}
                    {item === "Metode Pembayaran" && (
                      <table>
                        <tr>
                          <th>Sebelum Addendum</th>
                          <th>Setelah Addendum</th>
                          <th>Keterangan</th>
                        </tr>
                        <tr>
                          <td>{dataArr?.payment_method_data}</td>
                          <td>Pembayaran Bertahap</td>
                          <td></td>
                        </tr>
                      </table>
                    )}
                    {item === "Denda" && (
                      <table>
                        <tr>
                          <th>Sebelum Addendum</th>
                          <th>Setelah Addendum</th>
                          <th>Keterangan</th>
                        </tr>

                        {dataArr?.penalty_fine_data?.map((item) => {
                          // wajib pakai return disini
                          return tabDisableLists?.add_contract_fine?.penalty_fine_data.map(
                            (item2) => {
                              return (
                                <tr>
                                  <td>
                                    Nilai {item?.value} - Maksimal{" "}
                                    {item?.max_day} Hari
                                  </td>
                                  <td>
                                    Nilai {item2?.value} - Maksimal{" "}
                                    {item2?.max_day} Hari
                                  </td>
                                  <td></td>
                                </tr>
                              );
                            }
                          );
                        })}
                      </table>
                    )}
                    {item === "Jaminan" && (
                      <table>
                        <tr>
                          <th>Sebelum Addendum</th>
                          <th>Setelah Addendum</th>
                          <th>Keterangan</th>
                        </tr>
                        <tr>
                          <td>01/08/2023 - 15/02/2024</td>
                          <td>
                            {tabDisableLists?.add_contract_guarantee
                              ?.down_payment_guarantee_start_date || "x"}{" "}
                            -{" "}
                            {tabDisableLists?.add_contract_guarantee
                              ?.down_payment_guarantee_end_date || "x"}
                          </td>
                          <td>Jaminan Uang Muka</td>
                        </tr>
                        <tr>
                          <td>01/08/2023 - 15/02/2024</td>
                          <td>
                            {tabDisableLists?.add_contract_guarantee
                              ?.implementation_guarantee_start_date || "x"}{" "}
                            -{" "}
                            {tabDisableLists?.add_contract_guarantee
                              ?.implementation_guarantee_end_date || "x"}
                          </td>
                          <td>Jaminan Pelaksanaan</td>
                        </tr>
                        <tr>
                          <td>01/08/2023 - 15/02/2024</td>
                          <td>
                            {tabDisableLists?.add_contract_guarantee
                              ?.maintenance_guarantee_start_date || "x"}{" "}
                            -{" "}
                            {tabDisableLists?.add_contract_guarantee
                              ?.maintenance_guarantee_end_date || "x"}
                          </td>
                          <td>Jaminan Pemeliharaan</td>
                        </tr>
                      </table>
                    )}
                    {item === "Nomor Rekening" && (
                      <table>
                        <tr>
                          <th>Sebelum Addendum</th>
                          <th>Setelah Addendum</th>
                          <th>Keterangan</th>
                        </tr>
                        <tr>
                          <td>Full Pembayaran</td>
                          <td>Pembayaran Bertahap</td>
                          <td></td>
                        </tr>
                      </table>
                    )}
                  </div>
                </div>
              </>
            );
          })}

          {/* Dokumen pendukung */}
          <div
            style={{
              marginTop: 14,
            }}
          >
            <h3
              style={{
                fontWeight: 500,
                fontSize: 14,
              }}
            >
              {alphabet[addendumCombine.length]}. Dokumen Pendukung
            </h3>
            <table>
              <tr>
                <th>No</th>
                <th>Nama Dokumen</th>
                <th>No Dokumen</th>
                <th>Tanggal Dokumen</th>
                <th>Dokumen</th>
              </tr>

              {tabDisableLists?.add_support_document_data &&
                tabDisableLists?.add_support_document_data.map(
                  (item, index) => {
                    return (
                      <>
                        <tr>
                          <td>{index + 1}</td>
                          <td>{item?.namaDokumen}</td>
                          <td>{item?.noDokumen}</td>
                          <td>{item?.tglDokumen}</td>
                          <td>
                            <a
                              onClick={() =>
                                window.open(
                                  `${DEV_NODE}/support_document/${item?.fileDokumen}`,
                                  "_blank"
                                )
                              }
                              style={{
                                color: "#3699ff",
                              }}
                            >
                              {item?.fileDokumen}
                            </a>
                          </td>
                        </tr>
                      </>
                    );
                  }
                )}
            </table>
          </div>
        </div>
      </Paper>

      {/* Detail Addendum */}
      <div
        style={{
          marginTop: 28,
        }}
      >
        <h3
          style={{
            fontWeight: 500,
            fontSize: 14,
            padding: "0 2.25rem",
          }}
        >
          {alphabet[addendumCombine.length + 1]}. Detail Addendum
        </h3>
        <Paper className={classes.root}>
          <TabsAddendum
            tabActive={tabActive}
            handleChange={handleChangeTab}
            tabLists={TabLists}
            variant="scrollable"
          />

          <FormParameterView
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
            disableUpdate={true}
            fromApproval={true}
            selectedTabLists={selectedTabLists}
          />

          {/* <div
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
                </div> */}
        </Paper>
      </div>

      <Paper>
        <div
          style={{
            padding: "0 2.25rem",
            display: "flex",
            flexDirection: "column",
            gap: 28,
          }}
        >
          <div>
            <div>
              <p
                style={{
                  fontWeight: 500,
                }}
              >
                {alphabet[addendumCombine.length + 2]}. Permintaan Penerbitan
                Draft Addendum Kepada:
              </p>
            </div>
            <div>
              <input
                style={{
                  padding: 8,
                  borderRadius: 4,
                  minWidth: 400,
                }}
                value={tabDisableLists?.add_drafter}
                disabled
              />
            </div>
          </div>
          <div>
            <div>
              <p
                style={{
                  fontWeight: 500,
                }}
              >
                {alphabet[addendumCombine.length + 3]}. Catatan Addendum
                (Opsional)
              </p>
            </div>
            <div>
              <textarea
                style={{
                  padding: 8,
                  borderRadius: 4,
                  minWidth: "100%",
                }}
                rows="4"
                disabled
                placeholder="Berisi catatan addendum baik di approve / reject"
                value={tabDisableLists?.request_note}
              />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Button>Download Memo to PDF</Button>
            <div
              style={{
                display: "flex",
                gap: 20,
              }}
            >
              <Button
                className="text-danger btn btn-white border border-danger"
                style={{
                  minWidth: 100,
                }}
                onClick={() => submitApproval("Reject")}
              >
                Reject
              </Button>
              <Button
                style={{
                  minWidth: 100,
                }}
                onClick={() => submitApproval("Approve")}
              >
                Approve
              </Button>
            </div>
          </div>
        </div>
      </Paper>
    </>
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
)(UserApprovalAddendumPage);
