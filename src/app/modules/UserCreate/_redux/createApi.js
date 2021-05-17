import axios from "axios";
import { DEV_NODE, DEV_NEW_NODE } from '../../../../redux/BaseHost' 
export const GET_ALL_CONTRACT_VENDOR = `${DEV_NODE}/api/getAllContractVendor/e0d36fd1-aeb6-4d3d-ac07-0fa09dc18089`;
export const GET_ALL_USER = `${DEV_NEW_NODE}/regist/get_users/`;
export const CREATE_NEW_USER = `${DEV_NEW_NODE}/regist/create_users/`;
export const CHECK_USERNAME = `${DEV_NEW_NODE}/regist/check_username?username=`;
export const CHECK_TOKEN = `${DEV_NEW_NODE}/regist/get_token_value/`;

export async function getContract() {
  return axios.get(GET_ALL_CONTRACT_VENDOR);
}
export async function getAllUser() {
  return axios.get(GET_ALL_USER);
}
export async function createNewUser(data) {
  return axios.post(CREATE_NEW_USER, data);
}
export async function checkUsername(username) {
  return axios.get(CHECK_USERNAME + username);
}
export async function checkToken(data) {
  return axios.post(CHECK_TOKEN, data);
}
