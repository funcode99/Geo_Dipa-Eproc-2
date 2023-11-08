import React from "react";
import moment from "moment";

export const countdownMonths = (start, end) => {
  let endDate = moment(end);
  const timeBetween = moment.duration(endDate.diff(start));
  return (
    <>
      <p className="counter">
        <span>
          {isNaN(timeBetween.months()) ? 0 : timeBetween.months()} Bulan{" "}
        </span>
        <span>{isNaN(timeBetween.days()) ? 0 : timeBetween.days()} Hari </span>
      </p>
    </>
  );
};
