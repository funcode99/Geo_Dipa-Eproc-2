import { isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import FormBuilder from "../../../../../../components/builder/FormBuilder";
import ButtonContained from "../../../../../../components/button/ButtonGlobal";
import DialogGlobal from "../../../../../../components/modals/DialogGlobal";

const ModalAdendum = ({ innerRef, onSubmit, initData }) => {
  const formRef = React.useRef();

  const [dataForm, setDataForm] = useState([
    {
      name: "adendum1",
      label: "Adendum 1",
    },
  ]);

  const [initValue, setInitValue] = useState({});

  useEffect(() => {
    if (!isEmpty(initData)) {
      setInitValue(false);
      let tempArray = [];
      let tempInit = {};
      initData.forEach((element, index) => {
        tempArray.push({
          name: "adendum" + parseInt(index + 1),
          label: "Adendum " + parseInt(index + 1),
        });
        tempInit[`adendum${parseInt(index + 1)}`] = element;
      });
      setDataForm(tempArray);
      setInitValue(tempInit);
    }
  }, [initData]);

  const addField = () => {
    setDataForm((e) =>
      e.reduce((acc, item, index) => {
        let newIndex = index + 2;
        let newData = {
          name: "adendum" + newIndex,
          label: "Adendum " + newIndex,
        };

        return e.length < 10
          ? index === e.length - 1
            ? [...acc, item, newData]
            : [...acc, item]
          : e;
      }, [])
    );
  };

  const subField = () => {
    setDataForm((e) => {
      var arr = [...e];
      var poped = [];
      if (arr.length > 1) poped = arr.pop();
      return arr;
    });
  };

  const _handleSubmit = (data) => {
    onSubmit(Object.values(data));
  };

  return (
    <DialogGlobal
      title={`Adendum`}
      ref={innerRef}
      onYes={() => formRef.current.handleSubmit()}
      textYes={"Kirim"}
      isCancel={false}
      maxWidth={"sm"}
    >
      {initValue !== false && (
        <FormBuilder
          ref={formRef}
          onSubmit={_handleSubmit}
          formData={dataForm}
          initial={initValue}
          withSubmit={false}
        />
      )}
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
        <ButtonContained
          disabled={dataForm.length == 10}
          baseColor="success"
          onClick={addField}
        >
          Add a row
        </ButtonContained>
      </div>
    </DialogGlobal>
  );
};

export default ModalAdendum;
