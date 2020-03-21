import React, { useEffect } from "react";
import { observer, useLocalStore } from "mobx-react-lite";
import { toJS } from "mobx";
import { useStore } from "../../stores/index";
import { Row, Col, Spin, Card, Form, Button, Input, Select, Table, Badge, Divider, Breadcrumb, Alert, Modal, message } from "antd";
import { Link } from "react-router-dom";
import { DrawBaiduMap } from "../../components/DrawBaiduMap";

export const ParkPage = observer(() => {
  const {
    base: { park },
    map: { drawMap }
  } = useStore();

  const { loading, dataSource, query, selectedRowKeys, total, onSelectChange, paginationChange, deletePark, handleSearchSubmit, handleSearchChange, handleSearchReset, resetSelectedRowKeys } = park;

  const store = useLocalStore(() => ({
    showMap: false,

    showDrawMap(data: any) {
      if (!data.scope) return;
      this.showMap = true;
      drawMap
        .init({
          editType: "view"
        })
        .setPathsByScope(data.scope);
    }
  }));

  useEffect(() => {
    park.getParkList();
  }, []);

  console.log("dataSource", toJS(dataSource));

  const handleSearch = e => {
    e.preventDefault();
    park.getParkList();
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange
  };

  const pagination = {
    current: query.current,
    pageSize: query.pageSize,
    total,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: total => {
      return "共 " + total + " 条记录";
    },
    onChange: paginationChange,
    onShowSizeChange: paginationChange
  };

  const clickDeletePark = item => {
    console.log(item);
    Modal.confirm({
      title: "删除确认",
      content: "确定删除这条记录吗？",
      async onOk() {
        try {
          await deletePark([item.id]);
          message.success("删除成功");
        } catch {
          message.error("删除失败");
        }
      }
    });
  };

  const onBatchDeletePark = () => {
    console.log(toJS(selectedRowKeys));
    const selectedRows = toJS(selectedRowKeys);
    if (selectedRows.length === 0) {
      return;
    }
    const ids = selectedRows.map(key => toJS(dataSource)[key].id);
    Modal.confirm({
      title: "删除确认",
      content: `确定删除这${ids.length}条记录吗？`,
      async onOk() {
        try {
          await deletePark(ids);
          message.success("删除成功");
          resetSelectedRowKeys();
        } catch {
          message.error("删除失败");
        }
      }
    });
  };

  const columns = [
    {
      title: "园区编号",
      dataIndex: "parkNo",
      width: 200
    },
    {
      title: "园区名称",
      dataIndex: "parkName",
      width: 200
    },
    {
      title: "描述",
      dataIndex: "remark",
      width: 300
    },
    {
      title: "园区范围",
      width: 100,
      render: (text, record) => {
        return <a onClick={e => store.showDrawMap(record)}>查看</a>;
      }
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      width: 200,
      sorter: (a, b) => a.createTime - b.createTime
    },
    {
      title: "操作",
      dataIndex: "action",
      width: 100,
      render: (_: any, park: any) => {
        return (
          <span>
            <a onClick={() => clickDeletePark(park)}>删除</a>
            <Divider type="vertical" />
            <Link to={{ pathname: `/base/park-edit/${park.id}`, state: { park } }}>修改</Link>
          </span>
        );
      }
    }
  ];

  const selectMsg = (num: number) => {
    return (
      <div>
        已选择 <a>{num}</a> 项 <a onClick={resetSelectedRowKeys}>清空</a>
      </div>
    );
  };

  return (
    <Spin spinning={loading}>
      <Row style={{ minHeight: 50, background: "#fff", marginBottom: 20, border: "1px solid #e8e8e8", borderLeft: 0, borderRight: 0, padding: "20px" }}>
        <Breadcrumb>
          <Breadcrumb.Item>基础信息</Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="base/park">园区管理</Link>
          </Breadcrumb.Item>
        </Breadcrumb>
      </Row>
      <Card size="small">
        <Row>
          <Col span={16}>
            <Form layout="inline" onSubmit={handleSearch}>
              <Form.Item label="园区名称">
                <Input placeholder="请输入" value={query.parkName} onChange={handleSearchChange} />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button style={{ marginLeft: 5 }} onClick={handleSearchReset}>
                  重置
                </Button>
              </Form.Item>
            </Form>
          </Col>

          <Col span={8} style={{ textAlign: "right" }}>
            <Button type="primary">
              <Link to="/base/park-edit">新建</Link>
            </Button>
            <Button onClick={onBatchDeletePark} style={{ marginLeft: 5, marginRight: 5 }}>
              批量删除
            </Button>
          </Col>
        </Row>
        <Row style={{ marginTop: 20, marginBottom: 10 }}>
          <Alert message={selectMsg(selectedRowKeys.length)} type="info" showIcon />
        </Row>
        <Divider />
        <Row>
          <Table bordered size="small" rowSelection={rowSelection} columns={columns} dataSource={toJS(dataSource)} pagination={pagination} />
        </Row>
      </Card>
      <Modal title="地图绘制" visible={store.showMap} onOk={e => (store.showMap = false)} onCancel={e => (store.showMap = false)} width={800}>
        <div style={{ width: "100%", height: "400px" }}>
          <DrawBaiduMap />
        </div>
      </Modal>
    </Spin>
  );
});
