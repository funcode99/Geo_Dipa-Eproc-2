import { format } from "date-fns";

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
  return format(new Date(date), "yyy-MM-dd");
};

const formatSADate = (date) => {
  return format(new Date(date), "dd.MM.yyyy");
};

export {
  formatDate,
  formatInitialDate,
  formatUpdateDate,
  formatDateWTime,
  formatSADate,
};
