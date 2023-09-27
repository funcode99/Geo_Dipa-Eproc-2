import React, { useState, useEffect } from 'react'
import { Col, Row } from "react-bootstrap"

// import FieldBuilder from "app/components/builder/FieldBuilder"
// import FormBuilder from "app/components/builder/FormBuilder"
// import { formData1, formDataCheckbox } from "app/modules/AddendumContract/pages/ContractDetail/components/ParaPihak/fieldData"

import { FormControlLabel, Checkbox} from "@material-ui/core";

import { Formik, Field, Form } from 'formik'

import { useSelector } from "react-redux"
import {
    Card,
    CardBody,
  } from "_metronic/_partials/controls"


const FormPermohonan = (
    props
) => {

    const handleChange = () => {

    }

    return (
        <>  
            <Card>
                <CardBody>
                    
                    <Card>
                        <form>
                            <div 
                                    style={{display: 'flex', columnGap: 40, flexWrap: 'wrap'}}
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
                                                value={'015.PJ/PST.100-GDE/I/2023'}
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
                                                value={'8000007360'}
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
                                                    onChange={(e) => {

                                                    }}
                                                value={'Pengadaan Material Gasket Spiral Wound & Rupture Disk'}
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
                                                    onChange={(e) => {

                                                    }}
                                                value={'Pengadaan Material Gasket Spiral Wound & Rupture Disk'}
                                            />
                                        </div>
                                    </div>
                            </div>

                            <div 
                                    style={{display: 'flex', columnGap: 40, flexWrap: 'wrap'}}
                                >
                                    <div className="col-md-7">
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
                                                    onChange={(e) => {

                                                    }}
                                                value={'Isi format perjanjian'}
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
                                                    onChange={(e) => {

                                                    }}
                                                value={'Plant Dieng'}
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
                                                    onChange={(e) => {

                                                    }}
                                                value={'Plant Dieng'}
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
                                                    onChange={(e) => {

                                                    }}
                                                value={'Plant Dieng'}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
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
                                                value={'Perjanjian'}
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
                                                    onChange={(e) => {

                                                    }}
                                                value={'961242390'}
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
                                                    onChange={(e) => {

                                                    }}
                                                value={'961242390'}
                                            />
                                        </div>
                                    </div>
                            </div>
                        </form>
                    </Card>

                    <Formik
                        initialValues={{
                            checked: [],
                            others: [],
                            additional_price: '',
                            substraction_price: null
                        }}
                        onSubmit={
                            (values) => {
                                // alert('telah disubmit')
                                props.checkedLength(values.checked.length)
                            }
                        }
                    >
                        {({ values }) => (

                            <>
                                <Form>
                                    
                                    <div
                                        style={{
                                            display: 'grid',
                                            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                                            columnGap: 8
                                        }}
                                    >
                                        <label
                                            style={{
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                gap: 8
                                       
                                            }}
                                        >
                                            <Field 
                                                type="checkbox" 
                                                name="checked" 
                                                value="Data Para Pihak"
                                                style={{
                                                    height: 20,
                                                    width: 20
                                                }}
                                            />
                                            Data Para Pihak
                                        </label>
                                        <label
                                            style={{
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                gap: 8
                                            }}
                                        >
                                            <Field 
                                                type="checkbox" 
                                                name="checked" 
                                                value="Metode Pembayaran"
                                                style={{
                                                    height: 20,
                                                    width: 20
                                                }}
                                            />
                                            Metode Pembayaran
                                        </label>
                                        <label
                                                 style={{
                                                    display: 'flex',
                                                    flexWrap: 'wrap',
                                                    gap: 8
                                                }}
                                        >
                                            <Field 
                                                type="checkbox" 
                                                name="checked" 
                                                value="Denda" 
                                                style={{
                                                    height: 20,
                                                    width: 20
                                                }}
                                            />
                                            Denda
                                        </label>
                                        <label
                                                style={{
                                                    display: 'flex',
                                                    flexWrap: 'wrap',
                                                    gap: 8
                                                }}
                                        >
                                            <Field 
                                                type="checkbox" 
                                                name="checked" 
                                                value="Nomor Rekening" 
                                                style={{
                                                    height: 20,
                                                    width: 20
                                                }}
                                            />
                                            Nomor Rekening
                                        </label>
                                    </div>   
                                    <div
                                        style={{
                                            display: 'grid',
                                            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                                            columnGap: 8
                                        }}
                                    >
                                        <label
                                             style={{
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                gap: 8
                                            }}
                                        >
                                            <Field 
                                                type="checkbox" 
                                                name="checked" 
                                                value="Harga Pekerjaan"
                                                style={{
                                                    height: 20,
                                                    width: 20
                                                }}
                                            />
                                            Harga Pekerjaan
                                        </label>
                                        <label
                                             style={{
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                gap: 8
                                            }}
                                        >
                                            <Field 
                                                type="checkbox" 
                                                name="checked" 
                                                value="Jangka Waktu" 
                                                style={{
                                                    height: 20,
                                                    width: 20
                                                }}
                                            />
                                            Jangka Waktu
                                        </label>
                                        <label
                                             style={{
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                gap: 8
                                       
                                            }}
                                        >
                                            <Field 
                                                type="checkbox" 
                                                name="checked" 
                                                value="Jaminan" 
                                                style={{
                                                    height: 20,
                                                    width: 20
                                                }}
                                            />
                                            Jaminan
                                        </label>
                                    </div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            columnGap: 8
                                        }}
                                    >
                                        <label
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    flexWrap: 'wrap',
                                                    gap: 8,
                                                    margin: 0
                                                }}
                                        >
                                            <Field 
                                                type="checkbox" 
                                                name="others" 
                                                value="Lainnya"
                                                style={{
                                                    height: 20,
                                                    width: 20
                                                }}
                                                />
                                            Lainnya
                                        </label>
                                        <input
                                            style={{
                                                minWidth: '300px',
                                                padding: 8,
                                                borderRadius: 4
                                            }}
                                            type='text'
                                            placeholder='Masukkan perihal addendum lainnya'
                                            disabled={values.others.length === 0 ? true : false}
                                        />
                                    </div>
                    
                                <Row>
                                    <Col md={12}>
                                        <Row>
                                            <Col md={12}>
                                                <div className='form-group row'>
                                                    <label className='col-sm-4 col-form-label'>
                                                        Harga Pekerjaan Awal
                                                    </label>
                                                    <div className='col-sm-8'>
                                                        <input className='form-control' type='text' />
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={12}>
                                        <Row>
                                            <Col md={12}>
                                                <div className='form-group row'>
                                                    <label className='col-sm-4 col-form-label'>
                                                        Harga Pekerjaan Addendum Terakhir
                                                    </label>
                                                    <div className='col-sm-8'>
                                                        <input className='form-control' type='text' />
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={12}>
                                            <div className='form-group row'>
                                                <label className='col-sm-4 col-form-label'>
                                                    Penambahan Harga Pekerjaan
                                                </label>
                                                <div className='col-sm-8'>
                                                    {/* <input 
                                                        className='form-control' 
                                                        type='text'
                                                        name='additional_price'
                                                        onChange={handleChange}
                                                        value={values.additional_price}
                                                    /> */}
                                                       <Field 
                                                            className='form-control'
                                                            type="text" 
                                                            name="additional_price" 
                                                            value={values.additional_price}
                                                        />
                                                </div>
                                            </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={12}>
                                            <div
                                            className={`form-group row ${values.additional_price !== '' ? '' : 'd-none'}`}>
                                                <label className='col-sm-4 col-form-label'>
                                                    
                                                </label>
                                                <div className='col-sm-8' 
                                                    style={{ 
                                                        display: 'flex',
                                                        placeItems: 'center',
                                                        gap: 12
                                                    }}>
                                                    <input
                                                        type='checkbox' 
                                                        style={{
                                                            height: 20,
                                                            width: 20
                                                        }}
                                                        />
                                                    <label
                                                        style={{
                                                            margin: 0
                                                        }}
                                                    >
                                                        Ketersediaan Anggaran* 
                                                    </label>
                                                    <span 
                                                        style={{color: '#dc0526'}}
                                                    >
                                                        (jika penambahan harga pekerjaan diisi)
                                                    </span>
                                                </div>
                                            </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={12}>
                                            <div className='form-group row'>
                                                <label className='col-sm-4 col-form-label'>
                                                    Pengurangan Harga Pekerjaan
                                                </label>
                                                <div className='col-sm-8'>
                                                    <input className='form-control' type='text' />
                                                </div>
                                            </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={12}>
                                            <div className='form-group row'>
                                                <label className='col-sm-4 col-form-label'>
                                                Harga Pekerjaan Setelah Addendum
                                                </label>
                                                <div className='col-sm-8'>
                                                    <input className='form-control' type='text' />
                                                </div>
                                            </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={12}>
                                            <div className='form-group row'>
                                                <label className='col-sm-4 col-form-label'>
                                                Persentase Addendum
                                                </label>
                                                <div className='col-sm-8'>
                                                    <input className='form-control' type='text' />
                                                </div>
                                            </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={12}>
                                            <div className='form-group row'>
                                                <label className='col-sm-4 col-form-label'>
                                                Kesimpulan
                                                </label>
                                                <div className='col-sm-8'>
                                                    <input className='form-control' type='text' />
                                                </div>
                                            </div>
                                    </Col>
                                </Row>
                                
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'flex-end'
                                    }}
                                >
                                    <button 
                                        className="btn btn-primary"
                                        type='submit' 
                                        disabled={values.checked.length === 0 ? true : false}
                                        style={{
                                            minWidth: 100
                                        }}
                                    >
                                        <h5
                                            style={{
                                                margin: 0
                                            }}
                                        >Next</h5>
                                    </button>
                                </div>

                                </Form>
                            </>

                        )}


                    </Formik>

                </CardBody>
            </Card>
        </>
    )

}

export default FormPermohonan