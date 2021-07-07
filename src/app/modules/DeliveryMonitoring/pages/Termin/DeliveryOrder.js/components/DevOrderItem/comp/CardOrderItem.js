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
import { connect } from "react-redux";
import { actionTypes } from "../../../../../../_redux/deliveryMonitoringAction";
import { DeliveryOrderContext } from "../../../DeliveryOrder";

// const componentStatus = [
//   { label: "REJECTED", class: "danger" },
//   { label: "APPROVED", class: "success" },
//   { label: "WAITING APPROVE", class: "dark" },
// ];

const CardOrderItem = ({ data, updateOrderItems, setUpdateOrderItems }) => {
  const { options } = React.useContext(DeliveryOrderContext);
  const formRef = React.useRef();

  console.log(`data`, data);
  console.log(`options`, options);

  const [componentIndex, setComponentIndex] = React.useState(0);
  // const [inputValues, setInputValues] = React.useState({
  //   qty_approved: data?.qty_approved || 0,
  //   reject_text: data?.reject_text || "",
  //   approve_status_id: "",
  // });

  const compUsed = options[componentIndex];

  const handleChange = (state) => {
    setComponentIndex(state ? 1 : 2);
  };

  const values = React.useMemo(
    () => ({
      qty_approved: data?.qty_approved || "0",
      reject_text: data?.reject_text || "",
    }),
    [data]
  );

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
        initial={values}
      />
      <Divider />
      <div>
        <BtnApproveReject onChange={handleChange} />
      </div>
    </ExpansionBox>
  );
};

const mapState = ({ deliveryMonitoring }) => ({
  updateOrderItems: deliveryMonitoring.dataUpdateOrderItems,
});

const mapDispatch = (dispatch) => ({
  setUpdateOrderItems: (payload) => {
    dispatch({
      type: actionTypes.SetDataUpdateOrderItems,
      payload: payload,
    });
  },
});

export default connect(mapState, mapDispatch)(CardOrderItem);
