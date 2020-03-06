import React from "react";
import { useObserver, useLocalStore } from "mobx-react-lite";
import { Form, Select, Button, DatePicker, Icon, Slider, Radio } from "antd";
import { WrappedFormUtils } from "antd/lib/form/Form";

export const Contribution = Form.create()(({ form }: { form: WrappedFormUtils }) => {
  const { getFieldDecorator } = form;

  const store = useLocalStore(() => ({
    formItemLayout: {
      labelCol: {
        span: 6
      },
      wrapperCol: {
        span: 16
      }
    },
    handleSubmit: e => {
      e.preventDefault();
      form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          console.log("Received values of form: ", values);
        }
      });
    }
  }));

  return useObserver(() => (
    <div className="pollution-distribution px-4">
      <div className="text-lg text-white mb-4 flex items-center">
        <Icon type="caret-right" theme="filled" className="primary-text-color" />
        <span className="ml-2">污染分布情况</span>
      </div>
      <Form {...store.formItemLayout} onSubmit={store.handleSubmit}>
        <Form.Item label="选择园区">
          {getFieldDecorator("park", { initialValue: "all" })(
            <Select>
              <Select.Option value="all">全部</Select.Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item label="监测因子">
          {getFieldDecorator("type", { initialValue: "all" })(
            <Select>
              <Select.Option value="all">TVOCs</Select.Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item label="统计类型">
          {getFieldDecorator("dateType", { initialValue: "day" })(
            <Radio.Group>
              <Radio.Button value="day">日</Radio.Button>
              <Radio.Button value="month">月</Radio.Button>
              <Radio.Button value="month">年</Radio.Button>
            </Radio.Group>
          )}
        </Form.Item>

        <Form.Item label="统计类型">{getFieldDecorator("startDate", { initialValue: "" })(<DatePicker.RangePicker format="YYYY-MM-DD HH:mm:ss"></DatePicker.RangePicker>)}</Form.Item>

        <Form.Item label="排名方式">
          {getFieldDecorator("dateType", { initialValue: "5" })(
            <Radio.Group>
              <Radio.Button value="5">前五</Radio.Button>
              <Radio.Button value="10">前十</Radio.Button>
              <Radio.Button value="all">全部</Radio.Button>
            </Radio.Group>
          )}
        </Form.Item>

        <Form.Item wrapperCol={{ span: 22 }}>
          <Button type="primary" htmlType="submit" className="w-full">
            开始计算
          </Button>
        </Form.Item>
      </Form>
    </div>
  ));
});
