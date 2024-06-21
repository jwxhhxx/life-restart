// src/components/Accounting/Accounting.tsx
import React, { useState, useEffect } from 'react';
import { Expense } from '../util/types';
import { loadEnxpense, saveEnxpense } from '../util/utils';
import { List, Button, Modal, Input, DatePicker, Select, Form } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

const { Option } = Select;

const expenseCategories = ['餐饮', '交通', '日用', '休闲', '充值', '服饰', '转账'];
const incomeCategories = ['工资', '兼职收入', '利息收入'];

const Accounting: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentExpense, setCurrentExpense] = useState<Partial<Expense>>({ type: '支出', date: moment().format('YYYY-MM-DD') });
  const [totalAmount, setTotalAmount] = useState<number>(10000);
  useEffect(() => {
    setExpenses(loadEnxpense('expenses'));
  }, []);
  useEffect(() => {
    console.log(expenses)
    let initialTotal=10000
   for(let i =0;i<expenses.length;i++){
    if(expenses[i].type==='支出'){
      initialTotal=initialTotal-expenses[i].amount
    }else{
      initialTotal=initialTotal+expenses[i].amount
    }
   }
    setTotalAmount(initialTotal);
  }, [expenses]);

  useEffect(() => {
    saveEnxpense('expenses', expenses);
  }, [expenses]);

  const showModal = () => {
    setCurrentExpense({ type: '支出', date: moment().format('YYYY-MM-DD') });
    setIsModalVisible(true);
  };

  const handleOk = () => {
    if (currentExpense.id) {
      // 修改条目的逻辑
      setExpenses(expenses.map(expense => (expense.id === currentExpense.id ? { ...expense, ...currentExpense } : expense)));
    } else {
      // 添加条目的逻辑
      setExpenses([...expenses, { ...currentExpense, id: uuidv4() } as Expense]);
    }
    setIsModalVisible(false);
    setCurrentExpense({});
    // 更新总额
    const newTotal = expenses.reduce((acc, expense) => acc + expense.amount, 0);
    setTotalAmount(newTotal);
  };
  
  const deleteExpense = (id: string) => {
    // 删除条目的逻辑
    setExpenses(expenses.filter(expense => expense.id !== id));
    // 更新总额
    const newTotal = expenses.reduce((acc, expense) => acc + expense.amount, 0);
    setTotalAmount(newTotal);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentExpense({});
  };


  return (
    <div>
      <h1 style={{textAlign:'center'}}>总额:<span style={{color:totalAmount>10000?'green':'red'}}>{totalAmount}</span> 元</h1>
      <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>Add Entry</Button>
      <List
        dataSource={expenses}
        renderItem={expense => (
          <List.Item actions={[
            <Button onClick={() => setCurrentExpense(expense)}>Edit</Button>,
            <Button danger onClick={() => deleteExpense(expense.id)}>Delete</Button>
          ]}>
            <List.Item.Meta 
              title={`${expense.type} - ${expense.category}`} 
              description={`Amount: ${expense.amount} - Date: ${expense.date}`}
            />
          </List.Item>
        )}
      />
      <Modal title="Add Entry" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Form layout="vertical">
          <Form.Item label="Type">
            <Select
              value={currentExpense.type}
              onChange={(value: string) => setCurrentExpense({ ...currentExpense, type: value })}
            >
              <Option value="支出">支出</Option>
              <Option value="收入">收入</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Category">
            <Select
              value={currentExpense.category}
              onChange={(value: string) => setCurrentExpense({ ...currentExpense, category: value })}
            >
              {(currentExpense.type === '支出' ? expenseCategories : incomeCategories).map(category => (
                <Option key={category} value={category}>{category}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Amount">
            <Input
              type="number"
              value={currentExpense.amount}
              onChange={e => setCurrentExpense({ ...currentExpense, amount: parseFloat(e.target.value) })}
            />
          </Form.Item>
          <Form.Item label="Date">
            <DatePicker
              value={currentExpense.date ? moment(currentExpense.date) : moment()}
              onChange={date => setCurrentExpense({ ...currentExpense, date: date ? date.format('YYYY-MM-DD') : '' })}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Accounting;
