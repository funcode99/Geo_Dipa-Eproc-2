import React from "react";
import FormBuilder from "../../../../../../components/builder/FormBuilder";
import { gr_field } from "./DUMMY_DATA";

const FormGR = () => {
  return (
    <div>
      <FormBuilder
        loading={false}
        onSubmit={() => {}}
        formData={gr_field}
        fieldProps={{
          readOnly: true,
          //   disabledFields: disabled,
        }}
      />
    </div>
  );
};

export default FormGR;
