'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, Button, Tabs, List, Typography, Spin, message, Drawer, Descriptions } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { BackButton } from '@/components/common/back_button';
import { apiClient } from '@/lib/api_client';
import { CustomerProfile } from '@/mock/customer';
import { OfflineOrder } from '@/mock/order';
import { PointTransaction, CustomerPointsSummary } from '@/mock/point';
import dayjs from 'dayjs';

const { Text, Title } = Typography;

export default function CustomerDetailPage() {
  const router = useRouter();
  const params = useParams();
  const customerId = params.id as string;
  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [orders, setOrders] = useState<OfflineOrder[]>([]);
  const [pointsSummary, setPointsSummary] = useState<CustomerPointsSummary | null>(null);
  const [pointHistory, setPointHistory] = useState<PointTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OfflineOrder | null>(null);
  const [orderDrawerOpen, setOrderDrawerOpen] = useState(false);

  useEffect(() => {
    if (!customerId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [customerResponse, ordersResponse, pointsResponse, pointsHistoryResponse] = await Promise.all([
          apiClient.get<CustomerProfile>(`/customer/${customerId}`),
          apiClient.get<OfflineOrder[]>(`/order/customer/${customerId}`),
          apiClient.get<CustomerPointsSummary>(`/customer/${customerId}/points`),
          apiClient.get<PointTransaction[]>(`/customer/${customerId}/points/history`),
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

        if (pointsResponse.success && pointsResponse.data) {
          setPointsSummary(pointsResponse.data);
        }

        if (pointsHistoryResponse.success && pointsHistoryResponse.data) {
          setPointHistory(pointsHistoryResponse.data);
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

  const handleOrderClick = (order: OfflineOrder) => {
    setSelectedOrder(order);
    setOrderDrawerOpen(true);
  };

  const getTierDisplayName = (tier?: string) => {
    if (!tier) return 'N/A';
    return tier.charAt(0).toUpperCase() + tier.slice(1);
  };

  const getTierExpiryDisplay = (expiry?: string) => {
    if (!expiry) return 'N/A';
    return dayjs(expiry).format('DD MMM YYYY');
  };

  const getPointsExpiringDisplay = (summary: CustomerPointsSummary) => {
    if (summary.points_expiring_soon === 0) return null;
    
    if (summary.points_expiring_date) {
      const daysUntilExpiry = dayjs(summary.points_expiring_date).diff(dayjs(), 'days');
      if (daysUntilExpiry > 0) {
        return `within ${daysUntilExpiry} day${daysUntilExpiry > 1 ? 's' : ''}`;
      }
      return 'soon';
    }
    return 'soon';
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
      <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header Section */}
        <BackButton />
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          marginBottom: 32,
          padding: '0 16px',
        }}>
          <div style={{ flex: 1 }}>
            <Title 
              level={1} 
              style={{ 
                margin: 0, 
                marginBottom: 8,
                fontSize: '32px',
                fontWeight: 400,
                color: '#1a1a1a',
                letterSpacing: '-0.02em',
                lineHeight: '40px',
              }}
            >
              {customer.first_name} {customer.last_name}
            </Title>
            <Text 
              style={{ 
                fontSize: '15px',
                color: '#8c8c8c',
                lineHeight: '22px',
                fontWeight: 400,
              }}
            >
              {customer.member_no || 'Customer ID: ' + customerId}
            </Text>
          </div>
          <Button 
            type="text"
            icon={<EditOutlined />} 
            onClick={handleEdit}
            style={{
              color: '#666',
              padding: '8px 16px',
              height: 'auto',
              fontSize: '14px',
            }}
          >
            Edit
          </Button>
        </div>

        {/* Main Content Area */}
        <div style={{ padding: '0 16px' }}>
          {/* Customer Profile Summary */}
          <Card
            style={{
              marginBottom: 24,
              borderRadius: 8,
              border: 'none',
              boxShadow: 'none',
              background: '#ffffff',
            }}
            bodyStyle={{ padding: '32px' }}
          >
            <Title 
              level={4} 
              style={{ 
                margin: 0, 
                marginBottom: 24,
                fontSize: '18px',
                fontWeight: 500,
                color: '#1a1a1a',
              }}
            >
              Customer Profile Summary
            </Title>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
            }}>
              <div>
                <Text style={{ fontSize: '13px', color: '#8c8c8c', display: 'block', marginBottom: 4 }}>
                  Member Number
                </Text>
                <Text style={{ fontSize: '15px', color: '#1a1a1a', fontWeight: 400 }}>
                  {customer.member_no || 'N/A'}
                </Text>
              </div>
              
              <div>
                <Text style={{ fontSize: '13px', color: '#8c8c8c', display: 'block', marginBottom: 4 }}>
                  Phone
                </Text>
                <Text style={{ fontSize: '15px', color: '#1a1a1a', fontWeight: 400 }}>
                  {customer.phone || 'N/A'}
                </Text>
              </div>
              
              {customer.email && (
                <div>
                  <Text style={{ fontSize: '13px', color: '#8c8c8c', display: 'block', marginBottom: 4 }}>
                    Email
                  </Text>
                  <Text style={{ fontSize: '15px', color: '#1a1a1a', fontWeight: 400 }}>
                    {customer.email}
                  </Text>
                </div>
              )}
              
              {customer.dob && (
                <div>
                  <Text style={{ fontSize: '13px', color: '#8c8c8c', display: 'block', marginBottom: 4 }}>
                    Date of Birth
                  </Text>
                  <Text style={{ fontSize: '15px', color: '#1a1a1a', fontWeight: 400 }}>
                    {dayjs(customer.dob).format('DD MMM YYYY')}
                  </Text>
                </div>
              )}
              
              {customer.gender && (
                <div>
                  <Text style={{ fontSize: '13px', color: '#8c8c8c', display: 'block', marginBottom: 4 }}>
                    Gender
                  </Text>
                  <Text style={{ fontSize: '15px', color: '#1a1a1a', fontWeight: 400 }}>
                    {customer.gender === 'male' ? 'Male' : customer.gender === 'female' ? 'Female' : 'Other'}
                  </Text>
                </div>
              )}
              
              <div>
                <Text style={{ fontSize: '13px', color: '#8c8c8c', display: 'block', marginBottom: 4 }}>
                  Status
                </Text>
                <Text
                  style={{
                    fontSize: '15px',
                    color: customer.status === 'active' ? '#4A90E2' : customer.status === 'pending' ? '#7BC4E8' : '#999',
                    fontWeight: 400,
                  }}
                >
                  {customer.status === 'active' ? 'Active' : customer.status === 'pending' ? 'Pending' : 'Inactive'}
                </Text>
              </div>
            </div>
          </Card>

          {/* Customer Points Section */}
          {pointsSummary && (
            <Card
              style={{
                marginBottom: 24,
                borderRadius: 8,
                border: 'none',
                boxShadow: 'none',
                background: '#ffffff',
              }}
              bodyStyle={{ padding: '32px' }}
            >
              <Title 
                level={4} 
                style={{ 
                  margin: 0, 
                  marginBottom: 24,
                  fontSize: '18px',
                  fontWeight: 500,
                  color: '#1a1a1a',
                }}
              >
                Customer Points
              </Title>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '24px',
              }}>
                <div>
                  <Text style={{ fontSize: '13px', color: '#8c8c8c', display: 'block', marginBottom: 8 }}>
                    Available Points
                  </Text>
                  <Text 
                    style={{ 
                      fontSize: '28px', 
                      color: '#4A90E2',
                      fontWeight: 500,
                      lineHeight: '36px',
                    }}
                  >
                    {pointsSummary.available_points.toLocaleString()}
                  </Text>
                </div>
                
                {pointsSummary.points_expiring_soon > 0 && (
                  <div>
                    <Text style={{ fontSize: '13px', color: '#8c8c8c', display: 'block', marginBottom: 8 }}>
                      Points Expiring Soon
                    </Text>
                    <Text style={{ fontSize: '18px', color: '#1a1a1a', fontWeight: 400, display: 'block', marginBottom: 4 }}>
                      {pointsSummary.points_expiring_soon.toLocaleString()} points
                    </Text>
                    {pointsSummary.points_expiring_date && (
                      <Text style={{ fontSize: '13px', color: '#8c8c8c' }}>
                        {getPointsExpiringDisplay(pointsSummary)}
                      </Text>
                    )}
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Customer Tier Section */}
          {customer.tier && (
            <Card
              style={{
                marginBottom: 24,
                borderRadius: 8,
                border: 'none',
                boxShadow: 'none',
                background: '#ffffff',
              }}
              bodyStyle={{ padding: '32px' }}
            >
              <Title 
                level={4} 
                style={{ 
                  margin: 0, 
                  marginBottom: 24,
                  fontSize: '18px',
                  fontWeight: 500,
                  color: '#1a1a1a',
                }}
              >
                Customer Tier
              </Title>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '24px',
              }}>
                <div>
                  <Text style={{ fontSize: '13px', color: '#8c8c8c', display: 'block', marginBottom: 8 }}>
                    Tier Level
                  </Text>
                  <Text 
                    style={{ 
                      fontSize: '20px', 
                      color: '#4A90E2',
                      fontWeight: 500,
                    }}
                  >
                    {getTierDisplayName(customer.tier)}
                  </Text>
                </div>
                
                {customer.tier_expiry && (
                  <div>
                    <Text style={{ fontSize: '13px', color: '#8c8c8c', display: 'block', marginBottom: 8 }}>
                      Tier Expiry Date
                    </Text>
                  <Text style={{ fontSize: '15px', color: '#1a1a1a', fontWeight: 400 }}>
                    {getTierExpiryDisplay(customer.tier_expiry)}
                  </Text>
                </div>
                )}
              </div>
            </Card>
          )}

          {/* Tabs Section */}
          <Card
            style={{
              borderRadius: 8,
              border: 'none',
              boxShadow: 'none',
              background: '#ffffff',
            }}
            bodyStyle={{ padding: 0 }}
          >
            <Tabs
              defaultActiveKey="orders"
              style={{ padding: '0 32px' }}
              items={[
                {
                  key: 'orders',
                  label: 'Order History',
                  children: (
                    <div style={{ padding: '24px 0' }}>
                      {orders.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '48px' }}>
                          <Text type="secondary">No orders found</Text>
                        </div>
                      ) : (
                        <List
                          dataSource={orders}
                          renderItem={(order) => (
                            <List.Item
                              style={{
                                padding: '20px 0',
                                borderBottom: '1px solid #f0f0f0',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s',
                              }}
                              onClick={() => handleOrderClick(order)}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#fafafa';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                              }}
                            >
                              <List.Item.Meta
                                title={
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                                    <Text strong style={{ fontSize: '16px', color: '#1a1a1a' }}>
                                      Order #{order.id.slice(-6).toUpperCase()}
                                    </Text>
                                    <Text 
                                      style={{ 
                                        fontSize: '14px', 
                                        color: '#8c8c8c',
                                      }}
                                    >
                                      {dayjs(order.order_date).format('DD MMM YYYY HH:mm')}
                                    </Text>
                                  </div>
                                }
                                description={
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                    <Text style={{ fontSize: '14px', color: '#666' }}>
                                      {order.items.length} item{order.items.length > 1 ? 's' : ''}
                                    </Text>
                                    <Text strong style={{ fontSize: '16px', color: '#1a1a1a' }}>
                                      Total: ฿{order.total.toLocaleString()}
                                    </Text>
                                    <Text
                                      style={{
                                        fontSize: '14px',
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
                                }
                              />
                            </List.Item>
                          )}
                        />
                      )}
                    </div>
                  ),
                },
                {
                  key: 'points',
                  label: 'Point History',
                  children: (
                    <div style={{ padding: '24px 0' }}>
                      {pointHistory.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '48px' }}>
                          <Text type="secondary">No point transactions found</Text>
                        </div>
                      ) : (
                        <List
                          dataSource={pointHistory}
                          renderItem={(transaction) => (
                            <List.Item
                              style={{
                                padding: '20px 0',
                                borderBottom: '1px solid #f0f0f0',
                              }}
                            >
                              <List.Item.Meta
                                title={
                                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                                    <Text 
                                      strong 
                                      style={{ 
                                        fontSize: '16px', 
                                        color: transaction.amount > 0 ? '#1a1a1a' : '#666',
                                      }}
                                    >
                                      {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString()} points
                                    </Text>
                                    <Text 
                                      style={{ 
                                        fontSize: '14px', 
                                        color: '#8c8c8c',
                                      }}
                                    >
                                      {dayjs(transaction.transaction_date).format('DD MMM YYYY HH:mm')}
                                    </Text>
                                  </div>
                                }
                                description={
                                  <div>
                                    <Text style={{ fontSize: '14px', color: '#666', display: 'block', marginBottom: 4 }}>
                                      {transaction.description}
                                    </Text>
                                    {transaction.expiry_date && transaction.amount > 0 && (
                                      <Text style={{ fontSize: '13px', color: '#8c8c8c' }}>
                                        Expires: {dayjs(transaction.expiry_date).format('DD MMM YYYY')}
                                      </Text>
                                    )}
                                  </div>
                                }
                              />
                            </List.Item>
                          )}
                        />
                      )}
                    </div>
                  ),
                },
              ]}
            />
          </Card>
        </div>
      </div>

      {/* Order Detail Drawer */}
      <Drawer
        title={`Order #${selectedOrder?.id.slice(-6).toUpperCase()}`}
        placement="right"
        onClose={() => setOrderDrawerOpen(false)}
        open={orderDrawerOpen}
        width={480}
      >
        {selectedOrder && (
          <div>
            <Descriptions column={1} bordered style={{ marginBottom: 24 }}>
              <Descriptions.Item label="Order Date">
                {dayjs(selectedOrder.order_date).format('DD MMM YYYY HH:mm')}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Text
                  style={{
                    color:
                      selectedOrder.status === 'completed'
                        ? '#4A90E2'
                        : selectedOrder.status === 'pending'
                        ? '#7BC4E8'
                        : '#999',
                  }}
                >
                  {selectedOrder.status === 'completed'
                    ? 'Completed'
                    : selectedOrder.status === 'pending'
                    ? 'Pending'
                    : 'Cancelled'}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Items">
                {selectedOrder.items.length} item{selectedOrder.items.length > 1 ? 's' : ''}
              </Descriptions.Item>
              <Descriptions.Item label="Subtotal">
                ฿{selectedOrder.subtotal.toLocaleString()}
              </Descriptions.Item>
              {selectedOrder.discount > 0 && (
                <Descriptions.Item label="Discount">
                  ฿{selectedOrder.discount.toLocaleString()}
                </Descriptions.Item>
              )}
              <Descriptions.Item label="Total">
                <Text strong>฿{selectedOrder.total.toLocaleString()}</Text>
              </Descriptions.Item>
            </Descriptions>

            <Title level={5} style={{ marginBottom: 16 }}>
              Order Items
            </Title>
            <List
              dataSource={selectedOrder.items}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={item.product_name}
                    description={
                      <div>
                        <Text style={{ fontSize: '14px', color: '#666' }}>
                          {item.product_code}
                        </Text>
                        <div style={{ marginTop: 4 }}>
                          <Text style={{ fontSize: '14px', color: '#666' }}>
                            Quantity: {item.quantity} × ฿{item.unit_price.toLocaleString()} = ฿{item.total_price.toLocaleString()}
                          </Text>
                        </div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </div>
        )}
      </Drawer>
    </div>
  );
}
