import React from "react";
import {useObserver, useLocalStore} from "mobx-react-lite";
import {Form, Select, Button, Table, Icon} from "antd";
import {WrappedFormUtils} from "antd/lib/form/Form";

//@ts-ignore
export const MonitorParamForm = Form.create()(({form}: { form: WrappedFormUtils }) => {
  const {getFieldDecorator} = form;

  const store = useLocalStore(() => ({
    formItemLayout: {
      labelCol: {
        span: 6
      },
      wrapperCol: {
        span: 18
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
    <div className="runtim-monitor screenFormStyle primary-text-color pr-6">
      <Form {...store.formItemLayout} onSubmit={store.handleSubmit}>
        <Form.Item label="监测类型">
          {getFieldDecorator("park", {initialValue: "all"})(
            <Select>
              <Select.Option value="all">全部</Select.Option>
              <Select.Option value="1">废气</Select.Option>
              <Select.Option value="2">废水</Select.Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item label="监测因子">
          {getFieldDecorator("type", {initialValue: "TVOCs"})(
            <Select>
              <Select.Option value="TVOCs">TVOCs</Select.Option>
              <Select.Option value="COD">COD</Select.Option>
            </Select>
          )}
        </Form.Item>
        <div className="flex justify-between">
          <div className="primary-text-color flex items-center text-ellipsis">
            <Icon type="clock-circle" theme="filled"/>
            <span className="ml-2 text-xs ">更新时间: 14:00:00</span>
          </div>
          <div className="text-right">
            <Button type="primary" htmlType="submit">
              确定
            </Button>
          </div>
        </div>
      </Form>

    </div>
  ));
});
