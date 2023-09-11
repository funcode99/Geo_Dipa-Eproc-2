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
    title.map((item) => {
        console.log(item)
    })
    return(
        <>
            {title?.map((item) => (
                <>
                    {item.name}
                <Row>
                    <Col md={4}>
                        <BasicInput placeholder={"Masukan No Dokumen Anda"} />
                    </Col>
                    <Col md={3}>
                        <SelectDateInput />
                    </Col>
                    <Col md={5}>
                        <UploadInput />
                    </Col>
                </Row>
                <Row className={"mb-9 mt-3"}>
                    <TextAreaInput className={"border border-dark form-control"} placeholder={""} />
                </Row>
                    </>
            ))}
        </>
    )
}

export default SupportingDocumentInput