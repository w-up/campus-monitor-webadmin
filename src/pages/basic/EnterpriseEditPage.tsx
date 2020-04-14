import React from "react";
import { useObserver, useLocalStore, observer } from "mobx-react-lite";
import { Spin, Card, Form, Input, Button, Breadcrumb } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { toJS } from 'mobx';
import { Link, useHistory, useLocation, useParams } from "react-router-dom";
import { useStore } from "../../stores/index";

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 10 },
    sm: { span: 10 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

const strlen = (str) => {
  var len = 0;
  for (var i=0; i<str.length; i++) {
   var c = str.charCodeAt(i);
  //单字节加1
   if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {
     len++;
   }
   else {
    len+=2;
   }
  }
  return len;
}

export const EnterpriseEditPage = Form.create()(observer(({ form }: any) => {
  
  const { state = {} }: any = useLocation();

  const { id, companyCode, companyName, remark, companyStatus } = state.enterprise || {};
  const history = useHistory();

  const { getFieldDecorator, setFieldsValue, getFieldsValue, getFieldValue, validateFields } = form;

  const {
    base: { enterpriseEdit },
  } = useStore();

  const {
    onSubmit,
    loading,
  } = enterpriseEdit;

  const doSubmit = (e) => {
    e.preventDefault();
    validateFields(async (err, values) => {
      if (err) {
        return;
      }
      enterpriseEdit.loading = true;
      try {
        await onSubmit(values);
        history.replace("/base/enterprise");
      } catch {}
      enterpriseEdit.loading = false;
    })
  }

  return (
    <Spin spinning={loading}>
      <div style={{ background: "#fff", marginBottom: 20, border: "1px solid #e8e8e8", borderLeft: 0, borderRight: 0, padding: "20px"}}>
        <Breadcrumb>
          <Breadcrumb.Item>基础信息</Breadcrumb.Item>
          <Breadcrumb.Item>
            <a href="enterprise">企业管理</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <a>{state.enterprise ? '编辑企业' : '新增企业'}</a>
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <Card>
        <Form {...formItemLayout} onSubmit={doSubmit}>
          <Form.Item label="企业ID" style={{ display: 'none' }}>
            {getFieldDecorator("id", { initialValue: id, rules: [{ required: false }] })(
              <Input placeholder="请输入企业ID" />
            )}
          </Form.Item>
          <Form.Item label="企业统一社会信用代码">
            {getFieldDecorator("companyCode", { initialValue: companyCode, rules: [
              { required: true, message: '请输入企业统一社会信用代码' },
              { validator: (rule, value, callback) => {
                if (value.match(/[^_IOZSVa-z\W]{2}\d{6}[^_IOZSVa-z\W]{10}/g)) {
                  callback();
                } else {
                  callback('企业统一社会信用代码格式错误');
                }
              } },
            ] })(
              <Input placeholder="请输入企业统一社会信用代码" />
            )}
          </Form.Item>
          <Form.Item label="企业名称">
            {getFieldDecorator("companyName", { initialValue: companyName, rules: [
              { required: true, message: '请输入企业名称' },
              { validator: (rule, value, callback) => {
                if (strlen(value) < 60) {
                  callback();
                } else {
                  callback('企业名称长度超过限制');
                }
              } },
            ] })(
              <Input placeholder="请输入企业名称" />
            )}
          </Form.Item>
          <Form.Item label="企业状态" style={{ display: 'none' }} >
            {getFieldDecorator("companyStatus", { initialValue: 1, rules: [{ required: true, message: '请输入企业状态' }] })(
              <Input placeholder="请输入企业状态" />
            )}
          </Form.Item>
          <Form.Item label="描述" >
            {getFieldDecorator("remark", { initialValue: remark, rules: [
              { required: false },
              { validator: (rule, value, callback) => {
                if (strlen(value) < 200) {
                  callback();
                } else {
                  callback('描述长度超过限制');
                }
              } },
            ] })(
              <TextArea rows={4} placeholder='请输入描述' />
            )}
          </Form.Item>

          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">提交</Button>
            <Button style={{marginLeft: 5, marginRight: 5}} onClick={() => history.goBack()}>取消</Button>
          </Form.Item>
        </Form>
      </Card>
    </Spin>
  )
}));