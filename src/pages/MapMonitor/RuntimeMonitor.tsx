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

//@ts-ignore
export const RuntimeMonitor = Form.create()(({ form }: { form: WrappedFormUtils }) => {
  const { mapMonitor } = useStore();
  const { getFieldDecorator } = form;

  const store = useLocalStore(() => ({
    loading: false,
    updateTime: null as any,
    curSiteId: null as any,
    siteData: null as SiteData | null,
    formItemLayout: {
      labelCol: {
        span: 7
      },
      wrapperCol: {
        span: 15
      }
    },
    get submitAble() {
      return mapMonitor.currentPmCode !== "0";
    },
    handleSubmit(e) {
      e.preventDefault();
      form.validateFieldsAndScroll(async (err, values) => {
        if (!err) {
          console.log("Received values of form: ", values);
          this.loading = true;
          this.updateTime = moment().format("YYYY-MM-DD HH:ss");
          mapMonitor.loadSitePmValueList().finally(() => {
            this.loading = false;
          });
        }
      });
    },
    get options() {
      return {
        //   标题配置
        title: {
          text: "24小时排放趋势图",
          textStyle: {
            color: "#88A8C5FF",
            fontSize: "14",
            fontWeight: "normal"
          },
          x: "center",
          y: "20px",
          padding: [5, 20]
        },
        // 提示配置
        tooltip: {
          trigger: "axis",
          backgroundColor: "rgba(38,95,163,0.6)",
          padding: 10,
          textStyle: {
            color: "#88A8C5",
            fontSize: 10
          },
          alwaysShowContent: {
            show: true
          },
          formatter: (params: any, ticket: any, callback: any) => {
            let showHtml = "";
            for (var i = 0; i < params.length; i++) {
              var list = {} as any;
              //x轴名称
              var name = params[i].seriesName;
              //名称
              var text = params[i].axisValue;
              //值
              var value = params[i].data.value;
              var unit = params[i].data.unit;

              showHtml += `
            <div style="display:flex;align-items: center;">
            <div style="margin-right:10px;width:10px;height:1px;border:1px solid ${constant.seriesColors[i]};background:${constant.seriesColors[i]}"></div>
            <div>${name}</div>
            <div style="color:#04F9CC;text-align:right;display:inline-block;margin-left:15px">${value ? utils.number.toPrecision(value) + unit : ""}</div>
          </div>
          `;
            }
            return `<div style="color: #04F9CC;text-align:left;line-height:20px">${text} 日均</div>
            <div style="color:#88A8C5;text-align:left;font-size:10px;background:rgba(11,36,69,0.6);padding:5px;border-radius:5px;margin-top:5px;">
            ${showHtml}
            </div>
          </div>`;
          }
        },
        // 上册图列配置
        legend: {
          data: this.siteData?.dataTrend.map(i => i.pmName),
          textStyle: {
            fontSize: 10,
            color: "#88A8C5" // 图例文字颜色
          }
          // y:"-10px",
        },
        grid: {
          top: "25%",
          left: "4%",
          right: "2%",
          bottom: "0%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          axisLabel: {
            textStyle: {
              color: "rgba(136,168,197,0.5)",
              fontSize: "10"
            }
          },
          data: this.siteData?.dataTrend[0].points.map(i => i.time)
        },
        yAxis: {
          name: "（mg/m³）",
          nameTextStyle: {
            color: "rgba(136,168,197,0.5)",
            align: "center",
            verticalAlign: "middle",
            padding: [5, 0, 15, 20]
          },
          type: "value",
          // min: 1,
          // max: 100,
          splitNumber: 3,
          axisLabel: {
            textStyle: {
              color: "rgba(136,168,197,0.5)",
              fontSize: "10"
            }
          },
          //   分割线
          splitLine: {
            lineStyle: {
              color: "rgba(101,198,231,0.2)"
            }
          },
          //   刻度线
          axisLine: {
            show: false
          }
        },
        series: this.siteData?.dataTrend.map((item, index) => ({
          name: item.pmName,
          type: "line",
          data: item.points.map(i => ({
            value: Number(i.collectValue),
            unit: i.unit
          })),
          itemStyle: {
            normal: {
              color: constant.seriesColors[index], //改变折线点的颜色
              lineStyle: {
                color: constant.seriesColors[index] //改变折线颜色
              }
            }
          },
          symbol: "circle", //设定为实心点
          symbolSize: 6 //设定实心点的大小
        }))
      };
    },

    get monitorTable() {
      return {
        dataSource: this.siteData?.realTimeData,
        columns: [
          {
            title: "检测物质",
            dataIndex: "pmCode"
          },
          {
            title: "检测物质中文名",
            dataIndex: "pmName"
          },
          {
            title: "监测浓度",
            dataIndex: "collectValue"
          },
          {
            title: "排放限值",
            dataIndex: "pmLimitValue"
          }
        ]
      };
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
      <Spin spinning={store.loading}>
        <Form {...store.formItemLayout} onSubmit={store.handleSubmit} key="RuntimeMonitor">
          <Form.Item label="选择园区">
            {getFieldDecorator("park", { initialValue: mapMonitor.currentPark, rules: [{ required: true }] })(
              <Select onChange={mapMonitor.selectPark}>
                <Select.Option value="0">全部</Select.Option>
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
                <Select.Option value="0">全部</Select.Option>
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
                <Select.Option value="0">全部</Select.Option>
                {mapMonitor.pmcodes.map((item, index) => (
                  <Select.Option value={item.pmCode} key={index}>
                    {item.pmName}
                  </Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item wrapperCol={{ span: 5, offset: 17 }}>
            <Button type="primary" htmlType="submit" disabled={!store.submitAble}>
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
      {store.siteData && (
        <div className="monitor-row-panel p-4 overflow-y-scroll">
          <div className="flex justify-between items-center mt-4">
            <div className="primary-button-text-dark text-lg">{store.siteData?.siteName}</div>
            <div className="primary-button-text-dark text-sm"> 更新时间: {store.updateTime}</div>
          </div>
          <div className="stat-panel grid grid-flow-col grid-cols-3 grid-rows-2 gap-4 text-white mt-8 p-4">
            <div>风速: {store.siteData?.environmentData?.windSpeed}</div>
            <div>风向: {store.siteData?.environmentData?.windDirection}</div>
            <div>温度: {store.siteData?.environmentData?.temperature}</div>
            <div>湿度: {store.siteData?.environmentData?.humidity}</div>
            <div>气压: {store.siteData?.environmentData?.airPressure}</div>
          </div>
          <Table className="monitor-table mt-10" {...store.monitorTable} pagination={false} />

          <div>
            <div className="primary-text-color mt-10 text-center">24小时监测浓度趋势图</div>
            <div className="mt-4">
              <ReactEcharts option={store.options} style={{ width: "100%", height: "180px" }} />
            </div>
          </div>
        </div>
      )}
    </div>
  ));
});
