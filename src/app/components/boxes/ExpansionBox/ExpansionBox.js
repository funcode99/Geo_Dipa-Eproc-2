import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import { makeStyles, Typography } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import React from "react";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginTop: 21,
    marginBottom: 21,
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  icon: {
    verticalAlign: "bottom",
    height: 20,
    width: 20,
  },
  details: {
    alignItems: "center",
    display: "block",
  },
  column: {
    // flexBasis: "33.33%",
  },
  helper: {
    borderLeft: `2px solid ${theme.palette.divider}`,
    padding: theme.spacing(1, 2),
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
}));

export default function ExpansionBox({
  title,
  custTitle,
  subTitle,
  children,
  rightComponent,
  classCont,
  defaultExpanded = true,
}) {
  const classes = useStyles();

  return (
    <div className={`${classes.root} ${classCont}`}>
      <ExpansionPanel defaultExpanded={defaultExpanded}>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1c-content"
          id="panel1c-header"
        >
          <div
            className={"d-flex justify-content-between "}
            style={{ flex: 1 }}
          >
            <div className={classes.column}>
              <Typography className={classes.heading}>
                {custTitle}
                {title && <FormattedMessage id={title} />}
              </Typography>
              {subTitle}
            </div>
            {rightComponent}
          </div>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.details}>
          {children}
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
}
