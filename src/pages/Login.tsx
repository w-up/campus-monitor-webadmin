import React from "react";
import { useObserver } from "mobx-react-lite";
import { Form, Input, Button, Icon, Checkbox } from "antd";
import { FormComponentProps } from 'antd/lib/form'
import api from 'services'
import './login.css'

interface IFormProps extends FormComponentProps {
  username: string,
  password: string
}

class LoginForm extends React.Component<IFormProps, {}>  {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        const {username, password} = values
        api.login({username, password}).then(res => {
          console.log(res)
        })
      }
    });
  };
  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    return (
      <div className='login_container boxCenter'>
        <div className='main boxCenter'>
          <div className='box1 boxCenter'>
            <div className='box2 boxCenter'>
              <div className='box_left boxCenter'>
                <div className='title'>
                  工业园区监测平台
                  <span>v1.0</span>
                </div>
                <img src={require('../assets/login/565467@2x.png')} className="logoImg"/>
              </div>
              <div className='box_right boxCenter'>
                <div className='welcome'>欢迎登录！</div>
                <Form onSubmit={this.handleSubmit} className="login-form">
                  <Form.Item>
                    {getFieldDecorator('username', {
                      rules: [{ required: true, message: '请输入账户名称!' }],
                    })(
                      <Input
                        prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        placeholder="账户名称"
                      />,
                    )}
                  </Form.Item>
                  <Form.Item>
                    {getFieldDecorator('password', {
                      rules: [{ required: true, message: '请输入密码!' }],
                    })(
                      <Input
                        prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        type="password"
                        placeholder="密码"
                      />,
                    )}
                  </Form.Item>
                  <Form.Item>
                    {getFieldDecorator('remember', {
                      valuePropName: 'checked',
                      initialValue: true,
                    })(<Checkbox>记住密码</Checkbox>)}
                    {getFieldDecorator('forget', {
                      valuePropName: 'checked',
                      initialValue: false,
                    })(<Checkbox className="login-form-forgot">忘记密码</Checkbox>)}
                    <a className='recontact' style={{visibility:getFieldValue('forget')?'visible':'hidden'}}><Icon type="exclamation-circle" />请重新联系管理员修改密码！</a>
                    <Button htmlType="submit" className="login-form-button">登录</Button>
                  </Form.Item>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
const Login = Form.create<any>()(LoginForm)

export class LoginPage extends React.Component {
  render() {
    return <Login />
  }
}