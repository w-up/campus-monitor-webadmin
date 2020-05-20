import React from "react";
import { useObserver, useLocalStore } from "mobx-react-lite";
import { Card, Row, Col, Button } from "antd";
import { AlarmInfo } from "../type";
import { useStore } from "../stores/index";

export const AlertItem = ({ item, onUpdate }: { item: AlarmInfo; onUpdate?: Function }) => {
  const { mapMonitor } = useStore();
  return useObserver(() => (
    <Card className="w-full text-white" bordered={false} style={{ background: "#2E3549", marginTop: 20, color: "white" }}>
      {item.warnTarget && (
        <Row className="alertCardRow border-b py-2" style={{ borderColor: "#383F52" }}>
          <Col span={6}>告警对象:</Col>
          <Col className="text-left" span={14} offset={4}>
            {item.warnTarget}
          </Col>
        </Row>
      )}
      {item.monitorType && <Row className="alertCardRow border-b py-2" style={{ borderColor: "#383F52" }}>
        <Col span={6}>监测类型:</Col>
        <Col className="text-left" span={14} offset={4}>
          {item.monitorType}
        </Col>
      </Row>}
      {item.siteName && <Row className="alertCardRow border-b py-2" style={{ borderColor: "#383F52" }}>
        <Col span={6}>站点名称:</Col>
        <Col className="text-left" span={14} offset={4}>
          {item.siteName}
        </Col>
      </Row>}
     {item.warnName && <Row className="alertCardRow border-b py-2" style={{ borderColor: "#383F52" }}>
        <Col span={6}>告警项目:</Col>
        <Col className="text-left" span={14} offset={4}>
          {item.warnName}
        </Col>
      </Row>}
      {item.deviceName && <Row className="alertCardRow border-b py-2" style={{ borderColor: "#383F52" }}>
        <Col span={6}>设备名称:</Col>
        <Col className="text-left" span={14} offset={4}>
          {item.deviceName}
        </Col>
      </Row>}
      {item.warnTime && <Row className="alertCardRow border-b py-2" style={{ borderColor: "#383F52" }}>
        <Col span={6}>告警时间:</Col>
        <Col className="text-left" span={14} offset={4}>
          {item.warnTime}
        </Col>
      </Row>}
      {item.totalTime && <Row className="alertCardRow border-b py-2" style={{ borderColor: "#383F52" }}>
        <Col span={6}>持续时间:</Col>
        <Col className="text-left" span={14} offset={4}>
          {item.totalTime}
        </Col>
      </Row>}
      {item.pmValue  && <Row className="alertCardRow border-b py-2" style={{ borderColor: "#383F52" }}>
        <Col span={6}>平均浓度:</Col>
        <Col className="text-left" span={14} offset={4}>
          {item.pmValue || "-"}
        </Col>
      </Row>}
      <Row className="alertCardRow border-b py-2" style={{ borderColor: "#383F52", lineHeight: "32px" }}>
        <Col span={6}>状态:</Col>
        <Col className="text-left" span={6} offset={4} style={{ color: "#EC034A" }}>
          未处理
        </Col>
        <Col className="text-left" span={6} offset={2}>
          <Button
            type="primary"
            style={{ backgroundColor: "#EC044B", borderColor: "#EC044B" }}
            onClick={() => {
              mapMonitor.doConfirmAlarmInfoById(item.id);
              onUpdate && onUpdate();
            }}
          >
            处理
          </Button>
        </Col>
      </Row>
    </Card>
  ));
};
