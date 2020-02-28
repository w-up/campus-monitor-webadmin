import React from "react";
import { useObserver, useLocalStore } from "mobx-react-lite";
import { Form, Input, Button, Card } from "antd";
import TextArea from "antd/lib/input/TextArea";

export const addNewEnterprise = () => {

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
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
    <Card>
      <Form {...formItemLayout}>
        <Form.Item label="企业名称">
          <Input placeholder="请输入企业名称" />
        </Form.Item>
        <Form.Item label="企业代码" hasFeedback>
          <Input placeholder="请输入企业名称" />
        </Form.Item>
        <Form.Item label="描述" hasFeedback>
          <TextArea rows={4} placeholder='请输入描述' />
        </Form.Item>
        
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit"  loading={loadingInfo.loading}>
            提交
          </Button>
          <Button style={{marginLeft: 5, marginRight: 5}}>保存</Button>
          <Button type="danger">删除</Button>
        </Form.Item>
      </Form>
    </Card>
  </div>);
};
