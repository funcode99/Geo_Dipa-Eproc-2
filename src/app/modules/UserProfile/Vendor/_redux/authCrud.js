import axios from "axios";
export const UPDATE_PROFILE = `/api/update_personnel/`;
export const UPDATE_PASSWORD = `/api/user/users/current_user/update_password`;

export function updateProfile(id, data) {
  return axios.post(UPDATE_PROFILE + id, data);
}
export function updatePassword(params, data) {
  return axios.put(UPDATE_PASSWORD + params, { data });
}

export async function getVendors(params) {
  return axios.get(`/management/get_vendors${params ? "?" + params : ""}`);
}
export async function getContractByPic(pic_id) {
  return axios.get(`/management/get_contract_by_pic/${pic_id}`);
}
export async function assignPic(data) {
  return axios.post(`/management/assign_pic/`, data);
}
export async function getContractVendor(id, params) {
  return axios.get(
    `/invoice/contract_by_vendors/${id}${params ? "?" + params : ""}`
  );
}
