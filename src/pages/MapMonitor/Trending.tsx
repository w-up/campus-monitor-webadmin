import React from "react";
import { useObserver, useLocalStore } from "mobx-react-lite";
import { Form, Select, Button, Table, Icon, DatePicker, Radio, Divider } from "antd";
import { WrappedFormUtils } from "antd/lib/form/Form";
import { TableProps } from "antd/lib/table";
import { ColumnLineChart } from "../../components/ColumnLineChart";
import { LineChart } from "../../components/LineChart";
import { useStore } from "../../stores/index";
import api from "services";
import moment from "moment";

//@ts-ignore
export const Trending = Form.create()(({ form }: { form: WrappedFormUtils }) => {
  const { getFieldDecorator, setFields } = form;
  const { mapMonitor } = useStore();

  const store = useLocalStore(() => ({
    formItemLayout: {
      labelCol: {
        span: 6
      },
      wrapperCol: {
        span: 16
      }
    },
    dateTypes: {
      date: {
        startOf: "day",
        format: "YYYY-MM-DD",
        type: 1
      },
      month: { type: 2, startOf: "month", format: "YYYY-MM" },
      year: { type: 3, startOf: "year", format: "YYYY" }
    },
    type: "date" as any,
    get dateType() {
      return this.dateTypes[this.type];
    },
    statisticalTime: moment() as any,
    dateOpen: false,
    setDateOpen(status) {
      if (status) {
        this.dateOpen = true;
      } else {
        this.dateOpen = false;
      }
    },
    setDate(value) {
      this.statisticalTime = moment(value).startOf(this.dateType.startOf);
      this.dateOpen = false;
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
    handleSubmit(e) {
      e.preventDefault();
      form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          console.log("Received values of form: ", values);
          const { factoryId, pmCode, type } = values;
          const result = api.MapMonitor.getFactoryEmissionsTrendByPmCode({
            factoryId,
            pmCode,
            statisticalTime: moment(this.statisticalTime).format(this.dateType.format),
            type: this.dateType.type
          });
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
      <Form {...store.formItemLayout} onSubmit={store.handleSubmit} key="Trending">
        <Form.Item label="选择园区">
          {getFieldDecorator("parkId", { initialValue: mapMonitor.currentPark, rules: [{ required: true }] })(
            <Select onChange={mapMonitor.selectPark}>
              <Select.Option value="all">全部</Select.Option>
              {mapMonitor.parks.map((item, index) => (
                <Select.Option value={item.id} key={index}>
                  {item.parkName}
                </Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="监测区域">
          {getFieldDecorator("factoryId", { initialValue: mapMonitor.currentFactory, rules: [{ required: true }] })(
            <Select onChange={mapMonitor.selectFactory}>
              <Select.Option value="all">全部</Select.Option>
              {mapMonitor.factories.map((item, index) => (
                <Select.Option value={item.id} key={index}>
                  {item.factoryName}
                </Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="监测因子">
          {getFieldDecorator("pmCode", { initialValue: mapMonitor.currentPmCode, rules: [{ required: true }] })(
            <Select onChange={mapMonitor.selectPmcode}>
              {mapMonitor.pmcodes.map((item, index) => (
                <Select.Option value={item.pmCode} key={index}>
                  {item.pmName}
                </Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="统计类型">
          {getFieldDecorator("type", { initialValue: store.type })(
            <Radio.Group onChange={e => (store.type = e.target.value)}>
              <Radio.Button value="date">日</Radio.Button>
              <Radio.Button value="month">月</Radio.Button>
              <Radio.Button value="year">年</Radio.Button>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label="统计时间">
          <DatePicker
            className="w-full"
            format={store.dateType.format}
            mode={store.type}
            onChange={store.setDate}
            open={store.dateOpen}
            value={store.statisticalTime}
            onOpenChange={store.setDateOpen}
            onPanelChange={store.setDate}
          />
        </Form.Item>

        <Form.Item wrapperCol={{ span: 22 }}>
          <Button type="primary" htmlType="submit" className="w-full">
            开始计算
          </Button>
        </Form.Item>
      </Form>
      <div className="monitor-row-panel p-4 ">
        <div className="primary-button-text-dark text-xl mt-8">A 化工</div>

        <div className="stat-panel text-white mt-8 p-4">
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
          <div>
            <div className="primary-text-color mt-10 text-center">24小时监测浓度趋势图</div>
            <ColumnLineChart />
          </div>

          <div>
            <div className="primary-text-color mt-10 text-center">厂界24小时排放浓度趋势图</div>
            <LineChart />
          </div>
        </div>
      </div>
    </div>
  ));
});
