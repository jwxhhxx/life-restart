import React, { useState, useEffect } from 'react';
import { Plan } from '../util/types';
import { loadPlans, savePlans } from '../util/utils';
import { List, Button, Modal, Input, Checkbox, DatePicker, Upload, Calendar } from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { UploadFile, UploadProps } from 'antd/es/upload/interface';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';

import 'dayjs/locale/zh-cn'; // 加载中文语言包
dayjs.locale('zh-cn'); // 设置 dayjs 使用中文语言包

const { RangePicker } = DatePicker;

const DayPlan: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<Partial<Plan>>({});
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(dayjs().format('YYYY-MM-DD'));

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

  return (
    <div>
      <h2>Day Plan</h2>
      <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>Add Plan</Button>
      <List
        dataSource={plans}
        renderItem={plan => (
          <List.Item actions={[
            <Checkbox checked={plan.completed} onChange={() => toggleCompleted(plan.id)}>Completed</Checkbox>,
            <Button onClick={() => showModal(plan)}>Edit</Button>,
            <Button danger onClick={() => deletePlan(plan.id)}>Delete</Button>
          ]}>
            <List.Item.Meta
              title={plan.title}
              description={`${plan.description} - ${plan.date}`}
            />
            {plan.imageUrl && <img src={plan.imageUrl} alt={plan.title} style={{ width: 100, height: 100 }} />}
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
