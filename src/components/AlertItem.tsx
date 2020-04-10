import React from "react";
import { useObserver, useLocalStore } from "mobx-react-lite";
import { Card, Row, Col, Button } from "antd";
import { AlarmInfo } from "../type";

export const AlertItem = ({ item, onClick }: { item: AlarmInfo; onClick?: Function }) => {
  return useObserver(() => (
    <Card className="w-full text-white" bordered={false} style={{ background: "#23283E", marginTop: 20 }}>
      <Row className="alertCardRow">
        <Col span={8}>告警对象:</Col>
        <Col className="text-right" span={12} offset={4}>
          {item.siteName}
        </Col>
      </Row>
      <Row className="alertCardRow">
        <Col span={8}>监测类型:</Col>
        <Col className="text-right" span={12} offset={4}>
          {item.monitorType}
        </Col>
      </Row>
      <Row className="alertCardRow">
        <Col span={8}>站点名称:</Col>
        <Col className="text-right" span={12} offset={4}>
          {item.siteName}
        </Col>
      </Row>
      <Row className="alertCardRow">
        <Col span={8}>告警项目:</Col>
        <Col className="text-right" span={12} offset={4}>
          {item.warnName}
        </Col>
      </Row>
      <Row className="alertCardRow">
        <Col span={8}>告警等级:</Col>
        <Col className="text-right" span={12} offset={4}>
          {item.warnLevel}
        </Col>
      </Row>
      <Row className="alertCardRow">
        <Col span={8}>告警时间:</Col>
        <Col className="text-right" span={16}>
          {item.warnTime}
        </Col>
      </Row>
      <Row className="alertCardRow">
        <Col span={8}>持续时间:</Col>
        <Col className="text-right" span={12} offset={4}>
          {item.totalTime}
        </Col>
      </Row>
      <Row className="alertCardRow">
        <Col span={8}>平均浓度:</Col>
        <Col className="text-right" span={12} offset={4}>
          {item.pmValue || "-"}
        </Col>
      </Row>
      <Row className="alertCardRow">
        <Col span={8}>状态:</Col>
        <Col className="text-right" span={12} offset={4} style={{ color: "#EC034A" }}>
          未处理
        </Col>
      </Row>
      <Row className="mt-4">
        <Col className="text-right" span={8} offset={16}>
          <Button type="primary" onClick={() => onClick && onClick(item)}>
            处理
          </Button>
        </Col>
      </Row>
    </Card>
  ));
};
