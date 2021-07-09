import { Divider } from "@material-ui/core";
import React from "react";
// import { Card } from "react-bootstrap";
import ExpansionBox from "../../../../../../../../components/boxes/ExpansionBox";
import FormBuilder from "../../../../../../../../components/builder/FormBuilder";
import {
  formData2,
  // formData3
} from "../formDataOItem";
import BtnApproveReject from "./BtnApproveReject";
import { FormattedMessage } from "react-intl";
import { rupiah } from "../../../../../../../../libs/currency";
// import { connect } from "react-redux";
// import { actionTypes } from "../../../../../../_redux/deliveryMonitoringAction";
// import { DeliveryOrderContext } from "../../../DeliveryOrder";

// const componentStatus = [
//   { label: "REJECTED", class: "danger" },
//   { label: "APPROVED", class: "success" },
//   { label: "WAITING APPROVE", class: "dark" },
// ];

const CardOrderItem = ({ data, options, setItem }) => {
  const formRef = React.useRef();
  const [componentIndex, setComponentIndex] = React.useState(2);
  const compUsed = options[componentIndex];

  const handleChange = (state) => {
    setComponentIndex(state ? 1 : 0);

    formRef.current.setFieldValue("approve_status_id", options[state].id);

    formRef.current.setFieldValue("approve_status", options[state].name);

    setTimeout(() => {
      getValue();
    }, 200);
  };

  const initValues = React.useMemo(
    () => ({
      qty_approved: data?.qty_approved || "0",
      reject_text: data?.reject_text || "",
      id: data?.id,
      approve_status_id: data?.approve_status_id,
      approve_status: data?.approve_status?.name,
    }),
    [data]
  );

  const getValue = () => {
    // console.log(`formRef`, formRef?.current?.values);
    setItem((prev) => ({
      ...prev,
      [formRef?.current?.values?.id]: formRef?.current?.values,
    }));
  };

  React.useEffect(() => {
    options.forEach((item, index) => {
      if (item.id === data.approve_status_id) {
        setComponentIndex(index);
      }
    });
  }, [data]);

  return (
    <ExpansionBox
      custTitle={data?.item?.desc}
      defaultExpanded={false}
      //   classCont={"col-12"}
      rightComponent={
        <span className="navi-text">
          <span className={`label label-inline label-light-${compUsed.class}`}>
            {compUsed.name}
          </span>
        </span>
      }
    >
      <Divider />
      <div className="d-flex justify-content-between mt-3">
        <span>
          <FormattedMessage id="TITLE.QUANTITY_TOTAL" /> {data?.qty}
        </span>
        <span>{rupiah(data?.item?.unit_price)}</span>
      </div>
      <FormBuilder
        ref={formRef}
        withSubmit={false}
        formData={formData2}
        initial={initValues}
        fieldProps={{
          onBlur: () => {
            // console.log("blur");
            getValue();
          },
        }}
      />
      <Divider />
      <div>
        <BtnApproveReject onChange={handleChange} />
      </div>
    </ExpansionBox>
  );
};

export default CardOrderItem;
