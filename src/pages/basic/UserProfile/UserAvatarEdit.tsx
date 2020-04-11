import React, { useEffect } from "react";
import { observer, useObserver, useLocalStore } from "mobx-react-lite";
import { Breadcrumb, Button, Card, Form, Input, Radio, Select, Spin, Avatar, Upload, Icon } from "antd";
import { useHistory, useLocation, Link } from "react-router-dom";
import { useStore } from "../../../stores";
import { POST } from "../../../utils/request";
import http from "../../../utils/request";

export const UserAvatarEdit = Form.create()(
  observer(({ form }: any) => {
    const { auth } = useStore();
    const store = useLocalStore(() => ({
      previewVisible: false,
      previewImage: "" as any,
      imgFormData: null as any,
      getBase64: (file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
        });
      },
      handleCancel: () => (store.previewVisible = false),
      handlePreview: async (file) => {
        if (!file.url && !file.preview) {
          file.preview = await store.getBase64(file.originFileObj);
        }
        store.previewVisible = true;
        store.previewImage = file.url || file.preview;
      },
      async handleChange({ file }) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("id", auth.user?.id || "");
        this.imgFormData = formData;
        const base64 = await store.getBase64(file);
        this.previewImage = base64;
      },
      beforeUpload: (file) => {
        return false;
      },
      async updateAvatar() {
        const res = await http({
          method: "POST",
          url: "/user/updatePic",
          data: this.imgFormData,
        });
      },
    }));

    const uploadButton = (
      <div style={{ width: 150, height: 150 }} className="flex flex-col justify-center">
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );

    return (
      <div>
        <div style={{ height: 100, background: "#fff", marginBottom: 20, border: "1px solid #e8e8e8", borderLeft: 0, borderRight: 0, padding: "20px" }}>
          <Breadcrumb>
            <Breadcrumb.Item>主页</Breadcrumb.Item>
            <Breadcrumb.Item>
              <a href="userlist">修改资料</a>
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <Card>
          <div className="flex flex justify-around text-center">
            <div>
              <div style={{ width: 150 }}>
                <Upload
                  style={{ width: "150px", height: "150px" }}
                  listType="picture-card"
                  showUploadList={false}
                  beforeUpload={store.beforeUpload}
                  onPreview={store.handlePreview}
                  onChange={store.handleChange}
                >
                  {store.previewImage ? <Avatar shape="square" src={store.previewImage} alt="avatar" size={150} /> : uploadButton}
                </Upload>
                <Upload showUploadList={false} beforeUpload={store.beforeUpload} onPreview={store.handlePreview} onChange={store.handleChange}>
                  <Button type="primary">{store.previewImage ? "重新选择" : "选择头像"}</Button>
                </Upload>
              </div>
            </div>
            <div className="text-center">
              <div>
                <Avatar src={store.previewImage} size={150} icon="user" />
              </div>
              <Button type="primary" className="mt-4" onClick={store.updateAvatar}>
                提交头像
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  })
);
