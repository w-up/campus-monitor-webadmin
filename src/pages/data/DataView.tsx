import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { toJS } from 'mobx';
import { Link, useHistory, useLocation, useParams } from "react-router-dom";
import { useStore } from "../../stores/index";
import { globalConfig } from "../../config";
import { Spin, Descriptions, Card, Row, Col, Form, Button, Select, Tabs, Input, DatePicker, Radio, Table, Badge, Divider, Breadcrumb, Alert, Modal } from 'antd';
const { Option } = Select;
const { TabPane } = Tabs;

export const DataView = Form.create()(observer(({ form }: any) => {

  const history = useHistory();
  const { state = {} }: any = useLocation();
  const { getFieldDecorator, setFieldsValue, getFieldsValue, getFieldValue, validateFields } = form;

  const { id, areaName, parkName, siteName, deviceName, reason, note, status, createUserName, checkTime, checkUser, addDeviceName, collectDate, list, pic, refuseReason, } = state.data || {};

  console.log('state.data', state.data);

  const {
    data: { view }
  } = useStore();

  const { loading } = view;

  const title = status == '待审核' ? '数据审核' : '审核结果查看';

  const doSubmit = e => {
    e.preventDefault();
    validateFields(async (err, values) => {
      if (err) {
        return;
      }
      await view.submitCheck(values);
      history.goBack();
    });
  }

  return (
    <div className="dataViewPage">
      <Spin spinning={loading}>
        <div style={{ minHeight: 50, background: "#fff", marginBottom: 20, border: "1px solid #e8e8e8", borderLeft: 0, borderRight: 0, padding: "20px" }}>
          <Breadcrumb>
            <Breadcrumb.Item>数据审核</Breadcrumb.Item>
            <Breadcrumb.Item>{title}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <Row type="flex" justify="center">
          <Col span="12">
            <Card title={title} size="small" extra={<Button size="small" onClick={() => history.goBack()} >返回</Button>}>
              <Form onSubmit={doSubmit}>
              <Descriptions size="small" title="" layout="horizontal" bordered>
                <Descriptions.Item span={3} label="园区">{parkName}</Descriptions.Item>
                <Descriptions.Item span={3} label="监测区域">{areaName}</Descriptions.Item>
                <Descriptions.Item span={3} label="站点名称">{siteName}</Descriptions.Item>
                <Descriptions.Item span={3} label="监测设备">{deviceName}</Descriptions.Item>
                <Descriptions.Item span={3} label="补录原因">{reason}</Descriptions.Item>
                <Descriptions.Item span={3} label="操作人员">{createUserName}</Descriptions.Item>
              </Descriptions>

              <Divider />

              <Descriptions size="small" title="测量数据" layout="horizontal" bordered>
                <Descriptions.Item span={3} label="补测设备">{addDeviceName}</Descriptions.Item>
                <Descriptions.Item span={3} label="补测时间">{collectDate}</Descriptions.Item>
                {list.map(item => {
                  return (
                    <Descriptions.Item span={3} key={item.pmCode} label={item.pmCode}>{item.collectValue} {item.pmUnit}</Descriptions.Item>
                  );
                })}
              </Descriptions>

              <Divider />

              <Descriptions size="small" title="备注说明" layout="horizontal" bordered>
                <Descriptions.Item span={3} label="操作说明">{note}</Descriptions.Item>
                <Descriptions.Item span={3} label="附件">
                  {
                    pic ?
                    <a download="" href={`${globalConfig.apiEndpoint}${pic}`} target="_blank">点击下载</a>
                    :
                    <span>无附件</span>
                  }
                </Descriptions.Item>
              </Descriptions>

              <Divider />

              <Descriptions size="small" title="审核意见" layout="horizontal" bordered>
                <Descriptions.Item span={3} label="状态">
                  <Form.Item colon={false} labelAlign="left" labelCol={{ span: 0 }} wrapperCol={{ span: 12 }} label="" >
                    {getFieldDecorator("status", { initialValue: status != '待审核' ? status : 1, rules: [{ required: true }] })(
                      <Select disabled={status != '待审核'} placeholder="请选择" size="small">
                        <Option value={1}>通过</Option>
                        <Option value={2}>不通过</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Descriptions.Item>
                {(getFieldValue('status') == 2 || status != '待审核') &&
                  <Descriptions.Item span={3} label="审核意见">
                    <Form.Item colon={false} labelAlign="left" labelCol={{ span: 0 }} wrapperCol={{ span: 24 }} label="" >
                      {getFieldDecorator("refuseReason", { initialValue: refuseReason, rules: [{ required: true, message: '请输入审核意见' }] })(
                        <Input.TextArea disabled={status != '待审核'} />
                      )}
                    </Form.Item>
                  </Descriptions.Item>
                }
                
                {status != '待审核' &&
                  <Descriptions.Item span={3} label="审核员">{checkUser}</Descriptions.Item>
                }
                {status != '待审核' &&
                  <Descriptions.Item span={3} label="审核时间">{checkTime}</Descriptions.Item>
                }

              </Descriptions>

              {getFieldDecorator("id", { initialValue: id, rules: [{ required: true }] })(
                <Input hidden />
              )}

              {status == '待审核' &&
                <Row type="flex" justify="end" style={{ marginTop: '15px' }}>
                  <Button type="primary" htmlType="submit">提交审核结果</Button>
                </Row>
              }
              </Form>
            </Card>
          </Col>

        </Row>
      </Spin>
    </div>
  );
}));