'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '@/lib/auth_context';
import Image from 'next/image';

const { Title, Text } = Typography;

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleSubmit = async (values: { username: string; password: string }) => {
    setLoading(true);
    try {
      const success = await login(values.username, values.password);
      if (success) {
        message.success('Login successful');
        router.push('/');
      } else {
        message.error('Invalid username or password');
      }
    } catch (error) {
      message.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return null; // Or show loading spinner
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: 'url(/background.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        padding: '24px',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflowY: 'auto',
      }}
    >

      <div style={{ width: '100%', maxWidth: '440px', position: 'relative', zIndex: 1 }}>
        {/* KOSE Logo */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ marginBottom: '24px' }}>
            <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
              <Image
                src="/kose-logo-h.png"
                alt="KOSE"
                width={200}
                height={60}
                priority
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            </div>
            <Text style={{ color: '#666', fontSize: '14px', letterSpacing: '1px' }}>
              STAFF PORTAL
            </Text>
          </div>
        </div>

        {/* Login Card */}
        <Card
          style={{
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
            border: 'none',
            padding: '8px',
          }}
          bodyStyle={{ padding: '40px' }}
        >
          <Title
            level={2}
            style={{
              textAlign: 'center',
              marginBottom: '8px',
              fontSize: '28px',
              fontWeight: 500,
              color: '#1a1a1a',
            }}
          >
            Welcome Back
          </Title>
          <Text
            style={{
              display: 'block',
              textAlign: 'center',
              color: '#666',
              marginBottom: '32px',
              fontSize: '14px',
            }}
          >
            Sign in to continue to Staff Portal
          </Text>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            requiredMark={false}
            size="large"
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: 'Please enter your username' }]}
            >
              <Input
                prefix={<UserOutlined style={{ color: '#999' }} />}
                placeholder="Username"
                style={{
                  height: '48px',
                  borderRadius: '8px',
                  fontSize: '15px',
                }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please enter your password' }]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#999' }} />}
                placeholder="Password"
                style={{
                  height: '48px',
                  borderRadius: '8px',
                  fontSize: '15px',
                }}
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: '0px', marginTop: '8px' }}>
              <Button
                type="primary"
                block
                htmlType="submit"
                loading={loading}
                style={{
                  height: '48px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 500,
                  backgroundColor: '#4A90E2',
                  borderColor: '#4A90E2',
                  marginTop: '8px',
                }}
              >
                Sign In
              </Button>
            </Form.Item>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0px' }}>
              <Button
                type="link"
                style={{
                  color: '#666',
                  fontSize: '14px',
                  padding: 0,
                }}
              >
                Activate Account
              </Button>
              <Button
                type="link"
                style={{
                  color: '#666',
                  fontSize: '14px',
                  padding: 0,
                }}
              >
                Forgot password?
              </Button>
            </div>
          </Form>
        </Card>

        {/* Demo User Access Info */}
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <Text style={{ color: '#999', fontSize: '12px', lineHeight: '1.6' }}>
            Demo User Access: Admin - username: <span style={{ fontFamily: 'monospace' }}>admin</span>, password: <span style={{ fontFamily: 'monospace' }}>admin123</span> | Staff - username: <span style={{ fontFamily: 'monospace' }}>staff</span>, password: <span style={{ fontFamily: 'monospace' }}>password</span>
          </Text>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <Text style={{ color: '#999', fontSize: '12px' }}>
            © 2026 KOSE Corporation. All rights reserved.
          </Text>
        </div>
      </div>
    </div>
  );
}

