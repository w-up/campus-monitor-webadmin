import React, { useEffect, useState } from "react";
import { useObserver, useLocalStore, observer } from "mobx-react-lite";
import { Row, Col, Spin, Card, Form, Button, Input, Select, Table, Badge, Divider, Breadcrumb, Modal, Tree } from 'antd'
import { RouteChildrenProps } from "react-router";
import { EditableTable } from './MyEditableTable'
import { useStore } from "../../../stores/index";
import { toJS } from 'mobx';

export const SystemConfigration = Form.create()(observer((props: any) => {

  const {
    systemConfig
  } = useStore();

  const { getFieldDecorator, setFieldsValue, getFieldsValue, getFieldValue, validateFields } = props.form;

  const {
    loading, query, dataSource,
    handleSearchChange, paginationChange, handleSearchReset, total, saveParam,
  } = systemConfig;

  const handleSearch = e => {
    e.preventDefault();
    systemConfig.getSysParamList();
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


  useEffect(() => {
    systemConfig.getSysParamList();
  }, []);

  const [ editableParamCode, setEditableParamCode ] = useState('');

  const doSubmit = (e) => {
    e.preventDefault();
    validateFields(async (err, values) => {
      if (err) {
        return;
      }
      await saveParam(values);
      setEditableParamCode('');
    })
  }


  return (
  <Spin spinning={loading}>
    <div style={{minHeight: 50, background: "#fff", marginBottom: 20, border: "1px solid #e8e8e8", borderLeft: 0, borderRight: 0, padding: "20px"}}>
      <Breadcrumb>
        <Breadcrumb.Item>系统参数配置</Breadcrumb.Item>
      </Breadcrumb>
    </div>
    <Card size="small">
      <Row>
        <Col span={16}>
          <Form layout="inline" onSubmit={handleSearch}>
            <Form.Item label="参数代码">
              <Input placeholder="请输入" value={query.paramName} onChange={handleSearchChange} />
            </Form.Item>
            
            <Form.Item>
              <Button type="primary" htmlType="submit">查询</Button>
              <Button style={{ marginLeft: 5}} onClick={handleSearchReset}>重置</Button>
            </Form.Item>
          </Form>
        </Col>
        {/* <Col span={8} style={{ textAlign: 'right' }}>
          <Button type="primary" onClick={()=> props.history.push('addOrEditRole')}>新建</Button>
          <Button  style={{ marginLeft: 5, marginRight: 5 }}>批量删除</Button>
        </Col> */}
      </Row>

      <Divider />

      <Row>
        <Form onSubmit={doSubmit}>
          <Table rowKey="id" size="small" bordered pagination={pagination} dataSource={toJS(dataSource)}>
            <Table.Column
              title="参数代码"
              dataIndex="paramCode"
              key="paramCode"
              width={200}
            />
            <Table.Column
              title="参数说明"
              dataIndex="paramIntro"
              key="paramIntro"
              width={400}
            />
            <Table.Column
              title="参数值"
              dataIndex="paramValue"
              key="paramValue"
              width={100}
              render={(text, record: any, index) => {
                if (record.paramCode === editableParamCode) {
                  return (
                    <Row>
                      {getFieldDecorator("paramCode", { initialValue: record.paramCode, rules: [{ required: true }] })(
                        <Input hidden placeholder='请输入描述' />
                      )}
                      {getFieldDecorator("paramValue", { initialValue: text, rules: [{ required: true }] })(
                        <Input placeholder='请输入描述' />
                      )}
                    </Row>
                  );
                } else {
                  return text;
                }
                
              }}
            />
            <Table.Column
              title="操作"
              width={100}
              render={(__, record: any, index) => {
                if (record.paramCode === editableParamCode) {
                  return <Button size="small" type="primary" htmlType="submit">保存</Button>
                } else {
                  return <a onClick={() => setEditableParamCode(record.paramCode)}>编辑</a>
                }
              }}
            />
          </Table>
        </Form>
      </Row>
    </Card>
  </Spin>
 );
}));