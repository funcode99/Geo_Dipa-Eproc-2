import axios from "axios";
// import { DEV_NODE, DEV_RUBY } from '../../../../redux/BaseHost';
export const URL = `http://172.18.1.112:3000/api/get-docs-deliverable/1/8000003554`;

const TEMP_URL = `http://geo.abdmandhan.com`;

export function getDataContracts() {
  return axios.get(`/delivery/contract`);
}

export function getContractById(id) {
  return axios.get(`/delivery/contract/${id}`);
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
export function addDeliveryItem(values, taskId) {
  return axios.post(`/delivery/task-delivery/${taskId}`, values);
}

export function deleteDeliveryItem(itemId) {
  return axios.delete(`/delivery/task-delivery/${itemId}`);
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

// BAST
export async function postCreateBAST({ url, ...params }) {
  // console.log(`params`, params, url);
  return axios.post(url, params);
}
