import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import ReactEcharts from "echarts-for-react";
import { Link } from "react-router-dom";
import { useStore } from "../../stores/index";

import { Checkbox, Spin, Card, Row, Col, Form, Button, Select, Tabs, Input, DatePicker, Radio, Table, Badge, Divider, Breadcrumb, Alert, Modal } from 'antd';
import { toJS } from "mobx";
const { Option } = Select;
const { TabPane } = Tabs;


const columns = [
  {
    title: '排名',
    dataIndex: 'rankNum',
    key: 'rankNum',
  },
  {
    title: '区域',
    dataIndex: 'areaName',
    key: 'areaName',
  },
  {
    title: '排放率',
    dataIndex: 'sumValue',
    key: 'sumValue',
  },
  {
    title: '贡献率',
    key: 'rateNum',
    dataIndex: 'rateNum',
  },
];


export const RankAnalysisPage = Form.create()(observer(({ form }: any) => {

  const chart1 = React.useRef<any>();
  const chart2 = React.useRef<any>();
  const chart3 = React.useRef<any>();

  const {
    analysis: { rank }
  } = useStore();

  const { getFieldDecorator, setFieldsValue, resetFields, getFieldsValue, getFieldValue, validateFields } = form;

  const {
    loading, parkTree, ptList, option1, option2, dataSource,
  } = rank;

  useEffect(() => {
    rank.getAllSitesTree();
  }, []);

  let pmCodeList: any = [];
  if (ptList.length) {
    if (getFieldValue('ptId')) {
      pmCodeList = ptList.find(item => item.id === getFieldValue('ptId')).pms || [];
    } else {
      pmCodeList = ptList[0].pms || [];
    }
  }

  const doSubmit = e => {
    e.preventDefault();
    validateFields((err, values) => {
      if (err) {
        return;
      }
      rank.getStatisRank(values);
    });
  }

  console.log('option1', toJS(option1));
  console.log('option2', toJS(option2));

  return (
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
            
              {getFieldDecorator("detectType", { initialValue: 2, rules: [{ required: true }] })(
                <Input hidden />
              )}
              
              <Form.Item colon={false} labelAlign="left" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="统计区域" >
                {getFieldDecorator("parkId", { initialValue: '', rules: [{ required: true }] })(
                  <Select onChange={() => setFieldsValue({ factoryId: '' })} placeholder="请选择" size="small">
                    {parkTree.map(item => <Option key={item.parkId} value={item.parkId}>{item.parkName}</Option>)}
                  </Select>
                )}
              </Form.Item>

              <Form.Item colon={false} labelAlign="left" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="监测类型" >
                {getFieldDecorator("ptId", { initialValue: '', rules: [{ required: true }] })(
                  <Select placeholder="请选择" size="small">
                    {ptList.map(item => <Option key={item.id} value={item.id}>{item.label}</Option>)}
                  </Select>
                )}
              </Form.Item>

              <Form.Item colon={false} labelAlign="left" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="监测因子" >
                {getFieldDecorator("pmCode", { initialValue: '', rules: [{ required: true }] })(
                  <Select placeholder="请选择" size="small">
                    {pmCodeList.map(item => <Option key={item.pmCode} value={item.pmCode}>{item.pmName}</Option>)}
                  </Select>
                )}
              </Form.Item>

              <Divider orientation="left">时间</Divider>

              <Form.Item colon={false} labelAlign="left" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="统计周期" >
                {getFieldDecorator("timeCycle", { initialValue: 1, rules: [{ required: true }] })(
                  <Radio.Group size="small" buttonStyle="solid">
                  <Radio.Button value={1}>日</Radio.Button>
                  <Radio.Button value={2}>月</Radio.Button>
                  <Radio.Button value={3}>年</Radio.Button>
                  <Radio.Button value={4}>周</Radio.Button>
                  <Radio.Button value={5}>季</Radio.Button>
                </Radio.Group>
                )}
              </Form.Item>


              <Form.Item colon={false} labelAlign="left" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="统计时间" >
                {getFieldDecorator("endTime", { initialValue: '', rules: [{ required: true }] })(
                  <DatePicker size="small" />
                )}
              </Form.Item>

              <Divider orientation="left"></Divider>

              <Form.Item colon={false} labelAlign="left" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="排名方式" >
                {getFieldDecorator("rankType", { initialValue: 1, rules: [{ required: true }] })(
                  <Radio.Group size="small" buttonStyle="solid">
                    <Radio.Button value={1}>前十</Radio.Button>
                    <Radio.Button value={2}>后十</Radio.Button>
                    <Radio.Button value={3}>全部</Radio.Button>
                  </Radio.Group>
                )}
              </Form.Item>

              <Form.Item colon={false} labelAlign="left" labelCol={{ span: 0 }} wrapperCol={{ span: 24 }}>
                <Button type="primary" style={{ width: '100%' }} htmlType="submit">开始统计</Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
        <Col span={18}>
          <Row gutter={6}>
            <Col span={12} style={{ marginBottom: '10px' }}>
              <Card bordered size="small" title="排放量" >
                <Tabs defaultActiveKey="1" size="small">
                  <TabPane tab="企业排名" key="1">
                    <ReactEcharts
                      //@ts-ignore
                      option={toJS(option1)}
                      ref={chart1}
                      style={{ height: '360px' }}
                    />
                  </TabPane>
                  <TabPane tab="站点排名" key="2">
                    <ReactEcharts
                      //@ts-ignore
                      option={toJS(option1)}
                      ref={chart1}
                      style={{ height: '360px' }}
                    />
                  </TabPane>
                </Tabs>
              </Card>
            </Col>
            <Col span={12} style={{ marginBottom: '10px' }}>
              <Card bordered size="small" title="贡献率" >
                <ReactEcharts
                  //@ts-ignore
                  option={toJS(option2)}
                  ref={chart2}
                  style={{ height: '360px' }}
                />
              </Card>
            </Col>
            <Col span={24} style={{ marginBottom: '10px' }}>
              <Card bordered size="small" title="区域TVOCs等效排放量贡献率" >
                <Table bordered size="small" pagination={false} columns={columns} dataSource={toJS(dataSource)} />
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>

    </Spin>
  );
}));