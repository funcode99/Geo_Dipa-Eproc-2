import { format } from 'date-fns';

const formatDate = (date) => {
  const formatedDate = format(date, 'd MMM yyy');

  return formatedDate;
};

export default formatDate;
