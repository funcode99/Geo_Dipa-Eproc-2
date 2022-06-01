import React, { useState, useCallback, useEffect, useMemo } from "react";
import FormBuilder from "../../../../../../components/builder/FormBuilder";
import DialogGlobal from "../../../../../../components/modals/DialogGlobal";

const ModalStorageLoc = ({ innerRef, items, options, onSubmit }) => {
  const formRef = React.useRef();
  const [dataForm, setDataForm] = useState([]);
  // [
  //   {
  // 	name: "item1",
  // 	label: "WBS 1",
  // 	disable: true,
  //   },
  //   {
  // 	name: "stge_loc_1",
  // 	label: "Storage Location 1",
  // 	typeInput: "SelectInputCustom",
  // 	isMulti: true,
  //   },
  // ],

  const _handleSubmit = useCallback(
    (data) => {
      const dataNew = items?.reduce(
        (acc, item, index) => [
          ...acc,
          {
            id: item?.id,
            stge_loc: data?.[`stge_loc_${index + 1}`]?.name,
            label: `Item ${index + 1} (${
              data?.[`stge_loc_${index + 1}`]?.name
            })`,
            value: data?.[`stge_loc_${index + 1}`]?.name,
          },
        ],
        []
      );
      innerRef.current.close();
      onSubmit(dataNew);
    },
    [items, onSubmit]
  );

  const initialForm = useCallback(() => {
    setDataForm((e) =>
      items.map((item, index) => {
        let newIndex = index + 1;
        let newData = [
          {
            name: "item" + newIndex,
            label: "Item" + newIndex,
            disabled: true,
          },
          {
            name: "stge_loc_" + newIndex,
            label: "Storage Location " + newIndex,
            typeInput: "SelectInputCustom",
          },
        ];
        return newData;
      })
    );
  }, [items]);

  useEffect(() => {
    if (items?.length > 0) initialForm();
  }, [items]);

  const mappedOptions = useMemo(
    () =>
      options?.map((el) => ({
        ...el,
        value: el?.id,
        label: el?.name,
      })),
    [options]
  );

  const initial = useMemo(
    () =>
      items?.reduce(
        (acc, item, index) => ({
          ...acc,
          [`item${index + 1}`]: item?.item?.desc,
          [`stge_loc_${index + 1}`]: {
            value: item?.stge_loc,
            label: item?.stge_loc,
          },
        }),
        {}
      ),
    [items]
  );

  return (
    <DialogGlobal
      title={`Edit Storage Location`}
      ref={innerRef}
      onYes={() => formRef.current.handleSubmit()}
      textYes={"Simpan"}
      isCancel={false}
      maxWidth={"md"}
    >
      <FormBuilder
        ref={formRef}
        onSubmit={_handleSubmit}
        formData={dataForm}
        initial={initial}
        // validation={validateScheme}
        withSubmit={false}
        fieldProps={{
          listOptions: {
            stge_loc_1: mappedOptions,
            stge_loc_2: mappedOptions,
            stge_loc_3: mappedOptions,
            stge_loc_4: mappedOptions,
            stge_loc_5: mappedOptions,
            stge_loc_6: mappedOptions,
            stge_loc_7: mappedOptions,
            stge_loc_8: mappedOptions,
            stge_loc_9: mappedOptions,
            stge_loc_10: mappedOptions,
            stge_loc_11: mappedOptions,
            stge_loc_12: mappedOptions,
            stge_loc_13: mappedOptions,
            stge_loc_14: mappedOptions,
            stge_loc_15: mappedOptions,
            stge_loc_16: mappedOptions,
            stge_loc_17: mappedOptions,
            stge_loc_18: mappedOptions,
            stge_loc_19: mappedOptions,
            stge_loc_20: mappedOptions,
          },
        }}
      />

      {/* <div className="d-flex justify-content-end">
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
      </div> */}
    </DialogGlobal>
  );
};

export default ModalStorageLoc;
