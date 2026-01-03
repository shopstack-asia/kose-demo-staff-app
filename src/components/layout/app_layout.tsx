'use client';

import { ReactNode, useState } from 'react';
import { Layout, Button, Dropdown, Avatar, Typography } from 'antd';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth_context';
import { ProfileDrawer } from './profile_drawer';
import Image from 'next/image';

const { Header, Content } = Layout;
const { Text } = Typography;

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const router = useRouter();
  const { user, logout, refresh } = useAuth();
  const [profileDrawerOpen, setProfileDrawerOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const handleProfileClick = () => {
    setProfileDrawerOpen(true);
  };

  const handleProfileUpdate = () => {
    refresh(); // Refresh user data after profile update
  };

  const userMenuItems = [
    {
      key: 'profile',
      label: 'My Profile',
      icon: <UserOutlined />,
      onClick: handleProfileClick,
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      label: 'Logout',
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ];

  return (
    <Layout
      style={{
        minHeight: '100vh',
        backgroundImage: 'url(/background_v2.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      <Header
        style={{
          backgroundColor: '#ffffff',
          padding: '0 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: 'none',
          borderBottom: 'none',
          height: '64px',
          position: 'relative',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Image
            src="/kose-logo-h.png"
            alt="KOSE"
            width={120}
            height={36}
            priority
            style={{ height: 'auto', maxHeight: '36px' }}
          />
          <Text style={{ color: '#8c8c8c', fontSize: '14px', fontWeight: 400 }}>Staff Portal</Text>
        </div>

        {user && (
          <Dropdown
            menu={{ items: userMenuItems }}
            placement="bottomRight"
            trigger={['click']}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                padding: '4px 12px',
                borderRadius: '8px',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f5f5f5';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <Avatar
                src="/default_profile.png"
                style={{
                  backgroundColor: '#f5f5f5',
                }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <Text strong style={{ fontSize: '14px', lineHeight: '20px' }}>
                  {user.name}
                </Text>
                <Text style={{ fontSize: '12px', color: '#999', lineHeight: '16px' }}>
                  {user.role || 'Staff'}
                </Text>
              </div>
            </div>
          </Dropdown>
        )}
      </Header>
      
      {/* Permanent KOSE brand accent bar - water/moisture inspired */}
      <div
        style={{
          height: '12px',
          background: 'linear-gradient(90deg, #4A90E2 0%, rgba(74, 144, 226, 0.4) 100%)',
          width: '100%',
        }}
      />

      <Content style={{ padding: '0', backgroundColor: 'transparent', minHeight: 'calc(100vh - 64px)' }}>
        {children}
      </Content>

      <ProfileDrawer
        open={profileDrawerOpen}
        onClose={() => setProfileDrawerOpen(false)}
        userId={user?.id || null}
        onProfileUpdate={handleProfileUpdate}
      />
    </Layout>
  );
}

