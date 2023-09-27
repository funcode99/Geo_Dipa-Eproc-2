import React from "react";
import { Modal, Button } from "react-bootstrap"
import { Paper, makeStyles, CircularProgress } from "@material-ui/core";

import { useLocation, useParams, withRouter } from "react-router-dom";
import { compose } from "redux";
import { useSelector, useDispatch, shallowEqual, connect } from "react-redux";

import RenderInput from "app/components/input/RenderInput"
import Tabs from "app/components/tabs"
import * as addendumContract from "app/modules/AddendumContract/service/DeliveryMonitoringCrud";
import useToast from "../../../../components/toast"
import Subheader from "app/components/subheader"
import SubBreadcrumbs from "app/components/SubBreadcrumbs";
import { actionTypes } from "app/modules/AddendumContract/_redux/deliveryMonitoringAction";

import { useState, useRef } from "react"
import DialogGlobal from "app/components/modals/DialogGlobal"
import { Col, Row } from "react-bootstrap"

import { Formik, Field, FieldArray } from "formik";
import { Grid,  } from "@material-ui/core";
// import { FormStepper } from "./FormStepper";

import {
  Card,
  CardBody,
} from "_metronic/_partials/controls"

import { supportingDocumentAdditional, supportingDocumentDefault } from "app/modules/AddendumContract/pages/ContractDetail/components/ParaPihak/fieldData"
import FieldBuilder from "app/components/builder/FieldBuilder"
import FormBuilder from "app/components/builder/FormBuilder"
import SupportingDocumentInput from "app/components/input/SupportingDocumentInput"

import UploadInput from "app/components/input/UploadInput";
import SelectDateInput from "app/components/input/SelectDateInput";
import TextAreaInput from "app/components/input/TextAreaInput";
import BasicInput from "app/components/input/BasicInput"

import Steppers from "app/components/steppersCustom/Steppers"
import {
  DUMMY_STEPPER,
  DUMMY_STEPPER_CONTRACT,
  STATE_STEPPER,
} from "app/modules/AddendumContract/pages/Termin/TerminPageNew/STATIC_DATA"

import FormPermohonan from "./components/ParaPihak/FormPermohonan"
import FormParameter from "./components/ParaPihak/FormParameter"

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

