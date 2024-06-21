// src/components/ReadingTracking/ReadingTracking.tsx
import React, { useState, useEffect } from "react";
import { ReadingEntry } from "../util/types";
import { loadReadingEntry, saveReadingEntry } from "../util/utils";
import {
  List,
  Button,
  Modal,
  Input,
  InputNumber,
  Select,
  Progress,
  DatePicker,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";

const { Option } = Select;

const ReadingTracking: React.FC = () => {
  const [entries, setEntries] = useState<ReadingEntry[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<Partial<ReadingEntry>>({
    type: "书籍",
    progress: 0,
    timeSpent: 0,
  });

  useEffect(() => {
    setEntries(loadReadingEntry("readingEntries"));
  }, []);

  useEffect(() => {
    saveReadingEntry("readingEntries", entries);
  }, [entries]);

  const showModal = (entry?: ReadingEntry) => {
    setCurrentEntry(entry || { type: "书籍", progress: 0, timeSpent: 0 });
    setIsModalVisible(true);
  };

  const handleOk = () => {
    if (currentEntry.id) {
      setEntries(
        entries.map((entry) =>
          entry.id === currentEntry.id ? { ...entry, ...currentEntry } : entry
        )
      );
    } else {
      setEntries([
        ...entries,
        {
          ...currentEntry,
          id: uuidv4(),
          lastUpdated: dayjs().format("YYYY-MM-DD"),
        } as ReadingEntry,
      ]);
    }
    setIsModalVisible(false);
    setCurrentEntry({});
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentEntry({});
  };

  const updateProgress = (id: string, progress: number, timeSpent: number) => {
    setEntries(
      entries.map((entry) => {
        if (entry.id === id) {
          return {
            ...entry,
            progress: Math.min(entry.total, entry.progress + progress),
            timeSpent: entry.timeSpent + timeSpent,
            lastUpdated: dayjs().format("YYYY-MM-DD"),
          };
        }
        return entry;
      })
    );
  };

  return (
    <div>
      <h2>输入清单</h2>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => showModal()}
      >
        新增
      </Button>
      <List
        dataSource={entries}
        renderItem={(entry) => (
          <List.Item
            style={{ display: "flex" }}
            actions={[<Button onClick={() => showModal(entry)}>编辑</Button>]}
          >
            <List.Item.Meta
              title={`${entry.title} - ${entry.author||'--'}`}
              description={`类型: ${entry.type} | 进度: ${entry.progress}/${entry.total} | 花费时间: ${entry.timeSpent} minutes`}
            />
            <Progress
              style={{ marginRight: "20px", width: "10%" }}
              percent={Math.round((entry.progress / entry.total) * 100)}
            />
            输入数量：
            <InputNumber
              min={0}
              placeholder={`Update Progress (${
                entry.type === "书籍" ? "pages" : "episodes"
              })`}
              onPressEnter={(e) =>
                updateProgress(
                  entry.id,
                  parseInt((e.target as HTMLInputElement).value),
                  0
                )
              }
            />
            时长：
            <InputNumber
              min={0}
              placeholder="Time Spent (minutes)"
              onPressEnter={(e) =>
                updateProgress(
                  entry.id,
                  0,
                  parseInt((e.target as HTMLInputElement).value)
                )
              }
            />
          </List.Item>
        )}
      />
      <Modal
        title="Reading/Watching Entry"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Input
          placeholder="Title"
          value={currentEntry.title}
          onChange={(e) =>
            setCurrentEntry({ ...currentEntry, title: e.target.value })
          }
        />
        <Input
          placeholder="Author"
          value={currentEntry.author}
          onChange={(e) =>
            setCurrentEntry({ ...currentEntry, author: e.target.value })
          }
        />
        <Select
          value={currentEntry.type}
          onChange={(value: string) =>
            setCurrentEntry({ ...currentEntry, type: value })
          }
        >
          <Option value="书籍">书籍</Option>
          <Option value="电影">电影</Option>
          <Option value="动漫">动漫</Option>
        </Select>
        <InputNumber
          min={1}
          placeholder="Total (pages or episodes)"
          value={currentEntry.total}
          onChange={(value: any) =>
            setCurrentEntry({ ...currentEntry, total: value })
          }
        />
      </Modal>
    </div>
  );
};

export default ReadingTracking;
