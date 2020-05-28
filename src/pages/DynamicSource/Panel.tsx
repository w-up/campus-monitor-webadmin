import React from "react";
import { useObserver, useLocalStore } from "mobx-react-lite";
import { Form, Select, Button, Table, Icon, DatePicker, Slider, Switch, Input, Spin } from "antd";
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
    loading: false,
    isPlaying: false,
    formItemLayout: {
      labelCol: {
        span: 7,
      },
      wrapperCol: {
        span: 15,
      },
    },
    startTime: moment().startOf("d") as any,
    endTime: null as any,
    disabledEndDate(endTime) {
      if (!this.startTime || !endTime) {
        return false;
      }
      return !moment(endTime).isBetween(this.startTime, moment(this.startTime).add(1, "day"));
    },
    togglePlay() {
      this.isPlaying = !this.isPlaying;
    },
    handleSubmit: (e) => {
      e.preventDefault();
      form.validateFieldsAndScroll(async (err, values) => {
        if (!err) {
          store.loading = true;
          console.log("Received values of form: ", values);
          const { parkId: _parkId, endTime: _endTime, pmCode, startTime: _startTime } = values;
          const { lat, lng } = dynamicSource.curPoint;
          const parkId = _parkId;
          const startTime = moment(_startTime).format("YYYY-MM-DD HH");
          const endTime = moment(_endTime).format("YYYY-MM-DD HH");
          try {
            if (dynamicSource.computeType == "1") {
              const res = await api.MapMonitor.getDynamicSourceContribution({ parkId, lat, lng, pmCode, startTime, endTime });
              if (res) {
                dynamicSource.DynamicSourceContribution.data = res.data;
              }
            }
            if (dynamicSource.computeType == "2") {
              const res = await api.MapMonitor.getDynamicSourceWindRose({ endTime, parkId, pmCode, startTime });
              if (res) {
                dynamicSource.DynamicSourceWindRose.data = res.data;
              }
            }
            if (dynamicSource.computeType == "3") {
              const res = await api.MapMonitor.getDynamicSourceTraceSource({ endTime, parkId, pmCode, startTime });
              if (res) {
                dynamicSource.DynamicSourceTraceSource.data = res.data;
              }
            }
            store.loading = false;
          } catch (error) {
            store.loading = false;
          }
        }
      });
    },
    form: {
      isChecked: false,
      options: [
        { label: "贡献率", value: "1" },
        { label: "源方向", value: "2" },
        { label: "源位置和浓度", value: "3" },
      ],
    },
    monitorPanel: {
      points: [
        { name: "位置01", position: 29.1121, concentration: "121.1ppm" },
        { name: "位置02", position: 29.1121, concentration: "121.1ppm" },
        { name: "位置03", position: 29.1121, concentration: "121.1ppm" },
      ],
      get table(): any {
        return {
          dataSource: dynamicSource.curDynamicSourceContribution.valueList,
          columns: [
            {
              title: "监测类型",
              dataIndex: "monitoringType",
              align: "center",
            },
            {
              title: "站点名称",
              dataIndex: "siteName",
              align: "center",
            },
            {
              title: "贡献率",
              dataIndex: "rat",
              align: "center",
              render: (text) => <div className="primary-text-color">{text}</div>,
            },
          ],
        };
      },
    },
  }));

  return useObserver(() => (
    <div className="runtim-monitor px-4 mt-4">
      <div className="text-lg text-white mb-4 flex items-center">
        <Icon type="caret-right" theme="filled" className="primary-text-color" />
        <span className="ml-2">动态溯源</span>
      </div>
      <Spin spinning={store.loading}>
        <Form {...store.formItemLayout} onSubmit={store.handleSubmit}>
          <div className="mb-4">
            <div className="primary-text-color mb-4">计算方法</div>
            {getFieldDecorator("computeType", { initialValue: "1" })(<RadioGroup options={store.form.options} onChange={(e) => (dynamicSource.computeType = e.target.value)}></RadioGroup>)}
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
              <Form.Item label="敏感点经度">
                <Input value={dynamicSource.curPoint.lng} onChange={(e) => (dynamicSource.curPoint.lng = Number(e.target.value))} />
              </Form.Item>
              <Form.Item label="敏感点维度">
                <Input value={dynamicSource.curPoint.lat} onChange={(e) => (dynamicSource.curPoint.lat = Number(e.target.value))} />
              </Form.Item>
            </div>
          )}
          <Form.Item label="起始时间">
            {getFieldDecorator("startTime", { initialValue: store.startTime, rules: [{ required: true }] })(
              <DatePicker allowClear={false} showTime={{ format: "HH" }} onChange={(val) => (store.startTime = val)} className="w-full" format="YYYY-MM-DD HH" />
            )}
          </Form.Item>
          <Form.Item label="终止时间">
            {getFieldDecorator("endTime", { initialValue: store.endTime, rules: [{ required: true, message: "请选择终止时间" }] })(
              <DatePicker allowClear={false} disabledDate={store.disabledEndDate} className="w-full" onChange={(val) => (store.endTime = val)} showTime={{ format: "HH" }} format="YYYY-MM-DD HH" />
            )}
          </Form.Item>
          <Form.Item wrapperCol={{ span: 22, offset: 1 }}>
            <Button type="primary" htmlType="submit" className="w-full">
              开始计算
            </Button>
          </Form.Item>
        </Form>
      </Spin>

      <div className="text-white mt-8">站点贡献率状况</div>
      {dynamicSource.computeType == "1" && (
        <div>
          <div className="primary-text-color justify-end flex items-center ">
            <Icon type="clock-circle" theme="filled" />
            <span className="ml-2 text-sm">{dynamicSource.curDynamicSourceContribution?.datetime}</span>
          </div>
          <div className="stat-panel p-2 text-white flex items-center mt-2">
            <div onClick={(e) => dynamicSource.toggleTimer({ target: dynamicSource.DynamicSourceContribution })}>
              <Icon type={dynamicSource.DynamicSourceContribution.timer ? "pause-circle" : "play-circle"} theme="twoTone" className="text-white text-xl" />
            </div>
            <div className="flex-1 ml-4">
              <Slider
                value={dynamicSource.DynamicSourceContribution.index}
                max={dynamicSource.DynamicSourceContribution.data.length}
                onChange={(e) => dynamicSource.setCurrentTime({ target: dynamicSource.DynamicSourceContribution, val: Number(e), stop: true })}
              ></Slider>
            </div>
          </div>
        </div>
      )}

      {dynamicSource.computeType == "2" && (
        <div>
          <div className="primary-text-color justify-end flex items-center ">
            <Icon type="clock-circle" theme="filled" />
            <span className="ml-2 text-sm">{dynamicSource.curDynamicSourceWindRose?.datetime}</span>
          </div>
          <div className="stat-panel p-2 text-white flex items-center mt-2">
            <div onClick={(e) => dynamicSource.toggleTimer({ target: dynamicSource.DynamicSourceWindRose })}>
              <Icon type={dynamicSource.DynamicSourceWindRose.timer ? "pause-circle" : "play-circle"} theme="twoTone" className="text-white text-xl" />
            </div>
            <div className="flex-1 ml-4">
              <Slider
                value={dynamicSource.DynamicSourceWindRose.index}
                max={dynamicSource.DynamicSourceWindRose.data.length}
                onChange={(e) => dynamicSource.setCurrentTime({ target: dynamicSource.DynamicSourceWindRose, val: Number(e), stop: true })}
              ></Slider>
            </div>
          </div>
        </div>
      )}

      {dynamicSource.computeType == "3" && (
        <div>
          <div className="primary-text-color justify-end flex items-center ">
            <Icon type="clock-circle" theme="filled" />
            <span className="ml-2 text-sm">{dynamicSource.curDynamicSourceTraceSource?.datetime}</span>
          </div>
          <div className="stat-panel p-2 text-white flex items-center mt-2">
            <div onClick={(e) => dynamicSource.toggleTimer({ target: dynamicSource.DynamicSourceTraceSource })}>
              <Icon type={dynamicSource.DynamicSourceTraceSource.timer ? "pause-circle" : "play-circle"} theme="twoTone" className="text-white text-xl" />
            </div>
            <div className="flex-1 ml-4">
              <Slider
                value={dynamicSource.DynamicSourceTraceSource.index}
                max={dynamicSource.DynamicSourceTraceSource.data.length}
                onChange={(e) => dynamicSource.setCurrentTime({ target: dynamicSource.DynamicSourceTraceSource, val: Number(e), stop: true })}
              ></Slider>
            </div>
          </div>
        </div>
      )}

      {dynamicSource.computeType == "1" && dynamicSource.curDynamicSourceContribution && (
        <div className="monitor-row-panel p-4 ">
          <div
            style={{ position: "absolute", right: 20, top: "0" }}
            onClick={(e) =>
              (dynamicSource.DynamicSourceContribution = {
                index: 0,
                data: [],
                timer: 0,
              })
            }
          >
            <Button icon="close" shape="circle" style={{ background: "transparent", border: "none", color: "#6b6b6e" }}></Button>
          </div>
          <div className="primary-button-text-dark text-lg">计算结果</div>
          <div className="primary-button-text-dark text-sm mt-2"> 时间: {dynamicSource.curDynamicSourceContribution.datetime}</div>

          <Table className="monitor-table mt-10" {...store.monitorPanel.table} pagination={false} />
          <div>
            <PieChart showLegend={false} pieRadius="80%" data={dynamicSource.curDynamicSourceContribution.valueList.map((i) => ({ key: i.siteName, value: i.value }))} />
          </div>
        </div>
      )}
      {dynamicSource.computeType == "3" && dynamicSource.curDynamicSourceTraceSource && (
        <div className="monitor-row-panel p-4 ">
          <div
            style={{ position: "absolute", right: 20, top: "0" }}
            onClick={(e) =>
              (dynamicSource.DynamicSourceTraceSource = {
                index: 0,
                data: [],
                timer: 0,
              })
            }
          >
            <Button icon="close" shape="circle" style={{ background: "transparent", border: "none", color: "#6b6b6e" }}></Button>
          </div>
          <div className="primary-button-text-dark text-lg">计算结果</div>
          <div className="primary-button-text-dark text-sm mt-2"> 时间: {dynamicSource.curDynamicSourceTraceSource.datetime}</div>
          {dynamicSource.curDynamicSourceTraceSource?.valueList.map((item, index) => (
            <div className="stat-panel text-white mt-8 p-4 flex" key={index}>
              <div className="text-md">
                <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "red", display: "inline-block" }}></span>
                <span className="ml-2">{item.siteName}</span>
              </div>
              <div className="ml-4">
                <div>
                  位置: {item.lng} {item.lat}
                </div>
                <div>浓度: {item.value}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  ));
});
