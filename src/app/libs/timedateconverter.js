import moment from "moment";

export const countdownConverter = (start, end) => {
  let endDate = moment(end);
  const timeBetween = moment.duration(endDate.diff(start));
  let month = timeBetween.months();
  let day = timeBetween.days();
  return [month, day];
};
