import React, { useState } from 'react';

const CustomDiscount = ({
    label,
    discountType,
    setDiscountType,
    dailyDiscount,
    dayWiseDiscounts,
    daysOfWeek,
    handleDayWiseChange,
    handleDailyDiscountChange,
    disabled = false,
}) => {
    


    return (
        <div className=''>

            <div className='grid grid-cols-2 '>
              
                        <span  className="font-bold text-md">
                            {label}
                        </span>
                  
                <div className="flex gap-4">
                    <button
                        onClick={() => setDiscountType('daily')}
                        disabled={disabled}
                        className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${discountType === 'daily'
                            ? 'bg-ternary text-white shadow-md'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        Daily Discount
                    </button>
                    <button
                        onClick={() => setDiscountType('daywise')}
                        disabled={disabled}
                        className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${discountType === 'daywise'
                            ? 'bg-ternary text-white shadow-md'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        Day-wise Discount
                    </button>
                </div>
            </div>
            <div className='my-3'>
                                    {discountType === 'daily' && (
                        <div className="">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Discount Percentage (%)
                            </label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                step="0.1"
                                value={dailyDiscount}
                                onChange={(e) => handleDailyDiscountChange(e.target.value)}
                                disabled={disabled}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg "
                                placeholder="Enter discount percentage"
                            />
                            <p className="mt-2 text-sm text-gray-500">
                                This discount will be applied every day
                            </p>
                        </div>
                    )}

                    {/* Day-wise Discount Inputs */}
                    {discountType === 'daywise' && (
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                Set Discount for Each Day
                            </h3>
                            <div className="space-y-1">
                                {daysOfWeek.map(({ key, label }) => (
                                    <div key={key} className="flex items-center gap-4 rounded-lg hover:bg-gray-100 transition-colors">
                                        <label className="w-32 text-sm font-medium text-gray-700">
                                            {label}
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            step="0.1"
                                            value={dayWiseDiscounts[key]}
                                            onChange={(e) => handleDayWiseChange(key, e.target.value)}
                                            disabled={disabled}
                                            className="flex-1 px-4 py-1 border border-gray-300 rounded-lg "
                                            placeholder="0"
                                        />
                                        <span className="text-gray-600 font-medium w-8">%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

            </div>
           
        </div>
    );
};

export default CustomDiscount;