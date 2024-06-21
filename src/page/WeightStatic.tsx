import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { Chart as ChartJS, LineController, Tooltip, Legend,PointElement,LineElement } from 'chart.js';
import { Line } from 'react-chartjs-2';

// 注册所需元素
ChartJS.register(
    LineController,
    PointElement,
    LineElement,
    Tooltip,
    Legend
  );
  
interface WeightRecord {
  date: string;
  weight: number;
}

const WeightLineChart: React.FC = () => {
  const [weightRecords, setWeightRecords] = useState<WeightRecord[]>([]);

  useEffect(() => {
    // 模拟从 localStorage 中获取数据
    const storedRecords = JSON.parse(localStorage.getItem('weightRecords') || '[]');
    setWeightRecords(storedRecords);
  }, []);

  const dates = weightRecords.map(record => dayjs(record.date).format('MMM D'));
  const weights = weightRecords.map(record => record.weight);

  const data = {
    labels: dates,
    datasets: [
      {
        label: 'Weight (kg)',
        data: weights,
        fill: false,
        borderColor: '#4CAF50',
        tension: 0.1,
      },
    ],
  };

  return (
    <div>
      <h2>体重</h2>
      <div style={{ height: '300px' }}>
        <Line data={data} />
      </div>
    </div>
  );
};

export default WeightLineChart;