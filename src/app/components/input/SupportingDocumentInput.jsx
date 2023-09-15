import React from "react"
import { Col, Row } from "react-bootstrap"

import BasicInput from "app/components/input/BasicInput"
import SelectDateInput from "app/components/input/SelectDateInput"
import SelectInputCustom from "app/components/input/SelectInputCustom"
import TextAreaInput from "app/components/input/TextAreaInput"
import UploadInput from "app/components/input/UploadInput"
import CheckboxInput from "app/components/input/CheckboxInput"

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
    // title.map((item) => {
    //     console.log(item)
    // })
    return(
        <>
            {title ? title?.map((item) => (
                <>
                    {item.name}
              
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
              
                    </>
            ))
               : 
            <div>
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
            </div>}
        </>
    )
}

export default SupportingDocumentInput