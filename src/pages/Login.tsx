import React from "react";
import { useObserver, useLocalStore } from "mobx-react-lite";
import { Form, Input, Button, Icon, Checkbox } from "antd";
import { FormComponentProps } from "antd/lib/form";
import api from "services";
import "./login.css";
import { useStore } from "../stores/index";
import { WrappedFormUtils } from "antd/lib/form/Form";
import { useHistory, useLocation } from "react-router-dom";
import { useEffect } from "react";

export const LoginPage = Form.create()(({ form }: { form: WrappedFormUtils }) => {
  const { getFieldDecorator, getFieldValue } = form;
  const { auth, root } = useStore();
  const history = useHistory();

  useEffect(() => {
    if (auth.token) {
      history.replace("/");
    }
  }, []);

  const store = useLocalStore(() => ({
    handleSubmit: (e) => {
      e.preventDefault();
      form.validateFields(async (err, values) => {
        if (!err) {
          console.log("Received values of form: ", values);
          const { username, password } = values;
          await auth.login({ username, password });
          await root.init();
          history.replace("/");
        }
      });
    },
  }));

  return (
    <div className="login_container boxCenter">
      <div className="main boxCenter">
        <div className="box1 boxCenter">
          <div className="box2 boxCenter">
            <div className="box_left boxCenter">
              <div className="title">
                工业园区监测平台
                <span>v1.0</span>
              </div>
              <img src={require("../assets/login/565467@2x.png")} className="logoImg" />
            </div>
            <div className="box_right boxCenter">
              <div className="welcome">欢迎登录！</div>
              <Form onSubmit={store.handleSubmit} className="login-form">
                <Form.Item>
                  {getFieldDecorator("username", {
                    initialValue: "",
                    rules: [{ required: true, message: "请输入账户名称!" }],
                  })(<Input prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />} placeholder="账户名称" />)}
                </Form.Item>
                <Form.Item>
                  {getFieldDecorator("password", {
                    initialValue: "",
                    rules: [{ required: true, message: "请输入密码!" }],
                  })(<Input prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />} type="password" placeholder="密码" />)}
                </Form.Item>
                <Form.Item>
                  {getFieldDecorator("remember", {
                    valuePropName: "checked",
                    initialValue: true,
                  })(<Checkbox>记住密码</Checkbox>)}
                  {getFieldDecorator("forget", {
                    valuePropName: "checked",
                    initialValue: false,
                  })(<Checkbox className="login-form-forgot">忘记密码</Checkbox>)}
                  <a className="recontact" style={{ visibility: getFieldValue("forget") ? "visible" : "hidden" }}>
                    <Icon type="exclamation-circle" />
                    请重新联系管理员修改密码！
                  </a>
                  <Button htmlType="submit" className="login-form-button">
                    登录
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
