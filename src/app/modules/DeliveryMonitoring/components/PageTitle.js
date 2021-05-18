import React from 'react';
import { Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  iconWrapper: {
    backgroundColor: '#3699FF',
    marginRight: theme.spacing(1.5),
    borderRadius: theme.spacing(0.5),
    padding: theme.spacing(0.5),
    display: 'flex',
    alignItems: 'center',
    '& .MuiSvgIcon-root': {
      color: '#fff',
    },
  },
}));

export default function PageTitle(props) {
  const { title, icon } = props;
  const classes = useStyles();

  return (
    <Typography variant="h5" component="div" className={classes.root}>
      <div className={classes.iconWrapper}>{icon}</div>
      <span>{title}</span>
    </Typography>
  );
}
