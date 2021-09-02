import React, { useState } from "react";
import FormBuilder from "../../../../../../components/builder/FormBuilder";
import { sa_field, validationSchema_sa } from "./DUMMY_DATA";
import TableSA from "./TableSA";

export const FormSAContext = React.createContext({});

const FormSA = () => {
  const [arrService, setArrService] = useState({});
  const disabled = [""];
  console.log(`arrService`, arrService);
  const _handleSubmit = (data) => {
    console.log(`data`, data);
  };
  return (
    <FormSAContext.Provider
      value={{
        setArrService,
      }}
    >
      <TableSA />
      <FormBuilder
        loading={false}
        onSubmit={_handleSubmit}
        formData={sa_field}
        validation={validationSchema_sa}
        fieldProps={
          {
            // readOnly: true,
            //   disabledFields: disabled,
          }
        }
      />
    </FormSAContext.Provider>
  );
};

export default FormSA;
