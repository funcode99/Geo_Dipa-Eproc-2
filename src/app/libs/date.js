import { format } from "date-fns";
import { isEmpty } from "lodash";

const formatDate = (date) => {
  return format(date, "d MMM yyy");
};

const formatDateWTime = (date) => {
  return format(date, "d MMM yyy pp");
  // return
};

const formatInitialDate = () => {
  return format(new Date(), "yyy-MM-dd");
};

const formatUpdateDate = (date) => {
  // console.log("date", date);
  if (isEmpty(date)) return "-";
  return format(new Date(date), "yyy-MM-dd");
};

const formatSADate = (date) => {
  if (isEmpty(date)) return "-";
  return format(new Date(date), "dd.MM.yyyy");
};

export {
  formatDate,
  formatInitialDate,
  formatUpdateDate,
  formatDateWTime,
  formatSADate,
};
