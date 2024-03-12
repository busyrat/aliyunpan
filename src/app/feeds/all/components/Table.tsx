'use client'
import React, { useEffect, useMemo, useState } from 'react';
import { Button, Form, Input, Modal, Table, type FormInstance } from 'antd';
import type { TableColumnsType } from 'antd';

import { feeds as Feed } from '@prisma/client';
import Link from 'next/link';
import { createFeed, getFeed, getFeedDiff, refreshFeed, removeFeed } from '@/app/lib/action';
import { getFile, getList } from '@/services/dashboard';
import { Row } from '../page';

type FeedsProps = {
  feeds: Row[]
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
  const columns: TableColumnsType<Row> = useMemo(() => {
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
            <a className="mr-1" onClick={() => removeFeed(record.id)}>删除</a>
            <a onClick={() => refreshFeed(record.file_id as string)}>更新</a>
          </>
        }
      },
    ];
  }, [])


  // 弹窗
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm()
  const [formInstance, setFormInstance] = useState<FormInstance>();

  useEffect(() => {
    setFormInstance(form);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    console.log(formInstance);
    
    const values = await formInstance?.validateFields();
    let file
    if (!values.file_id) {
      const list = await getList(values.share_id, 'root')
      file = list[0]
      form.setFieldValue('file_id', list[0].file_id)
      values.file_id = list[0].file_id
    } else {
      file = await getFile(values.share_id, values.file_id)
    }

    form.setFieldValue('parent_file_id', file.parent_file_id)
    values.parent_file_id = file.parent_file_id
    
    if (!values.name) {
      form.setFieldValue('name', file.name)
      values.name = file.name
    }
    await createFeed(values)
    setIsModalOpen(false)
    form.resetFields()
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
        expandable={{
          expandedRowRender: (record) => <p style={{ margin: 0 }}>{record.mixes.map(f => f.name).join(',')}</p>,
          rowExpandable: (record) => !!record.mixes.length,
          onExpand: async (isExpand, record) => {
            console.log(record);
          },
        }}
      />
      <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Form
          form={form}
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
            rules={[{ required: false, message: '请输入 file_id!' }]}
          >
            <Input />
          </FromItem>
          <FromItem<FieldType>
            label="parent_file_id"
            name="parent_file_id"
            rules={[{ required: false, message: '请输入 parent_file_id!' }]}
          >
            <Input disabled />
          </FromItem>
          <FromItem<FieldType>
            label="name"
            name="name"
            rules={[{ required: false, message: '请输入 name!' }]}
          >
            <Input />
          </FromItem>
        </Form>
      </Modal>
    </div>
  );
};

export default FeedsTable;