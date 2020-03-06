import React from "react";
import { useObserver, useLocalStore } from "mobx-react-lite";
import { Form, Select, Button, Table, Icon } from "antd";
import { WrappedFormUtils } from "antd/lib/form/Form";
import { TableProps } from "antd/lib/table";

//@ts-ignore
export const RuntimeMonitor = Form.create()(({ form }: { form: WrappedFormUtils }) => {
  const { getFieldDecorator } = form;

  const store = useLocalStore(() => ({
    curIndex: 0 as any,
    get curData() {
      if (this.curIndex === null) return;
      return this.table.dataSource![this.curIndex];
    },
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
    },
    monitorPanel: {
      table: {
        dataSource: [
          { key: "TVOCs", name: "总挥发有机物", data1: "1073.20", data2: "2000.00" },
          { key: "H2S", name: "硫化氢", data1: "4.00", data2: "60.00" },
          { key: "S02", name: "二氧化硫", data1: "2.00", data2: "500.00" },
          { key: "NH3", name: "氨", data1: "25.50", data2: "1500.00" }
        ],
        columns: [
          {
            title: "检测物质",
            dataIndex: "key"
          },
          {
            title: "检测物质中文名",
            dataIndex: "name"
          },
          {
            title: "监测浓度(ug/m3)",
            dataIndex: "data1"
          },
          {
            title: "排放限制(ug/m3)",
            dataIndex: "data2"
          }
        ]
      }
    },
    table: {
      dataSource: [
        { key: "1", name: "A化工东南1", data: "123" },
        { key: "2", name: "A化工东南2", data: "123" },
        { key: "3", name: "A化工东南3", data: "123" },
        { key: "4", name: "A化工东南4", data: "123" },
        { key: "5", name: "A化工东南5", data: "123" },
        { key: "6", name: "A化工东南6", data: "123" },
        { key: "7", name: "A化工东南7", data: "123" },
        { key: "8", name: "A化工东南8", data: "123" }
      ],
      onRowClick(data, index) {
        store.curIndex = store.curIndex == index ? null : index;
        console.log(store.curData);
      },
      columns: [
        {
          title: "排名",
          dataIndex: "key"
        },
        {
          title: "站点",
          dataIndex: "name",
          render: (text, record, index) => <div className={index == store.curIndex ? "primary-button-text-dark" : "primary-text-color"}>{text}</div>
        },
        {
          title: "TVOCs",
          dataIndex: "data"
        }
      ]
    } as TableProps<any>
  }));

  return useObserver(() => (
    <div className="runtim-monitor px-4">
      <div className="text-lg text-white mb-4 flex items-center">
        <Icon type="caret-right" theme="filled" className="primary-text-color" />
        <span className="ml-2">实时数据监测</span>
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
        <Form.Item wrapperCol={{ span: 4, offset: 18 }}>
          <Button type="primary" htmlType="submit">
            确定
          </Button>
        </Form.Item>
      </Form>
      <div className="primary-text-color flex items-center">
        <Icon type="clock-circle" theme="filled" />
        <span className="ml-2">更新时间: 2020-01-02 14:00:00</span>
      </div>
      <Table className="monitor-table mt-2" {...store.table} pagination={false} />
      {store.curIndex !== null && (
        <div className="monitor-row-panel p-4 ">
          <div className="flex justify-between items-center mt-4">
            <div className="primary-button-text-dark text-lg">{store.curData.name}</div>
            <div className="primary-button-text-dark text-sm"> 更新时间: 2020-01-02 14:00:00</div>
          </div>
          <div className="stat-panel grid grid-flow-col grid-cols-3 grid-rows-2 gap-4 text-white mt-8 p-4">
            <div>风速: 0.0m/s</div>
            <div>风向: 北风</div>
            <div>温度: 15.0℃</div>
            <div>湿度: 55%RH</div>
            <div>气压: 101.6kPa</div>
          </div>
          <Table className="monitor-table mt-10" {...store.monitorPanel.table} pagination={false} />
        </div>
      )}
    </div>
  ));
});
