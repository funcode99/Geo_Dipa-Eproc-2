import React, { useCallback, useEffect, useMemo, useState } from "react";
import FormBuilder from "../../../../../../components/builder/FormBuilder";
import DialogGlobal from "../../../../../../components/modals/DialogGlobal";
import { object } from "yup";
import validation from "../../../../../../service/helper/validationHelper";
import ButtonContained from "../../../../../../components/button/ButtonGlobal";
import { FormSAContext } from "./FormSA";
import _ from "lodash";

const ModalAddWBS = ({ wbs, innerRef, onSelected, dist_value, data }) => {
  const maxRows = 10;
  const formRef = React.useRef();
  // const { listWBS } = React.useContext(FormSAContext);

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

  const [validateScheme, setValidateScheme] = useState({
    wbs1: validation.require("WBS 1"),
    value1: validation.require("Value 1"),
  });

  const addField = () => {
    const validate = {};
    const indexRow = dataForm.length + 1;

    let form = [
      {
        name: `wbs${indexRow}`,
        label: `WBS ${indexRow}`,
        typeInput: "SelectInputCustom",
      },
      {
        name: `value${indexRow}`,
        label: `Value ${indexRow}`,
        type: "number",
        size: "sm",
        min: "0.1",
        step: "0.1",
      },
    ];

    validate[`wbs${indexRow}`] = validation.require(`WBS ${indexRow}`);
    validate[`value${indexRow}`] = validation.require(`Value ${indexRow}`);

    if (indexRow <= maxRows) {
      setDataForm([...dataForm, form]);
      setValidateScheme({ ...validateScheme, ...validate });
    }
  };

  const initial = useMemo(() => {
    if (_.isEmpty(data)) return {};

    const initialValues = {};

    // console.log({ listWBS, data }, "modal data props");

    data.forEach((item, i) => {
      const indexRow = i + 1;

      const lookup = wbs?.find(
        (wbs) => item?.name === wbs?.work_breakdown_ap
      );
      initialValues[`wbs${indexRow}`] = {
        value: item.name,
        label: `${lookup?.work_breakdown_ap} - ${lookup?.name}`,
        // label: item.name,
        wbs_id: item.name,
      };
      initialValues[`value${indexRow}`] = item.value;
    });

    return initialValues;
  }, [data, wbs]);

  const subField = () => {
    setDataForm((e) => {
      const arr = [...e];
      if (arr.length > 1) {
        arr.pop();
        const newValidateScheme = {};

        arr.forEach((row, index) => {
          newValidateScheme[`wbs${index + 1}`] = validation.require(
            `WBS ${index + 1}`
          );
          newValidateScheme[`value${index + 1}`] = validation.require(
            `Value ${index + 1}`
          );
        });
        setValidateScheme(newValidateScheme); // Update the validation scheme
      }
      return arr;
    });
  };

  const _handleSubmit = (data) => {
    if (typeof onSelected == "function") {
      onSelected({ ...data, length: dataForm.length });

      innerRef.current.close();
    }
  };

  const _initModal = () => {
    if (_.isEmpty(data)) return;

    const rowsToAdd = data.length - dataForm.length;
    const newValidateScheme = {};
    if (rowsToAdd > 0) {
      const newRows = Array.from({ length: rowsToAdd }, (_, index) => {
        const indexRow = dataForm.length + index + 1;
        return [
          {
            name: `wbs${indexRow}`,
            label: `WBS ${indexRow}`,
            typeInput: "SelectInputCustom",
          },
          {
            name: `value${indexRow}`,
            label: `Value ${indexRow}`,
            type: "number",
            size: "sm",
            min: "0.1",
            step: "0.1",
          },
        ];
      });

      setDataForm([...dataForm, ...newRows]);

      for (let i = 0; i <= rowsToAdd; i++) {
        newValidateScheme[`wbs${i + 1}`] = validation.require(`WBS ${i + 1}`);
        newValidateScheme[`value${i + 1}`] = validation.require(
          `Value ${i + 1}`
        );
      }
      setValidateScheme({ ...validateScheme, ...newValidateScheme });
    }
  };

  useEffect(_initModal, [data]);

  const listWBSMapped = wbs?.map(({ id, work_breakdown_ap, name }) => ({
    value: id,
    label: `${work_breakdown_ap} - ${name}`,
    wbs_id: work_breakdown_ap,
  }));

  console.log({wbs});

  return (
    <DialogGlobal
      title={`Add WBS`}
      ref={innerRef}
      onYes={() => formRef.current.handleSubmit()}
      textYes={"Kirim"}
      isCancel={false}
      maxWidth={"md"}
    >
      {/* // validation={validateScheme} */}
      <FormBuilder
        ref={formRef}
        onSubmit={_handleSubmit}
        formData={dataForm}
        initial={initial}
        validation={object().shape(validateScheme)}
        withSubmit={false}
        fieldProps={{
          listOptions: {
            wbs1: listWBSMapped,
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
      {/* untuk menambah dan mengurangi row */}
      <div className="d-flex justify-content-end">
        {dataForm.length > 1 && 
          (
            <ButtonContained
              className="mr-2"
              baseColor="danger"
              disabled={dataForm.length === 1}
              onClick={subField}
            >
              Minus a row
            </ButtonContained>
          )
        }
        {!(dataForm.length === 10 || dist_value?.value === "") && (
          <ButtonContained
            className="mr-2"
            baseColor="danger"
            disabled={dataForm.length === 1}
            onClick={subField}
          >
            Minus a row
          </ButtonContained>
        )}
        {!(dataForm.length === maxRows || dist_value?.value === "") && (
          <ButtonContained
            disabled={dataForm.length === maxRows || dist_value?.value === ""}
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
