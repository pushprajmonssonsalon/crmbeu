import { useState } from "react";
import NormalSelect from "../customInput/NormalSelect";
import Modal from "../modal/Modal";
import { postApiData } from "../../utils/services";
import toast from "react-hot-toast";

const ApplyMembership = ({ show, setShow, data }) => {
  return (
    <>
      {" "}
      <Modal show={show} setShow={setShow}>
        <ChildComponent data={data} />
      </Modal>
    </>
  );
};

const ChildComponent = ({ closeModal, data,modalRef }) => {
  const [memberShipId, setMemberShipId] = useState("");
  const [membershipCoin, setMembershipCoin] = useState(0);
  const [isMembershipUsed, setIsMembershipUsed] = useState(data?.membershipUsed);

  const [memberShipStatus, setMemberShipStatus] = useState(false);


  // product table state
  const activemember = data?.customer?.activeMembership;
  const membershipPress = (e) => {
    setMemberShipId(e.target.value);
  };

  const applyMemberShip = () => {
    const payload = {
      creditsUsed: 0,
      userId: data?.customer?._id,
      memId: memberShipId,
      isMembershipUsed: !memberShipStatus,
    };

    postApiData(
      "membership/applyMembership",
      payload,
      (resp) => {
        if (resp) {
          if (memberShipStatus) {
            setMembershipCoin(resp?.creditsLeft);
            setMemberShipStatus(false);

            // setSubTotalService(resp.creditsUsed - resp.remainingAmount);
            setIsMembershipUsed(true);
            toast.error("MemberShip Removed sucessfully");
          } else {
            toast.success("MemberShip Applied sucessfully");
            setMembershipCoin(resp?.creditsLeft);
            // setSubTotalService(resp.creditsUsed - resp.remainingAmount);
            setMemberShipStatus(true);
            setIsMembershipUsed(false);
          }
        }
      },
      (error) => {
        
        // alert("Select Correct Options");
        toast.error("Select Correct Options !");
      }
    );
  };

  return (
    <div className="relative m-auto p-4 w-full max-w-full sm:w-fit sm:min-w-[300px] md:min-w-[450px] mx-auto h-full my-auto max-h-full">
      {/* Modal content */}
      <div ref={modalRef} className="slide-in-top relative h-fit max-h-full w-full  my-auto bg-white rounded-lg shadow ">
        {/* Modal header */}
        <div className="flex w-full items-center justify-between p-4 md:p-5 border-b rounded-t ">
          <h3 className="text-lg font-semibold text-gray-900 ">
            Apply MemberShip
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
          <div className="flex gap-3 flex-wrap mt-6 justify-start items-center mb-3">
            <div className="flex  items-center justify-center">
              <h1 className="text-[1.15rem] w-[150px] font-semibold">
                Membership
              </h1>
              <NormalSelect
                name="membership"
                onChange={membershipPress}
                options={activemember?.map((item) => ({
                  name: `${item.name}-${item.creditsLeft}`,
                  value: item._id,
                }))}
                disabled={memberShipStatus ? true : false}
              />
            </div>

            {memberShipStatus ? (
              <button
                onClick={applyMemberShip}
                className="bg-red-600 hover:bg-red-500"
              >
                Remove Membership
              </button>
            ) : (
              <button
                onClick={applyMemberShip}
                className="bg-black hover:bg-gray-800"
              >
                Apply Membership
              </button>
            )}

            <div className="flex ml-6">
              <h3 className="text-lg font-bold text-black">
                BALANCE :{" "}
                <span className="text-green-600 font-bold">
                  {membershipCoin}
                </span>
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ApplyMembership;