const TabLists = [
  
  {
    id: "kick-off",
    // label: <FormattedMessage id="CONTRACT_DETAIL.TAB.DETAIL" />,
    label: "Para Pihak",
    // icon: <PlayCircleOutlineIcon className="mb-0 mr-2" />,
    addendum: true
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
    addendum: true
  },

  {
    id: "jaminan",
    // label: <FormattedMessage id="CONTRACT_DETAIL.TAB.GUARANTEE" />,
    label: "Nomor Rekening",
    // icon: <FeaturedPlayList className="mb-0 mr-2" />,
    addendum: true
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

]

// ternyata dataContractById ini props
export const ContractAddendumDetail = ({ dataContractById, authStatus }) => {

  // gak ada isi nya
    // console.log('isi data contract by id di delivery monitoring', dataContractById)
  const classes = useStyles()
  const location = useLocation()
  const { contract_id, tab: forceTabActive } = useParams()
  const [Toast, setToast] = useToast()
  const dispatch = useDispatch()
  const [tabActive, setTabActive] = React.useState(0)
  const [sequence, setSequence] = React.useState(0)
  const [loading, setLoading] = React.useState(false)
  const [firstTime, setfirstTime] = React.useState(0)
  const [tempProps, setTempProps] = React.useState({
    task_id: "",
    tab: 0,
  })
  const [old, setOld] = React.useState({
    needRefresh: false,
    path: "",
  })


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

  let [linksGroup, setLinksGroup] = useState({ 
    documentname: 'nama dokumen',
    documentnumber: "keluarga", 
    documentdate: null, 
    documentfileupload: 'test.jpg', 
    about: "individu" 
  })

  const toPush = useRef()
  const openCloseAddDocument = React.useRef()

  const setPush = (e) => {
    toPush.current.click()
    // console.log('isi event', e)
    // console.log('isi current', toPush.current)
  }

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

      // dispatch({
      //   type: actionTypes.SetContractById,
      //   payload: [],
      // });

      // loading buat throttling
      setLoading(true);

      // masukin response api nya ke objek yang nama properti nya data
      const {
        data: { data },
      } = await addendumContract.getContractById(contract_id);

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
    getContractById(contract_id)
    setInitialSubmitItems();
    // eslint-disable-next-line
  }, []);

  function handleChangeTab(newTabActive) {
    // isi nya urutan angka array sesuai dengan yang di klik
    console.log('isi newTabActive', newTabActive)
    setTabActive(newTabActive);
  }

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

  // console.log("dataContractById", dataContractById);

  const checkLength = (lengthValue) => {
    // console.log('checked length is', lengthValue)
    if(lengthValue > 0) {
      setSequence(1)
    }
  }

  return (
    <React.Fragment>
      <Toast />

      {loading ? (
        <div className="d-flex justify-content-center m-5 border-danger">
          <CircularProgress />
        </div>
      ) : null}

            <DialogGlobal
                  ref={openCloseAddDocument}
                  isCancel={false}
                  isSubmit={true}
                  onYes={setPush}
            >
                {/* <SupportingDocumentInput /> */}
                <div>
                      <Row>
                          <Col md={4}>
                              Nama Dokumen
                              <BasicInput 
                              placeholder={"Dokumen A"} 
                              value={linksGroup.documentname} 
                              onChange={(e) => setLinksGroup({...linksGroup, documentname: e})} 
                              />
                          </Col>
                      </Row>
                      <Row>
                          <Col md={4}>
                              No Dokumen
                              <BasicInput 
                                placeholder={"Masukan No Dokumen Anda"}
                                value={linksGroup.documentnumber} 
                                onChange={(e) => setLinksGroup({...linksGroup, documentnumber: e})} 
                                />
                          </Col>
                          <Col md={3}>
                              Tanggal Dokumen
                              <SelectDateInput
                                value={linksGroup.documentdate} 
                                onChange={(e) => setLinksGroup({...linksGroup, documentdate: e})} 
                              />
                          </Col>
                          <Col md={5}>
                              Upload Dokumen
                              <UploadInput
                                value={linksGroup.documentfileupload} 
                                onChange={(e) => setLinksGroup({...linksGroup, 
                                  documentfileupload: { path: e.path } })} 
                              />
                          </Col>
                      </Row>
                      <Row className={"mb-9 mt-3 mx-2"}>
                          Perihal
                          <TextAreaInput 
                            className={"border border-dark form-control"} 
                            placeholder={""}
                            value={linksGroup.about} 
                            onChange={(e) => setLinksGroup({...linksGroup, about: e})}  
                          />
                      </Row>
              </div>
            </DialogGlobal>

      <Subheader 
        text={
          dataContractById
          ? `Formulir Permohonan Addendum Kontrak No : ${dataContractById?.contract_no}` : 
          null
        }
      />

      <SubBreadcrumbs
        items={[
          {
            label: `Addendum Contract`
          },

          {
            label: "List of Contract & PO",
            to: `/${authStatus}/addendum-contract/list-contract-po`,
          },
          {
            label: `${
              dataContractById ? dataContractById?.contract_name : "x"
            }`,
            to: "/",
          },
        ]}
      />

      <Steppers
        steps={
          DUMMY_STEPPER_CONTRACT
        }
      />

        <h1 style={{ fontSize: 18 }}>Silahkan download file final draft dibawah ini:</h1>

        <select>
          <option>
            Final Draft Kontrak
          </option>
          <option>
            Final Draft Addendum
          </option>
        </select>

        <div style={{ minHeight: 100, marginBottom: 10 }}>
            <p>Body Kontrak Perjanjian.doc</p>
            <p>Lampiran 1.doc</p>
            <p>Lampiran 2.doc</p>
        </div>

        <div 
          style={{
            height: 74, 
            fontSize: 14, 
            display: 'grid', 
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))" 
          }}
        >
          
          <div
            className="d-flex align-items-center justify-content-center"
            style={{backgroundColor: sequence === 0 ? '#3699ff' : 'white', flexGrow: 1, borderTopLeftRadius: 14, cursor: 'pointer'}}
            onClick={() => setSequence(0)}
          >
            <h1 style={{fontSize: 14}}>Form Permohonan</h1>
          </div>
          
          <div
            className="d-flex align-items-center justify-content-center"
             style={{backgroundColor: sequence === 1 ? '#3699ff' : 'white', flexGrow: 1, cursor: 'pointer'}}
            onClick={() => setSequence(1)}
          >
            <h1 style={{fontSize: 14}}>Form Parameter</h1>
          </div>

          <div
            className="d-flex align-items-center justify-content-center"
             style={{
              backgroundColor: sequence === 2 ? '#3699ff' : 'white', 
              flexGrow: 1,  
              borderTopRightRadius: 14, cursor: 'pointer' 
            }}
            onClick={() => setSequence(2)}
          >
            <h1 style={{
              fontSize: 14
            }}>
              Upload Dokumen Pendukung
            </h1>
            
          </div>

        </div>

      {sequence === 0 && <Paper className={classes.root}>
        <FormPermohonan checkedLength={checkLength}  />
      </Paper>}

      {sequence === 1 && <Paper className={classes.root}>

          <Tabs
            tabActive={tabActive}
            handleChange={handleChangeTab}
            tabLists={TabLists}
            variant="scrollable"
          />

          <FormParameter currentActiveTab={tabActive} />

            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 28,
                padding: '2rem 2.25rem'
              }}
            >
              <Button
                 style={{
                  minWidth: 100
                }}
              >
                Update
              </Button>
              <Button
                style={{
                  minWidth: 100
                }}
                onClick={() => setTabActive(tabActive < TabLists.length-1 ? tabActive+1 : tabActive)}
              >
                Next
              </Button>
            </div>

      </Paper>}

      {sequence === 2 && 
      <Paper className={classes.root}>
        
      </Paper>}

    </React.Fragment>
  );
};

const mapState = ({ auth, addendumContract }) => ({
  authStatus: auth.user.data.status,
  dataContractById: addendumContract.dataContractById,
});

export default compose(withRouter, connect(mapState))(ContractAddendumDetail);
