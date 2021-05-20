import React from 'react';
import { Container } from '@material-ui/core';
import {
  DescriptionOutlined,
  BookmarkBorderOutlined,
} from '@material-ui/icons';
import Tabs from '../../../../../../components/tabs';
import ServiceAcceptance from './ServiceAccDetail';
import { TabsWrapper } from './style';
import GoodReceipt from './GoodReceipt';

const TabLists = [
  {
    id: 'sa',
    label: 'Service Acceptance',
    icon: <DescriptionOutlined className="mb-0 mr-2" />,
  },
  {
    id: 'gr',
    label: 'Good Receipt',
    icon: <BookmarkBorderOutlined className="mb-0 mr-2" />,
  },
];

export const ContainerSA = () => {
  const [tabActive, setTabActive] = React.useState(0);

  function handleChangeTab(_, newTabActive) {
    setTabActive(newTabActive);
  }

  return (
    <Container>
      <div>
        <Tabs
          tabActive={tabActive}
          handleChange={handleChangeTab}
          tabLists={TabLists}
        />
      </div>
      <TabsWrapper>
        {tabActive === 0 && <ServiceAcceptance />}
        {tabActive === 1 && <GoodReceipt />}
      </TabsWrapper>
    </Container>
  );
};

export default ContainerSA;
