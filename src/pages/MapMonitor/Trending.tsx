import React from "react";
import { useObserver, useLocalStore } from "mobx-react-lite";
import { Form, Select, Button, Table, Icon, DatePicker, Radio, Divider } from "antd";
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
    monitorPanel: {
      historyData: [
        { name: "平均浓度", value: "1073.20 up/m3" },
        { name: "平均浓度", value: "2000.20 up/m3" }
      ],
      rateData: [
        { name: "同比", value: "13.94" },
        { name: "环比", value: "7.98" }
      ]
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
        <div className="text-white mt-8">
          <div className="flex justify-between pb-4 px-4" style={{ borderBottom: "1px solid #1bb8a1" }}>
            <div>历史监测数据</div>
            <div>同期变化率(2020-01-03)</div>
          </div>
          <div className="flex">
            <div className="mt-2 px-4" style={{ width: "50%", borderRight: "1px solid white" }}>
              {store.monitorPanel.historyData.map((item, index) => (
                <div className="flex justify-between my-4">
                  <div>{item.name}</div>
                  <div className="primary-text-color">{item.value}</div>
                </div>
              ))}
            </div>
            <div className="mt-2 px-4" style={{ width: "50%" }}>
              {store.monitorPanel.rateData.map((item, index) => (
                <div className="flex justify-between my-4">
                  <div>{item.name}</div>
                  <div className="primary-button-text-dark">{item.value} % ↓</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  ));
});
