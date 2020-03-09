import React from "react";
import { observer } from "mobx-react-lite";
import ReactEcharts from "echarts-for-react";
import { Card, Row, Col, Form, Button, Select, Input, DatePicker, Radio, Table, Badge, Divider, Breadcrumb, Alert, Modal } from 'antd';
const { Option } = Select;

const option1 = {
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
      radius: [0, 80],

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
    },
    {
      name: '访问来源',
      type: 'pie',
      radius: [100, 140],

      funnelAlign: 'left',
      max: 1048,

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
        { value: 335, name: '已选行业' },
        { value: 310, name: '其他行业' },
      ]
    }
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

export const ComparisonAnalysisPage = observer(() => {

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
              <Form.Item colon={false} labelAlign="left" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="监测区域" hasFeedback>
                <Select placeholder="请选择" size="small">
                  <Option value="china">A化工</Option>
                  <Option value="usa">B化工</Option>
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
            <Form.Item colon={false} labelAlign="left" labelCol={{ span: 0 }} wrapperCol={{ span: 24 }}>
              <Button type="primary" style={{ width: '100%' }} htmlType="submit">开始统计</Button>
            </Form.Item>
          </Card>
        </Col>
        <Col span={18} style={{ padding: '10px' }}>
          <Row gutter={6}>
            <Col span={12} style={{ marginBottom: '10px' }}>
              <Card bordered size="small" title="各行业TVOCs排放贡献率" extra="2019-10-24">
                <ReactEcharts
                  //@ts-ignore
                  option={option1}
                  ref={chart1}
                  style={{ height: '360px' }}
                />
              </Card>
            </Col>
            <Col span={12} style={{ marginBottom: '10px' }}>
              <Card bordered size="small" title="区域TVOCs排放贡献率" extra="2019-10-24">
                <ReactEcharts
                  //@ts-ignore
                  option={option2}
                  ref={chart2}
                  style={{ height: '360px' }}
                />
              </Card>
            </Col>
            <Col span={24} style={{ marginBottom: '10px' }}>
              <Card bordered size="small" title="区域TVOCs排放贡献率" extra="2019-10-24">
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