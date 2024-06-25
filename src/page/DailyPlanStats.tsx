// src/components/DailyPlanStats.tsx
import React, { useState, useEffect } from 'react';
import { Plan, ReadingEntry } from '../util/types';
import { loadPlans, loadReadingEntry } from '../util/utils';
import { Card, Row, Col, Statistic } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, BookOutlined, VideoCameraOutlined, PlayCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import YearPlanBubbleChart from './YearPlanBubbleChart';

interface Stats {
  completed: number;
  incomplete: number;
}

const DailyPlanStats: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [yearPlans, setYearPlans] = useState<Plan[]>([]);
  const [stats, setStats] = useState<Stats>({ completed: 0, incomplete: 0 });
  const [entries, setEntries] = useState<ReadingEntry[]>([]);

  useEffect(() => {
    const loadedPlans = loadPlans('dayPlans');
    setPlans(loadedPlans);
    setEntries(loadReadingEntry('readingEntries'));
    setYearPlans(loadPlans('yearPlans'));
  }, []);

  useEffect(() => {
    const completedCount = plans.filter(plan => plan.completed).length;
    const incompleteCount = plans.length - completedCount;
    setStats({ completed: completedCount, incomplete: incompleteCount });
  }, [plans]);

  const totalBooks = entries.filter(entry => entry.type === '书籍').length;
  const totalMovies = entries.filter(entry => entry.type === '电影').length;
  const totalAnime = entries.filter(entry => entry.type === '动漫').length;
  const totalTimeSpent = entries.reduce((total, entry) => total + entry.timeSpent, 0);

  return (
    <div>
      <h2>统计信息</h2>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="完成任务数量"
              value={stats.completed}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="未完成任务数量"
              value={stats.incomplete}
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="阅读数量"
              value={totalBooks}
              prefix={<BookOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="观影数量"
              value={totalMovies}
              prefix={<VideoCameraOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="动漫数量"
              value={totalAnime}
              prefix={<PlayCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="输入总时长"
              value={totalTimeSpent}
              suffix="分钟"
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <YearPlanBubbleChart plans={yearPlans} />
        </Col>
      </Row>
    </div>
  );
};

export default DailyPlanStats;
