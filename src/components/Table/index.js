import { BiSolidAddToQueue } from "react-icons/bi";
import { MdOutlineAddShoppingCart } from "react-icons/md";

const Table = ({ header, data, orderClick, handleInventryOpen }) => {
  return (
    <>
      <div className="table-responsive">
      <table
        className=" w-full mx-auto"
        style={{ height: "40px" }}
      >
        <thead>
          <tr>
            <th className="border-0 border-b bg-white border-lightGray font-normal text-gray2 text-sm">{header.name}</th>
            <th className="border-0 border-b bg-white border-lightGray font-normal text-gray2 text-sm">{header.mrp}</th>
            <th className="border-0 border-b bg-white border-lightGray font-normal text-gray2 text-sm">{header.sp}</th>
            <th className="border-0 border-b bg-white border-lightGray font-normal text-gray2 text-sm">{header.type}</th>
            <th className="border-0 border-b bg-white border-lightGray font-normal text-gray2 text-sm">{header.size}</th>
            <th className="border-0 border-b bg-white border-lightGray font-normal text-gray2 text-sm">{header.brand}</th>
            <th className="border-0 border-b bg-white border-lightGray font-normal text-gray2 text-sm">{header.add}</th>
            <th className="border-0 border-b bg-white border-lightGray font-normal text-gray2 text-sm">{header.order}</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td className="border-0 border-b bg-white border-lightGray font-normal text-gray2 text-sm" >{item.name}</td>
              <td className="border-0 border-b bg-white border-lightGray font-normal text-ternaryGray text-sm" >{item.mrp}</td>
              <td className="border-0 border-b bg-white border-lightGray font-normal text-ternaryGray text-sm" >{item.price}</td>
              <td className="border-0 border-b bg-white border-lightGray font-normal text-ternaryGray text-sm" >{item.type}</td>
              <td className="border-0 border-b bg-white border-lightGray font-normal text-ternaryGray text-sm" >
                {item.size} {item.unit}
              </td>
              <td className="border-0 border-b bg-white border-lightGray font-normal text-ternaryGray text-sm" >{item.brand}</td>
              <td className="border-0 border-b bg-white border-lightGray font-normal text-black text-sm" >
                <div
                  style={{
                    background: "transparent",
                    borderRadius: "10px",
                    height: "35px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                >
                  <p
                    style={{
                      color: "white",
                      fontSize: "15px",
                      fontWeight: "500",
                    }}
                  >
                    <BiSolidAddToQueue
                      className="text-xl font-bold text-black"
                      onClick={() => handleInventryOpen(item._id)}
                    />
                  </p>
                </div>
              </td>
              <td className="border-0 border-b bg-white border-lightGray font-normal text-black text-sm" >
                {item?.stock>0 ? (
                  <div
                    style={{
                      background: "transparent",
                      borderRadius: "10px",
                      height: "35px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                    onClick={()=>orderClick(item)}
                  >
                    <p
                      style={{
                        color: "white",
                        fontSize: "15px",
                        fontWeight: "500",
                      }}
                    >
                      <MdOutlineAddShoppingCart className="text-xl font-bold text-black" />
                    </p>
                  </div>
                ) : (
                
                  <div className="w-[120px] cursor-not-allowed  bg-red-600  rounded-[15px] p-1 ">
                
                  <div className=" text-[0.89rem] text-white font-bold pr-2 flex items-center justify-center ">
                  Out Of Stock

                  </div>
</div>
                  
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </>
  );
};

export default Table;
