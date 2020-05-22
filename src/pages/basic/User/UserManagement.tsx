import React, { useEffect } from "react";
import { useObserver, useLocalStore, observer } from "mobx-react-lite";
import { message, Tag, Alert, Row, Col, Spin, Card, Form, Button, Input, Select, Table, Badge, Divider, Breadcrumb, Modal } from 'antd'
import { RouteChildrenProps } from "react-router";
import { Link, useLocation } from "react-router-dom";
import { toJS } from 'mobx';
import { useStore } from "../../../stores/index";

const { Option } = Select;


export const UserManagementPage = Form.create()(observer((props: any) => {

  const {
    base: { user }
  } = useStore();

  const { getFieldDecorator, setFieldsValue, getFieldsValue, getFieldValue, validateFields } = props.form;

  const {
    userList, loading, query,
    onSelectChange, selectedRowKeys, resetSelectedRowKeys, handleSearchReset, handleSearchStatusChange,
    handleSearchUsernameChange, paginationChange, deleteUser,
  } = user;

  useEffect(() => {
    user.query.userName = '';
    user.query.current = 1;
    user.query.size = 10;
    user.query.pageSize = 10;
    user.getUsers();
  }, []);

  const onBatchDeleteUser = () => {
    const selectedRows = toJS(selectedRowKeys);
    if (selectedRows.length === 0) {
      message.warning("请勾选要删除的用户");
      return;
    }
    const ids = selectedRowKeys;
    Modal.confirm({
      title: "删除确认",
      content: `确定删除这${ids.length}个用户吗？`,
      async onOk() {
        try {
          await deleteUser(ids);
          resetSelectedRowKeys();
        } catch {
          message.error("删除失败");
        }
      },
    });
  };

  const columns = useLocalStore(() => ([
    {
      title: '登录名',
      dataIndex: 'username',
      width: 150,
    },
    {
      title: '用户类型',
      dataIndex: 'type',
      width: 150,
      render: val => {
        return ['园区用户', '企业用户', '超级管理员', '其他'][val];
      },
    },
    {
      title: '所属园区/企业',
      dataIndex: 'porc',
      width: 250,
      render: val => val.name,
    },
    {
      title: '用户名称',
      dataIndex: 'name',
      width: 150,
    },
    {
      title: '角色',
      dataIndex: 'roles',
      width: 100,
      render: (roles) => {
      return roles.map(item => <Tag>{item.name}</Tag>);
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 80,
      render: (val) => {
        if (val === 0) {
          return <Badge status="processing" text="正常" />
        } else {
          return <Badge status="error" text="作废" />
        }
      }
    },
    {
      title: '联系方式',
      dataIndex: 'contact',
      width: 200,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 300,
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: 150,
      render: (text: any, user: any) => {
        if (user.status !== 0) {
          return null;
        }

        return (
          <span>
            <a onClick={() => {
              Modal.confirm({
                title: "删除确认",
                content: `确定删除用户${user.username}吗？`,
                async onOk() {
                    await deleteUser([user.id]);
                    resetSelectedRowKeys();
                }
              });
            }}>删除</a>
            <Divider type="vertical" />
            <Link to={{ pathname: `/user/user-edit/${user.id}`, state: { user } }}>修改</Link>
          </span>
        )
      },
    }
  ]))

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    getCheckboxProps: record => ({
      disabled: record.status !== 0,
      name: record.name,
    }),
  };

  const handleSearch = e => {
    e.preventDefault();
    user.getUsers({ current: 1, pageNo: 1 });
  };

  const selectMsg = (num: number) => {
    return (
      <div>
        已选择 <a>{num}</a> 项 <a onClick={resetSelectedRowKeys}>清空</a>
      </div>
    );
  };

  const handleResetPasswrod = async () => {
    const ids = toJS(selectedRowKeys);
    if (ids.length === 0) {
      message.warning('请勾选要重置密码的用户');
      return;
    }
    Modal.confirm({
      title: '操作确认',
      content: `确定重置这些用户的密码吗？`,
      maskClosable: true,
      async onOk() {
        try {
          await user.resetPwds(ids);
          message.success('处理成功');
          await user.getUsers();
        } catch {
          message.error('处理失败');
        }
      },
    });
  }

  const pagination = {
    current: query.current,
    pageSize: query.pageSize,
    total: query.total,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: total => {
      return "共 " + total + " 条记录";
    },
    onChange: paginationChange,
    onShowSizeChange: paginationChange
  };

  return (
    <div className="userManagePage">
      <Spin spinning={loading}>
        <Row style={{ minHeight: 50, background: "#fff", marginBottom: 20, border: "1px solid #e8e8e8", borderLeft: 0, borderRight: 0, padding: "20px" }}>
          <Breadcrumb>
            <Breadcrumb.Item>基础信息</Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to="user/userlist">用户管理</Link>
            </Breadcrumb.Item>
          </Breadcrumb>
        </Row>
        <Card>
          <Row>
            <Form layout="inline" onSubmit={handleSearch}>
              <Col span={16}>
                <Form.Item label="登录名">
                  <Input value={query.userName} onChange={handleSearchUsernameChange} placeholder="请输入" />
                </Form.Item>
                <Form.Item label="状态">
                  <Select allowClear style={{ width: 150 }} value={query.status} onChange={handleSearchStatusChange}>
                    <Option value={0}>正常</Option>
                    <Option value={1}>作废</Option>
                  </Select>
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">查询</Button>
                  <Button onClick={handleSearchReset} style={{ marginLeft: 5 }}>重置</Button>
                </Form.Item>
              </Col>
              <Col span={8} style={{ textAlign: "right" }}>
                <Form.Item>
                  <Button type="primary" onClick={() => props.history.push('/user/user-edit')}>新建</Button>
                  <Button style={{ marginLeft: 5 }} onClick={onBatchDeleteUser}>批量删除</Button>
                  <Button style={{ marginLeft: 5 }} onClick={handleResetPasswrod}>密码重置</Button>
                </Form.Item>
              </Col>
            </Form>
          </Row>

          {!!selectedRowKeys.length &&
          <Row style={{ marginTop: 20, marginBottom: 10 }}>
            <Alert message={selectMsg(selectedRowKeys.length)} type="info" showIcon />
          </Row>
          }

          <Divider />

          <Row>
            <Table rowKey="id" bordered size="small" pagination={pagination} rowSelection={rowSelection} columns={columns} dataSource={toJS(userList)} />
          </Row>
        </Card>
      </Spin>
      <div className="fixed bottom-0 text-center pb-1" style={{ width:"calc(100% - 200px)", color:"#88a8c5", zIndex:9999}}>版权所有: 武汉三藏科技有限责任公司</div>
    </div>

  )
}));
