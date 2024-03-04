// DatePickerModal.js

import React, { useState } from 'react';
import './report.css';

const DatePickerModal = ({ onClose, onDateSelect }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleDateSelect = () => {
    // You can perform additional logic/validation here if needed
    onDateSelect({ startDate, endDate });
  };

  return (
    <div className='modal-overlay'>
      <div className='date-picker-modal'>
        <div className='date-picker-container'>
          <label htmlFor='startDate'>Start Date:</label>
          <input
            type='date'
            id='startDate'
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <label htmlFor='endDate'>End Date:</label>
          <input
            type='date'
            id='endDate'
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <button onClick={handleDateSelect}>Select Dates</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default DatePickerModal;
