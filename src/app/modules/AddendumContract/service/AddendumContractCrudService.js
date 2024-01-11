import { Header } from "_metronic/layout/components/header/Header";
import axios from "axios";
// import { DEV_NODE, DEV_RUBY } from '../../../../redux/BaseHost';
import store from "redux/store";
const {
  auth: { authToken },
} = store.getState();

export const URL = `http://172.18.1.112:3000/api/get-docs-deliverable/1/8000003554`;
const TEMP_URL = `http://geo.abdmandhan.com`;

export function dataBanksById() {
  return "ini kembalian dari data banks by id";
}

export function getDataContracts() {
  return axios.get(`/delivery/contract`);
}

export function getContractById(id) {
  return axios.get(`/delivery/contract/${id}`);
}

export function getAddendumContractById(id) {
  return axios.get(`/adendum/contract-released/${id}/show`);
}

export function submitAddendumRequest(params) {
  return axios.post(`/adendum/add-contracts`, params);
}

export function submitParties(params, contract_id) {
  return axios.post(`/adendum/add-contract-party/${contract_id}`, params);
}

export function submitJobPrice(params, contract_id) {
  return axios.post(`/adendum/add-contract-items/${contract_id}`, params);
}

export function submitTimePeriod(params, contract_id) {
  return axios.post(`/adendum/add-contract-time-period/${contract_id}`, params);
}

export function submitPaymentMethod(params, contract_id) {
  return axios.post(
    `/adendum/add-contract-payment-method/${contract_id}`,
    params
  );
}

export function submitFine(params, contract_id) {
  return axios.post(`/adendum/add-contract-fine/${contract_id}`, params);
}

export async function submitGuarantee(params, contract_id) {
  const res = await axios.post(
    `/adendum/add-contract-guarantee/${contract_id}`,
    params
    // {
    //   headers: {
    //     "Content-Type": "multipart/form-data",
    //   },
    // }
  );
  // res.json();
}

export function submitAccountNumber(params, contract_id) {
  return axios.post(
    `/adendum/add-contract-account-number/${contract_id}`,
    params
  );
}
// `/adendum/add-contracts/${contract_id}/submitted`,

export function submitOther(params, contract_id) {
  return axios.post(`/adendum/add-contract-other/${contract_id}`, params);
}

// api 3.9
export function submitGenerateTemplate(params) {
  return axios.post(`/adendum/drafting-adendum`, params);
}
// api 3.10
export function submitTemplateKlausul(params) {
  return axios.post(`/adendum/link-review`, params);
}
// api 4.4
export function submitAddContractUserReviewer(params) {
  return axios.post(`/adendum/review/user-reviewer`, params);
}

// api 4.5
export function deleteReviewerUser(id) {
  return axios.post(`/adendum/review/delete-user-reviewer/${id}`);
}
// api 4.7
export function submitAddContractVendorReviewer(params) {
  return axios.post(`/adendum/review/send-email-vendor`, params);
}

// api 4.8
export function deleteReviewerVendor(id) {
  return axios.post(`/adendum/review/delete-vendor-reviewer/${id}`);
}
// api 4.9
export function sendEmailAllReviewer(contract_id) {
  return axios.post(`/adendum/review/send-email/${contract_id}`);
}
// api 4.11
export function submitAddContractFinalDraft(params) {
  return axios.post(`/adendum/final-draft`, params);
}
// api 5.1
export function submitUpdateContractApprovedVendor(params, contract_id) {
  return axios.post(`/adendum/approved-vendor/${contract_id}/update`, params);
}
// api 5.2
export function submitUpdateContractApprovedUser(params, contract_id) {
  return axios.post(`/adendum/approved-user/${contract_id}/update`, params);
}
// api 6.1
export function submitContractDustribution(params) {
  return axios.post(`/adendum/distribution/contract-distribution`, params);
}
// api 6.4
export function submitContractUserDustribution(params) {
  return axios.post(`/adendum/distribution/user-distribution`, params);
}
// api 6.5
export function submitContractVendorDustribution(params) {
  return axios.post(`/adendum/distribution/vendor-distribution`, params);
}
// api 6.6
export function deleteContractUserDistribution(id) {
  return axios.post(`/adendum/distribution/delete-user-distribution/${id}`);
}
// api 6.7
export function deleteContractVendorDistribution(id) {
  return axios.post(`/adendum/distribution/delete-vendor-distribution/${id}`);
}
// api 6.8
export function sendEmailAllDistribution(contract_id) {
  return axios.post(`/adendum/distribution/send-email/${contract_id}`);
}
export function resetSupportDocument(contract_id) {
  return axios.post(`/adendum/add-contracts/${contract_id}/reset-document`);
}

