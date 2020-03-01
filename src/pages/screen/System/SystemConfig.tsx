import React from "react";
import { useObserver, useLocalStore } from "mobx-react-lite";
import { Card, Form, Button, Input, Select, Table, Badge, Divider, Breadcrumb, Modal, Tree } from 'antd'
import { RouteChildrenProps } from "react-router";
import { Link } from "react-router-dom";

const { TreeNode } = Tree;
const { Option } = Select;
type Props = RouteChildrenProps<{}>


export const SystemConfigration = (props: Props) => {
  const rowSelection = useLocalStore(() => ({
    onChange: (selectedRowKeys:any, selectedRows:any) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: (record:any) => ({
      disabled: record.name === 'Disabled User', // Column configuration not to be checked
      name: record.name,
    }),
  }))

  const isShowEle = useLocalStore(() => ({
    isShowModal: false
  }))

  const configAuthorization = () => {
    console.log('aaa')
  }

  const cancelConfig = () => {
    isShowEle.isShowModal = false
  }

  const openModal = () => {
    isShowEle.isShowModal = true
    console.log('aa')
  }

  const columns = useLocalStore(() => ([
    {
      title: '角色编号',
      dataIndex: 'roleId',
    },
    {
      title: '角色名',
      dataIndex: 'roleName',
    },
    {
      title: '描述',
      dataIndex: 'desc',
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
          <a onClick={() => props.history.push('addOrEditRole')}>修改</a>
          <Divider type="vertical" />
          <a onClick={() => openModal()}>权限配置</a>
        </span>
      ),
    }
  ]))
  const data = useLocalStore(() => ([
    {
      key: '1',
      id: 1,
      roleId: 'TradeCode21',
      roleName: '园区管理员',
      desc: '园区1',
      status: '正常',
      createTime: '2019-02-21',
    },
    {
      key: '2',
      id: 2,
      roleId: 'TradeCode21',
      roleName: '园区管理员',
      desc: '园区1',
      status: '正常',
      createTime: '2019-02-21',
    },
    {
      key: '3',
      id: 3,
      roleId: 'TradeCode21',
      roleName: '园区管理员',
      desc: '园区1',
      status: '正常',
      createTime: '2019-02-21',
    },
    {
      key: '4',
      id: 4,
      roleId: 'TradeCode21',
      roleName: '园区管理员',
      desc: '园区1',
      status: '正常',
      createTime: '2019-02-21',
    },
  ]))

 return useObserver(() => 
 <div>
    <div style={{minHeight: 50, background: "#fff", marginBottom: 20, border: "1px solid #e8e8e8", borderLeft: 0, borderRight: 0, padding: "20px"}}>
      <Breadcrumb>
        <Breadcrumb.Item>系统参数配置</Breadcrumb.Item>
      </Breadcrumb>
    </div>
    <Card>
      <div>
        <Form layout="inline" onSubmit={()=> console.log('aa')}>
        <Form.Item label="参数名">
        <Input placeholder="请输入"
        />
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
        <Button type="primary" onClick={()=> props.history.push('addOrEditRole')}>新建</Button>
        <Button  style={{ marginLeft: 5, marginRight: 5 }}>批量删除</Button>
      </div>

      <div>
        <Table rowSelection={rowSelection} columns={columns} dataSource={data} />
      </div>
    </Card>;
    <div>
      <Modal
          title="权限配置"
          visible={isShowEle.isShowModal}
          onOk={() => configAuthorization}
          onCancel={() => cancelConfig()}
        >
        <div>
          <Tree
            checkable
            defaultExpandedKeys={['0-0-0', '0-0-1']}
            defaultSelectedKeys={['0-0-0', '0-0-1']}
            defaultCheckedKeys={['0-0-0', '0-0-1']}
          >
            <TreeNode title="parent 1" key="0-0">
              <TreeNode title="parent 1-0" key="0-0-0">
                <TreeNode title="leaf" key="0-0-0-0" />
                <TreeNode title="leaf" key="0-0-0-1" />
              </TreeNode>
              <TreeNode title="parent 1-1" key="0-0-1">
                <TreeNode title={<span style={{ color: '#1890ff' }}>sss</span>} key="0-0-1-0" />
              </TreeNode>
            </TreeNode>
          </Tree>
        </div>
      </Modal>
    </div>
  </div>);
};
