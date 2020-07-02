import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import { message, Spin, Card, Row, Col, Form, Button, Select, Tabs, Input, DatePicker, Radio, Table, Badge, Divider, Breadcrumb, Alert, Modal } from 'antd';
import { useStore } from "../../stores/index";
import { toJS } from "mobx";
import { globalConfig } from "../../config";

const { Option } = Select;
const { TabPane } = Tabs;

export const DataManagePage = Form.create()(observer(({ form, history }: any) => {

  const {
    data: { manage }
  } = useStore();

  const { getFieldDecorator, setFieldsValue, getFieldsValue, getFieldValue, validateFields } = form;


  const { loading, dataSource, parkTree, ptList, deviceList, deleteById, query, total, paginationChange } = manage;


  const columns = [
    {
      title: '提交时间',
      dataIndex: 'collectDate',
      key: 'collectDate',
    },
    {
      title: '提交人',
      dataIndex: 'createUserName',
      key: 'createUserName',
    },
    {
      title: '园区名称',
      dataIndex: 'parkName',
      key: 'parkName',
    },
    {
      title: '监测区域',
      dataIndex: 'areaName',
      key: 'areaName',
    },
    {
      title: '站点名称',
      dataIndex: 'siteName',
      key: 'siteName',
    },
    {
      title: '数据类型',
      dataIndex: '',
      key: '',
      render: () => '补录数据',
    },
    {
      title: '附件',
      dataIndex: 'pic',
      key: 'pic',
      render: (val) => {
        if (val) {
          return <a download="" href={`${globalConfig.apiEndpoint}${val}`} target="_blank">下载</a>
        }
        return <span>无附件</span>
      },
    },
    {
      title: '状态',
      key: 'status',
      dataIndex: 'status',
      render: (val) => {
        if (val === '审核不通过') {
          return <span style={{ color: 'red' }}>{val}</span>;
        }
      return <span>{val}</span>;
      },
    },
    {
      title: '操作',
      dataIndex: '',
      key: '',
      render: (_: any, data: any) => {
        if (data.status === '待审核') {
          return (
            <a onClick={() => {
              Modal.confirm({
                title: "撤销确认",
                content: "确定撤销这条记录吗？",
                async onOk() {
                  try {
                    await deleteById(data.id);
                    message.success("撤销成功");
                    manage.getCheckDataList({});
                  } catch {
                    message.error("撤销失败");
                  }
                }
              });
            }}>撤销</a>
          );
        } else {
          return (
            <Link to={{ pathname: `/data/manage/view/${data.id}`, state: { data } }}>查看</Link>
          );
        }
      }
    },
  ];


  useEffect(() => {
    // manage.getCheckDataList();
    manage.getAllSitesTree();
    manage.getCheckDataList(query);
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
      manage.getCheckDataList(values);
    });
  }

  const pagination = {
    current: query.current,
    pageSize: query.pageSize,
    total,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total) => {
      return '共 ' + total + ' 条记录'
    },
    onChange: paginationChange,
    onShowSizeChange: paginationChange,
  };

  return (
    <div className="managePage">
      <Spin spinning={loading}>
        <div style={{ background: "#fff", marginBottom: 20, border: "1px solid #e8e8e8", borderLeft: 0, borderRight: 0, padding: "20px" }}>
          <Breadcrumb>
            <Breadcrumb.Item>数据质量</Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to="/data/manage">数据管理</Link>
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <Row gutter={10}>
          <Col span={6}>
            <Card size="small" title="数据查询" >
              <Form onSubmit={doSubmit}>

                <Form.Item colon={false} labelAlign="left" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} label="选择园区" >
                  {getFieldDecorator("parkId", { initialValue: query.parkId, rules: [{ required: true, message: '请选择园区' }] })(
                    <Select onChange={() => setFieldsValue({ factoryId: '' })} placeholder="请选择" size="small">
                      {parkTree.map(item => <Option key={item.parkId} value={item.parkId}>{item.parkName}</Option>)}
                    </Select>
                  )}
                </Form.Item>

                <Form.Item colon={false} labelAlign="left" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} label="监测区域" >
                  {getFieldDecorator("factoryId", { initialValue: query.factoryId, rules: [{ required: false }] })(
                    <Select onChange={() => setFieldsValue({ siteId: '' })} placeholder="请选择" size="small">
                      {factoryList.map(item => <Option key={item.factoryId} value={item.factoryId}>{item.factoryName}</Option>)}
                      <Option value="">不限</Option>
                    </Select>
                  )}
                </Form.Item>

                <Form.Item colon={false} labelAlign="left" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} label="站点名称" >
                  {getFieldDecorator("siteId", { initialValue: query.siteId, rules: [{ required: false }] })(
                    <Select onChange={(val) => {
                      manage.getDevice(val);
                      setFieldsValue({ deviceCode: '' });
                    }} placeholder="请选择" size="small">
                      {siteList.map(item => <Option key={item.siteId} value={item.siteId}>{item.siteName}</Option>)}
                      <Option value="">不限</Option>
                    </Select>
                  )}
                </Form.Item>


                <Form.Item colon={false} labelAlign="left" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} label="监测设备" >
                  {getFieldDecorator("deviceCode", { initialValue: query.deviceCode, rules: [{ required: false }] })(
                    <Select placeholder="请选择" size="small">
                      {deviceList.map(item => <Option key={item.deviceCode} value={item.deviceCode}>{item.deviceName}</Option>)}
                      <Option value="">不限</Option>
                    </Select>
                  )}
                </Form.Item>

                <Form.Item colon={false} labelAlign="left" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} label="补录原因" >
                  {getFieldDecorator("reason", { initialValue: query.reason, rules: [{ required: false }] })(
                    <Input.TextArea placeholder="请填写补录原因" />
                  )}
                </Form.Item>

                <Button type="primary" htmlType="submit" block>查询</Button>

              </Form>
            </Card>
          </Col>
          <Col span={18}>
            <Card size="small" title="数据列表" extra={<Link to="/data/manage/replenish"><Button size="small" type="primary">补录数据</Button></Link>}>
              <Table bordered size="small" pagination={pagination} columns={columns} dataSource={toJS(dataSource)} />
            </Card>
          </Col>
        </Row>
      </Spin>
      <div className="fixed bottom-0 text-center pb-1" style={{ width:"calc(100% - 200px)", color:"#88a8c5", zIndex:9999}}>版权所有: 武汉三藏科技有限责任公司</div>
    </div>

  );
}));
