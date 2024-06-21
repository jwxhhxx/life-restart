import { Plan,Expense } from "./types";
export const loadPlans = (key: string): Plan[] => {
    const plans = localStorage.getItem(key);
    return plans ? JSON.parse(plans) : [];
  };
  
  export const savePlans = (key: string, plans: Plan[]) => {
    localStorage.setItem(key, JSON.stringify(plans));
  };
  export const loadEnxpense = (key: string): Expense[] => {
    const plans = localStorage.getItem(key);
    return plans ? JSON.parse(plans) : [];
  };
  
  export const saveEnxpense  = (key: string, plans: Expense[]) => {
    localStorage.setItem(key, JSON.stringify(plans));
  };
export const notify = (title: string, options?: NotificationOptions) => {
  if (Notification.permission === "granted") {
    new Notification(title, options);
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        new Notification(title, options);
      }
    });
  }
};
