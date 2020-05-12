import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import ReactEcharts from "echarts-for-react";
import { useStore } from "../stores/index";
import { Link } from "react-router-dom";
import { toJS } from "mobx";
import moment from "moment";

import { Checkbox, Card, Row, Col, Form, Button, Select, Input, DatePicker, Radio, Table, Badge, Divider, Breadcrumb, Alert, Modal, Spin } from "antd";
const { Option } = Select;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;

const timeCycleArr = ["日", "月", "年", "周", "季"];

export const ReportPage = Form.create()(
  observer(({ form }: any) => {
    const chart3 = React.useRef<any>();

    const { report } = useStore();

    useEffect(() => {
      report.getAllCompanyAndPark();
      // report.getParkList();
      // report.getCompanyList();
      report.getAllPMTypeAndCode();
    }, []);

    const { getFieldDecorator, setFieldsValue, getFieldsValue, getFieldValue, validateFields } = form;

    const { loading, parkList, companyList, pmList, tableData, tableColumn, chartOption, heatOptions, yearOptions } = report;

    let pmCodeList: any = [];
    if (getFieldValue("pmType")) {
      pmCodeList = pmList.find((item) => item.id === getFieldValue("pmType")).pms;
    }

    const doSubmit = (e) => {
      e.preventDefault();
      validateFields((err, values) => {
        if (err) {
          return;
        }
        report.getStatisReport(values);
      });
    };

    const doExport = () => {
      validateFields((err, values) => {
        if (err) {
          return;
        }
        report.exportStatisReport(values);
      });
    };

    const onSelectAll = (e) => {
      const { checked } = e.target;
      if (checked) {
        setFieldsValue({
          pmCodes: pmCodeList.map((item) => item.pmCode),
        });
      } else {
        setFieldsValue({
          pmCodes: [],
        });
      }
    };

    const allChecked = getFieldValue("pmCodes") && getFieldValue("pmCodes").length === pmCodeList.length;

    let cardTitle = "";
    if (getFieldValue("parkId")) {
      cardTitle = parkList.find((item) => item.parkId === getFieldValue("parkId")).parkName;
    } else if (getFieldValue("companyId")) {
      cardTitle = companyList.find((item) => item.companyId === getFieldValue("companyId")).companyName;
    }

    let cardExtra = "";
    let reportName = "";
    if (getFieldValue("collectDate")) {
      switch (getFieldValue("timeCycle")) {
        case 1:
          cardExtra = moment(getFieldValue("collectDate")).format("YYYY-MM-DD");
          reportName = '日报';
          break;
        case 2:
          cardExtra = `${moment(getFieldValue("collectDate")).format("YYYY-MM")}月`;
          reportName = '月报';
          break;
        case 3:
          cardExtra = moment(getFieldValue("collectDate")).format("YYYY");
          reportName = '年报';
          break;
        case 4:
          cardExtra = moment(getFieldValue("collectDate")).format("w");
          reportName = '周报';
          break;
        case 5:
          cardExtra = `${moment(getFieldValue("collectDate")).format("Q")}季度`;
          reportName = '季报';
          break;
      }
    }

    let pmCardTitle = "";
    if (getFieldValue("pmType")) {
      pmCardTitle = pmList.find((item) => item.id === getFieldValue("pmType")).label;
    }

    const [dateOpen, setDateOpen] = useState(false);

    console.log('heatOptions', toJS(heatOptions));

    return (
      <div className="reportPage">
        <Spin spinning={loading}>
          <div style={{ background: "#fff", marginBottom: 20, border: "1px solid #e8e8e8", borderLeft: 0, borderRight: 0, padding: "20px" }}>
            <Breadcrumb>
              <Breadcrumb.Item>统计报表</Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <Row gutter={10}>
            <Col span={6}>
              <Card size="small" title="统计报表">
                <Form onSubmit={doSubmit}>
                  <Form.Item colon={false} labelAlign="left" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="统计方式">
                    {getFieldDecorator("statisType", { initialValue: 1, rules: [{ required: true, message: '请选择统计方式' }] })(
                      <Select placeholder="请选择" size="small">
                        <Option value={2}>按企业</Option>
                        <Option value={1}>按园区</Option>
                      </Select>
                    )}
                  </Form.Item>

                  {getFieldValue("statisType") === 1 && (
                    <Form.Item colon={false} labelAlign="left" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="选择园区">
                      {getFieldDecorator("parkId", { initialValue: parkList && parkList[0] && parkList[0].parkId, rules: [{ required: true, message: '请选择园区' }] })(
                        <Select placeholder="请选择" size="small">
                          {parkList.map((item) => (
                            <Option key={item.parkId} value={item.parkId}>
                              {item.parkName}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>
                  )}

                  {getFieldValue("statisType") === 2 && (
                    <Form.Item colon={false} labelAlign="left" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="选择企业">
                      {getFieldDecorator("companyId", { initialValue: companyList && companyList[0] && companyList[0].companyId, rules: [{ required: true, message: '请选择企业' }] })(
                        <Select placeholder="请选择" size="small">
                          {companyList.map((item) => (
                            <Option key={item.companyId} value={item.companyId}>
                              {item.companyName}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>
                  )}

                  <Form.Item colon={false} labelAlign="left" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="监测因子">
                    {getFieldDecorator("pmType", { initialValue: pmList && pmList[0] && pmList[0].id, rules: [{ required: true, message: '请选择监测因子' }] })(
                      <Select onChange={() => setFieldsValue({ pmCodes: [] })} placeholder="请选择" size="small">
                        {pmList.map((item) => (
                          <Option key={item.id} value={item.id}>
                            {item.label}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>

                  {!!getFieldValue("pmType") && (
                    <Row>
                      <Checkbox style={{ fontSize: "10px" }} checked={allChecked} onChange={onSelectAll}>
                        全选
                      </Checkbox>
                      <Form.Item colon={false} labelAlign="left" labelCol={{ span: 0 }} wrapperCol={{ span: 24 }} label="">
                        {getFieldDecorator("pmCodes", { initialValue: pmCodeList && pmCodeList.map(v => v.pmCode), rules: [{ required: true }] })(
                          <Checkbox.Group style={{ width: "100%" }}>
                            <Row>
                              {pmCodeList.map((item) => (
                                <Col span={8} key={item.pmCode}>
                                  <Checkbox style={{ fontSize: "10px" }} value={item.pmCode}>
                                    {item.pmName}
                                  </Checkbox>
                                </Col>
                              ))}
                            </Row>
                          </Checkbox.Group>
                        )}
                      </Form.Item>
                    </Row>
                  )}

                  <Divider orientation="left">报表类型</Divider>
                  <Form.Item colon={false} labelAlign="left" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="统计周期">
                    {getFieldDecorator("timeCycle", { initialValue: 1, rules: [{ required: true, message: '请选择统计周期' }] })(
                      <Radio.Group style={{ width: "100%" }} size="small" buttonStyle="solid">
                        <Radio.Button style={{ width: "20%", textAlign: "center" }} key={1} value={1}>日</Radio.Button>
                        <Radio.Button style={{ width: "20%", textAlign: "center" }} key={4} value={4}>周</Radio.Button>
                        <Radio.Button style={{ width: "20%", textAlign: "center" }} key={2} value={2}>月</Radio.Button>
                        <Radio.Button style={{ width: "20%", textAlign: "center" }} key={5} value={5}>季</Radio.Button>
                        <Radio.Button style={{ width: "20%", textAlign: "center" }} key={3} value={3}>年</Radio.Button>
                      </Radio.Group>
                    )}
                  </Form.Item>

                  {getFieldValue("timeCycle") === 1 && (
                    <Form.Item colon={false} labelAlign="left" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="统计时间">
                      {getFieldDecorator("collectDate", { initialValue: moment(), rules: [{ required: true, message: '请选择统计周期' }] })(
                        <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} size="small" allowClear={false} />
                      )}
                    </Form.Item>
                  )}
                  {getFieldValue("timeCycle") === 2 && (
                    <Form.Item colon={false} labelAlign="left" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="统计时间">
                      {getFieldDecorator("collectDate", { initialValue: moment(), rules: [{ required: true, message: '请选择统计周期' }] })(<MonthPicker format="YYYY-MM" style={{ width: "100%" }} size="small" allowClear={false} />)}
                    </Form.Item>
                  )}
                  {getFieldValue("timeCycle") === 3 && (
                    <Form.Item colon={false} labelAlign="left" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="统计时间">
                      {getFieldDecorator("collectDate", { initialValue: moment(), rules: [{ required: true, message: '请选择统计周期' }] })(<DatePicker format="YYYY" onPanelChange={(val: any) => {
                        setFieldsValue({ collectDate: moment(val).startOf('year') });
                        setDateOpen(false);
                      }} open={dateOpen} onOpenChange={setDateOpen} mode={"year" as any} style={{ width: "100%" }} size="small" allowClear={false} />)}
                    </Form.Item>
                  )}

                  {getFieldValue("timeCycle") === 4 && (
                    <Form.Item colon={false} labelAlign="left" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="统计时间">
                      {getFieldDecorator("collectDate", { initialValue: moment().subtract(1, "weeks"), rules: [{ required: true, message: '请选择统计周期' }] })(<WeekPicker style={{ width: "100%" }} size="small" />)}
                    </Form.Item>
                  )}

                  {getFieldValue("timeCycle") === 5 && (
                    <Form.Item colon={false} labelAlign="left" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="统计时间">
                      {getFieldDecorator("collectDate", { initialValue: moment(), rules: [{ required: true, message: '请选择统计周期' }] })(<DatePicker format="YYYY-Q" style={{ width: "100%" }} size="small" />)}
                    </Form.Item>
                  )}

                  <Row gutter={20}>
                    <Col span={12}>
                      <Form.Item colon={false} labelAlign="left" labelCol={{ span: 0 }} wrapperCol={{ span: 24 }}>
                        <Button type="primary" style={{ width: "100%" }} htmlType="submit">
                          开始统计
                        </Button>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item colon={false} labelAlign="left" labelCol={{ span: 0 }} wrapperCol={{ span: 24 }}>
                        <Button style={{ width: "100%" }} onClick={doExport}>
                          导出
                        </Button>
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </Card>
            </Col>
            <Col span={18}>
              <Row gutter={6}>
                <Col span={24} style={{ marginBottom: "10px" }}>
                  <Card bordered size="small" title={`${cardTitle}监测数据${reportName}`} extra={cardExtra}>
                    <Table bordered size="small" scroll={{ x: 800 }} pagination={false} columns={toJS(tableColumn)} dataSource={toJS(tableData)} />
                  </Card>
                </Col>

                {getFieldValue("timeCycle") === 1 && ( // 日
                  <Col span={24} style={{ marginBottom: "10px" }}>
                    <Card bordered size="small" title={`${pmCardTitle}污染物排放浓度${timeCycleArr[getFieldValue("timeCycle") - 1]}趋势图`} extra={cardExtra}>
                      <ReactEcharts
                        //@ts-ignore
                        key={JSON.stringify(chartOption)}
                        option={toJS(chartOption)}
                        ref={chart3}
                        style={{ height: "360px" }}
                      />
                    </Card>
                  </Col>
                )}

                {getFieldValue("timeCycle") === 2 && ( // 月
                  <Col span={24} style={{ marginBottom: "10px" }}>
                    {heatOptions.map((option) => {
                      return (
                        <Col span={12}>
                          <Card bordered size="small" title={`${option.series[0].name}按月排放浓度趋势图`} extra={cardExtra}>
                            <ReactEcharts
                              //@ts-ignore
                              key={JSON.stringify(option)}
                              option={toJS(option)}
                              // style={{ height: '360px' }}
                            />
                          </Card>
                        </Col>
                      );
                    })}
                  </Col>
                )}

                {getFieldValue("timeCycle") === 3 && ( // 年
                  <Col span={24} style={{ marginBottom: "10px" }}>
                    {yearOptions.map((option) => {
                      return (
                        <Col span={12}>
                          <Card bordered size="small" title={`${option.series[0].name}各月份报警次数排行榜`} extra={cardExtra}>
                            <ReactEcharts
                              //@ts-ignore
                              key={JSON.stringify(option)}
                              option={toJS(option)}
                              // style={{ height: '360px' }}
                            />
                          </Card>
                        </Col>
                      );
                    })}
                  </Col>
                )}

                {getFieldValue("timeCycle") === 4 && ( // 周
                  <Col span={24} style={{ marginBottom: "10px" }}>
                    {heatOptions.map((option) => {
                      return (
                        <Card bordered size="small" title={`${option.series[0].name}污染物按周排放情况`} extra={`第${cardExtra}周`}>
                          <ReactEcharts
                            //@ts-ignore
                            key={JSON.stringify(option)}
                            option={toJS(option)}
                            style={{ height: "360px" }}
                          />
                        </Card>
                      );
                    })}
                  </Col>
                )}

                {getFieldValue("timeCycle") === 5 && ( // 季
                  <Col span={24} style={{ marginBottom: "10px" }}>
                    {heatOptions.map((option) => {
                      return (
                        <Card bordered size="small" title={`${option.series[0].name}污染物按季排放情况`} extra={`第${cardExtra}`}>
                          <ReactEcharts
                            //@ts-ignore
                            key={JSON.stringify(option)}
                            option={toJS(option)}
                            style={{ height: "360px" }}
                          />
                        </Card>
                      );
                    })}
                  </Col>
                )}
              </Row>
            </Col>
          </Row>
        </Spin>
        <div className="fixed bottom-0 text-center pb-1" style={{ width:"calc(100% - 200px)", color:"#88a8c5", zIndex:9999}}>版权所有: 武汉三藏科技有限责任公司</div>
      </div>
    );
  })
);
