import React from "react";
import { useObserver, useLocalStore } from "mobx-react-lite";
import { Form, Select, Button, Table, Icon, Spin } from "antd";
import { WrappedFormUtils } from "antd/lib/form/Form";
import { TableProps } from "antd/lib/table";
import { useStore } from "stores";
import { PMValue, SiteData } from "../../type";
import api from "services";
import ReactEcharts from "echarts-for-react";
import { constant } from "../../common/constants";
import { utils } from "utils";
import moment from "moment";
import { LineChart } from "components/LineChart";
import { Scrollbars } from "react-custom-scrollbars";

//@ts-ignore
export const RuntimeMonitor = Form.create()(({ form }: { form: WrappedFormUtils }) => {
  const { mapMonitor } = useStore();
  const { getFieldDecorator } = form;

  const store = useLocalStore(() => ({
    loading: false,
    updateTime: null as any,
    formItemLayout: {
      labelCol: {
        span: 7,
      },
      wrapperCol: {
        span: 15,
      },
    },
    handleSubmit(e) {
      e.preventDefault();
      form.validateFieldsAndScroll(async (err, values) => {
        if (!err) {
          console.log("Received values of form: ", values);
          this.loading = true;
          this.updateTime = moment().format("YYYY-MM-DD HH:mm:ss");
          mapMonitor.loadSitePmValueList().finally(() => {
            this.loading = false;
          });
        }
      });
    },
    get monitorTable() {
      return {
        dataSource: mapMonitor.siteData?.realTimeData,
        columns: [
          {
            title: "检测物质",
            dataIndex: "pmCode",
          },
          {
            title: "检测物质中文名",
            dataIndex: "pmName",
          },
          {
            title: "监测浓度",
            dataIndex: "collectValue",
          },
          {
            title: "排放限值",
            dataIndex: "pmLimitValue",
          },
        ],
      };
    },
  }));

  const table = {
    async onRowClick(data, index) {
      mapMonitor.setCurrentRuntimeSite(data.siteId);
    },
    columns: [
      {
        title: "排名",
        dataIndex: "ranking",
      },
      {
        title: "监测类型",
        dataIndex: "monitorType",
        align: "center",
        render: (text, record) => <div className={record.siteId == mapMonitor.curSiteId ? "primary-button-text-dark" : "primary-text-color"}>{text}</div>,
      },
      {
        title: "站点",
        dataIndex: "siteName",
        render: (text, record) => <div className={record.siteId == mapMonitor.curSiteId ? "primary-button-text-dark" : "primary-text-color"}>{text}</div>,
      },
      {
        title: <span>{mapMonitor.currentPmCodeData?.pmName}</span>,
        dataIndex: "collectValue",
      },
    ],
  } as TableProps<PMValue>;

  return useObserver(() => (
    <div className="runtim-monitor px-4">
      <div className="text-lg text-white mb-4 flex items-center">
        <Icon type="caret-right" theme="filled" className="primary-text-color" />
        <span className="ml-2">实时数据监测</span>
      </div>
      <Spin spinning={store.loading}>
        <Form {...store.formItemLayout} onSubmit={store.handleSubmit} key="RuntimeMonitor">
          <Form.Item label="选择园区">
            <Select onChange={mapMonitor.selectPark} value={mapMonitor.currentPark}>
              <Select.Option value="0">全部</Select.Option>
              {mapMonitor.parks.map((item, index) => (
                <Select.Option value={item.id} key={index}>
                  {item.parkName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="监测区域">
            <Select onChange={mapMonitor.selectFactory} value={mapMonitor.currentFactory}>
              <Select.Option value="0">全部</Select.Option>
              {mapMonitor.factories.map((item, index) => (
                <Select.Option value={item.id} key={index}>
                  {item.factoryName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="监测因子">
            <Select onChange={mapMonitor.selectPmcode} value={mapMonitor.currentPmCode}>
              <Select.Option value="0">全部</Select.Option>
              {mapMonitor.pmcodes.map((item, index) => (
                <Select.Option value={item.pmCode} key={index}>
                  {item.pmName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item wrapperCol={{ span: 5, offset: 17 }}>
            <Button type="primary" htmlType="submit">
              确定
            </Button>
          </Form.Item>
        </Form>
      </Spin>
      <div className="primary-text-color flex items-center">
        <Icon type="clock-circle" theme="filled" />
        <span className="ml-2">更新时间: {store.updateTime}</span>
      </div>
      <Table className="monitor-table mt-2" {...table} dataSource={mapMonitor.pmValues} pagination={false} />
      {mapMonitor.siteData && (
        <div className="monitor-row-panel pl-4 pt-4 pb-4">
          <Scrollbars style={{ height: "calc(100vh - 64px)" }}>
            <div style={{ position: "absolute", right: 20, top: "-5px" }} onClick={(e) => (mapMonitor.siteData = null)}>
              <Button icon="close-circle" shape="circle" style={{ background: "transparent", border: "none", color: "white" }}></Button>
            </div>
            <div className="flex justify-between items-center mt-4 mr-4">
              <div className="primary-button-text-dark text-lg">
                <span>{mapMonitor.siteData?.siteName}</span>
                <span className="text-sm ml-2">{mapMonitor.siteData?.monitorType}</span>
              </div>

              <div className="primary-button-text-dark text-sm"> 更新时间: {store.updateTime}</div>
            </div>
            <div className="stat-panel grid grid-flow-col grid-cols-3 grid-rows-2 gap-4 text-white mt-8 p-4 mr-4">
              <div>风速: {mapMonitor.siteData?.environmentData?.windSpeed}</div>
              <div>风向: {mapMonitor.siteData?.environmentData?.windDirection}</div>
              <div>温度: {mapMonitor.siteData?.environmentData?.temperature}</div>
              <div>湿度: {mapMonitor.siteData?.environmentData?.humidity}</div>
              <div>气压: {mapMonitor.siteData?.environmentData?.airPressure}</div>
            </div>
            <Table className="monitor-table mt-10 mr-4" {...store.monitorTable} pagination={false} />

            <div className="mr-4">
              <div className="primary-text-color mt-10 text-center">24小时监测浓度趋势图</div>
              <div className="mt-4">
                <LineChart datas={mapMonitor.siteData?.dataTrend.map((i) => ({ upperLimit: 0, ...i, datas: i.points }))}></LineChart>
              </div>
            </div>
          </Scrollbars>
        </div>
      )}
    </div>
  ));
});
