import React from "react";
import { useObserver, useLocalStore } from "mobx-react-lite";
import { Form, Select, Button, Table, Icon, DatePicker, Radio } from "antd";
import { WrappedFormUtils } from "antd/lib/form/Form";
import { TableProps } from "antd/lib/table";

//@ts-ignore
export const Trending = Form.create()(({ form }: { form: WrappedFormUtils }) => {
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
    <div className="runtim-monitor px-4">
      <div className="text-lg text-white mb-4 flex items-center">
        <Icon type="caret-right" theme="filled" className="primary-text-color" />
        <span className="ml-2">排放趋势</span>
      </div>
      <Form {...store.formItemLayout} onSubmit={store.handleSubmit}>
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
        <Form.Item label="统计类型">
          {getFieldDecorator("dateType", { initialValue: "day" })(
            <Radio.Group>
              <Radio.Button value="day">日</Radio.Button>
              <Radio.Button value="month">月</Radio.Button>
              <Radio.Button value="month">年</Radio.Button>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label="起始时间">{getFieldDecorator("startTime", { initialValue: "" })(<DatePicker className="w-full" showTime format="YYYY-MM-DD HH:mm:ss" />)}</Form.Item>
        <Form.Item label="终止时间">{getFieldDecorator("endTime", { initialValue: "" })(<DatePicker className="w-full" showTime format="YYYY-MM-DD HH:mm:ss" />)}</Form.Item>

        <Form.Item wrapperCol={{ span: 22 }}>
          <Button type="primary" htmlType="submit" className="w-full">
            开始计算
          </Button>
        </Form.Item>
      </Form>
      <div className="monitor-row-panel p-4 ">
        <div className="stat-panel text-white mt-4 p-4">
          <div className="flex justify-between">
            <div>检测因子: 总挥发性有机物</div>
            <div>统计类型: 日</div>
          </div>
          <div className="primary-button-text-dark mt-3">时间段： 2020-01-02 至 2020-01-03</div>
        </div>
      </div>
    </div>
  ));
});
