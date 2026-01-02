'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Button, Typography, message, Spin } from 'antd';
import { PageHeader } from '@/components/layout/page_header';
import { BackButton } from '@/components/common/back_button';
import { StepIndicator } from '@/components/common/step_indicator';
import { OtpInput } from '@/components/common/otp_input';
import { apiClient } from '@/lib/api_client';

const { Title, Text } = Typography;

type VerificationStep = 'phone' | 'email';

export default function VerifyPage() {
  const router = useRouter();
  const [step, setStep] = useState<VerificationStep>('phone');
  const [phoneOtp, setPhoneOtp] = useState('');
  const [emailOtp, setEmailOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [refCode, setRefCode] = useState<string | null>(null);
  const [phone, setPhone] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const phoneValue = sessionStorage.getItem('registration_phone');
    const emailValue = sessionStorage.getItem('registration_email');

    if (!phoneValue) {
      router.push('/customer/register');
      return;
    }

    setPhone(phoneValue);
    setEmail(emailValue || null);

    // Send initial phone OTP
    sendOtp('phone', phoneValue, emailValue || null);
  }, [router]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const sendOtp = async (type: 'phone' | 'email', phoneValue?: string | null, emailValue?: string | null) => {
    const pValue = phoneValue !== undefined ? phoneValue : phone;
    const eValue = emailValue !== undefined ? emailValue : email;

    if (type === 'phone' && !pValue) return;
    if (type === 'email' && !eValue) return;

    try {
      const response = await apiClient.post<{ ref_code?: string; mock_otp?: string }>('/otp/send', {
        type,
        phone: type === 'phone' ? pValue : undefined,
        email: type === 'email' ? eValue : undefined,
      });

      if (response.success) {
        message.success(response.message || 'OTP sent');
        setCountdown(60);
        if (response.data?.ref_code) {
          setRefCode(response.data.ref_code);
        }
      } else {
        message.error(response.error || 'Failed to send OTP');
      }
    } catch (error) {
      message.error('Failed to send OTP');
    }
  };

  const handleVerify = async (otp: string, type: 'phone' | 'email') => {
    if (otp.length !== 6) return;

    setLoading(true);
    try {
      const response = await apiClient.post('/otp/verify', {
        type,
        otp,
        phone: type === 'phone' ? phone : undefined,
        email: type === 'email' ? email : undefined,
      });

      if (response.success) {
        if (type === 'phone') {
          // Move to email verification if email exists
          if (email) {
            setStep('email');
            setPhoneOtp('');
            await sendOtp('email');
            message.success('Phone verified. Please verify email.');
          } else {
            // No email, complete registration
            await completeRegistration();
          }
        } else {
          // Email verified, complete registration
          await completeRegistration();
        }
      } else {
        message.error(response.error || 'Invalid OTP code');
      }
    } catch (error) {
      message.error('Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const completeRegistration = async () => {
    if (typeof window === 'undefined') return;

    try {
      // Get all registration data from sessionStorage
      const first_name = sessionStorage.getItem('registration_first_name');
      const last_name = sessionStorage.getItem('registration_last_name');
      const phoneValue = sessionStorage.getItem('registration_phone');
      const emailValue = sessionStorage.getItem('registration_email');
      const dob = sessionStorage.getItem('registration_dob');
      const gender = sessionStorage.getItem('registration_gender') as 'male' | 'female' | 'other' | null;
      const termsAccepted = sessionStorage.getItem('registration_terms_accepted') === 'true';
      const dataProcessingConsent = sessionStorage.getItem('registration_data_processing_consent') === 'true';
      const marketingConsent = sessionStorage.getItem('registration_marketing_consent') === 'true';

      if (!first_name || !last_name || !phoneValue) {
        message.error('Missing registration data');
        return;
      }

      // Create customer with all data at once
      const response = await apiClient.post('/customer/create', {
        first_name,
        last_name,
        phone: phoneValue,
        email: emailValue || undefined,
        dob: dob || undefined,
        gender: gender || undefined,
        terms_accepted: termsAccepted,
        data_processing_consent: dataProcessingConsent,
        marketing_consent: marketingConsent,
        phone_verified: true,
        email_verified: emailValue ? true : false,
      });

      if (response.success) {
        // Clear session storage
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('registration_first_name');
          sessionStorage.removeItem('registration_last_name');
          sessionStorage.removeItem('registration_phone');
          sessionStorage.removeItem('registration_email');
          sessionStorage.removeItem('registration_dob');
          sessionStorage.removeItem('registration_gender');
          sessionStorage.removeItem('registration_terms_accepted');
          sessionStorage.removeItem('registration_data_processing_consent');
          sessionStorage.removeItem('registration_marketing_consent');
        }
        // Redirect to success page immediately
        router.push('/customer/register/complete');
      } else {
        message.error(response.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      message.error('Registration failed');
    }
  };

  const handleResend = async () => {
    if (countdown > 0 || !phone) return;
    if (step === 'phone') {
      await sendOtp('phone');
    } else {
      await sendOtp('email');
    }
  };

  if (!phone) {
    return (
      <div className="page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  const isPhoneStep = step === 'phone';
  const currentOtp = isPhoneStep ? phoneOtp : emailOtp;
  const setCurrentOtp = isPhoneStep ? setPhoneOtp : setEmailOtp;
  const maskedContact = isPhoneStep
    ? `****${phone?.slice(-4)}`
    : email
    ? `${email?.split('@')[0]?.slice(0, 2)}****@${email?.split('@')[1]}`
    : '';

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
      <StepIndicator steps={registrationSteps} currentStep={4} />

      <PageHeader
        title="Verify Contact"
        subtitle={`Step 4: Verify ${isPhoneStep ? 'Phone' : 'Email'}`}
      />

      <Card>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Title level={4}>Enter OTP sent to</Title>
          <Text style={{ fontSize: '18px', fontWeight: 500 }}>{maskedContact}</Text>
        </div>

        <OtpInput
          value={currentOtp}
          onChange={(value) => {
            setCurrentOtp(value);
            if (value.length === 6) {
              handleVerify(value, isPhoneStep ? 'phone' : 'email');
            }
          }}
          disabled={loading}
        />

        {refCode && (
          <div style={{ marginTop: 16, textAlign: 'center' }}>
            <Text style={{ color: '#999', fontSize: '12px' }}>
              For testing: Use OTP code <strong style={{ color: '#4A90E2' }}>123456</strong>
            </Text>
            <br />
            <Text style={{ color: '#999', fontSize: '12px' }}>
              Ref Code: <strong style={{ color: '#4A90E2' }}>{refCode}</strong>
            </Text>
          </div>
        )}

        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <Text style={{ color: '#666', marginBottom: 8, display: 'block' }}>
            Didn&apos;t receive the code?
          </Text>
          {countdown > 0 ? (
            <Text style={{ color: '#999' }}>
              Resend in {countdown}s
            </Text>
          ) : (
            <Button type="link" onClick={handleResend} disabled={loading} style={{ padding: 0 }}>
              Resend OTP
            </Button>
          )}
        </div>

        <div style={{ marginTop: 32 }}>
          <Button
            type="primary"
            block
            size="large"
            onClick={() => handleVerify(currentOtp, isPhoneStep ? 'phone' : 'email')}
            disabled={currentOtp.length !== 6}
            loading={loading}
          >
            Verify & Complete Registration
          </Button>
        </div>
      </Card>
      </div>
    </div>
  );
}

