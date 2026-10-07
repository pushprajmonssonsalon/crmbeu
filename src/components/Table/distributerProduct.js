import { GiCancel } from "react-icons/gi";
import { postApiData } from "../../utils/services";
import toast from "react-hot-toast";

// Mirrors Table/myProduct.js. The distributer product sub-document has no
// `price` field (only mrp / stockQuantity), so there is no edit popup here —
// deleting is the only write the backend exposes.
const DistributerProductTable = ({ data, setIsChanged, isChanged }) => {
  const handleDelete = (id) => {
    postApiData(
      "dbInventory/deleteProductFromDistributer",
      { id },
      () => {
        toast.success("Successfully deleted!!");
        setIsChanged(!isChanged);
      },
      () => {
        toast.error("Something Went Wrong!!");
      }
    );
  };

  return (
    <>
      <div className="table-responsive">
        <table className="w-full mx-auto" style={{ height: "40px" }}>
          <thead>
            <tr>
              <th className="border-0 border-b bg-white border-lightGray font-normal text-gray2 text-sm">NAME</th>
              <th className="border-0 border-b bg-white border-lightGray font-normal text-gray2 text-sm">QUANTITY</th>
              <th className="border-0 border-b bg-white border-lightGray font-normal text-gray2 text-sm">TOTAL SIZE</th>
              <th className="border-0 border-b bg-white border-lightGray font-normal text-gray2 text-sm">MRP</th>
              <th className="border-0 border-b bg-white border-lightGray font-normal text-gray2 text-sm">TYPE</th>
              <th className="border-0 border-b bg-white border-lightGray font-normal text-gray2 text-sm">BRAND</th>
              <th className="border-0 border-b bg-white border-lightGray font-normal text-gray2 text-sm">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td className="border-0 border-b bg-white border-lightGray font-normal text-gray2 text-sm">{item.products?.name}</td>
                <td className="border-0 border-b bg-white border-lightGray font-normal text-ternaryGray text-sm">{item.products?.stockQuantity}</td>
                <td className="border-0 border-b bg-white border-lightGray font-normal text-ternaryGray text-sm">
                  {item.products?.totalSize} {item.products?.unit}
                </td>
                <td className="border-0 border-b bg-white border-lightGray font-normal text-ternaryGray text-sm">{item.products?.mrp}</td>
                <td className="border-0 border-b bg-white border-lightGray font-normal text-ternaryGray text-sm">{item.products?.type}</td>
                <td className="border-0 border-b bg-white border-lightGray font-normal text-ternaryGray text-sm">{item.products?.brand}</td>
                <td className="border-0 border-b bg-white border-lightGray font-normal text-ternaryGray text-sm">
                  <div className="flex gap-2 items-center">
                    <GiCancel
                      className="text-red-600 text-xl cursor-pointer"
                      onClick={() => handleDelete(item.products?._id)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default DistributerProductTable;