// export function uploadSuppDoc(params, contract_id) {
//   return axios.post(
//     `/adendum/add-contracts/${contract_id}/submitted`,
//     params
//   );
// }

export function uploadSuppDoc(params, contract_id) {
  return axios.post(`/adendum/add-contracts/${contract_id}/submitted`, params);
}

export function draftSuppDoc(params, contract_id) {
  return axios.post(`/adendum/add-contracts/${contract_id}/save-draft`, params);
}

export function uploadSuppDoc2(params, contract_id) {
  return axios.post(`/adendum/add-contracts/${contract_id}/submitted2`, params);
}

export function draftSuppDoc2(params, contract_id) {
  return axios.post(
    `/adendum/add-contracts/${contract_id}/save-draft2`,
    params
  );
}

export function approveAddendumContract(contract_id) {
  return axios.post(`/adendum/add-contracts/${contract_id}/approved`);
}

export function rejectAddendumContract(contract_id) {
  return axios.post(`/adendum/add-contracts/${contract_id}/rejected`);
}

// Tasks
export function submitTask(values, update) {
  if (update) {
    return axios.put(`/delivery/task/${update.id}`, values);
  }
  return axios.post(`/delivery/task-item`, values);
}

export function deleteTask(id) {
  return axios.delete(`/delivery/task/${id}`);
}

// Task Item
export function getTaskById(taskId) {
  return axios.get(`/delivery/task/${taskId}`);
}

export function submitItems(values, taskId) {
  return axios.post(`/delivery/task/${taskId}`, values);
}

// Task Delivery Item
export function postDeliveryItem(type, id, values) {
  switch (type) {
    case "create":
      return axios.post(`/delivery/task-delivery/${id}`, values);

    case "delete":
      return axios.delete(`/delivery/task-delivery/${id}`);

    case "update":
      return axios.put(`/delivery/task-delivery/${id}`, values);

    case "delivery_order_status":
      return axios.post(`delivery/task-delivery/${id}/status`, values);

    default:
      break;
  }
}

// Task Document
export async function deleteDocId(document_id) {
  return axios.delete(`delivery/task-document/${document_id}`);
}
export async function acceptDocId(document_id) {
  return axios.post(`delivery/task-document/${document_id}/approve`);
}
export async function rejectDocId(document_id) {
  return axios.post(`delivery/task-document/${document_id}/reject`);
}
export async function submitDocId(document_id) {
  return axios.post(`delivery/task-document/${document_id}/submit`);
}
export async function postCreateDoc(task_id, params) {
  return axios.post(`delivery/task-document/${task_id}`, params);
}
export async function postCreateDocArr(task_id, documents) {
  return axios.post(`delivery/task-document-array/${task_id}`, { documents });
}
export async function postUploadDoc(document_id, oldParams) {
  let params = new FormData();
  Object.keys(oldParams).forEach((element) => {
    params.append(element, oldParams[element]);
  });
  return axios.post(`delivery/task-document-upload/${document_id}`, params);
}

// Berita Acara
export async function postCreateBAPP({ url, ...params }) {
  return axios.post(url, params);
}

// Jaminan
export async function uploadGuarantee(cont_id, oldParams) {
  let params = new FormData();
  Object.keys(oldParams).forEach((element) => {
    params.append(element, oldParams[element].data);
  });
  return axios.post(`delivery/contract/${cont_id}/upload-guarantee`, params);
}

// BAST
export async function postCreateBAST({ url, ...params }) {
  return axios.post(url, params);
}
