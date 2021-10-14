import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import React, { useEffect } from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  expansionPanelCard: {
    margin: "0 !important",
  },
  expansionPanelHeader: {
    "border-bottom": "1px solid #ebedf3",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
}));

const GRAccord = ({ children, label, expandeds = true }) => {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  // Kebutuhan Print Data
  useEffect(() => {
    console.log("expandeds", expandeds);
    if (expandeds) setExpanded(`panel${"idx"}`);
  }, []);

  return (
    <div className={classes.root}>
      <ExpansionPanel
        key={"idx"}
        expanded={expanded === `panel${"idx"}`}
        onChange={handleChange(`panel${"idx"}`)}
        className={classes.expansionPanelCard}
      >
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls={`panel${"idx"}bh-content`}
          id={`panel${"idx"}bh-header`}
          className={classes.expansionPanelHeader}
        >
          <Typography className={classes.heading}>{label}</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>{children}</ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
};

export default GRAccord;
