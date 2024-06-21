import React, { useState, useEffect } from 'react';
import { Plan } from '../util/types';
import { loadPlans } from '../util/utils';
import { Calendar } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import './DayPlanCalendar.css'; // 导入自定义样式

dayjs.locale('zh-cn');

const DayPlanCalendar: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(dayjs().format('YYYY-MM-DD'));

  useEffect(() => {
    setPlans(loadPlans('dayPlans'));
  }, []);

  const morandiColors = [
    '#F19483', // Warm Gray
    '#9B90C2', // Warm Beige
    '#B28FCE', // Muted Brown
    '#A5DEE4', // Soft Blue-Gray
    '#B5CAA0', // Dusty Rose
    '#FEDFE1', // Pale Khaki
    '#D9AB42', // Light Steel Blue
  ];

  const getRandomColor = () => {
    return morandiColors[Math.floor(Math.random() * morandiColors.length)];
  };

  return (
    <div className='calendar'>
      <h2>任务日历</h2>
      <Calendar 
        value={dayjs(selectedDate)}
        onChange={(date) => setSelectedDate(date.format('YYYY-MM-DD'))}
        onSelect={(date) => setSelectedDate(date.format('YYYY-MM-DD'))}
        dateCellRender={(date) => {
          const formattedDate = date.format('YYYY-MM-DD');
          const plansOnDate = plans.filter(plan => plan.date === formattedDate);
          return (
            <ul className="task-list">
              {plansOnDate.map(plan => (
                <li 
                  key={plan.id}
                  className="task-item"
                  style={{ backgroundColor: getRandomColor() }}
                >
                  {plan.title}
                </li>
              ))}
            </ul>
          );
        }}
      />
    </div>
  );
};

export default DayPlanCalendar;
