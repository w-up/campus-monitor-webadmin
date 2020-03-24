import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../../stores/index";
import { Link } from "react-router-dom";

import { Checkbox, Breadcrumb, Spin, Card, Row, Col, Form, Select, Divider, Button, Table } from "antd";
import { toJS } from "mobx";
const { Option } = Select;

interface Props { }
interface State {
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

const fixedDirection: FixedDir = 'right'

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

export const RuntimeDataPage = Form.create()(observer(({ form }: any) => {

  const {
    query: { runTimeData }
  } = useStore();

  useEffect(() => {
    runTimeData.getAllSitesTree();
  }, []);

  const {
    loading, parkTree, ptList, columns, dataList,
  } = runTimeData;

  const { getFieldDecorator, setFieldsValue, resetFields, getFieldsValue, getFieldValue, validateFields } = form;

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

  const doSubmit = e => {
    e.preventDefault();
    validateFields((err, values) => {
      if (err) {
        return;
      }
      runTimeData.queryDatas(values);
    });
  }

  return (
    <Spin spinning={loading}>
      <div style={{ background: "#fff", marginBottom: 20, border: "1px solid #e8e8e8", borderLeft: 0, borderRight: 0, padding: "20px" }}>
        <Breadcrumb>
          <Breadcrumb.Item>数据查询</Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/query/runtime">实时数据查询</Link>
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <Row gutter={10}>
        <Col span={6}>
          <Form {...formItemLayout} onSubmit={doSubmit}>
            <Card size="small" title="实时数据查询" extra={<Button size="small" onClick={() => resetFields()}>重置</Button>}>
              <Form.Item colon={false} labelAlign="left" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="选择园区" >
                {getFieldDecorator("parkId", { initialValue: '', rules: [{ required: true }] })(
                  <Select onChange={() => setFieldsValue({ factoryId: '' })} placeholder="请选择" size="small">
                    {parkTree.map(item => <Option key={item.parkId} value={item.parkId}>{item.parkName}</Option>)}
                  </Select>
                )}
              </Form.Item>
              <Form.Item colon={false} labelAlign="left" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="监测区域" >
                {getFieldDecorator("factoryId", { initialValue: '', rules: [{ required: true }] })(
                  <Select placeholder="请选择" size="small">
                    {factoryList.map(item => <Option key={item.factoryId} value={item.factoryId}>{item.factoryName}</Option>)}
                  </Select>
                )}
              </Form.Item>
              <Form.Item colon={false} labelAlign="left" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="站点名称" >
                {getFieldDecorator("siteIdList", { initialValue: [], rules: [{ required: true }] })(
                  <Select mode="multiple" placeholder="请选择" size="small">
                    {siteList.map(item => <Option key={item.siteId} value={item.siteId}>{item.siteName}</Option>)}
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
              <Divider orientation="left">监测因子</Divider>
              {!!getFieldValue('ptId') && 
              <Form.Item colon={false} labelAlign="left" labelCol={{ span: 0 }} wrapperCol={{ span: 24 }} label="" >
                {getFieldDecorator("pmCodeList", { initialValue: [], rules: [{ required: true }] })(
                  <Checkbox.Group style={{ width: '100%' }}>
                    <Row>
                      {pmCodeList.map(item => <Col span={8} key={item.pmCode}><Checkbox style={{ fontSize: '10px' }} value={item.pmCode}>{item.pmName}</Checkbox></Col>)}
                    </Row>
                  </Checkbox.Group>
                )}
              </Form.Item>
              }
              
              <Button type="primary" htmlType="submit" block>查询</Button>
            </Card>
          </Form>
        </Col>
        <Col span={18}>
          <Card size="small" title="数据列表">
            <Table size="small" bordered columns={toJS(columns)} dataSource={toJS(dataList)} />
          </Card>
        </Col>
      </Row>

    </Spin>
  )
}));