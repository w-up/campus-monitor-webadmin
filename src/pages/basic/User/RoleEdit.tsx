import React, { useEffect } from "react";
import { useObserver, useLocalStore, observer } from "mobx-react-lite";
import { Spin, Card, Form, Input, Button, Breadcrumb, Tree, message } from "antd";
import { Link, useLocation, useHistory } from "react-router-dom";
import TextArea from "antd/lib/input/TextArea";
import { useStore } from "../../../stores/index";
import { toJS } from 'mobx';

const { TreeNode } = Tree;

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

export const RoleEdit = Form.create()(observer(({ form }: any) => {

  const { state = {} }: any = useLocation();
  const history = useHistory();

  const {
    base: { roleEdit }
  } = useStore();

  const { getFieldDecorator, setFieldsValue, getFieldsValue, getFieldValue, validateFields } = form;

  const { loading, perms } = roleEdit;
  
  useEffect(() => {
    roleEdit.getAllPerms();
  }, []);


  const doSubmit = e => {
    e.preventDefault();

    validateFields(async (err, values) => {
      if (err) {
        return;
      }

      roleEdit.loading = true;
      try {
        values.permIds = values.permIds.checked;
        await roleEdit.doSaveRole(values);
        message.success('操作成功');
        history.replace("/user/rolelist");
      } catch {

      }
      roleEdit.loading = false;
    })

  }

  const { id, code, name, desc, perms: initialPerms = [] } = state.perm || {};

  const initialPermsIds: any = [];
  const flattern = arr => {
    arr.forEach((item: any) => {
      initialPermsIds.push(item.id);
      if (item.children && item.children.length > 0) {
        flattern(item.children);
      }
    });
  }

  flattern(initialPerms);

  return (
    <Spin spinning={loading}>
      <div style={{height: 100, background: "#fff", marginBottom: 20, border: "1px solid #e8e8e8", borderLeft: 0, borderRight: 0, padding: "20px"}}>
        <Breadcrumb>
          <Breadcrumb.Item>基础信息</Breadcrumb.Item>
          <Breadcrumb.Item>
            <a href="rolelist">角色管理</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <a>{state.perm ? '编辑角色' : '新增角色'}</a>
          </Breadcrumb.Item>
        </Breadcrumb>
      <div style={{margin: 10, marginLeft: 0, fontWeight: "bold", fontSize: 20}}>{state.perm ? '编辑角色' : '新增角色'}</div>
      </div>
      <Card>
        <Form {...formItemLayout} onSubmit={doSubmit}>
          {getFieldDecorator("id", { initialValue: id, rules: [{ required: false }] })(
            <Input hidden placeholder="请输入ID" />
          )}

          <Form.Item label="角色代码">
            {getFieldDecorator("code", { initialValue: code, rules: [{ required: true, message: '请输入角色代码' }] })(
              <Input disabled={!!id} placeholder="请输入角色代码" />
            )}
          </Form.Item>

          <Form.Item label="角色名称">
            {getFieldDecorator("name", { initialValue: name, rules: [{ required: true, message: '请输入角色名称' }] })(
              <Input placeholder="请输入角色名称" />
            )}
          </Form.Item>

          <Form.Item label="角色描述">
            {getFieldDecorator("desc", { initialValue: desc, rules: [{ required: false, message: '请输入角色描述' }] })(
              <TextArea rows={4} placeholder='请输入角色描述' />
            )}
          </Form.Item>

          <Form.Item label="权限配置">
            {getFieldDecorator("permIds", {
              valuePropName: 'checkedKeys',
              trigger: 'onCheck',
              initialValue: initialPermsIds,
              rules: [{ required: true, message: '请选择权限配置' }],
            })(
              <Tree
                checkable
                onCheck={(checkedKeys, e) => {
                  // debugger
                }}
                checkStrictly
                showLine={true}
                showIcon={true}
                treeData={toJS(perms)}
              />
            )}
          </Form.Item>
          
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">保存</Button>
            <Button style={{marginLeft: 5, marginRight: 5}} onClick={() => history.goBack()} >取消</Button>
          </Form.Item>
        </Form>
      </Card>
    </Spin>
  )
}));