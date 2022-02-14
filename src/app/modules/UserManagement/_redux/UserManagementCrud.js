import axios from "axios";
// import { DEV_NODE } from '../../../../redux/BaseHost'

// User Management
export async function getBuyers(params) {
  return axios.get(`/management/get_buyers${params ? "?" + params : ""}`);
}
export async function getRoles(authority) {
  return axios.get(`/management/get_roles?authority=${authority}`);
}
export async function assignBuyers(data) {
  return axios.post(`/management/assign_buyer`, data);
}

// Pic Management
export async function getVendors(params) {
  return axios.get(`/management/get_vendors${params ? "?" + params : ""}`);
}
export async function getContractByPic(pic_id) {
  return axios.get(`/management/get_contract_by_pic/${pic_id}`);
}
export async function assignPic(data) {
  return axios.post(`/management/assign_pic/`, data);
}
