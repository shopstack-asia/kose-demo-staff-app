'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Input, List, Typography, Empty, Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { PageHeader } from '@/components/layout/page_header';
import { BackButton } from '@/components/common/back_button';
import { apiClient } from '@/lib/api_client';
import { CustomerProfile } from '@/mock/customer';
import dayjs from 'dayjs';

const { Text } = Typography;

export default function CustomerSearchPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [customers, setCustomers] = useState<CustomerProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (value: string) => {
    if (!value || value.trim() === '') {
      setCustomers([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setHasSearched(true);
    try {
      const response = await apiClient.get<CustomerProfile[]>(`/customer/search?q=${encodeURIComponent(value)}`);

      if (response.success && response.data) {
        setCustomers(response.data);
      } else {
        setCustomers([]);
      }
    } catch (error) {
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerClick = (customerId: string) => {
    router.push(`/customer/${customerId}`);
  };

  return (
    <div className="page-container">
      <div style={{ width: '100%', maxWidth: '1040px', margin: '0 auto' }}>
        <BackButton />
        <PageHeader
          title="Search Customer"
          subtitle="Find customer by name, phone, email, or member number"
        />

        <Card>
        <Input
          size="large"
          placeholder="Search by name, phone, email, or member number..."
          prefix={<SearchOutlined />}
          value={searchQuery}
          onChange={(e) => {
            const value = e.target.value;
            setSearchQuery(value);
            handleSearch(value);
          }}
          allowClear
        />
      </Card>

      {loading && (
        <div style={{ textAlign: 'center', padding: '48px' }}>
          <Spin size="large" />
        </div>
      )}

      {!loading && hasSearched && customers.length === 0 && (
        <Card>
          <Empty description="No customers found" />
        </Card>
      )}

      {!loading && customers.length > 0 && (
        <List
          dataSource={customers}
          renderItem={(customer) => (
            <List.Item
              style={{
                cursor: 'pointer',
                padding: '16px',
                borderRadius: '8px',
                marginBottom: '8px',
                backgroundColor: '#fff',
                border: '1px solid #f0f0f0',
              }}
              onClick={() => handleCustomerClick(customer.id)}
            >
              <List.Item.Meta
                title={
                  <div>
                    <Text strong style={{ fontSize: '16px' }}>
                      {customer.first_name} {customer.last_name}
                    </Text>
                    {customer.member_no && (
                      <Text style={{ marginLeft: '8px', color: '#666', fontSize: '14px' }}>
                        ({customer.member_no})
                      </Text>
                    )}
                  </div>
                }
                description={
                  <div>
                    <div>
                      <Text>Phone: {customer.phone}</Text>
                    </div>
                    {customer.email && (
                      <div>
                        <Text>Email: {customer.email}</Text>
                      </div>
                    )}
                    <div style={{ marginTop: '4px' }}>
                      <Text
                        style={{
                          fontSize: '12px',
                          color: customer.status === 'active' ? '#4A90E2' : '#999',
                        }}
                      >
                        {customer.status === 'active' ? 'Active' : customer.status === 'pending' ? 'Pending' : 'Inactive'}
                      </Text>
                    </div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      )}
      </div>
    </div>
  );
}

