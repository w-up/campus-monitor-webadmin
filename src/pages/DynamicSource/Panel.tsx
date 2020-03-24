import React from "react";
import { useObserver, useLocalStore } from "mobx-react-lite";
import { Form, Select, Button, Table, Icon, DatePicker, Slider, Switch, Input } from "antd";
import { WrappedFormUtils } from "antd/lib/form/Form";
import { TableProps } from "antd/lib/table";
import RadioGroup from "antd/lib/radio/group";
import { PieChart } from "../../components/PieChart";
import { useStore } from "../../stores/index";
import api from "services";
import moment from "moment";

//@ts-ignore
export const DynamicSourcePanel = Form.create()(({ form }: { form: WrappedFormUtils }) => {
  const { getFieldDecorator } = form;
  const { config, dynamicSource } = useStore();

  const store = useLocalStore(() => ({
    isPlaying: false,
    formItemLayout: {
      labelCol: {
        span: 7
      },
      wrapperCol: {
        span: 15
      }
    },
    togglePlay() {
      this.isPlaying = !this.isPlaying;
    },
    handleSubmit: e => {
      e.preventDefault();
      form.validateFieldsAndScroll(async (err, values) => {
        if (!err) {
          console.log("Received values of form: ", values);
          const { parkId: _parkId, endTime: _endTime, lat, lng, pmCode, startTime: _startTime } = values;
          const parkId = Number(_parkId);
          const startTime = moment(_startTime).format("YYYY-MM-DD HH");
          const endTime = moment(_endTime).format("YYYY-MM-DD HH");
          if (dynamicSource.computeType == "1") {
            const res = await api.MapMonitor.getDynamicSourceContribution({ parkId, lat, lng, pmCode, startTime, endTime });
            if (res) {
              dynamicSource.DynamicSourceContribution = res.data;
            }
          }
          if (dynamicSource.computeType == "2") {
            const res = await api.MapMonitor.getDynamicSourceWindRose({ endTime, parkId, pmCode, startTime });
            if (res) {
              dynamicSource.DynamicSourceWindRose = res.data;
            }
          }
          if (dynamicSource.computeType == "3") {
            const res = await api.MapMonitor.getDynamicSourceTraceSource({ endTime, parkId, pmCode, startTime });
            if (res) {
              dynamicSource.DynamicSourceTraceSource = res.data;
            }
          }
        }
      });
    },
    form: {
      isChecked: false,
      options: [
        { label: "贡献率", value: "1" },
        { label: "源方向", value: "2" },
        { label: "原位置和浓度", value: "3" }
      ]
    },
    monitorPanel: {
      points: [
        { name: "位置01", position: 29.1121, concentration: "121.1ppm" },
        { name: "位置02", position: 29.1121, concentration: "121.1ppm" },
        { name: "位置03", position: 29.1121, concentration: "121.1ppm" }
      ],
      table: {
        dataSource: [
          { name: "A化工", precent: "62.5" },
          { name: "B化工", precent: "12.5" },
          { name: "C化工", precent: "12.5" },
          { name: "其他", precent: "8.2" }
        ],
        columns: [
          {
            title: "站点名称",
            dataIndex: "name",
            align: "center"
          },
          {
            title: "贡献率",
            dataIndex: "precent",
            align: "center",
            render: text => <div className="primary-text-color">{text}%</div>
          }
        ]
      } as TableProps<any>
    }
  }));

  return useObserver(() => (
    <div className="runtim-monitor px-4 mt-4">
      <div className="text-lg text-white mb-4 flex items-center">
        <Icon type="caret-right" theme="filled" className="primary-text-color" />
        <span className="ml-2">动态朔源</span>
      </div>
      <Form {...store.formItemLayout} onSubmit={store.handleSubmit}>
        <div className="mb-4">
          <div className="primary-text-color mb-4">计算方法</div>
          {getFieldDecorator("computeType", { initialValue: "1" })(<RadioGroup options={store.form.options} onChange={e => (dynamicSource.computeType = e.target.value)}></RadioGroup>)}
        </div>
        <Form.Item label="选择园区">
          {getFieldDecorator("parkId", { initialValue: dynamicSource.currentPark, rules: [{ required: true }] })(
            <Select onChange={dynamicSource.selectPark}>
              <Select.Option value="0">全部</Select.Option>
              {dynamicSource.parks.map((item, index) => (
                <Select.Option value={item.id} key={index}>
                  {item.parkName}
                </Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="监测因子">
          {getFieldDecorator("pmCode", { initialValue: dynamicSource.currentPmCode, rules: [{ required: true }] })(
            <Select onChange={dynamicSource.selectPmcode}>
              <Select.Option value="0">全部</Select.Option>
              {dynamicSource.pmcodes.map((item, index) => (
                <Select.Option value={item.pmCode} key={index}>
                  {item.pmName}
                </Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>
        {dynamicSource.computeType == "1" && (
          <div>
            <Form.Item label="敏感点经度">{getFieldDecorator("lat", { initialValue: "" })(<Input />)}</Form.Item>
            <Form.Item label="敏感点维度">{getFieldDecorator("lng", { initialValue: "" })(<Input />)}</Form.Item>
          </div>
        )}
        <Form.Item label="起始时间">{getFieldDecorator("startTime", { initialValue: moment() })(<DatePicker className="w-full" showTime format="YYYY-MM-DD HH:mm:ss" />)}</Form.Item>
        <Form.Item label="终止时间">{getFieldDecorator("endTime", { initialValue: moment().subtract(1, "day") })(<DatePicker className="w-full" showTime format="YYYY-MM-DD HH:mm:ss" />)}</Form.Item>
        <Form.Item wrapperCol={{ span: 22, offset: 1 }}>
          <Button type="primary" htmlType="submit" className="w-full">
            开始计算
          </Button>
        </Form.Item>
      </Form>

      <div className="mt-4">
        <div className="text-white mt-8">站点贡献率状况</div>
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
      </div>

      {dynamicSource.computeType == "1" && (
        <div className="monitor-row-panel p-4 ">
          <div className="primary-button-text-dark text-lg">计算结果</div>
          <div className="primary-button-text-dark text-sm mt-2"> 时间: 2020-01-02 14:00:00</div>

          <Table className="monitor-table mt-10" {...store.monitorPanel.table} pagination={false} />
          <div>
            <div className="primary-text-color mt-10 text-center">园区TVOCs排放贡献率</div>
            <PieChart showLegend={false} pieRadius="80%" center={["50%", "50%"]} />
          </div>
        </div>
      )}
      {dynamicSource.computeType == "3" && (
        <div className="monitor-row-panel p-4 ">
          <div className="primary-button-text-dark text-lg">计算结果</div>
          <div className="primary-button-text-dark text-sm mt-2"> 时间: 2020-01-02 14:00:00</div>
          {store.monitorPanel.points.map((item, index) => (
            <div className="stat-panel text-white mt-8 p-4 flex">
              <div className="text-md">
                <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "red", display: "inline-block" }}></span>
                <span className="ml-2">{item.name}</span>
              </div>
              <div className="ml-4">
                <div>位置: {item.position}</div>
                <div>浓度: {item.concentration}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  ));
});
