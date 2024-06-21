// src/pages/PlansPage.tsx
import React from 'react';
import { Tabs } from 'antd';
import DayPlan from './DayPlan';
import YearPlan from './YearPlan';

const { TabPane } = Tabs;

const PlansPage: React.FC = () => {
  return (
    <Tabs defaultActiveKey="1">
      <TabPane tab="日任务" key="1">
        <DayPlan />
      </TabPane>
      <TabPane tab="长期任务" key="4">
        <YearPlan />
      </TabPane>
    </Tabs>
  );
};

export default PlansPage;
