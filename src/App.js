import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import Register from './Register';
import Login from './Login';
import Chat from './Chat';
import { AuthProvider, useAuth } from './context/AuthContext';
import PrivateRoute from './PrivateRoute';

const { Header, Content, Footer } = Layout;

const CustomHeader = () => {
  const { isLoggedIn, logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout(); // Call logout function from AuthContext
  };

  const getSelectedKey = () => {
    if (location.pathname === '/register') return '2';
    if (location.pathname === '/login') return '3';
    return '1'; // Default to Chat
  };

  return (
    <Header>
      <Menu theme="dark" mode="horizontal" selectedKeys={[getSelectedKey()]}>
        <Menu.Item key="1">
          <Link to="/">Chat</Link>
        </Menu.Item>
        {isLoggedIn ? (
          <Menu.Item key="4" onClick={handleLogout}>
            Logout
          </Menu.Item>
        ) : (
          <>
            <Menu.Item key="2">
              <Link to="/register">Register</Link>
            </Menu.Item>
            <Menu.Item key="3">
              <Link to="/login">Login</Link>
            </Menu.Item>
          </>
        )}
      </Menu>
    </Header>
  );
};
const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Layout style={{minHeight:'100vh'}}>
          <CustomHeader />
          <Content style={{ padding: '0 50px' }}>
            <div className="site-layout-content" style={{ padding: 24, minHeight: 380 }}>
              <Routes>
                <Route path="/" element={
                  <PrivateRoute>
                    <Chat />
                  </PrivateRoute>
                } />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
              </Routes>
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>Chat Application Assignment ©2024 Created by Ayush Baluni</Footer>
        </Layout>
      </Router>
    </AuthProvider>
  );
};

export default App;
