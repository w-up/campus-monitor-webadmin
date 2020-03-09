import React from "react";
import { useObserver, useLocalStore } from "mobx-react-lite";
import { Form, Select, Button, Table, Icon, DatePicker, Slider, Switch, Input } from "antd";
import { WrappedFormUtils } from "antd/lib/form/Form";
import { TableProps } from "antd/lib/table";
import RadioGroup from "antd/lib/radio/group";
import { PieChart } from "../../components/PieChart";

//@ts-ignore
export const DynamicSourcePanel = Form.create()(({ form }: { form: WrappedFormUtils }) => {
  const { getFieldDecorator } = form;

  const store = useLocalStore(() => ({
    isPlaying: false,
    formItemLayout: {
      labelCol: {
        span: 8
      },
      wrapperCol: {
        span: 16
      }
    },
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
        <Form.Item label="是否自选敏感点">
          <Switch checked={store.form.isChecked} onChange={() => (store.form.isChecked = !store.form.isChecked)} />
        </Form.Item>
        {store.form.isChecked ? (
          <div>
            <Form.Item label="敏感点经度">{getFieldDecorator("data1", { initialValue: "" })(<Input />)}</Form.Item>
            <Form.Item label="敏感点维度">{getFieldDecorator("data2", { initialValue: "" })(<Input />)}</Form.Item>
            <Form.Item label="检测物质浓度">{getFieldDecorator("data3", { initialValue: "" })(<Input />)}</Form.Item>
            <Form.Item label="风向">{getFieldDecorator("data4", { initialValue: "" })(<Input suffix={<span>°</span>} />)}</Form.Item>
            <Form.Item label="风速">{getFieldDecorator("data5", { initialValue: "" })(<Input suffix={<span>m/s</span>} />)}</Form.Item>
            <Form.Item label="温度">{getFieldDecorator("data6", { initialValue: "" })(<Input suffix={<span>°</span>} />)}</Form.Item>
            <Form.Item label="相对湿度">{getFieldDecorator("data7", { initialValue: "" })(<Input suffix={<span>%</span>} />)}</Form.Item>
          </div>
        ) : (
          <Form.Item label="选择敏感点">
            {getFieldDecorator("point", { initialValue: "1" })(
              <Select>
                <Select.Option value="1">敏感点1</Select.Option>
              </Select>
            )}
          </Form.Item>
        )}
        <Form.Item label="起始时间">{getFieldDecorator("startTime", { initialValue: "" })(<DatePicker className="w-full" showTime format="YYYY-MM-DD HH:mm:ss" />)}</Form.Item>
        <Form.Item label="终止时间">{getFieldDecorator("endTime", { initialValue: "" })(<DatePicker className="w-full" showTime format="YYYY-MM-DD HH:mm:ss" />)}</Form.Item>
        <div className="my-8 mx-2">
          <div className="primary-text-color">计算方法</div>
          {getFieldDecorator("point", { initialValue: "1" })(<RadioGroup options={store.form.options}></RadioGroup>)}
        </div>
        <Form.Item wrapperCol={{ span: 22 }}>
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

      <div className="monitor-row-panel p-4 ">
        <div className="primary-button-text-dark text-lg">计算结果</div>
        <div className="primary-button-text-dark text-sm mt-2"> 时间: 2020-01-02 14:00:00</div>

        <Table className="monitor-table mt-10" {...store.monitorPanel.table} pagination={false} />
        <div>
          <div className="primary-text-color mt-10 text-center">园区TVOCs排放贡献率</div>
          <PieChart showLegend={false} pieRadius="80%" center={["50%", "50%"]} />
        </div>
      </div>
    </div>
  ));
});
