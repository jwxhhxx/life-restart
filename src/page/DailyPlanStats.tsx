import React, { useState, useEffect } from 'react';
import { Plan } from '../util/types';
import { loadPlans } from '../util/utils';
import dayjs from 'dayjs';

interface Stats {
  completed: number;
  incomplete: number;
}
const DailyPlanStats: React.FC = () => {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [stats, setStats] = useState<Stats>({ completed: 0, incomplete: 0 });
  
    useEffect(() => {
      const loadedPlans = loadPlans('dayPlans');
      setPlans(loadedPlans);
    }, []);
  
    useEffect(() => {
      const completedCount = plans.filter(plan => plan.completed).length;
      const incompleteCount = plans.length - completedCount;
      setStats({ completed: completedCount, incomplete: incompleteCount });
    }, [plans]);
  
    return (
      <div>
        <h3>统计信息</h3>
        <p>完成任务数量: {stats.completed}</p>
        <p>未完成任务数量: {stats.incomplete}</p>
      </div>
    );
  };
  
  export default DailyPlanStats;
  