import React from "react";
import { observer } from "mobx-react-lite";
import ReactEcharts from "echarts-for-react";
import { Card, Row, Col, Form, Button, Select, Input, DatePicker, Radio, Table, Badge, Divider, Breadcrumb, Alert, Modal } from 'antd';
const { Option } = Select;

const option3 = {
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    orient: 'horizontal',
    x: 'center',
    y: 'bottom',
    data: ['A化工', 'B化工', 'C化工', 'D化工', 'E化工']
  },
  backgroundColor: '#f0f0f0',
  toolbox: {
    show: true,
    feature: {
      mark: { show: true },
      dataView: { show: true, readOnly: false },
      magicType: { show: true, type: ['line', 'bar', 'stack', 'tiled'] },
      restore: { show: true },
      saveAsImage: { show: true }
    }
  },
  calculable: true,
  xAxis: [
    {
      type: 'category',
      boundaryGap: false,
      data: ['10-24-00', '10-24-06', '10-24-12', '10-24-18', '10-25-00']
    }
  ],
  yAxis: [
    {
      type: 'value'
    }
  ],
  series: [
    {
      name: 'A化工',
      type: 'line',
      stack: '总量',
      data: [120, 132, 101, 134, 90]
    },
    {
      name: 'B化工',
      type: 'line',
      stack: '总量',
      data: [220, 182, 191, 234, 290]
    },
    {
      name: 'C化工',
      type: 'line',
      stack: '总量',
      data: [150, 232, 201, 154, 190]
    },
    {
      name: 'D化工',
      type: 'line',
      stack: '总量',
      data: [320, 332, 301, 334, 390]
    },
    {
      name: 'E化工',
      type: 'line',
      stack: '总量',
      data: [820, 932, 901, 934, 1290]
    }
  ]
};


const columns = [
  {
    title: '时间',
    dataIndex: 'time',
    key: 'time',
  },
  {
    title: '测量值1',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '测量值2',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: '测量值3',
    key: 'tags',
    dataIndex: 'tags',
  },
];

const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    time: '2019年10月08日 00：00：00',
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    time: '2019年10月08日 00：00：00',
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    time: '2019年10月08日 00：00：00',
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
];

export const ReportPage = observer(() => {

  const chart3 = React.useRef<any>();

  return (
    <div style={{ minHeight: '100%', background: '#fff' }}>
      <Row>
        <Col span={6}>
          <Card title="统计报表">
            <Form>
              <Form.Item colon={false} labelAlign="left" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="统计方式" hasFeedback>
                <Select placeholder="请选择" size="small">
                  <Option value="china">按企业</Option>
                  <Option value="usa">按园区</Option>
                </Select>
              </Form.Item>
              <Form.Item colon={false} labelAlign="left" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="统计对象" hasFeedback>
                <Select placeholder="请选择" size="small">
                  <Option value="china">A化工</Option>
                  <Option value="usa">B化工</Option>
                </Select>
              </Form.Item>
              <Form.Item colon={false} labelAlign="left" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="监测对象" hasFeedback>
                <Select placeholder="请选择" size="small">
                  <Option value="china">气态污染物</Option>
                  <Option value="usa">液态污染物</Option>
                </Select>
              </Form.Item>
            </Form>
            <Divider orientation="left">报表类型</Divider>
            <Form.Item colon={false} labelAlign="left" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="统计周期" hasFeedback>
              <Radio.Group defaultValue="c" size="small" buttonStyle="solid">
                <Radio.Button value="a">日</Radio.Button>
                <Radio.Button value="a">周</Radio.Button>
                <Radio.Button value="c">月</Radio.Button>
                <Radio.Button value="c">季</Radio.Button>
                <Radio.Button value="d">年</Radio.Button>
              </Radio.Group>
            </Form.Item>
            <Form.Item colon={false} labelAlign="left" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="统计时间" hasFeedback>
              <DatePicker size="small" />
            </Form.Item>
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item colon={false} labelAlign="left" labelCol={{ span: 0 }} wrapperCol={{ span: 24 }}>
                  <Button style={{ width: '100%' }} htmlType="submit">开始统计</Button>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item colon={false} labelAlign="left" labelCol={{ span: 0 }} wrapperCol={{ span: 24 }}>
                  <Button type="primary" style={{ width: '100%' }} htmlType="submit">导出</Button>
                </Form.Item>
              </Col>
            </Row>
            
          </Card>
        </Col>
        <Col span={18} style={{ padding: '10px' }}>
          <Row gutter={6}>
            <Col span={24} style={{ marginBottom: '10px' }}>
              <Card bordered size="small" title="A企业监测日报" extra="2019-10-24">
                <Table bordered size="small" pagination={false} columns={columns} dataSource={data} />
              </Card>
            </Col>
            <Col span={24} style={{ marginBottom: '10px' }}>
              <Card bordered size="small" title="2019年10月08日 气态污染物排放浓度24小时趋势图" extra="2019-10-24">
                <ReactEcharts
                  //@ts-ignore
                  option={option3}
                  ref={chart3}
                  style={{ height: '360px' }}
                />
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>

    </div>
  );
})