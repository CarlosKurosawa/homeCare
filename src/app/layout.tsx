"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import React, { useState } from 'react';
import {
    DesktopOutlined,
    FileOutlined, InboxOutlined,
    PieChartOutlined,
    TeamOutlined,
    UserOutlined, WechatOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import Link from 'next/link';
import {DashboardCustomizeOutlined} from "@mui/icons-material";

const inter = Inter({ subsets: ["latin"] });
const { Header, Content, Footer, Sider } = Layout;


type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
    getItem(<Link href="/">Início</Link>, '1', <DashboardCustomizeOutlined/>),
    getItem(<Link href="/chat/">Chat</Link>, '2', <WechatOutlined />),
    getItem(<Link href="/estoque/">Estoque</Link>, '3', <InboxOutlined />),
    getItem(<Link href="/pacientes/">Pacientes</Link>, '4', <UserOutlined />),



];

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
      <html lang="en">
      <body className={inter.className}>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
          <div className="demo-logo-vertical" />
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
        </Sider>
        <Layout>
          <Content>
              {children}
          </Content>
        </Layout>
      </Layout>
      </body>
      </html>
  );
}
