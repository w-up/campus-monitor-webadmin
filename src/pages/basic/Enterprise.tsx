import React, { useEffect } from "react";
import { useObserver, useLocalStore, observer } from "mobx-react-lite";
import { RouteComponentProps, Link } from "react-router-dom";
import { toJS } from 'mobx';
import { useStore } from "../../stores/index";
import { message, Modal, Alert, Row, Col, Spin, Badge, Divider, Card, Form, Input, Select, Button, Table, Breadcrumb } from "antd";

export const EnterprisePage = observer(() => {

  const {
    base: { enterprise }
  } = useStore();

  const {
    loading,
    dataSource, query, selectedRowKeys, total, onSelectChange, paginationChange, deleteEnterprise,
    handleSearchSubmit, handleSearchChange, handleSearchReset, resetSelectedRowKeys
  } = enterprise;

  const handleSearch = e => {
    e.preventDefault();
    enterprise.getCompanyList();
  }

  useEffect(() => {
    enterprise.getCompanyList();
  }, []);


  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

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

  const clickDeleteEnterprise = (item) => {
    console.log(item);
    Modal.confirm({
      title: '删除确认',
      content: '确定删除这条记录吗？',
      async onOk() {
        try {
          await deleteEnterprise([ item.id ]);
          message.success('删除成功');
        } catch {
          message.error('删除失败');
        }
      },
    });
  }

  const onBatchDeleteEnterprise = () => {
    console.log(toJS(selectedRowKeys));
    const selectedRows = toJS(selectedRowKeys)
    if (selectedRows.length === 0) {
      return;
    }
    const ids = selectedRows.map(key => toJS(dataSource)[key].id);
    Modal.confirm({
      title: '删除确认',
      content: `确定删除这${ids.length}条记录吗？`,
      async onOk() {
        try {
          await deleteEnterprise(ids);
          message.success('删除成功');
          resetSelectedRowKeys();
        } catch {
          message.error('删除失败');
        }
      },
    });
  }

  const columns = [
    {
      title: '企业名称',
      dataIndex: 'companyName',
      width: 200,
    },
    {
      title: '企业统一社会信用代码',
      dataIndex: 'companyCode',
      width: 250,
    },
    {
      title: '描述',
      dataIndex: 'remark',
      width: 250,
    },
    {
      title: '状态',
      dataIndex: 'companyStatus',
      width: 100,
      render: (val) => {
        if (val === 1) {
          return <Badge status="success" text="正常" />
        } else {
          return <Badge status="warning" text="停用" />
        }
      }
    },
    {
      title: '创建时间',
      width: 200,
      dataIndex: 'createTime',
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: 100,
      render: (_:any, enterprise:any) => (
        <span>
          <a onClick={() => clickDeleteEnterprise(enterprise)}>删除</a>
          <Divider type="vertical" />
          <Link to={{ pathname: `/base/enterprise-edit/${enterprise.id}`, state: { enterprise } }}>修改</Link>
        </span>
      ),
    }
  ];

  const selectMsg = (num: number) => {
    return (
      <div>已选择 <a>{num}</a> 项 <a onClick={resetSelectedRowKeys}>清空</a></div>
    )
  }
  
  const goPage = ()=> {
    console.log('submit click')
  }
  
  return (
    <Spin spinning={loading}>
      <div style={{minHeight: 50, background: "#fff", marginBottom: 20, border: "1px solid #e8e8e8", borderLeft: 0, borderRight: 0, padding: "20px"}}>
        <Breadcrumb>
          <Breadcrumb.Item>基础信息</Breadcrumb.Item>
          <Breadcrumb.Item>
            <a href="">企业管理</a>
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <Card size="small">
        <Row>
          <Col span={16}>
            <Form layout="inline" onSubmit={handleSearch}>
            <Form.Item  label="企业统一社会信用代码">
              <Input placeholder="请输入" value={query.companyCode} onChange={handleSearchChange} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">查询</Button>
              <Button style={{ marginLeft: 5}} onClick={handleSearchReset}>重置</Button>
            </Form.Item>
          </Form>
          </Col>

          <Col span={8} style={{ textAlign: 'right' }}>
            <Button type="primary"><Link to="/base/enterprise-edit">新建</Link></Button>
            <Button onClick={onBatchDeleteEnterprise} style={{ marginLeft: 5, marginRight: 5 }}>批量删除</Button>
          </Col>
        </Row>

        {!!selectedRowKeys.length &&
        <Row style={{ marginTop: 20, marginBottom: 10 }}>
          <Alert message={selectMsg(selectedRowKeys.length)} type="info" showIcon />
        </Row>
        }
        
        <Divider />

        <Row>
          <Table rowKey="id" size="small" bordered rowSelection={rowSelection} columns={columns} dataSource={toJS(dataSource)} pagination={pagination} />
        </Row>
      </Card>
    </Spin>
  );
});