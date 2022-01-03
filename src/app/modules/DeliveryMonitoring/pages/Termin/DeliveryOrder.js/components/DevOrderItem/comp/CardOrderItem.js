import { Divider } from "@material-ui/core";
import React from "react";
import { FormattedMessage } from "react-intl";
import ExpansionBox from "../../../../../../../../components/boxes/ExpansionBox";
import FormBuilder from "../../../../../../../../components/builder/FormBuilder";
import { rupiah } from "../../../../../../../../libs/currency";
import { formData2 } from "../formDataOItem";
import BtnApproveReject from "./BtnApproveReject";

// const componentStatus = [
//   { label: "REJECTED", class: "danger" },
//   { label: "APPROVED", class: "success" },
//   { label: "WAITING APPROVE", class: "dark" },
// ];

const handleReadOnly = (arr, inputName = "all", state) => {
  let tempArr = [...arr[0]];
  let tempArr2 = [...arr[1]];

  if (inputName === "all") {
    tempArr.map((item) => (item.readOnly = state));
    tempArr2.map((item) => (item.readOnly = state));
  } else {
    tempArr.map((item) => {
      if (item.name === inputName) return (item.readOnly = state);
    });
    tempArr2.map((item) => {
      if (item.name === inputName) return (item.readOnly = state);
    });
  }

  return [tempArr, tempArr2];
};

const CardOrderItem = ({ data, options, setItem, isVendor }) => {
  const formRef = React.useRef();
  const [componentIndex, setComponentIndex] = React.useState(2);
  const compUsed = options?.[componentIndex] ?? {};
  const [formDataUsed, setFormDataUsed] = React.useState(formData2);
  const hasMaterialNo = data?.item?.product;

  const handleChange = (state) => {
    setComponentIndex(state ? 1 : 0);

    const updateFormData = handleReadOnly(formDataUsed, "qty_approved", !state);
    setFormDataUsed(updateFormData);

    const notEmpty =
      formRef?.current?.values?.qty_approved &&
      formRef?.current?.values?.qty_approved > 0
        ? formRef?.current?.values?.qty_approved
        : false;

    if (state)
      formRef.current.setFieldValue(
        "qty_approved",
        notEmpty || (data?.qty_approved ?? data?.qty)
      );
    if (!state) formRef.current.setFieldValue("qty_approved", "0");

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
      spec: data?.specification,
      desc: data?.item?.product?.desc,
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
        const updateFormData = handleReadOnly(
          formDataUsed,
          "qty_approved",
          !state
        );
        setFormDataUsed(updateFormData);
      }
    });

    if (isVendor) {
      const updateFormData = handleReadOnly(formDataUsed, "all", true);
      setFormDataUsed(updateFormData);
    } else {
      const updateFormData = handleReadOnly(formDataUsed, "spec", false);
      setFormDataUsed(updateFormData);
    }
  }, [data]);

  return (
    <ExpansionBox
      key={data?.id}
      custTitle={`${data?.item?.desc}${
        hasMaterialNo ? " - " + parseInt(data?.item?.product?.code) : ""
      }`}
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
      {/* <Divider /> */}
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
          readOnly={isVendor}
        />
      </div>
    </ExpansionBox>
  );
};

export default CardOrderItem;
