// src/pages/StatisticsPage.tsx
import React from 'react';
import { Row, Col } from 'antd';
import Statistics from './Statistics';
import AccountingStatistics from './AccountingStatistics';
import WeightStatic from './WeightStatic';
import DayPlancalendar from './DayPlanCalendar';
import DailyPlanStats from './DailyPlanStats'
const StatisticsPage: React.FC = () => {
  return (
    <div>
      <Row gutter={16}>
      <Col span={12}>
          <DailyPlanStats />
        </Col>
        <Col span={12}>
          <DayPlancalendar />
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Statistics />
        </Col>
        <Col span={12}>
          <AccountingStatistics />
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <WeightStatic />
        </Col>
      </Row>
    </div>
  );
};

export default StatisticsPage;
