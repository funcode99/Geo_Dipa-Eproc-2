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
  // console.log(`item`, item, statusItem, contractById?.contract_guarantees);
  const isRejected =
    statusItem?.length && statusItem[0]?.approve_status?.name === "REJECTED";
  const isApproved =
    statusItem?.length && statusItem[0]?.approve_status?.name === "APPROVED";
  const approveItem = isApproved
    ? []
    : [
        {
          label: "TITLE.APPROVE",
          icon: "fas fa-check-circle text-success",
          type: "approve",
        },
        {
          label: "TITLE.REJECT",
          icon: "fas fa-times-circle text-danger",
          type: "reject",
        },
      ];
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
        <div className="d-flex flex-column flex-grow-1">
          <p className="text-dark-75 font-size-lg mb-1">
            {statusItem?.length ? statusItem[0]?.approve_status?.name : "-"}
          </p>
          <span className="text-muted font-weight-bold">
            {isRejected ? statusItem[0]?.reject_text : null}
          </span>
        </div>
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
                ...approveItem,
              ]}
            />
          ) : isRejected ? (
            <UploadInput
              disabled={!valueUsed}
              value={dataForm[item.type]}
              onChange={(eve) => onChange(eve, item.type)}
              //   classLabel={Boolean(!active) && "d-none"}
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
