import React from "react";
import { useObserver, useLocalStore } from "mobx-react-lite";
import { Card, Form, Button, Input, Select, Table, Badge, Divider, Breadcrumb, Alert } from 'antd'
import { RouteChildrenProps } from "react-router";
import { Link } from "react-router-dom";
import api from 'services/park'
const {getParkList} = api
const { Option } = Select;
type Props = RouteChildrenProps<{}>

const dataSource = [
  {
    key: '1',
    id: 'TradeCode21',
    desc: '这是一段描述，关于这个应用的描述',
    name: '园区1',
    status: '正常',
    createTime: '2019-02-21',
  },
  {
    key: '2',
    id: 'TradeCode21',
    desc: '这是一段描述，关于这个应用的描述',
    name: '园区1',
    status: '正常',
    createTime: '2019-02-21',
  },
  {
    key: '3',
    id: 'TradeCode21',
    desc: '这是一段描述，关于这个应用的描述',
    name: '园区1',
    status: '正常',
    createTime: '2019-02-21',
  },
  {
    key: '4',
    id: 'TradeCode21',
    desc: '这是一段描述，关于这个应用的描述',
    name: '园区1',
    status: '正常',
    createTime: '2019-02-21',
  },
]

export class ParkPage extends React.Component {
  state = {
    query: {
      parkName: '',
      current: 1,
      pageSize: 20
    },
    total: 100,
    selectedRowKeys: []
  };
  handleChange = (e) => {
    this.setState({query: {...this.state.query, parkName: e.target.value}})
  }
  handleSubmit = (e) => {
    e.preventDefault();
    console.log(this.state)
  };
  handleReset = () => {
    this.setState({query: {parkName:'', current: 1, pageSize: 20}})
  }
  onSelectChange = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  };
  editPark = (record) => {
    console.log(record)
  };
  deletePark = (record) => {
    console.log(record)
  }
  getParkList = async () => {
    const res = await getParkList(this.state.query)
  }
  componentDidMount() {
    this.getParkList()
  }
  selectMsg = (num: number) => {
    return (
    <div>已选择 <a>{num}</a> 项 <a onClick={this.resetSelectedRowKeys}>清空</a></div>
    )
  }
  resetSelectedRowKeys = () => {
    this.setState({selectedRowKeys: []})
  }
  paginationChange = (page, pageSize) => {
    this.setState({
      query: {
        ...this.state.query,
        current: page,
        pageSize
      }
    })
    console.log(page, pageSize)
  }
  render() {
    const {query, selectedRowKeys, total} = this.state
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    },
    pagination = {
      current: query.current,
      pageSize: query.pageSize,
      total,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total) => {
        return '共 '+total+' 条记录'
      },
      onChange: this.paginationChange
    };
    const columns = [
      {
        title: '园区编号',
        dataIndex: 'id',
      },
      {
        title: '园区名称',
        dataIndex: 'name',
      },
      {
        title: '描述',
        dataIndex: 'desc',
      },
      {
        title: '园区范围',
        render: () => {
          return <a>查看</a>
        }
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        sorter: (a, b) => a.createTime - b.createTime,
      },
      {
        title: '操作',
        dataIndex: 'action',
        render: (text:any, record:any) => (
          <span>
            <a onClick={() => this.deletePark(record)}>删除</a>
            <Divider type="vertical" />
            <a onClick={() => this.editPark(record)}>修改</a>
          </span>
        )
      }
    ];
    return (
      <div>
        <div style={{minHeight: 50, background: "#fff", marginBottom: 20, border: "1px solid #e8e8e8", borderLeft: 0, borderRight: 0, padding: "20px"}}>
          <Breadcrumb>
            <Breadcrumb.Item>基础信息</Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to="base/park">园区管理</Link>
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <Card>
          <div>
            <Form layout="inline" onSubmit={this.handleSubmit}>
            <Form.Item label="园区名称">
            <Input placeholder="请输入" value={query.parkName} onChange={this.handleChange} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 5}} onClick={this.handleReset}>
                重置
              </Button>
            </Form.Item>
          </Form>
          </div>

          <div style={{marginTop: 20, marginBottom: 10}}>
            <Button type="primary"><Link to="add-park">新建</Link></Button>
            <Button  style={{ marginLeft: 5, marginRight: 5 }}>批量删除</Button>
          </div>
          <div style={{marginTop: 20, marginBottom: 10}}>
            <Alert message={this.selectMsg(selectedRowKeys.length)} type="info" showIcon />
          </div>
          <div>
            <Table rowSelection={rowSelection} columns={columns} dataSource={dataSource} pagination={pagination} />
          </div>
        </Card>
      </div>
    )
  }
}