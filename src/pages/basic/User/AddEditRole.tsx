import React from "react";
import { useObserver, useLocalStore } from "mobx-react-lite";
import { Card, Form, Input, Button, Breadcrumb, Tree } from "antd";
import TextArea from "antd/lib/input/TextArea";
const { TreeNode } = Tree;

export const AddEditRole = () => {
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 10 },
      sm: { span: 10 },
    },
  };
  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 16,
        offset: 8,
      },
    },
  };
  const loadingInfo = useLocalStore(() => ({ loading: false }))
  return useObserver(() => <div>
    <div style={{height: 100, background: "#fff", marginBottom: 20, border: "1px solid #e8e8e8", borderLeft: 0, borderRight: 0, padding: "20px"}}>
      <Breadcrumb>
        <Breadcrumb.Item>基础信息</Breadcrumb.Item>
        <Breadcrumb.Item>
          <a href="role">角色管理</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <a>新增角色</a>
        </Breadcrumb.Item>
      </Breadcrumb>
    <div style={{margin: 10, marginLeft: 0, fontWeight: "bold", fontSize: 20}}>新增角色</div>
    </div>
    <Card>
      <Form {...formItemLayout}>
        <Form.Item label="角色代码">
          <Input placeholder="请输入角色代码" />
        </Form.Item>
        <Form.Item label="角色名称" hasFeedback>
          <Input placeholder="请输入角色名称" />
        </Form.Item>
        <Form.Item label="描述" hasFeedback>
          <TextArea rows={4} placeholder='请输入描述' />
        </Form.Item>
        <Form.Item label="权限配置">
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
        </Form.Item>
        
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
          <Button style={{marginLeft: 5, marginRight: 5}} loading={loadingInfo.loading}>保存</Button>
        </Form.Item>
      </Form>
    </Card>
  </div>)
};
