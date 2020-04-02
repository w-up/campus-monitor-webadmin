import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import { useStore } from "../../stores/index";
import { toJS } from "mobx";

import { Spin, Upload, Card, Row, Col, Form, Button, Select, Tabs, Input, DatePicker, Radio, Table, Badge, Divider, Breadcrumb, Alert, Modal } from 'antd';
const { Option } = Select;
const { TabPane } = Tabs;

export const DataReplenish = Form.create()(observer(({ form, history }: any) => {

  const { getFieldDecorator, setFieldsValue, getFieldsValue, getFieldValue, validateFields } = form;

  const {
    data: { replenish }
  } = useStore();

  const { loading, parkTree, ptList, deviceList, pmList, addDeviceList } = replenish;

  
  useEffect(() => {
    // manage.getCheckDataList();
    replenish.getAllSitesTree();
    replenish.getAddDevice();
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

  const doSubmit = e => {
    e.preventDefault();
    validateFields((err, values) => {
      if (err) {
        return;
      }
      replenish.insertData(values);
    });
  }

  return (
    <div className="replenishPage">
      <Spin spinning={loading}>
        <div style={{ background: "#fff", marginBottom: 20, border: "1px solid #e8e8e8", borderLeft: 0, borderRight: 0, padding: "20px"}}>
          <Breadcrumb>
            <Breadcrumb.Item>数据质量</Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to="/data/manage">数据管理</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              数据补录
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <Row gutter={10}>
          <Col span={6}>
            <Card size="small" title="补录数据">
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
                    {/* <Option value="">不限</Option> */}
                  </Select>
                )}
              </Form.Item>

              <Form.Item colon={false} labelAlign="left" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="监测站点" >
                {getFieldDecorator("siteId", { initialValue: '', rules: [{ required: false }] })(
                  <Select onChange={replenish.getDevice} placeholder="请选择" size="small">
                    {siteList.map(item => <Option key={item.siteId} value={item.siteId}>{item.siteName}</Option>)}
                    {/* <Option value="">不限</Option> */}
                  </Select>
                )}
              </Form.Item>


              <Form.Item colon={false} labelAlign="left" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="监测设备" >
                {getFieldDecorator("deviceCode", { initialValue: '', rules: [{ required: false }] })(
                  <Select onChange={replenish.getPm} placeholder="请选择" size="small">
                    {deviceList.map(item => <Option key={item.deviceCode} value={item.deviceCode}>{item.deviceName}</Option>)}
                    {/* <Option value="">不限</Option> */}
                  </Select>
                )}
              </Form.Item>

              <Form.Item colon={false} labelAlign="left" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="补传原因" >
                {getFieldDecorator("reason", { initialValue: '', rules: [{ required: false }] })(
                  <Input.TextArea placeholder="请填写补传原因" />
                )}
              </Form.Item>

              {/* <Button type="primary" htmlType="submit" block>查询</Button> */}

              </Form>
            </Card>
          </Col>
          <Col span={18}>
            <Card size="small" title="详细数据" >
              <Row>
                <Col span={4}></Col>
                <Col span={12}>
                  <Form onSubmit={doSubmit}>
                    <Divider orientation="left">测量数据</Divider>

                    <Form.Item colon={false} labelAlign="left" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="补测设备" >
                      {getFieldDecorator("addDeviceName", { initialValue: '', rules: [{ required: false }] })(
                        <Select placeholder="请选择" size="small">
                          {addDeviceList.map(item => <Option key={item.siteId} value={item.siteId}>{item.siteName}</Option>)}
                        </Select>
                      )}
                    </Form.Item>

                    <Form.Item colon={false} labelAlign="left" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="补测时间" >
                      {getFieldDecorator("collectDate", { initialValue: '', rules: [{ required: false }] })(
                        <DatePicker size="small" />
                      )}
                    </Form.Item>


                    {pmList.map(item => {
                      return (
                        <Form.Item colon={false} key={item.pmCode} labelAlign="left" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label={item.pmCode} >
                          {getFieldDecorator(`pmList[${item.pmCode}]`, { initialValue: '', rules: [{ required: true }] })(
                            <Input size="small" suffix={item.pmUnit} />
                          )}
                        </Form.Item>
                      );
                    })}

                    <Divider orientation="left">备注说明</Divider>

                    <Form.Item colon={false} labelAlign="left" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="操作说明" >
                      {getFieldDecorator("note", { initialValue: '', rules: [{ required: false }] })(
                        <Input.TextArea />
                      )}
                    </Form.Item>
                    
                    <Form.Item colon={false} labelAlign="left" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="上传附件" >
                      {getFieldDecorator("pic", { initialValue: '', rules: [{ required: false }] })(
                        <Upload name="logo" action="/upload.do" listType="picture">
                          <Button>点击上传</Button>
                        </Upload>
                      )}
                    </Form.Item>

                    <Row gutter={20}>
                      <Col span={12}>
                        <Form.Item colon={false} labelAlign="left" labelCol={{ span: 0 }} wrapperCol={{ span: 24 }}>
                          <Button type="primary" htmlType="submit" style={{ width: '100%' }}>提交</Button>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item colon={false} labelAlign="left" labelCol={{ span: 0 }} wrapperCol={{ span: 24 }}>
                          <Button onClick={() => history.goBack()} style={{ width: '100%' }}>取消</Button>
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                </Col>
              </Row>
              
            </Card>
          </Col>
        </Row>
      </Spin>
    </div>
  );
}));