import React, { useState } from "react";
import FormBuilder from "../../../../../../components/builder/FormBuilder";
import DialogGlobal from "../../../../../../components/modals/DialogGlobal";
import { object } from "yup";
import validation from "../../../../../../service/helper/validationHelper";
import ButtonContained from "../../../../../../components/button/ButtonGlobal";

const ModalAddWBS = ({ innerRef }) => {
  const [dataForm, setDataForm] = useState([
    [
      {
        name: "wbs1",
        label: "WBS 1",
      },
      {
        name: "value1",
        label: "Value 1",
      },
    ],
  ]);
  const [validateScheme, setValidateScheme] = useState(
    object().shape({
      wbs1: validation.require("WBS 1"),
      value1: validation.require("Value 1"),
    })
  );

  const addField = () => {
    setDataForm((e) => [
      ...e,
      [
        {
          name: "wbs1",
          label: "WBS 1",
        },
        {
          name: "value1",
          label: "Value 1",
        },
      ],
    ]);
  };

  const _handleSubmit = () => {};

  return (
    <DialogGlobal
      title={`Add WBS`}
      ref={innerRef}
      onYes={_handleSubmit}
      textYes={"Kirim"}
    >
      <FormBuilder
        onSubmit={_handleSubmit}
        formData={dataForm}
        validation={validateScheme}
        withSubmit={false}
        // initial={initial}
      />
      <ButtonContained onClick={addField}>Add</ButtonContained>
    </DialogGlobal>
  );
};

export default ModalAddWBS;
