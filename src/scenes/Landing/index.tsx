// @ts-nocheck

import {
  Tabs
} from '@mantine/core';

import ReviewRequest from '../../components/ReviewRequest'
import ReviewList from '../ReviewList'

function Landing() {


  return (
    <main style={{ marginTop: '50px' }}>
      <Tabs defaultValue="first" >
        <Tabs.List>
          <Tabs.Tab value="first" >Car review request</Tabs.Tab>
          <Tabs.Tab value="messages" >Current requests</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="first" pt="xs">
          <ReviewRequest />
        </Tabs.Panel>
        <Tabs.Panel value="messages" pt="xs">
          <ReviewList />
        </Tabs.Panel>
      </Tabs>
    </main >
  );
}

export default Landing;
