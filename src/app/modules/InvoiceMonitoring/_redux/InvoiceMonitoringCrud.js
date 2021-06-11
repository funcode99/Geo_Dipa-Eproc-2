import axios from "axios";

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
export async function getContractClient() {
  return axios.get(`/invoice/contract_invoice/`);
}
export async function getContractVendor(id) {
  return axios.get(`/invoice/contract_by_vendors/${id}`);
}
export async function saveSpp(data) {
  // axios.defaults.headers.post['Content-Type'] = 'multipart/form-data'
  return axios.post(`/invoice/invoice_spr_save/`, data);
}
export async function updateSpp(id, data) {
  return axios.post(`/invoice/invoice_spr_update/${id}`, data);
}
export async function getSpp(contract_id, termin) {
  return axios.get(
    `/invoice/get_invoice_spr?contract_id=${contract_id}&term=${termin}`
  );
}
export async function rejectSpp(data) {
  return axios.post(`/invoice/invoice_spr_rejected`, data);
}
export async function rejectSppStatus(id) {
  return axios.post(`/invoice/invoice_spr_status_rejected/${id}`);
}
export async function getAllRejectedSpp(id) {
  return axios.get(`/invoice/get_all_invoice_spr_rejected/${id}`);
}
export const getFileSpp = '/invoice/get_file_spp/'
export async function approveSpp(id, data) {
  return axios.post(`/invoice/invoice_spr_approved/${id}`, data);
}
export async function saveInvoice(data) {
  return axios.post(`/invoice/invoice_save/`, data);
}
export async function getInvoice(contract_id, termin) {
  return axios.get(
    `/invoice/get_invoice?contract_id=${contract_id}&term=${termin}`
  );
}
export async function getFile() {
  return axios.get(`/invoice/get_file`);
}

export async function getListSpt(params) {
  return axios.get(`/invoice/list_spt${params ? "?" + params : ""}`);
}
export async function getItemSpt(id) {
  return axios.get(`/invoice/get_spt/${id}`);
}
