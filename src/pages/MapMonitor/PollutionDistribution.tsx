import React from "react";
import { useObserver, useLocalStore } from "mobx-react-lite";
import { Form, Select, Button, DatePicker, Icon, Slider } from "antd";
import { WrappedFormUtils } from "antd/lib/form/Form";

export const PollutionDistribution = Form.create()(({ form }: { form: WrappedFormUtils }) => {
  const { getFieldDecorator } = form;

  const store = useLocalStore(() => ({
    isPlaying: false,
    formItemLayout: {
      labelCol: {
        span: 6
      },
      wrapperCol: {
        span: 16
      }
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
      <Form {...store.formItemLayout} onSubmit={store.handleSubmit}>
        <Form.Item label="选择园区">
          {getFieldDecorator("park", { initialValue: "all" })(
            <Select>
              <Select.Option value="all">全部</Select.Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item label="监测因子">
          {getFieldDecorator("type", { initialValue: "all" })(
            <Select>
              <Select.Option value="all">TVOCs</Select.Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item label="起始时间">{getFieldDecorator("startTime", { initialValue: "" })(<DatePicker className="w-full" showTime format="YYYY-MM-DD HH:mm:ss" />)}</Form.Item>
        <Form.Item label="终止时间">{getFieldDecorator("endTime", { initialValue: "" })(<DatePicker className="w-full" showTime format="YYYY-MM-DD HH:mm:ss" />)}</Form.Item>

        <Form.Item wrapperCol={{ span: 22 }}>
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
          <div onClick={store.togglePlay}>
            <Icon type={store.isPlaying ? "pause-circle" : "play-circle"} theme="twoTone" className="text-white text-xl" />
          </div>
          <div className="flex-1 ml-4">
            <Slider></Slider>
          </div>
        </div>
        <div className="primary-text-color mt-8">
          <div>污染状况图例</div>
          <div className="flex justify-between mt-8">
            <div>正常</div>
            {store.graphs.map((item, index) => (
              <div>
                <div className="mt-1" style={{ width: "30px", height: "10px", background: item.color }}></div>
                <div className="mt-4 text-xs">{item.value}</div>
              </div>
            ))}
            <div>报警</div>
          </div>
        </div>
      </div>
    </div>
  ));
});
