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
    dataIndex: 'collectDate',
    key: 'collectDate',
    width: 150,
  },
  {
    title: '提交人',
    dataIndex: 'createUserName',
    key: 'createUserName',
    width: 100,
  },
  {
    title: '园区名称',
    dataIndex: 'parkName',
    key: 'parkName',
    width: 120,
  },
  {
    title: '监测区域',
    dataIndex: 'areaName',
    key: 'areaName',
    width: 80,
  },
  {
    title: '站点名称',
    dataIndex: 'siteName',
    key: 'siteName',
    width: 80,
  },
  {
    title: '数据类型',
    dataIndex: '',
    key: '',
    width: 60,
    render: () => '补录数据',
  },
  {
    title: '附件',
    dataIndex: 'pic',
    key: 'pic',
    width: 50,
    render: val => <a href={val} target="_blank">下载</a>,
  },
  {
    title: '状态',
    key: 'status',
    dataIndex: 'status',
    width: 80,
    render: (item, data) => {
      return item;
    }
  },
  {
    title: '操作',
    key: 'status',
    dataIndex: 'status',
    width: 50,
    render: (item, data) => {
      if (item === '待审核') {
        return <Link to={{ pathname: `/data/manage/view/${data.id}`, state: { data } }}>审核</Link>
      } else {
        return <Link to={{ pathname: `/data/manage/view/${data.id}`, state: { data } }}>查看</Link>
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
    audit.getCheckData(query);
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
    <div className="auditPage">
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

                <Form.Item colon={false} labelAlign="left" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="统计区域" >
                  {getFieldDecorator("parkId", { initialValue: query.parkId, rules: [{ required: true }] })(
                    <Select onChange={() => setFieldsValue({ factoryId: '' })} placeholder="请选择" size="small">
                      {parkTree.map(item => <Option key={item.parkId} value={item.parkId}>{item.parkName}</Option>)}
                    </Select>
                  )}
                </Form.Item>

                <Form.Item colon={false} labelAlign="left" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="监测区域" >
                  {getFieldDecorator("factoryId", { initialValue: query.factoryId, rules: [{ required: false }] })(
                    <Select placeholder="请选择" size="small">
                      {factoryList.map(item => <Option key={item.factoryId} value={item.factoryId}>{item.factoryName}</Option>)}
                      <Option value="">不限</Option>
                    </Select>
                  )}
                </Form.Item>
                
                <Form.Item colon={false} labelAlign="left" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="监测站点" >
                  {getFieldDecorator("siteId", { initialValue: query.siteId, rules: [{ required: false }] })(
                    <Select placeholder="请选择" size="small">
                      {siteList.map(item => <Option key={item.siteId} value={item.siteId}>{item.siteName}</Option>)}
                      <Option value="">不限</Option>
                    </Select>
                  )}
                </Form.Item>

                <Form.Item colon={false} labelAlign="left" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="审核状态" >
                  {getFieldDecorator("status", { initialValue: query.status, rules: [{ required: false }] })(
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
                  {getFieldDecorator("timeRange", { initialValue: query.timeRange, rules: [{ required: false }] })(
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
    </div>
  );
}));