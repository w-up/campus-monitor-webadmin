import React, { useEffect } from "react";
import { observer, useObserver } from "mobx-react-lite";
import { Breadcrumb, Button, Card, Form, Input, Radio, Select, Spin, Avatar, message } from "antd";
import { useHistory, useLocation, Link } from "react-router-dom";
import { useStore } from "../../../stores";
import { globalConfig } from "../../../config";
import { toJS } from "mobx";

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

export const UserInfoEdit = Form.create()(
  observer(({ form }: any) => {
    const history = useHistory();

    const { auth } = useStore();

    useEffect(() => {
      auth.getAuthUser();
    }, []);

    const { getFieldDecorator, setFieldsValue, getFieldsValue, getFieldValue, validateFields } = form;

    const doSubmit = (e) => {
      e.preventDefault();

      validateFields(async (err, values) => {
        if (err) {
          return;
        }
        await auth.updateUser(values);
        message.success('保存成功', () => {
          history.goBack();
        });
      });
    };

    console.log('auth', toJS(auth))

    return (
      <div>
        <div style={{ height: 100, background: "#fff", marginBottom: 20, border: "1px solid #e8e8e8", borderLeft: 0, borderRight: 0, padding: "20px" }}>
          <Breadcrumb>
            <Breadcrumb.Item>主页</Breadcrumb.Item>
            <Breadcrumb.Item>
              <a href="userlist">修改资料</a>
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <Card>
          <div className="flex justify-center items-center mb-10 flex-col">
            <Avatar src={`${globalConfig.apiEndpoint}${auth.user?.pic}`} size={150} icon="user" />
            <Link className="mt-4" to="/edit-avatar">
              更换头像
            </Link>
          </div>
          <Form {...formItemLayout} onSubmit={doSubmit}>
            <Form.Item label="员工姓名">
              <Input placeholder="请输入用户姓名" value={auth.user?.name} disabled />
            </Form.Item>

            <Input hidden />
            <Form.Item label="登录账号">
              <Input value={auth.user?.username} placeholder="请输入登录名" disabled />
            </Form.Item>

            {auth.user?.type !== 2 && auth.user?.type !== 3 && (
              <Form.Item label="所属园区/企业">
                <Input disabled value={auth.porc?.name} />
              </Form.Item>
            )}

            {auth.user?.type !== 2 && (
              <Form.Item label="所属角色">
                <Input disabled value={auth.user?.name} />
              </Form.Item>
            )}

            <Form.Item label="联系方式">{getFieldDecorator("contact", { initialValue: auth.user?.contact, rules: [{ required: false }] })(<Input placeholder="请输入联系方式" />)}</Form.Item>

            <Form.Item {...tailFormItemLayout}>
              <Button type="primary" htmlType="submit">
                保存
              </Button>
              <Button style={{ marginLeft: 5 }} onClick={() => history.goBack()}>
                取消
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    );
  })
);
