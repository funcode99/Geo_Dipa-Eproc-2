import React from 'react';
import { makeStyles, Tabs as MuiTabs, Tab as MuiTab } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  tabRoot: {
    minWidth: 'max-content',
    minHeight: 'max-content',
    marginTop: theme.spacing(1.5),
    marginBottom: theme.spacing(1.5),
  },
  tabWrapper: {
    flexDirection: 'row',
    fontSize: '1rem',
    fontWeight: '500',
    textTransform: 'none',
  },
}));

export default function Tabs(props) {
  const { tabLists, tabActive, handleChange } = props;
  const classes = useStyles();

  return (
    <MuiTabs
      value={tabActive}
      onChange={handleChange}
      indicatorColor="secondary"
      textColor="secondary"
      variant="standard"
    >
      {tabLists.map((item) => (
        <MuiTab
          key={item.id}
          label={item.label}
          icon={item.icon}
          classes={{
            root: classes.tabRoot,
            wrapper: classes.tabWrapper,
          }}
        />
      ))}
    </MuiTabs>
  );
}
