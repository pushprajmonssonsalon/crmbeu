import { useEffect, useMemo, useState } from "react";
import Layout from "../Layout";
import CustomSearchInputFeild from "../customInput";
import { useLocation } from "react-router";
import { postApiData } from "../../utils/services";
import CategoryTable from "./CategoryTable";

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
  const [loading,setLoading]=useState(false)
  const defaultStartDate = new Date();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [subCateogries, setSubCategories] = useState([]);
  const [miniSubCategories, setMiniSubCategories] = useState([]);

  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultStartDate);

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

  useEffect(() => {
    const stDate = queryParams.get("start");
    const edDate = queryParams.get("end");
    if (stDate && edDate) {
      setStartDate(new Date(stDate));
      setEndDate(new Date(edDate));
    }
  }, [location.pathname]);

  const SubCatRevenue = useMemo(() => {
    if (subCateogries?.length > 0) {
      const total = subCateogries.reduce(
        (acc, curr) => acc + curr.totalRevenue,
        0
      );
      return total.toFixed(2) || 0;
    } else return 0;
  }, [subCateogries]);

  const minSubCatRevenue = useMemo(() => {
    if (miniSubCategories?.length > 0) {
      const total = miniSubCategories.reduce(
        (acc, curr) => acc + curr.totalRevenue,
        0
      );
      return total;
    } else return 0;
  }, [miniSubCategories]);

  const getSubCatRow = (value) => {
    return (
      <>
        <tr>
          <td className="text-black font-bold">Total</td>
          <td className=""></td>
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
      row: getSubCatRow(SubCatRevenue),
    },
    {
      heading: "Mini Category Wise report",
      cols: subCategoryHeadings,
      rows: miniSubCategories,
      row: getSubCatRow(minSubCatRevenue),
    },
  ];
  return (
    <>
      {" "}
      <Layout>
        <div className="mt-52 mb-12 w-[90%] mx-auto md:mt-32 flex flex-col">
          <h1 className="text-center text-3xl font-bold  text-black mb-4">
            Category Wise Collection
          </h1>

          <CustomSearchInputFeild
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            loading={loading}
            submitClick={searchClick}
          />

          {tableFields?.map((item, index) => {
            const { heading, cols, rows, row } = item;
            return (
              <div
                key={index}
                className="  my-3   overflow-auto"
              >
                <h2 className="text-2xl text-black font-bold my-6">
                  {heading}
                </h2>
              <div className="shadow-md max-h-[500px] overflow-y-auto">
                <CategoryTable rows={rows} cols={cols} row={row} />
                </div>
              </div>
            );
          })}
        </div>
      </Layout>
    </>
  );
};

export default Categorywise;
