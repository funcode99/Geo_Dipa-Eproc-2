import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { FormSAContext } from "./FormSA";
import TableSA from "./TableSA";

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

const TableAccordSA = () => {
  const classes = useStyles();
  const { itemJasa, saExist, dataSA } = React.useContext(FormSAContext);
  const [expanded, setExpanded] = React.useState(false);
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const saUsed = saExist ? dataSA : itemJasa;
  return (
    <div className={classes.root}>
      {saUsed.map((item, id) => {
        const itemSAUsed = itemJasa?.filter(
          (el) => el?.pckg_no === item?.services?.[0]?.service?.start_pckg_no
        )?.[0];
        console.log(`itemJasa`, itemJasa, dataSA, itemSAUsed);
        // console.log("item", item);
        const itemUsed = saExist ? item.services : item.item_services;

        let dataItemJasa = itemUsed.filter((service) => service.service);
        {
          /* dataItemJasa.length > 0 && ( */
        }
        return (
          <ExpansionPanel
            key={id}
            expanded={expanded === `panel${id}`}
            onChange={handleChange(`panel${id}`)}
            className={classes.expansionPanelCard}
          >
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${id}bh-content`}
              id={`panel${id}bh-header`}
              className={classes.expansionPanelHeader}
            >
              <Typography className={classes.heading}>
                {saExist ? itemSAUsed?.desc : saUsed?.[id]?.desc}
              </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              {dataItemJasa.length > 0 ? (
                <TableSA itemJasa={dataItemJasa} itemSA={item} />
              ) : (
                "Item tidak tersedia"
              )}
            </ExpansionPanelDetails>
          </ExpansionPanel>
        );
      })}
    </div>
  );
};

export default TableAccordSA;
