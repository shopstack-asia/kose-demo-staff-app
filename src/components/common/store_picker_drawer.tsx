'use client';

import React from 'react';
import { Drawer } from 'antd';
import { Store } from '@/mock/store';

interface StorePickerDrawerProps {
  open: boolean;
  onClose: () => void;
  value?: string; // store id
  onChange?: (storeId: string | null) => void;
  stores: Store[];
  title?: string;
}

export function StorePickerDrawer({
  open,
  onClose,
  value,
  onChange,
  stores,
  title = 'Select Store / Counter',
}: StorePickerDrawerProps) {
  const [tempValue, setTempValue] = React.useState<string | null>(value || null);

  React.useEffect(() => {
    setTempValue(value || null);
  }, [value, open]);

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

  const handleSelect = (storeId: string) => {
    setTempValue(storeId);
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
      <div style={{ padding: '8px 0', maxHeight: '60vh', overflowY: 'auto' }}>
        {stores.map((store, index) => {
          const isSelected = tempValue === store.id;
          const isLast = index === stores.length - 1;
          
          return (
            <button
              key={store.id}
              onClick={() => handleSelect(store.id)}
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
                <span style={{ fontWeight: isSelected ? 600 : 500 }}>{store.name}</span>
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
              {store.address && (
                <span style={{ fontSize: '14px', color: '#666' }}>{store.address}</span>
              )}
            </button>
          );
        })}
      </div>
    </Drawer>
  );
}

