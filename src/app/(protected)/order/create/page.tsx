'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Form, Input, Button, message, Select, Table, Typography, Space } from 'antd';
import { PlusOutlined, DeleteOutlined, CalendarOutlined, DownOutlined } from '@ant-design/icons';
import { PageHeader } from '@/components/layout/page_header';
import { BackButton } from '@/components/common/back_button';
import { StorePickerDrawer } from '@/components/common/store_picker_drawer';
import { ProductPickerDrawer } from '@/components/common/product_picker_drawer';
import { DatePickerDrawer } from '@/components/common/date_picker_drawer';
import { apiClient } from '@/lib/api_client';
import { Store } from '@/mock/store';
import { Product } from '@/mock/product';
import { CustomerProfile } from '@/mock/customer';
import dayjs, { Dayjs } from 'dayjs';

const { Option } = Select;
const { Text } = Typography;

interface OrderItem {
  product_id: string;
  product_code: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export default function CreateOrderPage() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [stores, setStores] = useState<Store[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<CustomerProfile[]>([]);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [storePickerOpen, setStorePickerOpen] = useState(false);
  const [productPickerOpen, setProductPickerOpen] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [storesResponse, productsResponse] = await Promise.all([
          apiClient.get<Store[]>('/store/list'),
          apiClient.get<Product[]>('/product/list'),
        ]);

        if (storesResponse.success && storesResponse.data) {
          setStores(storesResponse.data);
        }

        if (productsResponse.success && productsResponse.data) {
          setProducts(productsResponse.data);
        }
      } catch (error) {
        message.error('Failed to load data');
      }
    };

    fetchData();
  }, []);

  const handleSearchCustomer = async (value: string) => {
    if (!value || value.trim() === '') {
      setCustomers([]);
      return;
    }

    try {
      const response = await apiClient.get<CustomerProfile[]>(`/customer/search?q=${encodeURIComponent(value)}`);

      if (response.success && response.data) {
        setCustomers(response.data);
      } else {
        setCustomers([]);
      }
    } catch (error) {
      setCustomers([]);
    }
  };

  const handleCustomerSelect = (value: string) => {
    setSelectedCustomerId(value);
    form.setFieldValue('customer_id', value);
  };

  const handleAddProduct = () => {
    setProductPickerOpen(true);
  };

  const handleProductSelect = (productIds: string[]) => {
    if (!productIds || productIds.length === 0) return;

    // Process all selected products at once
    setItems(prevItems => {
      const updatedItems = [...prevItems];
      const newItems: OrderItem[] = [];

      productIds.forEach(productId => {
        const product = products.find((p) => p.id === productId);
        if (!product) return;

        const existingIndex = updatedItems.findIndex((item) => item.product_id === productId);
        if (existingIndex >= 0) {
          // If product already exists, increase quantity
          const existingItem = updatedItems[existingIndex];
          updatedItems[existingIndex] = {
            ...existingItem,
            quantity: existingItem.quantity + 1,
            total_price: (existingItem.quantity + 1) * existingItem.unit_price,
          };
        } else {
          // Add new product to items
          const newItem: OrderItem = {
            product_id: product.id,
            product_code: product.code,
            product_name: product.name,
            quantity: 1,
            unit_price: product.price,
            total_price: product.price,
          };
          newItems.push(newItem);
        }
      });

      return [...updatedItems, ...newItems];
    });
  };

  const handleRemoveItem = (productId: string) => {
    setItems(items.filter((item) => item.product_id !== productId));
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    const updatedItems = items.map((item) =>
      item.product_id === productId
        ? {
            ...item,
            quantity,
            total_price: quantity * item.unit_price,
          }
        : item
    );
    setItems(updatedItems);
  };

  const handleSubmit = async (values: {
    customer_id?: string;
    store_id: string;
    order_date: Dayjs;
    discount?: number;
  }) => {
    if (items.length === 0) {
      message.error('Please add at least one product');
      return;
    }

    if (!selectedCustomerId && !values.customer_id) {
      message.error('Please select a customer');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post('/order/create', {
        customer_id: selectedCustomerId || values.customer_id,
        store_id: values.store_id,
        order_date: values.order_date.format('YYYY-MM-DD'),
        items,
        discount: values.discount || 0,
      });

      if (response.success) {
        message.success('Order created successfully');
        router.push('/');
      } else {
        message.error(response.error || 'Failed to create order');
      }
    } catch (error) {
      message.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const subtotal = items.reduce((sum, item) => sum + item.total_price, 0);
  const discount = Form.useWatch('discount', form) || 0;
  const total = subtotal - discount;

  const columns = [
    {
      title: 'Product',
      dataIndex: 'product_name',
      key: 'product_name',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (_: number, record: OrderItem) => (
        <Input
          type="number"
          min={1}
          value={record.quantity}
          onChange={(e) => handleQuantityChange(record.product_id, parseInt(e.target.value) || 1)}
          style={{ width: '80px' }}
        />
      ),
    },
    {
      title: 'Unit Price',
      dataIndex: 'unit_price',
      key: 'unit_price',
      render: (price: number) => `฿${price.toLocaleString()}`,
    },
    {
      title: 'Total',
      dataIndex: 'total_price',
      key: 'total_price',
      render: (price: number) => `฿${price.toLocaleString()}`,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: unknown, record: OrderItem) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleRemoveItem(record.product_id)}
        />
      ),
    },
  ];


  return (
    <div className="page-container">
      <div style={{ width: '100%', maxWidth: '1040px', margin: '0 auto' }}>
        <BackButton />
        <PageHeader
          title="Create Offline Order"
          subtitle="Create order for customer purchase"
        />

        <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
        >
          <Form.Item
            name="customer_id"
            label="Customer"
            rules={[{ required: true, message: 'Please select a customer' }]}
          >
            <Select
              size="large"
              placeholder="Search customer..."
              showSearch
              onSearch={handleSearchCustomer}
              filterOption={false}
              notFoundContent={customers.length === 0 ? 'No customers found' : null}
              onSelect={handleCustomerSelect}
              value={selectedCustomerId}
            >
              {customers.map((customer) => (
                <Option key={customer.id} value={customer.id}>
                  {customer.first_name} {customer.last_name} ({customer.phone})
                </Option>
              ))}
            </Select>
            <div style={{ marginTop: '8px' }}>
              <Button
                type="link"
                onClick={() => router.push('/customer/register')}
              >
                Register New Customer
              </Button>
            </div>
          </Form.Item>

          <Form.Item
            name="store_id"
            label="Store / Counter"
            rules={[{ required: true, message: 'Please select store' }]}
          >
            <div onClick={() => setStorePickerOpen(true)} style={{ cursor: 'pointer' }}>
              <Input
                size="large"
                placeholder="Select store"
                readOnly
                value={
                  stores.find((s) => s.id === form.getFieldValue('store_id'))?.name || ''
                }
                suffix={<DownOutlined style={{ color: '#999' }} />}
                style={{ cursor: 'pointer', pointerEvents: 'none' }}
              />
            </div>
            <StorePickerDrawer
              open={storePickerOpen}
              onClose={() => setStorePickerOpen(false)}
              value={form.getFieldValue('store_id')}
              onChange={(storeId) => {
                form.setFieldValue('store_id', storeId || '');
              }}
              stores={stores}
            />
          </Form.Item>

          <Form.Item
            name="order_date"
            label="Purchase Date"
            rules={[{ required: true, message: 'Please select purchase date' }]}
          >
            <div onClick={() => setDatePickerOpen(true)} style={{ cursor: 'pointer' }}>
              <Input
                size="large"
                placeholder="Select date"
                readOnly
                value={
                  form.getFieldValue('order_date')
                    ? form.getFieldValue('order_date').format('YYYY-MM-DD')
                    : ''
                }
                suffix={<CalendarOutlined style={{ color: '#999' }} />}
                style={{ cursor: 'pointer', pointerEvents: 'none' }}
              />
            </div>
            <DatePickerDrawer
              open={datePickerOpen}
              onClose={() => setDatePickerOpen(false)}
              value={form.getFieldValue('order_date')}
              onChange={(date) => {
                form.setFieldValue('order_date', date);
              }}
              maxDate={dayjs()}
              title="Select Purchase Date"
            />
          </Form.Item>

          <Form.Item label="Products">
            <Button
              type="dashed"
              block
              icon={<PlusOutlined />}
              onClick={handleAddProduct}
              size="large"
            >
              Add Product
            </Button>
            <ProductPickerDrawer
              open={productPickerOpen}
              onClose={() => setProductPickerOpen(false)}
              value={items.map(item => item.product_id)}
              onChange={handleProductSelect}
              products={products}
              multiple={true}
            />
          </Form.Item>

          {items.length > 0 && (
            <Form.Item>
              <Table
                dataSource={items}
                columns={columns}
                pagination={false}
                rowKey="product_id"
              />
            </Form.Item>
          )}

          {items.length > 0 && (
            <>
              <Form.Item label="Subtotal">
                <Text strong style={{ fontSize: '18px' }}>
                  ฿{subtotal.toLocaleString()}
                </Text>
              </Form.Item>

              <Form.Item name="discount" label="Discount (฿)">
                <Input
                  type="number"
                  size="large"
                  placeholder="0"
                  min={0}
                  max={subtotal}
                />
              </Form.Item>

              <Form.Item label="Total">
                <Text strong style={{ fontSize: '24px', color: '#4A90E2' }}>
                  ฿{total.toLocaleString()}
                </Text>
              </Form.Item>
            </>
          )}

          <Form.Item>
            <Button
              type="primary"
              block
              size="large"
              htmlType="submit"
              loading={loading}
              disabled={items.length === 0}
            >
              Create Order
            </Button>
          </Form.Item>
        </Form>
      </Card>
      </div>
    </div>
  );
}

