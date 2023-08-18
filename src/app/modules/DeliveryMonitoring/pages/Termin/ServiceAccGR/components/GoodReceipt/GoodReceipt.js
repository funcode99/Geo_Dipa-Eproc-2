import _ from "lodash";
import React from "react";
import NoDataBox from "../../../../../../../components/boxes/NoDataBox/NoDataBox";
import TablePaginationCustom from "../../../../../../../components/tables/TablePagination";
import { tblHeadGRItems } from "../../fieldData";
import DetailGR from "../DetailGR";
import GRAccord from "../GRAccord";
import DetailGoodRcpt from "./DetailGoodRcpt";

const GoodReceipt = ({ data, loading, isClient, showCancel = true }) => {
  const task_gr = data?.task_gr;
  const newsObj = data?.news;
  const task_gr_new = data?.task_gr_new;
  if (_.isEmpty(task_gr_new)) {
    return <NoDataBox text={"Good Receipt not Available"} />;
  }

  return (
    <div className={"mt-5"}>
      {task_gr_new.map((els, id) => (
        <GRAccord
            key={id}
            id={id}
            label={`GR ${els.type}`}
        >
          <>
            <DetailGoodRcpt
                id={id}
                news={newsObj}
              header={els?.gr_header}
              fullData={data}
              items={els?.gr_items}
              dataGR={els}
              isClient={isClient}
              showCancel={showCancel}
            />
          </>
        </GRAccord>
      ))}
    </div>
  );
};

export default GoodReceipt;
