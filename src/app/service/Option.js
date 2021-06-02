import axios from 'axios';
import { DEV_NODE, DEV_RUBY } from '../../redux/BaseHost';
export const LOGIN_URL = `${DEV_RUBY}/api/login`;
export const REGISTER_URL = 'api/auth/register';
export const REQUEST_PASSWORD_URL = 'api/auth/forgot-password';
export const FORGOT_PASSWORD_URL = `${DEV_RUBY}/api/password_resets?authn_token=&format=&username=none`;

export const ME_URL = `${DEV_NODE}/api/user_data_by_token`;

// const TEMP_URL = `http://geo.abdmandhan.com`;

export function getAllOptions() {
  return axios.get(`/delivery/options`);
}

export function getDocTypeOptions() {
  return axios.get(`/delivery/options`);
}

export function getDocByTypeOptions(id) {
  return axios.get(`/delivery/document?document_type_id=${id}`);
}

export function getPeriodByDocTypeOptions() {
  return axios.get(`/delivery/periode`);
}
