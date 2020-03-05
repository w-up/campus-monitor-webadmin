import React from "react";
import { useObserver } from "mobx-react-lite";
import { Form, Select, Button } from "antd";
import { WrappedFormUtils } from "antd/lib/form/Form";
import { useStore } from "../../stores/index";

//@ts-ignore
export const RuntimeMonitor = Form.create()(({ form }: { form: WrappedFormUtils }) => {
  const { getFieldDecorator } = form;
  const formItemLayout = {
    labelCol: {
      span: 6
    },
    wrapperCol: {
      span: 16
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
      }
    });
  };
  return useObserver(() => (
    <div className="px-4">
      <div className="text-lg text-white mb-4">实时数据监测</div>
      <Form {...formItemLayout} onSubmit={handleSubmit}>
        <Form.Item label="选择园区">
          {getFieldDecorator("park", { initialValue: "all" })(
            <Select>
              <Select.Option value="all">全部</Select.Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item label="监测区域">
          {getFieldDecorator("area", { initialValue: "all" })(
            <Select>
              <Select.Option value="all">全部</Select.Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item label="监测因子">
          {getFieldDecorator("type", { initialValue: "TVOCs" })(
            <Select>
              <Select.Option value="TVOCs">TVOCs</Select.Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item wrapperCol={{ span: 4, offset: 18 }}>
          <Button type="primary" htmlType="submit">
            确定
          </Button>
        </Form.Item>
      </Form>

      <div style={{ color: "#4ba9e6" }}>更新时间: 2020-01-02 14:00:00</div>
    </div>
  ));
});
