import React, { useEffect, useState } from "react";
import { useObserver, useLocalStore, observer } from "mobx-react-lite";
import { Radio, Select, DatePicker, Input, Form, Icon, Spin, Card, Row, Col, Tree, Descriptions, Button, Table, Divider, InputNumber, Modal } from "antd";
import Search from "antd/lib/input/Search";
import { CarryOutOutlined, FormOutlined } from '@ant-design/icons';
import { toJS } from 'mobx';
import moment from 'moment';
import { useStore } from "../../stores/index";
import { DrawBaiduMap } from "../../components/DrawBaiduMap";

const { Option } = Select;

export const MyEnterprisePage = Form.create()(observer(({ form }: any) => {

  const {
    base: { myEnterprise }
  } = useStore();

  const { getFieldDecorator, setFieldsValue, getFieldsValue, getFieldValue, validateFields, resetFields } = form;

  const {
    loading,
    treeData, onTreeItemSelect, enterpriseInfo, factoryInfo, selectedEnterprise, doSubmitEnterpriseInfo, companyNatureType, industryType,
    dataSource, query, selectedRowKeys, total, onSelectChange, paginationChange, deleteEnterprise, 
    handleSearchSubmit, handleSearchChange, handleSearchReset, resetSelectedRowKeys
  } = myEnterprise;

  const {
    businessPeriodEnd, businessPeriodStart, businessScope, companyAddress, companyName, companyNature, companyNatureId,
    legalRepresentative, profession, professionId, registerCapital, registerDate, id,
  } = enterpriseInfo;

  // const {
  //   factoryName, parkId, factoryAddress, contactPerson, contactPhone, contactPosition, email, scope,
  // } = factoryInfo;

  useEffect(() => {
    myEnterprise.getTree();
    myEnterprise.getCompanyNatureType();
    myEnterprise.getIndustryType();
  }, []);

  const submitEnterpriseInfo = (e) => {
    e.preventDefault();
    validateFields(async (err, values) => {
      if (err) {
        return;
      }
      await doSubmitEnterpriseInfo(values);
    })
  }

  const [ addFactoryModalVisible, setAddFactoryModalVisible] = useState(false);

  const enterpriseInfoEditable = getFieldValue('enterpriseInfoEditable');

  const columns = useLocalStore(() => ([
    {
      title: '厂区名称',
      dataIndex: 'name',
    },
    {
      title: '地址',
      dataIndex: 'address',
    },
    {
      title: '所属园区',
      dataIndex: 'belongs',
    },
    {
      title: '联络人',
      dataIndex: 'lialison',
    },
    {
      title: '厂区范围',
      dataIndex: 'area',
    },
    {
      title: '操作',
      dataIndex: 'action',
      render: (text:any, record:any) => (
        <span>
          <a>编辑</a>
          <Divider type="vertical" />
          <a>删除</a>
        </span>
      ),
    }
  ]))
  const data = useLocalStore(() => ([
    {
      key: '1',
      id: 'TradeCode21',
      name: 'A化工XX厂',
      address: '上海市杨浦区XXXX街道1001号',
      belongs: '园区1',
      lialison: "陈玉",
      area: '2356.89 396547.98'
    },
    {
      key: '2',
      id: 'TradeCode21',
      name: 'A化工XX厂',
      address: '上海市杨浦区XXXX街道1001号',
      belongs: '园区1',
      lialison: "陈玉",
      area: '2356.89 396547.98'
    },
    {
      key: '3',
      id: 'TradeCode21',
      name: 'A化工XX厂',
      address: '上海市杨浦区XXXX街道1001号',
      belongs: '园区1',
      lialison: "陈玉",
      area: '2356.89 396547.98'
    },
    {
      id: 'TradeCode21',
      name: 'A化工XX厂',
      address: '上海市杨浦区XXXX街道1001号',
      belongs: '园区1',
      lialison: "陈玉",
      area: '2356.89 396547.98'
    },
  ]))
  const rowSelection = useLocalStore(() => ({
    onChange: (selectedRowKeys:any, selectedRows:any) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: (record:any) => ({
      disabled: record.name === 'Disabled User', // Column configuration not to be checked
      name: record.name,
    }),
  }))
  return (
    <Spin spinning={loading}>
      <Row gutter={10}>
        <Col span={6}>
          <Card bordered title="企业信息">
            <div>
              <Search
                placeholder="请输入关键词"
                onSearch={value => console.log(value)}
                style={{ width: 200 }}
              />
            </div>
            <div>
            <Tree
              showLine={true}
              showIcon={true}
              onSelect={onTreeItemSelect}
              treeData={toJS(treeData)}
            />
            </div>
          </Card>
        </Col>
        <Col span={18}>
          <Card bordered title={selectedEnterprise.title}>
            <Form onSubmit={submitEnterpriseInfo}>
              <Card bordered size="small" title="工商基本信息" extra={enterpriseInfoEditable ? <Row><Button icon="save" htmlType="submit" type="primary">保存</Button><Divider type="vertical" /><Button onClick={() => resetFields()} icon="save" >取消</Button></Row> : <Button icon="edit" onClick={() => setFieldsValue({ enterpriseInfoEditable: true })} type="primary">编辑</Button>}>
                  {getFieldDecorator("enterpriseInfoEditable", { initialValue: false })(<Input style={{ display: 'none' }} />)}
                  {getFieldDecorator("companyId", { initialValue: selectedEnterprise.id, rules: [{ required: false }] })(
                    <Input style={{ display: 'none' }} placeholder="" />
                  )}
                  <Descriptions size="small" bordered>
                    <Descriptions.Item label="法人代表" span={1.5}>
                      {getFieldDecorator("legalRepresentative", { initialValue: legalRepresentative, rules: [{ required: false }] })(
                        <Input disabled={!enterpriseInfoEditable}  placeholder="" />
                      )}
                    </Descriptions.Item>
                    <Descriptions.Item label="行业" span={1.5}>
                      {getFieldDecorator("professionId", { initialValue: professionId, rules: [{ required: false }] })(
                        <Select disabled={!enterpriseInfoEditable} placeholder="">
                          {industryType.map(item => (
                            <Option value={item.id}>{item.dictName}</Option>
                          ))}
                        </Select>
                      )}
                    </Descriptions.Item>
                    <Descriptions.Item label="注册资本" span={1.5}>
                      <Row type="flex" justify="center">
                        <Col span={20}>
                          {getFieldDecorator("registerCapital", { initialValue: registerCapital, rules: [{ required: false }] })(
                            <InputNumber style={{ width: '100%' }} disabled={!enterpriseInfoEditable} placeholder="" />
                          )}
                        </Col>
                        <Col span={4} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>万</Col>
                      </Row>
                    </Descriptions.Item>
                    <Descriptions.Item label="注册日期" span={1.5}>
                      {getFieldDecorator("registerDate", { initialValue: moment(registerDate), rules: [{ required: false }] })(
                        <DatePicker disabled={!enterpriseInfoEditable} placeholder="" />
                      )}
                    </Descriptions.Item>
                    <Descriptions.Item label="公司性质" span={1.5}>
                      {getFieldDecorator("companyNatureId", { initialValue: companyNatureId, rules: [{ required: false }] })(
                        <Select disabled={!enterpriseInfoEditable} placeholder="">
                          {companyNatureType.map(item => (
                            <Option value={item.id}>{item.dictName}</Option>
                          ))}
                        </Select>
                      )}
                    </Descriptions.Item>
                    <Descriptions.Item label="经营期限" span={1.5}>
                      <Row type="flex" justify="center" gutter={6}>
                        <Col span={10}>
                          {getFieldDecorator("businessPeriodStart", { initialValue: moment(businessPeriodStart), rules: [{ required: false }] })(
                            <DatePicker disabled={!enterpriseInfoEditable} placeholder="" />
                          )}
                        </Col>
                        <Col span={4} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>至</Col>
                        <Col span={10}>
                          {getFieldDecorator("businessPeriodEnd", { initialValue: moment(businessPeriodEnd), rules: [{ required: false }] })(
                            <DatePicker disabled={!enterpriseInfoEditable} placeholder="" />
                          )}
                        </Col>
                      </Row>
                    </Descriptions.Item>
                    <Descriptions.Item label="所在地" span={3}>
                      {getFieldDecorator("companyAddress", { initialValue: companyAddress, rules: [{ required: false }] })(
                        <Input disabled={!enterpriseInfoEditable} placeholder="" />
                      )}
                    </Descriptions.Item>
                    <Descriptions.Item label="经营范围" span={3}>
                      {getFieldDecorator("businessScope", { initialValue: businessScope, rules: [{ required: false }] })(
                        <Input.TextArea disabled={!enterpriseInfoEditable} placeholder="" />
                      )}
                    </Descriptions.Item>
                    
                  </Descriptions>
              </Card>
            </Form>
            <Divider />
            <Card bordered size="small" title="厂区信息" extra={<Row><Button icon="delete">删除</Button><Divider type="vertical" /><Button icon="file-add" type="primary">添加厂区</Button></Row>}>
              <Table size="small" bordered rowSelection={rowSelection} columns={columns} dataSource={data} />
            </Card>
          </Card>
        </Col>
      </Row>
      <Modal
        title="添加厂区"
        width={800}
        visible={addFactoryModalVisible}
        // onOk={this.handleOk}
        onCancel={() => setAddFactoryModalVisible(false)}
      >
        <Form layout="horizontal">
          <Card title="厂区信息" bordered size="small">
            <Descriptions size="small" bordered>
              <Descriptions.Item label="厂区名称" span={1.5}>
                {getFieldDecorator("factoryName", { initialValue: '', rules: [{ required: false }] })(
                  <Input placeholder='请输入厂区名称' />
                )}
              </Descriptions.Item>
              <Descriptions.Item label="所属园区" span={1.5}>
                {getFieldDecorator("parkId", { initialValue: '', rules: [{ required: false }] })(
                  <Input placeholder='请输入所属园区' />
                )}
              </Descriptions.Item>
              <Descriptions.Item label="地址" span={1.5}>
                {getFieldDecorator("factoryAddress", { initialValue: '', rules: [{ required: false }] })(
                  <Input placeholder='请输入地址' />
                )}
              </Descriptions.Item>
            </Descriptions>
          </Card>
          <Divider />
          <Card title="联络人信息" bordered size="small">
            <Descriptions size="small" bordered>
                <Descriptions.Item label="联络人" span={1.5}>
                  {getFieldDecorator("contactPerson", { initialValue: '', rules: [{ required: false }] })(
                    <Input placeholder='请输入联络人' />
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="电话" span={1.5}>
                  {getFieldDecorator("contactPhone", { initialValue: '', rules: [{ required: false }] })(
                    <Input placeholder='请输入电话' />
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="职位" span={1.5}>
                  {getFieldDecorator("contactPosition", { initialValue: '', rules: [{ required: false }] })(
                    <Input placeholder='请输入职位' />
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="邮箱" span={1.5}>
                  {getFieldDecorator("email", { initialValue: '', rules: [{ required: false }] })(
                    <Input placeholder='请输入邮箱' />
                  )}
                </Descriptions.Item>
              </Descriptions>
          </Card>
          <Divider />
          <Card title="厂区范围" bordered size="small">
            {getFieldDecorator("scopeType", { initialValue: 'location', rules: [{ required: false }] })(
              <Radio.Group>
                <Radio value="map">地图绘制</Radio>
                <Radio value="location">输入经纬度</Radio>
              </Radio.Group>
            )}
            <Divider />
            {getFieldValue('scopeType') === 'map' ? 
              <Row style={{ width: '100%', height: '400px' }}>
                <DrawBaiduMap />
              </Row> : null
              // <Table pagination={false} size="small" bordered dataSource={toJS(scope) || []}>
              //   <Table.Column
              //     title="名称"
              //     dataIndex="scopeName"
              //     key="scopeName"
              //   />
              //   <Table.Column
              //     title="精度"
              //     dataIndex="longitude"
              //     key="longitude"
              //   />
              //   <Table.Column
              //     title="纬度"
              //     dataIndex="latitude"
              //     key="latitude"
              //   />
              // </Table>
            }
          </Card>
        </Form>
        
      </Modal>
    </Spin>
  );
}))