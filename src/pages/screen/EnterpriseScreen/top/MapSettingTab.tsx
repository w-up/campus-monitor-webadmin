import React from "react";
import {useLocalStore, useObserver} from "mobx-react-lite";
import {Form, Icon} from "antd";
import {WrappedFormUtils} from "antd/lib/form/Form";
import Input from "antd/lib/input";
import Upload from "antd/lib/upload";
import Modal from "antd/lib/modal";
import {UploadFile} from "antd/lib/upload/interface";


export const MapSettingTab = Form.create()(({form}: { form: WrappedFormUtils }) => {
  const {getFieldDecorator} = form;

  const fileList: UploadFile<any>[] = [
    {
      uid: '-1',
      name: 'image.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      size: 1,
      type: "",
    }, {
      uid: '-2',
      name: 'image.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      size: 1,
      type: ""
    }, {
      uid: '-3',
      name: 'image.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      size: 1,
      type: ""
    }, {
      uid: '-4',
      name: 'image.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      size: 1,
      type: ""
    }];

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
    previewImage: '',
    fileList: fileList,
    getBase64: file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
    },
    handleCancel: () => store.previewVisible = false,
    handlePreview: async file => {
      if (!file.url && !file.preview) {
        file.preview = await store.getBase64(file.originFileObj);
      }
      store.previewVisible = true;
      store.previewImage = file.url || file.preview;
    },
    handleChange: ({fileList}) => store.fileList = fileList,
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
        <Form.Item label="俯视角度">
          {getFieldDecorator("type", {initialValue: 1})(
            <Input style={{width: '80%'}}/>
          )}
        </Form.Item>
        <Form.Item label="中心坐标">
          {getFieldDecorator("pmCode", {initialValue: 2})(
            <span>
            <Input style={{width: '45%', marginRight: '5%'}}/>
            <Input style={{width: '45%'}}/>
            </span>
          )}
        </Form.Item>
        <Form.Item label="缩放比例">
          {getFieldDecorator("type", {initialValue: 1})(
            <Input style={{width: '80%'}}/>
          )}
        </Form.Item>
        <Form.Item label="旋转角度">
          {getFieldDecorator("type", {initialValue: 1})(
            <Input style={{width: '80%'}}/>
          )}
        </Form.Item>
        <Form.Item label="3D仿真地图">
          {getFieldDecorator("type", {initialValue: 1})(
            <div className="clearfix">
              <Upload
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                listType="picture-card"
                fileList={store.fileList}
                onPreview={store.handlePreview}
                onChange={store.handleChange}
              >
                {store.fileList.length >= 8 ? null : uploadButton}
              </Upload>
              <Modal visible={store.previewVisible} footer={null} onCancel={store.handleCancel}>
                <img alt="example" style={{width: '100%'}} src={store.previewImage}/>
              </Modal>
            </div>
          )}
        </Form.Item>

      </Form>
    </div>
  ));
});
