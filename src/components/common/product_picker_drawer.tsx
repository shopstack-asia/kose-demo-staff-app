'use client';

import React from 'react';
import { Drawer } from 'antd';
import { Product } from '@/mock/product';

interface ProductPickerDrawerProps {
  open: boolean;
  onClose: () => void;
  value?: string[]; // product ids (for multi-select)
  onChange?: (productIds: string[]) => void;
  products: Product[];
  title?: string;
  multiple?: boolean; // allow multiple selection
}

export function ProductPickerDrawer({
  open,
  onClose,
  value,
  onChange,
  products,
  title = 'Select Product',
  multiple = true,
}: ProductPickerDrawerProps) {
  const [tempValue, setTempValue] = React.useState<string[]>(value || []);
  const [drawerLeft, setDrawerLeft] = React.useState<string>('auto');

  React.useEffect(() => {
    setTempValue(value || []);
  }, [value, open]);

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

  const handleConfirm = () => {
    if (onChange) {
      onChange(tempValue);
    }
    onClose();
  };

  const handleCancel = () => {
    setTempValue(value || []);
    onClose();
  };

  const handleSelect = (productId: string) => {
    if (multiple) {
      // Toggle selection for multiple mode
      if (tempValue.includes(productId)) {
        setTempValue(tempValue.filter(id => id !== productId));
      } else {
        setTempValue([...tempValue, productId]);
      }
    } else {
      // Single selection mode
      setTempValue([productId]);
    }
  };

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
            disabled={tempValue.length === 0}
            style={{
              flex: 1,
              padding: '16px',
              backgroundColor: tempValue.length > 0 ? '#4A90E2' : '#ccc',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 500,
              cursor: tempValue.length > 0 ? 'pointer' : 'not-allowed',
            }}
          >
            {multiple ? `Confirm (${tempValue.length})` : 'Confirm'}
          </button>
        </div>
      }
      closeIcon={null}
    >
      <div style={{ padding: '8px 0', maxHeight: '60vh', overflowY: 'auto' }}>
        {products.map((product, index) => {
          const isSelected = tempValue.includes(product.id);
          const isLast = index === products.length - 1;
          
          return (
            <button
              key={product.id}
              onClick={() => handleSelect(product.id)}
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
                alignItems: 'center',
                gap: '16px',
                transition: 'background-color 0.2s',
              }}
            >
              <div style={{ flexShrink: 0 }}>
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    width={60}
                    height={60}
                    style={{
                      width: '60px',
                      height: '60px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      backgroundColor: '#f5f5f5',
                    }}
                    onError={(e) => {
                      // Hide image and show placeholder if fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '8px',
                      backgroundColor: '#f5f5f5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#999',
                      fontSize: '24px',
                    }}
                  >
                    📦
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '4px', flex: 1, minWidth: 0 }}>
                <span style={{ fontWeight: isSelected ? 600 : 500 }}>{product.name}</span>
                <span style={{ fontSize: '14px', color: '#666' }}>
                  {product.brand} • ฿{product.price.toLocaleString()}
                </span>
              </div>
              {isSelected && (
                <div style={{ flexShrink: 0 }}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M16.667 5L7.5 14.167L3.333 10"
                      stroke="#4A90E2"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </Drawer>
  );
}

