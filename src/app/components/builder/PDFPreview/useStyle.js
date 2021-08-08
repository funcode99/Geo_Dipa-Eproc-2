import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    width: 300,
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
  },
  boxBtn: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    // marginTop: -80,
    marginTop: 8,
    marginBottom: 8,
    zIndex: 1,
  },
}));

export default useStyles;
