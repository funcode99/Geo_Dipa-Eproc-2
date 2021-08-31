import React from "react";
import FormBuilder from "../../../../../../components/builder/FormBuilder";
import { sa_field } from "./DUMMY_DATA";

const FormSA = () => {
  const disabled = [""];
  return (
    <div>
      <FormBuilder
        loading={false}
        onSubmit={() => {}}
        formData={sa_field}
        fieldProps={{
          readOnly: true,
          //   disabledFields: disabled,
        }}
      />
    </div>
  );
};

export default FormSA;
