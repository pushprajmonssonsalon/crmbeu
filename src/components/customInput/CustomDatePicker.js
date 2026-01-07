import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const CustomDatePicker = ({
  startDate,
  className,
  endDate,
  labeled = false,
  onChange,
  onSubmit,
  loading,
  customDate = "custom"
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [datePreset, setDatePreset] = useState(customDate);

  const formatDateToIST = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getToday = () => {
    const today = new Date();
    return formatDateToIST(today);
  };

  const getThisWeekDates = () => {
    const today = new Date();
    const day = today.getDay();
    const firstDay = new Date(today);
    firstDay.setDate(today.getDate() - day);
    const lastDay = new Date(today);
    lastDay.setDate(today.getDate() + (6 - day));
    return {
      start: formatDateToIST(firstDay),
      end: formatDateToIST(lastDay)
    };
  };

  const getThisMonthDates = () => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    return {
      start: formatDateToIST(firstDay),
      end: formatDateToIST(lastDay)
    };
  };

  const handlePresetSelection = (preset) => {
    let dates = { start: startDate, end: endDate };

    switch (preset) {
      case 'today':
        dates = { start: getToday(), end: getToday() };
        break;
      case 'thisweek':
        dates = getThisWeekDates();
        break;
      case 'thismonth':
        dates = getThisMonthDates();
        break;
      case 'custom':
        return;
      default:
        return;
    }


    onChange({ target: { name: 'startDate', value: dates.start } });
    onChange({ target: { name: 'endDate', value: dates.end } });
    const updatedParams = new URLSearchParams(searchParams);
    updatedParams.set('start', dates.start);
    updatedParams.set('end', dates.end);
    setSearchParams(updatedParams);
  };

  useEffect(() => {
    if(customDate !== "custom")
    handlePresetSelection(customDate);
  }, []);

  const handlePresetChange = (e) => {
    const preset = e.target.value;
    setDatePreset(preset);
    handlePresetSelection(preset);
  };

  const handleSubmit = () => {
    const updatedParams = new URLSearchParams(searchParams);
    updatedParams.set('start', startDate);
    updatedParams.set('end', endDate);
    setSearchParams(updatedParams);

    onSubmit(startDate, endDate);
  };

  return (
    <React.Fragment>
      <div className="flex flex-col gap-2">
        {customDate !== "custom" && <select
          value={datePreset}
          onChange={handlePresetChange}
          className={`capitalize text-secondary text-sm ${className}`}
        >
          <option value="today">Today</option>
          <option value="thisweek">This Week</option>
          <option value="thismonth">This Month</option>
          <option value="custom">Custom Date</option>
        </select>}
      </div>

      {datePreset === 'custom' && (
        <>
          <div className="flex flex-col gap-2">
            {labeled && <label id="startDate" className="text-sm">Start</label>}
            <input
              id="startDate"
              value={startDate}
              onChange={onChange}
              name="startDate"
              type="date"
              className={`capitalize text-secondary placeholder:text-gray-900 text-sm ${className}`}
            />
          </div>
          <div>to</div>
          <div className="flex flex-col gap-2">
            {labeled && <label id="endDate" className="text-sm">End</label>}
            <input
              id="endDate"
              value={endDate}
              onChange={onChange}
              name="endDate"
              type="date"
              className={`capitalize text-secondary placeholder:text-gray-900 text-sm ${className}`}
            />
          </div>
        </>
      )}

      {loading ? (
        <button className="px-[15px] flex items-center justify-center py-[10px] w-[100px] bg-ternary text-sm font-[400] rounded-2xl">
          <span>
            <svg
              className="animate-spin"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                opacity="0.5"
                cx="10"
                cy="10"
                r="9"
                stroke="white"
                strokeWidth="2"
              />
              <mask id="path-2-inside-1_2527_20936" fill="white">
                <path d="M18.4713 13.0345C18.9921 13.221 19.5707 12.9508 19.7043 12.414C20.0052 11.2042 20.078 9.94582 19.9156 8.70384C19.7099 7.12996 19.1325 5.62766 18.2311 4.32117C17.3297 3.01467 16.1303 1.94151 14.7319 1.19042C13.6285 0.597723 12.4262 0.219019 11.1884 0.0708647C10.6392 0.00512742 10.1811 0.450137 10.1706 1.00319C10.1601 1.55625 10.6018 2.00666 11.1492 2.08616C12.0689 2.21971 12.9609 2.51295 13.7841 2.95511C14.9023 3.55575 15.8615 4.41394 16.5823 5.45872C17.3031 6.50351 17.7649 7.70487 17.9294 8.96348C18.0505 9.89002 18.008 10.828 17.8063 11.7352C17.6863 12.2751 17.9506 12.848 18.4713 13.0345Z" />
              </mask>
              <path
                d="M18.4713 13.0345C18.9921 13.221 19.5707 12.9508 19.7043 12.414C20.0052 11.2042 20.078 9.94582 19.9156 8.70384C19.7099 7.12996 19.1325 5.62766 18.2311 4.32117C17.3297 3.01467 16.1303 1.94151 14.7319 1.19042C13.6285 0.597723 12.4262 0.219019 11.1884 0.0708647C10.6392 0.00512742 10.1811 0.450137 10.1706 1.00319C10.1601 1.55625 10.6018 2.00666 11.1492 2.08616C12.0689 2.21971 12.9609 2.51295 13.7841 2.95511C14.9023 3.55575 15.8615 4.41394 16.5823 5.45872C17.3031 6.50351 17.7649 7.70487 17.9294 8.96348C18.0505 9.89002 18.008 10.828 17.8063 11.7352C17.6863 12.2751 17.9506 12.848 18.4713 13.0345Z"
                stroke="white"
                strokeWidth="4"
                mask="url(#path-2-inside-1_2527_20936)"
              />
            </svg>
          </span>
        </button>
      ) : (
        <button onClick={handleSubmit} className="px-[15px] py-[10px] w-[100px] bg-ternary text-sm font-[400] rounded-2xl">
          Submit
        </button>
      )}
    </React.Fragment>
  );
};

export default CustomDatePicker;