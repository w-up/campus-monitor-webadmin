import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import ReactEcharts from "echarts-for-react";
import { Link } from "react-router-dom";
import { useStore } from "../../stores/index";

import { Checkbox, Spin, Card, Row, Col, Form, Button, Select, Tabs, Input, DatePicker, Radio, Table, Badge, Divider, Breadcrumb, Alert, Modal } from "antd";
import { toJS } from "mobx";
import moment from "moment";
const { Option } = Select;
const { TabPane } = Tabs;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;

const columns = [
  {
    title: "排名",
    dataIndex: "rankNum",
    key: "rankNum",
    render: (val, record, index) => index + 1,
  },
  {
    title: "监测类型",
    dataIndex: "jcType",
    key: "jcType",
  },
  {
    title: "区域",
    dataIndex: "areaName",
    key: "areaName",
  },
  {
    title: "排放率",
    dataIndex: "sumValue",
    key: "sumValue",
  },
  {
    title: "贡献率",
    key: "rateNum",
    dataIndex: "rateNum",
    render: val => `${(val * 100).toFixed(2)}%`,
  },
];

export const RankAnalysisPage = Form.create()(
  observer(({ form }: any) => {
    const chart1 = React.useRef<any>();
    const chart2 = React.useRef<any>();
    const chart3 = React.useRef<any>();

    const {
      analysis: { rank },
    } = useStore();

    const { getFieldDecorator, setFieldsValue, resetFields, getFieldsValue, getFieldValue, validateFields } = form;

    const { loading, parkTree, ptList, option1, option2, dataSource, option3, option4, dataSource2 } = rank;

    useEffect(() => {
      rank.getAllSitesTree();
    }, []);

    let pmCodeList: any = [];
    if (ptList.length) {
      if (getFieldValue("ptId")) {
        pmCodeList = ptList.find((item) => item.id === getFieldValue("ptId")).pms || [];
      } else {
        pmCodeList = ptList[0].pms || [];
      }
    }

    const doSubmit = (e) => {
      e.preventDefault();
      validateFields((err, values) => {
        if (err) {
          return;
        }
        rank.getStatisRank(values);
        rank.getStatisAnalisis(values);
      });
    };

    console.log("option1", toJS(option1));
    console.log("option2", toJS(option2));

    const [dateOpen, setDateOpen] = useState(false);

    return (
      <div className="rankPage">
        <Spin spinning={loading}>
          <div style={{ background: "#fff", marginBottom: 20, border: "1px solid #e8e8e8", borderLeft: 0, borderRight: 0, padding: "20px" }}>
            <Breadcrumb>
              <Breadcrumb.Item>统计分析</Breadcrumb.Item>
              <Breadcrumb.Item>
                <Link to="/analysis/rank">统计排名</Link>
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <Row gutter={10}>
            <Col span={6}>
              <Card size="small" title="检测数据统计排名">
                <Form onSubmit={doSubmit}>
                  {/* {getFieldDecorator("detectType", { initialValue: 2, rules: [{ required: true }] })(<Input hidden />)} */}

                  {/* <Form.Item colon={false} labelAlign="left" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} label="统计纬度">
                    {getFieldDecorator("detectType", { initialValue: 1, rules: [{ required: true }] })(
                      <Select placeholder="请选择" size="small">
                        <Option value={1}>站点</Option>
                        <Option value={2}>厂区</Option>
                      </Select>
                    )}
                  </Form.Item> */}

                  <Form.Item colon={false} labelAlign="left" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} label="统计区域">
                    {getFieldDecorator("parkId", { initialValue: "", rules: [{ required: true, message: '请选择统计区域' }] })(
                      <Select onChange={() => setFieldsValue({ factoryId: "" })} placeholder="请选择" size="small">
                        {parkTree?.map((item) => (
                          <Option key={item.parkId} value={item.parkId}>
                            {item.parkName}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>

                  <Form.Item colon={false} labelAlign="left" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} label="因子分类">
                    {getFieldDecorator("ptId", { initialValue: "", rules: [{ required: true, message: '请选择因子分类' }] })(
                      <Select placeholder="请选择" size="small">
                        {ptList.map((item) => (
                          <Option key={item.id} value={item.id}>
                            {item.label}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>

                  <Form.Item colon={false} labelAlign="left" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} label="监测因子">
                    {getFieldDecorator("pmCode", { initialValue: "", rules: [{ required: true, message: '请选择监测因子' }] })(
                      <Select placeholder="请选择" size="small">
                        {pmCodeList.map((item) => (
                          <Option key={item.pmCode} value={item.pmCode}>
                            {item.pmName}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>

                  <Divider orientation="left">时间</Divider>

                  <Form.Item colon={false} labelAlign="left" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} label="统计周期">
                    {getFieldDecorator("timeCycle", { initialValue: 1, rules: [{ required: true, message: '请选择统计周期' }] })(
                      <Radio.Group style={{ width: "100%" }} size="small" buttonStyle="solid">
                        <Radio.Button value={1} style={{ width: "33%", textAlign: "center" }}>
                          日
                        </Radio.Button>
                        <Radio.Button value={2} style={{ width: "33%", textAlign: "center" }}>
                          月
                        </Radio.Button>
                        <Radio.Button value={3} style={{ width: "33%", textAlign: "center" }}>
                          年
                        </Radio.Button>
                      </Radio.Group>
                    )}
                  </Form.Item>

                  {getFieldValue("timeCycle") === 1 && (
                    <Form.Item colon={false} labelAlign="left" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} label="统计时间">
                      {getFieldDecorator("collectDate", { initialValue: "", rules: [{ required: true, message: '请选择统计时间' }] })(
                        <DatePicker allowClear={false} format="YYYY-MM-DD" style={{ width: "100%" }} size="small" />
                      )}
                    </Form.Item>
                  )}
                  {getFieldValue("timeCycle") === 2 && (
                    <Form.Item colon={false} labelAlign="left" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} label="统计时间">
                      {getFieldDecorator("collectDate", { initialValue: "", rules: [{ required: true, message: '请选择统计时间' }] })(<MonthPicker allowClear={false} format="YYYY-MM" style={{ width: "100%" }} size="small" />)}
                    </Form.Item>
                  )}
                  {getFieldValue("timeCycle") === 3 && (
                    <Form.Item colon={false} labelAlign="left" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} label="统计时间">
                      {getFieldDecorator("collectDate", { initialValue: "", rules: [{ required: true, message: '请选择统计时间' }] })(<DatePicker allowClear={false} onPanelChange={(val: any) => {
                        setFieldsValue({ collectDate: moment(val).startOf('year') });
                        setDateOpen(false);
                      }} open={dateOpen} onOpenChange={setDateOpen} mode="year" format="YYYY" style={{ width: "100%" }} size="small" />)}
                    </Form.Item>
                  )}

                  {getFieldValue("timeCycle") === 4 && (
                    <Form.Item colon={false} labelAlign="left" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} label="统计时间">
                      {getFieldDecorator("collectDate", { initialValue: "", rules: [{ required: true, message: '请选择统计时间' }] })(<WeekPicker allowClear={false} style={{ width: "100%" }} size="small" />)}
                    </Form.Item>
                  )}

                  {getFieldValue("timeCycle") === 5 && (
                    <Form.Item colon={false} labelAlign="left" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} label="统计时间">
                      {getFieldDecorator("collectDate", { initialValue: "", rules: [{ required: true, message: '请选择统计时间' }] })(<DatePicker allowClear={false} format="Q" style={{ width: "100%" }} size="small" />)}
                    </Form.Item>
                  )}

                  <Divider orientation="left"></Divider>

                  <Form.Item colon={false} labelAlign="left" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} label="排名方式">
                    {getFieldDecorator("rankType", { initialValue: 1, rules: [{ required: true, message: '请选择排名方式' }] })(
                      <Radio.Group style={{ width: "100%" }} size="small" buttonStyle="solid">
                        <Radio.Button style={{ width: "33%", textAlign: "center" }} value={1}>
                          前十
                        </Radio.Button>
                        <Radio.Button style={{ width: "33%", textAlign: "center" }} value={2}>
                          后十
                        </Radio.Button>
                        <Radio.Button style={{ width: "33%", textAlign: "center" }} value={3}>
                          全部
                        </Radio.Button>
                      </Radio.Group>
                    )}
                  </Form.Item>

                  <Form.Item colon={false} labelAlign="left" labelCol={{ span: 0 }} wrapperCol={{ span: 24 }}>
                    <Button type="primary" style={{ width: "100%" }} htmlType="submit">
                      开始统计
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </Col>
            <Col span={18}>
              <Tabs defaultActiveKey="1" size="small">
                <TabPane tab="厂区排名" key="1">
                  <Row gutter={6}>
                    <Col span={12} style={{ marginBottom: "10px" }}>
                      <Card bordered size="small" title="区域排放量">
                        <ReactEcharts
                          //@ts-ignore
                          option={toJS(option1)}
                          ref={chart1}
                          style={{ height: "360px" }}
                        />
                      </Card>
                    </Col>
                    <Col span={12} style={{ marginBottom: "10px" }}>
                      <Card bordered size="small" title="区域排放量贡献率">
                        <ReactEcharts
                          //@ts-ignore
                          option={toJS(option2)}
                          ref={chart2}
                          style={{ height: "360px" }}
                        />
                      </Card>
                    </Col>
                    <Col span={24} style={{ marginBottom: "10px" }}>
                      <Card bordered size="small" title="区域排放量排名">
                        <Table bordered size="small" pagination={false} columns={columns} dataSource={toJS(dataSource)} />
                      </Card>
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tab="站点排名" key="2">
                  <Row gutter={6}>
                    <Col span={12} style={{ marginBottom: "10px" }}>
                      <Card bordered size="small" title="站点排放量">
                        <ReactEcharts
                          //@ts-ignore
                          option={toJS(option3)}
                          ref={chart1}
                          style={{ height: "360px" }}
                        />
                      </Card>
                    </Col>
                    <Col span={12} style={{ marginBottom: "10px" }}>
                      <Card bordered size="small" title="站点排放量贡献率">
                        <ReactEcharts
                          //@ts-ignore
                          option={toJS(option4)}
                          ref={chart2}
                          style={{ height: "360px" }}
                        />
                      </Card>
                    </Col>
                    <Col span={24} style={{ marginBottom: "10px" }}>
                      <Card bordered size="small" title="区域排放量排名">
                        <Table bordered size="small" pagination={false} columns={columns} dataSource={toJS(dataSource2)} />
                      </Card>
                    </Col>
                  </Row>
                </TabPane>
              </Tabs>
            </Col>
          </Row>
        </Spin>
      </div>
    );
  })
);
