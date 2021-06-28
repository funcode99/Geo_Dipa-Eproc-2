import { format } from "date-fns";

const formatDate = (date) => {
  return format(date, "d MMM yyy");
};

const formatInitialDate = () => {
  return format(new Date(), "yyy-MM-dd");
};

const formatUpdateDate = (date) => {
  return format(new Date(date), "yyy-MM-dd");
};

export { formatDate, formatInitialDate, formatUpdateDate };
