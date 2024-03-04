// MonthPickerModal.js

import React, { useState } from 'react';
import './report.css';

const MonthPickerModal = ({ onClose, onMonthSelect }) => {
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  const handleMonthSelect = () => {
    // You can perform additional logic/validation here if needed
    onMonthSelect({ selectedMonth, selectedYear });
  };

  return (
    <div className='modal-overlay'>
      <div className='date-picker-modal'>
        <div className='date-picker-container'>
          <label htmlFor='selectedMonth'>Select Month:</label>
          <select
            id='selectedMonth'
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value='' disabled>
              Select Month
            </option>
            <option value='January'>January</option>
            <option value='February'>February</option>
            <option value='March'>March</option>
            {/* Add other months */}
          </select>

          <label htmlFor='selectedYear'>Select Year:</label>
          <input
            type='number'
            id='selectedYear'
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            placeholder='Enter Year'
          />
        </div>
        <button onClick={handleMonthSelect}>Select Month</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default MonthPickerModal;
