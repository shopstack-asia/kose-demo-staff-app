'use client';

import { Typography } from 'antd';

const { Text } = Typography;

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div style={{ marginBottom: 32, padding: '0 16px', marginTop: 24 }}>
      <Text
        style={{
          display: 'block',
          fontSize: '28px',
          fontWeight: 400,
          color: '#1a1a1a',
          letterSpacing: '-0.02em',
          lineHeight: '36px',
          marginBottom: subtitle ? '8px' : 0,
        }}
      >
        {title}
      </Text>
      {subtitle && (
        <Text
          style={{
            display: 'block',
            fontSize: '15px',
            color: '#8c8c8c',
            lineHeight: '22px',
            fontWeight: 400,
          }}
        >
          {subtitle}
        </Text>
      )}
    </div>
  );
}

