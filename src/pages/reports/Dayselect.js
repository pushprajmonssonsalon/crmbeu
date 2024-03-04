
import React, { useState } from 'react';
import './report.css';

const Dayselect = ({ onClose, ondaySelect }) => {
  const [selectedDate, setSelectedDate] = useState('');

  const handleDateSelect = () => {
    
    const startDate = new Date(selectedDate);
    // const endDate = new Date(selectedDate);
    // endDate.setDate(startDate.getDate() + 1); // Update to show the next 7 days

    ondaySelect({ startDate});
  };

  return (
    <div className='modal-overlay'>
      <div className='date-picker-modal'>
        <div className='date-picker-container'>
          <label htmlFor='selectedDate'>Select Date:</label>
          <input
            type='date'
            id='selectedDate'
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
        <button onClick={handleDateSelect}>Select Dates</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Dayselect;
