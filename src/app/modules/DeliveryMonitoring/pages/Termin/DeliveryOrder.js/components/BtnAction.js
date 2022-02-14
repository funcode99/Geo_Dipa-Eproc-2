import React from "react";
import ButtonAction from "../../../../../../components/buttonAction/ButtonAction";

const BtnAction = ({ isVendor, label, data, handleAction, exclude, ops }) => {
  let updateExclude = [...exclude];
  if (data?.approve_status?.code !== "approved") {
    updateExclude = [...updateExclude, "change_status"];
  } else if (data?.approve_status?.code === "approved") {
    updateExclude = [...updateExclude, "update", "delete"];
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
