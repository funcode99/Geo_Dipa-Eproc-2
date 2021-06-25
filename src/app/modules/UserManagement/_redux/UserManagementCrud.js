import axios from "axios";
// import { DEV_NODE } from '../../../../redux/BaseHost' 

export async function getBuyers() {
  return axios.get(`/management/get_buyers`);
}
export async function getRoles(authority) {
  return axios.get(`/management/get_roles?authority=${authority}`);
}

