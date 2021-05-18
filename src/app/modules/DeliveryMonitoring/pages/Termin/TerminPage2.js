import React from 'react';
import { Container, makeStyles, Paper } from '@material-ui/core';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import { PageTitle, Tabs } from '../../components';
import Summary from './Summary';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import AssignmentOutlinedIcon from '@material-ui/icons/AssignmentOutlined';
import BookmarkBorderOutlinedIcon from '@material-ui/icons/BookmarkBorderOutlined';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(2),
  },
}));

const TabLists = [
  {
    id: 'summary',
    label: 'Summary',
    icon: <DescriptionOutlinedIcon className="mb-0 mr-2" />,
  },
  {
    id: 'berita-acara',
    label: 'Berita Acara',
    icon: <AssignmentOutlinedIcon className="mb-0 mr-2" />,
  },
  {
    id: 'sa-gr',
    label: 'SA / GR',
    icon: <BookmarkBorderOutlinedIcon className="mb-0 mr-2" />,
  },
];

const TerminPage2 = (props) => {
  const classes = useStyles();
  const [tabActive, setTabActive] = React.useState(0);

  function handleChangeTab(event, newTabActive) {
    setTabActive(newTabActive);
  }

  return (
    <Container>
      <PageTitle title="Termin 1" icon={<MenuBookIcon fontSize="default" />} />
      <Paper className={classes.paper}>
        <Container>
          <Tabs
            tabActive={tabActive}
            handleChange={handleChangeTab}
            tabLists={TabLists}
          />
        </Container>
        <hr className="p-0 m-0" />
        <Container>
          {tabActive === 0 && <Summary />}
          {tabActive === 1 && <div>Item Two</div>}
          {tabActive === 2 && <div>Item Three</div>}
        </Container>
      </Paper>
    </Container>
  );
};

export default TerminPage2;
