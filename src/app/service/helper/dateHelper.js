import { isEmpty } from "lodash";

export const dateNullable = (date) => {
  return date ? window.moment(new Date(date)).format("DD MMM YYYY") : "-";
};
export const dateToHourNullable = (date) => {
  return date ? window.moment(new Date(date)).format("HH:mm") : "-";
};
export const getDuration = (date) => {
  if (!date) return "-";
  var duration = window.moment.duration(date, "milliseconds");
  var days = parseFloat(duration.asDays()).toFixed(0);
  //   var hour = parseFloat(duration.asHours()).toFixed(0) - days * 24;
  return `${days} hari`;
};
