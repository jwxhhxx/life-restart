import { SimulationNodeDatum } from 'd3';
export interface Plan extends SimulationNodeDatum {
    id: string;
    title: string;
    description: string;
    date: string;
    completed: boolean;
    timeSpent?: number; // 花费的时间，以分钟为单位
    imageUrl?: string; // 图片 URL
  }
  export interface Expense {
    id: string;
    type:string;
    category: string;
    amount: number;
    date: string;
  }
  export interface ReadingEntry {
    id: string;
    title: string;
    author: string;
    type: string;
    total: number; // 总页数或总集数
    progress: number; // 当前进度（页数或集数）
    timeSpent: number; // 记录时间（分钟）
    lastUpdated: string; // 最后更新日期
  }