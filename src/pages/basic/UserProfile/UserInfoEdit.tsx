import React, {useEffect} from "react";
import {observer, useObserver} from "mobx-react-lite";
import {Breadcrumb, Button, Card, Form, Input, Radio, Select, Spin} from "antd";
import {useHistory, useLocation} from "react-router-dom";
import {useStore} from "../../../stores";
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

export const UserInfoEdit = Form.create()(observer(({ form }: any) => {

  const { state = {} }: any = useLocation();
  const history = useHistory();

  const {auth} = useStore();

  const { getFieldDecorator, setFieldsValue, getFieldsValue, getFieldValue, validateFields } = form;
  const { id, username, belongs, porc, name, roles: initialRoles, type, status, contact, } = state.user || {};

  const doSubmit = e => {
    e.preventDefault();

    validateFields(async (err, values) => {
      if (err) {
        return;
      }
      // await auth.doSaveUser(values);
    })

  }

  return (
    <div>
      <div style={{height: 100, background: "#fff", marginBottom: 20, border: "1px solid #e8e8e8", borderLeft: 0, borderRight: 0, padding: "20px"}}>
        <Breadcrumb>
          <Breadcrumb.Item>主页</Breadcrumb.Item>
          <Breadcrumb.Item>
            <a href="userlist">修改资料</a>
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <Card>
        <Form {...formItemLayout} onSubmit={doSubmit}>
          <Form.Item label="员工姓名">
            {getFieldDecorator("name", { initialValue: auth.user?.name, rules: [{ required: true }] })(
              <Input placeholder="请输入用户姓名" />
            )}
          </Form.Item>

          {getFieldDecorator("id", { initialValue: auth.user?.id, rules: [{ required: false }] })(
            <Input hidden placeholder="请输入ID" />
          )}
          <Form.Item label="登录账号">
            {getFieldDecorator("username", { initialValue: auth.user?.username, rules: [{ required: true }] })(
              <Input placeholder="请输入登录名" disabled />
            )}
          </Form.Item>

          <Form.Item label="所属园区/企业">
            {getFieldDecorator("parkOrEnterpriseId", { initialValue: auth.user?.parkOrEnterpriseId, rules: [{ required: true }] })(
              <Input disabled />
            )}
          </Form.Item>

          <Form.Item label="所属角色">
            {getFieldDecorator("roleIds", { initialValue: auth.user?.type, rules: [{ required: true }] })(
              <Input disabled/>
            )}
          </Form.Item>

          <Form.Item label="联系方式">
            {getFieldDecorator("contact", { initialValue: auth.user?.contact, rules: [{ required: true }] })(
              <Input placeholder="请输入联系方式" />
            )}
          </Form.Item>

          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">保存</Button>
            <Button style={{marginLeft: 5 }} onClick={() => history.goBack()}>取消</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}));