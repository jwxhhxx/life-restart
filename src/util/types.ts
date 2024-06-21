export interface Plan {
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