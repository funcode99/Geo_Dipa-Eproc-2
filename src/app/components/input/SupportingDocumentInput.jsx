import React, { useState } from "react"
import { Col, Row } from "react-bootstrap"

import BasicInput from "app/components/input/BasicInput"
import SelectDateInput from "app/components/input/SelectDateInput"
import SelectInputCustom from "app/components/input/SelectInputCustom"
import TextAreaInput from "app/components/input/TextAreaInput"
import UploadInput from "app/components/input/UploadInput"
import CheckboxInput from "app/components/input/CheckboxInput"
import RenderInput from "./RenderInput"

const inputs = {
    BasicInput,
    SelectDateInput,
    SelectInputCustom,
    TextAreaInput,
    UploadInput,
    CheckboxInput
  }

const SupportingDocumentInput = ({
    title
}) => {

    console.log('isi title', title)

    return(
        <>
            {title ? title?.map((item, index) => (

                <>                   

                        <p style={{fontWeight: 500}}>
                            {item.name}
                        </p>
                
                        <Row md={12}>
                            <Col md={4}>
                                <p style={{fontWeight: 500, fontSize:14}}>
                                    No Dokumen
                                </p>
                                <RenderInput 
                                    typeInput={""} 
                                    placeholder={"Masukan No Dokumen Anda"} 
                                    name={item.doc_num_field}
                                />
                            </Col>
                            <Col md={3}>
                                <p style={{fontWeight: 500, fontSize:14}}>
                                    Tanggal Dokumen
                                </p>
                                <RenderInput 
                                    typeInput={"SelectDateInput"} 
                                    name={item.date_field}
                                />
                            </Col>
                            <Col md={5}>
                                <p style={{fontWeight: 500, fontSize:14}}>
                                    Upload Dokumen
                                </p>
                                <RenderInput 
                                    typeInput={"UploadInput"} 
                                    name={item.doc_upload_field}
                                />
                            </Col>
                        </Row>
                    
                        <Row className={"mb-9 mt-3 mx-2"}>
                            Perihal
                            <TextAreaInput className={"border border-dark form-control"} placeholder={""} />
                        </Row>

             

                </>

            ))
               : 
            
            // kalo gak ada title render yang ini
            <div
            >
                    <Row>
                        <Col md={4}>
                            Nama Dokumen
                            <BasicInput placeholder={"Dokumen A"} />
                        </Col>
                    </Row>
                    <Row>
                        <Col md={4}>
                            No Dokumen
                            <BasicInput placeholder={"Masukan No Dokumen Anda"} />
                        </Col>
                        <Col md={3}>
                            Tanggal Dokumen
                            <SelectDateInput />
                        </Col>
                        <Col md={5}>
                            Upload Dokumen
                            <UploadInput />
                        </Col>
                    </Row>
                    <Row className={"mb-9 mt-3 mx-2"}>
                        Perihal
                        <TextAreaInput className={"border border-dark form-control"} placeholder={""} />
                    </Row>
            </div>

            }
        </>
    )
}

export default SupportingDocumentInput