import axios from 'axios';
import { DEV_NODE, DEV_RUBY } from '../../../../redux/BaseHost';
export const LOGIN_URL = `${DEV_RUBY}/api/login`;
export const REGISTER_URL = 'api/auth/register';
export const REQUEST_PASSWORD_URL = 'api/auth/forgot-password';
export const FORGOT_PASSWORD_URL = `${DEV_RUBY}/api/password_resets?authn_token=&format=&username=none`;

export const ME_URL = `${DEV_NODE}/api/user_data_by_token`;

const TEMP_URL = `http://geo.abdmandhan.com`;

export function getList() {
  return axios.get(`${TEMP_URL}/delivery/document-type`);
}

export function getByID(id) {
  return axios.get(`${TEMP_URL}/delivery/document-type?id=${id}`);
}

export function submitDoctypes(values, update) {
  if (update) {
    return axios.put(`${TEMP_URL}/delivery/document-type/${update.id}`, values);
  }
  return axios.post(`${TEMP_URL}/delivery/document-type`, values);
}

export function deleteDoctypes(id) {
  return axios.delete(`${TEMP_URL}/delivery/document-type/${id}`);
}

export function login(login, password) {
  return axios.post(LOGIN_URL, { data: { login, password } });
}

export function register(email, fullname, username, password) {
  return axios.post(REGISTER_URL, { email, fullname, username, password });
}

export function requestPassword(email) {
  return axios.post(REQUEST_PASSWORD_URL, { email });
}

export function getUserByToken() {
  // Authorization head should be fulfilled in interceptor.
  return axios.get(ME_URL);
}

export function forgotPassword(username) {
  return axios.post(FORGOT_PASSWORD_URL, { data: { login: username } });
}
