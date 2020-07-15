import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import ReactEcharts from "echarts-for-react";
import { useStore } from "../../stores/index";
import { Link } from "react-router-dom";
import moment from "moment";

import { Spin, Card, Row, Col, Form, Button, Select, Input, DatePicker, Radio, Table, Badge, Divider, Breadcrumb, Alert, Modal } from "antd";
import { toJS } from "mobx";
const { Option } = Select;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;

export const ComparisonAnalysisPage = Form.create()(
  observer(({ form }: any) => {
    const chart1 = React.useRef<any>();
    const chart2 = React.useRef<any>();
    const chart3 = React.useRef<any>();

    const { getFieldDecorator, setFieldsValue, resetFields, getFieldsValue, getFieldValue, validateFields } = form;

    const {
      analysis: { comparison },
    } = useStore();

    const { loading, parkTree, ptList, option1, option2, option3 } = comparison;

    const doSubmit = (e) => {
      e.preventDefault();
      validateFields((err, values) => {
        if (err) {
          return;
        }
        comparison.getStatisAnalisis(values);
      });
    };

    useEffect(() => {
      comparison.getAllSitesTree();
    }, []);

    let factoryList: any = [];
    if (parkTree.length) {
      if (getFieldValue("parkId")) {
        factoryList = parkTree.find((item) => item.parkId === getFieldValue("parkId")).factorys || [];
      } else {
        factoryList = parkTree[0].factories || [];
      }
    }

    let pmCodeList: any = [];
    if (ptList.length) {
      if (getFieldValue("ptId")) {
        pmCodeList = ptList.find((item) => item.id === getFieldValue("ptId")).pms || [];
      } else {
        pmCodeList = ptList[0].pms || [];
      }
    }

    const [dateOpen, setDateOpen] = useState(false);

    let cardExtra = "";
    if (getFieldValue("collectDate")) {
      switch (getFieldValue("timeCycle")) {
        case 1:
          cardExtra = moment(getFieldValue("collectDate")).format("YYYY-MM-DD");
          break;
        case 2:
          cardExtra = `${moment(getFieldValue("collectDate")).format("YYYY-MM")}月`;
          break;
        case 3:
          cardExtra = moment(getFieldValue("collectDate")).format("YYYY");
          break;
      }
    }

    return (
      <div className="comparisonPage">
        <Spin spinning={loading}>
          <div style={{ background: "#fff", marginBottom: 20, border: "1px solid #e8e8e8", borderLeft: 0, borderRight: 0, padding: "20px" }}>
            <Breadcrumb>
              <Breadcrumb.Item>统计分析</Breadcrumb.Item>
              <Breadcrumb.Item>
                <Link to="/analysis/comparison">对比分析</Link>
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <Row gutter={10}>
            <Col span={6}>
              <Card size="small" title="检测数据统计排名">
                <Form onSubmit={doSubmit}>
                  {getFieldDecorator("detectType", { initialValue: 2, rules: [{ required: true }] })(<Input hidden />)}

                  <Form.Item colon={false} labelAlign="left" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} label="统计区域">
                    {getFieldDecorator("parkId", { initialValue: parkTree && parkTree[0] && parkTree[0].parkId, rules: [{ required: true, message: "请选择统计区域" }] })(
                      <Select onChange={() => setFieldsValue({ factoryId: "" })} placeholder="请选择" size="small">
                        {parkTree.map((item) => (
                          <Option key={item.parkId} value={item.parkId}>
                            {item.parkName}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>

                  <Form.Item colon={false} labelAlign="left" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} label="监测区域">
                    {getFieldDecorator("factoryIds", { initialValue: [factoryList && factoryList[0] && factoryList[0].factoryId], rules: [{ required: true, message: "请选择监测区域" }] })(
                      <Select mode="multiple" placeholder="请选择" size="small">
                        {factoryList.map((item) => (
                          <Option key={item.factoryId} value={item.factoryId}>
                            {item.factoryName}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>

                  <Form.Item colon={false} labelAlign="left" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} label="监测类型">
                    {getFieldDecorator("ptId", { initialValue: ptList && ptList[0] && ptList[0].id, rules: [{ required: true, message: "请选择监测类型" }] })(
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
                    {getFieldDecorator("pmCode", { initialValue: pmCodeList && pmCodeList[0] && pmCodeList[0].pmCode, rules: [{ required: true, message: "请选择监测因子" }] })(
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
                    {getFieldDecorator("timeCycle", { initialValue: 1, rules: [{ required: true, message: "请选择统计周期" }] })(
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
                        {/* <Radio.Button value={4} style={{ width: "20%", textAlign: "center" }}>
                          周
                        </Radio.Button>
                        <Radio.Button value={5} style={{ width: "20%", textAlign: "center" }}>
                          季
                        </Radio.Button> */}
                      </Radio.Group>
                    )}
                  </Form.Item>

                  {getFieldValue("timeCycle") === 1 && (
                    <Form.Item colon={false} labelAlign="left" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} label="统计时间">
                      {getFieldDecorator("collectDate", { initialValue: moment(), rules: [{ required: true, message: "请选择统计时间" }] })(
                        <DatePicker allowClear={false} format="YYYY-MM-DD" style={{ width: "100%" }} size="small" />
                      )}
                    </Form.Item>
                  )}
                  {getFieldValue("timeCycle") === 2 && (
                    <Form.Item colon={false} labelAlign="left" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} label="统计时间">
                      {getFieldDecorator("collectDate", { initialValue: moment(), rules: [{ required: true, message: "请选择统计时间" }] })(
                        <MonthPicker allowClear={false} format="YYYY-MM" style={{ width: "100%" }} size="small" />
                      )}
                    </Form.Item>
                  )}
                  {getFieldValue("timeCycle") === 3 && (
                    <Form.Item colon={false} labelAlign="left" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} label="统计时间">
                      {getFieldDecorator("collectDate", { initialValue: moment(), rules: [{ required: true, message: "请选择统计时间" }] })(
                        <DatePicker
                          allowClear={false}
                          onPanelChange={(val: any) => {
                            setFieldsValue({ collectDate: moment(val).startOf("year") });
                            setDateOpen(false);
                          }}
                          open={dateOpen}
                          onOpenChange={setDateOpen}
                          mode="year"
                          format="YYYY"
                          style={{ width: "100%" }}
                          size="small"
                        />
                      )}
                    </Form.Item>
                  )}

                  {getFieldValue("timeCycle") === 4 && (
                    <Form.Item colon={false} labelAlign="left" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} label="统计时间">
                      {getFieldDecorator("collectDate", { initialValue: moment(), rules: [{ required: true, message: "请选择统计时间" }] })(
                        <WeekPicker allowClear={false} style={{ width: "100%" }} size="small" />
                      )}
                    </Form.Item>
                  )}

                  {getFieldValue("timeCycle") === 5 && (
                    <Form.Item colon={false} labelAlign="left" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} label="统计时间">
                      {getFieldDecorator("collectDate", { initialValue: moment(), rules: [{ required: true, message: "请选择统计时间" }] })(
                        <DatePicker allowClear={false} format="Q" style={{ width: "100%" }} size="small" />
                      )}
                    </Form.Item>
                  )}

                  {/* <Divider orientation="left"></Divider> */}

                  {/* <Form.Item colon={false} labelAlign="left" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="排名方式" >
                  {getFieldDecorator("rankType", { initialValue: 1, rules: [{ required: true }] })(
                    <Radio.Group size="small" buttonStyle="solid">
                      <Radio.Button value={1}>前十</Radio.Button>
                      <Radio.Button value={2}>后十</Radio.Button>
                      <Radio.Button value={3}>全部</Radio.Button>
                    </Radio.Group>
                  )}
                </Form.Item> */}

                  <Form.Item colon={false} labelAlign="left" labelCol={{ span: 0 }} wrapperCol={{ span: 24 }}>
                    <Button type="primary" style={{ width: "100%" }} htmlType="submit">
                      开始统计
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </Col>
            <Col span={18}>
              <Row gutter={6}>
                <Col span={12} style={{ marginBottom: "10px" }}>
                  <Card bordered size="small" title="各行业排放贡献率" extra={cardExtra}>
                    <ReactEcharts
                      //@ts-ignore
                      option={toJS(option1)}
                      ref={chart1}
                      style={{ height: "360px" }}
                    />
                  </Card>
                </Col>
                <Col span={12} style={{ marginBottom: "10px" }}>
                  <Card bordered size="small" title="区域排放贡献率" extra={cardExtra}>
                    <ReactEcharts
                      //@ts-ignore
                      option={toJS(option2)}
                      ref={chart2}
                      style={{ height: "360px" }}
                    />
                  </Card>
                </Col>
                <Col span={24} style={{ marginBottom: "10px" }}>
                  <Card bordered size="small" title="区域排放趋势对比" extra={cardExtra}>
                    <ReactEcharts
                      //@ts-ignore
                      option={toJS(option3)}
                      ref={chart3}
                      style={{ height: "360px" }}
                    />
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </Spin>
        <div className="fixed bottom-0 text-center pb-1" style={{ width: "calc(100% - 200px)", color: "white", zIndex: 9999 }}>
          版权所有: 武汉三藏科技有限责任公司
        </div>
      </div>
    );
  })
);
