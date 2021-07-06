import { Divider } from "@material-ui/core";
import React from "react";
import { Card } from "react-bootstrap";
import ExpansionBox from "../../../../../../../../components/boxes/ExpansionBox";
import FormBuilder from "../../../../../../../../components/builder/FormBuilder";
import { formData2, formData3 } from "../formDataOItem";
import BtnApproveReject from "./BtnApproveReject";

const componentStatus = [
  { label: "REJECTED", class: "danger" },
  { label: "APPROVED", class: "success" },
  { label: "WAITING APPROVE", class: "dark" },
];

const CardOrderItem = ({ data }) => {
  const [componentIndex, setComponentIndex] = React.useState(2);
  const compUsed = componentStatus[componentIndex];
  const handleChange = (state) => {
    setComponentIndex(state ? 1 : 0);
  };
  //   console.log(`item`, data);
  return (
    <ExpansionBox
      custTitle={data?.item?.desc}
      defaultExpanded={false}
      //   classCont={"col-12"}
      rightComponent={
        <span className="navi-text">
          <span className={`label label-inline label-light-${compUsed.class}`}>
            {compUsed.label}
          </span>
        </span>
      }
    >
      <Divider />
      <div className="d-flex justify-content-between mt-3">
        <span>Quantity Total {data?.item?.qty}</span>
        <span>Rp. {data?.item?.unit_price}</span>
      </div>
      <FormBuilder withSubmit={false} formData={formData2} />
      <Divider />
      <div>
        <BtnApproveReject onChange={handleChange} />
      </div>
    </ExpansionBox>
  );
};

export default CardOrderItem;
