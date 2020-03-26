import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import { useStore } from "../../stores/index";
import { toJS } from "mobx";

import { Spin, Card, Row, Col, Form, Button, Select, Tabs, Input, DatePicker, Radio, Table, Badge, Divider, Breadcrumb, Alert, Modal } from 'antd';
const { Option } = Select;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

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


export const DataAuditPage = Form.create()(observer(({ form }: any) => {


  const { getFieldDecorator, setFieldsValue, getFieldsValue, getFieldValue, validateFields } = form;

  const {
    data: { audit }
  } = useStore();

  const { loading, dataSource, ptList, getSitesList, parkTree, query, total, } = audit;

  useEffect(() => {
    audit.getAllSitesTree();
  }, []);
  
  let factoryList: any = [];
  if (parkTree.length) {
    if (getFieldValue('parkId')) {
      factoryList = parkTree.find(item => item.parkId === getFieldValue('parkId')).factorys || [];
    } else {
      factoryList = parkTree[0].factories || [];
    }
  }

  let siteList: any = [];
  if (factoryList.length) {
    if (getFieldValue('factoryId')) {
      siteList = factoryList.find(item => item.factoryId === getFieldValue('factoryId')).sites || [];
    } else {
      siteList = factoryList[0].sites || [];
    }
  }

  let pmCodeList: any = [];
  if (ptList.length) {
    if (getFieldValue('ptId')) {
      pmCodeList = ptList.find(item => item.id === getFieldValue('ptId')).pms || [];
    } else {
      pmCodeList = ptList[0].pms || [];
    }
  }

  const pagination = {
    current: query.current,
    pageSize: query.pageSize,
    total,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: total => {
      return "共 " + total + " 条记录";
    },
    onChange: audit.paginationChange,
    onShowSizeChange: audit.paginationChange
  };


  const doSubmit = e => {
    e.preventDefault();
    validateFields((err, values) => {
      if (err) {
        return;
      }
      audit.getCheckData(values);
    });
  }

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
      <Row gutter={10}>
        <Col span={6}>
          <Card size="small" title="数据审核" >
            <Form onSubmit={doSubmit}>

              <Form.Item colon={false} labelAlign="left" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="统计区域" >
                {getFieldDecorator("parkId", { initialValue: '', rules: [{ required: true }] })(
                  <Select onChange={() => setFieldsValue({ factoryId: '' })} placeholder="请选择" size="small">
                    {parkTree.map(item => <Option key={item.parkId} value={item.parkId}>{item.parkName}</Option>)}
                  </Select>
                )}
              </Form.Item>

              <Form.Item colon={false} labelAlign="left" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="监测区域" >
                {getFieldDecorator("factoryId", { initialValue: '', rules: [{ required: false }] })(
                  <Select placeholder="请选择" size="small">
                    {factoryList.map(item => <Option key={item.factoryId} value={item.factoryId}>{item.factoryName}</Option>)}
                    <Option value="">不限</Option>
                  </Select>
                )}
              </Form.Item>
              
              <Form.Item colon={false} labelAlign="left" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="监测站点" >
                {getFieldDecorator("siteId", { initialValue: '', rules: [{ required: false }] })(
                  <Select placeholder="请选择" size="small">
                    {siteList.map(item => <Option key={item.siteId} value={item.siteId}>{item.siteName}</Option>)}
                    <Option value="">不限</Option>
                  </Select>
                )}
              </Form.Item>

              <Form.Item colon={false} labelAlign="left" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="审核状态" >
                {getFieldDecorator("status", { initialValue: '', rules: [{ required: false }] })(
                  <Select placeholder="请选择" size="small">
                    <Option value={0}>待审核</Option>
                    <Option value={1}>审核通过</Option>
                    <Option value={2}>审核不通过</Option>
                    <Option value="">不限</Option>
                  </Select>
                )}
              </Form.Item>

              <Divider orientation="left">起止时间</Divider>
              <Form.Item colon={false} labelAlign="left" labelCol={{ span: 0 }} wrapperCol={{ span: 24 }} label="" >
                {getFieldDecorator("timeRange", { initialValue: '', rules: [{ required: false }] })(
                  <RangePicker size="small" />
                )}
              </Form.Item>

              <Button type="primary" htmlType="submit" block>查询</Button>

            </Form>
          </Card>
        </Col>
        <Col span={18} >
          <Card size="small" title="数据列表" >
            <Table bordered size="small" pagination={pagination} columns={columns} dataSource={toJS(dataSource)} />
          </Card>
        </Col>
      </Row>

    </Spin>
  );
}));