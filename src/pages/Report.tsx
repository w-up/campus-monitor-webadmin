import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import ReactEcharts from "echarts-for-react";
import { useStore } from "../stores/index";
import { Link } from "react-router-dom";
import { toJS } from "mobx";
import moment from 'moment';

import { Checkbox, Card, Row, Col, Form, Button, Select, Input, DatePicker, Radio, Table, Badge, Divider, Breadcrumb, Alert, Modal, Spin } from 'antd';
const { Option } = Select;


export const ReportPage = Form.create()(observer(({ form }: any) => {

  const chart3 = React.useRef<any>();

  const {
    report,
  } = useStore();

  useEffect(() => {
    report.getParkList();
    report.getCompanyList();
    report.getAllPMTypeAndCode();

  }, []);

  const { getFieldDecorator, setFieldsValue, getFieldsValue, getFieldValue, validateFields } = form;

  const {
    loading, parkList, companyList, pmList,
    tableData, tableColumn, chartOption,
  } = report;

  let pmCodeList: any = [];
  if (getFieldValue('pmType')) {
    pmCodeList = pmList.find(item => item.id === getFieldValue('pmType')).pms;
  }

  const doSubmit = (e) => {
    e.preventDefault();
    validateFields((err, values) => {
      if (err) {
        return;
      }
      report.getStatisReport(values);
    });
  }

  const doExport = () => {
    validateFields((err, values) => {
      if (err) {
        return;
      }
      report.exportStatisReport(values);
    });
  }

  const onSelectAll = (e) => {
    const { checked } = e.target;
    if (checked) {
      setFieldsValue({
        pmCodes: pmCodeList.map(item => item.pmCode),
      });
    } else {
      setFieldsValue({
        pmCodes: [],
      });
    }
  }

  const allChecked = getFieldValue('pmCodes') && (getFieldValue('pmCodes').length === pmCodeList.length);

  let cardTitle = '';
  if (getFieldValue('parkId')) {
    cardTitle = parkList.find(item => item.id === getFieldValue('parkId')).parkName;
  } else if (getFieldValue('companyId')) {
    cardTitle = companyList.find(item => item.id === getFieldValue('companyId')).companyName;
  }

  let cardExtra = '';
  if (getFieldValue('collectDate')) {
    cardExtra = moment(getFieldValue('collectDate')).format('YYYY-MM-DD');
  }

  let pmCardTitle = '';
  if (getFieldValue('pmType')) {
    pmCardTitle = pmList.find(item => item.id === getFieldValue('pmType')).label;
  }

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
              <Form onSubmit={doSubmit} >
                <Form.Item colon={false} labelAlign="left" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="统计方式">
                  {getFieldDecorator("statisType", { initialValue: 1, rules: [{ required: true }] })(
                    <Select placeholder="请选择" size="small">
                      <Option value={2}>按企业</Option>
                      <Option value={1}>按园区</Option>
                    </Select>
                  )}
                </Form.Item>
                
                {getFieldValue('statisType') === 1 &&
                <Form.Item colon={false} labelAlign="left" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="选择园区" >
                  {getFieldDecorator("parkId", { initialValue: '', rules: [{ required: true }] })(
                    <Select placeholder="请选择" size="small">
                      {parkList.map(item => <Option key={item.id} value={item.id}>{item.parkName}</Option>)}
                    </Select>
                  )}
                </Form.Item>
                }

                {getFieldValue('statisType') === 2 &&
                <Form.Item colon={false} labelAlign="left" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="选择企业" >
                  {getFieldDecorator("companyId", { initialValue: '', rules: [{ required: true }] })(
                    <Select placeholder="请选择" size="small">
                      {companyList.map(item => <Option key={item.id} value={item.id}>{item.companyName}</Option>)}
                    </Select>
                  )}
                </Form.Item>
                }
                
                <Form.Item colon={false} labelAlign="left" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="监测对象">
                  {getFieldDecorator("pmType", { initialValue: '', rules: [{ required: true }] })(
                    <Select onChange={() => setFieldsValue({ pmCodes: [] })} placeholder="请选择" size="small">
                      {pmList.map(item => <Option key={item.id} value={item.id}>{item.label}</Option>)}
                    </Select>
                  )}
                </Form.Item>

                {!!getFieldValue('pmType') && 
                <Row>
                  <Checkbox style={{ fontSize: '10px' }} checked={allChecked} onChange={onSelectAll}>全选</Checkbox>
                  <Form.Item colon={false} labelAlign="left" labelCol={{ span: 0 }} wrapperCol={{ span: 24 }} label="" >
                    {getFieldDecorator("pmCodes", { initialValue: [], rules: [{ required: true }] })(
                      <Checkbox.Group style={{ width: '100%' }}>
                        <Row>
                          {pmCodeList.map(item => <Col span={8} key={item.pmCode}><Checkbox style={{ fontSize: '10px' }} value={item.pmCode}>{item.pmName}</Checkbox></Col>)}
                        </Row>
                      </Checkbox.Group>
                    )}
                  </Form.Item>
                </Row>
                }

              <Divider orientation="left">报表类型</Divider>
              <Form.Item colon={false} labelAlign="left" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="统计周期">
                {getFieldDecorator("timeCycle", { initialValue: 1, rules: [{ required: true }] })(
                  <Radio.Group style={{ width: '100%' }} size="small" buttonStyle="solid">
                    <Radio.Button style={{ width: '20%', textAlign: 'center' }} value={1}>日</Radio.Button>
                    <Radio.Button style={{ width: '20%', textAlign: 'center' }} value={2}>月</Radio.Button>
                    <Radio.Button style={{ width: '20%', textAlign: 'center' }} value={3}>年</Radio.Button>
                    <Radio.Button style={{ width: '20%', textAlign: 'center' }} value={4}>周</Radio.Button>
                    <Radio.Button style={{ width: '20%', textAlign: 'center' }} value={5}>季</Radio.Button>
                  </Radio.Group>
                )}
              </Form.Item>
              <Form.Item colon={false} labelAlign="left" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="统计时间">
                {getFieldDecorator("collectDate", { initialValue: '', rules: [{ required: true }] })(
                  <DatePicker style={{ width:  '100%' }} size="small" />
                )}
              </Form.Item>
              <Row gutter={20}>
                <Col span={12}>
                  <Form.Item colon={false} labelAlign="left" labelCol={{ span: 0 }} wrapperCol={{ span: 24 }}>
                    <Button type="primary" style={{ width: '100%' }} htmlType="submit">开始统计</Button>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item colon={false} labelAlign="left" labelCol={{ span: 0 }} wrapperCol={{ span: 24 }}>
                    <Button style={{ width: '100%' }} onClick={doExport} >导出</Button>
                  </Form.Item>
                </Col>
              </Row>
              </Form>
            </Card>
          </Col>
          <Col span={18}>
            <Row gutter={6}>
              <Col span={24} style={{ marginBottom: '10px' }}>
                <Card bordered size="small" title={`${cardTitle}监测数据`} extra={cardExtra}>
                  <Table bordered size="small" scroll={{ x: 1300, y: 600 }} pagination={false} columns={toJS(tableColumn)} dataSource={toJS(tableData)} />
                </Card>
              </Col>
              <Col span={24} style={{ marginBottom: '10px' }}>
                <Card bordered size="small" title={`${pmCardTitle}污染物排放浓度24小时趋势图`} extra={cardExtra}>
                  <ReactEcharts
                    //@ts-ignore
                    option={toJS(chartOption)}
                    ref={chart3}
                    style={{ height: '360px' }}
                  />
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>

      </Spin>
    </div>
    
  );
}));