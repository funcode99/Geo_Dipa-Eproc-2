import React, { useState, useRef } from "react"
import DialogGlobal from "app/components/modals/DialogGlobal"
import { Col, Row } from "react-bootstrap"

import RenderInput from "app/components/input/RenderInput"

// import { Button } from "@material-ui/core"

import { Formik, Field, FieldArray } from "formik";
import { Container, CardContent, Grid, Button, TextField } from "@material-ui/core";
// import { FormStepper } from "./FormStepper"; 

import { FormattedMessage } from "react-intl"
import { useSelector } from "react-redux"
import {
  Card,
  CardBody,
} from "_metronic/_partials/controls"
import { formData1, formDataCheckbox, supportingDocumentAdditional, supportingDocumentDefault } from "app/modules/AddendumContract/pages/ContractDetail/components/ParaPihak/fieldData"
import FieldBuilder from "app/components/builder/FieldBuilder"
import FormBuilder from "app/components/builder/FormBuilder"
import SupportingDocumentInput from "app/components/input/SupportingDocumentInput"
import UploadInput from "app/components/input/UploadInput";
import SelectDateInput from "app/components/input/SelectDateInput";
import TextAreaInput from "app/components/input/TextAreaInput";
import BasicInput from "app/components/input/BasicInput"



const navLists = [
  {
    id: "pertama",
    label: <FormattedMessage id={`LABEL.DM.PARTIES.1_PARTY`} />,
  },
  {
    id: "kedua",
    label: <FormattedMessage id={`LABEL.DM.PARTIES.2_PARTY`} />,
  },
]


const ParaPihak = ({

}) => {
  const [navActive, setNavActive] = React.useState(navLists[0].id)
  const openCloseModalRef = React.useRef()
  const openCloseDraftModalRef = React.useRef()
  const openCloseAddDocument = React.useRef()
  // console.log(openCloseModalRef)

  let [linksGroup, setLinksGroup] = useState({ 
    documentname: 'nama dokumen',
    documentnumber: "keluarga", 
    documentdate: null, 
    documentfileupload: 'test.jpg', 
    about: "individu" 
  })

  const toPush = useRef()

  const setPush = (e) => {
    toPush.current.click()
    // console.log('isi event', e)
    // console.log('isi current', toPush.current)
  }

  const { contract_party, vendor } = useSelector(
    (state) => state.deliveryMonitoring.dataContractById
  )

  const showModal = () => {
    openCloseModalRef.current.open()
  }

  const showDraft = () => {
    openCloseDraftModalRef.current.open()
  }

  const showAddDocument = () => {
    openCloseAddDocument.current.open()
  }

  // console.log(`dataContractById`, contract_party);

  const values = React.useMemo(
    () => ({
      
      start_price: 'Rp 7.422.000.000',
      end_price_addendum: 'Rp 0',
      additional_price: 'Rp 0',
      subtraction_price: 'Rp 0',
      after_price_addendum: 'Rp 0',
      percentage_addendum: '%',
      conclusion: 'Harga pekerjaan setelah addendum dibawah 10% dari harga pekerjaan awal',

    }),
    [contract_party, vendor]
  )

  const _handleChange = (val) => {
    console.log(val)
    // setIsi(val)
    // console.log('isi setelah val', isi)
    // setFieldValue(name, val, true)
    // if (typeof onChange === "function") onChange(val)

  }

  return (
    <>
    
    <Card>

      <CardBody>


          <DialogGlobal
            ref={openCloseModalRef}
            isCancel={false}
            isSubmit={false}
            yesButton={true}
            noButton={true}
          >
            Apakah anda sudah yakin untuk disubmit?
          </DialogGlobal>

          <DialogGlobal
            ref={openCloseDraftModalRef}
            isCancel={false}
            isSubmit={false}
            yesButton={true}
            noButton={true}
            maxWidth={'xs'}
          >
            Apakah anda sudah yakin disimpan ke draft?
            {/* <h1 className="mb-2" style={{fontSize: '16px'}}>Tambah Dokumen Pendukung Lainnya</h1> */}
            {/* <SupportingDocumentInput title={[{name:""}]} /> */}
          </DialogGlobal>

          {/* Modal buat bikin komponen dokumen pendukung baru */}
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
                              // onChange={(e) => console.log('isi event', e.path)}
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

        <FormBuilder 
          initial={values} 
          withSubmit={true} 
          onSubmit={showModal}
          onDraft={showDraft} 
          
          btnChildren={
            <Button
              variant="contained"
              color="secondary"
              size="medium"
              onClick={showDraft}
            >
              Save Draft
            </Button>
          }
        >

          {({}) => {
            return (
              <React.Fragment>
                {navActive === "pertama" && (
                  <>
                    {/* bagian ini untuk label */}
                    {/* readOnly */}
                    <FieldBuilder formData={formDataCheckbox} />
                    <FieldBuilder formData={formData1} />
                    <SupportingDocumentInput title={supportingDocumentDefault} />
                    <SupportingDocumentInput additionalDocument={supportingDocumentAdditional} />
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

                                <button className="d-none" ref={toPush} onClick={() => push(linksGroup)}>
                                    Klik Disini
                                </button>

                              </Grid>

                            </Grid>

                          )}

                        </FieldArray>
                        
                      </>
          
                      )}
                    </Formik>
                    
                    <Button
                      variant="contained"
                      color="secondary"
                      size="medium"
                      onClick={showAddDocument}
                    >
                      Tambah Dokumen
                    </Button>
                    
                    <div className="mt-5">
                      <p className="mb-0">Permintaan Penerbitan Draft Addendum Kepada:</p>
                      <select value={"Supply Chain Management (SCM) Division"}>
                        <option>
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

                    {/* <RenderInput typeInput={'SelectInputCustom'} /> */}
                  </>
                )}
              </React.Fragment>
            )
          }}
        </FormBuilder>

        <Container sx={{ bgcolor: "#87c1ff4d", paddingY: 3, marginTop: 5 }}>
          <Card sx={{ marginTop: 2 }}>
            <CardContent sx={{ paddingY: 10, paddingX: 5 }}>
            </CardContent>
          </Card>
        </Container>
        

      </CardBody>

    </Card>
    </>
  );
}

export default ParaPihak
