import axios from "axios";
import { DEV_NODE, DEV_RUBY, API_EPROC } from "../../../../redux/BaseHost";
export const LOGIN_URL = `${DEV_RUBY}/api/login`;
export const REGISTER_URL = "api/auth/register";
export const REQUEST_PASSWORD_URL = "api/auth/forgot-password";
export const FORGOT_PASSWORD_URL = `${DEV_RUBY}/api/password_resets?authn_token=&format=&username=none`;

export const ME_URL = `${DEV_NODE}/api/user_data_by_token`;

// const TEMP_URL = `http://geo.abdmandhan.com`;

// Document Type

export function getList() {
  return axios.get(`/delivery/document-type`);
}

export function getByID(id) {
  return axios.get(`/delivery/document-type?id=${id}`);
}

export function submitDoctypes(values, update) {
  if (update) {
    return axios.put(`/delivery/document-type/${update.id}`, values);
  }
  return axios.post(`/delivery/document-type`, values);
}

export function deleteDoctypes(id) {
  return axios.delete(`/delivery/document-type/${id}`);
}

// Periode

export function getPeriodeList() {
  return axios.get(`/delivery/periode`);
}

export function getPeriodeID(id) {
  return axios.get(`/delivery/periode?id=${id}`);
}

export function submitPeriode(values, update) {
  if (update) {
    return axios.put(`/delivery/periode/${update.id}`, values);
  }
  return axios.post(`/delivery/periode`, values);
}

export function deletePeriode(id) {
  return axios.delete(`/delivery/periode/${id}`);
}

// Document

export function getDocList() {
  return axios.get(`/delivery/options`);
}

export function getDocumentByType(id) {
  return axios.get(`/delivery/document?document_type_id=${id}`);
}

export function getDocumentID(id) {
  return axios.get(`/delivery/document?id=${id}`);
}

export function submitDocument(values, update) {
  if (update) {
    return axios.put(`/delivery/document/${update.id}`, values);
  }
  return axios.post(`/delivery/document`, values);
}

export function deleteDocument(id) {
  return axios.delete(`/delivery/document/${id}`);
}

// example from login

export function login(login, password) {
  return axios.post(LOGIN_URL, { data: { login, password } });
}

export function register(email, fullname, username, password) {
  return axios.post(REGISTER_URL, { email, fullname, username, password });
}

export function requestPassword(email) {
  return axios.post(REQUEST_PASSWORD_URL, { email });
}

export function getUserByToken() {
  // Authorization head should be fulfilled in interceptor.
  return axios.get(ME_URL);
}

export function forgotPassword(username) {
  return axios.post(FORGOT_PASSWORD_URL, { data: { login: username } });
}

// master data roles

export function getRolesBKB(plant) {
  return axios.get(`data/get_role_bkb?plant=${plant}`);
}

export function getRolesVerification(plant) {
  return axios.get(`data/get_role_verification?plant=${plant}`);
}

export function getRolesApproval(plant) {
  return axios.get(`data/get_role_approval?plant=${plant}`);
}

export function getRolesAcceptance(plant) {
  return axios.get(`data/get_role_acceptance?plant=${plant}`);
}

export function getRolesAcceptanceTax(plant) {
  return axios.get(`data/get_role_acceptance_tax?plant=${plant}`);
}

export function getRolesAccounting(plant) {
  return axios.get(`data/get_role_accounting?plant=${plant}`);
}

export function getRolesParkBYR(plant) {
  return axios.get(`data/get_role_park_byr?plant=${plant}`);
}

export function getRolesDelivery(plant) {
  return axios.get(`data/get_role_delivery?plant=${plant}`);
}

export function getRolesSignedGiro(plant) {
  return axios.get(`data/get_role_signed_giro?plant=${plant}`);
}

export function getRolesTerminAuthorization(plant) {
  return axios.get(`data/get_role_termin_authorization?plant=${plant}`);
}

export function getRolesAudit() {
  return axios.get(`data/get_role_audit?plant=Pusat`);
}

export function getRolesAdmin() {
  return axios.get(`data/get_role_admin?plant=Pusat`);
}

export function updateRoles(data) {
  return axios.post(`data/update_role/${data.id}`, data);
}

// Create By Jeffry Azhari Rosman || jeffryazhari@gmail.com

export function getSla(params) {
  return axios.get(`data/get_sla${params ? "?" + params : ""}`);
}

export function updateSla(id, data) {
  return axios.post(`data/update_sla/${id}`, data);
}

export function asyncService(po) {
  return axios.get(`sap/services/${po}`);
}

export function asyncSchedule(po) {
  return axios.get(`sap/schedules/${po}`);
}

export function asyncItem(po) {
  return axios.get(`sap/purch_order_item/${po}`);
}

export function getListEmail(params) {
  return axios.get(`data/list_email${params ? "?" + params : ""}`);
}

export function getEmail(id) {
  return axios.get(`data/get_email/${id}`);
}

export function getListSchedule() {
  return axios.get(`data/get_schedule`);
}

export function getListParameter() {
  return axios.get(`data/list_parameter_email`);
}

export function getListPurchGroup(params) {
  return axios.get(`data/purch_group${params ? "?" + params : ""}`);
}

export function updatePurchGroup(id, data) {
  return axios.post(`data/update_purch_group/${id}`, data);
}

export function getListEmailCc() {
  return axios.get(`data/list_email_cc`);
}

export function updateEmail(data) {
  return axios.post(`data/update_email`, data);
}

export function getListTax(params) {
  return axios.get(`data/get_tax${params ? "?" + params : ""}`);
}

export function createGroupTax(data) {
  return axios.post(`data/create_group_tax`, data);
}

export function editGroupTax(id, data) {
  return axios.post(`data/update_group_tax/${id}`, data);
}

export function createGroupTaxItem(data) {
  return axios.post(`data/create_group_tax_item`, data);
}

export function editGroupTaxItem(id, data) {
  return axios.post(`data/update_group_tax_item/${id}`, data);
}

export function getTaxItem(id, params) {
  return axios.get(`data/get_tax_by_id/${id}${params ? "?" + params : ""}`);
}

export function asyncHistory(po) {
  return axios.get(`sap/history/${po}`);
}

export function asyncPo(data) {
  return axios.post(API_EPROC + `/api/processor_get_po`, data);
}

// master data invoice periods

export function getInvoicePeriods() {
  return axios.get(`data/get_invoice_periods`);
}

export function updateInvoicePeriods(data) {
  return axios.post(`data/update_invoice_periods/${data.id}`, data);
}

// master data invoice authorty

export function getInvoiceAuthority(params) {
  return axios.get(`data/get_authority_value${params ? "?" + params : ""}`);
}
export function updateInvoiceAuthority(data) {
  return axios.post(`data/update_authority_value/${data.id}`, data);
}
