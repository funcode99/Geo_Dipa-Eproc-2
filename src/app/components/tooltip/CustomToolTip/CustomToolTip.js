import { Tooltip, withStyles } from "@material-ui/core";

const CustomToolTip = withStyles((theme) => ({
  tooltip: {
    boxShadow: theme.shadows[1],
    fontSize: "0.875rem",
    marginTop: "0.25rem",
  },
}))(Tooltip);

// const CustomToolTip = () => {
//   return <div></div>;
// };

export default CustomToolTip;
