import React, { useState, useRef } from "react";
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
import SubBreadcrumbs from "app/components/SubBreadcrumbs"
import { actionTypes } from "app/modules/AddendumContract/_redux/deliveryMonitoringAction";
import { toAbsoluteUrl } from "_metronic/_helpers/AssetsHelpers";
import SVG from "react-inlinesvg";

import DialogGlobal from "app/components/modals/DialogGlobal"
import { Col, Row } from "react-bootstrap"

import { Formik, Field, FieldArray } from "formik";
import { Grid,  } from "@material-ui/core";
// import { FormStepper } from "./FormStepper";

import {
  Card,
  CardBody,
} from "_metronic/_partials/controls"

import { 
  supportingDocumentAdditional, 
  supportingDocumentDefault 
} from "app/modules/AddendumContract/pages/ContractDetail/components/ParaPihak/fieldData"
import FieldBuilder from "app/components/builder/FieldBuilder"
import FormBuilder from "app/components/builder/FormBuilder"
import SupportingDocumentInput from "app/components/input/SupportingDocumentInput"

import UploadInput from "app/components/input/UploadInput"
import SelectDateInput from "app/components/input/SelectDateInput"
import TextAreaInput from "app/components/input/TextAreaInput"
import BasicInput from "app/components/input/BasicInput"

import Steppers from "app/components/steppersCustom/Steppers"
import {
  DUMMY_STEPPER,
  DUMMY_STEPPER_CONTRACT,
  STATE_STEPPER,
} from "app/modules/AddendumContract/pages/Termin/TerminPageNew/STATIC_DATA"

import FormPermohonan from "./components/ParaPihak/FormPermohonan"
import FormParameter from "app/modules/AddendumContract/pages/ContractDetail/components/ParaPihak/FormParameter"

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(1),
    overflowX: "auto",
  },
  table: {
    minWidth: 650,
  },
}))

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

