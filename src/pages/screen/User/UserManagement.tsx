import React from "react";
import { useObserver, useLocalStore } from "mobx-react-lite";
import { Card, Form, Button, Input, Select, Table, Badge, Divider, Breadcrumb } from 'antd'
import { RouteChildrenProps } from "react-router";
import { Link } from "react-router-dom";

const { Option } = Select;
type Props = RouteChildrenProps<{}>


export const UserManagementPage = (props: Props) => {
  const rowSelection = useLocalStore(() => ({
    onChange: (selectedRowKeys:any, selectedRows:any) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: (record:any) => ({
      disabled: record.name === 'Disabled User', // Column configuration not to be checked
      name: record.name,
    }),
  }))
  const columns = useLocalStore(() => ([
    {
      title: '登录名',
      dataIndex: 'loginName',
    },
    {
      title: '所属园区/企业',
      dataIndex: 'belongs',
    },
    {
      title: '用户名称',
      dataIndex: 'name',
    },
    {
      title: '角色',
      dataIndex: 'roles',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: () => {
        return <Badge status="processing" text="正常" />
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
    },
    {
      title: '操作',
      dataIndex: 'action',
      render: (text:any, record:any) => (
        <span>
          <a>删除</a>
          <Divider type="vertical" />
          <a onClick={() => props.history.push('addOrEditUser')}>修改</a>
        </span>
      ),
    }
  ]))
  const data = useLocalStore(() => ([
    {
      key: '1',
      id: 1,
      loginName: 'TradeCode21',
      name: '用户1',
      belongs: '园区1',
      status: '正常',
      roles: '企业用户',
      createTime: '2019-02-21',
    },
    {
      key: '2',
      id: 2,
      loginName: 'TradeCode21',
      name: '用户2',
      belongs: '园区1',
      status: '正常',
      roles: '企业用户',
      createTime: '2019-02-21',
    },
    {
      key: '3',
      id: 3,
      loginName: 'TradeCode21',
      name: '用户3',
      belongs: '园区1',
      status: '正常',
      roles: '企业用户',
      createTime: '2019-02-21',
    },
    {
      key: '4',
      id: 4,
      loginName: 'TradeCode21',
      name: '用户4',
      belongs: '园区1',
      status: '正常',
      roles: '企业用户',
      createTime: '2019-02-21',
    },
  ]))

 return useObserver(() => 
 <div>
    <div style={{minHeight: 50, background: "#fff", marginBottom: 20, border: "1px solid #e8e8e8", borderLeft: 0, borderRight: 0, padding: "20px"}}>
      <Breadcrumb>
        <Breadcrumb.Item>基础信息</Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="user/userlist">用户管理</Link>
        </Breadcrumb.Item>
      </Breadcrumb>
    </div>
    <Card>
      <div>
        <Form layout="inline" onSubmit={()=> console.log('aa')}>
        <Form.Item label="登录名">
        <Input placeholder="请输入"
        />
        </Form.Item>
        <Form.Item label="状态">
          <Select style={{ width: 150 }}>
            <Option value="86">status</Option>
            <Option value="87">status</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            查询
          </Button>
          <Button style={{ marginLeft: 5}}>
            重置
          </Button>
        </Form.Item>
      </Form>
      </div>

      <div style={{marginTop: 20, marginBottom: 10}}>
        <Button type="primary" onClick={()=> props.history.push('addOrEditUser')}>新建</Button>
        <Button  style={{ marginLeft: 5, marginRight: 5 }}>批量删除</Button>
        <Button>密码重制</Button>
      </div>

      <div>
        <Table rowSelection={rowSelection} columns={columns} dataSource={data} />
      </div>
    </Card>;
  </div>);
};
