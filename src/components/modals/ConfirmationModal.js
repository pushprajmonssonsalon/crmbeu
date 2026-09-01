import Modal from "../modal/Modal";

const ConfirmationModal = ({ show, setShow, data, text, onConfirm }) => {
  return (
    <>
      {" "}
      <Modal show={show} setShow={setShow}>
        <ChildComponent data={data} text={text} onConfirm={onConfirm} />
      </Modal>
    </>
  );
};

const ChildComponent = ({ closeModal, data, modalRef, text, onConfirm }) => {

  return (
    <div className="relative mx-auto p-4 w-full max-w-full sm:w-fit sm:min-w-[300px] md:min-w-[450px] xl:min-w-[700px] h-full my-[5%] max-h-full">
      {/* Modal content */}
      <div
        ref={modalRef}
        className="slide-in-top relative h-fit max-h-full w-full  my-auto bg-white rounded-lg shadow "
      >
        {/* Modal header */}
        <div className="flex w-full items-center justify-between p-3  border-b  ">
          <h3 className="text-lg font-semibold text-gray-900 ">Confirm! </h3>
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
        <div className="max-h-[60vh] py-5 flex flex-col gap-2 overflow-y-auto ">
          {!data ?
            <div className="border border-b py-5 border-gray-200">
              <h2 className="font-semibold text-md  ">{text}</h2>
            </div> :
            <div className="">
            <h2 className="font-semibold text-md  mb-2">{text}</h2>
              {Object.keys(data).map((elm, idx) => {
                return (
                  <div key={idx} className="p-3">
                  <h2 className="font-bold mb-2 text-sm text-start">{elm}</h2>
          <div className="table-responsive">
          <table className="" >
                  <thead>
                    <tr >
                      <th className="text-sm">Name</th>
                      <th className="text-sm">Size</th>
                      <th className="text-sm">Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data[elm]?.map((item, index) => (
                      <tr key={index}>
                        <td className="text-sm">{item?.name}</td>
                        <td className="text-sm">{item?.size}</td>
                        <td className="text-sm">
                          {item?.orderedQuantity}
                        </td>
                       
                      </tr>
                    ))}
                  </tbody>
                </table>
          </div>
                  </div>
                )
              })}


            </div>}
          <div className="flex gap-3 justify-end items-end pt-2 px-3">
            <button className={`bg-red-600 w-[90px] hover:bg-red-500 text-white rounded-md font-bold p-3   `} onClick={closeModal} >Cancel</button>
            <button className={`bg-green-600 w-[90px] hover:bg-green-500 text-white rounded-md font-bold p-3   `} onClick={onConfirm} >Confirm</button>

          </div>
        </div>
      </div>
    </div>
  );
};
export default ConfirmationModal;
