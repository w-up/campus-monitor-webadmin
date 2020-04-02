import React from "react";
import { useObserver, useLocalStore } from "mobx-react-lite";
import { Form, Select, Button, DatePicker, Icon, Slider, Radio, Spin } from "antd";
import { WrappedFormUtils } from "antd/lib/form/Form";
import { PieChart } from "../../components/PieChart";
import moment from "moment";
import { useStore } from "../../stores/index";
import { PMCode, ContributionData } from "../../type";
import api from "services";
import ReactEcharts from "echarts-for-react";

export const Contribution = Form.create()(({ form }: { form: WrappedFormUtils }) => {
  const { getFieldDecorator } = form;
  const { mapMonitor } = useStore();

  const store = useLocalStore(() => ({
    loading: false,
    formItemLayout: {
      labelCol: {
        span: 7
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
    siteData: null as Array<ContributionData> | null,
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
    currentPark: "0",
    pmcodes: [] as Array<PMCode>,
    async selectPark(parkId) {
      this.currentPark = parkId;
      const result = await api.MapMonitor.getPmCodeListByParkId({ parkId });
      this.pmcodes = result.data;
    },
    handleSubmit(e) {
      e.preventDefault();
      form.validateFieldsAndScroll(async (err, values) => {
        if (!err) {
          this.loading = true;
          const { parkId, pmCode, rankingType, statisticalType } = values;
          console.log("Received values of form: ", values);
          const result = await api.MapMonitor.getEmissionsContributionByPmCodeAndParkId({
            parkId,
            pmCode,
            rankingType,
            statisticalTime: moment(this.statisticalTime).format(this.dateType.format),
            statisticalType: this.dateType.type
          })
            .then(result => {
              this.siteData = result.data;
            })
            .finally(() => {
              this.loading = false;
            });
        }
      });
    },
    get options() {
      return {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          show: true,
          orient: "vertical",
          bottom: "0",
          left: "40%",
          data: this.siteData?.map(i => i.factoryName)
        },
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: "55%",
            center: ["50%", "30%"],
            labelLine: {
              normal: {
                show: false
              }
            },
            data: this.siteData?.map(i => ({
              name: i.factoryName,
              value: i.percentValue
            })),
            label: {
              normal: {
                formatter: params => {
                  return params.percent + "%";
                },
                position: "inner"
              }
            }
          }
        ]
      };
    }
  }));

  return useObserver(() => (
    <div className="pollution-distribution px-4 overflow-y-auto">
      <div className="text-lg text-white mb-4 flex items-center">
        <Icon type="caret-right" theme="filled" className="primary-text-color" />
        <span className="ml-2">贡献情况</span>
      </div>
      <Spin spinning={store.loading}>
        <Form {...store.formItemLayout} onSubmit={store.handleSubmit} key="Contribution">
          <Form.Item label="选择园区">
            {getFieldDecorator("parkId", { initialValue: "0", rules: [{ required: true }] })(
              <Select onChange={store.selectPark}>
                <Select.Option value="0">全部</Select.Option>
                {mapMonitor.parks.map((item, index) => (
                  <Select.Option value={item.id} key={index}>
                    {item.parkName}
                  </Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="监测因子">
            {getFieldDecorator("pmCode", { initialValue: mapMonitor.currentPmCode, rules: [{ required: true }] })(
              <Select>
                <Select.Option value="0">全部</Select.Option>
                {store.pmcodes.map((item, index) => (
                  <Select.Option value={item.pmCode} key={index}>
                    {item.pmName}
                  </Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="统计类型">
            {getFieldDecorator("statisticalType", { initialValue: store.type })(
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

          <Form.Item label="排名方式">
            {getFieldDecorator("rankingType", { initialValue: "1" })(
              <Radio.Group>
                <Radio.Button value="1">前五</Radio.Button>
                <Radio.Button value="2">前十</Radio.Button>
                <Radio.Button value="3">全部</Radio.Button>
              </Radio.Group>
            )}
          </Form.Item>

          <Form.Item wrapperCol={{ span: 22, offset: 1 }}>
            <Button type="primary" htmlType="submit" className="w-full">
              开始计算
            </Button>
          </Form.Item>
        </Form>
      </Spin>

      {store.siteData && (
        <div>
          <div className="primary-text-color mt-10 text-center">园区TVOCs排放贡献率</div>
          <div className="mt-4">
            <ReactEcharts option={store.options} style={{ width: "100%", height: "350px" }} />
          </div>
        </div>
      )}
    </div>
  ));
});
