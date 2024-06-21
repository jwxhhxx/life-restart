// src/components/Statistics/Statistics.tsx
import React, { useState, useEffect } from 'react';
import { Plan } from '../util/types';
import { loadPlans } from '../util/utils';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { DatePicker, Space, Radio } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

// 使用插件
dayjs.extend(isBetween);
const { RangePicker } = DatePicker;

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Statistics: React.FC = () => {
  const [dayPlans, setDayPlans] = useState<Plan[]>([]);
  const [filteredPlans, setFilteredPlans] = useState<Plan[]>([]);
  const [range, setRange] = useState<[Dayjs, Dayjs]>([dayjs().startOf('day'), dayjs().endOf('day')]);

  useEffect(() => {
    setDayPlans(loadPlans('dayPlans'));
  }, []);

  useEffect(() => {
    filterPlans();
  }, [range, dayPlans]);

  const filterPlans = () => {
    const [start, end] = range;
    const filtered = dayPlans.filter(plan => dayjs(plan.date).isBetween(start, end, null, '[]'));
    setFilteredPlans(filtered);
  };

  const handleRangeChange = (dates:any) => {
    setRange(dates);
  };

  const handleQuickSelect = (type: 'day' | 'week' | 'month' | 'year') => {
    switch (type) {
      case 'day':
        setRange([dayjs().startOf('day'), dayjs().endOf('day')]);
        break;
      case 'week':
        setRange([dayjs().startOf('week'), dayjs().endOf('week')]);
        break;
      case 'month':
        setRange([dayjs().startOf('month'), dayjs().endOf('month')]);
        break;
      case 'year':
        setRange([dayjs().startOf('year'), dayjs().endOf('year')]);
        break;
    }
  };

  const completedPlans = filteredPlans.filter(plan => plan.completed);
  const totalTimeSpent = completedPlans.reduce((total, plan) => total + (plan.timeSpent || 0), 0);

  const titleCounts = completedPlans.reduce((acc, plan) => {
    acc[plan.title] = (acc[plan.title] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const titleData = {
    labels: Object.keys(titleCounts),
    datasets: [
      {
        label: 'Task Count',
        data: Object.values(titleCounts),
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      }
    ]
  };

  const data = {
    labels: ['Day Plans'],
    datasets: [
      {
        label: 'Completed',
        data: [
          filteredPlans.filter(plan => plan.completed).length
        ],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Pending',
        data: [
          filteredPlans.filter(plan => !plan.completed).length
        ],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      }
    ]
  };

  const timeSpentData = {
    labels: ['Total Time Spent (minutes)'],
    datasets: [
      {
        label: 'Time Spent',
        data: [totalTimeSpent],
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      }
    ]
  };

  return (
    <div>
      <h2>任务统计</h2>
      <Space direction="vertical" style={{ marginBottom: 20 }}>
        <RangePicker value={range} onChange={handleRangeChange} />
        <Radio.Group onChange={(e) => handleQuickSelect(e.target.value)} buttonStyle="solid">
          <Radio.Button value="day">今天</Radio.Button>
          <Radio.Button value="week">本周</Radio.Button>
          <Radio.Button value="month">本月</Radio.Button>
          <Radio.Button value="year">本年</Radio.Button>
        </Radio.Group>
      </Space>
      <div style={{ height: '300px' }}>
        <Bar data={data} options={{ maintainAspectRatio: false }} />
      </div>
      <h2>完成任务时长统计</h2>
      <div style={{ height: '300px' }}>
        <Bar data={timeSpentData} options={{ maintainAspectRatio: false }} />
      </div>
      <h2>任务统计</h2>
      <div style={{ height: '300px' }}>
        <Bar data={titleData} options={{ maintainAspectRatio: false }} />
      </div>
    </div>
  );
};

export default Statistics;
