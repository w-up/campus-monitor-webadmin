import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../../stores/index";
import { Link } from "react-router-dom";

import { Checkbox, Breadcrumb, Spin, Card, Row, Col, Form, Select, Divider, Button, Table } from "antd";
import { toJS } from "mobx";
const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 12 },
    sm: { span: 12 },
  },
};

export const RuntimeDataPage = Form.create()(
  observer(({ form }: any) => {
    const {
      query: { runTimeData },
    } = useStore();

    useEffect(() => {
      runTimeData.getAllSitesTree();
    }, []);

    const { loading, parkTree, ptList, columns, dataList, query, total, paginationChange } = runTimeData;

    const { getFieldDecorator, setFieldsValue, resetFields, getFieldsValue, getFieldValue, validateFields } = form;

    let factoryList: any = [];
    if (parkTree.length) {
      if (getFieldValue("parkId")) {
        factoryList = parkTree.find((item) => item.parkId === getFieldValue("parkId")).factorys || [];
      } else {
        factoryList = parkTree[0].factories || [];
      }
    }

    let siteList: any = [];
    if (factoryList.length) {
      if (getFieldValue("factoryId")) {
        siteList = factoryList.find((item) => item.factoryId === getFieldValue("factoryId")).sites || [];
      } else {
        siteList = [];
      }
    }

    let pmCodeList: any = [];
    if (ptList.length) {
      if (getFieldValue("ptId")) {
        pmCodeList = ptList.find((item) => item.id === getFieldValue("ptId")).pms || [];
      } else {
        pmCodeList = ptList[0].pms || [];
      }
    }

    const doSubmit = (e) => {
      e.preventDefault();
      validateFields((err, values) => {
        if (err) {
          return;
        }
        runTimeData.queryDatas({ ...values, current: 1 });
      });
    };

    const pagination = {
      current: query.current,
      pageSize: query.pageSize,
      total,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total) => {
        return "共 " + total + " 条记录";
      },
      onChange: paginationChange,
      onShowSizeChange: paginationChange,
    };

    const doResetFields = () => {
      resetFields();
      runTimeData.query = {
        current: 1,
        pageSize: 10,
        size: 10,
      };
      runTimeData.total = 0;
      runTimeData.columns = [];
      runTimeData.dataList = [];
    }

    const onSelectAll = (e) => {
      const { checked } = e.target;
      if (checked) {
        setFieldsValue({
          pmCodeList: pmCodeList.map((item) => item.pmCode),
        });
      } else {
        setFieldsValue({
          pmCodeList: [],
        });
      }
    };

    const allChecked = getFieldValue("pmCodeList") && getFieldValue("pmCodeList").length > 0 && getFieldValue("pmCodeList").length === pmCodeList.length;

    const onSiteSelectAll = (e) => {
      const { checked } = e.target;
      if (checked) {
        setFieldsValue({
          siteIdList: siteList.map((item) => item.siteId),
        });
      } else {
        setFieldsValue({
          siteIdList: [],
        });
      }
    };

    const allSiteChecked = getFieldValue("siteIdList") && getFieldValue("siteIdList").length > 0 && getFieldValue("siteIdList").length === siteList.length;

    return (
      <div className="queryPage">
        <Spin spinning={loading}>
          <div style={{ background: "#fff", marginBottom: 20, border: "1px solid #e8e8e8", borderLeft: 0, borderRight: 0, padding: "20px" }}>
            <Breadcrumb>
              <Breadcrumb.Item>数据查询</Breadcrumb.Item>
              <Breadcrumb.Item>
                <Link to="/query/runtime">实时数据查询</Link>
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <Row gutter={10}>
            <Col span={6}>
              <Form {...formItemLayout} onSubmit={doSubmit}>
                <Card
                  size="small"
                  title="实时数据查询"
                  extra={
                    <Button size="small" onClick={() => doResetFields()}>
                      重置
                    </Button>
                  }
                >
                  <Form.Item colon={false} labelAlign="left" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="选择园区">
                    {getFieldDecorator("parkId", { initialValue: "", rules: [{ required: true, message: '请选择园区' }] })(
                      <Select onChange={() => setFieldsValue({ factoryId: "" })} placeholder="请选择" size="small">
                        {parkTree.map((item) => (
                          <Option key={item.parkId} value={item.parkId}>
                            {item.parkName}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                  <Form.Item colon={false} labelAlign="left" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="监测区域">
                    {getFieldDecorator("factoryId", { initialValue: "", rules: [{ required: true, message: '请选择监测区域' }] })(
                      <Select placeholder="请选择" size="small">
                        {factoryList.map((item) => (
                          <Option key={item.factoryId} value={item.factoryId}>
                            {item.factoryName}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>

                  {getFieldValue("factoryId") && (
                    <Row>
                      <Divider orientation="left"><span style={{ color: 'red' }}>*</span>站点名称</Divider>
                      <Checkbox style={{ fontSize: "10px" }} checked={allSiteChecked} onChange={onSiteSelectAll}>
                        全选
                      </Checkbox>
                      <Form.Item colon={false} labelAlign="left" labelCol={{ span: 0 }} wrapperCol={{ span: 24 }} label="">
                        {getFieldDecorator("siteIdList", { initialValue: [], rules: [{ required: true, message: '请选择站点' }] })(
                          <Checkbox.Group style={{ width: "100%" }}>
                            <Row gutter={4}>
                              {siteList.map((item) => (
                                <Col span={12} key={item.siteId}>
                                  <Checkbox style={{ fontSize: "10px" }} value={item.siteId}>
                                    {item.siteName}
                                  </Checkbox>
                                </Col>
                              ))}
                            </Row>
                          </Checkbox.Group>
                        )}
                      </Form.Item>
                    </Row>
                  )}

                  <Form.Item colon={false} labelAlign="left" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="因子分类">
                    {getFieldDecorator("ptId", { initialValue: "", rules: [{ required: true, message: '请选择因子分类' }] })(
                      <Select placeholder="请选择" size="small">
                        {ptList.map((item) => (
                          <Option key={item.id} value={item.id}>
                            {item.label}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                  {!!getFieldValue("ptId") && (
                    <Row>
                      <Divider orientation="left">监测因子<span style={{ color: 'red' }}>*</span></Divider>
                      <Checkbox style={{ fontSize: "10px" }} checked={allChecked} onChange={onSelectAll}>
                        全选
                      </Checkbox>
                      <Form.Item colon={false} labelAlign="left" labelCol={{ span: 0 }} wrapperCol={{ span: 24 }} label="">
                        {getFieldDecorator("pmCodeList", { initialValue: [], rules: [{ required: true, message: '请选择监测因子' }] })(
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

                  <Button type="primary" htmlType="submit" block>
                    查询
                  </Button>
                </Card>
              </Form>
            </Col>
            <Col span={18}>
              <Card size="small" title="数据列表">
                <Table size="small" bordered scroll={{ x: 900 }} pagination={pagination} columns={toJS(columns)} dataSource={toJS(dataList)} />
              </Card>
            </Col>
          </Row>
        </Spin>
      </div>
    );
  })
);
