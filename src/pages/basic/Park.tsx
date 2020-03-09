import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { toJS } from 'mobx';
import { useStore } from "../../stores/index";
import { Card, Form, Button, Input, Select, Table, Badge, Divider, Breadcrumb, Alert, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";

export const ParkPage = observer(() => {

  const {
    base: { park }
  } = useStore();

  const {
    dataSource, query, selectedRowKeys, total, onSelectChange, paginationChange, deletePark, editPark,
    handleSearchSubmit, handleSearchChange, handleSearchReset, resetSelectedRowKeys
  } = park;

  useEffect(() => {
    park.getParkList();
  }, []);
  
  console.log('dataSource', toJS(dataSource));

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const pagination = {
    current: query.current,
    pageSize: query.pageSize,
    total,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total) => {
      return '共 ' + total + ' 条记录'
    },
    onChange: paginationChange,
  };

  const clickDeletePark = (item) => {
    console.log(item);
    Modal.confirm({
      title: '删除确认',
      icon: <ExclamationCircleOutlined />,
      content: '确定删除这条记录吗？',
      onOk() {
        return deletePark([ item.id ]);
      },
      onCancel() {},
    });
  }

  const columns = [
    {
      title: '园区编号',
      dataIndex: 'parkNo',
    },
    {
      title: '园区名称',
      dataIndex: 'parkName',
    },
    {
      title: '描述',
      dataIndex: 'remark',
    },
    {
      title: '园区范围',
      render: () => {
        return <a>查看</a>
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      sorter: (a, b) => a.createTime - b.createTime,
    },
    {
      title: '操作',
      dataIndex: 'action',
      render: (text: any, record: any) => (
        <span>
          <a onClick={() => clickDeletePark(record)}>删除</a>
          <Divider type="vertical" />
          <a onClick={() => editPark(record)}>修改</a>
        </span>
      )
    }
  ];

  const selectMsg = (num: number) => {
    return (
      <div>已选择 <a>{num}</a> 项 <a onClick={resetSelectedRowKeys}>清空</a></div>
    )
  }

  return (
    <div>
      <div style={{ minHeight: 50, background: "#fff", marginBottom: 20, border: "1px solid #e8e8e8", borderLeft: 0, borderRight: 0, padding: "20px" }}>
        <Breadcrumb>
          <Breadcrumb.Item>基础信息</Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="base/park">园区管理</Link>
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <Card>
        <div>
          <Form layout="inline" onSubmit={handleSearchSubmit}>
            <Form.Item label="园区名称">
              <Input placeholder="请输入" value={query.parkName} onChange={handleSearchChange} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                查询
            </Button>
              <Button style={{ marginLeft: 5 }} onClick={handleSearchReset}>
                重置
            </Button>
            </Form.Item>
          </Form>
        </div>

        <div style={{ marginTop: 20, marginBottom: 10 }}>
          <Button type="primary"><Link to="add-park">新建</Link></Button>
          <Button style={{ marginLeft: 5, marginRight: 5 }}>批量删除</Button>
        </div>
        <div style={{ marginTop: 20, marginBottom: 10 }}>
          <Alert message={selectMsg(selectedRowKeys.length)} type="info" showIcon />
        </div>
        <div>
          <Table rowSelection={rowSelection} columns={columns} dataSource={toJS(dataSource)} pagination={pagination} />
        </div>
      </Card>
    </div>
  );
})