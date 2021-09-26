import React, { useState } from "react";
import FormBuilder from "../../../../../../components/builder/FormBuilder";
import DialogGlobal from "../../../../../../components/modals/DialogGlobal";
import { object } from "yup";
import validation from "../../../../../../service/helper/validationHelper";
import ButtonContained from "../../../../../../components/button/ButtonGlobal";

const ModalAddWBS = ({ innerRef, onSelected }) => {
  const formRef = React.useRef();
  const [dataForm, setDataForm] = useState([
    [
      {
        name: "wbs1",
        label: "WBS 1",
      },
      {
        name: "value1",
        label: "Value 1",
        type: "number",
        size: "sm",
        min: "0.1",
        step: "0.1",
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
    setDataForm((e) =>
      e.reduce((acc, item, index) => {
        let newIndex = index + 2;
        let newData = [
          {
            name: "wbs" + newIndex,
            label: "WBS " + newIndex,
          },
          {
            name: "value" + newIndex,
            label: "Value " + newIndex,
            type: "number",
            size: "sm",
            min: "0.1",
            step: "0.1",
          },
        ];

        return index === e.length - 1
          ? [...acc, item, newData]
          : [...acc, item];
      }, [])
    );
  };

  const subField = () => {
    setDataForm((e) => {
      var arr = [...e];
      var poped = [];
      if (arr.length > 1) poped = arr.pop();
      console.log(`poped`, poped, arr);
      return arr;
    });
  };

  const _handleSubmit = (data) => {
    console.log(`data`, data);
    if (typeof onSelected == "function") onSelected(data);
  };

  // console.log(`ref`, formRef.current.handleSubmit());

  return (
    <DialogGlobal
      title={`Add WBS`}
      ref={innerRef}
      onYes={() => formRef.current.handleSubmit()}
      textYes={"Kirim"}
      isCancel={false}
    >
      <FormBuilder
        ref={formRef}
        onSubmit={_handleSubmit}
        formData={dataForm}
        // validation={validateScheme}
        withSubmit={false}
      />

      <div className="d-flex justify-content-end">
        <ButtonContained
          className="mr-2"
          baseColor="danger"
          disabled={dataForm.length === 1}
          onClick={subField}
        >
          Minus a row
        </ButtonContained>
        <ButtonContained baseColor="success" onClick={addField}>
          Add a row
        </ButtonContained>
      </div>
    </DialogGlobal>
  );
};

export default ModalAddWBS;
