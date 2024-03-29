import axios from "axios";
import { DEV_NODE, API_EPROC, DEV_RUBY } from "redux/BaseHost";

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
export async function getContractSummary(contract_id, term_id) {
  return axios.get(
    `/invoice/contract_invoice_sumary?contract_id=${contract_id}&term_id=${term_id}`
  );
}
export async function checkRole(id) {
  return axios.get(`/invoice/check_role/${id}`);
}
export async function getContractMainFinance(params) {
  return axios.get(
    `/invoice/contract_main_finance${params ? "?" + params : ""}`
  );
}
export async function getContractUnitFinance(id, params) {
  return axios.get(
    `/invoice/contract_unit_finance/${id}${params ? "?" + params : ""}`
  );
}
export async function getContractUser(id, params) {
  return axios.get(`/invoice/contract_user/${id}${params ? "?" + params : ""}`);
}
export async function getContractVendor(id, params) {
  return axios.get(
    `/invoice/contract_by_vendors/${id}${params ? "?" + params : ""}`
  );
}
export async function getContractPic(id, params) {
  return axios.get(
    `/invoice/contract_by_pic/${id}${params ? "?" + params : ""}`
  );
}
export async function getBillingDocumentId(name) {
  return axios.get(`/invoice/get_document_billing?ident_name=${name}`);
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
  return axios.post(`/invoice/invoice_receipt_approved/${id}`, data);
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
export async function getContractDistributionSPK(id) {
  return axios.get(`${API_EPROC}/api/contract_approved_vendor/${id}`);
}
export async function getContractDistributionAgreement(id) {
  return axios.get(`${API_EPROC}/api/contract_approved_user/${id}`);
}
export async function getFileEproc(data) {
  return axios.post(`${API_EPROC}/api/get_file`, data);
}

export async function getFileRuby(fileName) {
  return axios.get(`${DEV_RUBY + fileName}`);
}

export async function rejectDocId(document_id, remarks_status) {
  return axios.post(`delivery/task-document/${document_id}/reject`, {
    remarks_status,
  });
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
export async function getSaGr(term) {
  return axios.get(`/delivery/task/${term}/sa-gr`);
}
export async function getAsyncSpt(data) {
  return axios.post(`/invoice/async_list_spt`, data);
}
export async function getListDocSoftCopy(contractId, termId, type) {
  return axios.get(
    `/invoice/get_soft_copy_support?contract_id=${contractId}&term_id=${termId}&type=${type}`
  );
}
export async function getDetailDocSoftCopy(contractId, termId) {
  return axios.get(`/invoice/get_soft_copy/${contractId}/${termId}`);
}
export async function sendApprovedDocSoftCopy(id, data) {
  return axios.post(`/invoice/softcopy_approved/${id}`, data);
}
export async function softcopy_save(data) {
  return axios.post(`/invoice/softcopy_save`, data);
}
export async function sendRejectedDocSoftCopyLast(data) {
  return axios.post(`/invoice/softcopy_rejected_save`, data);
}
export async function sendAddRejectedDocSoftCopy(
  document_monitoring_id,
  created_by_id
) {
  return axios.post(
    `/invoice/softcopy_rejected_status/${document_monitoring_id}`,
    { created_by_id }
  );
}
export async function sendRejectSoftCopyStatus(id, data) {
  return axios.post(`/invoice/softcopy_rejected/${id}`, data);
}
export async function sendApprovedDocSoftCopyLast(id, data) {
  return axios.post(`/invoice/softcopy_approved/${id}`, data);
}

export async function getContractAuthority(id) {
  return axios.get(`/invoice/get_contract_authority/${id}`);
}
export async function createContractAuthority(data) {
  return axios.post(`/invoice/create_contract_authority/`, data);
}
export async function updateContractAuthority(data) {
  return axios.post(`/invoice/update_contract_authority/`, data);
}

export async function createBkb(data) {
  return axios.post(`/invoice/bkb_save/`, data);
}
export async function getBkb(id) {
  return axios.get(`/invoice/get_bkb/${id}`);
}
export async function getInvoiceProgress(termId) {
  return axios.get(`/invoice/invoice_progress/${termId}`);
}
export async function tax_manager_approve_bkb(
    id,
    tax_man_approved_id,
    term_id,
    desc
) {
  return axios.post(`/invoice/tax_manager_approve_bkb`, {
    id,
    tax_man_approved_id,
    term_id,
    desc,
  });
}
export async function finance_manager_approve_bkb(
    id,
    finance_man_approved_id,
    term_id,
    desc
) {
  return axios.post(`/invoice/finance_manager_approve_bkb`, {
    id,
    finance_man_approved_id,
    term_id,
    desc,
  });
}
export async function finance_director_approve_bkb(
    id,
    finance_director_approved_id,
    term_id,
    desc
) {
  return axios.post(`/invoice/finance_director_approve_bkb`, {
    id,
    finance_director_approved_id,
    term_id,
    desc,
  });
}
export async function approveBkb(data) {
  return axios.post(`/invoice/approve_bkb`, data);
}
export async function rejectBkb(data) {
  return axios.post(`/invoice/reject_bkb`, data);
}
export async function approveGiro(data) {
  return axios.post(`/invoice/approve_giro`, data);
}
export async function updateSoftCopyByUser(id, file) {
  return axios.post(`/invoice/softcopy_update/${id}`, file);
}
export async function sendNotifSoftCopySupportDeliverables(id, data) {
  return axios.post(`/invoice/softcopy_notif/${id}`, data);
}
export async function sendNotifSoftCopyRequest(data) {
  return axios.post(`/invoice/softcopy_send_request_notif/`, data);
}
export async function getListTax(contract_id, term_id) {
  return axios.get(`/invoice/get_tax_selected/${contract_id}/${term_id}`);
}
export async function approveHardCopy(id, data) {
  return axios.post(`/invoice/hardcopy_approved/${id}`, data);
}
export async function rejectHardCopyStatus(id, data) {
  return axios.post(`/invoice/hardcopy_rejected/${id}`, data);
}
export async function rejectHardCopyHistory(data) {
  return axios.post(`/invoice/hardtcopy_rejected_save/`, data);
}
export async function getHardcopyBillingDocument(id) {
  return axios.get(`/invoice/get_hardcopy_billing_document/${id}`);
}
export async function sendNotifHardCopy(data) {
  return axios.post(`/invoice/hardcopy_notif/`, data);
}
export async function checkBkbExist(id) {
  return axios.get(`/invoice/check_bkb_exist/${id}`);
}
export async function getTerminProgress(id) {
  return axios.get(`/invoice/get_invoice_progress/${id}`);
}
export async function createTerminProgress(data) {
  return axios.post(`/invoice/invoice_progress_save/`, data);
}
export async function updateTerminProgressToTax(data) {
  return axios.post(`/invoice/update_invoice_progress_to_tax/`, data);
}
export async function getProgressTypes() {
  return axios.get(`/invoice/get_all_progress_types/`);
}
export async function getRoutingSlip(id) {
  return axios.get(`/invoice/get_routing_slip/${id}`);
}
export async function getListMismatch(contract_id, term) {
  return axios.get(`invoice/get_mismatch_list/${contract_id}/${term}`);
}
export async function getListMailTo() {
  return axios.get(`invoice/get_mail_to`);
}
export async function saveMismatch(data) {
  return axios.post(`invoice/save_mismatch`, data);
}
export async function getMismatchNotCompleted(contract_id, term_id) {
  return axios.get(`invoice/mismatch-not-completed/${contract_id}/${term_id}`);
}
export async function submitParkAP(data) {
  return axios.post(`invoice/park_ap_submit`, data);
}
export async function approveParkAP(data) {
  return axios.post(`invoice/park_ap_approve`, data);
}
export async function rejectParkAP(data) {
  return axios.post(`invoice/park_ap_reject`, data);
}
export async function updateParkAP(data) {
  return axios.post(`invoice/park_ap_update`, data);
}
export async function submitParkBYR(data) {
  return axios.post(`invoice/park_byr_submit`, data);
}
export async function approveParkBYR(data) {
  return axios.post(`invoice/park_byr_approve`, data);
}
export async function rejectParkBYR(data) {
  return axios.post(`invoice/park_byr_reject`, data);
}
export async function updateParkBYR(data) {
  return axios.post(`invoice/park_byr_update`, data);
}
export async function approveInvPosting(data) {
  return axios.post(`invoice/inv_posting_approved`, data);
}
export async function getAllMismatch(params) {
  return axios.get(`invoice/mismatch_all${params ? "?" + params : ""}`);
}
export async function getAllBkb(params, plant, user_id, is_finance) {
  return axios.get(`invoice/get_all_bkb?plant=${plant}&is_finance=${is_finance}&user_id=${user_id}${params ? "&" + params : ""}`);
}
export async function getAllInvoice(params, plant, user_id, is_finance) {
  return axios.get(`invoice/get_invoice_list?plant=${plant}&is_finance=${is_finance}&user_id=${user_id}${params ? "&" + params : ""}`);
}
export async function getAllInvoiceVendor(params, vendor_id, main_vendor, user_id) {
  return axios.get(`invoice/get_invoice_list_vendor?vendor_id=${vendor_id}&main_vendor=${main_vendor}&user_id=${user_id}${params ? "&" + params : ""}`);
}
export async function getAllPlant() {
  return axios.get(`invoice/get_dashboard_plant`);
}
export async function getAllPeriod() {
  return axios.get(`invoice/get_dashboard_period`);
}
export async function getAllDataInvoiceDashboard(
  period,
  plant,
  date_start,
  date_finish
) {
  return axios.get(
    `invoice/get_dashboard/${plant}/${period}/${date_start}/${date_finish}`
  );
}
export async function getTerminPaid(id) {
  return axios.get(`invoice/get_invoice_paid/${id}`);
}
export async function createTerminPaid(data) {
  return axios.post(`invoice/create_invoice_paid/`, data);
}
export async function updateTerminPaid(data) {
  return axios.post(`invoice/update_invoice_paid/`, data);
}
export async function getAllProgressTypeFilter() {
  return axios.get(`invoice/get_all_progress_filter/`);
}
export async function getAllProgressTypeGroup() {
  return axios.get(`invoice/get_all_progress_type_groups/`);
}
export async function getTerminProgressVendor(id) {
  return axios.get(`invoice/get_invoice_progress_vendor/${id}`);
}
export async function getTaxVendor(contract_id, term_id) {
  return axios.get(`invoice/invoice_tax_vendor/${contract_id}/${term_id}`);
}
export async function syncTaxVendor() {
  return axios.put(`tax/update_all_vendor_tax`);
}
export async function synchBkbByNo(data) {
  return axios.post(`sap/progress_bkb`, data);
}
export async function approveParkBYRNew(data) {
  return axios.post(`invoice/giro_data_submit`, data);
}
export async function uploadProofOfPayment(spt_header_id, data) {
  return axios.post(`invoice/insert_paid_date/${spt_header_id}`, data);
}
