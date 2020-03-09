import React from "react";
import { observer } from "mobx-react-lite";
import ReactEcharts from "echarts-for-react";
import { Card, Row, Col, Form, Button, Select, Tabs, Input, DatePicker, Radio, Table, Badge, Divider, Breadcrumb, Alert, Modal } from 'antd';
const { Option } = Select;
const { TabPane } = Tabs;

const option1 = {
  tooltip: {
    trigger: 'axis'
  },
  backgroundColor: '#f0f0f0',
  toolbox: {
    show: true,
    feature: {
      mark: { show: true },
      dataView: { show: true, readOnly: false },
      magicType: { show: true, type: ['line', 'bar'] },
      restore: { show: true },
      saveAsImage: { show: true }
    }
  },
  calculable: true,
  xAxis: [
    {
      type: 'value',
      boundaryGap: [0, 0.01]
    }
  ],
  yAxis: [
    {
      type: 'category',
      data: ['A化工', 'B化工', 'C化工', 'D化工', 'E化工', 'F化工']
    }
  ],
  series: [
    {
      name: '2011年',
      type: 'bar',
      data: [18203, 23489, 29034, 104970, 131744, 630230]
    },
  ]
};

const option2 = {
  legend: {
    orient: 'horizontal',
    x: 'center',
    y: 'bottom',
    data: ['行业1', '行业2', '行业3']
  },
  backgroundColor: '#f0f0f0',
  toolbox: {
    show: true,
    feature: {
      mark: { show: true },
      dataView: { show: true, readOnly: false },
      magicType: {
        show: true,
        type: ['pie', 'funnel']
      },
      restore: { show: true },
      saveAsImage: { show: true }
    }
  },
  calculable: false,
  series: [
    {
      name: '访问来源',
      type: 'pie',
      selectedMode: 'single',
      radius: [0, 140],

      funnelAlign: 'right',
      max: 1548,

      itemStyle: {
        normal: {
          label: {
            position: 'inner'
          },
          labelLine: {
            show: false
          }
        }
      },
      data: [
        { value: 335, name: '行业1' },
        { value: 679, name: '行业2' },
        { value: 1548, name: '行业3' }
      ]
    }
  ]
};

const columns = [
  {
    title: '排名',
    dataIndex: 'key',
    key: 'key',
  },
  {
    title: '区域',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '排放率',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: '贡献率',
    key: 'tags',
    dataIndex: 'tags',
  },
];

const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
];

export const RankAnalysisPage = observer(() => {

  const chart1 = React.useRef<any>();
  const chart2 = React.useRef<any>();
  const chart3 = React.useRef<any>();

  return (
    <div style={{ minHeight: '100%', background: '#fff' }}>
      <Row>
        <Col span={6}>
          <Card title="检测数据统计排名">
            <Form>
              <Form.Item colon={false} labelAlign="left" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="统计区域" hasFeedback>
                <Select placeholder="请选择" size="small">
                  <Option value="china">园区1</Option>
                  <Option value="usa">园区1</Option>
                </Select>
              </Form.Item>
              <Form.Item colon={false} labelAlign="left" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="监测类型" hasFeedback>
                <Select placeholder="请选择" size="small">
                  <Option value="china">气态污染物</Option>
                  <Option value="usa">液态污染物</Option>
                </Select>
              </Form.Item>
              <Form.Item colon={false} labelAlign="left" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="监测因子" hasFeedback>
                <Select placeholder="请选择" size="small">
                  <Option value="china">TVOCs</Option>
                  <Option value="usa">苯乙烯</Option>
                </Select>
              </Form.Item>
            </Form>
            <Divider orientation="left">时间</Divider>
            <Form.Item colon={false} labelAlign="left" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="统计周期" hasFeedback>
              <Radio.Group defaultValue="c" size="small" buttonStyle="solid">
                <Radio.Button value="a">日</Radio.Button>
                <Radio.Button value="c">月</Radio.Button>
                <Radio.Button value="d">年</Radio.Button>
              </Radio.Group>
            </Form.Item>
            <Form.Item colon={false} labelAlign="left" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="统计时间" hasFeedback>
              <DatePicker size="small" />
            </Form.Item>

            <Divider orientation="left"></Divider>

            <Form.Item colon={false} labelAlign="left" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="排名方式" hasFeedback>
              <Radio.Group defaultValue="c" size="small" buttonStyle="solid">
                <Radio.Button value="a">前十</Radio.Button>
                <Radio.Button value="c">后十</Radio.Button>
                <Radio.Button value="d">全部</Radio.Button>
              </Radio.Group>
            </Form.Item>

            <Form.Item colon={false} labelAlign="left" labelCol={{ span: 0 }} wrapperCol={{ span: 24 }}>
              <Button type="primary" style={{ width: '100%' }} htmlType="submit">开始统计</Button>
            </Form.Item>
          </Card>
        </Col>
        <Col span={18} style={{ padding: '10px' }}>
          <Row gutter={6}>
            <Col span={12} style={{ marginBottom: '10px' }}>
              <Card bordered size="small" title="区域TVOCs等效排放量" extra="2019-10-24">
                <Tabs defaultActiveKey="1" size="small">
                  <TabPane tab="企业排名" key="1">
                    <ReactEcharts
                      //@ts-ignore
                      option={option1}
                      ref={chart1}
                      style={{ height: '360px' }}
                    />
                  </TabPane>
                  <TabPane tab="站点排名" key="2">
                    <ReactEcharts
                      //@ts-ignore
                      option={option1}
                      ref={chart1}
                      style={{ height: '360px' }}
                    />
                  </TabPane>
                </Tabs>
              </Card>
            </Col>
            <Col span={12} style={{ marginBottom: '10px' }}>
              <Card bordered size="small" title="区域TVOCs等效排放量贡献率" extra="2019-10-24">
                <ReactEcharts
                  //@ts-ignore
                  option={option2}
                  ref={chart2}
                  style={{ height: '360px' }}
                />
              </Card>
            </Col>
            <Col span={24} style={{ marginBottom: '10px' }}>
              <Card bordered size="small" title="区域TVOCs等效排放量贡献率" extra="2019-10-24">
                <Table bordered size="small" pagination={false} columns={columns} dataSource={data} />
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>

    </div>
  );
})