import TitleField from "../../../../../../components/input/TitleField";

export const formData = [
  {
    name: "date",
    label: "Delivery Date",
    typeInput: "SelectDateInput",
  },
  {
    name: "item",
    label: "Item",
    typeInput: "SelectInputCustom",
    // isMulti: true,
  },
  {
    name: "qty",
    label: "Quantity",
    type: "number",
    step: 1,
    placeholder: 1,
    // min: 1,
  },
];
