import { Container } from "@material-ui/core";
import React from "react";
import { toAbsoluteUrl } from "../../../../../_metronic/_helpers";
import TempMobile from "../../../../components/templates/TempMobile/TempMobile";
import useStatusOption from "../../../../service/hooks/useStatusOption";
import DevOrderItem from "../Termin/DeliveryOrder.js/components/DevOrderItem";
import CardOrderItem from "../Termin/DeliveryOrder.js/components/DevOrderItem/comp/CardOrderItem";

const DeliveryOrderStatusPg = () => {
  const { approveOption } = useStatusOption();

  console.log(`approveOption`, approveOption);
  return (
    <TempMobile withLogo title={"Delivery Order Status Approval"}>
      <div>DOSPg</div>
      <CardOrderItem options={approveOption || []} data={{ qty_approved: 2 }} />
      <CardOrderItem options={approveOption || []} data={{ qty_approved: 2 }} />
      <CardOrderItem options={approveOption || []} data={{ qty_approved: 2 }} />
      {/* <DevOrderItem
        data={dataOrderItem}
        options={approveOption}
        // setItem={setItemForm}
        // handleAction={handleAction}
        // handleSubmit={() => handleAction("confirm", null)}
      /> */}
    </TempMobile>
  );
};

export default DeliveryOrderStatusPg;
