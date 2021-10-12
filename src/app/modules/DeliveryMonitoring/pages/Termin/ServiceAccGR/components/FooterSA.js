import React from "react";
import { rupiah } from "../../../../../../libs/currency";
import RowAdditional from "./RowAdditional";

const getSubTotal = (data) => {
  let subTotal = data.reduce((acc, el, id) => {
    return acc + parseInt(el?.net_value ?? 0);
  }, 0);
  // data.forEach((el) => (subTotal += el.net_value));
  return subTotal;
};

const getTotal = (subTotal) => {
  let ppn = parseFloat(10 / 100);
  let extra = parseFloat(subTotal * ppn);
  return parseFloat(subTotal + extra);
};

const FooterSA = ({ data }) => {
  // console.log(`data task_sa`, data);
  const subTotal = getSubTotal(data);
  const total = getTotal(subTotal);

  return (
    <React.Fragment>
      <RowAdditional label={"Subtotal"} value={rupiah(subTotal)} />
      <RowAdditional label={"PPN 10%"} value={`10%`} />
      <RowAdditional label={"Total"} value={rupiah(total)} />
    </React.Fragment>
  );
};

export default FooterSA;
