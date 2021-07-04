import { Switch, TableCell, TableRow } from "@material-ui/core";
import React from "react";
import ButtonAction from "../../../../../../../components/buttonAction/ButtonAction";
import UploadInput from "../../../../../../../components/input/UploadInput";
import { JaminanContext } from "../Jaminan";
const RowGuarantee = ({ item, index }) => {
  const {
    contractById,
    handleAction,
    dataForm,
    status,
    onChange,
  } = React.useContext(JaminanContext);

  const [active, setActive] = React.useState(false);
  const handleActive = React.useCallback(() => {
    setActive((prev) => !prev);
  }, [setActive, active]);
  const valueUsed = Boolean(item.required === "1");
  const statusItem = contractById?.contract_guarantees?.filter(
    (el) => el.name === item.type
  );
  //   console.log(`item`, item, statusItem, contractById?.contract_guarantees);
  return (
    <TableRow hover style={{ backgroundColor: !valueUsed && "#f1f1f1" }}>
      <TableCell>
        <Switch
          checked={valueUsed}
          color="primary"
          //   onChange={handleActive}
          //   color="red"
          //   className={"text-primary"}
        />
      </TableCell>
      <TableCell>{item.label}</TableCell>
      <TableCell>
        {statusItem?.length ? statusItem[0]?.approve_status?.name : "-"}
      </TableCell>
      <TableCell>
        {statusItem?.length ? (
          status === "client" ? (
            <ButtonAction
              data={{ ...item, item: statusItem?.[0] }}
              handleAction={handleAction}
              ops={[
                {
                  label: "TITLE.PREVIEW",
                  icon: "fas fa-search text-primary",
                  type: "preview",
                },
                {
                  label: "TITLE.APPROVE",
                  icon: "fas fa-check-circle text-warning",
                  type: "approve",
                },
                {
                  label: "TITLE.REJECT",
                  icon: "fas fa-times-circle text-primary",
                  type: "reject",
                },
              ]}
            />
          ) : (
            <ButtonAction
              data={{ ...item, item: statusItem?.[0] }}
              handleAction={handleAction}
              ops={[
                {
                  label: "TITLE.PREVIEW",
                  icon: "fas fa-search text-primary",
                  type: "preview",
                },
                //   {
                //     label: "TITLE.UPLOAD",
                //     icon: "fas fa-upload text-danger",
                //     type: "upload",
                //   },
              ]}
            />
          )
        ) : status === "client" ? (
          "-"
        ) : (
          <UploadInput
            disabled={!valueUsed}
            value={dataForm[item.type]}
            onChange={(eve) => onChange(eve, item.type)}
            //   classLabel={Boolean(!active) && "d-none"}
          />
        )}
      </TableCell>
    </TableRow>
  );
};

export default RowGuarantee;
