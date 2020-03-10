import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { toJS } from 'mobx';
import { useStore } from "../../stores/index";
import { Card, Row, Col, Form, Button, Select, Tabs, Input, DatePicker, Radio, Table, Badge, Divider, Breadcrumb, Alert, Modal } from 'antd';
const { Option } = Select;
const { TabPane } = Tabs;

export const DataView = observer(() => {

  return (
    <div>
      <div style={{ minHeight: 50, background: "#fff", marginBottom: 20, border: "1px solid #e8e8e8", borderLeft: 0, borderRight: 0, padding: "20px" }}>
        <Breadcrumb>
          <Breadcrumb.Item>数据审核</Breadcrumb.Item>
          <Breadcrumb.Item>审核不通过</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <Row type="flex" justify="center">
        <Col span="12">
          <Card>
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
              <Divider orientation="left">审核意见</Divider>
              <Form.Item colon={false} labelAlign="left" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="审核意见" hasFeedback>
                <Input size="small" value="不通过,图片不清晰" />
              </Form.Item>
              <Form.Item colon={false} labelAlign="left" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="审核员" hasFeedback>
                <Input size="small" value="11" />
              </Form.Item>
              <Form.Item colon={false} labelAlign="left" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="审核时间" hasFeedback>
                <Input size="small" value="2020-02-02" />
              </Form.Item>
            </Form>
          </Card>
        </Col>

      </Row>

    </div>
  );
})