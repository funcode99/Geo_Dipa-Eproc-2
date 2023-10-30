import React, { useMemo, useState } from "react";
import FormBuilder from "../../../../../../components/builder/FormBuilder";
import DialogGlobal from "../../../../../../components/modals/DialogGlobal";
import { object } from "yup";
import validation from "../../../../../../service/helper/validationHelper";
import ButtonContained from "../../../../../../components/button/ButtonGlobal";
import { FormSAContext } from "./FormSA";
import _ from "lodash";

const ModalAddWBS = ({ innerRef, onSelected, dist_value, data }) => {
  const formRef = React.useRef();
  const { listWBS } = React.useContext(FormSAContext);
  console.log(`dist_value`, dist_value);

  const [dataForm, setDataForm] = useState([
    [
      {
        name: "wbs1",
        label: "WBS 1",
        typeInput: "SelectInputCustom",
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
      wbs1: validation.require("WBS"),
      value1: validation.require("Value"),
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
            typeInput: "SelectInputCustom",
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

        return e.length < 10
          ? index === e.length - 1
            ? [...acc, item, newData]
            : [...acc, item]
          : e;
      }, [])
    );
  };
  const initial = useMemo(() => {
    if (_.isEmpty(data)) return {};
    return data?.reduce((acc, el, idx, arr) => {
      const index = idx + 1;
      if (index > 1) addField();
      return {
        ...acc,
        [`wbs${index}`]: { value: el.name, label: el.name, wbs_id: el.name,},
        [`value${index}`]: el.value,
      };
    }, {});
  }, [data]);
  const subField = () => {
    setDataForm((e) => {
      var arr = [...e];
      var poped = [];
      if (arr.length > 1) poped = arr.pop();
      // console.log(`poped`, poped, arr);
      return arr;
    });
  };

  const _handleSubmit = (data) => {
    const wbs1 = data["wbs1"];
    const value1 = data["value1"];

    if(!wbs1 || !value1) return;

    if (typeof onSelected == "function")
      onSelected({ ...data, length: dataForm.length });
    _cleanSubmit();
  };

  const _cleanSubmit = () => {
    // onBlur();
    innerRef.current.close();
    setDataForm([
      [
        {
          name: "wbs1",
          label: "WBS 1",
          typeInput: "SelectInputCustom",
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
  };

  const listWBSMapped = listWBS.map(({ id, work_breakdown_ap }) => ({
    value: id,
    label: work_breakdown_ap,
  }));

  return (
    <DialogGlobal
      title={`Add WBS`}
      ref={innerRef}
      onYes={() => formRef.current.handleSubmit()}
      textYes={"Kirim"}
      isCancel={false}
      maxWidth={"md"}
    >
      <FormBuilder
        ref={formRef}
        onSubmit={_handleSubmit}
        formData={dataForm}
        initial={initial}
        validation={validateScheme}
        withSubmit={false}
        fieldProps={{
          listOptions: {
            wbs1: listWBS.map(({ id, work_breakdown_ap, name }) => ({
              value: id,
              label: `${work_breakdown_ap} - ${name}`,
              wbs_id: work_breakdown_ap,
            })),
            wbs2: listWBSMapped,
            wbs3: listWBSMapped,
            wbs4: listWBSMapped,
            wbs5: listWBSMapped,
            wbs6: listWBSMapped,
            wbs7: listWBSMapped,
            wbs8: listWBSMapped,
            wbs9: listWBSMapped,
            wbs10: listWBSMapped,
          },
        }}
      />

      <div className="d-flex justify-content-end">
        {dataForm.length > 1 && (
          <ButtonContained
            className="mr-2"
            baseColor="danger"
            disabled={dataForm.length === 1}
            onClick={subField}
          >
            Minus a row
          </ButtonContained>
        )}
        {!(dataForm.length == 10 || dist_value?.value === "") && (
          <ButtonContained
            disabled={dataForm.length == 10 || dist_value?.value === ""}
            baseColor="success"
            onClick={addField}
          >
            Add a row
          </ButtonContained>
        )}
      </div>
    </DialogGlobal>
  );
};

export default ModalAddWBS;
