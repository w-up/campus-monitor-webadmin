import React from "react";
import { useObserver, useLocalStore } from "mobx-react-lite";
import { Form, Select, Button, DatePicker, Icon, Slider } from "antd";
import { WrappedFormUtils } from "antd/lib/form/Form";
import { useStore } from "stores";
import api from "services";
import { PMCode } from "../../type";
import moment from "moment";
import Progress from "antd/lib/progress";

export const PollutionDistribution = Form.create()(({ form }: { form: WrappedFormUtils }) => {
  const { getFieldDecorator } = form;
  const { mapMonitor } = useStore();

  const store = useLocalStore(() => ({
    isPlaying: false,
    formItemLayout: {
      labelCol: {
        span: 7
      },
      wrapperCol: {
        span: 16
      }
    },
    currentPark: "0",
    currentPmCode: "",
    pmcodes: [] as Array<PMCode>,
    async selectPark(parkId) {
      this.currentPark = parkId;
      const result = await api.MapMonitor.getPmCodeListByParkId({ parkId });
      this.pmcodes = result.data;
      if (this.currentPmCode) {
        mapMonitor.loadParkData({ parkId: this.currentPark, pmCode: this.currentPmCode });
      }
    },
    async selectPmCode(pmCode) {
      this.currentPmCode = pmCode;
      mapMonitor.loadParkData({ parkId: this.currentPark, pmCode: this.currentPmCode });
    },
    graphs: [
      { value: "350", color: "#6eb447" },
      { value: "700", color: "#9ecc41" },
      { value: "1050", color: "#eae841" },
      { value: "1400", color: "#d46131" },
      { value: "1750", color: "#d93127" },
      { value: "2000", color: "#661322" }
    ],
    togglePlay() {
      this.isPlaying = !this.isPlaying;
    },
    handleSubmit: e => {
      e.preventDefault();
      form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          console.log("Received values of form: ", values);
          // const { parkId, pmCode, timeStart, timeEnd } = values;
          mapMonitor.loadPollition(values);
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
      <Form {...store.formItemLayout} onSubmit={store.handleSubmit} key="PollutionDistribution">
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
            <Select onChange={store.selectPmCode}>
              <Select.Option value="0">全部</Select.Option>
              {mapMonitor.pmcodes.map((item, index) => (
                <Select.Option value={item.pmCode} key={index}>
                  {item.pmName}
                </Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="起始时间">
          {getFieldDecorator("timeStart", { initialValue: moment().subtract(1, "day"), rules: [{ required: true }] })(<DatePicker className="w-full" showTime format="YYYY-MM-DD HH:mm:ss" />)}
        </Form.Item>
        <Form.Item label="终止时间">
          {getFieldDecorator("timeEnd", { initialValue: moment(), rules: [{ required: true }] })(<DatePicker className="w-full" showTime format="YYYY-MM-DD HH:mm:ss" />)}
        </Form.Item>

        <Form.Item wrapperCol={{ span: 22, offset: 1 }}>
          <Button type="primary" htmlType="submit" className="w-full">
            调取回顾
          </Button>
        </Form.Item>
      </Form>

      <div className="mt-4">
        <div className="text-white">播放污染情况变化</div>
        <div className="primary-text-color justify-end flex items-center ">
          <Icon type="clock-circle" theme="filled" />
          <span className="ml-2 text-sm">2020-01-03 15:00:00</span>
        </div>
        <div className="stat-panel p-2 text-white flex items-center mt-2">
          <div onClick={e => mapMonitor.togglePlayPollution()}>
            <Icon type={mapMonitor.playPollutionTimer ? "pause-circle" : "play-circle"} theme="twoTone" className="text-white text-xl" />
          </div>
          <div className="flex-1 ml-4">
            <Slider value={mapMonitor.currentTime} max={mapMonitor.maxTime} onChange={e => mapMonitor.setCurrentTime(Number(e), { stop: true })}></Slider>
          </div>
        </div>
        <div className="primary-text-color mt-8">
          <div>污染状况图例</div>
          <div className="flex justify-between mt-8">
            <div>正常</div>
            {/*{store.graphs.map((item, index) => (*/}
            {/*  <div>*/}
            {/*    <div className="mt-1" style={{ width: "30px", height: "10px", background: item.color }}></div>*/}
            {/*    <div className="mt-4 text-xs">{item.value}</div>*/}
            {/*  </div>*/}
            {/*))}*/}
            <div className="mx-2 w-9/12">
              <Progress
                strokeColor={{
                  '0%': '#0AE612',
                  '100%': '#F80901',
                }}
                percent={100}
                showInfo={false}
              />
              <div>
                <span>0</span>
                <span className="float-right">100</span>
              </div>
            </div>
            <div>报警</div>
          </div>
        </div>
      </div>
    </div>
  ));
});
