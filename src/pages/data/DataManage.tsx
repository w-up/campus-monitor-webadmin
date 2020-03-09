import React from "react";
import { observer } from "mobx-react-lite";
import ReactEcharts from "echarts-for-react";
import { Card, Row, Col, Form, Button, Select, Tabs, Input, DatePicker, Radio, Table, Badge, Divider, Breadcrumb, Alert, Modal } from 'antd';
const { Option } = Select;
const { TabPane } = Tabs;

const columns = [
  {
    title: '提交时间',
    dataIndex: 'time',
    key: 'time',
  },
  {
    title: '提交人',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '园区名称',
    dataIndex: 'parkname',
    key: 'parkname',
  },
  {
    title: '监测区域',
    dataIndex: 'area',
    key: 'area',
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
    time: '2019-10-24 17:00',
    key: '1',
    name: 'John Brown',
    parkname: '园区2',
    area: 'A化工',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    time: '2019-10-24 17:00',
    key: '2',
    name: 'Jim Green',
    parkname: '园区2',
    area: 'A化工',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    time: '2019-10-24 17:00',
    key: '3',
    name: 'Joe Black',
    parkname: '园区2',
    area: 'A化工',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
  {
    time: '2019-10-24 17:00',
    key: '1',
    name: 'John Brown',
    parkname: '园区2',
    area: 'A化工',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    time: '2019-10-24 17:00',
    key: '2',
    name: 'Jim Green',
    parkname: '园区2',
    area: 'A化工',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    time: '2019-10-24 17:00',
    key: '3',
    name: 'Joe Black',
    parkname: '园区2',
    area: 'A化工',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
  {
    time: '2019-10-24 17:00',
    key: '1',
    name: 'John Brown',
    parkname: '园区2',
    area: 'A化工',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    time: '2019-10-24 17:00',
    key: '2',
    name: 'Jim Green',
    parkname: '园区2',
    area: 'A化工',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    time: '2019-10-24 17:00',
    key: '3',
    name: 'Joe Black',
    parkname: '园区2',
    area: 'A化工',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
];

export const DataManagePage = observer(() => {

  const pagination = {
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total) => {
      return '共 ' + total + ' 条记录'
    },
  };

  return (
    <div style={{ minHeight: '100%', background: '#fff' }}>
      <Row>
        <Col span={6}>
          <Card title="数据质量管理">
            <Form>
              <Form.Item colon={false} labelAlign="left" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="选择园区" hasFeedback>
                <Select placeholder="请选择" size="small">
                  <Option value="china">园区1</Option>
                  <Option value="usa">园区1</Option>
                </Select>
              </Form.Item>
              <Form.Item colon={false} labelAlign="left" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="监测区域" hasFeedback>
                <Select placeholder="请选择" size="small">
                  <Option value="china">气态污染物</Option>
                  <Option value="usa">液态污染物</Option>
                </Select>
              </Form.Item>
              <Form.Item colon={false} labelAlign="left" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="站点名称" hasFeedback>
                <Select placeholder="请选择" size="small">
                  <Option value="china">TVOCs</Option>
                  <Option value="usa">苯乙烯</Option>
                </Select>
              </Form.Item>
              <Form.Item colon={false} labelAlign="left" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="监测设备" hasFeedback>
                <Select placeholder="请选择" size="small">
                  <Option value="china">TVOCs</Option>
                  <Option value="usa">苯乙烯</Option>
                </Select>
              </Form.Item>
              <Form.Item colon={false} labelAlign="left" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="补传原因" hasFeedback>
                <Select placeholder="请选择" size="small">
                  <Option value="china">TVOCs</Option>
                  <Option value="usa">苯乙烯</Option>
                </Select>
              </Form.Item>
              <Form.Item colon={false} labelAlign="left" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="操作人员" hasFeedback>
                <Select placeholder="请选择" size="small">
                  <Option value="china">TVOCs</Option>
                  <Option value="usa">苯乙烯</Option>
                </Select>
              </Form.Item>
            </Form>

            <Form.Item colon={false} labelAlign="left" labelCol={{ span: 0 }} wrapperCol={{ span: 24 }}>
              <Button type="primary" style={{ width: '100%' }} htmlType="submit">补传数据</Button>
            </Form.Item>
          </Card>
        </Col>
        <Col span={18} style={{ padding: '10px' }}>
          <Table bordered size="small" pagination={pagination} columns={columns} dataSource={data} />
        </Col>
      </Row>

    </div>
  );
})