import React from "react";
import { useObserver, useLocalStore } from "mobx-react-lite";
import { useEffect } from "react";
import api from "services";
import {Button, Icon} from "antd";
import Card from "antd/lib/card";
import {Col, Row} from "antd/lib/grid";
import {useStore} from "../../stores";

export const MonitorAlert = () => {
  const { mapMonitor } = useStore();

  useEffect(() => {
    mapMonitor.loadAlarms();
  }, []);

  return useObserver(() => <div className="text-white px-4 pb-4">
    <div className="text-lg text-white mb-4 flex items-center">
      <Icon type="caret-right" theme="filled" className="primary-text-color" />
      <span className="ml-2">告警信息</span>
    </div>

    {mapMonitor.alarms.map((item) => {
      // @ts-ignore
      return (
        <Card className="w-full" bordered={false} style={{background:"#23283E",marginTop:20}}>
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
            <Col className="text-right" span={12} offset={4} style={{color:"#EC034A"}}>
              未处理
            </Col>
          </Row>
          <Row className="mt-4">
            <Col className="text-right" span={8} offset={16}>
              <Button type="primary" onClick={() => mapMonitor.doConfirmAlarmInfoById(item.id)}>
                处理
              </Button>
            </Col>
          </Row>

        </Card>
      );
    })}


  </div>);
};
