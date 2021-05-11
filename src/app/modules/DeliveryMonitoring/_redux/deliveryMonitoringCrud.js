import axios from "axios";
import { actionTypes } from "./deliveryMonitoringAction";
// import { DEV_NODE, DEV_RUBY } from '../../../../redux/BaseHost';
export const URL = `http://172.18.1.112:3000/api/get-docs-deliverable/1/8000003554`;

export function tes() {
  return axios.get(URL);
}

export const setDataContracts = () => (dispatch) => {
  axios.get(`http://geo.abdmandhan.com/delivery/contract`)
  .then(result => {
      const dataResponseAPI = result.data.data;
      dispatch({type: actionTypes.SetDataContracts, payload: dataResponseAPI})
  })
  .catch(err => {
      console.log('error: ', err)
  })
};