import React from "react";
import { useObserver, useLocalStore } from "mobx-react-lite";
import { Card, Form, Button, Input, Select, Table, Badge, Divider, Breadcrumb, Modal, Tree } from 'antd'
import { RouteChildrenProps } from "react-router";
import { EditableTable } from './MyEditableTable'

const EditableFormTable = Form.create()(EditableTable);

const { TreeNode } = Tree;
type Props = RouteChildrenProps<{}>


export const SystemConfigration = (props: Props) => {

  const isShowEle = useLocalStore(() => ({
    isShowModal: false
  }))

  const configAuthorization = () => {
    console.log('aaa')
  }

  const cancelConfig = () => {
    isShowEle.isShowModal = false
  }


 return useObserver(() => 
 <div>
    <div style={{minHeight: 50, background: "#fff", marginBottom: 20, border: "1px solid #e8e8e8", borderLeft: 0, borderRight: 0, padding: "20px"}}>
      <Breadcrumb>
        <Breadcrumb.Item>系统参数配置</Breadcrumb.Item>
      </Breadcrumb>
    </div>
    <Card>
      <div>
        <Form layout="inline" onSubmit={()=> console.log('aa')}>
        <Form.Item label="参数名">
        <Input placeholder="请输入"
        />
        </Form.Item>
        
        <Form.Item>
          <Button type="primary" htmlType="submit">
            查询
          </Button>
          <Button style={{ marginLeft: 5}}>
            重置
          </Button>
        </Form.Item>
      </Form>
      </div>

      <div style={{marginTop: 20, marginBottom: 10}}>
        <Button type="primary" onClick={()=> props.history.push('addOrEditRole')}>新建</Button>
        <Button  style={{ marginLeft: 5, marginRight: 5 }}>批量删除</Button>
      </div>

      <div>
        <EditableFormTable></EditableFormTable>
      </div>
    </Card>;
    <div>
      <Modal
          title="权限配置"
          visible={isShowEle.isShowModal}
          onOk={() => configAuthorization}
          onCancel={() => cancelConfig()}
        >
        <div>
          <Tree
            checkable
            defaultExpandedKeys={['0-0-0', '0-0-1']}
            defaultSelectedKeys={['0-0-0', '0-0-1']}
            defaultCheckedKeys={['0-0-0', '0-0-1']}
          >
            <TreeNode title="parent 1" key="0-0">
              <TreeNode title="parent 1-0" key="0-0-0">
                <TreeNode title="leaf" key="0-0-0-0" />
                <TreeNode title="leaf" key="0-0-0-1" />
              </TreeNode>
              <TreeNode title="parent 1-1" key="0-0-1">
                <TreeNode title={<span style={{ color: '#1890ff' }}>sss</span>} key="0-0-1-0" />
              </TreeNode>
            </TreeNode>
          </Tree>
        </div>
      </Modal>
    </div>
  </div>);
};
