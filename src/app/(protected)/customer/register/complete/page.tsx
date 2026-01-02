'use client';

import { useRouter } from 'next/navigation';
import { Card, Button, Typography } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import { BackButton } from '@/components/common/back_button';
import { StepIndicator } from '@/components/common/step_indicator';

const { Title, Paragraph } = Typography;

export default function CompletePage() {
  const router = useRouter();

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
      <StepIndicator steps={registrationSteps} currentStep={5} />

      <Card style={{ textAlign: 'center', padding: '48px 24px' }}>
        <CheckCircleOutlined
          style={{
            fontSize: '80px',
            color: '#4A90E2',
            marginBottom: '24px',
          }}
        />
        <Title level={2} style={{ marginBottom: 16 }}>
          Registration Completed!
        </Title>
        <Paragraph style={{ fontSize: '16px', color: '#666', marginBottom: 32 }}>
          Customer has been successfully registered and is now active.
          You can now create offline orders for this customer.
        </Paragraph>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Button
            size="large"
            onClick={() => router.push('/customer/register')}
          >
            Register Another Customer
          </Button>
          <Button
            type="primary"
            size="large"
            onClick={() => router.push('/')}
          >
            Back to Home
          </Button>
        </div>
      </Card>
      </div>
    </div>
  );
}

