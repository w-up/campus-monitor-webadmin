import React, { useEffect, useState } from "react";
import { useObserver, useLocalStore, observer } from "mobx-react-lite";
import { Tag, message, Cascader, Radio, Select, DatePicker, Input, Form, Icon, Spin, Card, Row, Col, Tree, Descriptions, Button, Table, Divider, InputNumber, Modal } from "antd";
import Search from "antd/lib/input/Search";
import { toJS } from "mobx";
import moment from "moment";
import { useStore } from "../../stores/index";
import { DrawBaiduMap } from "../../components/DrawBaiduMap";

const { Option } = Select;
const { Column } = Table;

const deviceListColumns = [
  {
    title: "设备编号",
    dataIndex: "deviceCode",
    width: 300,
  },
  {
    title: "设备名称",
    dataIndex: "deviceName",
    width: 300,
  },
  {
    title: "设备类型",
    dataIndex: "deviceModelName",
    width: 300,
  },
  {
    title: "负责人",
    dataIndex: "chargerName",
    width: 200,
  },
  {
    title: "负责人电话",
    dataIndex: "phone",
    width: 300,
  },
  {
    title: "负责人邮箱",
    dataIndex: "email",
    width: 400,
  },
];

export const MyEnterprisePage = Form.create()(
  observer(({ form }: any) => {
    const {
      base: { myEnterprise },
      map: { drawMap },
      config,
    } = useStore();

    const { getFieldDecorator, setFieldsValue, getFieldsValue, getFieldValue, validateFields, resetFields } = form;

    const {
      loading,
      saveFactory,
      parkList,
      factoryListInfo,
      deleteFactory,
      setFactoryInfo,
      deviceSiteInfo,
      getDeviceSiteList,
      deviceSiteListInfo,
      belongChildTypeList,
      getDeviceSiteInfo,
      addDeviceSite,
      deleteDeviceSite,
      setDeviceSiteInfo,
      deviceListInfo,
      getDeviceList,
      setDeviceInfo,
      deviceInfo,
      getDeviceInfo,
      treeData,
      onTreeItemSelect,
      enterpriseInfo,
      factoryInfo,
      selectedEnterprise,
      doSubmitEnterpriseInfo,
      companyNatureType,
      industryType,
      dataSource,
      query,
      selectedRowKeys,
      total,
      onSelectChange,
      paginationChange,
      deleteEnterprise,
      handleSearchSubmit,
      handleSearchChange,
      handleSearchReset,
      resetSelectedRowKeys,
      addScope,
      setScope,
      updateMapPoints,
      scopeNameInput,
      longitudeInput,
      latitudeInput,
    } = myEnterprise;

    const {
      businessPeriodEnd,
      businessPeriodStart,
      businessScope,
      companyAddress,
      companyName,
      companyNature,
      companyNatureId,
      legalRepresentative,
      profession,
      professionId,
      registerCapital,
      registerDate,
      id,
    } = enterpriseInfo;

    const { factoryName, parkId, factoryAddress, contactPerson, contactPhone, contactPosition, email, scope } = factoryInfo;

    useEffect(() => {
      myEnterprise.getTree();
      myEnterprise.getCompanyNatureType();
      myEnterprise.getIndustryType();
      myEnterprise.getParkList();
      myEnterprise.getFactoryList();
      myEnterprise.getBelongChildType();
    }, []);

    const firstLevelClick = async (selectedKeys) => {
      await onTreeItemSelect(selectedKeys);
      setEnterpriseInfoVisible(true);
      setFactoryInfoVisible(false);
      setDeviceSiteInfoVisible(false);

      setFieldsValue({ enterpriseInfoEditable: false });
      setEditFactoryModalVisible(false);
      setDeviceListModalVisible(false);
      setDeviceInfoVisible(false);
      setDeviceSiteInfo({});
    };

    const secondLevelClick = async (selectedKeys) => {
      let parentKey = "";
      treeData.some((item) => {
        if (item.children.some((v) => v.id === selectedKeys[0])) {
          parentKey = item.id;
          return true;
        }
      });
      await onTreeItemSelect([parentKey]);
      setEnterpriseInfoVisible(false);
      setFactoryInfoVisible(true);
      setDeviceSiteInfoVisible(false);
      setDeviceInfoVisible(false);

      setFieldsValue({ enterpriseInfoEditable: false });
      setDeviceListModalVisible(false);
      let info: any = {};
      factoryListInfo.data.some((v) => {
        if (v.id === selectedKeys[0]) {
          info = { ...v };
          return true;
        }
      });
      setFactoryInfo(info);
      setEditFactoryModalVisible(true);
      setDeviceListModalVisible(true);
      setDeviceSiteInfo({});
      await getDeviceSiteList();
    };

    const thirdLevelClick = async (selectedKeys) => {
      let parentKey = "";
      treeData.some((item) => {
        if (item.children.some((v) => v.children.some((k) => k.id === selectedKeys[0]))) {
          parentKey = item.id;
          return true;
        }
      });
      await onTreeItemSelect([parentKey]);
      setEnterpriseInfoVisible(false);
      setFactoryInfoVisible(false);
      setDeviceSiteInfoVisible(true);
      setDeviceInfoVisible(false);

      setFieldsValue({ enterpriseInfoEditable: false });
      let info: any = {};
      deviceSiteListInfo.data.some((v) => {
        if (v.id === selectedKeys[0]) {
          info = { ...v };
          return true;
        }
      });
      setDeviceSiteInfo(info);
      await getDeviceList();
      console.log(toJS(deviceSiteListInfo));
      console.log(toJS(selectedKeys));
      setEditFactoryModalVisible(false);
      setDeviceListModalVisible(true);
    };

    const forthLevelClick = async (selectedKeys) => {
      let parentKey = "";
      treeData.some((item) => {
        if (item.children.some((v) => v.children.some((k) => k.children.some((l) => l.id === selectedRowKeys[0])))) {
          parentKey = item.id;
          return true;
        }
      });
      await onTreeItemSelect([parentKey]);
      setEnterpriseInfoVisible(false);
      setFactoryInfoVisible(false);
      setDeviceSiteInfoVisible(false);
      setDeviceInfoVisible(true);

      setFieldsValue({ enterpriseInfoEditable: false });

      await getDeviceInfo(selectedKeys[0]);
      setEditFactoryModalVisible(false);
      setDeviceListModalVisible(false);
    };

    const handleTreeItemSelect = async (selectedKeys, e) => {
      if (e.node.props.level === 1) {
        await firstLevelClick(selectedKeys);
      } else if (e.node.props.level === 2) {
        await secondLevelClick(selectedKeys);
      } else if (e.node.props.level === 3) {
        await thirdLevelClick(selectedKeys);
      } else if (e.node.props.level === 4) {
        await forthLevelClick(selectedKeys);
      }
      resetFields();
    };

    const submitEnterpriseInfo = (e) => {
      e.preventDefault();
      validateFields(async (err, values) => {
        if (err) {
          message.error("请补充所有字段信息");
          return;
        }
        values.professionId = values.professionId[1];

        myEnterprise.loading = true;
        try {
          await doSubmitEnterpriseInfo(values);
          setFieldsValue({ enterpriseInfoEditable: false });
        } catch {

        }
        myEnterprise.loading = false;
        
      });
    };

    const [enterpriseInfoVisible, setEnterpriseInfoVisible] = useState(true);
    const [factoryInfoVisible, setFactoryInfoVisible] = useState(false);
    const [deviceSiteInfoVisible, setDeviceSiteInfoVisible] = useState(false);
    const [deviceInfoVisible, setDeviceInfoVisible] = useState(false);

    const [editFactoryModalVisible, setEditFactoryModalVisible] = useState(false);
    const [editDeviceSiteModalVisible, setEditDeviceSiteModalVisible] = useState(false);
    const [deviceListModalVisible, setDeviceListModalVisible] = useState(false);

    const [factoryInfoEditable, setFactoryInfoEditable] = useState(false);

    const enterpriseInfoEditable = getFieldValue("enterpriseInfoEditable");

    const handleFactorySubmit = async (e) => {
      e.preventDefault();
      // if (scope && scope.length === 0) {
      //   message.error('请输入厂区范围');
      //   return;
      // }

      const param = getFieldValue("factoryInfo");
      myEnterprise.loading = true;
      try {
        await saveFactory({ ...param, scope });
        setFactoryInfoEditable(false);
        await myEnterprise.getTree();
        setFactoryInfoVisible(false);
        setEnterpriseInfoVisible(true);
      } catch {

      }
      myEnterprise.loading = false;
      
    };

    let initialProfessionId: any = [];
    if (professionId) {
      industryType.some((k) =>
        k.children.some((v) => {
          if (v.id === professionId) {
            initialProfessionId = [k.id, v.id];
          }
        })
      );
    }

    const doDeleteFactory = (item) => {
      Modal.confirm({
        title: "删除确认",
        content: "确定删除这条记录吗？",
        async onOk() {
          try {
            await deleteFactory([item.id]);
            message.success("删除成功");
            await myEnterprise.getTree();
          } catch {
            message.error("删除失败");
          }
        },
      });
    };

    const handleDeviceSiteSubmit = () => {
      validateFields(["deviceSiteInfo"], async (err, { deviceSiteInfo }) => {
        if (err) {
          return;
        }

        await addDeviceSite(deviceSiteInfo);
        setEditDeviceSiteModalVisible(false);
      });
    };

    const deviceSiteListcolumns = [
      {
        title: "厂区名称",
        dataIndex: "factoryName",
        width: 200,
      },
      {
        title: "站点名称",
        dataIndex: "siteName",
        width: 300,
      },
      {
        title: "因子分类",
        dataIndex: "belongChildType",
        width: 300,
        render: (text: any, record: any, index) => {
          console.log("belongChildTypeList", toJS(belongChildTypeList), text);
          let val = "";
          belongChildTypeList.some((item) => {
            if (item.dictCode === text) {
              val = item.dictName;
              return true;
            }
          });
          return val;
        },
      },
      {
        title: "经度",
        dataIndex: "gpsX",
        width: 200,
      },
      {
        title: "纬度",
        dataIndex: "gpsY",
        width: 200,
      },
      {
        title: "操作",
        width: 100,
        render: (text: any, record: any, index: any) => {
          return (
            <a
              onClick={() => {
                Modal.confirm({
                  title: "删除确认",
                  content: "确定删除这条记录吗？",
                  async onOk() {
                    try {
                      await deleteDeviceSite([record.factorySiteId]);
                      message.success("删除成功");
                    } catch {
                      message.error("删除失败");
                    }
                  },
                });
              }}
            >
              删除
            </a>
          );
        },
      },
    ];

    const columns = [
      {
        title: "厂区名称",
        dataIndex: "factoryName",
        width: 200,
      },
      {
        title: "地址",
        dataIndex: "factoryAddress",
        width: 300,
      },
      {
        title: "所属园区",
        dataIndex: "parkName",
        width: 150,
      },
      {
        title: "联络人",
        dataIndex: "contactPerson",
        width: 100,
      },
      {
        title: "邮箱",
        dataIndex: "email",
        width: 200,
      },
      {
        title: "操作",
        dataIndex: "action",
        width: 200,
        render: (text: any, record: any, index) => (
          <Row style={{ textAlign: "center" }}>
            <a
              onClick={() => {
                setFactoryInfo(record);
                setFactoryInfoVisible(true);
                setEnterpriseInfoVisible(false);
                setDeviceSiteInfoVisible(false);
              }}
            >
              编辑
            </a>
            <Divider type="vertical" />
            <a onClick={() => doDeleteFactory(record)}>删除</a>
          </Row>
        ),
      },
    ];

    const [treeExpandedKeys, setTreeExpandedKeys] = useState([]);

    const onTreeSearch = async (value) => {
      await myEnterprise.getTree(value);
      const expandedKeys: any = [];
      if (value) {
        const filterAdd = (list) =>
          list.forEach((item) => {
            if (item.title.indexOf(value) > -1) {
              expandedKeys.push(item.key);
            }
            item.children && filterAdd(item.children);
          });

        filterAdd(toJS(treeData));
      }

      setTreeExpandedKeys(expandedKeys);
    };

    return (
      <div className="myEnterprisePage">
        <Spin spinning={loading}>
          <Row gutter={10}>
            <Col span={6}>
              <Card bordered title="企业信息">
                <div>
                  <Search placeholder="请输入关键词" onSearch={onTreeSearch} style={{ width: 200 }} allowClear />
                </div>
                <div>
                  <Tree
                    showLine={true}
                    showIcon={false}
                    onSelect={handleTreeItemSelect}
                    onExpand={(keys, e) => {
                      setTreeExpandedKeys(keys as any);
                      handleTreeItemSelect(keys.slice(-1), e);
                    }}
                    filterTreeNode={(node) => {
                      return (treeExpandedKeys as any).includes(node.props.eventKey);
                    }}
                    expandedKeys={treeExpandedKeys}
                    treeData={toJS(treeData)}
                    autoExpandParent={true}
                  />
                </div>
              </Card>
            </Col>
            <Col span={18}>
              {enterpriseInfoVisible && (
                <Card bordered title={<Col>{selectedEnterprise.title}<span style={{ marginLeft: '6px', fontSize: '12px', color: '#999' }}>统一社会信用代码: {selectedEnterprise.companyCode}</span></Col>}>
                  <Form onSubmit={submitEnterpriseInfo}>
                    <Card
                      bordered
                      size="small"
                      title="工商基本信息"
                      extra={
                        enterpriseInfoEditable ? (
                          <Row>
                            <Button icon="save" htmlType="submit" type="primary">
                              保存
                            </Button>
                            <Divider type="vertical" />
                            <Button onClick={() => resetFields()} icon="save">
                              取消
                            </Button>
                          </Row>
                        ) : (
                          <Button icon="edit" onClick={() => setFieldsValue({ enterpriseInfoEditable: true })} type="primary">
                            编辑
                          </Button>
                        )
                      }
                    >
                      {getFieldDecorator("enterpriseInfoEditable", { initialValue: false })(<Input style={{ display: "none" }} />)}
                      {getFieldDecorator("companyId", { initialValue: selectedEnterprise.id, rules: [{ required: false }] })(<Input style={{ display: "none" }} placeholder="" />)}
                      <Descriptions size="small" bordered>
                        <Descriptions.Item label="法人代表" span={1.5}>
                          {getFieldDecorator("legalRepresentative", { initialValue: legalRepresentative, rules: [{ required: true }] })(<Input disabled={!enterpriseInfoEditable} placeholder="" />)}
                        </Descriptions.Item>
                        <Descriptions.Item label="行业" span={1.5}>
                          {getFieldDecorator("professionId", { initialValue: initialProfessionId, rules: [{ required: true }] })(
                            <Cascader fieldNames={{ label: "label", value: "value", children: "children" }} disabled={!enterpriseInfoEditable} placeholder="" options={toJS(industryType)} />
                          )}
                        </Descriptions.Item>
                        <Descriptions.Item label="注册资本" span={1.5}>
                          <Row type="flex" justify="center">
                            <Col span={20}>
                              {getFieldDecorator("registerCapital", { initialValue: registerCapital, rules: [{ required: true }] })(
                                <InputNumber style={{ width: "100%" }} disabled={!enterpriseInfoEditable} placeholder="" />
                              )}
                            </Col>
                            <Col span={4} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                              万
                            </Col>
                          </Row>
                        </Descriptions.Item>
                        <Descriptions.Item label="注册日期" span={1.5}>
                          {getFieldDecorator("registerDate", { initialValue: registerDate && moment(registerDate), rules: [{ required: true }] })(
                            <DatePicker allowClear={false} disabled={!enterpriseInfoEditable} placeholder="" />
                          )}
                        </Descriptions.Item>
                        <Descriptions.Item label="公司性质" span={1.5}>
                          {getFieldDecorator("companyNatureId", { initialValue: companyNatureId, rules: [{ required: true }] })(
                            <Select disabled={!enterpriseInfoEditable} placeholder="">
                              {companyNatureType.map((item) => (
                                <Option value={item.id}>{item.dictName}</Option>
                              ))}
                            </Select>
                          )}
                        </Descriptions.Item>
                        <Descriptions.Item label="经营期限" span={1.5}>
                          <Row type="flex" justify="center" gutter={6}>
                            <Col span={10}>
                              {getFieldDecorator("businessPeriodStart", { initialValue: businessPeriodStart && moment(businessPeriodStart), rules: [{ required: true }] })(
                                <DatePicker allowClear={false} disabled={!enterpriseInfoEditable} placeholder="" />
                              )}
                            </Col>
                            <Col span={4} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                              至
                            </Col>
                            <Col span={10}>
                              {getFieldDecorator("businessPeriodEnd", { initialValue: businessPeriodEnd && moment(businessPeriodEnd), rules: [{ required: false }] })(
                                <DatePicker allowClear={true} disabled={!enterpriseInfoEditable} placeholder="" />
                              )}
                            </Col>
                          </Row>
                        </Descriptions.Item>
                        <Descriptions.Item label="所在地" span={3}>
                          {getFieldDecorator("companyAddress", { initialValue: companyAddress, rules: [{ required: false }] })(<Input disabled={!enterpriseInfoEditable} placeholder="" />)}
                        </Descriptions.Item>
                        <Descriptions.Item label="经营范围" span={3}>
                          {getFieldDecorator("businessScope", { initialValue: businessScope, rules: [{ required: false }] })(<Input.TextArea disabled={!enterpriseInfoEditable} placeholder="" />)}
                        </Descriptions.Item>
                      </Descriptions>
                    </Card>
                  </Form>
                  <Divider />
                  <Card
                    bordered
                    size="small"
                    title="厂区信息"
                    extra={
                      <Row>
                        {/* <Button icon="delete">删除</Button> */}
                        {/* <Divider type="vertical" /> */}
                        <Button
                          icon="file-add"
                          onClick={() => {
                            setFactoryInfoVisible(true);
                            setEnterpriseInfoVisible(false);
                            setDeviceSiteInfoVisible(false);
                            setFactoryInfoEditable(true);
                            setFactoryInfo({});
                          }}
                          type="primary"
                        >
                          添加厂区
                        </Button>
                      </Row>
                    }
                  >
                    <Table size="small" rowKey="key" bordered columns={columns} dataSource={toJS(factoryListInfo.data) || []} />
                  </Card>
                </Card>
              )}

              {factoryInfoVisible && (
                <Form layout="horizontal">
                  <Card
                    bordered
                    title="编辑厂区"
                    extra={
                      factoryInfoEditable ? (
                        <Row>
                          <Button type="primary" onClick={handleFactorySubmit}>
                            保存
                          </Button>
                          <Divider type="vertical" />
                          <Button
                            onClick={() => {
                              setFactoryInfoEditable(false);
                            }}
                          >
                            取消
                          </Button>
                        </Row>
                      ) : (
                        <Row>
                          <Button onClick={() => setFactoryInfoEditable(true)}>编辑</Button>
                        </Row>
                      )
                    }
                  >
                    {getFieldDecorator("factoryInfo.id", { initialValue: factoryInfo.id, rules: [{ required: false }] })(<Input hidden placeholder="请输入厂区ID" />)}
                    {getFieldDecorator("factoryInfo.companyId", { initialValue: selectedEnterprise.id, rules: [{ required: false }] })(<Input hidden placeholder="请输入公司ID" />)}
                    <Card title="厂区信息" bordered size="small">
                      <Descriptions size="small" bordered>
                        <Descriptions.Item label={<Row>厂区名称 <span style={{ color: 'red' }}>*</span></Row>} span={1.5}>
                          {getFieldDecorator("factoryInfo.factoryName", { initialValue: factoryInfo.factoryName, rules: [{ required: true }] })(
                            <Input disabled={!factoryInfoEditable} placeholder="请输入厂区名称" />
                          )}
                        </Descriptions.Item>
                        <Descriptions.Item label={<Row>所属园区 <span style={{ color: 'red' }}>*</span></Row>} span={1.5}>
                          {getFieldDecorator("factoryInfo.parkId", { initialValue: factoryInfo.parkId, rules: [{ required: true }] })(
                            <Select disabled={!factoryInfoEditable} placeholder="请输入所属园区">
                              {parkList.map((item) => (
                                <Option value={item.id}>{item.parkName}</Option>
                              ))}
                            </Select>
                          )}
                        </Descriptions.Item>
                        <Descriptions.Item label={<Row>地址 <span style={{ color: 'red' }}>*</span></Row>} span={1.5}>
                          {getFieldDecorator("factoryInfo.factoryAddress", { initialValue: factoryInfo.factoryAddress, rules: [{ required: false }] })(
                            <Input disabled={!factoryInfoEditable} placeholder="请输入地址" />
                          )}
                        </Descriptions.Item>
                      </Descriptions>
                    </Card>
                    <Divider />
                    <Card title="联络人信息" bordered size="small">
                      <Descriptions size="small" bordered>
                        <Descriptions.Item label="联络人" span={1.5}>
                          {getFieldDecorator("factoryInfo.contactPerson", { initialValue: factoryInfo.contactPerson, rules: [{ required: false }] })(
                            <Input disabled={!factoryInfoEditable} placeholder="请输入联络人" />
                          )}
                        </Descriptions.Item>
                        <Descriptions.Item label="电话" span={1.5}>
                          {getFieldDecorator("factoryInfo.contactPhone", { initialValue: factoryInfo.contactPhone, rules: [{ required: false }] })(
                            <Input disabled={!factoryInfoEditable} placeholder="请输入电话" />
                          )}
                        </Descriptions.Item>
                        <Descriptions.Item label="职位" span={1.5}>
                          {getFieldDecorator("factoryInfo.contactPosition", { initialValue: factoryInfo.contactPosition, rules: [{ required: false }] })(
                            <Input disabled={!factoryInfoEditable} placeholder="请输入职位" />
                          )}
                        </Descriptions.Item>
                        <Descriptions.Item label="邮箱" span={1.5}>
                          {getFieldDecorator("factoryInfo.email", { initialValue: factoryInfo.email, rules: [{ required: false }] })(
                            <Input disabled={!factoryInfoEditable} placeholder="请输入邮箱" />
                          )}
                        </Descriptions.Item>
                      </Descriptions>
                    </Card>
                    <Divider />
                    <Card title={<Row>厂区范围</Row>} bordered size="small">
                      {getFieldDecorator("scopeType", { initialValue: "location", rules: [{ required: false }] })(
                        <Radio.Group disabled={!factoryInfoEditable}>
                          <Radio value="map">地图绘制</Radio>
                          <Radio value="location">输入经纬度</Radio>
                        </Radio.Group>
                      )}
                      <Divider />

                      <Modal
                        title="地图绘制"
                        visible={getFieldValue("scopeType") === "map"}
                        onOk={() => {
                          setFieldsValue({ scopeType: "location" });
                          updateMapPoints();
                        }}
                        onCancel={() => setFieldsValue({ scopeType: "location" })}
                        okText="确认"
                        cancelText="取消"
                        width={800}
                      >
                        <div style={{ width: "100%", height: "400px" }}>
                          <DrawBaiduMap />
                        </div>
                      </Modal>

                      <Table
                        pagination={false}
                        size="small"
                        bordered
                        dataSource={toJS(scope)}
                        footer={(_) => factoryInfoEditable && <Button onClick={addScope} size="small" shape="circle" icon="plus" />}
                      >
                        <Column
                          title="名称"
                          dataIndex="scopeName"
                          key="scopeName"
                          render={(scopeName, _, index) => <Input disabled={!factoryInfoEditable} size="small" onChange={(e) => scopeNameInput(e.target.value, index)} value={scopeName} />}
                        />
                        <Column
                          title="经度"
                          dataIndex="longitude"
                          key="longitude"
                          render={(longitude, _, index) => <Input disabled={!factoryInfoEditable} size="small" onChange={(e) => longitudeInput(e.target.value, index)} value={longitude} />}
                        />
                        <Column
                          title="纬度"
                          dataIndex="latitude"
                          key="latitude"
                          render={(latitude, _, index) => <Input disabled={!factoryInfoEditable} size="small" onChange={(e) => latitudeInput(e.target.value, index)} value={latitude} />}
                        />
                        <Column
                          title="操作"
                          dataIndex="latitude"
                          key="latitude"
                          width={50}
                          render={(latitude, _, index) => {
                            return (
                              <Row type="flex" justify="center">
                                <Button
                                  shape="circle"
                                  icon="minus"
                                  size="small"
                                  disabled={!factoryInfoEditable}
                                  onClick={() => {
                                    factoryInfo.scope = factoryInfo.scope.filter((_, i) => i !== index);
                                  }}
                                />
                              </Row>
                            );
                          }}
                        />
                      </Table>
                    </Card>
                    <Divider />

                    {!!factoryInfo.id && !factoryInfoEditable && (
                      <Card
                        bordered
                        size="small"
                        title="站点信息"
                        extra={
                          <Row>
                            {/* <Button icon="delete">删除</Button> */}
                            {/* <Divider type="vertical" /> */}
                            <Button
                              icon="file-add"
                              onClick={() => {
                                setEditDeviceSiteModalVisible(true);
                                resetFields();
                              }}
                              type="primary"
                            >
                              添加站点
                            </Button>
                          </Row>
                        }
                      >
                        <Table size="small" rowKey="key" bordered columns={deviceSiteListcolumns} dataSource={toJS(deviceSiteListInfo.data) || []} />
                      </Card>
                    )}

                    <Modal title="" visible={editDeviceSiteModalVisible} onOk={handleDeviceSiteSubmit} onCancel={() => setEditDeviceSiteModalVisible(false)} width={800}>
                      {getFieldDecorator("deviceSiteInfo.id", { initialValue: deviceSiteInfo.id, rules: [{ required: false }] })(<Input hidden placeholder="请输入站点ID" />)}
                      <Descriptions title="站点信息" size="small" bordered>
                        <Descriptions.Item label="厂区名称" span={1.5}>
                          {getFieldDecorator("deviceSiteInfo.factoryId", { initialValue: factoryInfo.id, rules: [{ required: false }] })(
                            <Select disabled style={{ width: "100%" }} placeholder="">
                              {factoryListInfo.data.map((item) => (
                                <Option value={item.id}>{item.factoryName}</Option>
                              ))}
                            </Select>
                          )}
                        </Descriptions.Item>
                        <Descriptions.Item label="站点编号" span={1.5}>
                          {getFieldDecorator("deviceSiteInfo.siteCode", { initialValue: deviceSiteInfo.siteCode, rules: [{ required: false }] })(
                            <Input.Search enterButton onSearch={getDeviceSiteInfo} placeholder="请输入站点编号" />
                          )}
                        </Descriptions.Item>
                        <Descriptions.Item label="站点名称" span={1.5}>
                          {getFieldDecorator("deviceSiteInfo.siteName", { initialValue: deviceSiteInfo.siteName, rules: [{ required: false }] })(<Input disabled placeholder="请输入站点名称" />)}
                        </Descriptions.Item>
                        <Descriptions.Item label="因子分类" span={1.5}>
                          {getFieldDecorator("deviceSiteInfo.belongChildType", { initialValue: deviceSiteInfo.belongChildType, rules: [{ required: false }] })(
                            <Select disabled style={{ width: "100%" }} placeholder="请输入因子分类">
                              {belongChildTypeList.map((item) => (
                                <Option value={item.dictCode}>{item.dictName}</Option>
                              ))}
                            </Select>
                          )}
                        </Descriptions.Item>
                        <Descriptions.Item label="经度" span={1.5}>
                          {getFieldDecorator("deviceSiteInfo.gpsX", { initialValue: deviceSiteInfo.gpsX, rules: [{ required: false }] })(<Input disabled placeholder="请输入经度" />)}
                        </Descriptions.Item>
                        <Descriptions.Item label="纬度" span={1.5}>
                          {getFieldDecorator("deviceSiteInfo.gpsY", { initialValue: deviceSiteInfo.gpsY, rules: [{ required: false }] })(<Input disabled placeholder="请输入纬度" />)}
                        </Descriptions.Item>
                      </Descriptions>
                    </Modal>
                  </Card>
                </Form>
              )}

              {deviceSiteInfoVisible && (
                <Row>
                  <Card bordered title={deviceSiteInfo.siteName}>
                    <Descriptions title="" size="small" bordered>
                      <Descriptions.Item label="厂区名称" span={1.5}>
                        {factoryListInfo.data.map((item) => {
                          if (item.factorySiteId === deviceSiteInfo.factoryId) {
                            return item.factoryName;
                          }
                          return null;
                        })}
                      </Descriptions.Item>
                      <Descriptions.Item label="站点名称" span={1.5}>
                        {deviceSiteInfo.siteName}
                      </Descriptions.Item>
                      <Descriptions.Item label="因子分类" span={1.5}>
                        {belongChildTypeList.map((item) => {
                          if (item.dictCode === deviceSiteInfo.belongChildType) {
                            return item.dictName;
                          }
                          return null;
                        })}
                      </Descriptions.Item>
                      <Descriptions.Item label="经度" span={1.5}>
                        {deviceSiteInfo.gpsX}
                      </Descriptions.Item>
                      <Descriptions.Item label="纬度" span={1.5}>
                        {deviceSiteInfo.gpsY}
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>
                  <Divider />
                  <Card bordered title="设备信息">
                    <Table size="small" rowKey="key" bordered columns={deviceListColumns} dataSource={toJS(deviceListInfo.data) || []} />
                  </Card>
                </Row>
              )}

              {deviceInfoVisible && (
                <Row>
                  <Card bordered title={deviceInfo.deviceName}>
                    <Descriptions title="" size="small" bordered>
                      <Descriptions.Item label="设备编号" span={1.5}>
                        {deviceInfo.deviceCode}
                      </Descriptions.Item>
                      <Descriptions.Item label="设备名称" span={1.5}>
                        {deviceInfo.deviceName}
                      </Descriptions.Item>
                      <Descriptions.Item label="出厂日期" span={1.5}>
                        {deviceInfo.productionDate && moment(deviceInfo.productionDate).format("YYYY-MM-DD")}
                      </Descriptions.Item>
                      <Descriptions.Item label="设备特点" span={1.5}>
                        {deviceInfo.features}
                      </Descriptions.Item>
                      <Descriptions.Item label="设备厂商" span={1.5}>
                        {deviceInfo.manufacturerName}
                      </Descriptions.Item>
                      <Descriptions.Item label="设备型号" span={1.5}>
                        {deviceInfo.modelName}
                      </Descriptions.Item>
                      <Descriptions.Item label="监测因子" span={1.5}>
                        {deviceInfo.pmList && deviceInfo.pmList.map((item) => <Tag key={item.pmId}>{item.pmName}</Tag>)}
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>
                </Row>
              )}
            </Col>
          </Row>
        </Spin>
      </div>
    );
  })
);