// ternyata dataContractById ini props
export const ContractAddendumDetail = ({ dataContractById, authStatus }) => {


const showAddDocument = () => {
  openCloseAddDocument.current.open()
}

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
  const [TabLists, setTabLists] = React.useState([
  
    {
      id: "parties",
      // label: <FormattedMessage id="CONTRACT_DETAIL.TAB.DETAIL" />,
      label: "Para Pihak",
      // icon: <PlayCircleOutlineIcon className="mb-0 mr-2" />,
      addendum: false
    },
  
    {
      id: "job_price",
      // label: <FormattedMessage id="CONTRACT_DETAIL.TAB.DETAIL" />,
      label: "Harga Pekerjaan",
      // icon: <FindInPage className="mb-0 mr-2" />,
      addendum: false
    },
  
    {
      id: "time_period",
      // label: <FormattedMessage id="CONTRACT_DETAIL.TAB.PARTIES" />,
      label: "Jangka Waktu",
      // icon: <PeopleAlt className="mb-0 mr-2" />,
      addendum: false
    },
  
    {
      id: "payment_method",
      // label: <FormattedMessage id="CONTRACT_DETAIL.TAB.DOK_CONT" />,
      label: "Metode Pembayaran",
      // icon: <Assignment className="mb-0 mr-2" />,
      addendum: false
    },
  
    {
      id: "fine",
      // label: <FormattedMessage id="CONTRACT_DETAIL.TAB.PRICE" />,
      label: "Denda",
      // icon: <MonetizationOn className="mb-0 mr-2" />,
      addendum: false
    },
  
    {
      id: "guarantee",
      // label: <FormattedMessage id="CONTRACT_DETAIL.TAB.PERIOD" />,
      label: "Jaminan",
      // icon: <QueryBuilderSharp className="mb-0 mr-2" />,
      addendum: false
    },
  
    {
      id: "account_number",
      // label: <FormattedMessage id="CONTRACT_DETAIL.TAB.GUARANTEE" />,
      label: "Nomor Rekening",
      // icon: <FeaturedPlayList className="mb-0 mr-2" />,
      addendum: false
    },
  
  ])
  const [checkedInitialValues, setCheckedInitialValues] = React.useState([])

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

  // sengaja dikasih event biar yang diambil value nya
  function handleChangeTab(event, newTabActive) {
    // isi nya urutan angka array sesuai dengan yang di klik
    console.log('isi newTabActive', newTabActive)
    setTabActive(newTabActive)
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

  const assignTabLists = (values) => {

    console.log('isi values', values)
    console.log('isi tablists', TabLists)

    TabLists.map((Tabitem) => {
      Tabitem.addendum = false
    })

    TabLists.map((Tabitem) => {
      values.map((item) => {
          if(item === Tabitem.id) {
            Tabitem.addendum = true
          }
        })
      })

    setCheckedInitialValues(values)

  }

  return (
    <React.Fragment>

      <Toast />

      {loading ? (
        <div className="d-flex justify-content-center m-5 border-danger">
          <CircularProgress />
        </div>
      ) : null}


      {/* open close add document */}
      <DialogGlobal
                  ref={openCloseAddDocument}
                  isCancel={false}
                  isSubmit={true}
                  onYes={setPush}
            >
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
            label: "List of Contract & SPK",
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

        <div
          style={{
            backgroundColor: 'white',
            padding: 28,
            marginTop: 24,
            marginBottom: 24,
            borderRadius: 5
          }}
        >

          <h1 
            style={{ 
                fontSize: 12,
                fontWeight: 400
            }}
          >
            Silahkan download file final draft dibawah ini:
          </h1>

          <select
            style={{
              borderRadius: 4,
              padding: '10px 12px',
              width: 310,
              backgroundColor: '#e8f4fb'
            }}
          >
            <option>
              Final Draft Kontrak
            </option>
            <option>
              Final Draft Addendum
            </option>
          </select>

          <div 
            style={{ 
              minHeight: 100, 
              marginTop: 10,
              marginBottom: 10,
              fontSize: 12,
              fontWeight: 400,
              color: '#3699ff'
            }}
          >
              <div
                style={{
                  display: 'flex',
                  gap: 6
                }}
              >
                <SVG src={toAbsoluteUrl("/media/svg/icons/All/file-final-draft.svg")} />
                <p>Body Kontrak Perjanjian.doc</p>
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: 6
                }}
              >
                <SVG src={toAbsoluteUrl("/media/svg/icons/All/file-final-draft.svg")} />
                <p>Lampiran 1.doc</p>
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: 6
                }}
              >
                <SVG src={toAbsoluteUrl("/media/svg/icons/All/file-final-draft.svg")} />
                <p>Lampiran 2.doc</p>
              </div>


          </div>

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
        <FormPermohonan 
          checkedLength={checkLength}
          assignTabLists={assignTabLists}
          checkedValues={checkedInitialValues}
        />
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
              {/* <Button
                 style={{
                  minWidth: 100
                }}
              >
              </Button> */}
              <button
                className="btn btn-primary"
                style={{
                  minWidth: 100
                }}
              >
                Update  
              </button>
              <Button
                style={{
                  minWidth: 100
                }}
                onClick={
                  () => tabActive < TabLists.length-1 ? 
                  setTabActive(tabActive+1) : 
                  setTabActive(tabActive)}
              >
                Next
              </Button>
            </div>

      </Paper>}

      {sequence === 2 &&
        <Paper className={classes.root}>
          <div
            style={{
              padding: '2rem 2.25rem'
            }}
          >
            <Formik
              initialValues={{
                isi : 'kosong'
              }}
            >
              {(formikProps) => {
                // console.log('isi formikProps', formikProps)
                // formikProps.values.isi
                // formikProps.initialValues.isi
                return (
                  <> 
                    <h1
                      style={{
                        fontSize: 16,
                        fontWeight: 600,
                        color: '#2e1f22',
                        marginBottom: 14
                      }}
                    >
                      Dokumen Pendukung  
                    </h1>        
                    <SupportingDocumentInput title={supportingDocumentDefault} />
                    <SupportingDocumentInput title={supportingDocumentAdditional} />
                    <Formik
                        initialValues={{
                          links: [linksGroup],
                        }}
                        onSubmit={async (values, actions) => {
                          alert(JSON.stringify(values, null, 2));
                        }}
                      >
                        {({ values }) => (
                      
                        <>

                          <FieldArray name="links">
                            
                            {({ push, remove }) => (

                              <Grid container spacing={2} sx={{ marginTop: 2, paddingX: 2 }}>
                    
                                {values.links.map((_, index) => (
                                  <>
                                    <Grid item md={12}>
                                      <div>
                                        <p 
                                          style={{fontWeight: 500, fontSize:14, marginBottom: 0}}
                                        >{_.documentname}</p>
                                      </div>
                                    </Grid>

                                    <Grid item md={4}>
                                      <p style={{fontWeight: 500, fontSize:14, marginBottom: 0}}>
                                        No Dokumen
                                      </p>
                                      <Field 
                                        fullWidth 
                                        name={`links.${index}.documentnumber`} 
                                        component={RenderInput} 
                                        placeholder={"Masukan No Dokumen Anda"}
                                        value={`${_.documentnumber}`}
                                        />
                                    </Grid>
                                    <Grid item md={3}>
                                    <p style={{fontWeight: 500, fontSize:14, marginBottom: 0}}>
                                      Tanggal Dokumen
                                    </p>
                                      <Field 
                                      fullWidth 
                                      name={`links.${index}.documentdate`} 
                                      component={SelectDateInput}
                                      value={`${_.documentdate}`}
                                      />
                                    </Grid>
                                    <Grid item md={3}>
                                      <p style={{fontWeight: 500, fontSize:14, marginBottom: 0}}>
                                      Upload Dokumen
                                      </p>
                                      <Field 
                                        fullWidth 
                                        name={`links.${index}.documentfileupload`} 
                                        component={UploadInput} 
                                        // gaperlu pakai backtick, malah dianggap string bukan objek
                                        value={{ path: _.documentfileupload }}
                                      />
                                    </Grid>
                                    {index > 0 && (
                                      <Grid item md={2}>
                                        {/* color="error" */}
                                        <p style={{fontWeight: 500, fontSize:14, marginBottom: 0}}>
                                      
                                        </p>
                                        <Button variant="outlined"  onClick={() => remove(index)}>
                                          Delete
                                        </Button>
                                      </Grid>
                                    )}
                                    <Grid item md={12}>
                                      <Field 
                                        name={`links.${index}.about`} 
                                        component={TextAreaInput}
                                        value={`${_.about}`}
                                      />
                                    </Grid>
                                  </>
                                ))}{" "}

                                <Grid item xs={12}>
                                  
                                  {/* <Button
                                    variant="outlined"
                                    
                                    onClick={() => push()}
                                  >
                                    Add Link
                                  </Button> */}

                                  {/* <Button
                                    variant="contained"
                                    color="primary"
                                    size="medium"
                                    onClick={showAddDocument}
                                  >
                                    Tambah Dokumen
                                  </Button> */}

                                  <button
                                    className="btn btn-primary"
                                    onClick={showAddDocument}
                                  >
                                    Tambah Dokumen
                                  </button>

                                  {/* <button className="d-none" ref={toPush} onClick={() => push(linksGroup)}>
                                      Klik Disini
                                  </button> */}

                                </Grid>

                              </Grid>

                            )}

                          </FieldArray>
                          
                        </>
            
                        )}
                    </Formik>

                    <div className="mt-5">
                        <p 
                          className="mb-0"
                          style={{
                            color: '#2e1f22',
                            fontSize: 14,
                            fontWeight: 500
                          }}
                        >Permintaan Penerbitan Draft Addendum Kepada:</p>
                        <select 
                          style={{
                            padding: '10px 12px',
                            fontSize: 12,
                            backgroundColor: '#e8f4fb',
                            borderRadius: 4
                          }}
                          value={"Supply Chain Management (SCM) Division"}
                        >
                          <option
                            // style={{
                            //   padding: '10px 12px',
                            //   fontSize: 12,
                            //   backgroundColor: '#e8f4fb',
                            //   borderRadius: 4
                            // }}
                          >
                            Supply Chain Management (SCM) Division
                          </option>
                          <option>
                            Corporate Legal & Compliance Division
                          </option>
                          <option>
                            Pengguna (Direksi Pekerjaan)
                          </option>
                        </select>
                    </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 28,
                padding: '2rem 2.25rem'
              }}
            >
              <Button
                className="text-primary btn btn-white border border-primary"
                 style={{
                  minWidth: 100
                }}
              >
                Save Draft
              </Button>
              <Button
                style={{
                  minWidth: 100
                }}
                // onClick={() => TabLists.length-1 ? setTabActive(tabActive+1) : setTabActive(tabActive) }
              >
                Submit
              </Button>
            </div>

                  </>
                )
              }}
            </Formik>
          </div>
        </Paper>
      }

    </React.Fragment>
  )
}

const mapState = ({ auth, addendumContract }) => ({
  authStatus: auth.user.data.status,
  dataContractById: addendumContract.dataContractById,
})

export default compose(withRouter, connect(mapState))(ContractAddendumDetail)
