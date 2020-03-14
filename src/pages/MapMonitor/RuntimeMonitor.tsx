import React from "react";
import { useObserver, useLocalStore } from "mobx-react-lite";
import { Form, Select, Button, Table, Icon } from "antd";
import { WrappedFormUtils } from "antd/lib/form/Form";
import { TableProps } from "antd/lib/table";
import { LineChart } from "../../components/LineChart";
import { useStore } from "stores";
import { PMValue } from "../../type";
import api from "services";

//@ts-ignore
export const RuntimeMonitor = Form.create()(({ form }: { form: WrappedFormUtils }) => {
  const { mapMonitor } = useStore();
  const { getFieldDecorator } = form;

  const store = useLocalStore(() => ({
    curSiteId: null as any,
    siteData: null as PMValue | null,
    formItemLayout: {
      labelCol: {
        span: 7
      },
      wrapperCol: {
        span: 15
      }
    },
    handleSubmit: e => {
      e.preventDefault();
      form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          console.log("Received values of form: ", values);
          mapMonitor.loadSitePmValueList();
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
    }
  }));

  const table = {
    async onRowClick(data, index) {
      store.curSiteId = data.siteId;
      const result = await api.MapMonitor.getSiteMonitorDataById({ siteId: data.siteId });
      store.siteData = result.data;
    },
    columns: [
      {
        title: "排名",
        dataIndex: "ranking"
      },
      {
        title: "站点",
        dataIndex: "siteName",
        render: (text, record) => <div className={record.siteId == store.curSiteId ? "primary-button-text-dark" : "primary-text-color"}>{text}</div>
      },
      {
        title: <span>{mapMonitor.currentPmCode}</span>,
        dataIndex: "collectValue"
      }
    ]
  } as TableProps<PMValue>;

  return useObserver(() => (
    <div className="runtim-monitor px-4">
      <div className="text-lg text-white mb-4 flex items-center">
        <Icon type="caret-right" theme="filled" className="primary-text-color" />
        <span className="ml-2">实时数据监测</span>
      </div>
      <Form {...store.formItemLayout} onSubmit={store.handleSubmit} key="RuntimeMonitor">
        <Form.Item label="选择园区">
          {getFieldDecorator("park", { initialValue: mapMonitor.currentPark, rules: [{ required: true }] })(
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
          {getFieldDecorator("factory", { initialValue: mapMonitor.currentFactory, rules: [{ required: true }] })(
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
        <Form.Item wrapperCol={{ span: 5, offset: 17 }}>
          <Button type="primary" htmlType="submit">
            确定
          </Button>
        </Form.Item>
      </Form>
      <div className="primary-text-color flex items-center">
        <Icon type="clock-circle" theme="filled" />
        <span className="ml-2">更新时间: 2020-01-02 14:00:00</span>
      </div>
      <Table className="monitor-table mt-2" {...table} dataSource={mapMonitor.pmValues} pagination={false} />
      {store.siteData && (
        <div className="monitor-row-panel p-4 ">
          <div className="flex justify-between items-center mt-4">
            <div className="primary-button-text-dark text-lg">{store.siteData?.pmName}</div>
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

          <div>
            <div className="primary-text-color mt-10 text-center">24小时监测浓度趋势图</div>
            <LineChart />
          </div>
        </div>
      )}
    </div>
  ));
});
