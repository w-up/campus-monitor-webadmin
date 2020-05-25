import React, { useEffect } from "react";
import { message, Modal, Checkbox, InputNumber, Tabs, Breadcrumb, Spin, Card, Row, Col, Form, Select, Divider, Button, Table, Radio, DatePicker, Input } from "antd";
import { Link } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useStore } from "../../stores/index";
import { toJS } from "mobx";
import moment from "moment";

const { Option } = Select;

export const AlertManagePage = Form.create()(
  observer(({ form }: any) => {
    const {
      alert: { alertManage },
    } = useStore();

    const { getFieldDecorator, setFieldsValue, getFieldsValue, getFieldValue, validateFields, resetFields } = form;

    const { loading, parkTree, ptList, tableData, factoryList } = alertManage;

    useEffect(() => {
      alertManage.getAllSitesTree();
      alertManage.getList({ current: 1, size: 10, warnType: 1 });
      alertManage.getList({ current: 1, size: 10, warnType: 2 });
      alertManage.getList({ current: 1, size: 10, warnType: 3 });
    }, []);

    // const factoryList: any = [];
    // parkTree.forEach(item => {
    //   item.factorys.forEach(record => {
    //     factoryList.push({
    //       factoryName: `${item.parkName}-${record.factoryName}`,
    //       factoryId: record.factoryId,
    //     });
    //   });
    // });

    let pmCodeList: any = [];
    if (ptList.length) {
      const index = getFieldValue("warnType") - 1;
      pmCodeList = ptList[index] ? ptList[index].pms : [];
    }

    const changeTab = (index) => {
      setFieldsValue({
        warnType: Number(index),
      });

      setTimeout(() => {
        setFieldsValue({
          factoryIds: [],
          pmList: [],
          mins: '',
          status: '',
          timeRange: '',
        });
      }, 500);

    };

    const doSubmit = (e) => {
      e.preventDefault();
      validateFields((err, values) => {
        if (err) {
          return;
        }

        alertManage.getList(values);
      });
    };

    const onPmSelectAll = (e) => {
      const { checked } = e.target;
      if (checked) {
        setFieldsValue({
          pmList: pmCodeList.map((item) => item.pmCode),
        });
      } else {
        setFieldsValue({
          pmList: [],
        });
      }
    };

    const onFactorySelectAll = (e) => {
      const { checked } = e.target;
      if (checked) {
        setFieldsValue({
          factoryIds: factoryList.map((item) => item.id),
        });
      } else {
        setFieldsValue({
          factoryIds: [],
        });
      }
    };

    const allPmChecked = getFieldValue("pmList") && getFieldValue("pmList").length > 0 && getFieldValue("pmList").length === pmCodeList.length;
    const allFactoryChecked = getFieldValue("factoryIds") && getFieldValue("factoryIds").length > 0 && getFieldValue("factoryIds").length === factoryList.length;

    const columns: any = [
      [
        {
          title: "告警对象",
          dataIndex: "warnObj",
          key: "warnObj",
          width: 150,
          // fixed: "left",
        },
        {
          title: "告警时间",
          dataIndex: "warnTime",
          key: "warnTime",
          width: 200,
          render: (val) => moment(val).format("YYYY-MM-DD HH:mm:ss"),
        },
        {
          title: "监测类型",
          dataIndex: "jcType",
          key: "jcType",
          width: 100,
        },
        {
          title: "站点名称",
          dataIndex: "siteName",
          key: "siteName",
          width: 100,
        },
        {
          title: "告警项目",
          dataIndex: "pmName",
          key: "pmName",
          width: 100,
        },
        {
          title: "告警等级",
          dataIndex: "warnLevel",
          key: "warnLevel",
          width: 80,
          render: (val) => ["", "中度", "重度", "严重"][val],
        },
        {
          title: "超限值",
          dataIndex: "warnLimit",
          key: "warnLimit",
          width: 100,
        },
        {
          title: "平均浓度",
          dataIndex: "pmValue",
          key: "pmValue",
          width: 200,
          render: (val, record) => `${val} ${record.pmUnit}`,
        },
        {
          title: "累计时长",
          dataIndex: "mins",
          key: "mins",
          width: 100,
          render: (val) => `${val}分钟`,
        },
        {
          title: "风向",
          dataIndex: "windDirection",
          key: "windDirection",
          width: 80,
        },
        {
          title: "风速",
          dataIndex: "windSpeed",
          key: "windSpeed",
          width: 100,
        },
        {
          title: "状态",
          dataIndex: "status",
          key: "status",
          width: 80,
          render: (val) => (val === 0 ? "未处理" : "已处理"),
        },
        {
          title: "操作",
          dataIndex: "",
          key: "",
          width: 80,
          render: (val, record) => {
            if (record.status === 1) {
              return "";
            }
            return (
              <a
                onClick={() => {
                  Modal.confirm({
                    title: "处理确认",
                    content: `确定处理这条告警吗？`,
                    maskClosable: true,
                    async onOk() {
                      try {
                        await alertManage.handleWarn({ warnType: 1, warnId: record.id });
                        message.success("处理成功");
                        alertManage.getList({ warnType: 1 });
                      } catch {
                        message.error("处理失败");
                      }
                    },
                  });
                }}
              >
                处理
              </a>
            );
          },
        },
      ],
      [
        {
          title: "告警对象",
          dataIndex: "warnObj",
          key: "warnObj",
          width: 150,
          // fixed: "left",
        },
        {
          title: "告警时间",
          dataIndex: "warnTime",
          key: "warnTime",
          width: 200,
          render: (val) => moment(val).format("YYYY-MM-DD HH:mm:ss"),
        },
        {
          title: "监测类型",
          dataIndex: "jcType",
          key: "jcType",
          width: 100,
        },
        {
          title: "站点名称",
          dataIndex: "siteName",
          key: "siteName",
          width: 100,
        },
        {
          title: "告警项目",
          dataIndex: "pmName",
          key: "pmName",
          width: 100,
        },
        {
          title: "告警等级",
          dataIndex: "warnLevel",
          key: "warnLevel",
          width: 80,
          render: (val) => ["", "中度", "重度", "严重"][val],
        },
        {
          title: "超限值",
          dataIndex: "warnLimit",
          key: "warnLimit",
          width: 100,
        },
        {
          title: "平均浓度",
          dataIndex: "pmValue",
          key: "pmValue",
          width: 200,
          render: (val, record) => `${val} ${record.pmUnit}`,
        },
        {
          title: "累计时长",
          dataIndex: "mins",
          key: "mins",
          width: 100,
          render: (val) => `${val}分钟`,
        },
        {
          title: "状态",
          dataIndex: "status",
          key: "status",
          width: 80,
          render: (val) => (val === 0 ? "未处理" : "已处理"),
        },
        {
          title: "操作",
          dataIndex: "",
          key: "",
          width: 80,
          render: (val, record) => {
            if (record.status === 1) {
              return "";
            }
            return (
              <a
                onClick={() => {
                  Modal.confirm({
                    title: "处理确认",
                    content: `确定处理这条告警吗？`,
                    maskClosable: true,
                    async onOk() {
                      try {
                        await alertManage.handleWarn({ warnType: 2, warnId: record.id });
                        message.success("处理成功");
                        alertManage.getList({ warnType: 2 });
                      } catch {
                        message.error("处理失败");
                      }
                    },
                  });
                }}
              >
                处理
              </a>
            );
          },
        },
      ],
      [
        {
          title: "告警对象",
          dataIndex: "warnObj",
          key: "warnObj",
          width: 150,
          // fixed: "left",
        },
        {
          title: "告警时间",
          dataIndex: "warnTime",
          key: "warnTime",
          width: 200,
          render: (val) => moment(val).format("YYYY-MM-DD HH:mm:ss"),
        },
        {
          title: "监测类型",
          dataIndex: "jcType",
          key: "jcType",
          width: 100,
        },
        {
          title: "站点名称",
          dataIndex: "siteName",
          key: "siteName",
          width: 100,
        },
        {
          title: "告警项目",
          dataIndex: "warnItem",
          key: "warnItem",
          width: 100,
        },
        {
          title: "设备名称",
          dataIndex: "deviceName",
          key: "deviceName",
          width: 100,
        },
        {
          title: "累计时长",
          dataIndex: "mins",
          key: "mins",
          width: 100,
          render: (val) => `${val}分钟`,
        },
        {
          title: "状态",
          dataIndex: "status",
          key: "status",
          width: 80,
          render: (val) => (val === 0 ? "未处理" : "已处理"),
        },
        {
          title: "操作",
          dataIndex: "",
          key: "",
          width: 80,
          render: (val, record) => {
            if (record.status === 1) {
              return "";
            }
            return (
              <a
                onClick={() => {
                  Modal.confirm({
                    title: "处理确认",
                    content: `确定处理这条告警吗？`,
                    maskClosable: true,
                    async onOk() {
                      try {
                        await alertManage.handleWarn({ warnType: 3, warnId: record.id });
                        message.success("处理成功");
                        alertManage.getList({ warnType: 3 });
                      } catch {
                        message.error("处理失败");
                      }
                    },
                  });
                }}
              >
                处理
              </a>
            );
          },
        },
      ],
    ];

    const pagination: any = [
      {
        current: tableData[0].query.current,
        pageSize: tableData[0].query.pageSize,
        total: tableData[0].total,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total) => {
          return "共 " + total + " 条记录";
        },
        onChange: (page, pageSize) => alertManage.paginationChange(0, page, pageSize),
        onShowSizeChange: (page, pageSize) => alertManage.paginationChange(0, page, pageSize),
      },
      {
        current: tableData[1].query.current,
        pageSize: tableData[1].query.pageSize,
        total: tableData[1].total,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total) => {
          return "共 " + total + " 条记录";
        },
        onChange: (page, pageSize) => alertManage.paginationChange(1, page, pageSize),
        onShowSizeChange: (page, pageSize) => alertManage.paginationChange(1, page, pageSize),
      },
      {
        current: tableData[2].query.current,
        pageSize: tableData[2].query.pageSize,
        total: tableData[2].total,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total) => {
          return "共 " + total + " 条记录";
        },
        onChange: (page, pageSize) => alertManage.paginationChange(2, page, pageSize),
        onShowSizeChange: (page, pageSize) => alertManage.paginationChange(2, page, pageSize),
      },
    ];

    return (
      <div className="alertPage">
        <div className="fixed bottom-0 text-center pb-1" style={{ width: "calc(100% - 200px)", color: "#88a8c5", zIndex: 9999 }}>
          版权所有: 武汉三藏科技有限责任公司
        </div>
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
                  {getFieldDecorator("current", { initialValue: 1, rules: [{ required: false }] })(<Input hidden />)}
                  <Divider orientation="left">监测对象</Divider>
                  <Checkbox style={{ fontSize: "10px" }} checked={allFactoryChecked} onChange={onFactorySelectAll}>
                    全选
                  </Checkbox>

                  <Form.Item colon={false} labelAlign="left" labelCol={{ span: 0 }} wrapperCol={{ span: 24 }} label="">
                    {getFieldDecorator("factoryIds", { initialValue: factoryList && factoryList.map((v) => v.id), rules: [{ required: false }] })(
                      <Checkbox.Group style={{ width: "100%" }}>
                        <Row gutter={4}>
                          {factoryList.map((item) => (
                            <Col span={12} key={item.id}>
                              <Checkbox style={{ fontSize: "10px" }} value={item.id}>
                                {item.factoryName}
                              </Checkbox>
                            </Col>
                          ))}
                        </Row>
                      </Checkbox.Group>
                    )}
                  </Form.Item>

                  {getFieldDecorator("warnType", { initialValue: 1, rules: [{ required: false }] })(
                    <Select style={{ display: "none" }} size="small">
                      <Option value={1}>废气</Option>
                      <Option value={2}>污水</Option>
                      <Option value={3}>设备</Option>
                    </Select>
                  )}

                  {!!pmCodeList.length && (
                    <Row>
                      <Divider orientation="left">监测因子</Divider>
                      <Checkbox style={{ fontSize: "10px" }} checked={allPmChecked} onChange={onPmSelectAll}>
                        全选
                      </Checkbox>
                      <Form.Item colon={false} labelAlign="left" labelCol={{ span: 0 }} wrapperCol={{ span: 24 }} label="">
                        {getFieldDecorator("pmList", { initialValue: pmCodeList && pmCodeList.map((v) => v.pmCode), rules: [{ required: false }] })(
                          <Checkbox.Group style={{ width: "100%" }}>
                            <Row>
                              {pmCodeList.map((item) => (
                                <Col span={8} key={item.pmCode}>
                                  <Checkbox style={{ fontSize: "10px" }} value={item.pmCode}>
                                    {item.pmName}
                                  </Checkbox>
                                </Col>
                              ))}
                            </Row>
                          </Checkbox.Group>
                        )}
                      </Form.Item>
                    </Row>
                  )}

                  <Form.Item colon={false} labelAlign="left" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} label="累计时长超过">
                    {getFieldDecorator("mins", { initialValue: "", rules: [{ required: false }] })(<InputNumber placeholder="单位分钟" style={{ width: "100%" }} size="small" />)}
                  </Form.Item>

                  <Form.Item colon={false} labelAlign="left" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="状态">
                    {getFieldDecorator("status", { initialValue: "", rules: [{ required: false }] })(
                      <Select placeholder="请选择" size="small">
                        <Option value="">全部</Option>
                        <Option value={0}>未处理</Option>
                        <Option value={1}>已处理</Option>
                      </Select>
                    )}
                  </Form.Item>

                  <Divider orientation="left">起止时间</Divider>

                  <Form.Item colon={false} labelAlign="left" labelCol={{ span: 0 }} wrapperCol={{ span: 24 }} label="">
                    {getFieldDecorator("timeRange", { initialValue: "", rules: [{ required: false }] })(<DatePicker.RangePicker size="small" allowClear={false} />)}
                  </Form.Item>

                  <Button type="primary" htmlType="submit" block>
                    查询
                  </Button>
                </Form>
              </Card>
            </Col>
            <Col span={18}>
              <Card size="small" title="数据列表">
                <Tabs animated size="small" type="card" defaultActiveKey="1" onChange={changeTab}>
                  <Tabs.TabPane tab="废气超标告警" key="1">
                    <Table size="small" scroll={{ x: 800 }} bordered pagination={pagination[0]} columns={columns[0]} dataSource={toJS(tableData[0].dataSource)} />
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="污水超标告警" key="2">
                    <Table size="small" scroll={{ x: 800 }} bordered pagination={pagination[1]} columns={columns[1]} dataSource={toJS(tableData[1].dataSource)} />
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="设备离线告警" key="3">
                    <Table size="small" scroll={{ x: 800 }} bordered pagination={pagination[2]} columns={columns[2]} dataSource={toJS(tableData[2].dataSource)} />
                  </Tabs.TabPane>
                </Tabs>
              </Card>
            </Col>
          </Row>
        </Spin>
      </div>
    );
  })
);
