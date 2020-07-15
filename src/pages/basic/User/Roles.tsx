import React, { useEffect } from "react";
import { useObserver, useLocalStore, observer } from "mobx-react-lite";
import { message, Alert, Row, Col, Spin, Card, Form, Button, Input, Select, Table, Badge, Divider, Breadcrumb, Modal, Tree } from "antd";
import { Link } from "react-router-dom";
import { useStore } from "../../../stores/index";
import { toJS } from "mobx";

const { Option } = Select;

export const Roles = Form.create()(
  observer((props: any) => {
    const {
      base: { role },
    } = useStore();

    const { loading, roleList, query, resetSelectedRowKeys, selectedRowKeys, handleSearchReset, handleSearchNameChange, handleSearchStatusChange, onSelectChange, paginationChange } = role;

    useEffect(() => {
      role.query.name = "";
      role.query.size = 0;
      role.query.current = 1;
      role.query.status = 0;
      role.getRoleList();
    }, []);

    const onBatchDeleteRole = () => {
      const selectedRows = toJS(selectedRowKeys);
      if (selectedRows.length === 0) {
        message.warning("请勾选要删除的角色");
        return;
      }
      const ids = selectedRowKeys;
      Modal.confirm({
        title: "删除确认",
        content: `确定删除这${ids.length}个角色吗？`,
        async onOk() {
          try {
            await role.deleteRole(ids);
            resetSelectedRowKeys();
          } catch {
            message.error("删除失败");
          }
        },
      });
    };

    const columns = [
      {
        title: "角色代码",
        dataIndex: "code",
        width: 100,
      },
      {
        title: "角色名",
        dataIndex: "name",
        width: 100,
      },
      {
        title: "描述",
        dataIndex: "desc",
        width: 200,
      },
      {
        title: "状态",
        dataIndex: "status",
        width: 100,
        render: (val) => {
          if (val === 0) {
            return <Badge status="processing" text="正常" />;
          } else {
            return <Badge status="error" text="作废" />;
          }
        },
      },
      {
        title: "创建时间",
        dataIndex: "createTime",
        width: 150,
      },
      {
        title: "操作",
        dataIndex: "action",
        width: 100,
        render: (text: any, perm: any) => {
          if (perm.status !== 0) {
            return null;
          }
          return (
            <span>
              <a
                onClick={() => {
                  Modal.confirm({
                    title: "删除确认",
                    content: `确定删除角色${perm.name}吗？`,
                    async onOk() {
                      await role.deleteRole([perm.id]);
                      resetSelectedRowKeys();
                    },
                  });
                }}
              >
                删除
              </a>
              <Divider type="vertical" />
              <Link to={{ pathname: `/user/role-edit/${perm.id}`, state: { perm } }}>修改</Link>
              {/* <Divider type="vertical" /> */}
              {/* <a onClick={() => openModal()}>权限配置</a> */}
            </span>
          );
        },
      },
    ];

    const rowSelection = {
      selectedRowKeys,
      onChange: onSelectChange,
      getCheckboxProps: (record) => ({
        disabled: record.status !== 0,
        name: record.name,
      }),
    };

    const handleSearch = (e) => {
      e.preventDefault();
      role.getRoleList({ current: 1, pageNo: 1 });
    };

    const selectMsg = (num: number) => {
      return (
        <div>
          已选择 <a>{num}</a> 项 <a onClick={resetSelectedRowKeys}>清空</a>
        </div>
      );
    };

    const pagination = {
      current: query.current,
      pageSize: query.pageSize,
      total: query.total,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total) => {
        return "共 " + total + " 条记录";
      },
      onChange: paginationChange,
      onShowSizeChange: paginationChange,
    };

    return (
      <div className="rolesPage">
        <Spin spinning={loading}>
          <Row style={{ minHeight: 50, background: "#fff", marginBottom: 20, border: "1px solid #e8e8e8", borderLeft: 0, borderRight: 0, padding: "20px" }}>
            <Breadcrumb>
              <Breadcrumb.Item>基础信息</Breadcrumb.Item>
              <Breadcrumb.Item>
                <Link to="user/rolelist">角色管理</Link>
              </Breadcrumb.Item>
            </Breadcrumb>
          </Row>
          <Card>
            <Row>
              <Form layout="inline" onSubmit={handleSearch}>
                <Col span={16}>
                  <Form.Item label="角色名">
                    <Input placeholder="请输入" value={query.name} onChange={handleSearchNameChange} />
                  </Form.Item>
                  <Form.Item label="状态">
                    <Select allowClear style={{ width: 150 }} value={query.status} onChange={handleSearchStatusChange}>
                      <Option value={0}>正常</Option>
                      <Option value={1}>作废</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      查询
                    </Button>
                    <Button onClick={handleSearchReset} style={{ marginLeft: 5 }}>
                      重置
                    </Button>
                  </Form.Item>
                </Col>
                <Col span={8} style={{ textAlign: "right" }}>
                  <Form.Item>
                    <Button type="primary" onClick={() => props.history.push("/user/role-edit")}>
                      新建
                    </Button>
                    <Button style={{ marginLeft: 5, marginRight: 5 }} onClick={onBatchDeleteRole}>
                      批量删除
                    </Button>
                  </Form.Item>
                </Col>
              </Form>
            </Row>

            {!!selectedRowKeys.length && (
              <Row style={{ marginTop: 20, marginBottom: 10 }}>
                <Alert message={selectMsg(selectedRowKeys.length)} type="info" showIcon />
              </Row>
            )}

            <Divider />

            <Row>
              <Table bordered size="small" rowKey="id" pagination={pagination} rowSelection={rowSelection} columns={columns} dataSource={toJS(roleList)} />
            </Row>
          </Card>
        </Spin>
        <div className="fixed bottom-0 text-center pb-1" style={{ width: "calc(100% - 200px)", color: "white", zIndex: 9999 }}>
          版权所有: 武汉三藏科技有限责任公司
        </div>
      </div>
    );
  })
);
