import React from "react";
import ButtonAction from "../../../../../../components/buttonAction/ButtonAction";

const BtnAction = ({ label, data, handleAction, exclude, ops }) => {
  let updateExclude = [...exclude];
  if (data?.approve_status?.code !== "approved") {
    updateExclude = [...updateExclude, "change_status"];
  }

  return (
    <ButtonAction
      label={label}
      data={data}
      handleAction={handleAction}
      exclude={updateExclude}
      ops={ops}
    />
  );
};

export default BtnAction;
