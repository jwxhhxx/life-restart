// src/components/Plan/DayPlan.tsx
import React, { useState, useEffect } from 'react';
import { Plan } from '../util/types';
import { loadPlans, savePlans } from '../util/utils';
import { List, Button, Modal, Input, Checkbox, DatePicker, Upload, Collapse } from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { UploadFile, UploadProps } from 'antd/es/upload/interface';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import './DayPlan.css';  // 用于自定义完成任务划掉的样式

const { Panel } = Collapse;

const DayPlan: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<Partial<Plan>>({});
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    setPlans(loadPlans('dayPlans'));
  }, []);

  useEffect(() => {
    savePlans('dayPlans', plans);
  }, [plans]);

  const showModal = (plan?: Plan) => {
    setCurrentPlan(plan || { date: dayjs().format('YYYY-MM-DD') });
    setFileList(plan && plan.imageUrl ? [{
      uid: '-1',
      name: 'image.png',
      status: 'done',
      url: plan.imageUrl,
    }] : []);
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
    setFileList([]);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentPlan({});
    setFileList([]);
  };

  const deletePlan = (id: string) => {
    setPlans(plans.filter(plan => plan.id !== id));
  };

  const toggleCompleted = (id: string) => {
    const timeSpent = prompt('Enter the time spent (in minutes):');
    setPlans(plans.map(plan => 
      plan.id === id 
        ? { ...plan, completed: !plan.completed, timeSpent: plan.completed ? undefined : parseInt(timeSpent || '0', 10) }
        : plan
    ));
  };

  const handleUploadChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    if (newFileList.length > 0 && newFileList[0].status === 'done') {
      const imageUrl = newFileList[0].url || newFileList[0].response?.url;
      setCurrentPlan({ ...currentPlan, imageUrl });
    }
  };

  const uploadProps: UploadProps = {
    name: 'file',
    action: '', // 上传 URL，留空表示不进行上传
    listType: 'picture',
    fileList,
    onChange: handleUploadChange,
    beforeUpload: (file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const base64Data = reader.result as string;
        setCurrentPlan({ ...currentPlan, imageUrl: base64Data });
        setFileList([{ uid: '-1', name: file.name, status: 'done', url: base64Data }]);
      };
      return false;
    },
  };

  // 按日期分组任务
  const groupedPlans = plans.reduce((acc, plan) => {
    const date = plan.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(plan);
    return acc;
  }, {} as Record<string, Plan[]>);

  return (
    <div className="day-plan-container">
      <div className="day-plan-header">
        <h2>日任务</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>新增任务</Button>
      </div>
      <Collapse defaultActiveKey={[...Object.keys(groupedPlans)]} style={{ marginTop: '20px' }}>
        {Object.keys(groupedPlans).map(date => (
          <Panel header={date} key={date}>
            <List
              dataSource={groupedPlans[date]}
              renderItem={plan => (
                <List.Item
                  actions={[
                    <Checkbox checked={plan.completed} onChange={() => toggleCompleted(plan.id)}>完成</Checkbox>,
                    <Button onClick={() => showModal(plan)}>编辑</Button>,
                    <Button danger onClick={() => deletePlan(plan.id)}>删除</Button>
                  ]}
                >
                  <List.Item.Meta
                    title={<span className={plan.completed ? 'completed' : ''}>{plan.title}</span>}
                    description={
                      <>
                        {plan.description} - {plan.date}
                        {plan.timeSpent !== undefined && (
                          <div style={{ marginTop: '8px' }}>
                            <span style={{ color: '#888' }}>时长: {plan.timeSpent} minutes</span>
                          </div>
                        )}
                      </>
                    }
                  />
                  {plan.imageUrl && <img src={plan.imageUrl} alt={plan.title} style={{ width: 100, height: 100 }} />}
                </List.Item>
              )}
            />
          </Panel>
        ))}
      </Collapse>
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
        <DatePicker
          value={currentPlan.date ? dayjs(currentPlan.date) : dayjs()}
          onChange={date => setCurrentPlan({ ...currentPlan, date: date ? date.format('YYYY-MM-DD') : '' })}
        />
        <Upload {...uploadProps}>
          <Button icon={<UploadOutlined />}>Upload Image</Button>
        </Upload>
      </Modal>
    </div>
  );
};

export default DayPlan;
