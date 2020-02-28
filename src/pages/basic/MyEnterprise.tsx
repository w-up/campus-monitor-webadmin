import React from "react";
import { useObserver, useLocalStore } from "mobx-react-lite";
import { Card, Row, Col, Tree, Descriptions, Button, Table, Badge, Divider } from "antd";
import Search from "antd/lib/input/Search";

export const MyEnterprisePage = () => {

  const treeData = [
    {
      title: 'parent 1',
      key: '0-0',
      children: [
        {
          title: 'parent 1-0',
          key: '0-0-0',
          children: [
            { title: 'leaf', key: '0-0-0-0' },
            { title: 'leaf', key: '0-0-0-1' },
            { title: 'leaf', key: '0-0-0-2' },
          ],
        },
        {
          title: 'parent 1-1',
          key: '0-0-1',
          children: [{ title: 'leaf', key: '0-0-1-0' }],
        },
        {
          title: 'parent 1-2',
          key: '0-0-2',
          children: [
            { title: 'leaf', key: '0-0-2-0' },
            {
              title: 'leaf',
              key: '0-0-2-1',
            },
          ],
        },
      ],
    },
  ]
  const showLine = true
  const showIcon = false
  const columns = useLocalStore(() => ([
    {
      title: '厂区名称',
      dataIndex: 'name',
    },
    {
      title: '地址',
      dataIndex: 'address',
    },
    {
      title: '所属园区',
      dataIndex: 'belongs',
    },
    {
      title: '联络人',
      dataIndex: 'lialison',
    },
    {
      title: '厂区范围',
      dataIndex: 'area',
    },
    {
      title: '操作',
      dataIndex: 'action',
      render: (text:any, record:any) => (
        <span>
          <a>编辑</a>
          <Divider type="vertical" />
          <a>删除</a>
        </span>
      ),
    }
  ]))
  const data = useLocalStore(() => ([
    {
      key: '1',
      id: 'TradeCode21',
      name: 'A化工XX厂',
      address: '上海市杨浦区XXXX街道1001号',
      belongs: '园区1',
      lialison: "陈玉",
      area: '2356.89 396547.98'
    },
    {
      key: '2',
      id: 'TradeCode21',
      name: 'A化工XX厂',
      address: '上海市杨浦区XXXX街道1001号',
      belongs: '园区1',
      lialison: "陈玉",
      area: '2356.89 396547.98'
    },
    {
      key: '3',
      id: 'TradeCode21',
      name: 'A化工XX厂',
      address: '上海市杨浦区XXXX街道1001号',
      belongs: '园区1',
      lialison: "陈玉",
      area: '2356.89 396547.98'
    },
    {
      id: 'TradeCode21',
      name: 'A化工XX厂',
      address: '上海市杨浦区XXXX街道1001号',
      belongs: '园区1',
      lialison: "陈玉",
      area: '2356.89 396547.98'
    },
  ]))
  const rowSelection = useLocalStore(() => ({
    onChange: (selectedRowKeys:any, selectedRows:any) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: (record:any) => ({
      disabled: record.name === 'Disabled User', // Column configuration not to be checked
      name: record.name,
    }),
  }))
  return useObserver(() => <div>
    <Row>
      <Col span={18} push={6}>
        <Card title="企业名称">
          <Descriptions title="工商基本" bordered>
            <Descriptions.Item label="法人代表" span={1.5}>王XX</Descriptions.Item>
            <Descriptions.Item label="行业" span={1.5}>制造业</Descriptions.Item>
            <Descriptions.Item label="注册资本" span={1.5}>12021万元 </Descriptions.Item>
            <Descriptions.Item label="注册日期" span={1.5}>2018-04-24</Descriptions.Item>
            <Descriptions.Item label="公司性质" span={1.5}>有限公司 </Descriptions.Item>
            <Descriptions.Item label="经营期限" span={1.5}>2018-04-24 至 2032-12-11</Descriptions.Item>
            <Descriptions.Item label="所在地" span={3}>
              上海市外滩19号
            </Descriptions.Item>
            <Descriptions.Item label="经营范围" span={3}>
              Data disk type: MongoDB
              <br />
              Database version: 3.4
              <br />
              Package: dds.mongo.mid
              <br />
              Storage space: 10 GB
              <br />
              Replication factor: 3
              <br />
              Region: East China 1<br />
            </Descriptions.Item>
            
          </Descriptions>
            <Row  justify="end" style={{marginTop: 20,marginBottom: 20}}>
              <Col span={4}>厂区信息</Col>
              <Col span={20} style={{textAlign: "right"}}>
                <Button style={{marginRight: 5}} shape="round">删除</Button>
                <Button shape="round" type="primary">添加厂区</Button>
              </Col>
            </Row>
            <div>
              <Table rowSelection={rowSelection} columns={columns} dataSource={data} />
            </div>
        </Card>
      </Col>
      <Col span={6} pull={18}>
        <Card  style={{width: 300, marginRight: 20}} title="企业信息">
          <div>
            <Search
              placeholder="请输入关键词"
              onSearch={value => console.log(value)}
              style={{ width: 200 }}
            />
          </div>
          <div>
          <Tree
            showLine={showLine}
            showIcon={showIcon}
            defaultExpandedKeys={['0-0-0']}
            onSelect={()=> {console.log('aa')}}
            treeData={treeData}
          />
          </div>
        </Card>
      </Col>
    </Row>
    <Row>
      
    </Row>
    
  </div>);
};
