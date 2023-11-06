import axios from 'axios';
import { actionTypes } from './deliveryMonitoringAction';
// import { DEV_NODE, DEV_RUBY } from '../../../../redux/BaseHost';
export const URL = `http://172.18.1.112:3000/api/get-docs-deliverable/1/8000003554`;
const TEMP_URL = `http://geo.abdmandhan.com`;

export const setItems = (isService) => async (dispatch) => {
  try {
    const {
      data: { data },
    } = await axios.get(`${TEMP_URL}/delivery/item?is_service=${isService}`);

    if (isService) {
      data.forEach((item) => {
        item.show = false;
      });

      dispatch({
        type: actionTypes.SetDataJasa,
        payload: data,
      });
    } else {
      dispatch({
        type: actionTypes.SetDataBarang,
        payload: data,
      });
    }
  } catch (error) {
    window.console.error(error);
  }
};
