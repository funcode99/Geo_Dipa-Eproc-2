import React, { useState, useEffect } from 'react'
import { Col, Row } from "react-bootstrap"
import { 
    Formik, 
    Field, 
    Form, 
    useFormikContext 
} from 'formik'
import {
    Card,
    CardBody,
} from "_metronic/_partials/controls"
import { rupiah } from "app/libs/currency"

import {
    submitAddendumRequest
  } from "app/modules/AddendumContract/service/DeliveryMonitoringCrud"

    const FormPermohonan = (
        props
    ) => {

    console.log('isi props', props)

    const [conclusion, setConclusion] = useState('')
    const [adnm_percentage, set_adnm_percentage] = useState()
    const [disabledInput, setDisabledInput] = useState('both')

    const submitAddendumRequestForm = (values) => {
        
        console.log('isi values saat submit', values)
        submitAddendumRequest({
            // unauthorized karena contract id nya wkwk, dasar goblok
            contract_id: `${props.contractId}`,
            add_doc_number: `${props.headerData.doc_number}`,
            is_add_parties: values.checked.includes('parties') ? '1': '0',
            is_add_job_price: values.checked.includes('job_price') ? '1': '0',
            is_add_time_period: values.checked.includes('time_period') ? '1': '0',
            is_add_payment_method: values.checked.includes('payment_method') ? '1': '0',
            is_add_fine: values.checked.includes('fine') ? '1': '0',
            is_add_guarantee: values.checked.includes('guarantee') ? '1': '0',
            is_add_account_number: values.checked.includes('account_number') ? '1': '0',
            is_budget_availability: values.others.includes('Lainnya') ? '1' : '0',
            other_note: values.note,
            initial_job_price: `${props?.headerData?.initial_contract_value}`,
            latest_addendum_job_price: values.latest_adnm_job_price,
            increase_job_price: values.additional_price,
            decrease_job_price: values.substraction_price,
            after_addendum_job_price: values.after_adnm_job_price,
            conclusion: conclusion
        })
    }

    const FormObserver = () => {
        const { values } = useFormikContext()
            
        useEffect(() => {
        console.log("FormObserver::values", values.checked)
        console.log('isi values formobserver', values)
        props.assignTabLists(values.checked)
        if(
            (values.additional_price === '0' || values.additional_price === '')
            &&
            (values.substraction_price === '0' || values.substraction_price === '')
        ) {
            setDisabledInput('both')
        } else if (
            (values.additional_price === '0' || values.additional_price === '')
            &&
            (values.substraction_price !== '0' || values.substraction_price !== '')
        ) {
            setDisabledInput('add')
        } else if (
            (values.additional_price !== '0' || values.additional_price !== '')
            &&
            (values.substraction_price === '0' || values.substraction_price === '')
        ) {
            setDisabledInput('sub')
        }
        }, [values])
        
        return null
    }

        return (
            <>  

                {/* <EditableTable /> */}

                <Card>
                    <CardBody>
                        
                        <Card>
                            <form>
                                <div 
                                    style={{
                                        display: 'flex', 
                                        columnGap: 40, 
                                        flexWrap: 'wrap'
                                    }}
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
                                                    value={`${props?.headerData?.agreement_number}`}
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
                                                        value={`${props?.headerData?.po_number}`}
                                                />
                                            </div>
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
                                                        value={`${props?.headerData?.procurement_authority}`}
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
                                                        value={`${props?.headerData?.user}`}
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
                                                        value={`${props?.headerData?.provider}`}
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
                                                        value={`${props?.headerData?.procurement_title}`}
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
                                                        value={`${props?.headerData?.po_note}`}
                                                />
                                            </div>
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
                                                        value={`${props?.headerData?.procurement_authority_group}`}
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
                                                        value={`${props?.headerData?.user_group}`}
                                                />
                                            </div>
                                        </div>
                                </div>
                            </form>
                        </Card>

                        <Formik
                            initialValues={{
                                checked: props.checkedValues,
                                others: [],
                                additional_price: '0',
                                substraction_price: '0',
                                note: '',
                                adnm_conclusion: ''
                            }}
                            onSubmit={
                                (values) => {
                                    props.checkedLength(values.checked.length)
                                    submitAddendumRequestForm(values)
                                }
                            }
                        >
                            {({ values }) => (

                                <>
                                    <Form>
                                        
                                        <FormObserver />

                                        <div
                                            style={{
                                                marginTop: 28,
                                                marginBottom: 28,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: 4
                                            }}
                                        >
                                            
                                            <h1
                                                style={{
                                                    fontSize: 16,
                                                    fontWeight: 600,
                                                    margin: 0
                                                }}
                                            >
                                                <span style={{ color: '#dc0526' }}>*</span>
                                                Tanggal Dokumen Permohonan
                                            </h1>
                                            <span
                                                style={{
                                                    fontSize: 12,
                                                    color: '#dc0526',
                                                    fontWeight: 400
                                                }}
                                            >Silahkan pilih tanggal permohonan</span>
                                            <div>
                                                <input 
                                                    type='date'
                                                    // pakai strip bukan garing
                                                    value="2023-07-15"
                                                />
                                            </div>
                                        </div>

                                        <div
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: 14
                                            }}
                                        >
                                            <h1
                                                style={{
                                                    fontWeight: 600,
                                                    fontSize: 16
                                                }}
                                            >
                                                Perihal Addendum
                                            </h1>
                                            {/* checkbox */}
                                            <div
                                                style={{
                                                    display: 'grid',
                                                    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                                                    columnGap: 8,
                                                    rowGap: 8
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
                                                        value="parties"
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
                                                        value="payment_method"
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
                                                        value="fine" 
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
                                                        value="account_number" 
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
                                                        value="job_price"
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
                                                        value="time_period" 
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
                                                        value="guarantee" 
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
                                                <Field
                                                    style={{
                                                        minWidth: '300px',
                                                        padding: 8,
                                                        borderRadius: 4
                                                    }}
                                                    type='text'
                                                    name='note'
                                                    placeholder='Masukkan perihal addendum lainnya'
                                                    disabled={values.others.length === 0 ? true : false}
                                                />
                                            </div>
                                        </div>

                        
                                    <Row
                                        style={{
                                            marginTop: 28
                                        }}
                                    >
                                        <Col md={12}>
                                            <Row>
                                                <Col md={12}>
                                                    <div className='form-group row'>
                                                        <label className='col-sm-4 col-form-label'>
                                                            Harga Pekerjaan Awal
                                                        </label>
                                                        <div className='col-sm-8'>
                                                            <input 
                                                                className='form-control' 
                                                                type='text' 
                                                                value={`${rupiah(props?.headerData?.initial_contract_value)}`}
                                                                disabled
                                                            />
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
                                                            <input 
                                                                className='form-control' 
                                                                type='text'
                                                                // di parseInt auto number jir
                                                                value={`${rupiah(
                                                                    typeof props?.headerData?.latest_contract_value !== 'number' ? 
                                                                    0 
                                                                    : 
                                                                    props?.headerData?.latest_contract_value
                                                                    )}`}
                                                                disabled
                                                            />
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
                                                        <Field 
                                                            className='form-control'
                                                            type="text" 
                                                            name="additional_price"
                                                            disabled={
                                                                disabledInput === 'add'
                                                            }
                                                        />
                                                                {/* // component={}
                                                                // onChange={e => rupiah(e.target.value)}
                                                                // onKeyUp={e => values.additional_price = rupiah(e.target.value)} */}
                                                    </div>
                                                </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={12}>
                                                <div
                                                    className=
                                                {`form-group row ${values.additional_price !== '0' && values.additional_price !== '' ? '' : 'd-none'}`}
                                                >
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
                                                        <Field 
                                                            className='form-control'
                                                            type="text"
                                                            name="substraction_price"
                                                            disabled={
                                                                disabledInput === 'sub'
                                                            }
                                                        />
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
                                                        <input 
                                                            className='form-control' 
                                                            type='text' 
                                                            value={`${
                                                                values.additional_price !== '0' 
                                                                && 
                                                                values.additional_price  !== '' 
                                                                ?
                                                                rupiah(parseInt(props?.headerData?.initial_contract_value) + parseInt(values.additional_price === '' ? '0' : values.additional_price))
                                                            : 
                                                                rupiah(parseInt(props?.headerData?.initial_contract_value) - parseInt(values.substraction_price === '' ? '0' : values.substraction_price))
                                                            }`}
                                                            disabled 
                                                        />
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
                                                        <input 
                                                            className='form-control'
                                                            type='text'
                                                            value={`${adnm_percentage}%`}
                                                            disabled
                                                        />
                                                        <input 
                                                            className='d-none' 
                                                            type='text'
                                                            value=
                                                            {
                                                            `${
                                                            values.additional_price !== '0' 
                                                            && 
                                                            values.additional_price !== ''
                                                            &&
                                                            (values.substraction_price === '0'
                                                            ||
                                                            values.substraction_price === '')
                                                            ? 
                                                                set_adnm_percentage(
                                                                    ((((parseInt(props?.headerData?.initial_contract_value) + parseInt(values.additional_price === '' ? '0' : values.additional_price)) / parseInt(props?.headerData?.initial_contract_value)) - 1) * 100).toFixed(2)
                                                                )
                                                            : 
                                                                set_adnm_percentage(
                                                                    ((((parseInt(props?.headerData?.initial_contract_value) - parseInt(values.substraction_price === '' ? '0' : values.substraction_price)) / parseInt(props?.headerData?.initial_contract_value)) - 1) * 100).toFixed(2)
                                                                )
                                                            }`
                                                            }
                                                            disabled
                                                        />
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
                                                        <input
                                                            className='form-control'
                                                            type='text'
                                                            value={conclusion}
                                                            disabled
                                                        />
                                                        <input
                                                            className='d-none'
                                                            value=
                                                            {`${
                                                            parseInt(props?.headerData?.initial_contract_value) < 5000000000 && parseInt(Math.abs(adnm_percentage)) < 10 ?                                                 setConclusion('Harga pekerjaan setelah addendum dibawah 10% dari harga pekerjaan awal')
                                                                :
                                                            setConclusion('Harga pekerjaan setelah addendum diatas 10% dari harga pekerjaan awal (Nilai Kontrak di bawah Rp 5M)')}`}
                                                        />
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
                                            className={`btn ${values.checked.length === 0 ? `btn-secondary` : `btn-primary`} `}
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