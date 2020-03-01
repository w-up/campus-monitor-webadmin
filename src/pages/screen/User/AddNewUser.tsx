import React from "react";
import { useObserver, useLocalStore } from "mobx-react-lite";
import { Card, Form, Input, Button, Breadcrumb, Radio, Select } from "antd";
import TextArea from "antd/lib/input/TextArea";

const { Option } = Select;
export const AddNewUser = () => {
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
          <a href="userlist">用户管理</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <a>新增用户</a>
        </Breadcrumb.Item>
      </Breadcrumb>
    <div style={{margin: 10, marginLeft: 0, fontWeight: "bold", fontSize: 20}}>新增用户</div>
    </div>
    <Card>
      <Form {...formItemLayout}>
        <Form.Item label="登录名">
          <Input placeholder="请输入登录名" />
        </Form.Item>
        <Form.Item label="用户类型">
          <Radio.Group>
            <Radio value={1}>园区用户</Radio>
            <Radio value={2}>企业用户</Radio>
            <Radio value={3}>其他</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="所属园区/企业">
          <Select placeholder="请选择">
            <Option value="china">China</Option>
            <Option value="usa">U.S.A</Option>
          </Select>
        </Form.Item>
        <Form.Item label="所属角色">
          <Select placeholder="请选择">
            <Option value="china">China</Option>
            <Option value="usa">U.S.A</Option>
          </Select>
        </Form.Item>
        <Form.Item label="密码">
          <Input.Password />
        </Form.Item>
        <Form.Item label="用户姓名">
          <Input placeholder="请输入用户姓名" />
        </Form.Item>
        <Form.Item label="联系方式">
          <Input placeholder="请输入联系方式" />
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
