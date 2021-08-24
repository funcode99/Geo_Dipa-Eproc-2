import axios from "axios";
import { DEV_NODE, API_EPROC, DEV_RUBY } from "../../../../redux/BaseHost";

export function getActivityPeriod() {
  return axios.get(`/invoice/get_activity_period`);
}

export function getActivities() {
  return axios.get(`/invoice/get_activities`);
}

export function getActivity(
  user_id,
  activity,
  period,
  date_start,
  date_finish
) {
  return axios.get(
    `/invoice/get_activity/${user_id}/${activity}/${period}/${date_start}/${date_finish}`
  );
}

export function getTodoByUser(user_id) {
  return axios.get(`/invoice/get_todo/${user_id}`);
}
