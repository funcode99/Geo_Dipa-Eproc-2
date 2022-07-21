import React, { useMemo } from "react";
import { rupiah } from "../../../../../../../../libs/currency";
import _ from "lodash";

const SectionTable = ({ items }) => {
  const subTotal = useMemo(() => getSubTotal(items), [items]);
  const total = useMemo(() => getTotal(subTotal), [subTotal]);
  return (
    <table className="table table-bordered">
      <colgroup>
        <col width="50px" />
        <col />
        <col width="50px" />
        <col width="50px" />
        <col width="180px" />
        <col width="180px" />
      </colgroup>
      <tr>
        <th className="text-center">Line</th>
        <th className="text-center">Service</th>
        <th className="text-center">Quantity</th>
        <th className="text-center">UoM</th>
        <th className="text-center">Unit Price</th>
        <th className="text-center">Net Value</th>
      </tr>
      {items?.map((el, id) => (
        <tr key={id}>
          <td>{id + 1}</td>
          <td>{el?.short_text}</td>
          <td>{el?.quantity}</td>
          <td>{el?.base_uom}</td>
          <td>{rupiah(el?.gr_price)}</td>
          <td>{rupiah(el?.net_value)}</td>
        </tr>
      ))}
      {/* <tr>
        <td>3476896</td>
        <td>My first HTML</td>
        <td>$53</td>
        <td>3476896</td>
        <td>My first HTML</td>
        <td>$53</td>
      </tr> */}
      <tr>
        <td colSpan="4">Important</td>
        <td>
          <div className="d-flex flex-column">
            <span>Total Value Excl. Fax</span>
            <span>Tax 11%</span>
            <span>Total Value Inc. Fax</span>
          </div>
        </td>
        <td>
          <div className="d-flex flex-column">
            <span>{rupiah(subTotal)}</span>
            <span>{rupiah(subTotal * 0.11)}</span>
            <span>{rupiah(total)}</span>
          </div>
        </td>
      </tr>
    </table>
  );
};

const getSubTotal = (data) => {
  if (_.isEmpty(data)) return 0;
  let subTotal = data?.reduce((acc, el, id) => {
    return acc + parseInt(el?.net_value ?? 0);
  }, 0);
  // data.forEach((el) => (subTotal += el.net_value));
  return subTotal;
};

const getTotal = (subTotal = 0) => {
  // if (_.isEmpty(subTotal)) return 0;
  let ppn = parseFloat(11 / 100);
  let extra = parseFloat(subTotal * ppn);
  // console.log(`subTotal`, subTotal, ppn, extra);
  return parseFloat(subTotal + extra);
};

export default SectionTable;
