import React from "react";
import { Card, Row, Col, Form, Select, Divider, Button, Table } from "antd";
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
    title: '监测区域',
    dataIndex: 'area',
    key: 'area',
  },
  {
    title: '站点名称',
    dataIndex: 'name',
    key: 'name',
  },
  { title: '测量值  1', dataIndex: 'value', key: '1' },
  { title: '测量值 2', dataIndex: 'value', key: '2' },
  { title: '测量值 3', dataIndex: 'value', key: '3' },
  { title: '测量值 4', dataIndex: 'value', key: '4' },
  { title: '测量值 5', dataIndex: 'value', key: '5' },
  { title: '测量值 6', dataIndex: 'value', key: '6' },
  { title: '测量值 7', dataIndex: 'value', key: '7' },
  { title: '测量值 8', dataIndex: 'value', key: '8' },
  {
    title: '数据更新时间',
    key: 'updateTime',
    dataIndex: 'updateTime',
    fixed: fixedDirection,
  },
];

const data = [
  {
    key: '1',
    area: '234.89, 235345.09',
    name: '站点1',
    value: 32,
    updateTime: '2020-02-29'
  },
  {
    key: '2',
    area: '234.89, 235345.09',
    name: '站点2',
    value: 40,
    updateTime: '2020-02-29'
  },
];
export class AlertSettingPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      monitoringFactors: []
    }
  }

  
  queryConditionsModule = () => {
    return (
      <Card title="实时数据查询">
        <Form {...formItemLayout}>
          <Form.Item label="选择园区">
            <Select placeholder="请选择" size="small">
              <Option value="china">China</Option>
              <Option value="usa">U.S.A</Option>
            </Select>
          </Form.Item>
          <Form.Item label="监测区域" hasFeedback>
            <Select placeholder="请选择" size="small">
              <Option value="china">China</Option>
              <Option value="usa">U.S.A</Option>
            </Select>
          </Form.Item>
          <Form.Item label="站点名称" hasFeedback>
            <Select placeholder="请选择" size="small">
              <Option value="china">China</Option>
              <Option value="usa">U.S.A</Option>
            </Select>
          </Form.Item>
          <Form.Item label="监测类型" hasFeedback>
            <Select placeholder="请选择" size="small">
              <Option value="china">China</Option>
              <Option value="usa">U.S.A</Option>
            </Select>
          </Form.Item>
        </Form>
        <Divider orientation="left">监测因子</Divider>
        <div style={{marginTop: 10, marginBottom: 10}}>
          <Button size="small">全部</Button>
        </div>
        <Button type="primary" block>重制</Button>
      </Card>
    )
  }

  render () {
    return (
      <div style={{minHeight: '100%', background: '#fff'}}>
        <Row>
          <Col span={6}>{this.queryConditionsModule()}</Col>
          <Col span={18} style={{padding: "10px 20px"}}>
            <Table bordered columns={columns} dataSource={data} scroll={{ x: 1300 }} />
          </Col>
        </Row>

      </div>
    )
  }
}


