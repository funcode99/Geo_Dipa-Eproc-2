import React, { useState } from "react";
import FormBuilder from "../../../../../../components/builder/FormBuilder";
import { sa_field } from "./DUMMY_DATA";
import TableSA from "./TableSA";

export const FormSAContext = React.createContext({});

const FormSA = () => {
  const [arrService, setArrService] = useState({});
  const disabled = [""];
  console.log(`arrService`, arrService);
  return (
    <FormSAContext.Provider
      value={{
        setArrService,
      }}
    >
      <TableSA />
      <FormBuilder
        loading={false}
        onSubmit={() => {}}
        formData={sa_field}
        fieldProps={{
          readOnly: true,
          //   disabledFields: disabled,
        }}
      />
    </FormSAContext.Provider>
  );
};

export default FormSA;
