import { Grid, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useMemo } from "react";
import { detailSA } from "../fieldData";
import "../styles.scss";

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

const DetailSA = ({ data, type }) => {
  const { client, document, vendor, contract } = detailSA;
  const classes = useStyles();
  let dataSA = {};
  if (type === "SA") dataSA = data;

  const tab2 = useMemo(
    () => [
      { label: "Number", value: "100001237912" },
      { label: "Page", value: "100001237912" },
      { label: "Posting Date", value: "100001237912" },
      { label: "Document Date", value: "100001237912" },
    ],
    []
  );
  const tab4 = useMemo(
    () => [
      { label: "PO Number", value: "8001238" },
      { label: "Purchasing Group", value: "8001238" },
      { label: "Telephone", value: "8001238" },
      { label: "Currency", value: "8001238" },
      { label: "External Number", value: "8001238" },
    ],
    []
  );

  return (
    <Grid container className={classes.root} spacing={1}>
      <Grid item xs={6}>
        <Paper className={classes.paper}>
          <p className={classes.pp}>
            <span className={classes.txtValue}>
              MASIH DUMMY PT. GEO DIPA ENERGI
            </span>
          </p>
          <p className={classes.pp}>
            <span className={classes.txtValue}>Plant Pusat</span>
          </p>
          <p className={classes.pp}>
            <span className={classes.txtValue}>Jl. Aditiawamarman Kv. 55</span>
          </p>
          <p className={classes.pp}>
            <span className={classes.txtValue}>Jakarta Selatan</span>
          </p>
        </Paper>
      </Grid>
      <Grid item xs={6}>
        <div>
          <Grid container className={classes.root2} spacing={1}>
            {tab2.map(({ label, value }, id2) => (
              <Grid item xs={6} key={id2}>
                <Paper className={classes.paper2}>
                  <p className={classes.pp}>
                    <span className={classes.label}>{label} :</span>
                  </p>
                  <span className={classes.txtValue}>{value}</span>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </div>
      </Grid>
      <Grid item xs={6}>
        <Paper className={classes.paper}>
          <p className={classes.pp}>
            <span className={classes.txtValue}>
              MASIH DUMMY Company Abyor International, PT
            </span>
          </p>
          <br />
          <p className={classes.pp}>
            <span className={classes.txtValue}>
              Wisma BCA Wint A Lt. PH BSD City KOTA TANGERANG SELATAN 15322
            </span>
          </p>
          <br />
          <p className={classes.pp}>
            <span className={classes.txtValue}>
              Your vendor number with us: 2000412873
            </span>
          </p>
        </Paper>
      </Grid>
      <Grid item xs={6}>
        <Paper className={classes.paper}>
          <table>
            <colgroup>
              <col width="150px" />
              <col width="10px" />
              <col />
            </colgroup>
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
          </table>
          {/* <p className={classes.pp}>
            <span className={classes.label}>Account Name:</span>
            <span className={classes.txtValue}>Barclays UK</span>
          </p> */}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default DetailSA;
