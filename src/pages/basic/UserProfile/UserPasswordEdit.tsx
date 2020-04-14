import React, {useEffect} from "react";
import {observer, useObserver} from "mobx-react-lite";
import {Breadcrumb, Button, Card, Form, Input, Radio, Select, Spin} from "antd";
import {useHistory, useLocation} from "react-router-dom";
import {useStore} from "../../../stores";
import { WrappedFormUtils } from 'antd/lib/form/Form';

const {Option} = Select;

const formItemLayout = {
  labelCol: {
    xs: {span: 24},
    sm: {span: 8},
  },
  wrapperCol: {
    xs: {span: 10},
    sm: {span: 10},
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

export const UserPasswordEdit = Form.create()(observer(({form}: {form: WrappedFormUtils}) => {

  const history = useHistory();

  const {auth} = useStore();

  const {getFieldDecorator, setFieldsValue, getFieldsValue, getFieldValue, validateFields} = form;

  const compareToFirstPassword = (rule, value, callback) => {
    if (value && value !== form.getFieldValue('newPassword')) {
      callback("两次输入的密码不一致");
    } else {
      callback();
    }
  };

  const doSubmit = e => {
    e.preventDefault();

    validateFields(async (err, values) => {
      if (err) {
        return;
      }
      await auth.editPassword(values);
      await auth.logout();
      history.replace("/login");
    });

  };

  return (
    <div>
      <div style={{
        height: 100,
        background: "#fff",
        marginBottom: 20,
        border: "1px solid #e8e8e8",
        borderLeft: 0,
        borderRight: 0,
        padding: "20px"
      }}>
        <Breadcrumb>
          <Breadcrumb.Item>主页</Breadcrumb.Item>
          <Breadcrumb.Item>
            修改密码
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <Card>
        <Form {...formItemLayout} onSubmit={doSubmit}>

          <Form.Item label="原密码">
            {getFieldDecorator("password", {initialValue: null, rules: [{required: true, message: "请输入原密码"}]})(
              <Input.Password placeholder="原登录密码"/>
            )}
          </Form.Item>

          <Form.Item label="新密码">
            {getFieldDecorator("newPassword", {initialValue: null, rules: [{required: true, message: "请输入新的密码"}]})(
              <Input.Password placeholder="新的登录密码"/>
            )}
          </Form.Item>

          <Form.Item label="确认密码">
            {getFieldDecorator("confirmPassword", {
              initialValue: null, rules: [{
                required: true,
                message: "请确认你的密码!",
              }, {
                validator: compareToFirstPassword,
              }]
            })(
              <Input.Password placeholder="确认新的密码"/>
            )}
          </Form.Item>

          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">保存</Button>
            <Button style={{marginLeft: 5}} onClick={() => history.goBack()}>取消</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}));