import React, { useEffect } from "react";
import { Checkbox, InputNumber, Tabs, Breadcrumb, Spin, Card, Row, Col, Form, Select, Divider, Button, Table, Radio, DatePicker, Input } from "antd";
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


export const AlertManagePage = Form.create()(observer(({ form }: any) => {

  const {
    alert: { alertManage }
  } = useStore();

  const { getFieldDecorator, setFieldsValue, getFieldsValue, getFieldValue, validateFields } = form;

  const { loading, parkTree, ptList, tableData } = alertManage;

  useEffect(() => {
    alertManage.getAllSitesTree();
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

      alertManage.getList(values);
    });
  }

  const onPmSelectAll = (e) => {
    const { checked } = e.target;
    if (checked) {
      setFieldsValue({
        pmList: pmCodeList.map(item => item.pmCode),
      });
    } else {
      setFieldsValue({
        pmList: [],
      });
    }
  }

  const onFactorySelectAll = (e) => {
    const { checked } = e.target;
    if (checked) {
      setFieldsValue({
        factoryIds: factoryList.map(item => item.factoryId),
      });
    } else {
      setFieldsValue({
        factoryIds: [],
      });
    }
  }

  const allPmChecked = getFieldValue('pmList') && (getFieldValue('pmList').length === pmCodeList.length);
  const allFactoryChecked = getFieldValue('factoryIds') && (getFieldValue('factoryIds').length === factoryList.length);

  return (
    <div className="alertPage">
      <Spin spinning={loading}>
        <div style={{ background: "#fff", marginBottom: 20, border: "1px solid #e8e8e8", borderLeft: 0, borderRight: 0, padding: "20px" }}>
          <Breadcrumb>
            <Breadcrumb.Item>告警处理</Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to="/alert/manage">告警管理</Link>
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <Row gutter={10}>
          <Col span={6}>
            <Card size="small" title="告警管理">
              <Form onSubmit={doSubmit}>

                <Divider orientation="left">监测对象</Divider>
                <Checkbox style={{ fontSize: '10px' }} checked={allFactoryChecked} onChange={onFactorySelectAll}>全选</Checkbox>

                <Form.Item colon={false} labelAlign="left" labelCol={{ span: 0 }} wrapperCol={{ span: 24 }} label="" >
                  {getFieldDecorator("factoryIds", { initialValue: [], rules: [{ required: false }] })(
                    <Checkbox.Group style={{ width: '100%' }}>
                      <Row>
                        {factoryList.map(item => <Col span={24} key={item.factoryId}><Checkbox style={{ fontSize: '10px' }} value={item.factoryId}>{item.factoryName}</Checkbox></Col>)}
                      </Row>
                    </Checkbox.Group>
                  )}
                </Form.Item>

                {getFieldDecorator("warnType", { initialValue: 1, rules: [{ required: false }] })(
                  <Select style={{ display: 'none' }} size="small">
                    <Option value={1}>废气</Option>
                    <Option value={2}>污水</Option>
                  </Select>
                )}

                <Divider orientation="left">监测因子</Divider>
                <Checkbox style={{ fontSize: '10px' }} checked={allPmChecked} onChange={onPmSelectAll}>全选</Checkbox>
                {!!pmCodeList.length &&
                <Form.Item colon={false} labelAlign="left" labelCol={{ span: 0 }} wrapperCol={{ span: 24 }} label="" >
                  {getFieldDecorator("pmList", { initialValue: [], rules: [{ required: false }] })(
                    <Checkbox.Group style={{ width: '100%' }}>
                      <Row>
                        {pmCodeList.map(item => <Col span={8} key={item.pmCode}><Checkbox style={{ fontSize: '10px' }} value={item.pmCode}>{item.pmName}</Checkbox></Col>)}
                      </Row>
                    </Checkbox.Group>
                  )}
                </Form.Item>
                }
                
                <Form.Item colon={false} labelAlign="left" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} label="累计时长超过" >
                  {getFieldDecorator("mins", { initialValue: "", rules: [{ required: false }] })(
                    <InputNumber placeholder="单位分钟" style={{ width: '100%' }} size="small" />
                  )}
                </Form.Item>

                <Form.Item colon={false} labelAlign="left" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="状态" >
                  {getFieldDecorator("status", { initialValue: 0, rules: [{ required: false }] })(
                    <Select placeholder="请选择" size="small">
                      <Option value={0}>未处理</Option>
                      <Option value={1}>已处理</Option>
                      <Option value={2}>全部</Option>
                    </Select>
                  )}
                </Form.Item>

                <Divider orientation="left">起止时间</Divider>

                <Form.Item colon={false} labelAlign="left" labelCol={{ span: 0 }} wrapperCol={{ span: 24 }} label="" >
                  {getFieldDecorator("timeRange", { initialValue: '', rules: [{ required: false }] })(
                    <DatePicker.RangePicker size="small" />
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
    </div>
  );
}))