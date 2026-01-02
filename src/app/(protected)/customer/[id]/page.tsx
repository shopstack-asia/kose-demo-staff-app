'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, Descriptions, Button, Tabs, List, Typography, Spin, message } from 'antd';
import { EditOutlined, ShoppingOutlined } from '@ant-design/icons';
import { PageHeader } from '@/components/layout/page_header';
import { BackButton } from '@/components/common/back_button';
import { apiClient } from '@/lib/api_client';
import { CustomerProfile } from '@/mock/customer';
import { OfflineOrder } from '@/mock/order';
import dayjs from 'dayjs';

const { Text } = Typography;
const { TabPane } = Tabs;

export default function CustomerDetailPage() {
  const router = useRouter();
  const params = useParams();
  const customerId = params.id as string;
  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [orders, setOrders] = useState<OfflineOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    if (!customerId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [customerResponse, ordersResponse] = await Promise.all([
          apiClient.get<CustomerProfile>(`/customer/${customerId}`),
          apiClient.get<OfflineOrder[]>(`/order/customer/${customerId}`),
        ]);

        if (customerResponse.success && customerResponse.data) {
          setCustomer(customerResponse.data);
        } else {
          message.error('Failed to load customer');
          router.push('/customer/search');
        }

        if (ordersResponse.success && ordersResponse.data) {
          setOrders(ordersResponse.data);
        }
      } catch (error) {
        message.error('An error occurred');
        router.push('/customer/search');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [customerId, router]);

  const handleEdit = () => {
    router.push(`/customer/${customerId}/edit`);
  };

  if (loading) {
    return (
      <div className="page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!customer) {
    return null;
  }

  return (
    <div className="page-container">
      <div style={{ width: '100%', maxWidth: '1040px', margin: '0 auto' }}>
        <BackButton />
        <PageHeader
          title={`${customer.first_name} ${customer.last_name}`}
          subtitle={customer.member_no || 'Customer Profile'}
        />

        <Card
        extra={
          <Button icon={<EditOutlined />} onClick={handleEdit}>
            Edit
          </Button>
        }
      >
        <Descriptions column={1} bordered>
          <Descriptions.Item label="Member Number">{customer.member_no || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="First Name">{customer.first_name}</Descriptions.Item>
          <Descriptions.Item label="Last Name">{customer.last_name}</Descriptions.Item>
          <Descriptions.Item label="Phone">{customer.phone}</Descriptions.Item>
          {customer.email && (
            <Descriptions.Item label="Email">{customer.email}</Descriptions.Item>
          )}
          {customer.dob && (
            <Descriptions.Item label="Date of Birth">
              {dayjs(customer.dob).format('DD MMM YYYY')}
            </Descriptions.Item>
          )}
          {customer.gender && (
            <Descriptions.Item label="Gender">
              {customer.gender === 'male' ? 'Male' : customer.gender === 'female' ? 'Female' : 'Other'}
            </Descriptions.Item>
          )}
          <Descriptions.Item label="Status">
            <Text
              style={{
                color: customer.status === 'active' ? '#4A90E2' : customer.status === 'pending' ? '#7BC4E8' : '#999',
              }}
            >
              {customer.status === 'active' ? 'Active' : customer.status === 'pending' ? 'Pending' : 'Inactive'}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label="Tier">{customer.tier || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Phone Verified">
            {customer.phone_verified ? 'Yes' : 'No'}
          </Descriptions.Item>
          <Descriptions.Item label="Email Verified">
            {customer.email_verified ? 'Yes' : 'No'}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card>
        <Tabs defaultActiveKey="orders">
          <TabPane tab="Order History" key="orders">
            {orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px' }}>
                <Text type="secondary">No orders found</Text>
              </div>
            ) : (
              <List
                dataSource={orders}
                renderItem={(order) => (
                  <List.Item>
                    <List.Item.Meta
                      title={
                        <div>
                          <Text strong>Order #{order.id.slice(-6).toUpperCase()}</Text>
                          <Text style={{ marginLeft: '8px', color: '#666' }}>
                            {dayjs(order.order_date).format('DD MMM YYYY HH:mm')}
                          </Text>
                        </div>
                      }
                      description={
                        <div>
                          <div>
                            <Text>Items: {order.items.length}</Text>
                          </div>
                          <div>
                            <Text strong>Total: ฿{order.total.toLocaleString()}</Text>
                          </div>
                          <div>
                            <Text
                              style={{
                                color:
                                  order.status === 'completed'
                                    ? '#4A90E2'
                                    : order.status === 'pending'
                                    ? '#7BC4E8'
                                    : '#999',
                              }}
                            >
                              {order.status === 'completed'
                                ? 'Completed'
                                : order.status === 'pending'
                                ? 'Pending'
                                : 'Cancelled'}
                            </Text>
                          </div>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            )}
          </TabPane>
        </Tabs>
      </Card>
      </div>
    </div>
  );
}

