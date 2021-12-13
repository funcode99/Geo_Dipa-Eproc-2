import React from "react";

const SectionTable = () => {
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
      <tr>
        <td>3476896</td>
        <td>My first HTML</td>
        <td>$53</td>
        <td>3476896</td>
        <td>My first HTML</td>
        <td>$53</td>
      </tr>
      <tr>
        <td colSpan="4">Important</td>
        <td>
          <div className="d-flex flex-column">
            <span>Total Value Excl. Fax</span>
            <span>VAT 10%</span>
            <span>Total Value Inc. Fax</span>
          </div>
        </td>
        <td>
          <div className="d-flex flex-column">
            <span>15.000</span>
            <span>1.500</span>
            <span>16.300</span>
          </div>
        </td>
      </tr>
    </table>
  );
  return (
    <table className="table table-bordered">
      <colgroup>
        <col width="50px" />
        <col />
        <col width="50px" />
        <col width="50px" />
        <col width="100px" />
        <col width="100px" />
      </colgroup>
      <tr>
        <th className="td-15 text-center">Line</th>
        <th className="td-15 text-center">Service</th>
        <th className="td-15 text-center">Quantity</th>
        <th className="td-15 text-center">UoM</th>
        <th className="td-15 text-center">Unit Price</th>
        <th className="td-15 text-center">Net Value</th>
      </tr>
      <tr>
        <td>cona</td>
        <td>cona</td>
        <td>cona</td>
        <td>cona</td>
        <td>cona</td>
        <td>cona</td>
      </tr>
    </table>
  );
};

export default SectionTable;
