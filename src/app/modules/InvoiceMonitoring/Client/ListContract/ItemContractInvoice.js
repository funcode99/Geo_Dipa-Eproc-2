import React, {
    useState,
    useEffect
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
} from "../../../../../_metronic/_partials/controls";
import { getContractSummary, saveInvoice, getInvoice } from './service/invoice';
import useToast from '../../../../components/toast';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { rupiah } from '../../../../libs/currency';

function ItemContractInvoice(props) {

    const [loading, setLoading] = useState(false);
    const [contractData, setContractData] = useState({})
    const [uploadFilename, setUploadFilename] = useState('Pilih File')
    const [invoiceStatus, setInvoiceStatus] = useState(true)
    const [invoiceData, setInvoiceData] = useState({})

    const [Toast, setToast] = useToast();

    const vendor_id = useSelector((state) => state.auth.user.data.vendor_id, shallowEqual);
    const user_id = useSelector((state) => state.auth.user.data.user_id, shallowEqual);
    const contract_id = props.match.params.id;
    const { intl } = props;

    const getContractData = () => {
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
                    invoice_no: '10000014264',
                    purch_order_no: response['data']['data']['purch_order_no'],
                    contract_id: response['data']['data']['id'],
                    plant_id: response['data']['data']['plant_id'],
                    purch_group_id: response['data']['data']['purch_group_id'],
                    plant_id2: response['data']['data']['plant_id2'],
                    purch_group_id2: response['data']['data']['purch_group_id2'],
                    vendor_id: response['data']['data']['vendor_id'],
                    contract_value: response['data']['data']['contract_value'],
                    currency_id: response['data']['data']['currency_id'],
                    invoice_term: '',
                    invoice_value: 0,
                    created_by_id: user_id,
                    file: '',
                    from_time: '',
                    thru_time: '',
                    description: ''
                })
            })
            .catch((error) => {
                if (
                    error.response?.status !== 400 &&
                    error.response?.data.message !== "TokenExpiredError"
                )
                    setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 10000);
            });
    }

    const getInvoiceData = () => {
        getInvoice(contract_id, 2)
            .then(response => {
                setInvoiceData(response.data.data)
                if(!response.data.data){
                    setInvoiceStatus(false)
                }
                formik.setFieldValue('description', response.data.data ? response.data.data.description : null)
            })
            .catch((error) => {
                if (
                    error.response?.status !== 400 &&
                    error.response?.data.message !== "TokenExpiredError"
                )
                    setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 10000);
            });
    }

    const initialValues = {
        invoice_no: '11111111',
        from_time: '',
        thru_time: '',
        purch_order_no: '',
        contract_id: '',
        plant_id: '',
        purch_group_id: '',
        plant_id2: '',
        purch_group_id2: '',
        vendor_id: '',
        contract_value: '',
        currency_id: '',
        invoice_term: '',
        invoice_value: '',
        description: '',
        file_name: '',
        created_at: '',
        created_by_id: '',
        file: ''
    }

    useEffect(() => {
        getContractData()
        getInvoiceData()
    }, []);

    const InvoiceSchema = Yup.object().shape({
        file: Yup
            .mixed()
            .required(
                intl.formatMessage({
                    id: "AUTH.VALIDATION.REQUIRED_FIELD",
                })
            ),
        description: Yup
            .string()
            .required(
                intl.formatMessage({
                    id: "AUTH.VALIDATION.REQUIRED_FIELD",
                })
            ),
        from_time: Yup
            .string()
            .required(
                intl.formatMessage({
                    id: "AUTH.VALIDATION.REQUIRED_FIELD",
                })
            ),
        invoice_no: Yup
            .string()
            .matches(/^[0-9]*$/,
                intl.formatMessage({
                    id: "AUTH.VALIDATION.NUMBER_ONLY",
                })
            )
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
            saveInvoice(values)
                .then(response => {
                    setLoading(false)
                })
                .catch((error) => {
                    if (
                        error.response?.status !== 400 &&
                        error.response?.data.message !== "TokenExpiredError"
                    )
                        setToast(intl.formatMessage({ id: "REQ.UPDATE_FAILED" }), 10000);
                    setLoading(false);
                });
        },
    });

    const handleUpload = (e) => {
        setUploadFilename(e.currentTarget.files[0].name)
        formik.setFieldValue('file_name', e.currentTarget.files[0].name)
        formik.setFieldValue('file', e.currentTarget.files[0])
    }

    const handleDate = (e) => {
        formik.setFieldValue('from_time', e.target.value)
        var date = new Date(e.target.value)
        date.setMonth(date.getMonth() + 1)
        formik.setFieldValue('thru_time', date.toISOString().split('T')[0])
    }

    return (
        <React.Fragment>
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
                                    <label htmlFor="numberInvoice" className="col-sm-4 col-form-label">Number Invoice</label>
                                    <div className="col-sm-8">
                                        <input type="text" className="form-control" id="numberInvoice" disabled={loading || invoiceStatus} defaultValue={invoiceData ? invoiceData['invoice_no'] : null} {...formik.getFieldProps('invoice_no')} />
                                    </div>
                                    {(formik.touched.invoice_no && formik.errors.invoice_no) ? (
                                        <span className="col-sm-8 offset-sm-4 text-center text-danger" >
                                            {formik.errors.invoice_no}
                                        </span>
                                    ) : null}
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="dateInvoice" className="col-sm-4 col-form-label">Tanggal Invoice</label>
                                    <div className="col-sm-8">
                                        <input type="date" className="form-control" id="dateInvoice" disabled={loading || invoiceStatus} defaultValue={invoiceData ? invoiceData['from_time'] : null} onChange={e => handleDate(e)} />
                                    </div>
                                    {(formik.touched.from_time && formik.errors.from_time) ? (
                                        <span className="col-sm-8 offset-sm-4 text-center text-danger" >
                                            {formik.errors.from_time}
                                        </span>
                                    ) : null}
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="priceContract" className="col-sm-4 col-form-label">Harga Pekerjaan</label>
                                    <div className="col-sm-8">
                                        <input type="text" className="form-control" id="priceContract" defaultValue={contractData['contract_value_new']} disabled />
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="poNumber" className="col-sm-4 col-form-label">Nomor PO</label>
                                    <div className="col-sm-8">
                                        <input type="text" className="form-control" id="poNumber" defaultValue={contractData['purch_order_no']} disabled />
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="priceStep1" className="col-sm-4 col-form-label">Harga Pekerjaan Tahap 1</label>
                                    <div className="col-sm-8">
                                        <input type="text" className="form-control" id="priceStep1" defaultValue="Rp. 1.000.000" disabled />
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="note" className="col-sm-4 col-form-label">Keterangan</label>
                                    <div className="col-sm-8">
                                        <textarea rows="4" cols="" className="form-control" id="note" disabled={loading || invoiceStatus} {...formik.getFieldProps('description')}>asdasd</textarea>
                                    </div>
                                    {(formik.touched.description && formik.errors.description) ? (
                                        <span className="col-sm-8 offset-sm-4 text-center text-danger" >
                                            {formik.errors.description}
                                        </span>
                                    ) : null}
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="upload" className="col-sm-4 col-form-label">Upload Invoice</label>
                                    <label htmlFor="upload" className="input-group mb-3 col-sm-8 pointer">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text"><i className="fas fa-file-upload"></i></span>
                                        </div>
                                        <span className="form-control">{invoiceData ? invoiceData['file_name'] : uploadFilename}</span>
                                    </label>
                                    {(formik.touched.file && formik.errors.file) ? (
                                        <span className="col-sm-8 offset-sm-4 text-center text-danger" >
                                            {formik.errors.file}
                                        </span>
                                    ) : null}
                                    <input type="file" className="d-none" id="upload" disabled={loading || invoiceStatus} onChange={(e => handleUpload(e))} />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group row">
                                    <label htmlFor="first" className="col-sm-4 col-form-label">Pihak Pertama</label>
                                    <div className="col-sm-8">
                                        <textarea rows="4" cols="" disabled className="form-control" id="first" defaultValue={contractData['full_data_party_1']}></textarea>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="second" className="col-sm-4 col-form-label">Pihak Kedua</label>
                                    <div className="col-sm-8">
                                        <textarea rows="4" cols="" disabled className="form-control" id="second" defaultValue={contractData['full_data_party_2']}></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardBody>
                    <CardFooter className="text-right">
                        <button type="submit" className="btn btn-primary mx-1" disabled={(formik.touched && !formik.isValid) || loading}>
                            Upload
                            {loading && <span className="spinner-border spinner-border-sm ml-1" aria-hidden="true"></span>}
                        </button>
                        <button type="button" className="btn btn-primary mx-1">Terima</button>
                        <button type="button" className="btn btn-danger mx-1">Tolak</button>
                    </CardFooter>
                </form>
            </Card>
        </React.Fragment>
    )
}
export default injectIntl(connect(null, null)(ItemContractInvoice));