'use client'
import React, { useState } from 'react';
import {
  AuditOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { redirect, useRouter } from 'next/navigation';

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
  {
    key: 'feed',
    icon: <AuditOutlined />,
    label: '订阅'
  }
];

const FeedLayout= ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter()

  const handleMenu = () => {
    router.push('/feeds/all')
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider theme="light" collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <Menu defaultSelectedKeys={['1']} mode="inline" items={items} onClick={handleMenu} />
      </Sider>
      <Layout>
        <Content className="p-4">
          { children }
        </Content>
      </Layout>
    </Layout>
  );
};

export default FeedLayout;