import axios from "axios";
// import { DEV_NODE, DEV_RUBY } from '../../../../redux/BaseHost';
export const URL = `http://172.18.1.112:3000/api/get-docs-deliverable/1/8000003554`;

const TEMP_URL = `http://geo.abdmandhan.com`;

export function getDataContracts() {
  return axios.get(`/delivery/contract`);
}

export function getContractById(id) {
  return axios.get(`/delivery/contract?id=${id}`);
}

export function getAllItems(isService) {
  return axios.get(`${TEMP_URL}/delivery/item?is_service=${isService}`);
}

export function getTaskById(taskId) {
  return axios.get(`/delivery/task/${taskId}`);
}

export function submitItems(values, taskId) {
  return axios.post(`/delivery/task/${taskId}`, values);
}

export async function deleteDocId(document_id) {
  // console.log(`api`, `delivery/task-document/${document_id}`);
  return axios.delete(`delivery/task-document/${document_id}`);
}
export async function postCreateDoc(task_id, document_id) {
  // console.log(`api post`, `delivery/task-document/${task_id}`, document_id);
  return axios.post(`delivery/task-document/${task_id}`, { document_id });
}
export async function postUploadDoc(document_id, file) {
  let params = new FormData();
  params.append("file", file);
  // console.log(`api post`, `delivery/task-document/${document_id}`, params);
  return axios.post(`delivery/task-document-upload/${document_id}`, params);
}
