import { BiSolidAddToQueue } from 'react-icons/bi'
import { MdOutlineDeleteOutline } from 'react-icons/md'

const iconClass = "h-[18px] w-[18px] sm:h-5 sm:w-5 lg:h-[22px] lg:w-[22px]";

const actionBtnClass =
  "shrink-0 grid place-items-center h-9 w-9 lg:h-10 lg:w-10 rounded-full bg-transparent text-black transition-colors hover:bg-gray-100 hover:text-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-95";

const cols = [
  { name: "NAME", get: (s) => s.name },
  { name: "CATEGORY", get: (s) => s.category },
  { name: "SUB CATEGORY", get: (s) => s.subCategory },
  { name: "GENDER", get: (s) => s.gender },
  { name: "PRICE", get: (s) => s.price },
  { name: "MRP", get: (s) => s.mrp },
  { name: "APP PRICE", get: (s) => s.appPrice || 0 },
  { name: "APP MRP", get: (s) => s.appMrp || 0 },
];

const MyServiceTable = ({ data, startIndex, endIndex, handleEditService, handleDeleteService }) => {
  const rows = data.slice(startIndex, endIndex);

  return (

    <div className="w-full min-w-0 max-w-full overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      <table
        className="styled-table w-full min-w-[900px]"
        style={{ borderCollapse: "separate", borderSpacing: 0 }}
      >
        <thead>
          <tr>
            {cols.map((col) => (
              <th key={col.name} className="whitespace-nowrap text-left">
                {col.name}
              </th>
            ))}
            <th className="sticky right-0 z-[5] whitespace-nowrap bg-white text-center">
              ACTION
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((item, index) => {
            const service = item.services;

            return (
              <tr key={service?.serviceId ?? index}>
                {cols.map((col) => (
                  <td key={col.name} className="whitespace-nowrap text-left">
                    {col.get(service)}
                  </td>
                ))}

                <td className="sticky right-0 z-[5] bg-white">
                  <div className="mx-auto flex w-fit flex-nowrap items-center gap-1 sm:gap-2">
                    <button
                      type="button"
                      aria-label={`Edit ${service?.name ?? "service"}`}
                      className={actionBtnClass}
                      onClick={() => handleEditService(service.serviceId)}
                    >
                      <BiSolidAddToQueue className={iconClass} />
                    </button>

                    <button
                      type="button"
                      aria-label={`Delete ${service?.name ?? "service"}`}
                      className={actionBtnClass + " hover:bg-red-50"}
                      onClick={() => handleDeleteService(service.serviceId)}
                    >
                      <MdOutlineDeleteOutline className={iconClass} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default MyServiceTable;