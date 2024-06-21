import React, { useState, useEffect } from 'react';
import { Expense } from '../util/types';
import { loadEnxpense } from '../util/utils';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { DatePicker, Space, Radio } from 'antd';
import dayjs, { Dayjs } from 'dayjs'; // 导入 dayjs 库

const { RangePicker } = DatePicker;

ChartJS.register(ArcElement, Tooltip, Legend);

const AccountingStatistics: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [range, setRange] = useState<[Dayjs, Dayjs]>([dayjs().startOf('day'), dayjs().endOf('day')]); // 使用 Dayjs 类型

  useEffect(() => {
    setExpenses(loadEnxpense('expenses'));
  }, []);

  useEffect(() => {
    filterExpenses();
  }, [range, expenses]);

  const filterExpenses = () => {
    const [start, end] = range;
    const filtered = expenses.filter(expense => dayjs(expense.date).isBetween(start, end, 'day', '[]'));
    setFilteredExpenses(filtered);
  };

  const handleRangeChange = (dates: any) => {
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
      default:
        break;
    }
  };

  const expenseData = filteredExpenses.filter(expense => expense.type === '支出');
  const incomeData = filteredExpenses.filter(expense => expense.type === '收入');

  const expenseCategories = Array.from(new Set(expenseData.map(expense => expense.category)));
  const incomeCategories = Array.from(new Set(incomeData.map(income => income.category)));

  const expenseAmounts = expenseCategories.map(category => {
    return expenseData.filter(expense => expense.category === category).reduce((sum, expense) => sum + expense.amount, 0);
  });

  const incomeAmounts = incomeCategories.map(category => {
    return incomeData.filter(income => income.category === category).reduce((sum, income) => sum + income.amount, 0);
  });

  const expenseChartData = {
    labels: expenseCategories,
    datasets: [
      {
        data: expenseAmounts,
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#FF9F40',
          '#4BC0C0',
          '#9966FF',
          '#FF6384',
        ],
      },
    ],
  };

  const incomeChartData = {
    labels: incomeCategories,
    datasets: [
      {
        data: incomeAmounts,
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };

  return (
    <div>
      <h2>开支统计</h2>
      <Space direction="vertical" style={{ marginBottom: 20 }}>
        <RangePicker value={range} onChange={handleRangeChange} />
        <Radio.Group onChange={(e) => handleQuickSelect(e.target.value)} buttonStyle="solid">
          <Radio.Button value="day">今天</Radio.Button>
          <Radio.Button value="week">本周</Radio.Button>
          <Radio.Button value="month">本月</Radio.Button>
          <Radio.Button value="year">本年</Radio.Button>
        </Radio.Group>
      </Space>
      <h2>支出统计</h2>
      <div style={{ height: '300px' }}>
        <Pie data={expenseChartData} options={{ maintainAspectRatio: false }} />
      </div>
      <h2>收入统计</h2>
      <div style={{ height: '300px' }}>
        <Pie data={incomeChartData} options={{ maintainAspectRatio: false }} />
      </div>
    </div>
  );
};

export default AccountingStatistics;
