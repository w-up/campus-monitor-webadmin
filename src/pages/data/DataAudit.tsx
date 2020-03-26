import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import { useStore } from "../../stores/index";
import { toJS } from "mobx";

import { Spin, Card, Row, Col, Form, Button, Select, Tabs, Input, DatePicker, Radio, Table, Badge, Divider, Breadcrumb, Alert, Modal } from 'antd';
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
    title: '状态',
    key: 'status',
    dataIndex: 'status',
    render: (item) => {
      if (item === '审核不通过') {
        return <Link to="/data/manage/view" >{item}</Link>
      } else if (item === '审核通过') {
        return <Link to="/data/manage/view" >{item}</Link>
      } else {
        return item;
      }
    }
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
    status: '审核不通过',
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
    status: '审核通过',
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
    status: '待审核',
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
    status: '待审核',
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
    status: '待审核',
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
    status: '待审核',
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
    status: '待审核',
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
    status: '待审核',
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
    status: '待审核',
  },
];

export const DataAuditPage = Form.create()(observer(({ form }: any) => {


  const { getFieldDecorator, setFieldsValue, getFieldsValue, getFieldValue, validateFields } = form;

  const {
    data: { audit }
  } = useStore();

  const { loading, dataSource, parksAndFactories, getSitesList } = audit;


  useEffect(() => {
    audit.getCheckDataList();
    audit.getAllParksAndFactories();
  }, []);
  

  let factoryList: any = [];
  if (parksAndFactories.length) {
    if (getFieldValue('parkId')) {
      factoryList = parksAndFactories.find(item => item.parkId === getFieldValue('parkId')).factories;
    } else {
      factoryList = parksAndFactories[0].factories;
    }
  }

  const pagination = {
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total) => {
      return '共 ' + total + ' 条记录'
    },
  };

  return (
    <Spin spinning={loading}>
      <div style={{ background: "#fff", marginBottom: 20, border: "1px solid #e8e8e8", borderLeft: 0, borderRight: 0, padding: "20px"}}>
        <Breadcrumb>
          <Breadcrumb.Item>数据质量</Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/data/audit">数据审核</Link>
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <Row>
        <Col span={6}>
          <Card size="small" title="数据审核" extra={<Button type="primary">查询</Button>}>
            <Form>
              <Form.Item colon={false} labelAlign="left" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="选择园区" >
                {getFieldDecorator("parkId", { initialValue: '', rules: [{ required: false }] })(
                  <Select onChange={() => setFieldsValue({ factoryId: '' })} placeholder="请选择" size="small">
                    {parksAndFactories.map(item => <Option key={item.parkId} value={item.parkId}>{item.parkName}</Option>)}
                    <Option value="">不限</Option>
                  </Select>
                )}
              </Form.Item>
              <Form.Item colon={false} labelAlign="left" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="监测区域" >
                {getFieldDecorator("factoryId", { initialValue: '', rules: [{ required: false }] })(
                  <Select onChange={getSitesList} placeholder="请选择" size="small">
                    {factoryList.map(item => <Option key={item.factoryId} value={item.factoryId}>{item.factoryName}</Option>)}
                    <Option value="">不限</Option>
                  </Select>
                )}
              </Form.Item>
              <Form.Item colon={false} labelAlign="left" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="站点名称" >
                <Select placeholder="请选择" size="small">
                  <Option value="china">TVOCs</Option>
                  <Option value="usa">苯乙烯</Option>
                </Select>
              </Form.Item>
              <Form.Item colon={false} labelAlign="left" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="监测设备" >
                <Select placeholder="请选择" size="small">
                  <Option value="china">TVOCs</Option>
                  <Option value="usa">苯乙烯</Option>
                </Select>
              </Form.Item>
              <Form.Item colon={false} labelAlign="left" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="补传原因" >
                <Input.TextArea placeholder="请填写补传原因" />
              </Form.Item>
            </Form>
          </Card>
        </Col>
        <Col span={18} style={{ padding: '10px' }}>
        <Tabs>
          <TabPane tab="待审核" key="1">
            <Table bordered size="small" pagination={pagination} columns={columns} dataSource={data} />
          </TabPane>
          <TabPane tab="历史记录" key="2">
            <Table bordered size="small" pagination={pagination} columns={columns} dataSource={data} />
          </TabPane>
        </Tabs>
        </Col>
      </Row>

    </Spin>
  );
}));