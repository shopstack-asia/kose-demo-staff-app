'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Input, Button, List, Typography, Empty, Spin, Drawer } from 'antd';
import { CalendarOutlined, DownOutlined, SearchOutlined, FilterOutlined, ClearOutlined } from '@ant-design/icons';
import { PageHeader } from '@/components/layout/page_header';
import { BackButton } from '@/components/common/back_button';
import { StorePickerDrawer } from '@/components/common/store_picker_drawer';
import { CustomerPickerDrawer } from '@/components/common/customer_picker_drawer';
import { DatePickerDrawer } from '@/components/common/date_picker_drawer';
import { apiClient } from '@/lib/api_client';
import { Store } from '@/mock/store';
import { CustomerProfile } from '@/mock/customer';
import { OfflineOrder } from '@/mock/order';
import dayjs, { Dayjs } from 'dayjs';

const { Text } = Typography;

interface FilterState {
  dateFrom: Dayjs | null;
  dateTo: Dayjs | null;
  storeId: string | null;
  customerId: string | null;
  purchaseNo: string;
}

export default function OrderReportPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<OfflineOrder[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [customers, setCustomers] = useState<CustomerProfile[]>([]);
  
  // Filter states
  const [filters, setFilters] = useState<FilterState>({
    dateFrom: null,
    dateTo: null,
    storeId: null,
    customerId: null,
    purchaseNo: '',
  });

  // Drawer states
  const [dateFromPickerOpen, setDateFromPickerOpen] = useState(false);
  const [dateToPickerOpen, setDateToPickerOpen] = useState(false);
  const [storePickerOpen, setStorePickerOpen] = useState(false);
  const [customerPickerOpen, setCustomerPickerOpen] = useState(false);
  const [orderDetailDrawerOpen, setOrderDetailDrawerOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OfflineOrder | null>(null);
  
  // Hover states for clear buttons
  const [storeHovered, setStoreHovered] = useState(false);
  const [customerHovered, setCustomerHovered] = useState(false);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await apiClient.get<Store[]>('/store/list');
        if (response.success && response.data) {
          setStores(response.data);
        }
      } catch (error) {
        // Handle error silently
      }
    };
    fetchStores();
    // Load initial orders on mount
    fetchOrders();
  }, []);

  const handleSearchCustomer = async (query: string) => {
    if (!query || query.trim() === '') {
      setCustomers([]);
      return;
    }

    try {
      const response = await apiClient.get<CustomerProfile[]>(`/customer/search?q=${encodeURIComponent(query)}`);
      if (response.success && response.data) {
        setCustomers(response.data);
      } else {
        setCustomers([]);
      }
    } catch (error) {
      setCustomers([]);
    }
  };

  const fetchOrders = async (filterState?: FilterState) => {
    const activeFilters = filterState || filters;
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeFilters.dateFrom) {
        params.append('date_from', activeFilters.dateFrom.format('YYYY-MM-DD'));
      }
      if (activeFilters.dateTo) {
        params.append('date_to', activeFilters.dateTo.format('YYYY-MM-DD'));
      }
      if (activeFilters.storeId) {
        params.append('store_id', activeFilters.storeId);
      }
      if (activeFilters.customerId) {
        params.append('customer_id', activeFilters.customerId);
      }
      if (activeFilters.purchaseNo) {
        params.append('purchase_no', activeFilters.purchaseNo);
      }

      const response = await apiClient.get<OfflineOrder[]>(`/order/list?${params.toString()}`);
      if (response.success && response.data) {
        setOrders(response.data);
        // Fetch customer details for all orders
        const customerIds = [...new Set(response.data.map(o => o.customer_id))];
        const customerPromises = customerIds.map(id => 
          apiClient.get<CustomerProfile>(`/customer/${id}`)
        );
        const customerResponses = await Promise.all(customerPromises);
        const fetchedCustomers = customerResponses
          .filter(r => r.success && r.data)
          .map(r => r.data!);
        setCustomers(prev => {
          const existingIds = new Set(prev.map(c => c.id));
          const newCustomers = fetchedCustomers.filter(c => !existingIds.has(c.id));
          return [...prev, ...newCustomers];
        });
      } else {
        setOrders([]);
      }
    } catch (error) {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = () => {
    fetchOrders();
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      dateFrom: null,
      dateTo: null,
      storeId: null,
      customerId: null,
      purchaseNo: '',
    };
    setFilters(clearedFilters);
    // Clear and refetch
    fetchOrders(clearedFilters);
  };

  const handleOrderClick = (order: OfflineOrder) => {
    setSelectedOrder(order);
    setOrderDetailDrawerOpen(true);
  };

  const selectedStore = stores.find(s => s.id === filters.storeId);
  const selectedCustomer = customers.find(c => c.id === filters.customerId);

  return (
    <div className="page-container">
      <div style={{ width: '100%', maxWidth: '1040px', margin: '0 auto' }}>
        <BackButton />
        <PageHeader
          title="Offline Order Report"
          subtitle="View and review offline purchase records"
        />

        {/* Filter Section */}
        <Card
          style={{
            marginBottom: '24px',
            borderRadius: '8px',
            border: 'none',
            boxShadow: 'none',
            backgroundColor: '#ffffff',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '20px',
            }}
          >
            {/* Date Range */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
              }}
            >
              <div>
                <Text
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#1a1a1a',
                    marginBottom: '8px',
                  }}
                >
                  Purchase Date (From)
                </Text>
                <div onClick={() => setDateFromPickerOpen(true)} style={{ cursor: 'pointer' }}>
                  <Input
                    size="large"
                    placeholder="Select date"
                    readOnly
                    value={filters.dateFrom ? filters.dateFrom.format('YYYY-MM-DD') : ''}
                    suffix={<CalendarOutlined style={{ color: '#999' }} />}
                    style={{ cursor: 'pointer', pointerEvents: 'none' }}
                  />
                </div>
                <DatePickerDrawer
                  open={dateFromPickerOpen}
                  onClose={() => setDateFromPickerOpen(false)}
                  value={filters.dateFrom || undefined}
                  onChange={(date) => {
                    setFilters(prev => ({ ...prev, dateFrom: date || null }));
                  }}
                  maxDate={filters.dateTo || dayjs()}
                  title="Select Start Date"
                />
              </div>
              <div>
                <Text
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#1a1a1a',
                    marginBottom: '8px',
                  }}
                >
                  Purchase Date (To)
                </Text>
                <div onClick={() => setDateToPickerOpen(true)} style={{ cursor: 'pointer' }}>
                  <Input
                    size="large"
                    placeholder="Select date"
                    readOnly
                    value={filters.dateTo ? filters.dateTo.format('YYYY-MM-DD') : ''}
                    suffix={<CalendarOutlined style={{ color: '#999' }} />}
                    style={{ cursor: 'pointer', pointerEvents: 'none' }}
                  />
                </div>
                <DatePickerDrawer
                  open={dateToPickerOpen}
                  onClose={() => setDateToPickerOpen(false)}
                  value={filters.dateTo || undefined}
                  onChange={(date) => {
                    setFilters(prev => ({ ...prev, dateTo: date || null }));
                  }}
                  minDate={filters.dateFrom || undefined}
                  maxDate={dayjs()}
                  title="Select End Date"
                />
              </div>
            </div>

            {/* Store and Customer */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
              }}
            >
              <div>
                <Text
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#1a1a1a',
                    marginBottom: '8px',
                  }}
                >
                  Branch / Store
                </Text>
                <div
                  onMouseEnter={() => setStoreHovered(true)}
                  onMouseLeave={() => setStoreHovered(false)}
                  style={{ position: 'relative' }}
                >
                  <div onClick={() => setStorePickerOpen(true)} style={{ cursor: 'pointer' }}>
                    <Input
                      size="large"
                      placeholder="Select store"
                      readOnly
                      value={selectedStore?.name || ''}
                      suffix={
                        selectedStore && storeHovered ? (
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              setFilters(prev => ({ ...prev, storeId: null }));
                            }}
                            onMouseDown={(e) => e.stopPropagation()}
                            style={{
                              cursor: 'pointer',
                              color: '#999',
                              padding: '0 4px',
                              display: 'flex',
                              alignItems: 'center',
                              fontSize: '16px',
                              pointerEvents: 'auto',
                            }}
                          >
                            ✕
                          </span>
                        ) : (
                          <DownOutlined style={{ color: '#999' }} />
                        )
                      }
                      style={{ cursor: 'pointer', pointerEvents: 'none' }}
                    />
                  </div>
                </div>
                <StorePickerDrawer
                  open={storePickerOpen}
                  onClose={() => setStorePickerOpen(false)}
                  value={filters.storeId || undefined}
                  onChange={(storeId) => {
                    setFilters(prev => ({ ...prev, storeId: storeId || null }));
                  }}
                  stores={stores}
                />
              </div>
              <div>
                <Text
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#1a1a1a',
                    marginBottom: '8px',
                  }}
                >
                  Customer
                </Text>
                <div
                  onMouseEnter={() => setCustomerHovered(true)}
                  onMouseLeave={() => setCustomerHovered(false)}
                  style={{ position: 'relative' }}
                >
                  <div onClick={() => setCustomerPickerOpen(true)} style={{ cursor: 'pointer' }}>
                    <Input
                      size="large"
                      placeholder="Search customer..."
                      readOnly
                      value={
                        selectedCustomer
                          ? `${selectedCustomer.first_name} ${selectedCustomer.last_name}`
                          : ''
                      }
                      suffix={
                        selectedCustomer && customerHovered ? (
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              setFilters(prev => ({ ...prev, customerId: null }));
                            }}
                            onMouseDown={(e) => e.stopPropagation()}
                            style={{
                              cursor: 'pointer',
                              color: '#999',
                              padding: '0 4px',
                              display: 'flex',
                              alignItems: 'center',
                              fontSize: '16px',
                              pointerEvents: 'auto',
                            }}
                          >
                            ✕
                          </span>
                        ) : (
                          <SearchOutlined style={{ color: '#999' }} />
                        )
                      }
                      style={{ cursor: 'pointer', pointerEvents: 'none' }}
                    />
                  </div>
                </div>
                <CustomerPickerDrawer
                  open={customerPickerOpen}
                  onClose={() => setCustomerPickerOpen(false)}
                  value={filters.customerId || undefined}
                  onChange={(customerId) => {
                    setFilters(prev => ({ ...prev, customerId: customerId || null }));
                  }}
                  customers={customers}
                  onSearch={handleSearchCustomer}
                />
              </div>
            </div>

            {/* Purchase No */}
            <div>
              <Text
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#1a1a1a',
                  marginBottom: '8px',
                }}
              >
                Purchase No
              </Text>
              <Input
                size="large"
                placeholder="Enter purchase number"
                value={filters.purchaseNo}
                onChange={(e) => {
                  setFilters(prev => ({ ...prev, purchaseNo: e.target.value }));
                }}
              />
            </div>

            {/* Filter Actions */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <Button
                type="primary"
                size="large"
                icon={<FilterOutlined />}
                onClick={handleApplyFilters}
                style={{ flex: 1 }}
              >
                Apply Filter
              </Button>
              <Button
                size="large"
                icon={<ClearOutlined />}
                onClick={handleClearFilters}
                style={{ flex: 1 }}
              >
                Clear Filter
              </Button>
            </div>
          </div>
        </Card>

        {/* Results List */}
        <Card
          style={{
            borderRadius: '8px',
            border: 'none',
            boxShadow: 'none',
            backgroundColor: '#ffffff',
          }}
        >
          {loading ? (
            <div style={{ padding: '48px', textAlign: 'center' }}>
              <Spin size="large" />
            </div>
          ) : orders.length === 0 ? (
            <Empty
              description="No orders found"
              style={{ padding: '48px' }}
            />
          ) : (
            <List
              dataSource={orders}
              renderItem={(order) => {
                const orderStore = stores.find(s => s.id === order.store_id);
                const orderCustomer = customers.find(c => c.id === order.customer_id);

                return (
                  <List.Item
                    style={{
                      cursor: 'pointer',
                      padding: '20px',
                      borderRadius: '8px',
                      marginBottom: '12px',
                      backgroundColor: '#fff',
                      border: '1px solid #f0f0f0',
                      transition: 'all 0.2s',
                    }}
                    onClick={() => handleOrderClick(order)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#4A90E2';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(74, 144, 226, 0.08)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#f0f0f0';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{ width: '100%' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <div>
                          <Text strong style={{ fontSize: '16px', color: '#1a1a1a' }}>
                            {order.id}
                          </Text>
                          <div style={{ marginTop: '4px' }}>
                            <Text style={{ fontSize: '14px', color: '#666' }}>
                              {dayjs(order.order_date).format('DD MMM YYYY, HH:mm')}
                            </Text>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <Text
                            style={{
                              fontSize: '18px',
                              fontWeight: 600,
                              color: '#1a1a1a',
                            }}
                          >
                            ฿{order.total.toLocaleString()}
                          </Text>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '24px', fontSize: '14px', color: '#666' }}>
                        <div>
                          <Text style={{ color: '#999' }}>Store: </Text>
                          <Text>{orderStore?.name || 'N/A'}</Text>
                        </div>
                        <div>
                          <Text style={{ color: '#999' }}>Customer: </Text>
                          <Text>
                            {orderCustomer
                              ? `${orderCustomer.first_name} ${orderCustomer.last_name}`
                              : 'N/A'}
                          </Text>
                        </div>
                      </div>
                    </div>
                  </List.Item>
                );
              }}
            />
          )}
        </Card>
      </div>

      {/* Order Detail Drawer */}
      {selectedOrder && (
        <OrderDetailDrawer
          open={orderDetailDrawerOpen}
          onClose={() => {
            setOrderDetailDrawerOpen(false);
            setSelectedOrder(null);
          }}
          order={selectedOrder}
          stores={stores}
        />
      )}
    </div>
  );
}

