'use client';

import { useRouter } from 'next/navigation';
import { Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

export function BackButton() {
  const router = useRouter();

  return (
    <div style={{ marginBottom: '24px', textAlign: 'left' }}>
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={() => router.push('/')}
        style={{
          color: '#666',
          padding: '4px 8px',
          height: 'auto',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '14px',
        }}
      >
        Back to Menu
      </Button>
    </div>
  );
}


