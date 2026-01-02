'use client';

import React, { useState, useEffect } from 'react';
import { Drawer, Button } from 'antd';
import dayjs, { Dayjs } from 'dayjs';

interface DatePickerDrawerProps {
  open: boolean;
  onClose: () => void;
  value?: Dayjs;
  onChange?: (date: Dayjs | null) => void;
  placeholder?: string;
  maxDate?: Dayjs;
  minDate?: Dayjs;
  title?: string;
}

type ViewMode = 'day' | 'month' | 'year';

export function DatePickerDrawer({
  open,
  onClose,
  value,
  onChange,
  placeholder = 'Select date',
  maxDate,
  minDate,
  title = 'Select Date',
}: DatePickerDrawerProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('day');
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(value || null);
  const [viewDate, setViewDate] = useState<Dayjs>(() => {
    if (value && dayjs.isDayjs(value)) return value;
    if (maxDate && dayjs.isDayjs(maxDate)) return maxDate;
    return dayjs();
  });
  const [yearRangeStart, setYearRangeStart] = useState<number>(() => {
    const currentYear = dayjs().year();
    return Math.floor(currentYear / 20) * 20;
  });
  const [drawerLeft, setDrawerLeft] = useState<string>('auto');

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

  // Sync value when prop changes
  useEffect(() => {
    if (value && dayjs.isDayjs(value)) {
      setSelectedDate(value);
      setViewDate(value);
    } else {
      setSelectedDate(null);
      if (maxDate && dayjs.isDayjs(maxDate)) {
        setViewDate(maxDate);
      } else {
        setViewDate(dayjs());
      }
    }
  }, [value, maxDate]);

  // Reset view mode when drawer opens
  useEffect(() => {
    if (open) {
      setViewMode('day');
      let targetDate = dayjs();
      if (value && dayjs.isDayjs(value)) {
        targetDate = value;
      } else if (maxDate && dayjs.isDayjs(maxDate)) {
        targetDate = maxDate;
      }
      setViewDate(targetDate);
      const targetYear = targetDate.year();
      setYearRangeStart(Math.floor(targetYear / 20) * 20);
    }
  }, [open, value, maxDate]);

  const handleConfirm = () => {
    if (selectedDate && onChange) {
      onChange(selectedDate);
    }
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  const handlePrevMonth = () => {
    if (!dayjs.isDayjs(viewDate)) return;
    const newDate = viewDate.subtract(1, 'month');
    if (dayjs.isDayjs(newDate)) {
      setViewDate(newDate);
    }
  };

  const handleNextMonth = () => {
    if (!dayjs.isDayjs(viewDate)) return;
    const newDate = viewDate.add(1, 'month');
    if (dayjs.isDayjs(newDate)) {
      setViewDate(newDate);
    }
  };

  const handlePrevYear = () => {
    if (!dayjs.isDayjs(viewDate)) return;
    const newDate = viewDate.subtract(1, 'year');
    if (dayjs.isDayjs(newDate)) {
      setViewDate(newDate);
    }
  };

  const handleNextYear = () => {
    if (!dayjs.isDayjs(viewDate)) return;
    const newDate = viewDate.add(1, 'year');
    if (dayjs.isDayjs(newDate)) {
      setViewDate(newDate);
    }
  };

  const handleDayClick = (day: number) => {
    if (!dayjs.isDayjs(viewDate)) return;
    const newDate = viewDate.date(day);
    if (!isDateDisabled(day) && dayjs.isDayjs(newDate)) {
      setSelectedDate(newDate);
      setViewDate(newDate);
    }
  };

  const handleMonthClick = (month: number) => {
    if (!dayjs.isDayjs(viewDate)) return;
    const newDate = viewDate.month(month);
    if (dayjs.isDayjs(newDate)) {
      setViewDate(newDate);
      setViewMode('day');
    }
  };

  const handleYearClick = (year: number) => {
    if (!dayjs.isDayjs(viewDate)) return;
    const newDate = viewDate.year(year);
    if (dayjs.isDayjs(newDate)) {
      setViewDate(newDate);
      setViewMode('month');
    }
  };

  const handleMonthTextClick = () => {
    setViewMode('month');
  };

  const handleYearTextClick = () => {
    setViewMode('year');
  };

  const getCalendarDays = () => {
    if (!dayjs.isDayjs(viewDate)) return [];
    const startOfMonth = viewDate.startOf('month');
    const startDay = startOfMonth.day();
    const daysInMonth = viewDate.endOf('month').date();
    
    const days: (number | null)[] = [];
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    return days;
  };

  const getYearRange = () => {
    const years: number[] = [];
    for (let year = yearRangeStart; year < yearRangeStart + 20; year++) {
      years.push(year);
    }
    return years;
  };

  const handlePrevYearRange = () => {
    setYearRangeStart(yearRangeStart - 20);
  };

  const handleNextYearRange = () => {
    setYearRangeStart(yearRangeStart + 20);
  };

  const isDateDisabled = (day: number) => {
    if (!dayjs.isDayjs(viewDate)) return true;
    const date = viewDate.date(day);
    if (!dayjs.isDayjs(date)) return true;
    if (maxDate && dayjs.isDayjs(maxDate) && date.isAfter(maxDate, 'day')) return true;
    if (minDate && dayjs.isDayjs(minDate) && date.isBefore(minDate, 'day')) return true;
    if (!maxDate && date.isAfter(dayjs(), 'day')) return true;
    return false;
  };

  const isSelected = (day: number) => {
    if (!selectedDate || !dayjs.isDayjs(selectedDate) || !dayjs.isDayjs(viewDate)) return false;
    return (
      selectedDate.year() === viewDate.year() &&
      selectedDate.month() === viewDate.month() &&
      selectedDate.date() === day
    );
  };

  const isToday = (day: number) => {
    if (!dayjs.isDayjs(viewDate)) return false;
    const date = viewDate.date(day);
    if (!dayjs.isDayjs(date)) return false;
    return date.isSame(dayjs(), 'day');
  };

  const weekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const months = [
    'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
    'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
  ];

  const renderDayView = () => {
    if (!dayjs.isDayjs(viewDate)) {
      return (
        <div style={{ padding: '24px', textAlign: 'center', color: '#999' }}>
          Loading calendar...
        </div>
      );
    }
    
    const days = getCalendarDays();
    
    return (
      <div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '8px',
            marginBottom: '16px',
            padding: '0 8px',
          }}
        >
          {weekdays.map((day) => (
            <div
              key={day}
              style={{
                textAlign: 'center',
                fontSize: '12px',
                fontWeight: 500,
                color: '#666',
                padding: '8px 0',
              }}
            >
              {day}
            </div>
          ))}
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '8px',
            padding: '0 8px',
          }}
        >
          {days.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} style={{ height: '48px' }} />;
            }

            const disabled = isDateDisabled(day);
            const selected = isSelected(day);
            const today = isToday(day);

            return (
              <button
                key={day}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (!disabled) {
                    handleDayClick(day);
                  }
                }}
                style={{
                  height: '48px',
                  width: '100%',
                  border: 'none',
                  borderRadius: '8px',
                  backgroundColor: selected ? '#4A90E2' : 'transparent',
                  color: disabled
                    ? '#ccc'
                    : selected
                    ? '#fff'
                    : today
                    ? '#4A90E2'
                    : '#333',
                  fontSize: '16px',
                  fontWeight: selected ? 600 : 400,
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s',
                  opacity: disabled ? 0.5 : 1,
                }}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const renderMonthView = () => {
    if (!dayjs.isDayjs(viewDate)) return null;
    return (
      <div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
            padding: '0 8px',
          }}
        >
          {months.map((month, index) => {
            const isSelectedMonth = viewDate.month() === index;
            
            return (
              <button
                key={month}
                onClick={() => handleMonthClick(index)}
                style={{
                  height: '64px',
                  border: 'none',
                  borderRadius: '8px',
                  backgroundColor: isSelectedMonth ? '#1f4da1' : 'transparent',
                  color: isSelectedMonth ? '#fff' : '#333',
                  fontSize: '16px',
                  fontWeight: isSelectedMonth ? 600 : 400,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s',
                }}
              >
                {month}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const renderYearView = () => {
    if (!dayjs.isDayjs(viewDate)) return null;
    const years = getYearRange();
    const currentYear = viewDate.year();
    
    return (
      <div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
            padding: '0 8px',
          }}
        >
          {years.map((year) => {
            const isSelectedYear = currentYear === year;
            
            return (
              <button
                key={year}
                onClick={() => handleYearClick(year)}
                style={{
                  height: '64px',
                  border: 'none',
                  borderRadius: '8px',
                  backgroundColor: isSelectedYear ? '#1f4da1' : 'transparent',
                  color: isSelectedYear ? '#fff' : '#333',
                  fontSize: '16px',
                  fontWeight: isSelectedYear ? 600 : 400,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s',
                }}
              >
                {year}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const renderHeader = () => {
    if (viewMode === 'day') {
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <button
            onClick={handlePrevMonth}
            style={{
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8L10 4" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              onClick={handleMonthTextClick}
              style={{
                cursor: 'pointer',
                padding: '4px 8px',
                borderRadius: '4px',
                textTransform: 'uppercase',
                fontWeight: 600,
                fontSize: '16px',
              }}
            >
              {viewDate.format('MMMM')}
            </span>
            <span
              onClick={handleYearTextClick}
              style={{
                cursor: 'pointer',
                padding: '4px 8px',
                borderRadius: '4px',
                fontWeight: 600,
                fontSize: '16px',
              }}
            >
              {viewDate.format('YYYY')}
            </span>
          </div>
          
          <button
            onClick={handleNextMonth}
            style={{
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 12L10 8L6 4" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      );
    } else if (viewMode === 'month') {
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <button
            onClick={handlePrevYear}
            style={{
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              padding: '8px',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8L10 4" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          
          <span style={{ fontWeight: 600, fontSize: '16px' }}>
            {viewDate.format('YYYY')}
          </span>
          
          <button
            onClick={handleNextYear}
            style={{
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              padding: '8px',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 12L10 8L6 4" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      );
    } else {
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <button
            onClick={handlePrevYearRange}
            style={{
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              padding: '8px',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8L10 4" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          
          <span style={{ fontWeight: 600, fontSize: '16px' }}>
            {yearRangeStart} - {yearRangeStart + 19}
          </span>
          
          <button
            onClick={handleNextYearRange}
            style={{
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              padding: '8px',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 12L10 8L6 4" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      );
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
        body: { padding: '24px' },
        header: { padding: '16px 24px', borderBottom: '1px solid #f0f0f0' },
        wrapper: typeof window !== 'undefined' && window.innerWidth >= 768
          ? { maxWidth: '1040px', width: 'calc(100% - 80px)', left: drawerLeft, right: 'auto' }
          : { maxWidth: '1040px', width: 'calc(100% - 48px)', left: drawerLeft, right: 'auto' },
      }}
      footer={
        <div style={{ padding: '16px 24px', borderTop: '1px solid #f0f0f0', display: 'flex', gap: '12px' }}>
          <Button
            block
            size="large"
            onClick={handleCancel}
            style={{ flex: 1 }}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            block
            size="large"
            onClick={handleConfirm}
            disabled={!selectedDate}
            style={{ flex: 1 }}
          >
            Confirm
          </Button>
        </div>
      }
      closeIcon={null}
    >
      <div style={{ minHeight: '400px' }}>
        {viewMode === 'day' && renderDayView()}
        {viewMode === 'month' && renderMonthView()}
        {viewMode === 'year' && renderYearView()}
      </div>
    </Drawer>
  );
}

