'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, Form, Input, Button, message, Spin } from 'antd';
import { CalendarOutlined, DownOutlined } from '@ant-design/icons';
import { PageHeader } from '@/components/layout/page_header';
import { BackButton } from '@/components/common/back_button';
import { DatePickerDrawer } from '@/components/common/date_picker_drawer';
import { GenderPickerDrawer } from '@/components/common/gender_picker_drawer';
import { apiClient } from '@/lib/api_client';
import { CustomerProfile } from '@/mock/customer';
import dayjs, { Dayjs } from 'dayjs';

export default function EditCustomerPage() {
  const router = useRouter();
  const params = useParams();
  const customerId = params.id as string;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [genderPickerOpen, setGenderPickerOpen] = useState(false);

  useEffect(() => {
    if (!customerId) return;

    const fetchCustomer = async () => {
      try {
        const response = await apiClient.get<CustomerProfile>(`/customer/${customerId}`);
        if (response.success && response.data) {
          const customer = response.data;
          form.setFieldsValue({
            first_name: customer.first_name,
            last_name: customer.last_name,
            phone: customer.phone,
            email: customer.email,
            dob: customer.dob ? dayjs(customer.dob) : undefined,
            gender: customer.gender,
          });
        } else {
          message.error('Failed to load customer');
          router.push('/customer/search');
        }
      } catch (error) {
        message.error('An error occurred');
        router.push('/customer/search');
      } finally {
        setFetching(false);
      }
    };

    fetchCustomer();
  }, [customerId, router, form]);

  const handleSubmit = async (values: {
    first_name: string;
    last_name: string;
    phone: string;
    email?: string;
    dob?: Dayjs;
    gender?: 'male' | 'female' | 'other';
  }) => {
    setLoading(true);
    try {
      const response = await apiClient.patch(`/customer/${customerId}`, {
        first_name: values.first_name,
        last_name: values.last_name,
        phone: values.phone,
        email: values.email || undefined,
        dob: values.dob ? values.dob.format('YYYY-MM-DD') : undefined,
        gender: values.gender,
      });

      if (response.success) {
        message.success('Customer updated successfully');
        router.push(`/customer/${customerId}`);
      } else {
        message.error(response.error || 'Failed to update customer');
      }
    } catch (error) {
      message.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="page-container">
      <div style={{ width: '100%', maxWidth: '1040px', margin: '0 auto' }}>
        <BackButton />
        <PageHeader
          title="Edit Customer"
          subtitle="Update customer information"
        />

        <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
        >
          <Form.Item
            name="first_name"
            label="First Name"
            rules={[{ required: true, message: 'Please enter first name' }]}
          >
            <Input size="large" placeholder="First Name" />
          </Form.Item>

          <Form.Item
            name="last_name"
            label="Last Name"
            rules={[{ required: true, message: 'Please enter last name' }]}
          >
            <Input size="large" placeholder="Last Name" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone Number"
            rules={[
              { required: true, message: 'Please enter phone number' },
              { pattern: /^[0-9]{10}$/, message: 'Please enter a valid 10-digit phone number' },
            ]}
          >
            <Input size="large" placeholder="0812345678" maxLength={10} />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email (Optional)"
            rules={[
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input size="large" placeholder="email@example.com" />
          </Form.Item>

          <Form.Item name="dob" label="Date of Birth (Optional)">
            <div onClick={() => setDatePickerOpen(true)} style={{ cursor: 'pointer' }}>
              <Input
                size="large"
                placeholder="Select date"
                readOnly
                value={form.getFieldValue('dob') ? form.getFieldValue('dob').format('YYYY-MM-DD') : ''}
                suffix={<CalendarOutlined style={{ color: '#999' }} />}
                style={{ cursor: 'pointer', pointerEvents: 'none' }}
              />
            </div>
            <DatePickerDrawer
              open={datePickerOpen}
              onClose={() => setDatePickerOpen(false)}
              value={form.getFieldValue('dob')}
              onChange={(date) => {
                form.setFieldValue('dob', date);
              }}
              maxDate={dayjs().subtract(13, 'year')}
              title="Select Date of Birth"
            />
          </Form.Item>

          <Form.Item name="gender" label="Gender (Optional)">
            <div onClick={() => setGenderPickerOpen(true)} style={{ cursor: 'pointer' }}>
              <Input
                size="large"
                placeholder="Select gender"
                readOnly
                value={
                  form.getFieldValue('gender') === 'male'
                    ? 'Male'
                    : form.getFieldValue('gender') === 'female'
                    ? 'Female'
                    : form.getFieldValue('gender') === 'other'
                    ? 'Other'
                    : ''
                }
                suffix={<DownOutlined style={{ color: '#999' }} />}
                style={{ cursor: 'pointer', pointerEvents: 'none' }}
              />
            </div>
            <GenderPickerDrawer
              open={genderPickerOpen}
              onClose={() => setGenderPickerOpen(false)}
              value={form.getFieldValue('gender')}
              onChange={(value) => {
                form.setFieldValue('gender', value);
              }}
            />
          </Form.Item>

          <Form.Item>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Button
                block
                size="large"
                onClick={() => router.back()}
                style={{ flex: 1 }}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                block
                size="large"
                htmlType="submit"
                loading={loading}
                style={{ flex: 1 }}
              >
                Save Changes
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
      </div>
    </div>
  );
}

