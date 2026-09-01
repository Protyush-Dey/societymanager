import React, { useState } from 'react'
import { Form, Input, Button, ConfigProvider, message } from 'antd'
import { PhoneOutlined, LockOutlined, HomeOutlined } from '@ant-design/icons'

interface LoginFormValues {
  mobileNumber: string
  password: string
}

const LoginPage: React.FC = () => {
  const [form] = Form.useForm<LoginFormValues>()
  const [loading, setLoading] = useState(false)

  const onFinish = (values: LoginFormValues) => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      message.success(`Logged in successfully for ${values.mobileNumber}`)
    }, 800)
  }

  return (
      <div className="min-h-screen w-full bg-[#f3f3f3] flex items-center justify-center p-4 sm:p-6 font-sans antialiased text-slate-800">
        <div className="w-full max-w-[390px] bg-white sm:p-8 p-6 rounded-2xl sm:shadow-sm sm:border sm:border-slate-100 flex flex-col items-center">
          {/* Brand Logo Icon */}
          <div className="w-12 h-12 bg-[#0058cc] rounded-xl flex items-center justify-center shadow-md shadow-blue-500/20 mb-4 transition-transform hover:scale-105">
            {/* Building/Society Icon */}
            <HomeOutlined />
          </div>

          {/* Heading */}
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            SocietyPro
          </h1>
          <p className="text-[13.5px] text-slate-500 mt-1 mb-8 text-center">
            Sign in to your administration panel
          </p>

          {/* Ant Design Login Form */}
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{ remember: false }}
            requiredMark={false}
            className="w-full"
          >
            {/* Mobile Number Field */}
            <Form.Item
              label={
                <span className="text-[13px] font-semibold text-slate-700">
                  Mobile Number
                </span>
              }
              name="mobileNumber"
              rules={[
                { required: true, message: 'Please enter your mobile number' },
              ]}
              className="mb-4"
            >
              <Input
                prefix={
                  <PhoneOutlined className="text-slate-400 mr-2 text-[14px]" />
                }
                placeholder="Enter your number"
                className="h-10 text-[13.5px] rounded-md"
              />
            </Form.Item>

            {/* Password Field */}
            <Form.Item
              label={
                <span className="text-[13px] font-semibold text-slate-700">
                  Password
                </span>
              }
              name="password"
              rules={[{ required: true, message: 'Please enter your password' }]}
              className="mb-3"
            >
              <Input.Password
                prefix={
                  <LockOutlined className="text-slate-400 mr-2 text-[14px]" />
                }
                placeholder="Enter your password"
                className="h-10 text-[13.5px] rounded-md"
              />
            </Form.Item>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between mb-5">

              <a
                href="#forgot-password"
                onClick={(e) => {
                  e.preventDefault()
                  message.info('Redirecting to password recovery...')
                }}
                className="text-[13px] font-medium text-[#0058cc] hover:text-[#004bb0] hover:underline transition-colors"
              >
                Forgot Password?
              </a>
            </div>

            {/* Submit Button */}
            <Form.Item className="mb-0">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                className="h-10 text-[14px] font-medium rounded-md shadow-sm"
              >
                Login
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
  )
}

export default LoginPage


