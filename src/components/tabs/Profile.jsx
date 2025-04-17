import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { baseUrl } from '../../config';
import { setLoading } from '../../redux/LoaderReducer';
import {
  Card,
  Avatar,
  Button,
  Divider,
  Descriptions,
  Row,
  Col,
  Form,
  Input,
  message,
  Modal,
  Tabs
} from 'antd';
import {
  MailOutlined,
  LockOutlined,
} from '@ant-design/icons';

const { TabPane } = Tabs;

const Profile = () => {
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      dispatch(setLoading(true));
      try {
        const response = await axios.get(`${baseUrl}/api/user/user`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${localStorage.getItem("token")}`,
          }
        });

        if (response.data.success) {
          setUser(response.data.user);
          form.setFieldsValue({
            name: response.data.user.name,
            email: response.data.user.email,
          });
        }
      } catch (error) {
        message.error(error?.response?.data?.message || 'Failed to fetch user');
        console.log("Error fetching user", error);
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchUser();
  }, [form, dispatch]);


  const headers = {
    "Content-Type": "application/json",
    Authorization: `${localStorage.getItem("token")}`,
  };

  const handlePasswordChange = async (values) => {
    dispatch(setLoading(true));
    try {
      const response = await axios.put(
        `${baseUrl}/api/user/update-password`,
        {
          oldPassword: values.currentPassword,
          newPassword: values.newPassword
        },
        { headers }
      );

      if (response.data.success) {
        message.success('Password changed successfully');
        setIsPasswordModalVisible(false);
        passwordForm.resetFields();
      }
    } catch (error) {
      message.error(error?.response?.data?.message || 'Failed to change password');
      console.log("Error changing password", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (!user) {
    return <div className="flex justify-center items-center h-64">Loading user information...</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Row gutter={[24, 24]}>
        <Col xs={24} md={8}>
          <Card className="shadow-md">
            <div className="flex flex-col items-center text-center">
              <Avatar
                size={100}
                style={{ backgroundColor: '#1890ff', fontSize: '2rem' }}
              >
                {getInitials(user.name)}
              </Avatar>
              <h2 className="mt-4 text-xl font-bold">{user.name}</h2>
              <p className="text-gray-500">{user.role === '0' ? 'Admin' : 'User'}</p>

              <Divider />

              <div className="flex flex-col items-start w-full">
                <p className="flex items-center mb-2">
                  <MailOutlined className="mr-2" /> {user.email}
                </p>
              </div>

              <Divider />

              <Button
                type="primary"
                icon={<LockOutlined />}
                onClick={() => setIsPasswordModalVisible(true)}
                className="mt-2"
              >
                Change Password
              </Button>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={16}>
          <Card className="shadow-md">
            <Tabs defaultActiveKey="info">
              <TabPane tab="Profile Information" key="info">
                <Descriptions bordered column={1}>
                  <Descriptions.Item label="Full Name">{user.name}</Descriptions.Item>
                  <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
                  <Descriptions.Item label="Member Since">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                  </Descriptions.Item>
                </Descriptions>
              </TabPane>
              <TabPane tab="Activity" key="activity">
                {user.tasks && user.tasks.length > 0 ? (
                  user.tasks.map(task => (
                    <p key={task._id} className='py-2'>
                      Created a task <span className="text-blue-600 font-semibold">"{task.title}"</span> at{' '}
                      <span className="text-gray-600">{new Date(task.createdAt).toLocaleString()}</span>
                    </p>
                  ))
                ) : (
                  <p>No tasks available</p>
                )}

              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>

      {/* Password Change Modal */}
      <Modal
        title="Change Password"
        open={isPasswordModalVisible}
        onCancel={() => setIsPasswordModalVisible(false)}
        footer={null}
      >
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handlePasswordChange}
        >
          <Form.Item
            name="currentPassword"
            label="Current Password"
            rules={[{ required: true, message: 'Please enter your current password' }]}
          >
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="New Password"
            rules={[
              { required: true, message: 'Please enter your new password' },
              { min: 6, message: 'Password must be at least 6 characters' }
            ]}
          >
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Confirm New Password"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Please confirm your new password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The two passwords do not match'));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>

          <div className="flex justify-end">
            <Button onClick={() => setIsPasswordModalVisible(false)} className="mr-2">
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Change Password
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default Profile;