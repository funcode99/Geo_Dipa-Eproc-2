import { Grid, makeStyles, Paper } from "@material-ui/core";
import React, { useCallback } from "react";
import { connect } from "react-redux";
import { fetch_api_sg } from "../../../../../../../redux/globalReducer";
import { QRCodeG } from "../../../../../../components/qrCodeGenerate/QRCodeGenerate";

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

const BoxSignSA = ({ title, noQR, params, fetch_api_sg }) => {
  const classes = useStyles();
  const tab4 = React.useMemo(
    () => [
      // { label: "SIGNATURE", value: "" },
      {
        label: "NAME",
        value: "",
      },
      { label: "DATE", value: "" },
    ],
    []
  );
  const handleOpenQR = useCallback(
    (value) => {
      fetch_api_sg({
        key: "qr-code-dm",
        type: "post",
        url: `/delivery/task/${params.id}/${params.type}/${params.user}`,
        onSuccess: (res) => {
          console.log(`res`, res);
          var string = value;
          if (string.indexOf("http") === 0) {
            window.open(value, "_blank");
          }
        },
      });
    },
    [fetch_api_sg, params]
  );
  return (
    <Grid item xs={4}>
      <Paper className={classes.paper}>
        <div className={"d-flex flex-column align-items-center"}>
          {noQR ? (
            <div style={{ width: 72, height: 72 }} />
          ) : (
            <QRCodeG
              value={`${window.location.origin}/qrcode-dm?doc_id=${params?.id}&type=${params?.type}&user=${params?.user}`}
              // onClick={handleOpenQR}
              // size="90"
            />
          )}
          <span className={classes.txtJudul}>{title}</span>
        </div>
        <table>
          <colgroup>
            <col width="50px" />
            <col width="10px" />
            <col />
          </colgroup>
          <tbody>
            {/* <tr className={"mb-2"}>
              <td className={"td2"}>
                <span className={classes.label}>{""}</span>
              </td>
              <td className={"td2"}>
                <span className={classes.label}></span>
              </td>
              <td className={"td2"}>
                <div>
                  <QRCodeG
                    value={`${
                      window.location.origin
                    }/qrcode?term_id=${"termin"}&role_id=${"bkbData?.approved_bkb_role_id"}&type=APPROVED_BKB`}
                    // size="90"
                  />
                  <span className={classes.txtJudul}>{title}</span>
                </div>
              </td>
            </tr> */}
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

export default connect(null, { fetch_api_sg })(BoxSignSA);
