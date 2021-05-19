import React from 'react';
import { Container, makeStyles, Paper } from '@material-ui/core';
import Subheader from '../../../../components/subheader';
import Tabs from '../../../../components/tabs';
import Summary from './Summary';
import {
  DescriptionOutlined,
  AssignmentOutlined,
  BookmarkBorderOutlined,
} from '@material-ui/icons';

import ServAccGR from '../ServiceAccGR/pages/ServiceAccDetail';
import Documents from './Documents';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(2),
  },
}));

const TabLists = [
  {
    id: 'summary',
    label: 'Summary',
    icon: <DescriptionOutlined className="mb-0 mr-2" />,
  },
  {
    id: 'berita-acara',
    label: 'Berita Acara',
    icon: <AssignmentOutlined className="mb-0 mr-2" />,
  },
  {
    id: 'sa-gr',
    label: 'SA / GR',
    icon: <BookmarkBorderOutlined className="mb-0 mr-2" />,
  },
];

const TerminPage2 = (props) => {
  const classes = useStyles();
  const [tabActive, setTabActive] = React.useState(0);

  function handleChangeTab(_, newTabActive) {
    setTabActive(newTabActive);
  }

  return (
    <Container>
      <Subheader
        text="Termin 1"
        IconComponent={<DescriptionOutlined style={{ color: 'white' }} />}
      />
      <Paper className={classes.paper}>
        <Container>
          <Tabs
            tabActive={tabActive}
            handleChange={handleChangeTab}
            tabLists={TabLists}
          />
        </Container>
        <hr className="p-0 m-0" />
        <Container style={{ marginTop: 20, paddingBottom: 20 }}>
          {tabActive === 0 && <Summary />}
          {tabActive === 1 && (
            <div>
              <DescriptionOutlined className="mb-0 mr-2" />
            </div>
          )}
          {tabActive === 2 && <ServAccGR />}
          <Documents />
        </Container>
      </Paper>
    </Container>
  );
};

export default TerminPage2;
