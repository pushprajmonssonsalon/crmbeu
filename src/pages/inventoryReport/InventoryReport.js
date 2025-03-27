import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import CustomTable from "../../components/Table/CustomTable";
import { getApiCall, postApiData } from "../../utils/services";
import { FaFileExcel } from "react-icons/fa";
import exportToExcel from "../../utils/exportToExcel";
import MonthPicker from "../../components/customInput/MonthPicker";
import { useSearchParams } from "react-router-dom";

const InventoryReport = () => {
  const [inventoryData, setInventoryData] = useState([]);
  const [newMyProducts, setNewMyProducts] = useState([]);
  const [inventorySnap, setInventorySnap] = useState(null);
  const defaultStartDate = new Date();
  const [loading, setLoading] = useState(false)
  const [searchParams] = useSearchParams();
  const date = searchParams.get("date");
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
      <Layout>
        <div className="mt-32 max-w-[95%] mx-auto">
          <div className="mt-5 flex items-start ">
            <button
              onClick={handleExport}
              className="bg-green-600 px-3 h-[40px] flex items-center justify-center gap-1 font-semibold hover:bg-green-500 text-white rounded-md w-[100px] active:scale-105 transition-all ease-in duration-100"
            >
              <span>Export</span>
              <FaFileExcel />
            </button>
          </div>
          <h2 className="text-4xl my-9 text-center font-medium">
            Inventory Report
          </h2>
          <div className=" flex my-9 justify-center items-center">

            <MonthPicker
              date={selectDate}
              setDate={setSelectDate}
              onSubmit={submitClick}
              loading={loading}

            />
          </div>
          <div className="mb-9 border rounded-lg max-w-full overflow-x-auto shadow-md">
            <CustomTable columns={columns} rows={inventoryData} />
          </div>
        </div>
      </Layout>
    </>
  );
};

export default InventoryReport;
