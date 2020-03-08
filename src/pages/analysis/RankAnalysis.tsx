import React from "react";
import { useObserver, useLocalStore } from "mobx-react-lite";
import { Row, Col, Card, Tabs, Form, Select, Divider, Button, Radio, DatePicker, Progress, Table } from "antd";
const { TabPane } = Tabs;
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
}

export const RankAnalysisPage = () => {

  const tableData = useLocalStore(() => ({
    columns: [
      {
        title: '排名',
        dataIndex: 'rank',
        key: 'rank',
      },
      {
        title: '监测区域',
        dataIndex: 'area',
        key: 'area',
      },
      {
        title: '排放量',
        dataIndex: 'exportNum',
        key: 'exportNum',
      },
      {
        title: '贡献',
        dataIndex: 'contribution',
        key: 'contribution',
      }
    ],
    dataSource: [
      {
        id: 0,
        rank: '1',
        area: 'A化工',
        exportNum: '30',
        contribution: '19%'
      }
    ]
  }))
  return useObserver(() => <div>
   <Row>
    <Col span={6}>
      <Card title="监测数据统计排名">
      <Form {...formItemLayout}>
          <Form.Item label="统计区域">
            <Select placeholder="请选择" size="small">
              <Option value="china">China</Option>
              <Option value="usa">U.S.A</Option>
            </Select>
          </Form.Item>
          <Form.Item label="监测类型">
            <Select placeholder="请选择" size="small">
              <Option value="china">China</Option>
              <Option value="usa">U.S.A</Option>
            </Select>
          </Form.Item>
          <Form.Item label="监测因子">
            <Select placeholder="请选择" size="small">
              <Option value="china">China</Option>
              <Option value="usa">U.S.A</Option>
            </Select>
          </Form.Item>
          <Divider orientation="left">时间</Divider>
          <Form.Item label="统计周期">
            <Radio.Group size="small">
              <Radio.Button value="year">年</Radio.Button>
              <Radio.Button value="month">月</Radio.Button>
              <Radio.Button value="day">日</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="起始时间">
            <DatePicker />
          </Form.Item>
          <Form.Item label="终止时间">
            <DatePicker />
          </Form.Item>
          <Divider orientation="left">排名方式</Divider>
          <Form.Item>
            <Radio.Group>
              <Radio value={1}>前十</Radio>
              <Radio value={2}>后十</Radio>
              <Radio value={3}>全部</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
        <Button type="primary" block>开始统计</Button>
      </Card>
    </Col>
    <Col span={18}>
      <Card>
        <Tabs type="card">
          <TabPane tab="企业排名" key="1">
            <div style={{border: "1px solid #e2e8f0", width: 430, padding: "10px 20px"}}>
              <div>区域TVOCs排放量</div>
              <div>2019-10-24</div>
              <div style={{display: 'flex', flexDirection: "row"}}>
                <div style={{width: 60}}>A化工</div>
                <div style={{flex: 1}}><Progress percent={30} showInfo={false} /></div>
              </div>
              <div style={{display: 'flex', flexDirection: "row"}}>
                <div style={{width: 60}}>B化工</div>
                <div style={{flex: 1}}><Progress percent={50} showInfo={false} /></div>
              </div>
              <div style={{display: 'flex', flexDirection: "row"}}>
                <div style={{width: 60}}>AA化工</div>
                <div style={{flex: 1}}><Progress percent={70} showInfo={false} /></div>
              </div>
              <div style={{display: 'flex', flexDirection: "row"}}>
                <div style={{width: 60}}>BD化工</div>
                <div style={{flex: 1}}><Progress percent={100} showInfo={false} /></div>
              </div>
              <div style={{display: 'flex', flexDirection: "row"}}>
                <div style={{width: 60}}>BD化工</div>
                <div style={{flex: 1}}><Progress percent={50} showInfo={false} /></div>
              </div>
            </div>
            <div style={{marginTop: 20}}>
              <Table bordered columns={tableData.columns} dataSource={tableData.dataSource}></Table>
            </div>
          </TabPane>
          <TabPane tab="站点排名" key="2">
            Content of Tab Pane 2
          </TabPane>
        </Tabs>
      </Card>
    </Col>
   </Row>
  </div>);
};
