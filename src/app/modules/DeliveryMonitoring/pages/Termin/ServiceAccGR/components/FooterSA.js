import _ from "lodash";
import React, { useMemo } from "react";
import { rupiah } from "../../../../../../libs/currency";
import RowAdditional from "./RowAdditional";

const getSubTotal = (data) => {
  if (_.isEmpty(data)) return 0;
  let subTotal = data.reduce((acc, el, id) => {
    return acc + parseInt(el?.net_value ?? 0);
  }, 0);
  // data.forEach((el) => (subTotal += el.net_value));
  return subTotal;
};

const getTotal = (subTotal = 0) => {
  // if (_.isEmpty(subTotal)) return 0;
  let ppn = parseFloat(10 / 100);
  let extra = parseFloat(subTotal * ppn);
  console.log(`subTotal`, subTotal, ppn, extra);
  return parseFloat(subTotal + extra);
};

const FooterSA = ({ data }) => {
  const subTotal = useMemo(() => getSubTotal(data), [data]);
  // const subTotal = getSubTotal(data);
  const total = useMemo(() => getTotal(subTotal), [subTotal]);
  // const total = getTotal(subTotal);

  return (
    <React.Fragment>
      <RowAdditional label={"Total value Excl. Tax"} value={rupiah(subTotal)} />
      <RowAdditional label={"VAT 10%"} value={`10%`} />
      <RowAdditional label={"Total value Inc. Tax"} value={rupiah(total)} />
    </React.Fragment>
  );
};

export default FooterSA;
