'use client';

import { useRouter } from 'next/navigation';
import { Card, Typography } from 'antd';
import { UserAddIcon, SearchIcon, ShoppingBagIcon } from '@/components/common/minimal_icons';

const { Text } = Typography;

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="page-container">
      {/* Subtle, brand-led header */}
      <div style={{ marginBottom: 56, marginTop: 32, textAlign: 'center' }}>
        <Text
          style={{
            display: 'block',
            fontSize: '32px',
            fontWeight: 300,
            color: '#1a1a1a',
            letterSpacing: '-0.03em',
            lineHeight: '40px',
            marginBottom: '12px',
          }}
        >
          Welcome
        </Text>
        <Text
          style={{
            display: 'block',
            fontSize: '15px',
            color: '#999',
            lineHeight: '24px',
            fontWeight: 300,
          }}
        >
          Select an action to begin
        </Text>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '20px',
          width: '100%',
          maxWidth: '1040px',
          margin: '0 auto',
        }}
        className="dashboard-grid"
      >
        <Card
          hoverable
          onClick={() => router.push('/customer/register')}
          style={{
            cursor: 'pointer',
            borderRadius: '8px',
            border: 'none',
            boxShadow: 'none',
            backgroundColor: '#ffffff',
            transition: 'all 0.3s ease',
          }}
          bodyStyle={{ padding: '28px 32px' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(74, 144, 226, 0.06)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px' }}>
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '8px',
                backgroundColor: 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #e8e8e8',
                flexShrink: 0,
              }}
            >
              <UserAddIcon size={26} color="#4A90E2" strokeWidth={1.2} />
            </div>
            <div style={{ flex: 1, paddingTop: '2px' }}>
              <Text
                style={{
                  display: 'block',
                  fontSize: '17px',
                  fontWeight: 400,
                  color: '#1a1a1a',
                  marginBottom: '6px',
                  lineHeight: '26px',
                  letterSpacing: '-0.01em',
                }}
              >
                Register New Customer
              </Text>
              <Text
                style={{
                  display: 'block',
                  fontSize: '14px',
                  color: '#999',
                  lineHeight: '22px',
                  fontWeight: 300,
                }}
              >
                Assist customer with registration
              </Text>
            </div>
          </div>
        </Card>

        <Card
          hoverable
          onClick={() => router.push('/customer/search')}
          style={{
            cursor: 'pointer',
            borderRadius: '8px',
            border: 'none',
            boxShadow: 'none',
            backgroundColor: '#ffffff',
            transition: 'all 0.3s ease',
          }}
          bodyStyle={{ padding: '28px 32px' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(74, 144, 226, 0.06)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px' }}>
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '8px',
                backgroundColor: 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #e8e8e8',
                flexShrink: 0,
              }}
            >
              <SearchIcon size={26} color="#4A90E2" strokeWidth={1.2} />
            </div>
            <div style={{ flex: 1, paddingTop: '2px' }}>
              <Text
                style={{
                  display: 'block',
                  fontSize: '17px',
                  fontWeight: 400,
                  color: '#1a1a1a',
                  marginBottom: '6px',
                  lineHeight: '26px',
                  letterSpacing: '-0.01em',
                }}
              >
                Search Customer
              </Text>
              <Text
                style={{
                  display: 'block',
                  fontSize: '14px',
                  color: '#999',
                  lineHeight: '22px',
                  fontWeight: 300,
                }}
              >
                Find and manage customer profiles
              </Text>
            </div>
          </div>
        </Card>

        <Card
          hoverable
          onClick={() => router.push('/order/create')}
          style={{
            cursor: 'pointer',
            borderRadius: '8px',
            border: 'none',
            boxShadow: 'none',
            backgroundColor: '#ffffff',
            transition: 'all 0.3s ease',
          }}
          bodyStyle={{ padding: '28px 32px' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(74, 144, 226, 0.06)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px' }}>
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '8px',
                backgroundColor: 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #e8e8e8',
                flexShrink: 0,
              }}
            >
              <ShoppingBagIcon size={26} color="#4A90E2" strokeWidth={1.2} />
            </div>
            <div style={{ flex: 1, paddingTop: '2px' }}>
              <Text
                style={{
                  display: 'block',
                  fontSize: '17px',
                  fontWeight: 400,
                  color: '#1a1a1a',
                  marginBottom: '6px',
                  lineHeight: '26px',
                  letterSpacing: '-0.01em',
                }}
              >
                Create Offline Order
              </Text>
              <Text
                style={{
                  display: 'block',
                  fontSize: '14px',
                  color: '#999',
                  lineHeight: '22px',
                  fontWeight: 300,
                }}
              >
                Create order for customer purchase
              </Text>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

