import Modal from "../modal/Modal";
import CustomTable from "../Table/CustomTable";

const ViewServicesModal = ({ show, setShow, data, showQuantityModal = null }) => {
  return (
    <>
      {" "}
      <Modal show={show} setShow={setShow}>
        <ChildComponent data={data} showQuantityModal={showQuantityModal} />
      </Modal>
    </>
  );
};

const ChildComponent = ({ closeModal, data, modalRef, showQuantityModal = null }) => {
  // CRM service rows were written with a misspelled `satffName` for a long
  // time, so old appointments still carry it. Read both, and fall back to the
  // staff object when neither name was stored.
  const getStaffName = (row) =>
    row?.staffName || row?.satffName || row?.staff?.name || "";

  // App bookings are charged `appPrice`; `price` on those rows is the walk-in
  // rate.
  const isAppBooking = data?.appointmentType === "app";
  const getServiceRate = (row) => {
    const rate = isAppBooking ? row?.appPrice ?? row?.price : row?.price;
    return rate ?? "";
  };

  const cols = [
    { name: "Name", id: data?.appointmentType === "crm" ? "miniSubcategory" : "name" },
    { name: "Category", id: "category" },
    { name: "Sub Category", id: "subCategory" },
    { name: "Staff", id: "staffName", get: getStaffName },
    { name: "Price", id: "price", get: getServiceRate },
  ];

  const prodCols = [
    { name: "Name", id: "name" },
    { name: "Price", id: "price" },
    { name: "Brand", id: "brand" },
    { name: "Quantity", id: "quantity" },
    { name: "Staff", id: "staffName", get: getStaffName },
  ];

  const prodQuanCols = [
    { name: "Name", id: "name" },
    { name: "Size", id: "sizeUsed" },
    { name: "Unit", id: "unit" },
    { name: "Item Id", id: "itemId" },

  ];


  const tablesFields = [
    { heading: "Services", rows: data?.services, cols: cols },
    { heading: "Products", rows: data?.products, cols: prodCols },
    { heading: "Product Used", rows: data?.productUsed, cols: prodQuanCols },
  ];

  return (
    <div className="relative m-auto p-4 w-full sm:w-[90%] lg:w-[80%] mx-auto h-full my-auto max-h-full">
      {/* Modal content */}
      <div ref={modalRef} className="slide-in-top relative h-fit max-h-full w-full  my-auto bg-white rounded-lg shadow ">
        {/* Modal header */}

        <div className="flex w-full items-center justify-between p-4 md:p-5 border-b rounded-t ">
          <h3 className="text-lg font-semibold text-gray-900 ">
            Services / Product
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

        <div className="p-4 max-h-[60vh] flex flex-col gap-2 overflow-y-auto md:p-5">
          {showQuantityModal && <div className="text-xl flex items-center justify-end">
            <button onClick={() => showQuantityModal(data?._id, data?.productUsed)} className="text-sm bg-ternary rounded-[16px] px-[27px] py-1 ">Edit Quantity Used</button>
          </div>}
          {tablesFields.map((elm, idx) => {
            const { cols, rows, heading } = elm;

            return (
              rows?.length > 0 ? <div key={idx}>
                <div className="font-medium my-2 text-black text-2xl">
                  {heading}
                </div>
                <CustomTable columns={cols} rows={rows} />
              </div> : null
            )
          })}
        </div>
      </div>
    </div>
  );
};
export default ViewServicesModal;
