import React, { useMemo } from "react";
import { rupiah } from "../../../../../../../../libs/currency";
import _ from "lodash";

const SectionTable2 = ({ items }) => {
  const subTotal = useMemo(() => getSubTotal(items), [items]);
  const total = useMemo(() => getTotal(subTotal), [subTotal]);
  return (
    <table className="table table-bordered">
      {/* <colgroup>
        <col width="50px" />
        <col />
        <col width="50px" />
        <col width="50px" />
        <col width="180px" />
        <col width="180px" />
      </colgroup> */}
      <tr>
        <th className="text-center">Line</th>
        <th className="text-center">Material Number</th>
        <th className="text-center">Description</th>
        <th className="text-center">Order Qty</th>
        <th className="text-center">Rcvd Qty</th>
        <th className="text-center">UoM</th>
        <th className="text-center">SLoc</th>
        <th className="text-center">Stor Bin</th>
      </tr>
      {items?.map((el, id) => (
        <tr key={id}>
          <td>{el?.line_id}</td>
          <td>{parseInt(el?.material) || "-"}</td>
          <td>{el?.item_text}</td>
          <td>{el?.po_pr_qnt}</td>
          <td>{el?.entry_qnt}</td>
          <td>{el?.entry_uom}</td>
          <td>{el?.stge_loc}</td>
          <td>{""}</td>
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
      {/* <tr>
        <td colSpan="4">Important</td>
        <td>
          <div className="d-flex flex-column">
            <span>Total Value Excl. Fax</span>
            <span>VAT 11%</span>
            <span>Total Value Inc. Fax</span>
          </div>
        </td>
        <td colSpan="3">
          <div className="d-flex flex-column">
            <span>{rupiah(subTotal)}</span>
            <span>{"11%"}</span>
            <span>{rupiah(total)}</span>
          </div>
        </td>
      </tr> */}
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

export default SectionTable2;
