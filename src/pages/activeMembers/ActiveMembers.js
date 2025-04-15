import { useEffect, useState } from "react";
import { getApiCall } from "../../utils/services";
import AccordianTable from "../../components/Table/AccordianTable";
import { AiOutlineSearch } from "react-icons/ai";
import NormalInput from "../../components/customInput/NormalInput";
import { useSearchParams } from "react-router-dom";

const ActiveMembers = () => {
  const [members, setMembers] = useState([]);
  const [searchParams] = useSearchParams()

  const phone = searchParams.get("phone")
  const [phoneNumber, setPhoneNumber] = useState(phone ? phone : "");
  const cols = [
  
    {
      name: "Member Name",
      id: "name",
    },
    {
      name: "Phone Number",
      id: "phoneNumber",
    },
    {
      name:"Details",
      id:"details"
    }
  ];
  const cols2 = [
    {
      name: "Membership Name",
      id: "name",
    },

    {
      name: "Credit Left",
      id: "creditsLeft",
    },
    {
      name: "Joined On",
      id: "createdAt",
      date: true
    },
    {
      name: "Expiring On",
      id: "validTo",
      date: true
    },
  ];

  const data = [
    {
      name: "John Doe",
      email: "johndoe@example.com",
      phone: "123-456-7890",
      details: "Additional details about John Doe...",
    },
    {
      name: "Jane Smith",
      email: "janesmith@example.com",
      phone: "987-654-3210",
      details: "Additional details about Jane Smith...",
    },
    // Add more rows as needed
  ];

  useEffect(() => {
    getApiCall(
      "membership/getTotalActiveMembershipOfUser",
      (res) => {
        setMembers(
          res?.map((elm) => ({
            ...elm,
            activeMembership:
              elm?.activeMembership?.length > 0
                ? elm.activeMembership.map(
                  ({ _id, membershipSaleId, membershipId, ...rest }) => rest
                )
                : [],
          }))
        );
      },
      () => { }
    );
  }, []);
  return (
    <>
      {" "}

      <div className=" rounded-[16px] border border-primaryGray p-5  ">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <h2 className="text-black text-start  font-normal text-[22px] leading-[28px]">Active Members</h2>
            <span className="rounded-[16px] text-xs px-6 border border-gray2">{members?.length} Members</span>


          </div>
            <div className="relative flex items-center">
              <AiOutlineSearch className="absolute text-lg text-lightGray left-[10px]" />
              <NormalInput
                inputStyles={{
                  'width': "280px",
                  borderRadius: "16px",
                  padding: "5px 40px",
                  fontSize: "14px",
                  borderColor: "#D9D9D9"
                }}
                value={phoneNumber}
                placeholder="Search by Phone Number"
                onChange={(e) => setPhoneNumber(e.target.value)} />
            </div>
         
        </div>
        <div className="w-full mt-6">
          <AccordianTable
            cols={cols}
            rows={members}
            cols2={cols2}
            phoneNumber={phoneNumber}
            rows2={members}
          />
        </div>
      </div>

    </>
  );
};

export default ActiveMembers;
