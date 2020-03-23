import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import { useStore } from "../../stores/index";
import { toJS } from "mobx";

import { Spin, Card, Row, Col, Form, Button, Select, Tabs, Input, DatePicker, Radio, Table, Badge, Divider, Breadcrumb, Alert, Modal } from 'antd';
const { Option } = Select;
const { TabPane } = Tabs;

export const DataReplenish = Form.create()(observer(({ form }: any) => {

  const { getFieldDecorator, setFieldsValue, getFieldsValue, getFieldValue, validateFields } = form;

  const {
    data: { replenish }
  } = useStore();

  const { loading, parksAndFactories, } = replenish;

  useEffect(() => {
    replenish.getAllParksAndFactories();
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
          <Breadcrumb.Item>
            数据补录
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <Row gutter={10}>
        <Col span={6}>
          <Card size="small" title="补录数据">
            <Form>
              <Form.Item colon={false} labelAlign="left" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="选择园区" >
                {getFieldDecorator("parkId", { initialValue: '', rules: [{ required: false }] })(
                  <Select onChange={() => setFieldsValue({ factoryId: '' })} placeholder="请选择" size="small">
                    {parksAndFactories.map(item => <Option key={item.parkId} value={item.parkId}>{item.parkName}</Option>)}
                  </Select>
                )}
              </Form.Item>
              <Form.Item colon={false} labelAlign="left" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="监测区域" >
                {getFieldDecorator("factoryId", { initialValue: '', rules: [{ required: false }] })(
                  <Select placeholder="请选择" size="small">
                    {factoryList.map(item => <Option key={item.factoryId} value={item.factoryId}>{item.factoryName}</Option>)}
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
              <Form.Item colon={false} labelAlign="left" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="操作人员" >
                <Select placeholder="请选择" size="small">
                  <Option value="china">TVOCs</Option>
                  <Option value="usa">苯乙烯</Option>
                </Select>
              </Form.Item>
            </Form>
          </Card>
        </Col>
        <Col span={18}>
          <Card size="small" title="详细数据" >
            <Row>
              <Col span={4}></Col>
              <Col span={12}>
                <Form>
                  <Divider orientation="left">测量数据</Divider>
                  <Form.Item colon={false} labelAlign="left" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="补测设备" hasFeedback>
                    <Select placeholder="请选择" size="small">
                      <Option value="china">TVOCs</Option>
                      <Option value="usa">苯乙烯</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item colon={false} labelAlign="left" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="补测时间" hasFeedback>
                    <Input size="small" value="2020-02-02" />
                  </Form.Item>
                  <Form.Item colon={false} labelAlign="left" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="测量值1" hasFeedback>
                    <Input size="small" value="11" />
                  </Form.Item>
                  <Form.Item colon={false} labelAlign="left" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="测量值2" hasFeedback>
                    <Input size="small" value="11" />
                  </Form.Item>
                  <Form.Item colon={false} labelAlign="left" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="测量值3" hasFeedback>
                    <Input size="small" value="11" />
                  </Form.Item>
                  <Form.Item colon={false} labelAlign="left" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="测量值4" hasFeedback>
                    <Input size="small" value="11" />
                  </Form.Item>
                  <Divider orientation="left">备注说明</Divider>
                  <Form.Item colon={false} labelAlign="left" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="操作说明" hasFeedback>
                    <Input size="small" value="11" />
                  </Form.Item>
                  <Form.Item colon={false} labelAlign="left" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="附件" hasFeedback>
                    <a>111.pdf</a>
                  </Form.Item>
                  <Divider orientation="left">上传附件</Divider>
                  <Form.Item colon={false} labelAlign="left" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="审核意见" hasFeedback>
                    <Input size="small" value="不通过,图片不清晰" />
                  </Form.Item>
                  <Form.Item colon={false} labelAlign="left" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="审核员" hasFeedback>
                    <Input size="small" value="11" />
                  </Form.Item>
                  <Form.Item colon={false} labelAlign="left" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="审核时间" hasFeedback>
                    <Input size="small" value="2020-02-02" />
                  </Form.Item>

                  <Row gutter={20}>
                    <Col span={12}>
                      <Form.Item colon={false} labelAlign="left" labelCol={{ span: 0 }} wrapperCol={{ span: 24 }}>
                        <Button type="primary" style={{ width: '100%' }}>提交</Button>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item colon={false} labelAlign="left" labelCol={{ span: 0 }} wrapperCol={{ span: 24 }}>
                        <Button style={{ width: '100%' }}>取消</Button>
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
  );
}));