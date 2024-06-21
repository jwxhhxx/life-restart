import React, { useState, useEffect } from 'react';
import { Button, InputNumber, DatePicker, Space, Table, Typography } from 'antd';
import dayjs from 'dayjs';
const { Text } = Typography;

interface WeightRecord {
  date: string; // 日期字符串
  weight: number; // 体重
}

const WeightTracker: React.FC = () => {
  const [weight, setWeight] = useState<number | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState<string | undefined>(undefined);
  const [records, setRecords] = useState<WeightRecord[]>([]);
  const [chartData, setChartData] = useState<any>({
    labels: [] as string[],
    datasets: [
      {
        label: 'Weight',
        data: [] as number[],
        fill: false,
        borderColor: '#8884d8',
      },
    ],
  });

  // 从 localStorage 加载数据
  useEffect(() => {
    const storedRecords = localStorage.getItem('weightRecords');
    if (storedRecords) {
      setRecords(JSON.parse(storedRecords));
    }
  }, []);

  // 保存数据到 localStorage
  useEffect(() => {
    localStorage.setItem('weightRecords', JSON.stringify(records));
    updateChartData(); // 每次记录更新后更新折线图数据
  }, [records]);

  const handleAddRecord = () => {
    if (weight !== undefined && selectedDate) {
      // Check if there is already a record for the selected date
      const existingRecordIndex = records.findIndex(record => record.date === selectedDate);
      
      if (existingRecordIndex !== -1) {
        // If record exists for the selected date, update it
        const updatedRecords = [...records];
        updatedRecords[existingRecordIndex] = {
          date: selectedDate,
          weight: weight,
        };
        setRecords(updatedRecords);
      } else {
        // If no record exists, add a new one
        const newRecord: WeightRecord = {
          date: selectedDate,
          weight: weight,
        };
        setRecords([...records, newRecord]);
      }
      
      setWeight(undefined);
      setSelectedDate(undefined);
    }
  };

  const updateChartData = () => {
    const labels = records.map(record => dayjs(record.date).format('YYYY-MM-DD'));
    const data = records.map(record => record.weight);

    setChartData({
      labels: labels,
      datasets: [
        {
          label: 'Weight',
          data: data,
          fill: false,
          borderColor: '#8884d8',
        },
      ],
    });
  };
  const handleDelete = (date: string) => {
    const updatedRecords = records.filter(record => record.date !== date);
    localStorage.setItem('weightRecords', JSON.stringify(updatedRecords));
    setRecords(updatedRecords);
  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (text: string) => <Text>{dayjs(text).format('YYYY-MM-DD')}</Text>,
    },
    {
      title: 'Weight (kg)',
      dataIndex: 'weight',
      key: 'weight',
    },
    {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (text: string,record:any) => {
            return <div>
                 <Button onClick={() => handleDelete(record.date)}>Delete</Button>
            </div>
        },
    }
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h1>Weight Tracker</h1>
      <Space direction="vertical" style={{ marginBottom: '20px' }}>
        <DatePicker onChange={(date, dateString:any) => setSelectedDate(dateString)} />
        <InputNumber
          placeholder="Enter weight (kg)"
          min={1}
          step={0.1}
          value={weight}
          onChange={(value) => setWeight(value as number)}
        />
        <Button type="primary" onClick={handleAddRecord}>Add Record</Button>
      </Space>
      <Table columns={columns} dataSource={records} pagination={false} />
    </div>
  );
};

export default WeightTracker;
