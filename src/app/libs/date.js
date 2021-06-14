import { format } from "date-fns";

const formatDate = (date) => {
  return format(date, "d MMM yyy");
};

const formatInitialDate = () => {
  return format(new Date(), "yyy-MM-dd");
};

export { formatDate, formatInitialDate };
