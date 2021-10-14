import { Grid, makeStyles, Paper } from "@material-ui/core";
import React from "react";

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
  txtJudul: {
    color: "#6c7293",
    fontWeight: "500",
  },
}));

const BoxSignSA = ({ title }) => {
  const classes = useStyles();
  const tab4 = React.useMemo(
    () => [
      { label: "SIGNATURE", value: "" },
      {
        label: "NAME",
        value: "",
      },
      { label: "DATE", value: "" },
    ],
    []
  );
  return (
    <Grid item xs={3}>
      <Paper className={classes.paper}>
        <table>
          <colgroup>
            <col width="50px" />
            <col width="10px" />
            <col />
          </colgroup>
          <tbody>
            <tr className={"mb-2"}>
              <td className={"td2"}>
                <span className={classes.label}>{""}</span>
              </td>
              <td className={"td2"}>
                <span className={classes.label}></span>
              </td>
              <td className={"td2"}>
                <span className={classes.txtJudul}>{title}</span>
              </td>
            </tr>
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
        {/* <p className={classes.pp}>
            <span className={classes.label}>
              Ref. Quality Assurance Acceptance Certificate :{`    `}
            </span>
            <span className={classes.txtValue}>
              {dataSA?.ref_doc_no || "-"}
            </span>
          </p> */}
      </Paper>
    </Grid>
  );
};

export default BoxSignSA;
