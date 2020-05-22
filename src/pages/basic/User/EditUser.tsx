import React, { useEffect } from "react";
import { useObserver, useLocalStore, observer } from "mobx-react-lite";
import { Divider, Spin, Card, Form, Input, Button, Breadcrumb, Radio, Select } from "antd";
import { Link, useLocation, useHistory } from "react-router-dom";
import { useStore } from "../../../stores/index";

const { Option } = Select;

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

export const EditUser = Form.create()(observer(({ form }: any) => {

  const { state = {} }: any = useLocation();
  const history = useHistory();

  const {
    base: { userEdit }
  } = useStore();

  const { loading, roles, companyList, parkList } = userEdit;

  useEffect(() => {
    userEdit.getALlRoles();
    userEdit.getAllCompany();
    userEdit.getAllParks();
  }, []);

  const { getFieldDecorator, setFieldsValue, getFieldsValue, getFieldValue, validateFields } = form;
  const { id, username, belongs, porc = {}, name, roles: initialRoles, type, status, contact, } = state.user || {};

  const doSubmit = e => {
    e.preventDefault();

    validateFields(async (err, values) => {
      if (err) {
        return;
      }
      
      userEdit.loading = true;
      try {
        await userEdit.doSaveUser({
          ...values,
          username: values.__username,
        });
        history.replace("/user/userlist");
      } catch {

      }
      userEdit.loading = false;

    })

  }

  return (
    <Spin spinning={loading}>
      <div style={{ minHeight: 50, background: "#fff", marginBottom: 20, border: "1px solid #e8e8e8", borderLeft: 0, borderRight: 0, padding: "20px"}}>
        <Breadcrumb>
          <Breadcrumb.Item>基础信息</Breadcrumb.Item>
          <Breadcrumb.Item>
            <a href="userlist">用户管理</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <a>{state.user ? '编辑用户' : '新增用户'}</a>
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <Card>
        <input type="text" name="hidden1" style={{ width: 0, height: 0 }} />
        <input type="password" name="hidden2" style={{ width: 0, height: 0 }} />

        <Form {...formItemLayout} onSubmit={doSubmit}>
          {getFieldDecorator("id", { initialValue: id, rules: [{ required: false }] })(
            <Input hidden placeholder="请输入ID" />
          )}
          <Form.Item label="登录名">
            {getFieldDecorator("__username", { initialValue: username, rules: [{ required: true, message: '请输入登录名' }] })(
              <Input autoComplete="off" disabled={!!id} placeholder="请输入登录名" />
            )}
          </Form.Item>

          <Form.Item label="用户类型">
            {getFieldDecorator("type", { initialValue: type, rules: [{ required: true, message: '请选择用户类型' }] })(
              <Radio.Group disabled={!!id}>
                <Radio value={0}>园区用户</Radio>
                <Radio value={1}>企业用户</Radio>
                <Radio value={3}>其他</Radio>
              </Radio.Group>
            )}
          </Form.Item>

          {getFieldValue('type') === 0 &&
          <Form.Item label="所属园区">
            {getFieldDecorator("parkOrEnterpriseId", { initialValue: porc.id, rules: [{ required: true, message: '请选择所属园区' }] })(
              <Select disabled={!!id} placeholder="请选择所属园区">
                {parkList.map(item => <Option key={item.id} value={item.id}>{item.parkName}</Option>)}
              </Select>
            )}
          </Form.Item>
          }

          {getFieldValue('type') === 1 &&
          <Form.Item label="所属企业">
            {getFieldDecorator("parkOrEnterpriseId", { initialValue: porc.id, rules: [{ required: true, message: '请选择所属企业' }] })(
              <Select disabled={!!id} placeholder="请选择所属企业">
                {companyList.map(item => <Option key={item.id} value={item.id}>{item.companyName}</Option>)}
              </Select>
            )}
          </Form.Item>
          }

          <Form.Item label="所属角色">
            {getFieldDecorator("roleIds", { initialValue: (initialRoles || []).map(item => item.id), rules: [{ required: true, message: '请选择所属角色' }] })(
              <Select mode="multiple" placeholder="请选择所属角色">
                {roles.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)}
              </Select>
            )}
          </Form.Item>

          {!id &&
          <Form.Item label="密码">
            {getFieldDecorator("password", { initialValue: '', rules: [{ required: true, message: '请输入密码' }] })(
              <Input.Password autoComplete="off" placeholder="请输入密码" />
            )}
          </Form.Item>
          }

          <Form.Item label="用户姓名">
            {getFieldDecorator("name", { initialValue: name, rules: [{ required: false }] })(
              <Input placeholder="请输入用户姓名" />
            )}
          </Form.Item>
          <Form.Item label="联系方式">
            {getFieldDecorator("contact", { initialValue: contact, rules: [{ required: false }] })(
              <Input placeholder="请输入联系方式" />
            )}
          </Form.Item>
          
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">保存</Button>
            <Divider type="vertical" />
            <Button style={{marginLeft: 5 }} onClick={() => history.goBack()}>取消</Button>
          </Form.Item>
        </Form>
      </Card>
    </Spin>
  )
}));