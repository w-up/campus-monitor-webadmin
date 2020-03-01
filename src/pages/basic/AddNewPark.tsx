import React from "react";
import { useObserver, useLocalStore } from "mobx-react-lite";
import { Card, Form, Input, Button, Radio, Breadcrumb } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { Link } from "react-router-dom";

export const AddNewPark = () => {

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
        span: 10,
        offset: 0,
      },
      sm: {
        span: 12,
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
          <Link to="/base/park">园区管理</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <a>新增园区</a>
        </Breadcrumb.Item>
      </Breadcrumb>
    <div style={{margin: 10, marginLeft: 0, fontWeight: "bold", fontSize: 20}}>新增园区</div>
    </div>
    <Card>
      <Form {...formItemLayout}>
        <Form.Item label="园区代码">
          <Input placeholder="请输入园区代码" />
        </Form.Item>
        <Form.Item label="园区名称" hasFeedback>
          <Input placeholder="请输入园区名称" />
        </Form.Item>
        <Form.Item label="园区范围" hasFeedback>
          <Radio.Group>
            <Radio value={1}>地图绘制</Radio>
            <Radio value={2}>输入经纬度</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="描述" hasFeedback>
          <TextArea rows={4} placeholder='请输入描述' />
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
