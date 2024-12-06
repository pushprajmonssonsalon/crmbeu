import { BiSolidAddToQueue } from "react-icons/bi";
import { MdOutlineAddShoppingCart } from "react-icons/md";

const Table = ({ header, data, orderClick, handleInventryOpen }) => {
  return (
    <>
      <table
        className="styled-table w-[90%] overflow-x-auto mx-auto"
        style={{ height: "40px" }}
      >
        <thead>
          <tr>
            <th>{header.name}</th>
            <th>{header.mrp}</th>
            <th>{header.sp}</th>
            <th>{header.type}</th>
            <th>{header.size}</th>
            <th>{header.brand}</th>
            <th>{header.add}</th>
            <th>{header.order}</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>{item.mrp}</td>
              <td>{item.price}</td>
              <td>{item.type}</td>
              <td>
                {item.size} {item.unit}
              </td>
              <td>{item.brand}</td>
              <td>
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
              <td>
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
    </>
  );
};

export default Table;
