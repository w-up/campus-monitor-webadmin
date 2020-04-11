import React from "react";
import {useLocalStore, useObserver} from "mobx-react-lite";
import {Form, Icon, Button} from "antd";
import {WrappedFormUtils} from "antd/lib/form/Form";
import Input from "antd/lib/input";
import Upload from "antd/lib/upload";
import Modal from "antd/lib/modal";
import {useStore} from "stores";
import {Scrollbars} from "react-custom-scrollbars";
import {utils} from "../../../../utils/index";

export const MapSettingTab = Form.create()(({form}: { form: WrappedFormUtils }) => {
  const {getFieldDecorator} = form;
  const {
    screen: {enterpriseScreenMap}
  } = useStore();

  const store = useLocalStore(() => ({
    formItemLayout: {
      labelCol: {
        span: 8
      },
      wrapperCol: {
        span: 16
      }
    },
    previewVisible: false,
    previewImage: "",
    getBase64: file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
    },
    handleCancel: () => (store.previewVisible = false),
    handlePreview: async file => {
      if (!file.url && !file.preview) {
        file.preview = await store.getBase64(file.originFileObj);
      }
      store.previewVisible = true;
      store.previewImage = file.url || file.preview;
    },
    handleChange: async ({file}) => {
      const formData = new FormData();
      formData.append("pic", file);
      console.log(file);
      enterpriseScreenMap.curMapConfig.pic = formData;
      const base64 = await store.getBase64(file);
      //@ts-ignore
      enterpriseScreenMap.curMapConfig.picUrl = base64;
    },
    beforeUpload: file => {
      return false;
    },
    handleSubmit: e => {
      e.preventDefault();
      form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          console.log("Received values of form: ", values);
        }
      });
    }
  }));
  const uploadButton = (
    <div>
      <Icon type="plus"/>
      <div className="ant-upload-text">Upload</div>
    </div>
  );

  return useObserver(() => (
    <div className="">
      <Form {...store.formItemLayout} onSubmit={store.handleSubmit}>
        <Scrollbars style={{height: 320}}>
          <Form.Item label="俯视角度">
            <Input type="number" value={enterpriseScreenMap.curMapConfig.highAngle}
                   onChange={e => (enterpriseScreenMap.curMapConfig.highAngle = Number(e.target.value))}
                   style={{width: "80%"}}/>
          </Form.Item>
          <div>
            <Form.Item label="中心坐标">
              <span>
                <Input
                  type="number"
                  value={enterpriseScreenMap.curMapConfig.longitude}
                  onChange={e => (enterpriseScreenMap.curMapConfig.longitude = Number(e.target.value))}
                  style={{width: "45%", marginRight: "5%"}}
                />
                <Input type="number" value={enterpriseScreenMap.curMapConfig.latitude}
                       onChange={e => (enterpriseScreenMap.curMapConfig.latitude = Number(e.target.value))}
                       style={{width: "45%"}}/>
              </span>
            </Form.Item>
          </div>
          <Form.Item label="缩放比例">
            <Input type="number" value={enterpriseScreenMap.curMapConfig.zoom}
                   onChange={e => (enterpriseScreenMap.curMapConfig.zoom = Number(e.target.value))}
                   style={{width: "80%"}}/>
          </Form.Item>
          <Form.Item label="旋转角度">
            <Input
              type="number"
              value={enterpriseScreenMap.curMapConfig.rotationAngle}
              onChange={e => (enterpriseScreenMap.curMapConfig.rotationAngle = Number(e.target.value))}
              style={{width: "80%"}}
            />
          </Form.Item>
          <Form.Item label="3D仿真地图">
            {getFieldDecorator("type", {initialValue: 1})(
              <div className="clearfix relative">
                <Upload listType="picture-card" showUploadList={false} beforeUpload={store.beforeUpload}
                        onPreview={store.handlePreview} onChange={store.handleChange}>
                  {enterpriseScreenMap.curMapConfig.picUrl ?
                    <img src={utils.img.getImageUrl(enterpriseScreenMap.curMapConfig.picUrl)} alt="avatar"
                         style={{width: "100%"}}/> : uploadButton}
                </Upload>
                {enterpriseScreenMap.curMapConfig.picUrl &&
                <img onClick={enterpriseScreenMap.delMapConfig} className="cursor-pointer" style={{width: 20, position: "absolute", top: -10, left: 70}} src="/images/map_delete@2x.png"/>}
                <Modal visible={store.previewVisible} footer={null} onCancel={store.handleCancel}>
                  <img alt="example" style={{width: "100%"}} src={store.previewImage}/>
                </Modal>
              </div>
            )}
          </Form.Item>
        </Scrollbars>
        <div className="setting-box-footer text-center mt-4">
          <Button type="primary" size="default" onClick={enterpriseScreenMap.saveMapConfig}>
            确定
          </Button>
          <Button className="ml-4" type="default" size="default" onClick={e => enterpriseScreenMap.toggleBox()}>
            取消
          </Button>
        </div>
      </Form>
    </div>
  ));
});
