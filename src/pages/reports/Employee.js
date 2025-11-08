import { useEffect, useState } from "react";
import { formatDate, postApiData } from "../../utils/services";
import { FaAngleDown, FaCalendarAlt } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";
import CustomDatePicker from "../../components/customInput/CustomDatePicker";

import * as XLSX from "xlsx";

const Employee = () => {
  const [employees,setEmployees] = useState([]);

  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const getCategoryColor = (category) => {
    const colors = {
      'Beauty': 'bg-pink-100 text-pink-800 border-pink-200',
      'Hand & Feet': 'bg-purple-100 text-purple-800 border-purple-200',
      'Spa': 'bg-blue-100 text-blue-800 border-blue-200',
      'Hair': 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const calculateTotal = (services) => {
    return services.reduce((sum, service) => sum + service.sumTotal, 0);
  };

  const groupByCategory = (services) => {
    return services.reduce((acc, service) => {
      if (!acc[service.category]) {
        acc[service.category] = [];
      }
      acc[service.category].push(service);
      return acc;
    }, {});
  };

  const EmployeeCard = ({ employee, onClick }) => {
    const total = calculateTotal(employee.services);
    const categories = [...new Set(employee.services.map(s => s.category))];
    
    return (
      <div 
        onClick={onClick}
        className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-xl transition-all transform hover:-translate-y-1"
      >
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-gray-800 capitalize">{employee.name}</h3>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {employee.services.length} services
          </span>
        </div>
        
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((category, idx) => (
              <span 
                key={idx} 
                className={`px-2 py-1 rounded text-xs font-medium border ${getCategoryColor(category)}`}
              >
                {category}
              </span>
            ))}
          </div>
        </div>
        
        <div className="pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-sm">Total Revenue</span>
            <span className="text-2xl font-bold text-green-600">₹{total.toLocaleString()}</span>
          </div>
        </div>
      </div>
    );
  };

  const EmployeeDetails = ({ employee, onClose }) => {
    const groupedServices = groupByCategory(employee.services);
    const total = calculateTotal(employee.services);
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 capitalize">{employee.name}</h2>
              <p className="text-gray-600">{employee.services.length} services performed</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-3xl font-bold text-green-600">₹{total.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="p-6">
            {Object.entries(groupedServices).map(([category, services]) => (
              <div key={category} className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                  <span className={`px-3 py-1 rounded-full text-sm border ${getCategoryColor(category)}`}>
                    {category}
                  </span>
                  <span className="ml-3 text-sm text-gray-500">
                    ({services.length} services)
                  </span>
                </h3>
                
                <div className="grid gap-3">
                  {services.map((service, idx) => (
                    <div 
                      key={idx} 
                      className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{service.service}</p>
                        <p className="text-sm text-gray-500">{service.subCategory}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-700">
                          ₹{service.sumTotal.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-2 text-right">
                  <p className="text-sm text-gray-600">
                    Category Total: <span className="font-semibold">
                      ₹{services.reduce((sum, s) => sum + s.sumTotal, 0).toLocaleString()}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-4">
            <button
              onClick={onClose}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

 

  const totalRevenue = employees.reduce((sum, emp) => sum + calculateTotal(emp.services), 0);
  const totalServices = employees.reduce((sum, emp) => sum + emp.services.length, 0);

  const exportToExcel = () => {
    // Create workbook
    const wb = XLSX.utils.book_new();

    // Main Sheet: All Services with Employee Revenue
    const mainData = [
      ['EMPLOYEE SERVICES REVENUE REPORT'],
      ['Generated on: ' + new Date().toLocaleString()],
      [],
      ['Employee Name', 'Category', 'Sub Category', 'Service Name', 'Revenue (₹)', 'Employee Total (₹)']
    ];

    let currentRow = 4; // Starting after headers

    employees.forEach((emp, empIndex) => {
      const empTotal = calculateTotal(emp.services);
      const empServices = emp.services.length;
      
      emp.services.forEach((service, serviceIndex) => {
        mainData.push([
          serviceIndex === 0 ? emp.name.toUpperCase() : '', // Show name only on first row
          service.category,
          service.subCategory,
          service.service,
          service.sumTotal,
          serviceIndex === 0 ? empTotal : '' // Show total only on first row
        ]);
      });
      
      // Add employee subtotal row
      mainData.push([
        '',
        '',
        '',
        `TOTAL FOR ${emp.name.toUpperCase()} (${empServices} services)`,
        empTotal,
        ''
      ]);
      
      // Add spacing between employees
      mainData.push([]);
    });

    // Add grand total
    mainData.push([]);
    mainData.push([
      '',
      '',
      '',
      'GRAND TOTAL',
      totalRevenue,
      ''
    ]);
    mainData.push([
      '',
      '',
      '',
      `Total Employees: ${employees.length}`,
      `Total Services: ${totalServices}`,
      ''
    ]);

    const mainSheet = XLSX.utils.aoa_to_sheet(mainData);
    
    // Set column widths
    mainSheet['!cols'] = [
      { wch: 20 },  // Employee Name
      { wch: 15 },  // Category
      { wch: 18 },  // Sub Category
      { wch: 40 },  // Service Name
      { wch: 15 },  // Revenue
      { wch: 18 }   // Employee Total
    ];

  

    XLSX.utils.book_append_sheet(wb, mainSheet, 'Employee Revenue Report');

  


    // Generate and download file
    const fileName = `Employee_Revenue_Report_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  const [loading, setLoading] = useState(false);
  const [params] = useSearchParams();
  const [showDate, setShowDate] = useState(false)
  const start = params.get("start");
  const end = params.get("end");
 

  //date
  const defaultStartDate = formatDate(new Date());
  const [startDate, setStartDate] = useState(
    start ? start : defaultStartDate
  );
  const [endDate, setEndDate] = useState(
    end ? end : defaultStartDate
  );
  const handleDateChange = (e) => {
    const { id, value } = e.target;
    if (id === "startDate") {
      setStartDate(value)
    } else {
      setEndDate(value)
    }

  }
  useEffect(() => {
    const data = {
      startDate: startDate,
      endDate: endDate,
    };
    setLoading(true);
    postApiData(
      "reports/employeeReport",
      data,
      (resp) => {
        setLoading(false);

        setEmployees(resp);
      },
      (error) => {
        setLoading(false);
      }
    );
  }, []);
  const searchClick = () => {
    const data = {
      startDate: startDate,
      endDate: endDate,
    };
    setLoading(true);

    postApiData(
      "reports/employeeReport",
      data,
      (resp) => {
        setLoading(false);
        setEmployees(resp);

      },
      (error) => {
        setLoading(false);
      }
    );
  };
 

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <div className={`mb-5 ${showDate ? "h-auto" : " h-[42px] overflow-hidden"} transition-all ease-in duration-300 w-full`}>
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center  gap-6">
              <button onClick={() => setShowDate(!showDate)} className="flex border  shadow items-center bg-white gap-2 rounded-[5px] py-[10px] px-[15px]">
                <FaCalendarAlt className="text-customPurple text-sm" />
                <span className="text-secondary text-sm">Year-to-date </span>
                <FaAngleDown className={`text-secondary text-sm ${showDate ? "rotate-180" : ""} `} />

              </button>
              <div className="flex gap-2 font-normal  items-center text-xs text-secondary">
                <span>{formatDate(startDate, true)}</span>
                <span>~</span>
                <span>{formatDate(endDate, true)}</span>
              </div>
            </div>
            <button
              className="w-[150px] bg-ternary font-normal h-[36px] flex items-center justify-center active:bg-ternary/90 transition-colors ease-in duration-100 rounded-[16px] text-white text-sm leading-[24px]"
              onClick={exportToExcel}
            >
              Export All
            </button>
          </div>

          {showDate && <div className=" flex items-center my-4  gap-3">
            <CustomDatePicker
              startDate={startDate}
              endDate={endDate}
              loading={loading}
              className="bg-white gap-2 rounded-[5px] py-[10px] px-[15px] "
              onSubmit={searchClick}
              onChange={handleDateChange}


            />
          </div>}

        </div>

      </div>
      <div className=" rounded-[16px] border border-primaryGray p-5  ">
        <h2 className="text-black text-start  font-normal text-[22px] leading-[28px] mb-5">Employee Revenue</h2>
     <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-6">
              <div>
                <p className="text-sm text-gray-500">Total Employees</p>
                <p className="text-2xl font-bold text-gray-800">{employees.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Services</p>
                <p className="text-2xl font-bold text-blue-600">{totalServices}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">₹{totalRevenue.toLocaleString()}</p>
              </div>
            </div>
            
           
          </div>
        </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {employees?.map((employee, idx) => (
              <EmployeeCard 
                key={idx} 
                employee={employee}
                onClick={() => setSelectedEmployee(employee)}
              />
            ))}
          </div>
       

        {selectedEmployee && (
          <EmployeeDetails 
            employee={selectedEmployee}
            onClose={() => setSelectedEmployee(null)}
          />
        )}
      </div>
    </div>
       
      </div>


     
    </>
  );
};

export default Employee;
