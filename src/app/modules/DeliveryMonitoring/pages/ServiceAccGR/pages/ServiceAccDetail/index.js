import React from 'react';
import { Container } from '@material-ui/core';
import ServiceAcceptance from './ServiceAccDetail';
import { TabsWrapper } from './style';
import GoodReceipt from './GoodReceipt';
import Navs from '../../../../../../components/navs';

const navLists = [
  { id: 'link-sa', label: 'Service Acceptance' },
  { id: 'link-gr', label: 'Good Receipt' },
];

export const ContainerSA = () => {
  const [tabActive, setTabActive] = React.useState('link-sa');

  return (
    <Container>
      <div>
        <Navs
          navLists={navLists}
          handleSelect={(selectedKey) => setTabActive(selectedKey)}
        />
      </div>
      <TabsWrapper>
        {tabActive === 'link-sa' && <ServiceAcceptance />}
        {tabActive === 'link-gr' && <GoodReceipt />}
      </TabsWrapper>
    </Container>
  );
};

export default ContainerSA;
