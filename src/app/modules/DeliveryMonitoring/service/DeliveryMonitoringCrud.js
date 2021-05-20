import axios from 'axios';
// import { DEV_NODE, DEV_RUBY } from '../../../../redux/BaseHost';
export const URL = `http://172.18.1.112:3000/api/get-docs-deliverable/1/8000003554`;

const TEMP_URL = `http://geo.abdmandhan.com`;

export function getDataContracts() {
  return axios.get(`${TEMP_URL}/delivery/contract`);
}

export function getContractById(id) {
  return axios.get(`${TEMP_URL}/delivery/contract?id=${id}`);
}

export function getAllItems(isService) {
  return axios.get(`${TEMP_URL}/delivery/item?is_service=${isService}`);
}
