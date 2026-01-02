'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Button, Descriptions } from 'antd';
import { PageHeader } from '@/components/layout/page_header';
import { BackButton } from '@/components/common/back_button';
import { StepIndicator } from '@/components/common/step_indicator';
import dayjs from 'dayjs';

interface RegistrationData {
  first_name: string;
  last_name: string;
  phone: string;
  email?: string;
  dob?: string;
  gender?: 'male' | 'female' | 'other';
}

export default function ReviewPage() {
  const router = useRouter();
  const [registrationData, setRegistrationData] = useState<RegistrationData | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Read registration data from sessionStorage
    const first_name = sessionStorage.getItem('registration_first_name');
    const last_name = sessionStorage.getItem('registration_last_name');
    const phone = sessionStorage.getItem('registration_phone');

    if (!first_name || !last_name || !phone) {
      router.push('/customer/register');
      return;
    }

    const email = sessionStorage.getItem('registration_email') || undefined;
    const dob = sessionStorage.getItem('registration_dob') || undefined;
    const gender = (sessionStorage.getItem('registration_gender') as 'male' | 'female' | 'other' | undefined) || undefined;

    setRegistrationData({
      first_name,
      last_name,
      phone,
      email,
      dob,
      gender,
    });
  }, [router]);

  const handleConfirm = () => {
    router.push('/customer/register/terms');
  };

  const handleBack = () => {
    router.push('/customer/register');
  };

  if (!registrationData) {
    return null;
  }

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

      {/* Primary Title */}
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
      <StepIndicator steps={registrationSteps} currentStep={2} />

      <PageHeader
        title="Review Information"
        subtitle="Step 2: Customer review and confirm"
      />

      <Card>
        <Descriptions column={1} bordered>
          <Descriptions.Item label="First Name">{registrationData.first_name}</Descriptions.Item>
          <Descriptions.Item label="Last Name">{registrationData.last_name}</Descriptions.Item>
          <Descriptions.Item label="Phone Number">{registrationData.phone}</Descriptions.Item>
          {registrationData.email && (
            <Descriptions.Item label="Email">{registrationData.email}</Descriptions.Item>
          )}
          {registrationData.dob && (
            <Descriptions.Item label="Date of Birth">
              {dayjs(registrationData.dob).format('DD MMM YYYY')}
            </Descriptions.Item>
          )}
          {registrationData.gender && (
            <Descriptions.Item label="Gender">
              {registrationData.gender === 'male' ? 'Male' : registrationData.gender === 'female' ? 'Female' : 'Other'}
            </Descriptions.Item>
          )}
        </Descriptions>

        <div style={{ marginTop: 24, display: 'flex', gap: '12px' }}>
          <Button
            block
            size="large"
            onClick={handleBack}
            style={{ flex: 1 }}
          >
            Back to Edit
          </Button>
          <Button
            type="primary"
            block
            size="large"
            onClick={handleConfirm}
            style={{ flex: 1 }}
          >
            Confirm Information
          </Button>
        </div>
      </Card>
      </div>
    </div>
  );
}

