import { useEffect, useState } from "react";
import CustomTable from "../../components/Table/CustomTable";
import { formatDate, getApiCall, postApiData } from "../../utils/services";
import exportToExcel from "../../utils/exportToExcel";
import MonthPicker from "../../components/customInput/MonthPicker";
import { useSearchParams } from "react-router-dom";
import { FaAngleDown, FaCalendarAlt } from "react-icons/fa";

const InventoryReport = () => {
  const [inventoryData, setInventoryData] = useState([]);
  const [newMyProducts, setNewMyProducts] = useState([]);
  const [inventorySnap, setInventorySnap] = useState(null);
  const defaultStartDate = new Date();
  const [params] = useSearchParams();
  const [loading, setLoading] = useState(false)
  const [showDate, setShowDate] = useState(false)
  const date = params.get("date");
  const [selectDate, setSelectDate] = useState(date ? new Date(date) : defaultStartDate);
  const fetchInventorySnap = () => {
    setLoading(true)
    getApiCall(
      `inventory/getInventorySnap?date=${selectDate}`,
      (res) => {
        const { openingBal, usedBal, receivedBal } = res;

        setInventorySnap({
          openingBal,
          usedBal,
          receivedBal
        });
        setLoading(false)

      },
      () => {
        setLoading(false)
        setInventorySnap(null);
        setInventoryData([]);


      }
    );
  };
  const columns = [
    {
      id: "name",
      name: "Name",
    },

    {
      id: "brand",
      name: "Brand",
    },
    {
      id: "type",
      name: "Type",
    },
    {
      id: "stockQuantity",
      name: "Opening Balance",
    },
    {
      id: "receivedBal",
      name: "Received  Balance",
    },
    {
      id: "usedBal",
      name: "Used Balance",
    },
    {
      id: "finalBal",
      name: "Final Balance",
    },
  ];
  const handleExport = () => {
    if (inventoryData) {
      exportToExcel(inventoryData, "Inventory", "inventory.xlsx");

    }

  };
  const submitClick = () => {
    fetchInventorySnap();
  }
  const myproduct = () => {
    const data = {
      page: 1,
      limit: 500,
    };
    postApiData(
      `inventory/getSalonProducts/?limit=${data?.limit}&page=${data?.page}`,
      data,
      (resp) => {
        if (resp.products.length > 0) {
          setNewMyProducts(resp.products?.map((elm) => elm.products));
        } else {

          setNewMyProducts([]);
        }
      },
      (error) => {
        setNewMyProducts([]);
      }
    );
  };

  useEffect(() => {
    fetchInventorySnap();
    myproduct();
  }, []);


  useEffect(() => {
    if (newMyProducts?.length > 0 && inventorySnap) {
      const data = newMyProducts?.map((elm) => {
        const { name, brand, type } = elm;
        const opBal = inventorySnap?.openingBal?.find(
          (item) => item.itemId === elm.itemId
        )?.stockQuantity || 0;
        const usBal =
          inventorySnap?.usedBal?.find((item) => item._id === elm.itemId)
            ?.totalQuantity || 0;
        const rsdBal =
          inventorySnap?.receivedBal?.find((item) => item._id === elm.itemId)
            ?.totalReceivedQuantity || 0;
        const fnBal = opBal + rsdBal - usBal;
        return {
          name,
          brand,
          type,
          stockQuantity: opBal,
          usedBal: usBal,
          receivedBal: rsdBal,
          finalBal: fnBal,
        };
      });
      setInventoryData(data);
    }
  }, [newMyProducts, inventorySnap]);
  return (
    <>
      <div className="flex items-center justify-between">
        <div className={`mb-5 ${showDate ? "h-auto" : " h-[42px] overflow-hidden"} transition-all ease-in duration-300 w-full`}>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center  gap-6">
              <button onClick={() => setShowDate(!showDate)} className="flex border  shadow items-center bg-white gap-2 rounded-[5px] py-[10px] px-[15px]">
                <FaCalendarAlt className="text-customPurple text-sm" />
                <span className="text-secondary text-sm">Year-to-Month </span>
                <FaAngleDown className={`text-secondary text-sm ${showDate ? "rotate-180" : ""} `} />

              </button>
              <div className="flex gap-2 font-normal  items-center text-xs text-secondary">
                <span>{formatDate(selectDate, false, true)}</span>

              </div>
            </div>
            <button
              className="w-[150px] bg-ternary font-normal h-[36px] flex items-center justify-center active:bg-ternary/90 transition-colors ease-in duration-100 rounded-[16px] text-white text-sm leading-[24px]"
              onClick={handleExport}
            >
              Export All
            </button>
          </div>

          <div className=" flex items-center my-4  gap-3">
            <MonthPicker
              date={selectDate}
              setDate={setSelectDate}
              onSubmit={submitClick}
              loading={loading}

            />
          </div>

        </div>

      </div>
      <div className=" rounded-[16px] border border-primaryGray p-5  ">
        <div className="flex items-center gap-5 ">

          <h2 className="text-black text-start  font-normal text-[22px] leading-[28px]">Inventory Report</h2>
          <span className="rounded-[16px] text-xs px-6 border border-gray2">{inventoryData?.length} Products</span>
        </div>

        <div className="w-full">
          <CustomTable columns={columns} rows={inventoryData} />
        </div>
      </div>

    </>
  );
};

export default InventoryReport;
