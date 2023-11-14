import axios from "axios";
// import { DEV_NODE, DEV_RUBY } from '../../../../redux/BaseHost';
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

export function submitGuarantee(params, contract_id) {
  return axios.post(`/adendum/add-contract-guarantee/${contract_id}`, params);
}

export function submitAccountNumber(params, contract_id) {
  return axios.post(
    `/adendum/add-contract-account-number/${contract_id}`,
    params
  );
}

export function submitOther(params, contract_id) {
  return axios.post(`/adendum/add-contract-other/${contract_id}`, params);
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
  // console.log(`api`, `delivery/task-document/${document_id}`);
  return axios.delete(`delivery/task-document/${document_id}`);
}
export async function acceptDocId(document_id) {
  // console.log(`api create`, `delivery/task-document/${document_id}`);
  return axios.post(`delivery/task-document/${document_id}/approve`);
}
export async function rejectDocId(document_id) {
  // console.log(`api`, `delivery/task-document/${document_id}`);
  return axios.post(`delivery/task-document/${document_id}/reject`);
}
export async function submitDocId(document_id) {
  // console.log(`api`, `delivery/task-document/${document_id}`);
  return axios.post(`delivery/task-document/${document_id}/submit`);
}
export async function postCreateDoc(task_id, params) {
  // console.log(`api post`, `delivery/task-document/${task_id}`, params);
  return axios.post(`delivery/task-document/${task_id}`, params);
}
export async function postCreateDocArr(task_id, documents) {
  // console.log(`api post`, `delivery/task-document-array/${task_id}`, documents);
  return axios.post(`delivery/task-document-array/${task_id}`, { documents });
}
export async function postUploadDoc(document_id, oldParams) {
  let params = new FormData();
  Object.keys(oldParams).forEach((element) => {
    params.append(element, oldParams[element]);
  });
  // console.log(`api post`, `delivery/task-document/${document_id}`, params);
  return axios.post(`delivery/task-document-upload/${document_id}`, params);
}

// Berita Acara
export async function postCreateBAPP({ url, ...params }) {
  // console.log(`params`, params, url);
  return axios.post(url, params);
}

// Jaminan
export async function uploadGuarantee(cont_id, oldParams) {
  let params = new FormData();
  Object.keys(oldParams).forEach((element) => {
    params.append(element, oldParams[element].data);
  });
  console.log(`params`, params);
  return axios.post(`delivery/contract/${cont_id}/upload-guarantee`, params);
}

// BAST
export async function postCreateBAST({ url, ...params }) {
  // console.log(`params`, params, url);
  return axios.post(url, params);
}
