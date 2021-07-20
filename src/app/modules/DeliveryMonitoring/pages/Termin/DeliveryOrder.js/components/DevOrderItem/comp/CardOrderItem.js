import { Divider } from "@material-ui/core";
import React from "react";
import ExpansionBox from "../../../../../../../../components/boxes/ExpansionBox";
import FormBuilder from "../../../../../../../../components/builder/FormBuilder";
import { formData2 } from "../formDataOItem";
import BtnApproveReject from "./BtnApproveReject";
import { FormattedMessage } from "react-intl";
import { rupiah } from "../../../../../../../../libs/currency";

// const componentStatus = [
//   { label: "REJECTED", class: "danger" },
//   { label: "APPROVED", class: "success" },
//   { label: "WAITING APPROVE", class: "dark" },
// ];

const handleReadOnly = (arr, state) => {
  let tempArr = [...arr[0]];
  tempArr.map((item) => {
    if (item.name === "qty_approved") item.readOnly = state;
  });

  return [tempArr, arr[1]];
};

const CardOrderItem = ({ data, options, setItem }) => {
  const formRef = React.useRef();
  const [componentIndex, setComponentIndex] = React.useState(2);
  const compUsed = options?.[componentIndex] ?? {};
  const [formDataUsed, setFormDataUsed] = React.useState(formData2);

  const handleChange = (state) => {
    setComponentIndex(state ? 1 : 0);

    const updateFormData = handleReadOnly(formDataUsed, !state);
    setFormDataUsed(updateFormData);

    if (!state) {
      formRef.current.setFieldValue("qty_approved", "0");
    }

    formRef.current.setFieldValue(
      "approve_status_id",
      options[state ? 1 : 0].id
    );

    formRef.current.setFieldValue(
      "approve_status",
      options[state ? 1 : 0].name
    );

    setTimeout(() => {
      getValue();
    }, 200);
  };

  const initValues = React.useMemo(
    () => ({
      qty_approved: data?.qty_approved || data.qty,
      reject_text: data?.reject_text || "",
      id: data?.id,
      approve_status_id: data?.approve_status_id,
      approve_status: data?.approve_status?.name,
    }),
    [data]
  );

  const getValue = () => {
    // console.log(`formRef`, formRef?.current?.values);
    if (setItem)
      setItem((prev) => ({
        ...prev,
        [formRef?.current?.values?.id]: formRef?.current?.values,
      }));
  };

  React.useEffect(() => {
    options.forEach((item, index) => {
      if (item.id === data.approve_status_id) {
        setComponentIndex(index);
        const state = index > 0 ? true : false;
        const updateFormData = handleReadOnly(formDataUsed, !state);
        setFormDataUsed(updateFormData);
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
        formData={formDataUsed}
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
        <BtnApproveReject
          onChange={handleChange}
          isActive={
            componentIndex === 1 ? true : componentIndex === 0 ? false : null
          }
        />
      </div>
    </ExpansionBox>
  );
};

export default CardOrderItem;
