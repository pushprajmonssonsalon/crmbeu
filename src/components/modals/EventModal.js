import { GiPartyPopper } from "react-icons/gi";
import { formatDate, formatDateMonth } from "../../utils/services";
import Modal from "../modal/Modal";
const sortByDateType = (a, b, type) => {
  const getMonthDay = (date) => {
    if (!date) return 9999; // Push empty/null dates to the end
    const d = new Date(date);
    return d.getMonth() * 100 + d.getDate(); // Convert MM-DD into a sortable number
  };

  return getMonthDay(a[type]) - getMonthDay(b[type]); // Sort dynamically by type
};
const EventModal = ({ show, setShow, data, text, onConfirm }) => {
  return (
    <>
      {" "}
      <Modal show={show} setShow={setShow}>
        <ChildComponent data={data} text={text} onConfirm={onConfirm} />
      </Modal>
    </>
  );
};

const ChildComponent = ({ closeModal, data, modalRef, text }) => {
  const sortedData = data?.value?.slice().sort((a, b) => sortByDateType(a, b, data?.type));

  return (
    <div className="relative  mx-auto p-4 w-fit min-w-[300px] md:min-w-[450px] xl:min-w-[700px]  h-full my-[5%]  max-h-full">
      {/* Modal content */}
      <div
        ref={modalRef}
        className="slide-in-top relative h-fit max-h-full w-full  my-auto bg-white rounded-lg shadow "
      >
        {/* Modal header */}
        <div className="flex w-full items-center justify-between p-3  border-b  ">
          <h3 className="text-lg flex items-center gap-1 font-semibold text-gray-900 "><GiPartyPopper size={40} className="0 text-yellow-500" />{data?.key}<GiPartyPopper size={40} className="0 text-yellow-500" />
          </h3>
          <button
            onClick={closeModal}
            type="button"
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center  "
            data-modal-toggle="select-modal"
          >
            <svg
              className="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
        </div>
        {/* Modal body */}
        <div className="max-h-[60vh] py-5 px-3 flex flex-col gap-2 overflow-y-auto ">

          <table className="" >
            <thead>
              <tr >
                <th className="text-sm">S.no</th>
                <th className="text-sm">Name</th>
                <th className="text-sm">Phone Number</th>
                {data?.type === "membership" ? <>
                  <th className="text-sm">Membership</th>
                  <th className="text-sm">Valid To</th>
                </> :
                  <>
                    <th className="text-sm">Birthday</th>
                    <th className="text-sm">Anniversary</th>

                  </>
                }
              </tr>
            </thead>
            <tbody>
              {sortedData?.length > 0 && sortedData?.map((item, index) => (
                <tr key={index}>
                  <td className="text-sm">{index + 1}</td>
                  <td className="text-sm">{item?.name}</td>
                  <td className="text-sm">{item?.phoneNumber}</td>
                  {data?.type === "membership" ? <>
                    <td className="text-sm">{item?.membershipName}</td>
                    <td className="text-sm">{formatDate(item?.validTo)}</td>

                  </> :
                    <>

                      <td className="text-sm">{formatDateMonth(item?.dob)}</td>
                      <td className="text-sm">{formatDateMonth(item?.aniversary)}</td>


                    </>
                  }

                </tr>
              ))}
            </tbody>
          </table>


        </div>
      </div>
    </div>
  );
};
export default EventModal;
