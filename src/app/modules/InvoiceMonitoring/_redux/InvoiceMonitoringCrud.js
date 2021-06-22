import axios from "axios";
import { DEV_NODE } from "../../../../redux/BaseHost";

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
export async function getContractClient(params) {
  return axios.get(`/invoice/contract_invoice${params ? "?" + params : ""}`);
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
export async function getAllApprovedSpp(id) {
  return axios.get(`/invoice/get_invoice_spr_approved/${id}`);
}
export const getFileSpp = `${DEV_NODE}/invoice/get_file_spp/`;
export const getFileBank = `${DEV_NODE}/invoice/get_file_bank/`;
export async function approveSpp(id, data) {
  return axios.post(`/invoice/invoice_spr_approved/${id}`, data);
}
export async function saveInvoice(data) {
  return axios.post(`/invoice/invoice_save/`, data);
}
export async function updateInvoice(id, data) {
  return axios.post(`/invoice/invoice_update/${id}`, data);
}
export async function getInvoice(contract_id, termin) {
  return axios.get(
    `/invoice/get_invoice?contract_id=${contract_id}&term=${termin}`
  );
}
export async function rejectInvoice(data) {
  return axios.post(`/invoice/invoice_rejected`, data);
}
export async function rejectInvoiceStatus(id) {
  return axios.post(`/invoice/invoice_status_rejected/${id}`);
}
export async function getAllRejectedInvoice(id) {
  return axios.get(`/invoice/get_all_invoice_rejected/${id}`);
}
export async function getAllApprovedInvoice(id) {
  return axios.get(`/invoice/get_invoice_approved/${id}`);
}
export const getFileInvoice = `${DEV_NODE}/invoice/get_file_invoice/`;
export async function approveInvoice(id, data) {
  return axios.post(`/invoice/invoice_approved/${id}`, data);
}
export async function saveReceipt(data) {
  return axios.post(`/invoice/invoice_receipt_save/`, data);
}
export async function updateReceipt(id, data) {
  return axios.post(`/invoice/invoice_receipt_update/${id}`, data);
}
export async function getReceipt(contract_id, termin) {
  return axios.get(
    `/invoice/get_invoice_receipt?contract_id=${contract_id}&term=${termin}`
  );
}
export async function rejectReceipt(data) {
  return axios.post(`/invoice/invoice_receipt_rejected`, data);
}
export async function rejectReceiptStatus(id) {
  return axios.post(`/invoice/invoice_receipt_status_rejected/${id}`);
}
export async function getAllRejectedReceipt(id) {
  return axios.get(`/invoice/get_all_invoice_receipt_rejected/${id}`);
}
export async function getAllApprovedReceipt(id) {
  return axios.get(`/invoice/get_invoice_receipt_approved/${id}`);
}
export const getFileReceipt = `${DEV_NODE}/invoice/get_file_receipt/`;
export async function approveReceipt(id, data) {
  return axios.post(`/invoice/invoice_approved/${id}`, data);
}
export async function saveTax(data) {
  return axios.post(`/invoice/invoice_tax_save/`, data);
}
export async function updateTax(id, data) {
  return axios.post(`/invoice/invoice_tax_update/${id}`, data);
}
export async function getTax(contract_id, termin) {
  return axios.get(
    `/invoice/get_tax_invoice?contract_id=${contract_id}&term=${termin}`
  );
}
export async function rejectTax(data) {
  return axios.post(`/invoice/invoice_tax_rejected`, data);
}
export async function rejectTaxStatus(id) {
  return axios.post(`/invoice/invoice_tax_status_rejected/${id}`);
}
export async function getAllRejectedTax(id) {
  return axios.get(`/invoice/get_all_invoice_tax_rejected/${id}`);
}
export async function getAllApprovedTax(id) {
  return axios.get(`/invoice/get_invoice_tax_approved/${id}`);
}
export const getFileTax = `${DEV_NODE}/invoice/get_file_tax/`;
export async function approveTax(id, data) {
  return axios.post(`/invoice/invoice_tax_approved/${id}`, data);
}
export async function getFile() {
  return axios.get(`/invoice/get_file`);
}

export async function getContractSoftCopy(id) {
  return axios.get(`/invoice/get_soft_copy/${id}`);
}

export async function getListSpt(params) {
  return axios.get(`/invoice/list_spt${params ? "?" + params : ""}`);
}
export async function getItemSpt(id) {
  return axios.get(`/invoice/get_spt/${id}`);
}
export async function getTermContract(id) {
  return axios.get(`/invoice/contract_all_term/${id}`);
}
export async function getDeliverableInInvoive(id) {
  return axios.get(`/delivery/task/${id}`);
}
export async function getAsyncSpt(data) {
  return axios.post(`/invoice/async_list_spt`, data);
}
