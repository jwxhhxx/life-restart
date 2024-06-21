import React, { useState, useEffect } from 'react';
import { Plan } from '../util/types';
import { loadPlans, savePlans } from '../util/utils';
import { List, Button, Modal, Input, Checkbox } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';

const YearPlan: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<Partial<Plan>>({});

  useEffect(() => {
    setPlans(loadPlans('yearPlans'));
  }, []);

  useEffect(() => {
    savePlans('yearPlans', plans);
  }, [plans]);

  const showModal = (plan?: Plan) => {
    setCurrentPlan(plan || {});
    setIsModalVisible(true);
  };

  const handleOk = () => {
    if (currentPlan.id) {
      setPlans(plans.map(plan => (plan.id === currentPlan.id ? { ...plan, ...currentPlan } : plan)));
    } else {
      setPlans([...plans, { ...currentPlan, id: uuidv4(), completed: false } as Plan]);
    }
    setIsModalVisible(false);
    setCurrentPlan({});
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentPlan({});
  };

  const deletePlan = (id: string) => {
    setPlans(plans.filter(plan => plan.id !== id));
  };

  const toggleCompleted = (id: string) => {
    setPlans(plans.map(plan => (plan.id === id ? { ...plan, completed: !plan.completed } : plan)));
  };

  return (
    <div>
      <h2>长期任务</h2>
      <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>Add Plan</Button>
      <List
        dataSource={plans}
        renderItem={plan => (
          <List.Item actions={[
            <Checkbox checked={plan.completed} onChange={() => toggleCompleted(plan.id)}>Completed</Checkbox>,
            <Button onClick={() => showModal(plan)}>Edit</Button>,
            <Button danger onClick={() => deletePlan(plan.id)}>Delete</Button>
          ]}>
            <List.Item.Meta title={plan.title} description={plan.description} />
          </List.Item>
        )}
      />
      <Modal title="Plan" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Input
          placeholder="Title"
          value={currentPlan.title}
          onChange={e => setCurrentPlan({ ...currentPlan, title: e.target.value })}
        />
        <Input
          placeholder="Description"
          value={currentPlan.description}
          onChange={e => setCurrentPlan({ ...currentPlan, description: e.target.value })}
        />
      </Modal>
    </div>
  );
};

export default YearPlan;