// Order Detail Drawer Component
interface OrderDetailDrawerProps {
  open: boolean;
  onClose: () => void;
  order: OfflineOrder;
  stores: Store[];
}

function OrderDetailDrawer({ open, onClose, order, stores }: OrderDetailDrawerProps) {
  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const store = stores.find(s => s.id === order.store_id);

  useEffect(() => {
    if (order.customer_id) {
      apiClient.get<CustomerProfile>(`/customer/${order.customer_id}`).then(response => {
        if (response.success && response.data) {
          setCustomer(response.data);
        }
      });
    }
  }, [order.customer_id]);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      placement="right"
      width={typeof window !== 'undefined' && window.innerWidth >= 768 ? 480 : '100%'}
      title="Order Details"
      styles={{
        body: { padding: '24px' },
        header: { padding: '16px 24px', borderBottom: '1px solid #f0f0f0' },
      }}
    >
      <div>
        <div style={{ marginBottom: '24px' }}>
          <Text style={{ fontSize: '14px', color: '#999', display: 'block', marginBottom: '4px' }}>
            Purchase No
          </Text>
          <Text style={{ fontSize: '18px', fontWeight: 500, color: '#1a1a1a' }}>
            {order.id}
          </Text>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <Text style={{ fontSize: '14px', color: '#999', display: 'block', marginBottom: '4px' }}>
            Purchase Date & Time
          </Text>
          <Text style={{ fontSize: '16px', color: '#1a1a1a' }}>
            {dayjs(order.order_date).format('DD MMMM YYYY, HH:mm')}
          </Text>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <Text style={{ fontSize: '14px', color: '#999', display: 'block', marginBottom: '4px' }}>
            Store / Branch
          </Text>
          <Text style={{ fontSize: '16px', color: '#1a1a1a' }}>
            {store?.name || 'N/A'}
          </Text>
          {store?.address && (
            <Text style={{ fontSize: '14px', color: '#666', display: 'block', marginTop: '4px' }}>
              {store.address}
            </Text>
          )}
        </div>

        <div style={{ marginBottom: '24px' }}>
          <Text style={{ fontSize: '14px', color: '#999', display: 'block', marginBottom: '4px' }}>
            Customer
          </Text>
          {customer ? (
            <>
              <Text style={{ fontSize: '16px', color: '#1a1a1a' }}>
                {customer.first_name} {customer.last_name}
              </Text>
              {customer.phone && (
                <Text style={{ fontSize: '14px', color: '#666', display: 'block', marginTop: '4px' }}>
                  Phone: {customer.phone}
                </Text>
              )}
              {customer.member_no && (
                <Text style={{ fontSize: '14px', color: '#666', display: 'block' }}>
                  Member No: {customer.member_no}
                </Text>
              )}
            </>
          ) : (
            <Text style={{ fontSize: '16px', color: '#666' }}>Loading...</Text>
          )}
        </div>

        <div style={{ marginBottom: '24px' }}>
          <Text style={{ fontSize: '14px', color: '#999', display: 'block', marginBottom: '12px' }}>
            Items
          </Text>
          <div style={{ border: '1px solid #f0f0f0', borderRadius: '8px', overflow: 'hidden' }}>
            {order.items.map((item, index) => (
              <div
                key={index}
                style={{
                  padding: '16px',
                  borderBottom: index < order.items.length - 1 ? '1px solid #f0f0f0' : 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <div style={{ flex: 1 }}>
                  <Text style={{ fontSize: '15px', fontWeight: 500, color: '#1a1a1a', display: 'block' }}>
                    {item.product_name}
                  </Text>
                  <Text style={{ fontSize: '13px', color: '#666', display: 'block', marginTop: '4px' }}>
                    {item.product_code}
                  </Text>
                  <Text style={{ fontSize: '14px', color: '#666', display: 'block', marginTop: '4px' }}>
                    Qty: {item.quantity} × ฿{item.unit_price.toLocaleString()}
                  </Text>
                </div>
                <Text style={{ fontSize: '16px', fontWeight: 500, color: '#1a1a1a' }}>
                  ฿{item.total_price.toLocaleString()}
                </Text>
              </div>
            ))}
          </div>
        </div>

        <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <Text style={{ fontSize: '15px', color: '#666' }}>Subtotal</Text>
            <Text style={{ fontSize: '15px', color: '#1a1a1a' }}>฿{order.subtotal.toLocaleString()}</Text>
          </div>
          {order.discount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <Text style={{ fontSize: '15px', color: '#666' }}>Discount</Text>
              <Text style={{ fontSize: '15px', color: '#1a1a1a' }}>-฿{order.discount.toLocaleString()}</Text>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #f0f0f0' }}>
            <Text style={{ fontSize: '18px', fontWeight: 600, color: '#1a1a1a' }}>Total</Text>
            <Text style={{ fontSize: '20px', fontWeight: 600, color: '#4A90E2' }}>
              ฿{order.total.toLocaleString()}
            </Text>
          </div>
        </div>

      </div>
    </Drawer>
  );
}

