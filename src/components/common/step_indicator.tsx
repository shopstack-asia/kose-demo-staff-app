'use client';

import { Typography } from 'antd';

const { Text } = Typography;

interface Step {
  number: number;
  label: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        gap: '16px',
        marginBottom: '40px',
        width: '100%',
        padding: '0 16px',
      }}
    >
      {steps.map((step, index) => {
        const isActive = step.number === currentStep;
        const isCompleted = step.number < currentStep;
        const isLast = index === steps.length - 1;

        return (
          <div
            key={step.number}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flex: 1,
              position: 'relative',
            }}
          >
            {/* Connector Line */}
            {!isLast && (
              <div
                style={{
                  position: 'absolute',
                  top: '28px',
                  left: 'calc(50% + 28px)',
                  width: 'calc(100% - 56px)',
                  height: '1px',
                  backgroundColor: '#e8e8e8',
                  zIndex: 0,
                }}
              />
            )}

            {/* Step Badge Container */}
            <div
              style={{
                position: 'relative',
                zIndex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              {/* Dashed Circle */}
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  border: `2px dashed ${isActive ? '#4A90E2' : '#e8e8e8'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'transparent',
                }}
              >
                {/* Solid Badge */}
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: isActive ? '#4A90E2' : isCompleted ? '#4A90E2' : '#f5f5f5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <Text
                    style={{
                      fontSize: '15px',
                      fontWeight: 500,
                      color: isActive || isCompleted ? '#ffffff' : '#999',
                    }}
                  >
                    {step.number}
                  </Text>
                </div>
              </div>

              {/* Step Label */}
              <Text
                style={{
                  fontSize: '13px',
                  color: isActive ? '#4A90E2' : '#999',
                  marginTop: '10px',
                  textAlign: 'center',
                  fontWeight: isActive ? 400 : 300,
                  lineHeight: '18px',
                  maxWidth: '100px',
                }}
              >
                {step.label}
              </Text>
            </div>
          </div>
        );
      })}
    </div>
  );
}

