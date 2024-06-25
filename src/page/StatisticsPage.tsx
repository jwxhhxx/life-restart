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
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24} md={12}>
          <DailyPlanStats />
        </Col>
        <Col xs={24} sm={24} md={12}>
          <DayPlancalendar />
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24} md={12}>
          <Statistics />
        </Col>
        <Col xs={24} sm={24} md={12}>
          <AccountingStatistics />
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24} md={12}>
          <WeightStatic />
        </Col>
      </Row>
    </div>
  );
};

export default StatisticsPage;
