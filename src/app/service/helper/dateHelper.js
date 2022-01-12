export const dateNullable = (date) => {
  return date ? window.moment(new Date(date)).format("DD MMM YYYY") : "-";
};
export const dateToHourNullable = (date) => {
  return date ? window.moment(new Date(date)).format("HH:mm") : "-";
};
