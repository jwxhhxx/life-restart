import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { Layout, Menu } from "antd";
import {
  HomeOutlined,
  CalendarOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
// import HomePage from './page/HomePage';
import PlansPage from "./page/PlansPage";
import AccountingPage from "./page/Accounting";
import StatisticsPage from "./page/StatisticsPage";
import WeightTracker from "./page/WeightTracker";
const { Header, Content, Footer } = Layout;

const App: React.FC = () => {
  const logo = require("../src/asset/img/logo.jpg");
  return (
    <Router>
      <Layout>
        <Header>
          <div className="logo">
            <img
              src={logo}
              alt="Logo"
              style={{
                width: "30px",
                borderRadius: "30px",
                marginRight: "10px",
              }}
            />
            <span style={{ color: "white",fontWeight:'bold',fontSize:'18px' }}>人生重启计划</span>
          </div>
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]}>
            <Menu.Item key="1" icon={<HomeOutlined />}>
              <Link to="/">首页</Link>
            </Menu.Item>
            <Menu.Item key="2" icon={<CalendarOutlined />}>
              <Link to="/plans">计划</Link>
            </Menu.Item>
            <Menu.Item key="3" icon={<BarChartOutlined />}>
              <Link to="/Accounting">记账</Link>
            </Menu.Item>
            <Menu.Item key="4" icon={<BarChartOutlined />}>
              <Link to="/weight">体重记录</Link>
            </Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: "0 50px" }}>
          <Routes>
            <Route path="/" element={<StatisticsPage />} />
            <Route path="/plans" element={<PlansPage />} />
            <Route path="/Accounting" element={<AccountingPage />} />
            <Route path="/weight" element={<WeightTracker />} />
          </Routes>
        </Content>
        <Footer style={{ textAlign: "center" }}>Life Planner ©2024</Footer>
      </Layout>
    </Router>
  );
};

export default App;
