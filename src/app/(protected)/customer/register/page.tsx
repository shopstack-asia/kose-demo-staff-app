'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Form, Input, Button, message, Typography } from 'antd';
import { CalendarOutlined, DownOutlined } from '@ant-design/icons';
import { DatePickerDrawer } from '@/components/common/date_picker_drawer';
import { GenderPickerDrawer } from '@/components/common/gender_picker_drawer';
import { StepIndicator } from '@/components/common/step_indicator';
import { BackButton } from '@/components/common/back_button';
import dayjs, { Dayjs } from 'dayjs';

const { Text } = Typography;

export default function RegisterPage() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [genderPickerOpen, setGenderPickerOpen] = useState(false);

  const handleSubmit = async (values: {
    first_name: string;
    last_name: string;
    phone: string;
    email?: string;
    dob?: Dayjs;
    gender?: 'male' | 'female' | 'other';
  }) => {
    // Store registration data in sessionStorage (don't create customer yet)
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('registration_first_name', values.first_name);
      sessionStorage.setItem('registration_last_name', values.last_name);
      sessionStorage.setItem('registration_phone', values.phone);
      if (values.email) {
        sessionStorage.setItem('registration_email', values.email);
      }
      if (values.dob) {
        sessionStorage.setItem('registration_dob', values.dob.format('YYYY-MM-DD'));
      }
      if (values.gender) {
        sessionStorage.setItem('registration_gender', values.gender);
      }
    }
    router.push(`/customer/register/review`);
  };

  const registrationSteps = [
    { number: 1, label: 'Enter Information' },
    { number: 2, label: 'Review & Confirm' },
    { number: 3, label: 'Terms & Conditions' },
    { number: 4, label: 'Verify OTP' },
    { number: 5, label: 'Completed' },
  ];

  return (
    <div className="page-container">
      <div style={{ width: '100%', maxWidth: '1040px', margin: '0 auto' }}>
        <BackButton />

        {/* Primary Title - Clear Focus */}
        <div style={{ marginBottom: '40px', textAlign: 'left' }}>
          <h1
            style={{
              fontSize: '32px',
              fontWeight: 400,
              color: '#1a1a1a',
              letterSpacing: '-0.02em',
              lineHeight: '40px',
              margin: 0,
              padding: 0,
              marginBottom: '8px',
            }}
          >
            Customer Registration
          </h1>
        </div>

        {/* Step Indicator */}
        <StepIndicator steps={registrationSteps} currentStep={1} />

        {/* Form Card - Dominant, Solid, Comfortable */}
        <Card
          style={{
            width: '100%',
            borderRadius: '8px',
            border: 'none',
            boxShadow: 'none',
            backgroundColor: '#ffffff',
            padding: '0',
          }}
          bodyStyle={{
            padding: '32px 24px',
          }}
          className="registration-form-card"
        >
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
            <Button
              type="primary"
              block
              size="large"
              htmlType="submit"
            >
              Next: Review with Customer
            </Button>
          </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
}

