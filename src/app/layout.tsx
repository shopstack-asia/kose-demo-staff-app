import type { Metadata } from 'next';
import { ConfigProvider } from 'antd';
import { AuthProvider } from '@/lib/auth_context';
import './globals.css';

export const metadata: Metadata = {
  title: 'KOSE Staff App',
  description: 'KOSE Staff Web Application for retail counters',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#4A90E2',
              borderRadius: 8,
            },
          }}
        >
          <AuthProvider>
            {children}
          </AuthProvider>
        </ConfigProvider>
      </body>
    </html>
  );
}

