'use client'
import React, { useMemo, useState } from 'react';
import { Button, Form, Input, Modal, Table } from 'antd';
import type { TableColumnsType } from 'antd';

import { feeds as Feed } from '@prisma/client';
import Link from 'next/link';

type FeedsProps = {
  feeds: Feed[]
}

type FieldType = {
  share_id: string,
  file_id: string,
  parent_file_id: string,
  name: string
}

const { Item: FromItem } = Form

const FeedsTable = (props: FeedsProps) => {
  const { feeds } = props
  const columns: TableColumnsType<Feed> = useMemo(() => {
    return [
      {
        title: 'name',
        dataIndex: 'name',
        key: 'name',
        ellipsis: true
      },
      {
        title: '操作',
        dataIndex: 'handle',
        width: '200px',
        key: 'handle',
        render: (text, record) => {
          return <>
            <Link className="mr-1" href={`./${record.file_id}`}>子目录</Link>
            <a href={`./${record.file_id}`}>删除</a>
          </>
        }
      },
    ];
  }, [])


  // 弹窗
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <Button onClick={showModal}>新增</Button>
      </div>
      <Table
        pagination={false}
        columns={columns}
        dataSource={feeds.map(f => ({key: f.file_id, ...f}))}
      />
      <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          autoComplete="off"
        >
          <FromItem<FieldType>
            label="share_id"
            name="share_id"
            rules={[{ required: true, message: '请输入 share_id!' }]}
          >
            <Input />
          </FromItem>
          <FromItem<FieldType>
            label="file_id"
            name="file_id"
            rules={[{ required: true, message: '请输入 file_id!' }]}
          >
            <Input />
          </FromItem>
          <FromItem<FieldType>
            label="parent_file_id"
            name="parent_file_id"
            
            rules={[{ required: true, message: '请输入 parent_file_id!' }]}
          >
            <Input disabled />
          </FromItem>
          <FromItem<FieldType>
            label="name"
            name="name"
            rules={[{ required: true, message: '请输入 name!' }]}
          >
            <Input />
          </FromItem>
        </Form>
      </Modal>
    </div>
  );
};

export default FeedsTable;