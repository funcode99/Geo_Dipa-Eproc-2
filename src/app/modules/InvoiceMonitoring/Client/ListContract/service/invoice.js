import axios from 'axios';

export function getPicContract(data) {
    return axios.post(`/invoice/get_pic_contract/${data.id}`, data);
}
export function getPicVendor(id) {
    return axios.get(`/invoice/get_pic_vendor/${id}`);
}
export function checkEmail(email) {
    return axios.get(`/data/check_email?email=${email}`);
}
export function updateEmail(data) {
    return axios.post(`/invoice/update_email/${data.id}`, data);
}
export function requestUser(data) {
    return axios.post(`/invoice/request_users_email/`, data);
}
export function deleteUser(data) {
    return axios.post(`/invoice/delete_pic/`, data);
}
export function assignUser(data) {
    return axios.post(`/invoice/assign_pic/`, data);
}
export async function getContractSummary(id) {
    return axios.get(`/invoice/contract_invoice_sumary/${id}`);
}
export async function checkRole(id) {
    return axios.get(`/invoice/check_role/${id}`);
}
export async function getContractVendor(id) {
    return axios.get(`/invoice/contract_by_vendors/${id}`);
}
export async function saveInvoice(data) {
    return axios.post(`/invoice/contract_invoice_save/`, data);
}
export async function getInvoice(contract_id, termin) {
    return axios.get(`/invoice/get_invoice?contract_id=${contract_id}&term=${termin}`);
}