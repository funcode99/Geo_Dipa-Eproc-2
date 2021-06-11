import React, {
    useState,
    useEffect,
    useCallback
} from 'react';
import {
    connect, shallowEqual, useSelector
} from "react-redux";
import {
    FormattedMessage,
    injectIntl
} from "react-intl";
import {
    Card,
    CardBody,
    CardFooter
} from "../../../../../../_metronic/_partials/controls";
import {
    Table
} from "react-bootstrap";
import { getContractSummary, saveSpp, getSpp, updateSpp, getAllRejectedSpp, getFileSpp, getFile } from '../../../_redux/InvoiceMonitoringCrud';
import useToast from '../../../../../components/toast';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { rupiah } from '../../../../../libs/currency';
import moment from'moment';

function ContractSprPage(props) {

    const [loading, setLoading] = useState(false);
    const [contractData, setContractData] = useState({})
    const [sppData, setSppData] = useState({})
    const [uploadFilename, setUploadFilename] = useState('Pilih File')
    const [uploadFilenameBank, setUploadFilenameBank] = useState('Pilih File')
    const [bankReference, setBankReference] = useState(true)
    const [sppStatus, setSppStatus] = useState(false)
    const [sppUpdate, setSppUpdate] = useState(false)
    const [sppId, setSppId] = useState('')
    const [allRejectedSppData, setAllRejectedSppData] = useState([])

    const [Toast, setToast] = useToast();

    const user_id = useSelector((state) => state.auth.user.data.user_id, shallowEqual);
    // const vendor_id = useSelector((state) => state.auth.user.data.vendor_id, shallowEqual);
    const contract_id = props.match.params.contract;
    const termin = props.match.params.termin;
    const { intl } = props;

    const initialValues = {
        spr_no: '',
        spr_date: '',
        contract_id: '',
        vendor_id: '',
        term: '',
        payment_value: '',
        bank_refference: '',
        bank_name: '',
        bank_address: '',
        bank_account_no: '',
        bank_account_name: '',
        file_name: '',
        new_bank_file: '',
        description: '',
        created_at: '',
        created_by_id: '',
        file: '',
        file_bank: '',

        payment_value: 22,
    }

    const InvoiceSchema = Yup.object().shape({
        file: Yup
            .mixed()
            .required(
                intl.formatMessage({
                    id: "AUTH.VALIDATION.REQUIRED_FIELD",
                })
            ),
        bank_refference: Yup.boolean(),
        file_bank: Yup
            .mixed()
            .when('bank_refference', {
                is: false,
                then: Yup.mixed()
                    .required(
                        intl.formatMessage({
                            id: "AUTH.VALIDATION.REQUIRED_FIELD",
                        })
                    ),
            }),
        description: Yup
            .string()
            .required(
                intl.formatMessage({
                    id: "AUTH.VALIDATION.REQUIRED_FIELD",
                })
            ),
        spr_date: Yup
            .string()
            .required(
                intl.formatMessage({
                    id: "AUTH.VALIDATION.REQUIRED_FIELD",
                })
            ),
        spr_no: Yup
            .string()
            .required(
                intl.formatMessage({
                    id: "AUTH.VALIDATION.REQUIRED_FIELD",
                })
            ),
        bank_name: Yup
            .string()
            .required(
                intl.formatMessage({
                    id: "AUTH.VALIDATION.REQUIRED_FIELD",
                })
            ),
        bank_address: Yup
            .string()
            .required(
                intl.formatMessage({
                    id: "AUTH.VALIDATION.REQUIRED_FIELD",
                })
            ),
        bank_account_no: Yup
            .string()
            .required(
                intl.formatMessage({
                    id: "AUTH.VALIDATION.REQUIRED_FIELD",
                })
            ),
        bank_account_name: Yup
            .string()
            .required(
                intl.formatMessage({
                    id: "AUTH.VALIDATION.REQUIRED_FIELD",
                })
            )

    });

    const formik = useFormik({
        initialValues,
        validationSchema: InvoiceSchema,
        onSubmit: async (values, { setStatus, setSubmitting }) => {
            setLoading(true)
            setSppStatus(true)
            var data = new FormData()
            for (var key in values) {
                data.append(key, values[key])
            }
            if (sppUpdate) {
                updateSpp(sppId, data)
                    .then(response => {
                        setToast(intl.formatMessage({ id: "REQ.UPDATE_SUCCESS" }), 10000);
                        setLoading(false)
                    })
                    .catch((error) => {
                        if (error.response?.status === 400 && error.response?.data.message !== "TokenExpiredError") setToast(intl.formatMessage({ id: "REQ.UPDATE_FAILED" }), 10000);
                        setLoading(false);
                    });
            } else {
                saveSpp(data)
                    .then(response => {
                        setToast(intl.formatMessage({ id: "REQ.UPDATE_SUCCESS" }), 10000);
                        setLoading(false)
                    })
                    .catch((error) => {
                        if (error.response?.status === 400 && error.response?.data.message !== "TokenExpiredError") setToast(intl.formatMessage({ id: "REQ.UPDATE_FAILED" }), 10000);
                        setLoading(false);
                    });
            }
        }
    });

    const getContractData = useCallback(() => {
        getContractSummary(contract_id)
            .then(response => {
                response['data']['data']['contract_value_new'] = rupiah(response['data']['data']['contract_value'])
                response['data']['data']['direksi'] = response['data']['data']['party_1_contract_signature_name'].concat(' - ', response['data']['data']['party_1_director_position'])
                response['data']['data']['full_name'] = response['data']['data']["data"]["legal_org_type_sub"]["name"].concat(". ", response['data']['data']["data"]["full_name"])
                response['data']['data']['full_address_party_2'] = `${response['data']['data']["data"]["address"]["postal_address"] ? response['data']['data']["data"]["address"]["postal_address"] : null} ${response['data']['data']["data"]["address"]["sub_district"] ? response['data']['data']["data"]["address"]["sub_district"]["name"] : null} ${response['data']['data']["data"]["address"]["district"] ? response['data']['data']["data"]["address"]["district"]["name"] : null} ${response['data']['data']["data"]["address"]["province"] ? response['data']['data']["data"]["address"]["province"]["name"] : null} ${response['data']['data']["data"]["address"]["postal_code"] ? response['data']['data']["data"]["address"]["postal_code"] : null}`
                response['data']['data']['full_data_party_2'] = `${response['data']['data']['full_name']} \n\n${response['data']['data']['full_address_party_2']} \n${response['data']['data']["data"]["phone_number"]["number"]} ${response['data']['data']["data"]["phone_number"]["ext"] ? "\next: ".concat(response['data']['data']["data"]["phone_number"]["ext"]) : ''}`
                response['data']['data']['full_data_party_1'] = `PT. GEO DIPA ENERGI \n\n${response['data']['data']['name']} \n${response['data']['data']['address']}`
                setContractData(response.data.data)
                formik.setValues({
                    spr_no: '',
                    contract_id: contract_id,
                    term: termin,
                    bank_refference: true,
                    vendor_id: response['data']['data']['vendor_id'],
                    bank_name: response['data']['data']['data_bank'][0]['bank']['full_name'],
                    bank_address: response['data']['data']['data_bank'][0]['address']['postal_address'],
                    bank_account_no: response['data']['data']['data_bank'][0]['account_number'],
                    bank_account_name: response['data']['data']['data_bank'][0]['account_holder_name'],
                    created_by_id: user_id,
                })
                getSppData()
            })
            .catch((error) => {
                if (
                    error.response?.status !== 400 &&
                    error.response?.data.message !== "TokenExpiredError"
                )
                    setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 10000);
            });
    }, [contract_id, formik, intl, setToast, user_id])

    const getSppData = useCallback(() => {
        getSpp(contract_id, termin)
            .then(response => {
                if (!response['data']['data']) {
                    setSppStatus(false)
                } else {
                    getAllRejectedSppData(response['data']['data']['id'])
                    setSppId(response['data']['data']['id'])
                    if (response['data']['data']['state'] === 'REJECTED') {
                        setSppStatus(false)
                        setSppUpdate(true)
                    } else {
                        setSppStatus(true)
                        setBankReference(response['data']['data']['bank_refference'])
                        formik.setFieldValue('spr_no', response['data']['data']['spr_no'])
                        formik.setFieldValue('spr_date', response['data']['data']['spr_date'])
                        formik.setFieldValue('description', response['data']['data']['description'])
                        formik.setFieldValue('file_name', response['data']['data']['file_name'])
                        formik.setFieldValue('bank_refference', response['data']['data']['bank_refference'])
                        formik.setFieldValue('bank_name', response['data']['data']['bank_name'])
                        formik.setFieldValue('bank_address', response['data']['data']['bank_address'])
                        formik.setFieldValue('bank_account_no', response['data']['data']['bank_account_no'])
                        formik.setFieldValue('bank_account_name', response['data']['data']['bank_account_name'])
                        formik.setFieldValue('new_bank_file', response['data']['data']['new_bank_file'])
                        setUploadFilename(response['data']['data']['file_name'])
                        setUploadFilenameBank(response['data']['data']['new_bank_file'])
                        setSppData(response['data']['data'])
                    }
                }
            })
            .catch((error) => {
                if (
                    error.response?.status !== 400 &&
                    error.response?.data.message !== "TokenExpiredError"
                )
                    setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 10000);
            });
    }, [contract_id, termin, formik, intl, setToast, user_id])

    const getAllRejectedSppData = useCallback((spr_id) => {
        getAllRejectedSpp(spr_id)
            .then(response => {
                setAllRejectedSppData(response['data']['data'])
            })
            .catch((error) => {
                if (
                    error.response?.status !== 400 &&
                    error.response?.data.message !== "TokenExpiredError"
                )
                    setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 10000);
            });
    }, [contract_id, termin, formik, intl, setToast, user_id])

    const handleUpload = (e) => {
        setUploadFilename(e.currentTarget.files[0].name)
        formik.setFieldValue('file_name', e.currentTarget.files[0].name)
        formik.setFieldValue('file', e.currentTarget.files[0])
    }

    const handleUploadBank = (e) => {
        setUploadFilenameBank(e.currentTarget.files[0].name)
        formik.setFieldValue('new_bank_file', e.currentTarget.files[0].name)
        formik.setFieldValue('file_bank', e.currentTarget.files[0])
    }

    const handleDate = (e) => {
        formik.setFieldValue('spr_date', e.target.value)
    }

    const handleRadio = (e) => {
        if (e.target.value === 'true') {
            setBankReference(true)
            formik.setFieldValue('bank_refference', true)
            formik.setFieldValue('bank_account_no', contractData["data_bank"][0]['account_number'])
            formik.setFieldValue('bank_account_name', contractData["data_bank"][0]['account_holder_name'])
            formik.setFieldValue('bank_name', contractData["data_bank"][0]['bank']['full_name'])
            formik.setFieldValue('bank_address', contractData["data_bank"][0]['address']['postal_address'])
        } else {
            setBankReference(false)
            formik.setFieldValue('bank_refference', false)
            formik.setFieldValue('bank_account_no', '')
            formik.setFieldValue('bank_account_name', '')
            formik.setFieldValue('bank_name', '')
            formik.setFieldValue('bank_address', '')
        }
    }

    const handleChangeBank = (e) => {
        formik.setFieldValue('bank_account_no', contractData["data_bank"][e.target.value]['account_number'])
        formik.setFieldValue('bank_account_name', contractData["data_bank"][e.target.value]['account_holder_name'])
        formik.setFieldValue('bank_name', contractData["data_bank"][e.target.value]['bank']['full_name'])
        formik.setFieldValue('bank_address', contractData["data_bank"][e.target.value]['address']['postal_address'])
    };

    useEffect(getContractData, []);

    return (
        <React.Fragment>
            <Toast />
            <Card>
                <form
                    noValidate
                    autoComplete="off"
                    onSubmit={formik.handleSubmit}
                >
                    <CardBody>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group row">
                                    <label htmlFor="numberSpp" className="col-sm-4 col-form-label"><FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.SPR_DOCUMENT.SPR_NUMBER" /></label>
                                    <div className="col-sm-8">
                                        <input type="text" className="form-control" id="numberSpp" disabled={loading || sppStatus} defaultValue={sppData.spr_no} {...formik.getFieldProps('spr_no')} />
                                    </div>
                                    {(formik.touched.spr_no && formik.errors.spr_no) ? (
                                        <span className="col-sm-8 offset-sm-4 text-center text-danger" >
                                            {formik.errors.spr_no}
                                        </span>
                                    ) : null}
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="dateSpp" className="col-sm-4 col-form-label"><FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.SPR_DOCUMENT.SPR_DATE" /></label>
                                    <div className="col-sm-8">
                                        <input type="date" className="form-control" id="dateSpp" defaultValue={sppData.spr_date} disabled={loading || sppStatus} onChange={e => handleDate(e)} />
                                    </div>
                                    {(formik.touched.spr_date && formik.errors.spr_date) ? (
                                        <span className="col-sm-8 offset-sm-4 text-center text-danger" >
                                            {formik.errors.spr_date}
                                        </span>
                                    ) : null}
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="note" className="col-sm-4 col-form-label"><FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.INVOICE_DOCUMENT.INVOICE_DESCRIPTION" /></label>
                                    <div className="col-sm-8">
                                        <textarea rows="4" cols="" className="form-control" id="note" disabled={loading || sppStatus} {...formik.getFieldProps('description')}></textarea>
                                    </div>
                                    {(formik.touched.description && formik.errors.description) ? (
                                        <span className="col-sm-8 offset-sm-4 text-center text-danger" >
                                            {formik.errors.description}
                                        </span>
                                    ) : null}
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="upload" className="col-sm-4 col-form-label"><FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.SPR_DOCUMENT.SPR_UPLOAD" /></label>
                                    <label htmlFor="upload" className="input-group mb-3 col-sm-8 pointer">
                                        {!sppStatus && <div className="input-group-prepend">
                                            <span className="input-group-text"><i className="fas fa-file-upload"></i></span>
                                        </div>}
                                        <span className="form-control">{uploadFilename}</span>
                                        {sppStatus && <div className="input-group-append">
                                            <span className="input-group-text"><i className="fas fa-download"></i></span>
                                        </div>}
                                    </label>
                                    <input type="file" className="d-none" id="upload" disabled={loading || sppStatus} onChange={(e => handleUpload(e))} />
                                    {(formik.touched.file && formik.errors.file) ? (
                                        <span className="col-sm-8 offset-sm-4 text-center text-danger" >
                                            {formik.errors.file}
                                        </span>
                                    ) : null}
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="accountNumberSpp" className="col-sm-4 col-form-label">Referensi Data Bank</label>
                                    <div className="col-sm-8 col-form-label">
                                        <div className="form-check form-check-inline">
                                            <input className="form-check-input" type="radio" name="RadioOptions" value={true} disabled={loading || sppStatus} onChange={handleRadio} checked={bankReference} />
                                            <label className="form-check-label">Gunakan Data Referensi</label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <input className="form-check-input" type="radio" name="RadioOptions" value={false} disabled={loading || sppStatus} onChange={handleRadio} checked={!bankReference} />
                                            <label className="form-check-label">Masukkan Sendiri</label>
                                        </div>
                                    </div>
                                </div>
                                {bankReference && <div className="form-group row">
                                    <label htmlFor="accountNumberSpp" className="col-sm-4 col-form-label"><FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.SPR_DOCUMENT.ACCOUNT_NUMBER" /></label>
                                    <div className="col-sm-8">
                                        <select onChange={handleChangeBank} disabled={loading || sppStatus} className="custom-select custom-select-sm">
                                            {contractData["data_bank"]?.map((item, index) => {
                                                return (
                                                    <option key={index} defaultValue={index} selected={sppData.bank_account_no === item.account_number} value={index}>{item.account_number}</option>
                                                )
                                            })}
                                        </select>
                                    </div>
                                </div>}
                                {!bankReference && <div className="form-group row">
                                    <label htmlFor="accountNumberSpp" className="col-sm-4 col-form-label"><FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.SPR_DOCUMENT.ACCOUNT_NUMBER" /></label>
                                    <div className="col-sm-8">
                                        <input type="text" className="form-control" id="accountNumberSpp" disabled={loading || sppStatus} {...formik.getFieldProps('bank_account_no')} />
                                    </div>
                                    {(formik.touched.bank_account_no && formik.errors.bank_account_no) ? (
                                        <span className="col-sm-8 offset-sm-4 text-center text-danger" >
                                            {formik.errors.bank_account_no}
                                        </span>
                                    ) : null}
                                </div>}
                                <div className="form-group row">
                                    <label htmlFor="accountNameSpp" className="col-sm-4 col-form-label">Nama Rekening</label>
                                    <div className="col-sm-8">
                                        <input type="text" className="form-control" id="accountNameSpp" disabled={loading || bankReference || sppStatus} defaultValue={sppData.bank_account_name} {...formik.getFieldProps('bank_account_name')} />
                                    </div>
                                    {(formik.touched.bank_account_name && formik.errors.bank_account_name) ? (
                                        <span className="col-sm-8 offset-sm-4 text-center text-danger" >
                                            {formik.errors.bank_account_name}
                                        </span>
                                    ) : null}
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="bankNameSpp" className="col-sm-4 col-form-label">Nama Bank</label>
                                    <div className="col-sm-8">
                                        <input type="text" className="form-control" id="bankNameSpp" disabled={loading || bankReference || sppStatus} {...formik.getFieldProps('bank_name')} />
                                    </div>
                                    {(formik.touched.bank_name && formik.errors.bank_name) ? (
                                        <span className="col-sm-8 offset-sm-4 text-center text-danger" >
                                            {formik.errors.bank_name}
                                        </span>
                                    ) : null}
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="bankAddressSpp" className="col-sm-4 col-form-label">Alamat Bank</label>
                                    <div className="col-sm-8">
                                        <textarea rows="4" className="form-control" id="bankAddressSpp" disabled={loading || bankReference || sppStatus} {...formik.getFieldProps('bank_address')}></textarea>
                                    </div>
                                    {(formik.touched.bank_address && formik.errors.bank_address) ? (
                                        <span className="col-sm-8 offset-sm-4 text-center text-danger" >
                                            {formik.errors.bank_address}
                                        </span>
                                    ) : null}
                                </div>
                                {!bankReference && <div className="form-group row">
                                    <label htmlFor="upload_bank" className="col-sm-4 col-form-label">Upload Surat Ganti Bank</label>
                                    <label htmlFor="upload_bank" className="input-group mb-3 col-sm-8 pointer">
                                        {!sppStatus && <div className="input-group-prepend">
                                            <span className="input-group-text"><i className="fas fa-file-upload"></i></span>
                                        </div>}
                                        <span className="form-control">{uploadFilenameBank}</span>
                                        {sppStatus && <div className="input-group-append">
                                            <span className="input-group-text"><i className="fas fa-download"></i></span>
                                        </div>}
                                    </label>
                                    {(formik.touched.file_bank && formik.errors.file_bank) ? (
                                        <span className="col-sm-8 offset-sm-4 text-center text-danger" >
                                            {formik.errors.file_bank}
                                        </span>
                                    ) : null}
                                    <input type="file" className="d-none" id="upload_bank" disabled={loading || sppStatus} onChange={(e => handleUploadBank(e))} />
                                </div>}
                            </div>
                            <div className="col-md-6">
                                <div className="form-group row">
                                    <label htmlFor="priceContract" className="col-sm-5 col-form-label"><FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.CONTRACT_VALUE" /></label>
                                    <div className="col-sm-7">
                                        <input type="text" className="form-control" id="priceContract" defaultValue={contractData['contract_value_new']} disabled />
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="poNumber" className="col-sm-5 col-form-label"><FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.PO_NUMBER" /></label>
                                    <div className="col-sm-7">
                                        <input type="text" className="form-control" id="poNumber" defaultValue={contractData['purch_order_no']} disabled />
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="priceStep1" className="col-sm-5 col-form-label"><FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.TERMIN_VALUE" values={{ termin: termin }} /></label>
                                    <div className="col-sm-7">
                                        <input type="text" className="form-control" id="priceStep1" defaultValue="Rp. 1.000.000" disabled />
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="priceTaxSpp" className="col-sm-5 col-form-label">Harga Pekerjaan Tahap 1 dengan PPN</label>
                                    <div className="col-sm-7">
                                        <input type="text" className="form-control" id="priceTaxSpp" defaultValue="Rp. 1.100.000" disabled />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardBody>
                    <CardFooter className="text-right">
                        <button type="submit" className="btn btn-primary mx-1" disabled={loading || (formik.touched && !formik.isValid)}>
                            <FormattedMessage id="TITLE.UPLOAD" />
                            {loading && <span className="spinner-border spinner-border-sm ml-1" aria-hidden="true"></span>}
                        </button>
                    </CardFooter>
                </form>
            </Card>
            <Card className="mt-5">
                <CardBody>
                    <div className="my-5 text-center">
                        <h6>Riwayat Dokumen SPP</h6>
                    </div>
                    {/* begin: Table */}
                    <div className="table-wrapper-scroll-y my-custom-scrollbar">
                        <div className="segment-table">
                            <div className="hecto-10">
                                <Table className="table-bordered overflow-auto">
                                    <thead>
                                        <tr>
                                            <th className="bg-primary text-white align-middle"><span>No</span></th>
                                            <th className="bg-primary text-white align-middle">
                                                <span>Nomor SPP</span>
                                            </th>
                                            <th className="bg-primary text-white align-middle">
                                                <span>Tanggal SPP</span>
                                            </th>
                                            <th className="bg-primary text-white align-middle">
                                                <span>File</span>
                                            </th>
                                            <th className="bg-primary text-white align-middle">
                                                <span>Dikirim Oleh</span>
                                            </th>
                                            <th className="bg-primary text-white align-middle">
                                                <span>Tanggal Dikirim</span>
                                            </th>
                                            <th className="bg-primary text-white align-middle">
                                                <span>Ditolak Oleh</span>
                                            </th>
                                            <th className="bg-primary text-white align-middle">
                                                <span>Tanggal Ditolak</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {allRejectedSppData?.map((item, index) => {
                                            return (
                                                <tr key={index.toString()}>
                                                    <td className="align-middle text-center">
                                                        {index + 1}
                                                    </td>
                                                    <td>{item.spr_no}</td>
                                                    <td>{item.spr_date}</td>
                                                    <td className="align-middle text-center">
                                                        <a href={`http://localhost:5000/invoice/get_file_spp/${item.file_name}`}>{item.file_name}</a>
                                                    </td>
                                                    <td className="align-middle">{item.created_by_id}</td>
                                                    <td className="align-middle">{moment(new Date(item.created_at)).format("YYYY-MM-DD HH:mm:ss")}</td>
                                                    <td className="align-middle">{item['user']['party']['full_name']}</td>
                                                    <td className="align-middle">{moment(new Date(item.rejected_at)).format("YYYY-MM-DD HH:mm:ss")}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                    </div>
                    {/* end: Table */}
                </CardBody>
            </Card>
        </React.Fragment>
    )
}
export default injectIntl(connect(null, null)(ContractSprPage));