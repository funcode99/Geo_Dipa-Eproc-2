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

import DialogGlobal from "app/components/modals/DialogGlobal";
import useToast from "app/components/toast/index";
import Subheader from "app/components/subheader";
import SubBreadcrumbs from "app/components/SubBreadcrumbs";

import SVG from "react-inlinesvg";
// import FormParameter from "app/modules/AddendumContract/pages/AddendumRequest/FormAddendum/FormParameter";
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

const UserApprovalAddendumPage = ({
  authStatus,
  fetch_api_sg,
  dataContractById,
}) => {
  // const openCloseAddDocument = React.useRef();
  // const showAddDocument = () => {
  //   openCloseAddDocument.current.open();
  // };

  const keys = {
    fetch: "get-data-contracts-approval",
  };

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
        });
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
        setTabDisableLists(res?.data);
        setStepper(res?.data?.steppers);
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
      <h1>Form Persetujuan Addendum</h1>
      {/* <div
        style={{
          display: "flex",
          rowGap: 93,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
            fontSize: 14,
          }}
        >
          <h3>A. No Kontrak</h3>
          <h3>B. Jenis Kontrak</h3>
          <h3>C. Judul Pengadaan</h3>
          <h3>D. Penyedia</h3>
          <h3>E. Tanggal Permohonan Addendum</h3>
        </div>
        <div>
          <h3>: </h3>
          <h3>: </h3>
          <h3>: </h3>
          <h3>: </h3>
          <h3>: </h3>
        </div>
      </div> */}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          rowGap: 14,
        }}
      >
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
            A. No Kontrak
          </div>
          <div>{tabDisableLists?.contract?.contract_no}</div>
          <div></div>
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
            B. Jenis Kontrak
          </div>
          <div>{tabDisableLists?.contract?.contract_type?.name}</div>
          <div></div>
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
            C. Judul Pengadaan
          </div>
          <div>{tabDisableLists?.contract?.contract_name}</div>
          <div></div>
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
            D. Penyedia
          </div>
          <div>{tabDisableLists?.contract?.vendor?.party?.full_name}</div>
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
            E. Tanggal Permohonan Addendum
          </div>
          <div>{tabDisableLists?.add_request_date}</div>
        </div>
      </div>

      <div
        style={{
          marginTop: 14,
        }}
      >
        <h3>F. Addendum Harga Pekerjaan</h3>
        <div
          style={{
            display: "flex",
          }}
        >
          <table>
            <tr>
              <th>Sebelum Addendum</th>
              <th>Setelah Addendum</th>
              <th>Keterangan</th>
            </tr>
            <tr>
              <td>Rp 7.422.000.000,00</td>
              <td>Rp 9.500.000.000,00</td>
              <td></td>
            </tr>
          </table>
        </div>
      </div>
      <div
        style={{
          marginTop: 14,
        }}
      >
        <h3>G. Dokumen Pendukung</h3>
        <table>
          <tr>
            <th>No</th>
            <th>Nama Dokumen</th>
            <th>No Dokumen</th>
            <th>Tanggal Dokumen</th>
            <th>Dokumen</th>
          </tr>

          {tabDisableLists?.add_support_document_data &&
            tabDisableLists?.add_support_document_data.map((item, index) => {
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
            })}
        </table>
      </div>
      <div>
        <h3>H. Detail Addendum</h3>
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
