import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../../stores/index";
import { Link } from "react-router-dom";
import moment from "moment";

import { DatePicker, Checkbox, Breadcrumb, Spin, Card, Row, Col, Form, Select, Divider, Button, Table } from "antd";
import { toJS } from "mobx";
const { Option } = Select;
const { RangePicker } = DatePicker;

export const HistoryDataPage = Form.create()(
  observer(({ form }: any) => {
    const {
      query: { historyData },
    } = useStore();

    useEffect(() => {
      historyData.getAllSitesTree();
    }, []);

    const { loading, parkTree, ptList, columns, dataList, query, total, paginationChange } = historyData;

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
        siteList = factoryList[0].sites || [];
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

    const doResetFields = () => {
      // resetFields();
      setFieldsValue({
        parkId: '',
        factoryId: '',
        ptId: '',
        siteId: '',
        pmCodeList: [],
        timeRange: [],
      });
      historyData.query = {
        current: 1,
        pageSize: 10,
        size: 10,
      };
      historyData.total = 0;
      historyData.columns = [];
      historyData.dataList = [];
    };

    const doSubmit = (e) => {
      e.preventDefault();
      validateFields((err, values) => {
        if (err) {
          return;
        }
        historyData.queryDatas({ ...values, current: 1 });
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

    const allChecked = getFieldValue("pmCodeList") && getFieldValue("pmCodeList").length === pmCodeList.length;

    return (
      <div className="queryPage">
        <Spin spinning={loading}>
          <div style={{ background: "#fff", marginBottom: 20, border: "1px solid #e8e8e8", borderLeft: 0, borderRight: 0, padding: "20px" }}>
            <Breadcrumb>
              <Breadcrumb.Item>数据查询</Breadcrumb.Item>
              <Breadcrumb.Item>
                <Link to="/query/history">历史数据查询</Link>
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <Row gutter={10}>
            <Col span={6}>
              <Form onSubmit={doSubmit}>
                <Card
                  size="small"
                  title="历史数据查询"
                  extra={
                    <Button size="small" onClick={doResetFields}>
                      重置
                    </Button>
                  }
                >
                  <Form.Item colon={false} labelAlign="left" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="选择园区">
                    {getFieldDecorator("parkId", { initialValue: parkTree && parkTree[0] && parkTree[0].parkId, rules: [{ required: true, message: "请选择园区" }] })(
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
                    {getFieldDecorator("factoryId", { initialValue: factoryList && factoryList[0] && factoryList[0].factoryId, rules: [{ required: true, message: "请选择监测区域" }] })(
                      <Select onChange={() => setFieldsValue({ siteId: "" })} placeholder="请选择" size="small">
                        {factoryList.map((item) => (
                          <Option key={item.factoryId} value={item.factoryId}>
                            {item.factoryName}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                  <Form.Item colon={false} labelAlign="left" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="站点名称">
                    {getFieldDecorator("siteId", { initialValue: siteList && siteList[0] && siteList[0].siteId, rules: [{ required: true, message: "请选择站点名称" }] })(
                      <Select placeholder="请选择" size="small">
                        {siteList.map((item) => (
                          <Option key={item.siteId} value={item.siteId}>
                            {item.siteName}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                  <Form.Item colon={false} labelAlign="left" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="监测类型">
                    {getFieldDecorator("ptId", { initialValue: ptList && ptList[0] && ptList[0].id, rules: [{ required: true, message: "请选择监测类型" }] })(
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
                      <Divider orientation="left">
                        <span style={{ color: "red" }}>*</span> 监测因子
                      </Divider>
                      <Checkbox style={{ fontSize: "10px" }} checked={allChecked} onChange={onSelectAll}>
                        全选
                      </Checkbox>
                      <Form.Item colon={false} labelAlign="left" labelCol={{ span: 0 }} wrapperCol={{ span: 24 }} label="">
                        {getFieldDecorator("pmCodeList", { initialValue: pmCodeList && pmCodeList.map((v) => v.pmCode), rules: [{ required: true, message: "请选择监测因子" }] })(
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
                  <Divider orientation="left">
                    <span style={{ color: "red" }}>*</span> 起止时间
                  </Divider>
                  <Form.Item colon={false} labelAlign="left" labelCol={{ span: 0 }} wrapperCol={{ span: 24 }} label="">
                    {getFieldDecorator("timeRange", { initialValue: [moment().subtract(1, "weeks"), moment()], rules: [{ required: true, message: "请选择起止时间" }] })(<RangePicker />)}
                  </Form.Item>

                  <Button type="primary" htmlType="submit" block>
                    查询
                  </Button>
                </Card>
              </Form>
            </Col>
            <Col span={18}>
              <Card
                size="small"
                title="数据列表"
                extra={
                  dataList.length > 0 && (
                    <Button onClick={historyData.exportDatas} size="small">
                      导出
                    </Button>
                  )
                }
              >
                <Table size="small" bordered scroll={{ x: 850 }} pagination={pagination} columns={toJS(columns)} dataSource={toJS(dataList)} />
              </Card>
            </Col>
          </Row>
        </Spin>
        <div className="fixed bottom-0 text-center pb-1" style={{ width: "calc(100% - 200px)", color: "#88a8c5", zIndex: 9999 }}>
          版权所有: 武汉三藏科技有限责任公司
        </div>
      </div>
    );
  })
);
