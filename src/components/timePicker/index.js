import React, { useEffect, useState } from 'react';

const TimePicker = ({setTime}) => {
  const [selectedHour, setSelectedHour] = useState('');
  const [selectedMinute, setSelectedMinute] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('AM');

  const handleHourChange = (event) => {
    setSelectedHour(event.target.value);
  };

  const handleMinuteChange = (event) => {
    setSelectedMinute(event.target.value);
  };

  const handlePeriodChange = (event) => {
    setSelectedPeriod(event.target.value);
};

useEffect(() => {
    setTime(`${selectedHour}:${selectedMinute} ${selectedPeriod}`);
  }, [selectedHour, selectedMinute, selectedPeriod, setTime]);

  return (
    <div className='w-[200px]'>
        <p className="text-xl font-bold text-black">Time Picker </p>
        <div className='border-2 border-[darkgray] px-4 py-2 mt-[13px] rounded-lg'>
        <select className='mx-3'
        value={selectedHour}
        onChange={handleHourChange}
        placeholder="hh"
      >
        {[...Array(12).keys()].map((hour) => (
          <option key={hour + 1} value={String(hour + 1).padStart(2, '0')}>
            {String(hour + 1).padStart(2, '0')}
          </option>
        ))}
      </select>

      <select className='mr-3' 
        value={selectedMinute}
        onChange={handleMinuteChange}
        placeholder="mm"
      >
        {[...Array(60).keys()].map((minute) => (
          <option key={minute} value={String(minute).padStart(2, '0')}>
            {String(minute).padStart(2, '0')}
          </option>
        ))}
      </select>

      <select value={selectedPeriod} onChange={handlePeriodChange} className=''>
        <option value="AM">AM</option>
        <option value="PM">PM</option>
      </select>
        </div>

      <p>Selected Time: {`${selectedHour}:${selectedMinute} ${selectedPeriod}`}</p>
    </div>
  );
};

export default TimePicker;
