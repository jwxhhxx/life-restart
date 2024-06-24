// src/components/InspirationNote.tsx
import React, { useState, useEffect } from "react";
import { List, Button, Modal, Input, Form, Tag, message } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";
import "./InspirationNote.css"; // 用于动画效果
import Bottle from "./Bottle";

interface Inspiration {
  id: string;
  date: string;
  title: string;
  content: string;
  tags: string[];
}

const InspirationNote: React.FC = () => {
  const [inspirations, setInspirations] = useState<Inspiration[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentInspiration, setCurrentInspiration] = useState<
    Partial<Inspiration>
  >({});
  const [isEditing, setIsEditing] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [form] = Form.useForm();
  useEffect(() => {
    const storedInspirations = localStorage.getItem("inspirations");
    if (storedInspirations) {
      setInspirations(JSON.parse(storedInspirations));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("inspirations", JSON.stringify(inspirations));
  }, [inspirations]);

  const showModal = (inspiration?: Inspiration) => {
    form.resetFields();
    if (inspiration) {
      const list:any={...inspiration}
      const newList={...list,tags:list.tags.join(',')}
      form.setFieldsValue(newList)
      console.log(newList)
      setCurrentInspiration(inspiration);
      setIsEditing(true);
    } else {
      setCurrentInspiration({});
      setIsEditing(false);
    }
    setIsModalVisible(true);
  };

  const handleOk = (values: {
    title: string;
    content: string;
    tags: string;
  }) => {
    console.log(values)
    const tagsArray = values.tags?.split(",").map((tag) => tag.trim());
    if (isEditing && currentInspiration.id) {
      setInspirations(
        inspirations.map((insp) =>
          insp.id === currentInspiration.id
            ? { ...insp, ...values, tags: tagsArray }
            : insp
        )
      );
      message.success("修改灵感成功");
    } else {
      const newInspiration = {
        id: uuidv4(),
        date: dayjs().format("YYYY-MM-DD HH:mm:ss"),
        title: values.title,
        content: values.content,
        tags: tagsArray,
      };
      setInspirations([...inspirations, newInspiration]);
      setIsAnimating(true);
      setTimeout(() => {
        setIsAnimating(false);
        message.success("新增灵感成功");
      }, 3000);
    }
    setIsModalVisible(false);
    setCurrentInspiration({});
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentInspiration({});
    form.resetFields();
  };

  const deleteInspiration = (id: string) => {
    setInspirations(inspirations.filter((insp) => insp.id !== id));
    message.success("删除灵感成功");
  };

  return (
    <div className="inspiration-container">
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => showModal()}
      >
        新增灵感
      </Button>
      <List
        dataSource={inspirations}
        renderItem={(inspiration) => (
          <List.Item
            actions={[
              <Button
                icon={<EditOutlined />}
                type="text"
                onClick={() => showModal(inspiration)}
              >
              </Button>,
              <Button
                danger
                type="text"
                icon={<DeleteOutlined />}
                onClick={() => deleteInspiration(inspiration.id)}
              >
              </Button>,
            ]}
          >
            <List.Item.Meta
              title={inspiration.title}
              description={
                <>
                  <div>{inspiration.date}</div>
                  <div>
                    {inspiration.content.length > 100
                      ? `${inspiration.content.substring(0, 100)}...`
                      : inspiration.content}
                  </div>
                  <div>
                    {inspiration.tags.map((tag) => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                  </div>
                </>
              }
            />
          </List.Item>
        )}
      />
      {isAnimating && <Bottle></Bottle>}
      <Modal
        title={isEditing ? "Edit Inspiration" : "Add Inspiration"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          onFinish={handleOk}
          form={form}
        >
          <Form.Item
            name="title"
            rules={[{ required: true, message: "输入标题" }]}
          >
            <Input placeholder="Title" />
          </Form.Item>
          <Form.Item
            name="content"
            rules={[{ required: true, message: "输入灵感" }]}
          >
            <Input.TextArea
              rows={10}
              placeholder="在这里输入你的灵感"
            />
          </Form.Item>
          <Form.Item
            name="tags"
            rules={[{ required: false, message: "输入标签" }]}
          >
            <Input placeholder="输入灵感的标签,多个标签用逗号间隔开来" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {isEditing ? "编辑" : "新增"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default InspirationNote;
