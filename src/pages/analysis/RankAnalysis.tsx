import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import ReactEcharts from "echarts-for-react";
import { Link } from "react-router-dom";
import { useStore } from "../../stores/index";

import { Checkbox, Spin, Card, Row, Col, Form, Button, Select, Tabs, Input, DatePicker, Radio, Table, Badge, Divider, Breadcrumb, Alert, Modal } from 'antd';
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

export const RankAnalysisPage = Form.create()(observer(({ form }: any) => {

  const chart1 = React.useRef<any>();
  const chart2 = React.useRef<any>();
  const chart3 = React.useRef<any>();

  const {
    analysis: { rank }
  } = useStore();

  const { getFieldDecorator, setFieldsValue, resetFields, getFieldsValue, getFieldValue, validateFields } = form;

  const {
    loading, parkTree, ptList,
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

    </Spin>
  );
}));