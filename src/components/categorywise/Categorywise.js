import { useEffect, useMemo, useState } from "react";
import { formatDate, postApiData } from "../../utils/services";
import CategoryTable from "./CategoryTable";
import { FaAngleDown, FaCalendarAlt } from "react-icons/fa";
import CustomDatePicker from "../customInput/CustomDatePicker";
import { useSearchParams } from "react-router-dom";
import exportToExcel from "../../utils/exportToExcel";

const categoryHeadings = [
  {
    name: "Sub Category",
    id: "_id",
  },
  {
    name: "Services",
    id: "totalServices",
  },
  {
    name: "Revenue",
    id: "totalRevenue",
  },
];

const subCategoryHeadings = [
  {
    name: "Mini Category",
    id: "_id",
  },
  {
    name: "Services",
    id: "totalServices",
  },
  {
    name: "Revenue",
    id: "totalRevenue",
  },
];
const Categorywise = () => {
  const [loading, setLoading] = useState(false)
  const [subCateogries, setSubCategories] = useState([]);
  const [miniSubCategories, setMiniSubCategories] = useState([]);
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

  const searchClick = () => {
    const data = {
      type: "crm",
      startDate: startDate,
      endDate: endDate,
    };
    setLoading(true)
    postApiData(
      "reports/minisubCategoryWiseRevenue",
      data,
      (resp) => {

        if (resp[0]) {
          setLoading(false)

          setSubCategories(resp[0]?.bySubCategory);
          setMiniSubCategories(resp[0]?.byMiniSubCategory);
        }
      },
      (error) => {
        setLoading(false)

      }
    );
  };


  const SubCatTotal = useMemo(() => {
    if (subCateogries?.length > 0) {
      const total = subCateogries.reduce(
        (acc, curr) => acc + curr.totalServices,
        0
      );
      return total || 0;
    } else return 0;
  }, [subCateogries]);
  const SubCatRevenue = useMemo(() => {
    if (subCateogries?.length > 0) {
      const total = subCateogries.reduce(
        (acc, curr) => acc + curr.totalRevenue,
        0
      );
      return total.toFixed(2) || 0;
    } else return 0;
  }, [subCateogries]);

  const minSubCatTotal = useMemo(() => {
    if (miniSubCategories?.length > 0) {
      const total = miniSubCategories.reduce(
        (acc, curr) => acc + curr.totalServices,
        0
      );
      return total;
    } else return 0;
  }, [miniSubCategories]);
  const minSubCatRevenue = useMemo(() => {
    if (miniSubCategories?.length > 0) {
      const total = miniSubCategories.reduce(
        (acc, curr) => acc + curr.totalRevenue,
        0
      );
      return total;
    } else return 0;
  }, [miniSubCategories]);

  const getSubCatRow = (value,SubCatTotal) => {
    return (
      <>
        <tr>
          <td className="text-black font-bold"><span className="font-bold">Total</span></td>
          <td className="">{SubCatTotal}</td>
          <td className="text-black font-bold">{value}</td>
        </tr>
      </>
    );
  };

  const tableFields = [
    {
      heading: "Sub Category Wise report",
      cols: categoryHeadings,
      rows: subCateogries,
      row: getSubCatRow(SubCatRevenue,SubCatTotal),
    },
    {
      heading: "Mini Category Wise report",
      cols: subCategoryHeadings,
      rows: miniSubCategories,
      row: getSubCatRow(minSubCatRevenue,minSubCatTotal),
    },
  ];
  const handleExport = () => {
    // console.log(subCateogries,"categories")
    if (subCateogries?.length > 0 || miniSubCategories?.length > 0) {
      const sheets = [
        { name: "Sub Category Wise Report", values: subCateogries?.map((elm) => ({ ...elm, name: elm._id })) },
        { name: "Mini Category Wise report", values: miniSubCategories?.map((elm) => ({ ...elm, name: elm._id })) }
      ];


      exportToExcel(sheets, "CategoryWise", "CategoryWise.xlsx", true);

    }
  }
  useEffect(() => {
    if (startDate && endDate)
      searchClick()
  }, [])
  return (
    <>
      {" "}
      <div className={`mb-5 ${showDate ? "h-auto" : " h-[42px] overflow-hidden"} transition-all ease-in duration-300 w-full`}>
        <div className="flex items-center justify-between w-full">
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
            onClick={handleExport}
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





      {tableFields?.map((item, index) => {
        const { heading, cols, rows, row } = item;
        return (
          <div className=" rounded-[16px] border border-primaryGray p-5  mb-9 last:mb-0">

            <h2 className="text-black text-start  font-normal text-[22px] leading-[28px] mb-5">{heading}</h2>

            <div className="mb-5 last:mb-0">
              <CategoryTable rows={rows} cols={cols} row={row} />
            </div>
          </div>
        );
      })}


    </>
  );
};

export default Categorywise;
