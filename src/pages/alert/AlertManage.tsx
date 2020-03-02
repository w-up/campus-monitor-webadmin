import React from "react";
import { Card, Row, Col, Form, Select, Divider, Button, Table, Radio, DatePicker } from "antd";
import { Link } from "react-router-dom";
import { booleanLiteral } from "@babel/types";
const { Option } = Select;

interface Props{}
interface State{
  monitoringFactors: []
}

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 12 },
    sm: { span: 12 },
  },
};

type FixedDir = "right" | "left"

const fixedDirection:FixedDir = 'right'

const columns = [
  {
    title: '报警来源',
    dataIndex: 'origin',
    key: 'origin',
  },
  {
    title: '报警项目',
    dataIndex: 'project',
    key: 'project',
  },
  {
    title: '报警次数',
    dataIndex: 'times',
    key: 'times',
  },
  {
    title: '详情',
    dataIndex: 'action',
    key: 'action',
    render: (text:any, record:any) => (
      <Link to="/">查看详情</Link>
    ),
  }
];

const data = [
  {
    key: '1',
    origin: '站点01',
    project: '监测因子01',
    times: 132,
  },
  {
    key: '2',
    origin: '站点02',
    project: '监测因子02',
    times: 132,
  },
];
export class AlertManagePage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      monitoringFactors: []
    }
  }

  
  queryConditionsModule = () => {
    return (
      <Card title="告警管理">
        <Form {...formItemLayout}>
          <Form.Item label="统计方式">
            <Select placeholder="请选择" size="small">
              <Option value="china">China</Option>
              <Option value="usa">U.S.A</Option>
            </Select>
          </Form.Item>
          <Form.Item label="监测对象" hasFeedback>
            <Select placeholder="请选择" size="small">
              <Option value="china">China</Option>
              <Option value="usa">U.S.A</Option>
            </Select>
          </Form.Item>
          <Form.Item label="监测因子" hasFeedback>
            <Select placeholder="请选择" size="small">
              <Option value="china">China</Option>
              <Option value="usa">U.S.A</Option>
            </Select>
          </Form.Item>
        </Form>
        <Divider orientation="left">时间</Divider>
        <div>
          统计周期：
          <Radio.Group>
            <Radio.Button value="large">日</Radio.Button>
            <Radio.Button value="default">月</Radio.Button>
            <Radio.Button value="small">年</Radio.Button>
          </Radio.Group>
        </div>
        <div style={{marginTop: 10, marginBottom: 10}}>
          起始时间： <DatePicker />
        </div>
        <div style={{marginTop: 10, marginBottom: 10}}>
          终止时间： <DatePicker />
        </div>
        <Button type="primary" block>开始统计</Button>
      </Card>
    )
  }

  render () {
    return (
      <div style={{minHeight: '100%', background: '#fff'}}>
        <Row>
          <Col span={6}>{this.queryConditionsModule()}</Col>
          <Col span={18} style={{padding: "10px 20px"}}>
            <div style={{fontSize: 18, fontWeight: "bold", lineHeight: "36px"}}>气体超标报警</div>
            <Table bordered columns={columns} dataSource={data} />
          </Col>
        </Row>

      </div>
    )
  }
}
