import React, { useEffect, useState } from "react";
import FormBuilder from "../../../../../../components/builder/FormBuilder";
import { option_dist_type, sa_field, validationSchema_sa } from "./DUMMY_DATA";
import TableSA from "./TableSA";

export const FormSAContext = React.createContext({});

const FormSA = ({ fetch_api_sg, keys }) => {
  const [arrService, setArrService] = useState({});
  const [listWBS, setlistWBS] = useState([]);
  const handleRefresh = () => {
    fetch_api_sg({
      key: keys.fetch_wbs,
      type: "get",
      url: `delivery/wbs`,
      onSuccess: (res) => {
        // console.log("reswbs", res);
        setlistWBS(res.data);
      },
    });
  };
  const disabled = [""];
  const _handleSubmit = (data) => {
    console.log(`data`, data);
  };
  useEffect(() => handleRefresh(), []);
  return (
    <FormSAContext.Provider
      value={{
        setArrService,
        listWBS,
      }}
    >
      <TableSA />
      <FormBuilder
        loading={false}
        onSubmit={_handleSubmit}
        formData={sa_field}
        validation={validationSchema_sa}
      />
    </FormSAContext.Provider>
  );
};

export default FormSA;
