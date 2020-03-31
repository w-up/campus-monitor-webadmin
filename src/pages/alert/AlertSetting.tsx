import React, { useEffect, useState } from "react";
import { Checkbox, Modal, InputNumber, Tabs, Breadcrumb, Spin, Card, Row, Col, Form, Select, Divider, Button, Table, Radio, DatePicker, Input } from "antd";
import { Link } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useStore } from "../../stores/index";

const { Option } = Select;

const columns = [
  {
    title: '报警来源',
    dataIndex: 'origin',
    key: 'origin',
  },
  {
    title: '报警项目',
    dataIndex: 'project',
    key: 'project',
  },
  {
    title: '报警次数',
    dataIndex: 'times',
    key: 'times',
  },
  {
    title: '详情',
    dataIndex: 'action',
    key: 'action',
    render: (text:any, record:any) => (
      <Link to="/">查看详情</Link>
    ),
  }
];


export const AlertSettingPage = Form.create()(observer(({ form }: any) => {

  const {
    alert: { alertSetting }
  } = useStore();

  const { getFieldDecorator, setFieldsValue, getFieldsValue, getFieldValue, validateFields } = form;

  const { loading, parkTree, ptList, tableData, typeList, pollutionPmList } = alertSetting;

  useEffect(() => {
    alertSetting.getAllSitesTree();
    alertSetting.getTypes();
    alertSetting.getAllPms();
    alertSetting.getDeviceConfig();
    
  }, []);

  const factoryList: any = [];
  parkTree.forEach(item => {
    item.factorys.forEach(record => {
      factoryList.push({
        factoryName: `${item.parkName}-${record.factoryName}`,
        factoryId: record.factoryId,
      });
    });
  });

  let pmCodeList: any = [];
  if (ptList.length) {
    const index = getFieldValue('warnType') - 1;
    pmCodeList = ptList[index] ? ptList[index].pms : [];
  }

  const changeTab = index => {
    setFieldsValue({
      warnType: index,
    });
  }

  const doSubmit = e => {
    e.preventDefault();
    validateFields((err, values) => {
      if (err) {
        return;
      }

      alertSetting.getList(values);
    });
  }

  const [ addRoleModalVisible, setAddRoleModalVisible ] = useState(false);
  const [ deviceFormEditable, setDeviceFormEditable ] = useState(false);

  const onRuleAdd = () => {
    setAddRoleModalVisible(true);
  }

  const doAddRuleSubmit = () => {
    validateFields(['addForm'], async (err, values) => {
      if (err) {
        return;
      }
      await alertSetting.addPmRule(values.addForm);
      setAddRoleModalVisible(false);
    })
  }

  return (
    <div className="alertPage">
      <Spin spinning={loading}>
        <div style={{ background: "#fff", marginBottom: 20, border: "1px solid #e8e8e8", borderLeft: 0, borderRight: 0, padding: "20px" }}>
          <Breadcrumb>
            <Breadcrumb.Item>告警处理</Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to="/alert/setting">告警设置</Link>
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <Row gutter={10}>
          <Col span={6}>
            <Card size="small" title="告警设置">
              <Form onSubmit={doSubmit}>
                <Form.Item colon={false} labelAlign="left" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="监测类型" >
                  {getFieldDecorator("jcTypes", { initialValue: [], rules: [{ required: true }] })(
                    <Select mode="multiple" style={{ fontSize: '10px' }} placeholder="请选择" size="small">
                      {typeList.map(item => <Option style={{ fontSize: '10px' }} key={item.dictCode} value={item.dictCode}>{item.dictName}</Option>)}
                    </Select>
                  )}
                </Form.Item>

                <Form.Item colon={false} labelAlign="left" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="因子名称" >
                  {getFieldDecorator("pmName", { initialValue: '', rules: [{ required: true }] })(
                    <Select placeholder="请选择" size="small">
                      {pollutionPmList.map(item => <Option key={item.pmCode} value={item.pmCode}>{item.pmName}</Option>)}
                    </Select>
                  )}
                </Form.Item>

                <Form.Item colon={false} labelAlign="left" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="是否发送邮件" >
                  {getFieldDecorator("emails", { initialValue: 0, rules: [{ required: true }] })(
                    <Select placeholder="请选择" size="small">
                      <Option value={1}>是</Option>
                      <Option value={0}>否</Option>
                    </Select>
                  )}
                </Form.Item>

                <Form.Item colon={false} labelAlign="left" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="告警等级" >
                  {getFieldDecorator("warnLevelList", { initialValue: [], rules: [{ required: true }] })(
                    <Select mode="multiple" placeholder="请选择" size="small">
                      <Option value={1}>中度</Option>
                      <Option value={2}>重度</Option>
                      <Option value={3}>严重</Option>
                    </Select>
                  )}
                </Form.Item>

                <Button type="primary" htmlType="submit" block>查询</Button>

              </Form>
            </Card>  
          </Col>
          <Col span={18}>
            <Card size="small" title="规则设置" extra={<Button onClick={onRuleAdd} type="primary" size="small">新增</Button>}>
              <Tabs animated size="small" type="card" defaultActiveKey="1" onChange={changeTab}>
                <Tabs.TabPane tab="超标告警规则" key="1">
                  <Table size="small" bordered columns={columns} dataSource={tableData[0].dataSource} />
                </Tabs.TabPane>
                <Tabs.TabPane tab="设备离线规则" key="2">
                  <Row type="flex" justify="start">
                    <Col span={12}>
                      <Form >
                        <Form.Item colon={false} labelAlign="left" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="离线时间>" >
                          {getFieldDecorator("deviceForm.offlineTime", { initialValue: [], rules: [{ required: true }] })(
                            <InputNumber disabled={!deviceFormEditable} size="small" style={{ width: '100%' }} />
                          )}
                        </Form.Item>
                        <Form.Item colon={false} labelAlign="left" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="提醒频率" >
                          {getFieldDecorator("deviceForm.remindPeriod", { initialValue: [], rules: [{ required: true }] })(
                            <InputNumber disabled={!deviceFormEditable} placeholder="单位分钟" size="small" style={{ width: '100%' }} />
                          )}
                        </Form.Item>
                        <Form.Item colon={false} labelAlign="left" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="邮件通知联络人" >
                          {getFieldDecorator("deviceForm.email", { initialValue: true, valuePropName: "checked", rules: [{ required: true }] })(
                            <Checkbox disabled={!deviceFormEditable} />
                          )}
                        </Form.Item>
                        <Divider />
                        {deviceFormEditable ?
                        <Row type="flex" justify="end">
                          <Button type="primary">保存</Button>
                          <Divider type="vertical" />
                          <Button >取消</Button>
                        </Row>
                        :
                        <Row type="flex" justify="end">
                          <Button onClick={() => setDeviceFormEditable(true)}>编辑</Button>
                        </Row>
                        }
                      </Form>
                    </Col>
                  </Row>
                </Tabs.TabPane>
              </Tabs>
            </Card>
          </Col>
        </Row>
      </Spin>
      <Modal
        title="监测因子告警设置"
        visible={addRoleModalVisible}
        onOk={doAddRuleSubmit}
        onCancel={() => setAddRoleModalVisible(false)}
        okText="确认"
        cancelText="取消"
      >
        <Row type="flex" justify="center">
          <Col span={18}>
            <Form>
              <Form.Item colon={false} labelAlign="left" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="监测类型名称" >
                {getFieldDecorator("addForm.jcTypeIds", { initialValue: [], rules: [{ required: true }] })(
                  <Select mode="multiple" placeholder="请选择" size="small">
                    {typeList.map(item => <Option key={item.dictCode} value={item.dictCode}>{item.dictName}</Option>)}
                  </Select>
                )}
              </Form.Item>
              <Form.Item colon={false} labelAlign="left" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="因子名称" >
                {getFieldDecorator("addForm.pmCode", { initialValue: '', rules: [{ required: true }] })(
                  <Select placeholder="请选择" size="small">
                    {pollutionPmList.map(item => <Option key={item.pmCode} value={item.pmCode}>{item.pmName}</Option>)}
                  </Select>
                )}
              </Form.Item>
              <Form.Item colon={false} labelAlign="left" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="告警等级" >
                {getFieldDecorator("addForm.warnLevel", { initialValue: '', rules: [{ required: true }] })(
                  <Select placeholder="请选择" size="small">
                    <Option value={1}>中度</Option>
                    <Option value={2}>重度</Option>
                    <Option value={3}>严重</Option>
                  </Select>
                )}
              </Form.Item>
              <Form.Item colon={false} labelAlign="left" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="超限值" >
                {getFieldDecorator("addForm.warnLimit", { initialValue: 0, rules: [{ required: true }] })(
                  <InputNumber size="small" style={{ width: '100%' }} />
                )}
              </Form.Item>
              <Form.Item colon={false} labelAlign="left" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="告警时间间隔" >
                {getFieldDecorator("addForm.warnPeriod", { initialValue: 0, rules: [{ required: true }] })(
                  <InputNumber size="small" placeholder="单位分钟" style={{ width: '100%' }} />
                )}
              </Form.Item>
              <Form.Item colon={false} labelAlign="left" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="邮件通知联络人" >
                {getFieldDecorator("addForm.email", { initialValue: true, valuePropName: "checked", rules: [{ required: true }] })(
                  <Checkbox />
                )}
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Modal>
    </div>
  );
}))