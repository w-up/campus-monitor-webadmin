import React, { useEffect, useState } from "react";
import { message, Checkbox, Modal, InputNumber, Tabs, Breadcrumb, Spin, Card, Row, Col, Form, Select, Divider, Button, Table, Radio, DatePicker, Input } from "antd";
import { Link } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useStore } from "../../stores/index";
import { toJS } from "mobx";

const { Option } = Select;

export const AlertSettingPage = Form.create()(
  observer(({ form }: any) => {
    const {
      alert: { alertSetting },
      auth,
    } = useStore();

    const { getFieldDecorator, setFieldsValue, getFieldsValue, getFieldValue, validateFields, resetFields } = form;

    const { loading, dataSource, typeList, pollutionPmList, parkList, companyList, pmDataSource, pmTotal, pmQuery, query, total } = alertSetting;

    const [editRoleModalVisible, setEditRoleModalVisible] = useState(false);
    const [currentTab, setCurrentTab] = useState("1");
    const [editModalVisible, setEditModalVisible] = useState(false);

    useEffect(() => {
      alertSetting.getTypes();
      alertSetting.getAllPms();
      alertSetting.getDeviceConfig();
      alertSetting.getAllCompany();
      alertSetting.getAllParks();
      alertSetting.getList();
    }, []);

    const changeTab = (index) => {
      setCurrentTab(index);
    };

    const doSubmit = (e) => {
      e.preventDefault();
      validateFields(["setForm"], (err, values) => {
        if (err) {
          return;
        }

        alertSetting.getList(values.setForm);
      });
    };

    const onRuleAdd = () => {
      setEditRoleModalVisible(true);
      resetFields(["editForm"]);
    };

    const doAddRuleSubmit = () => {
      validateFields(["editForm"], async (err, values) => {
        if (err) {
          return;
        }

        await alertSetting.addPmRule(values.editForm);
        setEditRoleModalVisible(false);
        alertSetting.getDeviceConfig();
        alertSetting.getList();
      });
    };

    const pagination = {
      current: query.current,
      pageSize: query.pageSize,
      total: total,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total) => {
        return "共 " + total + " 条记录";
      },
      onChange: alertSetting.paginationChange,
      onShowSizeChange: alertSetting.paginationChange,
    };

    const pmPagination = {
      current: pmQuery.current,
      pageSize: pmQuery.pageSize,
      total: pmTotal,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total) => {
        return "共 " + total + " 条记录";
      },
      onChange: alertSetting.pmPaginationChange,
      onShowSizeChange: alertSetting.pmPaginationChange,
    };

    const columns = [
      {
        title: "监测对象",
        dataIndex: "jcObj",
        key: "jcObj",
        width: 200,
      },
      {
        title: "离线时间超过（分钟）",
        dataIndex: "offlineTime",
        key: "offlineTime",
        width: 100,
      },
      {
        title: "提醒频率（分钟）",
        dataIndex: "remindPeriod",
        key: "remindPeriod",
        width: 100,
      },
      {
        title: "发送邮件",
        width: 100,
        dataIndex: "email",
        key: "email",
        render: (text) => {
          return text == 1 ? "是" : "否";
        },
      },
      {
        title: "操作",
        width: 80,
        render: (_: any, record: any) => {
          return (
            <span>
              <a
                onClick={() => {
                  setEditModalVisible(true);
                  setFieldsValue({
                    editDeviceForm: record,
                  });
                }}
              >
                编辑
              </a>
              <Divider type="vertical" />
              <a
                onClick={() => {
                  Modal.confirm({
                    title: "删除确认",
                    content: `确定删除这条规则吗？`,
                    maskClosable: true,
                    async onOk() {
                      try {
                        await alertSetting.deleteWarnDeviceConfig(record.id);
                        message.success("删除成功");
                        alertSetting.getDeviceConfig();
                      } catch {
                        message.error("删除失败");
                      }
                    },
                  });
                }}
              >
                删除
              </a>
            </span>
          );
        },
      },
    ];

    const pmColumns = [
      {
        title: "监测对象",
        dataIndex: "jcObj",
        key: "jcObj",
        width: 100,
      },
      {
        title: "监测类型名称",
        width: 100,
        dataIndex: "jcTypes",
        key: "jcTypes",
        render: (val) => {
          return val.join(",");
        },
      },
      {
        title: "因子名称",
        width: 150,
        dataIndex: "pmName",
        key: "pmName",
        render: (val, record) => {
          if (record.pmUnit) {
            return `${val}(${record.pmUnit})`;
          }
          return val;
        },
      },
      {
        title: "告警等级",
        width: 100,
        dataIndex: "warnLevel",
        key: "warnLevel",
        render: (val) => {
          return ["", "中度", "重度", "严重"][val];
        },
      },
      {
        title: "超限值",
        width: 80,
        dataIndex: "warnLimit",
        key: "warnLimit",
      },
      {
        title: "告警时间间隔（分钟）",
        dataIndex: "warnPeriod",
        key: "warnPeriod",
        width: 100,
      },
      {
        title: "发送邮件",
        width: 80,
        dataIndex: "email",
        key: "email",
        render: (text) => {
          return text == 1 ? "是" : "否";
        },
      },
      {
        title: "操作",
        width: 80,
        render: (_: any, record: any) => {
          return (
            <span>
              <a
                onClick={() => {
                  setEditRoleModalVisible(true);
                  resetFields(["editForm"]);
                  setFieldsValue({ editForm: { ...record } });
                }}
              >
                编辑
              </a>
              <Divider type="vertical" />
              <a
                onClick={() => {
                  Modal.confirm({
                    title: "删除确认",
                    content: `确定删除这条规则吗？`,
                    maskClosable: true,
                    async onOk() {
                      try {
                        await alertSetting.deletePmWarn(record.id);
                        message.success("删除成功");
                        alertSetting.getList();
                      } catch {
                        message.error("删除失败");
                      }
                    },
                  });
                }}
              >
                删除
              </a>
            </span>
          );
        },
      },
    ];

    const doDeviceEdit = () => {
      validateFields(["editDeviceForm"], async (err, values) => {
        if (err) {
          return;
        }
        await alertSetting.editDeviceWarnConfig(values.editDeviceForm);
        setEditModalVisible(false);
        await alertSetting.getDeviceConfig();
      });
    };

    const onTypeSelectAll = (e) => {
      const { checked } = e.target;
      if (checked) {
        setFieldsValue({
          "setForm.jcTypes": typeList.map((item) => item.dictCode),
        });
      } else {
        setFieldsValue({
          "setForm.jcTypes": [],
        });
      }
    };

    const allTypeChecked = getFieldValue("setForm.jcTypes") && getFieldValue("setForm.jcTypes").length === typeList.length;

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
              <Card size="small" title="告警设置" style={{ minHeight: "360px" }}>
                <Form onSubmit={doSubmit} style={{ display: currentTab == "2" ? "none" : "block" }}>
                  {getFieldDecorator("setForm.current", { initialValue: 1, rules: [{ required: false }] })(<Input hidden />)}

                  <Divider orientation="left">监测类型名称</Divider>
                  <Checkbox style={{ fontSize: "10px" }} checked={allTypeChecked} onChange={onTypeSelectAll}>
                    全选
                  </Checkbox>

                  <Form.Item colon={false} labelAlign="left" labelCol={{ span: 0 }} wrapperCol={{ span: 24 }} label="">
                    {getFieldDecorator("setForm.jcTypes", { initialValue: typeList && typeList.map((v) => v.dictCode), rules: [{ required: false }] })(
                      <Checkbox.Group style={{ width: "100%" }}>
                        <Row>
                          {typeList.map((item) => (
                            <Col span={12} key={item.dictCode}>
                              <Checkbox style={{ fontSize: "10px" }} value={item.dictCode}>
                                {item.dictName}
                              </Checkbox>
                            </Col>
                          ))}
                        </Row>
                      </Checkbox.Group>
                    )}
                  </Form.Item>

                  <Form.Item colon={false} labelAlign="left" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="因子名称">
                    {getFieldDecorator("setForm.pmName", { initialValue: "", rules: [{ required: false }] })(
                      // <Select showSearch placeholder="请选择" size="small">
                      //   <Option value="">不限</Option>
                      //   {pollutionPmList.map((item) => (
                      //     <Option key={item.pmName} value={item.pmName}>
                      //       {item.pmName}
                      //     </Option>
                      //   ))}
                      // </Select>
                      <Input size="small" placeholder="请输入" />
                    )}
                  </Form.Item>

                  <Form.Item colon={false} labelAlign="left" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="告警等级">
                    {getFieldDecorator("setForm.warnLevelList", { initialValue: [], rules: [{ required: false }] })(
                      <Select mode="multiple" placeholder="请选择" size="small">
                        <Option value={1}>中度</Option>
                        <Option value={2}>重度</Option>
                        <Option value={3}>严重</Option>
                      </Select>
                    )}
                  </Form.Item>

                  <Form.Item colon={false} labelAlign="left" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="是否发送邮件">
                    {getFieldDecorator("setForm.emails", { initialValue: [], rules: [{ required: false }] })(
                      <Select mode="multiple" placeholder="请选择" size="small">
                        <Option value={1}>是</Option>
                        <Option value={0}>否</Option>
                      </Select>
                    )}
                  </Form.Item>

                  <Button type="primary" htmlType="submit" block>
                    查询
                  </Button>
                </Form>
              </Card>
            </Col>
            <Col span={18}>
              <Card size="small" title="规则设置">
                <Tabs animated size="small" type="card" defaultActiveKey="1" onChange={changeTab}>
                  <Tabs.TabPane tab="超标告警规则" key="1">
                    <Table
                      size="small"
                      title={() => (
                        <Row type="flex" justify="end">
                          <Button onClick={onRuleAdd} type="primary" size="small">
                            新增
                          </Button>
                        </Row>
                      )}
                      bordered
                      columns={pmColumns}
                      pagination={pmPagination}
                      dataSource={toJS(pmDataSource)}
                    />
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="设备离线规则" key="2">
                    <Table
                      title={() => {
                        return (
                          <Row type="flex" justify="end">
                            <Button
                              onClick={() => {
                                setEditModalVisible(true);
                                resetFields(["editDeviceForm"]);
                              }}
                              type="primary"
                              size="small"
                            >
                              新增
                            </Button>
                          </Row>
                        );
                      }}
                      rowKey="id"
                      bordered
                      size="small"
                      columns={columns}
                      pagination={pagination}
                      dataSource={toJS(dataSource)}
                    ></Table>
                    {/* <Row type="flex" justify="start">
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
                  </Row> */}
                  </Tabs.TabPane>
                </Tabs>
              </Card>
            </Col>
          </Row>
        </Spin>
        <Modal title="监测因子告警设置" visible={editRoleModalVisible} onOk={doAddRuleSubmit} onCancel={() => setEditRoleModalVisible(false)} okText="确认" cancelText="取消">
          <Row type="flex" justify="center">
            <Col span={18}>
              <Form>
                {getFieldDecorator("editForm.id", { initialValue: "", rules: [{ required: false }] })(<Input hidden size="small" style={{ width: "100%" }} />)}

                {!getFieldValue("editForm.id") ? (
                  <Row gutter={6}>
                    {auth.user?.type == 2 && (
                      <Row>
                        <Form.Item colon={false} labelAlign="left" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="监测对象类型">
                          {getFieldDecorator("editForm.type", { initialValue: 1, rules: [{ required: false }] })(
                            <Select onChange={() => setFieldsValue({ "editForm.parkOrCompanyId": "" })} placeholder="请选择" size="small">
                              <Option value={0}>园区</Option>
                              <Option value={1}>企业</Option>
                            </Select>
                          )}
                        </Form.Item>
                        <Form.Item colon={false} labelAlign="left" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="监测对象">
                          {getFieldDecorator("editForm.parkOrCompanyId", { initialValue: "", rules: [{ required: true, message: "请选择监测对象" }] })(
                            <Select placeholder="请选择" size="small">
                              {getFieldValue("editForm.type") == 0 &&
                                parkList.map((item) => (
                                  <Option key={item.id} value={item.id}>
                                    {item.parkName}
                                  </Option>
                                ))}
                              {getFieldValue("editForm.type") == 1 &&
                                companyList.map((item) => (
                                  <Option key={item.id} value={item.id}>
                                    {item.companyName}
                                  </Option>
                                ))}
                            </Select>
                          )}
                        </Form.Item>
                      </Row>
                    )}
                    <Form.Item colon={false} labelAlign="left" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="监测类型名称">
                      {getFieldDecorator("editForm.jcTypeIds", { initialValue: [], rules: [{ required: true, message: "请选择监测类型名称" }] })(
                        <Checkbox.Group style={{ width: "100%" }}>
                          <Row>
                            {typeList.map((item) => (
                              <Col span={12} key={item.dictCode}>
                                <Checkbox style={{ fontSize: "10px" }} value={item.dictCode}>
                                  {item.dictName}
                                </Checkbox>
                              </Col>
                            ))}
                          </Row>
                        </Checkbox.Group>
                      )}
                    </Form.Item>
                    <Form.Item colon={false} labelAlign="left" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="因子名称">
                      {getFieldDecorator("editForm.pmCode", { initialValue: "", rules: [{ required: true, message: "请选择因子名称" }] })(
                        <Select placeholder="请选择" size="small">
                          {pollutionPmList.map((item) => (
                            <Option key={item.pmCode} value={item.pmCode}>
                              {item.pmName}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>
                    <Form.Item colon={false} labelAlign="left" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="告警等级">
                      {getFieldDecorator("editForm.warnLevel", { initialValue: 1, rules: [{ required: true, message: "请选择告警等级" }] })(
                        <Select placeholder="请选择" size="small">
                          <Option value={1}>中度</Option>
                          <Option value={2}>重度</Option>
                          <Option value={3}>严重</Option>
                        </Select>
                      )}
                    </Form.Item>
                  </Row>
                ) : (
                  <Row>
                    {getFieldDecorator("editForm.parkOrCompanyId", { initialValue: 0, rules: [{ required: true }] })(<Input hidden size="small" />)}
                    {getFieldDecorator("editForm.type", { initialValue: 0, rules: [{ required: true }] })(<Input hidden size="small" />)}
                  </Row>
                )}
                <Form.Item colon={false} labelAlign="left" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="超限值">
                  {getFieldDecorator("editForm.warnLimit", { initialValue: 0, rules: [{ required: true }] })(<InputNumber size="small" style={{ width: "100%" }} />)}
                </Form.Item>
                <Form.Item colon={false} labelAlign="left" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="告警时间间隔">
                  {getFieldDecorator("editForm.warnPeriod", { initialValue: 0, rules: [{ required: true }] })(<InputNumber min={0} size="small" placeholder="单位分钟" style={{ width: "100%" }} />)}
                </Form.Item>
                <Form.Item colon={false} labelAlign="left" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="邮件通知联络人">
                  {getFieldDecorator("editForm.email", { initialValue: true, valuePropName: "checked", rules: [{ required: false }] })(<Checkbox />)}
                </Form.Item>
              </Form>
            </Col>
          </Row>
        </Modal>

        <Modal title="设备告警设置" visible={editModalVisible} onOk={doDeviceEdit} onCancel={() => setEditModalVisible(false)} okText="确认" cancelText="取消">
          <Row type="flex" justify="center">
            <Col span={18}>
              <Form>
                {getFieldDecorator("editDeviceForm.id", { initialValue: "", rules: [{ required: false }] })(<Input hidden size="small" style={{ width: "100%" }} />)}

                {!getFieldValue("editDeviceForm.id") ? (
                  <Row gutter={6}>
                    {auth.user?.type == 2 && (
                      <Row>
                        <Form.Item colon={false} labelAlign="left" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="监测对象类型">
                          {getFieldDecorator("editDeviceForm.type", { initialValue: 1, rules: [{ required: true, message: "请选择监测对象类型" }] })(
                            <Select placeholder="请选择" size="small">
                              <Option value={0}>园区</Option>
                              <Option value={1}>企业</Option>
                            </Select>
                          )}
                        </Form.Item>
                        <Form.Item colon={false} labelAlign="left" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="监测对象">
                          {getFieldDecorator("editDeviceForm.parkOrCompanyId", { initialValue: "", rules: [{ required: true, message: "请选择监测对象" }] })(
                            <Select placeholder="请选择" size="small">
                              {getFieldValue("editDeviceForm.type") == 0 &&
                                parkList.map((item) => (
                                  <Option key={item.id} value={item.id}>
                                    {item.parkName}
                                  </Option>
                                ))}
                              {getFieldValue("editDeviceForm.type") == 1 &&
                                companyList.map((item) => (
                                  <Option key={item.id} value={item.id}>
                                    {item.companyName}
                                  </Option>
                                ))}
                            </Select>
                          )}
                        </Form.Item>
                      </Row>
                    )}
                  </Row>
                ) : (
                  <Row>
                    {getFieldDecorator("editDeviceForm.parkOrCompanyId", { initialValue: 0, rules: [{ required: true }] })(<Input hidden size="small" />)}
                    {getFieldDecorator("editDeviceForm.type", { initialValue: 0, rules: [{ required: true }] })(<Input hidden size="small" />)}
                  </Row>
                )}

                <Form.Item colon={false} labelAlign="left" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="离线时间>=">
                  {getFieldDecorator("editDeviceForm.offlineTime", { initialValue: 0, rules: [{ required: true, message: "请输入离线时间" }] })(<InputNumber size="small" min={0} style={{ width: "100%" }} />)}
                </Form.Item>
                <Form.Item colon={false} labelAlign="left" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="告警时间间隔">
                  {getFieldDecorator("editDeviceForm.remindPeriod", { initialValue: 0, rules: [{ required: true, message: "请输入告警时间间隔" }] })(<InputNumber min={0} size="small" placeholder="单位分钟" style={{ width: "100%" }} />)}
                </Form.Item>
                <Form.Item colon={false} labelAlign="left" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="邮件通知联络人">
                  {getFieldDecorator("editDeviceForm.email", { initialValue: true, valuePropName: "checked", rules: [{ required: true }] })(<Checkbox />)}
                </Form.Item>
              </Form>
            </Col>
          </Row>
        </Modal>
        <div className="fixed bottom-0 text-center pb-1" style={{ width: "calc(100% - 200px)", color: "#88a8c5", zIndex: 9999 }}>
          版权所有: 武汉三藏科技有限责任公司
        </div>
      </div>
    );
  })
);
