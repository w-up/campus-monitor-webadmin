import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import { Spin, Card, Row, Col, Form, Button, Select, Tabs, Input, DatePicker, Radio, Table, Badge, Divider, Breadcrumb, Alert, Modal } from 'antd';
import { useStore } from "../../stores/index";
import { toJS } from "mobx";

const { Option } = Select;
const { TabPane } = Tabs;

const columns = [
  {
    title: '提交时间',
    dataIndex: 'checkTime',
    key: 'checkTime',
  },
  {
    title: '提交人',
    dataIndex: 'checkUser',
    key: 'checkUser',
  },
  {
    title: '园区名称',
    dataIndex: 'parkName',
    key: 'parkName',
  },
  {
    title: '监测区域',
    dataIndex: 'areaName',
    key: 'areaName',
  },
  {
    title: '站点名称',
    dataIndex: 'siteName',
    key: 'siteName',
  },
  {
    title: '数据类型',
    dataIndex: '',
    key: '',
  },
  {
    title: '附件',
    dataIndex: '',
    key: '',
  },
  {
    title: '状态',
    key: 'status',
    dataIndex: 'status',
    render: (val) => {
      if (val === 0) {
        return <Badge status="default" text="待审核" />
      } else if ( val === 1) {
        return <Badge status="success" text="审核通过" />
      } else {
        return <Badge status="error" text="审核不通过" />
      }
      
    }
  },
  {
    title: '操作',
    dataIndex: '',
    key: '',
    render: () => {
      return '查看';
    }
  },
];

const pagination = {
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total) => {
    return '共 ' + total + ' 条记录'
  },
};

export const DataManagePage = Form.create()(observer(({ form }: any) => {

  const {
    data: { manage }
  } = useStore();

  const { getFieldDecorator, setFieldsValue, getFieldsValue, getFieldValue, validateFields } = form;


  const { loading, dataSource, parksAndFactories, getSitesList } = manage;

  useEffect(() => {
    manage.getCheckDataList();
    manage.getAllParksAndFactories();
  }, []);

  let factoryList: any = [];
  if (parksAndFactories.length) {
    if (getFieldValue('parkId')) {
      factoryList = parksAndFactories.find(item => item.parkId === getFieldValue('parkId')).factories;
    } else {
      factoryList = parksAndFactories[0].factories;
    }
  }

  return (
    <Spin spinning={loading}>
      <div style={{ background: "#fff", marginBottom: 20, border: "1px solid #e8e8e8", borderLeft: 0, borderRight: 0, padding: "20px"}}>
        <Breadcrumb>
          <Breadcrumb.Item>数据质量</Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/data/manage">数据管理</Link>
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <Row gutter={10}>
        <Col span={6}>
          <Card size="small" title="数据查询" extra={<Button type="primary">查询</Button>}>
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
        <Col span={18}>
          <Card size="small" title="数据列表" extra={<Link to="/data/manage/replenish"><Button type="primary">补录数据</Button></Link>}>
            <Table bordered size="small" pagination={pagination} columns={columns} dataSource={toJS(dataSource)} />
          </Card>
        </Col>
      </Row>

    </Spin>
  );
}));