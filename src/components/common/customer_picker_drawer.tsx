'use client';

import React, { useState, useEffect } from 'react';
import { Drawer, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { CustomerProfile } from '@/mock/customer';

interface CustomerPickerDrawerProps {
  open: boolean;
  onClose: () => void;
  value?: string; // customer id
  onChange?: (customerId: string | null) => void;
  customers: CustomerProfile[];
  onSearch: (query: string) => void;
  title?: string;
}

export function CustomerPickerDrawer({
  open,
  onClose,
  value,
  onChange,
  customers,
  onSearch,
  title = 'Select Customer',
}: CustomerPickerDrawerProps) {
  const [tempValue, setTempValue] = React.useState<string | null>(value || null);
  const [searchQuery, setSearchQuery] = useState('');

  React.useEffect(() => {
    setTempValue(value || null);
  }, [value, open]);

  useEffect(() => {
    if (open) {
      setSearchQuery('');
    }
  }, [open]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch(query);
  };

  const handleConfirm = () => {
    if (tempValue && onChange) {
      onChange(tempValue);
    }
    onClose();
  };

  const handleCancel = () => {
    setTempValue(value || null);
    onClose();
  };

  const handleSelect = (customerId: string) => {
    setTempValue(customerId);
  };

  const [drawerLeft, setDrawerLeft] = React.useState<string>('auto');
  
  React.useEffect(() => {
    if (open && typeof window !== 'undefined') {
      const calculateLeft = () => {
        const viewportWidth = window.innerWidth;
        const drawerMaxWidth = 1040;
        const padding = viewportWidth >= 768 ? 80 : 48;
        const drawerWidth = Math.min(drawerMaxWidth, viewportWidth - padding);
        const calculatedLeft = (viewportWidth - drawerWidth) / 2;
        setDrawerLeft(`${calculatedLeft}px`);
      };
      calculateLeft();
      window.addEventListener('resize', calculateLeft);
      setTimeout(calculateLeft, 100);
      return () => window.removeEventListener('resize', calculateLeft);
    }
  }, [open]);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      placement="bottom"
      height="auto"
      title={title}
      rootClassName="form-aligned-drawer"
      motion={{
        motionName: 'slide-up-fade',
        motionAppear: true,
        motionEnter: true,
        motionLeave: true,
      }}
      styles={{
        body: { padding: '0' },
        header: { padding: '16px 24px', borderBottom: '1px solid #f0f0f0' },
        wrapper: typeof window !== 'undefined' && window.innerWidth >= 768
          ? { maxWidth: '1040px', width: 'calc(100% - 80px)', left: drawerLeft, right: 'auto' }
          : { maxWidth: '1040px', width: 'calc(100% - 48px)', left: drawerLeft, right: 'auto' },
      }}
      footer={
        <div style={{ padding: '16px 24px', borderTop: '1px solid #f0f0f0', display: 'flex', gap: '12px' }}>
          <button
            onClick={handleCancel}
            style={{
              flex: 1,
              padding: '16px',
              backgroundColor: '#fff',
              color: '#333',
              border: '1px solid #d9d9d9',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!tempValue}
            style={{
              flex: 1,
              padding: '16px',
              backgroundColor: tempValue ? '#4A90E2' : '#ccc',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 500,
              cursor: tempValue ? 'pointer' : 'not-allowed',
            }}
          >
            Confirm
          </button>
        </div>
      }
      closeIcon={null}
    >
      <div style={{ padding: '16px 24px', borderBottom: '1px solid #f0f0f0' }}>
        <Input
          size="large"
          placeholder="Search by name, phone, or member number..."
          prefix={<SearchOutlined style={{ color: '#999' }} />}
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ borderRadius: '8px' }}
        />
      </div>
      <div style={{ padding: '8px 0', maxHeight: '60vh', overflowY: 'auto' }}>
        {customers.length === 0 && searchQuery ? (
          <div style={{ padding: '32px 24px', textAlign: 'center', color: '#999' }}>
            No customers found
          </div>
        ) : customers.length === 0 && !searchQuery ? (
          <div style={{ padding: '32px 24px', textAlign: 'center', color: '#999' }}>
            Start typing to search for customers
          </div>
        ) : (
          customers.map((customer, index) => {
            const isSelected = tempValue === customer.id;
            const isLast = index === customers.length - 1;
            
            return (
              <button
                key={customer.id}
                onClick={() => handleSelect(customer.id)}
                style={{
                  width: '100%',
                  padding: '16px 24px',
                  border: 'none',
                  borderBottom: isLast ? 'none' : '1px solid #f0f0f0',
                  backgroundColor: isSelected ? '#f5f5f5' : 'transparent',
                  color: '#333',
                  fontSize: '16px',
                  fontWeight: isSelected ? 500 : 400,
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '4px',
                  transition: 'background-color 0.2s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <div>
                    <span style={{ fontWeight: isSelected ? 600 : 500 }}>
                      {customer.first_name} {customer.last_name}
                    </span>
                    {customer.member_no && (
                      <span style={{ marginLeft: '8px', color: '#666', fontSize: '14px' }}>
                        ({customer.member_no})
                      </span>
                    )}
                  </div>
                  {isSelected && (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M16.667 5L7.5 14.167L3.333 10"
                        stroke="#4A90E2"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
                <div style={{ fontSize: '14px', color: '#666' }}>
                  {customer.phone && <span>Phone: {customer.phone}</span>}
                </div>
              </button>
            );
          })
        )}
      </div>
    </Drawer>
  );
}

