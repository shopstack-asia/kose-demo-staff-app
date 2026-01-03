'use client';

import { useState, useEffect } from 'react';
import { Drawer, Form, Input, Button, Typography, message, Spin, Divider } from 'antd';
import { apiClient } from '@/lib/api_client';
import { StaffProfile } from '@/mock/staff';

const { Text, Title } = Typography;

interface ProfileDrawerProps {
  open: boolean;
  onClose: () => void;
  userId: string | null;
  onProfileUpdate?: () => void;
}

export function ProfileDrawer({ open, onClose, userId, onProfileUpdate }: ProfileDrawerProps) {
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [profile, setProfile] = useState<StaffProfile | null>(null);

  useEffect(() => {
    if (open && userId) {
      fetchProfile();
    } else {
      form.resetFields();
      passwordForm.resetFields();
      setProfile(null);
    }
  }, [open, userId]);

  const fetchProfile = async () => {
    if (!userId) return;

    setFetching(true);
    try {
      const response = await apiClient.get<StaffProfile>('/staff/profile');

      if (response.success && response.data) {
        setProfile(response.data);
        form.setFieldsValue({
          name: response.data.name,
          email: response.data.email || '',
          phone: response.data.phone || '',
        });
      } else {
        message.error('Failed to load profile');
      }
    } catch (error) {
      message.error('An error occurred');
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (values: { name: string; email?: string; phone?: string }) => {
    setLoading(true);
    try {
      const response = await apiClient.patch<StaffProfile>('/staff/profile', {
        name: values.name,
        email: values.email || undefined,
        phone: values.phone || undefined,
      });

      if (response.success && response.data) {
        message.success('Profile updated successfully');
        setProfile(response.data as StaffProfile);
        if (onProfileUpdate) {
          onProfileUpdate();
        }
        onClose();
      } else {
        message.error(response.error || 'Failed to update profile');
      }
    } catch (error) {
      message.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (values: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error('New password and confirm password do not match');
      return;
    }

    setPasswordLoading(true);
    try {
      const response = await apiClient.post('/staff/change-password', {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });

      if (response.success) {
        message.success('Password changed successfully');
        passwordForm.resetFields();
      } else {
        message.error(response.error || 'Failed to change password');
      }
    } catch (error) {
      message.error('An error occurred');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <Drawer
      title={
        <Title level={4} style={{ margin: 0, fontSize: '20px', fontWeight: 500 }}>
          My Profile
        </Title>
      }
      placement="right"
      onClose={onClose}
      open={open}
      width={480}
      styles={{
        body: {
          padding: '32px',
        },
      }}
    >
      {fetching ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            requiredMark={false}
          >
            <div style={{ marginBottom: 24 }}>
              <Text style={{ fontSize: '13px', color: '#8c8c8c', display: 'block', marginBottom: 8 }}>
                Username
              </Text>
              <Text style={{ fontSize: '15px', color: '#1a1a1a', fontWeight: 400 }}>
                {profile?.username || 'N/A'}
              </Text>
            </div>

            <div style={{ marginBottom: 24 }}>
              <Text style={{ fontSize: '13px', color: '#8c8c8c', display: 'block', marginBottom: 8 }}>
                Role
              </Text>
              <Text 
                style={{ 
                  fontSize: '15px', 
                  color: profile?.role === 'admin' ? '#4A90E2' : '#1a1a1a',
                  fontWeight: 400,
                  textTransform: 'capitalize',
                }}
              >
                {profile?.role || 'N/A'}
              </Text>
            </div>

            <Form.Item
              name="name"
              label={<Text style={{ fontSize: '13px', color: '#8c8c8c' }}>Name</Text>}
              rules={[{ required: true, message: 'Please enter your name' }]}
            >
              <Input
                size="large"
                placeholder="Enter your name"
                style={{
                  borderRadius: '8px',
                  fontSize: '15px',
                }}
              />
            </Form.Item>

            <Form.Item
              name="email"
              label={<Text style={{ fontSize: '13px', color: '#8c8c8c' }}>Email</Text>}
              rules={[
                { type: 'email', message: 'Please enter a valid email' },
              ]}
            >
              <Input
                size="large"
                placeholder="Enter your email"
                style={{
                  borderRadius: '8px',
                  fontSize: '15px',
                }}
              />
            </Form.Item>

            <Form.Item
              name="phone"
              label={<Text style={{ fontSize: '13px', color: '#8c8c8c' }}>Phone</Text>}
            >
              <Input
                size="large"
                placeholder="Enter your phone number"
                style={{
                  borderRadius: '8px',
                  fontSize: '15px',
                }}
              />
            </Form.Item>

            <div style={{ marginTop: 32, display: 'flex', gap: 12 }}>
              <Button
                size="large"
                onClick={onClose}
                style={{
                  flex: 1,
                  borderRadius: '8px',
                }}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={loading}
                style={{
                  flex: 1,
                  borderRadius: '8px',
                  backgroundColor: '#4A90E2',
                  borderColor: '#4A90E2',
                }}
              >
                Save Changes
              </Button>
            </div>
          </Form>

          <Divider style={{ margin: '32px 0' }} />

          <Title level={5} style={{ marginBottom: 24, fontSize: '16px', fontWeight: 500 }}>
            Change Password
          </Title>

          <Form
            form={passwordForm}
            layout="vertical"
            onFinish={handlePasswordSubmit}
            requiredMark={false}
          >
            <Form.Item
              name="currentPassword"
              label={<Text style={{ fontSize: '13px', color: '#8c8c8c' }}>Current Password</Text>}
              rules={[{ required: true, message: 'Please enter your current password' }]}
            >
              <Input.Password
                size="large"
                placeholder="Enter current password"
                style={{
                  borderRadius: '8px',
                  fontSize: '15px',
                }}
              />
            </Form.Item>

            <Form.Item
              name="newPassword"
              label={<Text style={{ fontSize: '13px', color: '#8c8c8c' }}>New Password</Text>}
              rules={[
                { required: true, message: 'Please enter a new password' },
                { min: 6, message: 'Password must be at least 6 characters' },
              ]}
            >
              <Input.Password
                size="large"
                placeholder="Enter new password"
                style={{
                  borderRadius: '8px',
                  fontSize: '15px',
                }}
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label={<Text style={{ fontSize: '13px', color: '#8c8c8c' }}>Confirm New Password</Text>}
              dependencies={['newPassword']}
              rules={[
                { required: true, message: 'Please confirm your new password' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Passwords do not match'));
                  },
                }),
              ]}
            >
              <Input.Password
                size="large"
                placeholder="Confirm new password"
                style={{
                  borderRadius: '8px',
                  fontSize: '15px',
                }}
              />
            </Form.Item>

            <div style={{ marginTop: 24 }}>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={passwordLoading}
                block
                style={{
                  borderRadius: '8px',
                  backgroundColor: '#4A90E2',
                  borderColor: '#4A90E2',
                }}
              >
                Change Password
              </Button>
            </div>
          </Form>
        </>
      )}
    </Drawer>
  );
}

