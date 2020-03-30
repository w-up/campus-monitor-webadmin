import React, { useEffect } from "react";
import { InputNumber, Tabs, Breadcrumb, Spin, Card, Row, Col, Form, Select, Divider, Button, Table, Radio, DatePicker, Input } from "antd";
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

  const { loading, parkTree, ptList, tableData, typeList } = alertSetting;

  useEffect(() => {
    alertSetting.getAllSitesTree();
    alertSetting.getTypes();
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

  return (
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
                {getFieldDecorator("pmName", { initialValue: "", rules: [{ required: true }] })(
                  <Input size="small" />
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
          <Card size="small" title="数据列表">
            <Tabs animated size="small" type="card" defaultActiveKey="1" onChange={changeTab}>
              <Tabs.TabPane tab="废气超标告警" key="1">
                <Table size="small" bordered columns={columns} dataSource={tableData[0].dataSource} />
              </Tabs.TabPane>
              <Tabs.TabPane tab="污水超标告警" key="2">
                <Table size="small" bordered columns={columns} dataSource={tableData[1].dataSource} />
              </Tabs.TabPane>
              <Tabs.TabPane tab="设备离线告警" key="3">
                <Table size="small" bordered columns={columns} dataSource={tableData[2].dataSource} />
              </Tabs.TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>
    </Spin>
  );
}))