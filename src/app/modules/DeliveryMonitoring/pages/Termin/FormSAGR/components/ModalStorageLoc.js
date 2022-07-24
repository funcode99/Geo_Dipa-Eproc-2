import React, { useCallback, useEffect, useMemo, useState } from "react";
import FormBuilder from "../../../../../../components/builder/FormBuilder";
import DialogGlobal from "../../../../../../components/modals/DialogGlobal";

const ModalStorageLoc = ({
  innerRef,
  items,
  options,
  onSubmit,
  defaultValue = [],
}) => {
  const formRef = React.useRef();
  const [dataForm, setDataForm] = useState([]);

  const _handleSubmit = useCallback(
    (data) => {
      const dataNew = items?.reduce(
        (acc, item, index) => [
          ...acc,
          {
            id: item?.id,
            stge_loc:
              data?.[`stge_loc_${index + 1}`]?.name || defaultValue?.[item.id],
            label: `Item ${index + 1} (${data?.[`stge_loc_${index + 1}`]
              ?.name || defaultValue?.[item.id]})`,
            value:
              data?.[`stge_loc_${index + 1}`]?.name || defaultValue?.[item.id],
            name:
              data?.[`stge_loc_${index + 1}`]?.name || defaultValue?.[item.id],
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
            value: defaultValue?.[item.id] || item?.stge_loc,
            label: defaultValue?.[item.id] || item?.stge_loc,
          },
        }),
        {}
      ),
    [items, defaultValue]
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
    </DialogGlobal>
  );
};

export default ModalStorageLoc;
