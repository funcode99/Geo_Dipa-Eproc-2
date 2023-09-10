import { makeStyles } from "@material-ui/core";
import React, { useMemo } from "react";
import { toAbsoluteUrl } from "../../../../../../../../../_metronic/_helpers";

const vendor = {
  name: "Company The Jakarta consulting Group",
  address1: "Wisma 46 Kota BNI Lt 32",
  address2: "Jl. Jend Sudirman Kav 1",
  address3: "Jakarta 10220",
  vendor_number: "30000210",
};

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginTop: 21,
  },
  paper: {
    minHeight: 100,
    padding: 13,
    height: "100%",
    // width: 100,
  },
  control: {
    padding: theme.spacing(2),
  },
  root2: {
    flexGrow: 1,
    height: "100%",
  },
  paper2: {
    minHeight: 55,
    height: "100%",
    padding: 8,
  },
  label: {
    color: "#6c7293",
    fontWeight: "500",
  },
  txtValue: {
    color: "#a7abc3",
    fontWeight: "400",
  },
  pp: {
    marginBottom: 1,
  },
}));

const SectionSummary = ({ header, fullData, dataSA }) => {
  const classes = useStyles();

  const tab3 = useMemo(
    () => [
      { value: fullData?.contract?.vendor?.party?.full_name },
      { value: fullData?.contract?.contract_party?.party_2_legal_domicile },
      // { value: vendor?.address2 },
      // { value: vendor?.address3 },
      {
        value:
          " Your vendor number with us : " +
          fullData?.contract?.vendor?.data?.sap_code,
      },
    ],
    [vendor, fullData]
  );
  const tab4 = useMemo(
    () => [
      { label: "PO Number", value: header?.po_number || "-" },
      {
        label: "Purchasing Group",
        value:
          fullData?.contract?.purch_order?.purch_group?.party?.full_name || "-",
      },
      { label: "Telephone", value: "(021) 7982925" },
      { label: "Currency", value: header?.currency || "-" },
      {
        label: "External Number",
        value: header?.ext_number || "-",
      },
    ],
    [header]
  );
  return (
    <div className={"row my-5 mx-0"}>
      <div className="col-sm-4 border">
        <div className="d-flex flex-column">
          {tab3.map((el, id) => (
            <span key={id}>{el.value}</span>
          ))}
        </div>
      </div>
      <div className="col-sm-8 border">
        <table>
          <colgroup>
            <col width="150px" />
            <col width="10px" />
            <col />
          </colgroup>
          <tbody>
            {tab4.map(({ label, value }, id4) => (
              <tr key={id4}>
                <td className={"td2"}>
                  <span className={classes.label}>{label}</span>
                </td>
                <td className={"td2"}>
                  <span className={classes.label}>:</span>
                </td>
                <td className={"td2"}>
                  <span className={classes.txtValue}>{value}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className={classes.pp}>
          <span className={classes.label}>
            Ref. Quality Assurance Acceptance Certificate :{`    `}
          </span>
          <span className={classes.txtValue}>{dataSA?.ref_doc_no || "-"}</span>
        </p>
      </div>
    </div>
  );
};

export default SectionSummary;
