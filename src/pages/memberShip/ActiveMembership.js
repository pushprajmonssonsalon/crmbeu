import { useEffect, useState } from 'react';
import GridRows from '../../components/pagination/gridRows';
import Pagination from '../../components/pagination';
import { getApiCall } from '../../utils/services';
import { MdCardMembership, MdEdit } from 'react-icons/md';
import NewMembershipModal from '../../components/popup/NewMembershipPopup';
import { FaRegEye } from 'react-icons/fa';

const ActiveMembership = () => {
  const [membership, setMemberships] = useState([]);
  const [isNewMembershipModal, setIsNewMembershipModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add", "edit", "view"
  const [selectedMembership, setSelectedMembership] = useState(null);

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const headings = [
    {
      id: "index",
      name: "S.No"
    },
    {
      id: "name",
      name: "Membership Name"
    },
    {
      id: "price",
      name: "Membership Price"
    },
    {
      id: "credits",
      name: "Credits"
    },
    {
      id: "discount",
      name: "Discount"
    },
    {
      id: "action",
      name: "Action"
    },

  ]

  const filteredData = [...(membership || [])].reverse();
  const paginatedData = filteredData?.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );
  const handleChangePage = (newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(1);
  };
  const getMembership=()=>{
 getApiCall(
      "membership/getMembership",
      (resp) => {
        setMemberships(resp.membershipList);
      },
      (error) => { }
    );

  }
  useEffect(() => {
   getMembership()
  }, []);
  const actions = [


    {
      heading: "Add new membership",
      button: {
        onClick: () => {
          setModalMode("add");
          setSelectedMembership(null);
          setIsNewMembershipModal(true);
        },
        icon: <MdCardMembership />,
      },
    }


  ]
  return (
    <>

      <div className=" rounded-[16px] border border-primaryGray p-5  ">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <h2 className="text-black text-start  font-normal text-[22px] leading-[28px]">Membership List</h2>
            <span className="rounded-[16px] text-xs px-6 border border-gray2">{membership?.length} Memberships</span>


          </div>
          <div className="flex items-center gap-2">
            {actions.map((action, index) => {
              const handleClick = action.button.onClick;
              return (
                <button key={index} onClick={handleClick}
                  className="rounded-[16px] text-sm text-white bg-ternary py-1 px-5">
                  {action.heading}{" "}

                </button>
              );
            })}
          </div>

        </div>
        <div className="w-full mt-6 ">
          <table
            className="styled-table"
          >
            <thead>
              <tr>
                {
                  headings.map((item, index) => (
                    <th key={index}>{item.name}</th>
                  ))
                }

              </tr>
            </thead>
            <tbody>
              {paginatedData?.map((item, index) => (
                <tr key={index}>

                  {headings?.map((elm, idx) => {
                    return (
                      <td key={idx} className="py-5">
                        {elm.id === "index" ?
                          index + 1
                          : elm.id === "action" ?
                            <div className='flex items-center gap-1'>
                              <button className='text-black text-lg' onClick={() => {
                                setModalMode("view");
                                setSelectedMembership(item);
                                setIsNewMembershipModal(true);
                              }}><FaRegEye /></button>
                              <button className='text-black text-lg' onClick={() => {
                                setModalMode("edit");
                                setSelectedMembership(item);
                                setIsNewMembershipModal(true);
                              }}><MdEdit /></button>
                            </div>
                          :elm.id==="discount"? `${item[elm.id]||0}%` : item[elm.id]||""}</td>
                    )
                  })}


                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between mt-4 items-center">
            <GridRows
              totalItems={membership?.length}
              itemsPerPage={rowsPerPage}
              handleRowschange={handleChangeRowsPerPage}
            />
            <Pagination
              totalItems={membership?.length}
              itemsPerPage={rowsPerPage}
              currentPage={page}
              onPageChange={handleChangePage}
            />
          </div>
        </div>
      </div>
      {isNewMembershipModal && (
        <NewMembershipModal
          isVisible={isNewMembershipModal}
          mode={modalMode}
          membershipData={selectedMembership}
          onClose={() => {
            setIsNewMembershipModal(false);
            setSelectedMembership(null);
          }}
          onSubmit={() => {
            setIsNewMembershipModal(false);
            setSelectedMembership(null);
            getMembership()
          }}
        />
      )}
    </>
  )
}

export default ActiveMembership